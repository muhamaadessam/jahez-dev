# Submission → Review → Publication: end-to-end review

Date: 2026-09-07
Scope: contributor UI, Node API, moderation console, PostgreSQL contracts, public catalogue, production public data, and automated checks.

## Verdict

> Product clarification after this review: the Prompt is intentionally
> Moderator-only. The implemented target is one JSON input per Submission and
> an explicit atomic confirm-and-publish action.

The happy path exists, but the workflow is **not production-safe end to end** yet.

- Authentication, server-only database access, input length checks, bilingual import validation, Moderator authorization, immutable Question Revisions, public visibility checks, and the public database-backed question page are present.
- A minimally valid Submission can be accepted but cannot be published.
- Submission creation, import confirmation, and publication are multi-request writes without a database transaction, so a transient failure can leave partial or duplicated data.
- The documented contributor Prompt hand-off is missing, the changes-requested loop has no contributor side, and the important moderation/publication paths have no behavior tests.
- Production currently exposes 910 public Interview Questions and no Community Interview Questions. The English catalogue content is largely placeholder-quality.

Do not invite real community submissions until the P0 items below are fixed and an actual Submission is exercised through production with a test account and Moderator account.

## Actual workflow today

1. An authenticated Account selects one of its Track Preferences, optionally selects Topics and enrichment fields, accepts CC BY 4.0, and posts to `POST /v1/submissions`.
2. Node validates the payload, checks suspension and Track Preference, performs an exact duplicate advisory against up to 100 Submissions, claims a rate-limit slot, then inserts the Submission, initial Submission Revision, and audit event.
3. The contributor only sees a success message. The API response does not contain the Prompt required by the current spec.
4. A Moderator opens the queue. Node creates the external-AI Prompt while listing Submissions; the Moderator copies it manually.
5. The Moderator pastes bilingual JSON and previews it. Confirmation creates another Submission Revision and marks the Submission `approved`.
6. The Moderator publishes. Node creates an Interview Question, draft Question Revision, two locale rows, Topic links, publishes the Revision, points the Interview Question at it, marks it `community`, links attribution, and finally marks the Submission `published`.
7. The Question Library fetches the database catalogue. A community question appears under Community Questions and its detail page is loaded from Node. At 50 eligible unique Account Likes, PostgreSQL changes its visibility to `public`.

The intended current product flow does **not** use GitHub Issues. `docs/specs/submission-review.md` and `docs/specs/submission-ai-import.md` supersede stale statements in `CONTEXT.md` and `PRODUCT.md`.

## Findings

### P0 — A valid minimal Submission cannot reach publication

Evidence:

- The product and validator allow `topicIds: []`: `src/submissions/validation.ts:72-75,88-113` and the passing browser test submits no Topic in `e2e/submissions.spec.ts`.
- Import confirmation requires imported Topics to equal the original array exactly: `backend/src/moderator-actions.ts:70-74`. A Moderator therefore cannot enrich an empty Topic list.
- Publication skips `question_topics` when the list is empty: `backend/src/moderator-actions.ts:270-277`.
- PostgreSQL correctly rejects a published Interview Question with no Topic: `supabase/migrations/20260830000003_catalogue_contracts.sql:55-91`.

Impact: the advertised minimum form succeeds and enters Review, but can never become a published Interview Question.

Minimum fix: during import, require at least one valid Topic belonging to the Submission Track, but allow the Moderator to replace/enrich the optional submitted Topic list. Compare Topics as a set only when equality is actually required.

### P0 — Publication is not atomic or safely retryable

`publish_submission` performs seven independent REST mutations plus audit (`backend/src/moderator-actions.ts:213-314`). Each request commits separately.

Failure examples:

- Question insert succeeds and Revision insert fails: an orphan Interview Question remains.
- Question, Revision, locales, and Topics succeed but the final pointer or Submission update fails: a retry generates another ID and can leave duplicate or partial catalogue records.
- The Interview Question becomes public-facing but the Submission update fails: the Submission remains `approved`, so the UI invites another publish attempt.
- The audit write can fail after publication and turn a successful publication into a 503 response, encouraging a retry.

The unique `source_submission_id` index limits one final link but does not roll back earlier rows and can make a retry fail after creating more partial rows.

Minimum fix: move the complete publication operation into one server-only PostgreSQL function and call it once from Node. Lock the Submission row, enforce `approved → published`, allocate identity, create all rows, update both pointers, and write the audit event in the same transaction. Return the already-published result on retry.

### P0 — Import confirmation and Submission creation have the same partial-write bug

- New Submission creation inserts the Submission, then its Revision, then its audit event separately: `backend/src/submit-question.ts:125-139`.
- An idempotent retry returns immediately for any existing non-`failed` Submission before checking that Revision/audit creation completed: `backend/src/submit-question.ts:97-101`. The recovery branch at `140-143` is effectively unreachable because this handler never marks a row `failed`.
- Import confirmation inserts a Revision, patches the Submission, then writes audit separately: `backend/src/moderator-actions.ts:78-84`. A failure after Revision insertion creates another Revision on retry.

Impact: the API can report failure after committing part of the operation, and the same idempotency key does not repair that state.

Minimum fix: one transactional database function for initial Submission creation and one for import confirmation. Preserve the existing HTTP endpoints; only replace their internal multi-write sequences.

### P1 — Existing Interview Questions can be reclassified by typing their ID

The console invites an optional “Published question ID” (`src/app/moderator/moderator-console.tsx:145`). If it matches any existing published Interview Question in the same Track with no `source_submission_id`, publication changes that existing question to `community` and overwrites its contributor attribution (`backend/src/moderator-actions.ts:166-176`). It does not verify that the existing Question Revision contains the approved Submission content.

Impact: a typo or reused ID can attach a Submission to unrelated curated content and alter its visibility/attribution.

Minimum fix: do not reuse arbitrary existing questions. Accept an unused ID or auto-generate one; only treat an existing ID as idempotent when `source_submission_id` already equals this Submission.

### P1 — The contributor Prompt hand-off required by the spec is absent

The current spec requires `POST /v1/submissions` to return a bounded Prompt to the contributor (`docs/specs/submission-review.md:3-9,28-35`). The response only contains ID, status, and duplicate advisory (`backend/src/submit-question.ts:146`); `SubmissionResult` has no Prompt (`src/submissions/api.ts:4-9`); the form only renders success (`src/app/submissions/submission-form.tsx:93-96`). The Prompt is generated only for the Moderator list (`backend/src/operations.ts:16-22`).

Impact: the implemented hand-off differs from the accepted product flow and forces all external-AI work onto the Moderator.

Minimum fix: return the already-existing `buildSubmissionPrompt(...)` result from successful and idempotent submission responses, add `prompt` to `SubmissionResult`, and render one copy button after success.

### P1 — “Request changes” is a dead-end state

The Moderator can set `changes_requested`, but there is no Account endpoint/page to list owned Submissions, read `review_notes`, edit a Submission, or create a new Submission Revision. There is also no notification mechanism. `in_review` exists in the enum and filter but has no transition action. Import confirmation can approve almost any non-published state, including `rejected` and `changes_requested` (`backend/src/moderator-actions.ts:75-82`).

Impact: contributors cannot answer requested changes, and invalid state transitions depend on the UI instead of being enforced server-side.

Minimum fix: choose one of two honest flows:

1. Add a small “My Submissions” read + resubmit endpoint and enforce a state-transition table in PostgreSQL; or
2. Remove `changes_requested` and `in_review` from the UI until that loop is implemented.

Given the current product language, option 1 is the expected behavior. Do not add notifications or a workflow engine yet.

### P1 — Duplicate protection does not cover the catalogue

The automatic check only scans the latest 100 non-rejected Submissions in the same Track, requires exact normalized wording, and may ignore an exact duplicate when Topics do not intersect (`backend/src/submit-question.ts:64-78`). It never checks the 910 published Interview Questions. The AI Prompt asks for a semantic catalogue check, but the backend cannot enforce that an external agent actually performed it.

Impact: a rephrased or already-published concept can be approved and published as a second Interview Question.

Minimum fix: add a deterministic exact-normalized check against all published Arabic/English question titles and all active Submissions. Keep semantic judgment with the Moderator; do not add embeddings or another AI service without measured need.

### P1 — Imported content can be approved but still be impossible to publish

`sourceList` accepts an empty array (`src/submissions/validation.ts:77-85`), but PostgreSQL requires at least one source per locale (`supabase/migrations/20260830000003_catalogue_contracts.sql:2-19`). Imported Topic IDs are structurally validated but not checked against current database taxonomy during preview/confirm.

Impact: confirmation can mark a Submission `approved`, then publication fails later with a generic moderation error.

Minimum fix: validate the publication contract at preview/confirm: at least one official HTTPS source per locale, at least one valid same-Track Topic, and a current Track. Return stable field errors before writing a Revision.

### P1 — The English catalogue is placeholder content

Repository measurement over all 910 Interview Questions:

- 910/910 English short answers use `This question checks the core ...`.
- 910/910 English explanations use `Explain ... with its trade-offs ...`.
- 810/910 English question titles use `What should a ... developer know about ...?`.

This is generated centrally by `createEnglishTranslation` in `src/content/questions.ts:1578-1630` and is also present in the production API.

Impact: the product claims bilingual, production-ready content, but the English side is mostly labels and instructions rather than answers. This is a content correctness issue, not a UI polish issue.

Minimum fix: stop generating generic English learning material. Replace it track-by-track with reviewed translations; fail the content check when known template prefixes remain. Do not add a translation subsystem.

### P2 — Critical behavior is untested despite a green release check

There are no direct behavior tests for `handleModerator`, import confirmation, publication, rollback/idempotent retry, state transitions, or the end-to-end Moderator flow. Existing backend tests verify routing/adapters with mocked responses; Playwright covers only anonymous blocking, a mocked submission retry, and rate-limit messages.

The missing tests listed in `docs/specs/submission-ai-import.md:98-115` were not implemented.

Minimum fix: add one database-backed happy-path test and focused failure/retry tests around the three transactional functions. Add one Playwright test covering submit → Moderator import → publish → anonymous catalogue read.

### P2 — Moderator history and promoted-question controls are inconsistent

- The type knows `rejected`, `published`, and `failed`, but the console and backend list only `pending`, `in_review`, `changes_requested`, and `approved` (`src/app/moderator/moderator-console.tsx:11`; `backend/src/moderator-actions.ts:119-125`). Closed history is inaccessible in the console.
- Promoted questions are included in the Moderator community list. The UI offers “Unpublish” whenever `community_unpublished_at` is null, but the backend rejects unpublishing `visibility = public` (`backend/src/moderator-actions.ts:316-325`).

Minimum fix: expose an `all/closed` history filter if operationally needed, and either hide the unpublish control for promoted public questions or define an explicit public-content withdrawal policy.

### P2 — Public library loading over-fetches the whole database catalogue

Every Question Library visit calls `/v1/community/questions`. The backend returns every database-backed `public` and `community` question in the Track (`backend/src/community.ts:35-58`), while the browser discards ordinary public rows and keeps only Community Questions or promoted community-origin rows (`src/app/questions/question-library.tsx:55-82`).

Production currently returns 110 rows for Flutter and 100 for each other Track even though every Track has zero Community Questions.

Minimum fix: make this endpoint return only community-origin questions: `visibility = community OR promoted_at IS NOT NULL`. No pagination abstraction is needed at current volume.

### P2 — Domain documentation contradicts the current spec

`CONTEXT.md` and `PRODUCT.md` still define a GitHub Review Issue as part of every Submission, while the newer Submission specs explicitly remove GitHub from the product workflow. The database also retains now-unused status values/columns (`issue_creating`, `issue_created`, `github_issue_*`, advisory tables), which makes the state model harder to read.

Minimum fix: update the two prose documents now. Leave legacy columns in place until a measured cleanup migration is safe, as the current spec already directs.

## Data and production observations

Public production checks against `https://backend-alpha-topaz-14.vercel.app` on 2026-09-07:

| Track | Published rows returned | Community | Promoted |
|---|---:|---:|---:|
| Flutter | 110 | 0 | 0 |
| Android Native | 100 | 0 | 0 |
| Node.js | 100 | 0 | 0 |
| PHP & Laravel | 100 | 0 | 0 |
| .NET | 100 | 0 | 0 |
| React | 100 | 0 | 0 |
| React Native | 100 | 0 | 0 |
| Software Fundamentals | 100 | 0 | 0 |
| UI / UX Design | 100 | 0 | 0 |
| **Total** | **910** | **0** | **0** |

The health endpoint returned `{"status":"ok"}` and all nine Tracks were available. Protected production Submission rows, moderation history, orphan rows, and audit completeness could not be inspected without an authenticated Account/Moderator session or server database credentials. Before launch, run read-only integrity queries for:

- Submissions missing Revision 1 or `submission_created` audit events.
- `approved`/`published` Submissions whose latest Revision is invalid.
- Interview Questions with no Topic, no valid bilingual locale pair, no source, or no matching published Revision.
- Multiple Interview Questions related to one Submission, orphan draft Questions/Revisions, and mismatches between `submissions.published_question_id` and `interview_questions.source_submission_id`.
- Invalid status/metadata combinations and stale `pending`/`approved` rows.

## Checks run

- `npm run release:check`: passed outside the filesystem/network sandbox. Backend 31/31 tests passed; frontend/unit 58/58 passed; type checks, build, seed consistency, secret scan, and diff check passed.
- `npx playwright test e2e/submissions.spec.ts`: 4/4 passed.
- Production public smoke: health, Tracks, and per-Track community catalogue reads passed.
- Working tree was restored after Next changed its generated `next-env.d.ts`; this review leaves no code changes besides this report.

## Recommended order of work

1. **Atomicity and publishability:** transactional database functions for create/import/publish; require publishable Topics and sources; block arbitrary existing-ID reuse.
2. **State contract:** enforce allowed transitions and either complete or remove the changes-requested loop.
3. **Spec parity:** return/copy the contributor Prompt; add catalogue-aware duplicate advisory.
4. **Proof:** database-backed failure/retry tests plus one complete Playwright journey.
5. **Content/data:** replace placeholder English content, then clean documentation and over-fetching.

Ponytail boundary: no queue, workflow engine, embeddings, autonomous AI moderation, or new dependency is justified. PostgreSQL transactions, the existing validator, the existing Prompt builder, and a handful of behavior tests are sufficient.
