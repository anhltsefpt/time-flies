---
name: smart-commit
description: Analyze uncommitted changes, group related files into focused commits, present plan for approval, then execute. Invoke via /smart-commit.
user_invocable: true
---

# Smart Commit

Analyze all uncommitted changes, group them into small focused commits by feature/domain, present the plan for user approval, then execute sequentially.

## Commit Convention

- Format: `[prefix] Message` — match existing repo style
- Prefixes:
  - `[f]` feature / new functionality
  - `[x]` fix / bug fix
  - `[r]` refactor / code restructuring
  - `[c]` chore / dependencies / config
  - `[i]` i18n / localization
  - `[s]` style / UI-only changes
- Every commit MUST include the trailer:
  ```
  Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
  ```
- Use HEREDOC syntax for commit messages to preserve formatting

## Procedure

### Step 1 — Pre-flight Checks

Run these commands in parallel:

```bash
git status --porcelain
```
```bash
git diff --stat
```
```bash
git diff --cached --stat
```

**Edge cases — handle before proceeding:**

| Condition | Action |
|-----------|--------|
| Clean working tree (no output) | Tell user "Nothing to commit" and stop |
| Merge conflicts (`UU` in status) | Tell user to resolve conflicts first and stop |
| Staged files exist (`--cached` has output) | Ask user: commit staged files separately, unstage them, or include in grouping |
| Sensitive files (`.env`, `credentials`, `*.key`, `*.pem`, `*.secret`) | Warn user, exclude from all commits |
| Build artifacts (`*.ipa`, `*.apk`, `*.aab`, `build/`, `dist/`) | Silently exclude, mention in summary |

### Step 2 — Analyze Changes

For each changed file from `git status --porcelain`:

1. Read the diff with `git diff -- <filepath>` (or `git diff HEAD -- <filepath>` for staged)
2. Classify by:
   - **Domain**: which feature area (Events, Settings, Home, Navigation, Auth, etc.)
   - **Layer**: screen / component / util / type / config / asset / i18n
   - **Change type**: new feature, enhancement, fix, refactor, style, chore

### Step 3 — Group into Commits

Apply these grouping rules in priority order:

1. **Dependency commits**: `package.json` + `package-lock.json` (or `yarn.lock`, `bun.lockb`) always together → prefix `[c]`
2. **Type definitions** group with their primary consumers (the screen/component that uses those types)
3. **Utils** group with consumers when the util change was made to support the consumer change
4. **Screen + components** group by feature domain:
   - e.g. `events.tsx` + `EventCard.tsx` + `EventModal.tsx` + `EventEmptyState.tsx` = one Events commit
   - e.g. `settings.tsx` + related types = one Settings commit
5. **Pure i18n** changes (only translation strings, no logic) get their own `[i]` commit
6. **Standalone files** that don't fit any group become individual commits

**Constraints:**
- Target **1–4 commits** total. Avoid over-splitting.
- If in doubt, merge groups rather than split them
- Order commits logically: dependencies first, then types/utils, then features

### Step 4 — Present Plan

Display the commit plan as a numbered list:

```
Proposed commits:

1. [c] Update dependencies
   Files: package.json, package-lock.json

2. [f] Improve Settings screen and types
   Files: app/(tabs)/settings.tsx, types/index.ts, utils/time.ts

3. [f] Add Events i18n and component updates
   Files: app/(tabs)/events.tsx, components/EventCard.tsx, ...
```

For each commit show:
- The full commit message (with prefix)
- All files that will be included
- Brief rationale for the grouping

Then ask: **"Proceed with these commits, or would you like to adjust the grouping?"**

**Do NOT execute any commits until user explicitly approves.**

### Step 5 — Execute Commits

For each commit group, in order:

```bash
# 1. Clean staging area
git reset HEAD

# 2. Stage only this group's files (explicit paths, NEVER use -A or .)
git add path/to/file1 path/to/file2

# 3. Commit with HEREDOC
git commit -m "$(cat <<'EOF'
[prefix] Commit message here

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```

**Safety rules:**
- NEVER use `git add -A` or `git add .`
- Always use explicit file paths in `git add`
- Run `git reset HEAD` before staging each group to prevent file bleed between commits
- If any commit fails, stop immediately, show the error, and ask user how to proceed

### Step 6 — Push & Summary

After all commits succeed:

1. Push to remote:
```bash
git push
```

2. Show log:
```bash
git log --oneline -n <number_of_commits_made>
```

3. Confirm: "All X commits created and pushed successfully."

If push fails, show the error and ask user how to proceed.

If any files were excluded (artifacts, sensitive), remind user about them.
