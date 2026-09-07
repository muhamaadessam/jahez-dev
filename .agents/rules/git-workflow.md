# Git Workflow and Branching Strategy

## Core Rules
1. **Base Branch**:
   - The primary branch for all ongoing development is `agy`.
   - All tasks must branch off `agy` and merge back into `agy`.

2. **Task Workflow**:
   - **Step 1 - Create Task Branch**: Before starting any task, checkout a new branch named after the task from `agy`:
     ```bash
     git checkout agy
     git pull origin agy
     git checkout -b <task-type>/<task-name>
     ```
     Examples: `feat/fundamentals-track`, `fix/login-flow`, `docs/update-readme`.
   - **Step 2 - Execute and Verify**: Complete the task implementation and run all verification checks (unit tests, types, seed check, build).
   - **Step 3 - Commit**: Commit changes with descriptive conventional commit messages.
   - **Step 4 - Merge into `agy`**: Switch back to `agy`, merge the task branch, and push `agy` to origin:
     ```bash
     git checkout agy
     git merge <task-type>/<task-name>
     git push origin agy
     ```
   - **Step 5 - Cleanup**: Delete the local/remote task branch if no longer needed.
