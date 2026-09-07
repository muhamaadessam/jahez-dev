# Spec: Submission to Review

The Node backend is the only application seam for Submissions and Review.
After validation and persistence, the Moderator-only review card exposes a
bounded Prompt for an external AI agent. The Moderator pastes the resulting
bilingual JSON into that same Submission card, previews it, then explicitly
confirms publication. Confirmation creates the Submission Revision and public
Interview Question in one transaction.

PostgreSQL remains the Submission and Question Revision source of truth. Clerk
identity and Moderator authorization remain server-owned. GitHub Issues,
comments, closing, and GitHub credentials are not part of the product flow.
Supabase remains storage accessed only by Node.

## Safety

- Persist before review; retries remain idempotent.
- Treat both Submission text and pasted JSON as untrusted input.
- Exclude email, Clerk IDs, tokens, and private Account data from Prompts.
- Enforce Track/Topic relationships, bilingual required fields, source URL
  rules, and existing content limits at the Node boundary.
- Preview is read-only; confirmation is authorized, audited, repeat-safe, and
  publishes atomically.
- Legacy GitHub columns may remain for existing rows, but new product code does
  not read or write them.

## Acceptance checks

- Only Moderators can read or copy the Prompt.
- Duplicate idempotency keys do not create duplicate Submissions or revisions.
- Valid bilingual JSON previews and confirms; malformed or unsafe JSON fails
  with a stable error.
- Changes requested, rejection, and atomic import-and-publication work without
  GitHub secrets or upstream GitHub calls.
- Browser bundles contain no Supabase credentials or product GitHub secrets.
