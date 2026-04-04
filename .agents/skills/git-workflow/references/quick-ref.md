# Git Workflow Reference Guide

Quick reference for following the git-workflow skill.

## Confirmation Template

When asking for commit confirmation, use this format:

```
📦 Changes ready to commit:

Files changed:
- src/components/Foo.astro (modified)
- src/features/foo/ (new)

🔍 Verification:
- ✅ Build: OK
- ✅ Tests: 200 passed

⚠️ Can I proceed with this commit? (yes/no)
```

## Diff Commands

Use these to show changes:

```bash
# Show unstaged changes
git diff

# Show staged changes  
git diff --staged

# Show specific file
git diff path/to/file

# Show summary
git status
```

## Handling "No"

If human says "no" or "not now":
1. Do NOT commit
2. Ask: "What would you like me to fix or change?"
3. Wait for instructions

## Handling "Yes"

If human says "yes" or "proceed":
1. Stage the files: `git add ...`
2. Commit with descriptive message
3. Verify with `git status`

## Common Mistakes to Avoid

| Mistake | Why It's Wrong |
|---------|----------------|
| Auto-committing after tests pass | Human might want to review first |
| Skipping diff review | Human might miss important changes |
| Committing without asking | Violates the golden rule |
| Pushing without confirmation | Remote is affected |

## Quick Checklist

Before every commit:
- [ ] Run `git status`
- [ ] Run `git diff`
- [ ] Show verification results (build/tests)
- [ ] Ask for confirmation
- [ ] Wait for "yes"