---
name: git-workflow
description: Fundamental git workflow rules for safe collaboration. NEVER commit without human confirmation. Always show diffs before committing. Verify with user before destructive commands.
---

# Git Workflow Rules

This skill establishes fundamental rules for working with git in a collaborative environment.

## Golden Rule

**NEVER commit without explicit human confirmation.**

This applies to:
- `git commit`
- `git push`
- `git merge`
- Any command that modifies git history

If you commit without asking, you have violated the workflow. Always ask first.

## Before Any Commit

1. **Show the status**: Run `git status`
2. **Show the diff**: Run `git diff` and/or `git diff --staged`
3. **Ask for confirmation**: "Can I proceed with this commit? (yes/no)"

**Wait for explicit "yes" before executing the commit command.**

## Confirmation Phrases

Use these as reference:

**Human says "yes" / "proceed" / "go ahead"** → Safe to commit

**Human says "no" / "not now" / "wait"** → Do NOT commit

**Human asks to see diff** → Show the diff first

**Human asks to revert** → Ask which files and how

## After Verification Fails

If tests or build fail:
1. Report the error to the human
2. Do NOT commit
3. Wait for human instructions on how to proceed

Example:
```
🔧 Verification failed:
- Build: FAILED (error message)
- Tests: 5 failed

⚠️ I will NOT commit until this is fixed. What would you like me to do?
```

## Commands That Require Confirmation

These **MUST** be confirmed by human before execution:

| Command | Why |
|---------|-----|
| `git commit -m "..."` | Modifies history |
| `git push` | Publishes changes |
| `git merge` | Integrates branches |
| `git rebase` | Rewrites history |
| `git reset --hard` | Destructive, loses work |
| `git push --force` | Can overwrite remote |
| `git stash drop` | Permanently deletes stash |

## Commands That Are OK Without Confirmation

These are safe to run without asking (informational):

| Command | Why |
|---------|-----|
| `git status` | Read-only |
| `git diff` | Read-only |
| `git diff --staged` | Read-only |
| `git log` | Read-only |
| `git show` | Read-only |
| `git branch` | Read-only |
| `git branch -a` | Read-only |
| `git checkout` (without -b) | Read-only |

## Special Workflows

### Refactoring / Modularization

When refactoring code using `refactor-to-feature` skill:
1. Follow the skill's Step 0: Propose Plan
2. Wait for human to approve the plan
3. Execute the changes
4. Verify build and tests
5. Show final diff
6. Ask: "Can I proceed with this commit?"

### Large Changes

For significant changes (many files, complex refactors):
1. Show summary of changes first
2. Ask if they want to see specific diffs
3. Get approval for each major section if needed
4. Commit only after full approval

### Fixing Errors

If something goes wrong:
1. Report what happened
2. Ask: "Should I try to fix this or wait for your instructions?"
3. Do not auto-commit "fix" without approval

## When in Doubt

Always ask the human instead of assuming:

- "Should I commit this?"
- "Is this change correct?"
- "Do you want to review the diff first?"
- "Should I continue or wait?"

It is better to ask too many questions than to assume wrong.

## Summary

1. **Never commit without asking**
2. **Always show diff before committing**
3. **Wait for "yes" explicitly**
4. **If tests fail, do not commit**
5. **Ask when uncertain**

This ensures the human stays in control of the project's history.