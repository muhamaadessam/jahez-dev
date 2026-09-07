## Agent skills

### Issue tracker

Issues are tracked in GitHub Issues. See `docs/agents/issue-tracker.md`.

### Triage labels

The default five-role triage vocabulary is used. See `docs/agents/triage-labels.md`.

### Domain docs

This is a single-context repository. See `docs/agents/domain.md`.

### Git Workflow & Branching Strategy (Codex / AGY Style)

- **Base Branch**: `main` is the primary production branch.
- **Task Branches**: Like Codex (`codex/<task-name>`), every Antigravity task uses a dedicated branch prefixed with `agy/`: `agy/<task-name>` (e.g. `agy/flutter-expansion`).
- **Sync with Main**: Always branch off the latest `origin/main` (`git checkout main && git pull origin main`).
- **Verification & Push**: Run all checks (`npm run release:check`), commit changes cleanly, and push the branch to GitHub (`git push -u origin agy/<task-name>`).
- **Merge**: Target PRs to `main`. After merging on GitHub, update local `main` to prevent squash-merge divergence.


<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
