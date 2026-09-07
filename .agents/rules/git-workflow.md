# Git Workflow and Branching Strategy (Codex / AGY Style)

## Core Principles
1. **Base Branch**:
   - `main` is the primary production branch and integration target on GitHub.
   - All tasks must branch off `origin/main` and open PRs targeting `main`.

2. **Branch Naming Pattern (Codex / AGY Style)**:
   - Just like Codex uses `codex/<task-name>`, Antigravity tasks must use `agy/<task-name>`:
     - Example: `agy/fundamentals-track`
     - Example: `agy/flutter-internals`
     - Example: `agy/fix-seed-check`

3. **Step-by-Step Task Lifecycle**:
   - **Step 1 - Sync with Main**:
     ```bash
     git checkout main
     git pull origin main
     git checkout -b agy/<task-name>
     ```
   - **Step 2 - Implement & Verify**:
     Run all tests, type checks, seed checks, and release checks:
     ```bash
     npm run release:check
     ```
   - **Step 3 - Commit**:
     Use conventional commit messages (`feat(...)`, `fix(...)`, etc.).
   - **Step 4 - Push to GitHub**:
     ```bash
     git push -u origin agy/<task-name>
     ```
   - **Step 5 - Merge & Clean**:
     - Create a PR from `agy/<task-name>` into `main`.
     - After merging on GitHub (especially if using Squash & Merge), always update local `main` (`git checkout main && git pull origin main`) to avoid ancestor conflict issues.

## Verification Status
- Branch prefix `agy/<task-name>` verified and active.
- Target branch is `main`.

