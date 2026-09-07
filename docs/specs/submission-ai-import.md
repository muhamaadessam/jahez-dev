# Spec: AI-ready Submission import

## Problem Statement

When a contributor sends a Submission, the current product creates a GitHub
Review Issue and makes GitHub part of the moderation workflow. This adds an
external dependency to a flow that should be owned by the Node backend and
makes it harder for a Moderator to turn an AI-assisted draft into a safe,
reviewable Interview Question.

## Solution

The Node backend persists the Submission. A Moderator can then copy a bounded
Prompt from that Submission's review card and send it to an external AI agent.
The Prompt asks for one JSON document matching the catalogue's bilingual
question shape, including Topic and related published-question choices. The
Moderator pastes that JSON back into the same review card, previews the
normalized result, and explicitly confirms publication. Confirmation creates
the Submission Revision and public Interview Question as one transaction. GitHub Issues,
GitHub comments, GitHub closing, and product GitHub credentials are removed
from this workflow. Supabase remains accessible only through Node.

## User Stories

1. As an authenticated contributor, I want my Submission saved before any AI
   processing, so that a provider or copy/paste failure cannot lose my work.
2. As a Moderator, I want a ready-to-copy Prompt on each Submission, so that I
   can use an external AI agent with the full catalogue context.
3. As a Moderator, I want the Prompt to include submitted learning material
   but no private identity, so the agent has useful context without account data.
6. As a contributor, I want a clear retry-safe response when the Submission
   already exists, so that resubmitting cannot create duplicate Submissions.
7. As a Moderator, I want to paste the returned JSON into the moderation
   console, so that I can bring an external AI result back into the product.
8. As a Moderator, I want malformed, oversized, incomplete, or unknown JSON
   fields rejected with a stable error, so that invalid content cannot enter
   the catalogue workflow.
9. As a Moderator, I want a normalized preview before confirmation, so that I
   can inspect the final bilingual content and metadata.
10. As a Moderator, I want confirmation to be explicit and repeat-safe, so
    that accidental clicks or retries do not create duplicate revisions.
11. As a Moderator, I want the imported content associated with the original
    Submission, so that contributor attribution and audit history remain
    intact.
12. As a Moderator, I want to continue requesting changes or rejecting a
    Submission without depending on GitHub, so that moderation remains
    available when GitHub is unavailable or removed.
13. As a Moderator, I want confirmation to publish atomically, so a partial
    import cannot leave a half-created Question.
14. As a learner, I want only explicitly published Interview Questions to
    appear in the catalogue, so that an imported draft cannot leak publicly.
15. As an operator, I want GitHub Issue secrets and product GitHub calls
    removed from the deployment contract, so that the product has one fewer
    privileged external integration.
16. As an operator, I want Supabase to remain server-only, so that the browser
    cannot bypass Node authorization or validation.

## Implementation Decisions

- Use the existing Node submission route as the first seam. It validates and
  persists the Submission but never returns the Prompt to a contributor. It
  must not call an AI provider or GitHub.
- Use the existing Node moderation action route as the second seam. Add an
  import-preview operation and an explicit confirm operation behind the
  existing Moderator authorization policy.
- Keep one shared validator/normalizer for the imported JSON. It accepts the
  existing bilingual Interview Question learning shape: Track, Topics,
  Difficulty Level, Arabic and English question content, optional code,
  common mistakes, follow-up questions, and official sources. Identifiers and
  slugs are generated or selected by the backend; the external agent cannot
  choose database identity.
- Treat the pasted JSON as untrusted input. Enforce the existing field
  limits, allowed Track and Topic relationships, source URL rules, supported
  Difficulty Level values, required localized fields, and rejection of
  unknown or structurally invalid values.
- Return a normalized preview without changing publication state. Confirmation
  writes through one database transaction, is idempotent, and creates the
  Submission Revision, Question Revision, locales, Topics, related Questions,
  attribution, audit event, and public publication together.
- Preserve legacy GitHub columns in existing database rows unless a later
  migration proves that dropping them is safe and useful. New code must not
  read or write them for product behavior.
- Remove GitHub Issue creation, search, comments, closing, related frontend
  links, advisory comments, product environment requirements, and stale
  submission/review documentation. Keep GitHub only for source-code hosting
  and engineering issue tracking.
- Keep the Prompt bounded and avoid logging its content. Only authorized
  Moderators may see it through the existing backend policy.

## Testing Decisions

- Test external behavior at the Node route seams rather than implementation
  helpers. Existing submission, moderation, validation, and API test patterns
  are the prior art.
- Verify a successful Submission returns a Prompt containing the allowed
  fields and no email, Clerk ID, auth token, or GitHub URL.
- Verify idempotent Submission retries return the same Submission and Prompt
  without duplicate rows.
- Verify JSON import accepts a valid bilingual document and rejects malformed,
  oversized, incomplete, cross-Track, invalid-source, and unknown-field input.
- Verify preview is read-only, confirmation requires Moderator authorization,
  confirmation is repeat-safe, audit data is written, and publication remains
  explicit.
- Verify changes-requested and rejected flows work without GitHub credentials
  or upstream GitHub calls.
- Run frontend tests, backend tests, release checks, secret scans, and a
  production smoke check for the Node route and static frontend.

## Out of Scope

- Calling OpenAI or any other AI provider from the product.
- Autonomous AI approval, rejection, publication, or moderation.
- Replacing Clerk authentication or changing the Supabase provider.
- Direct browser access to Supabase.
- Redesigning the public static catalogue or community Like/promotion rules.
- Destructive removal of legacy GitHub columns without evidence that existing
  data and rollback safety are unaffected.
- Removing the repository's GitHub hosting or engineering issue tracker.

## Further Notes

The product term remains Submission for contributor input, Review for the
moderation process, Interview Question for catalogue content, and Question
Revision for immutable learning material. “AI-generated question” is not a
new domain entity; it is an external draft imported into the existing Review
workflow.
