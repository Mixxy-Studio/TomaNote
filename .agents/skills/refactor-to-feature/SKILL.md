---
name: refactor-to-feature
description: Modularize components into self-contained features. Transform components from src/components/, src/styles/, and src/lib/scripts/ into a structured feature in src/features/[name]/ with Astro component, SCSS styles, JS logic, tests, and optional locales. Verify build and tests BEFORE asking human for commit confirmation. Always wait for human verification BEFORE committing.
---

# Refactor to Feature

This skill modularizes components into self-contained "feature" directories following a consistent structure. It ensures all related files (component, styles, logic, tests, locales) are grouped together for better maintainability.

## When to Use

Use this skill when the user requests:
- "modularize [component]"
- "refactor to feature"
- "move to src/features/"
- "convert to self-contained component"
- Any similar restructuring request

## Target Structure

```
src/features/[feature-name]/
├── [feature-name].astro          # Main component
├── [feature-name].scss           # Feature-specific styles
├── [feature-name].js             # JS logic (if applicable)
├── components/                   # Sub-components
│   ├── SubComponent1.astro
│   └── SubComponent2.astro
├── __tests__/                    # Test files
│   └── [feature-name].test.js
└── locales/                      # Translations (optional)
    ├── es.json
    └── en.json
```

## Exceptions - Do NOT Modularize

- **UI Primitives**: Icon.astro, generic buttons, inputs, basic UI elements
- **Layouts**: Files in src/layouts/
- **Pages**: Files in src/pages/
- **Assets**: Images, fonts, icons in src/assets/

These should remain in src/components/ or their original locations.

## Workflow

### Step 0: PROPOSE PLAN (BEFORE ANY CHANGES)

**CRITICAL**: Before executing any changes, ALWAYS propose a plan to the human.

1. **Analyze the component** - Identify all files related to the component:
   - Main Astro component in src/components/
   - Sub-components in src/components/menu/ or src/components/subfolder/
   - SCSS styles in src/styles/components/
   - JS logic in src/lib/scripts/ (check ui/, core/, utils/)
   - Tests in src/lib/scripts/**/__tests__/
   - Translations in src/locales/

2. **List the files** - Show the current paths and proposed new paths

3. **Show estimated structure** - Display the proposed feature directory structure

Example of what to show the human:
```
📋 Plan for modularizing [ComponentName]:

Current files identified:
- src/components/ContextualMenu.astro
- src/components/menu/contextual/ContextMenuItem.astro
- src/components/menu/contextual/ContextMenuSeparator.astro
- src/lib/scripts/ui/contextMenu.js
- src/lib/scripts/ui/__tests__/contextMenu.test.js

Proposed structure:
src/features/contextual-menu/
├── contextual-menu.astro
├── contextual-menu.js
├── components/
│   ├── ContextMenuItem.astro
│   └── ContextMenuSeparator.astro
└── __tests__/
    └── contextual-menu.test.js

Entry points to update:
- src/pages/index.astro (import)
- src/lib/scripts/entry.js (JS init)

🔍 Do you want me to proceed with this plan? (yes/no)
```

**WAIT for human approval BEFORE proceeding to Step 1.**
If the human says "no" or "not this way", wait for their instructions.
If the human says "yes" or "proceed", continue with the modularization.

### Step 1: Analyze Component

Identify ALL files related to the component:
- Main Astro component in src/components/
- Sub-components in src/components/[name]/ or src/components/menu/
- SCSS styles in src/styles/components/
- JS logic in src/lib/scripts/ (check ui/, core/, utils/)
- Tests in src/lib/scripts/**/__tests__/
- Translations in src/locales/

### Step 2: Create Feature Structure

Create directory: `src/features/[feature-name]/`
Create subdirectories: `components/`, `__tests__/`, `locales/` (as needed)

### Step 3: Move and Update Files

For each file:
1. Move to appropriate location in feature directory
2. Update internal imports to use correct relative paths
3. Update imports from external dependencies (Icon.astro, etc.)

**Critical**: Update imports in:
- Main component (imports to sub-components, styles, locales)
- Sub-components (imports to Icon.astro and other components)
- JS logic files (imports to other lib modules)
- Test files (imports to the JS module under test and its dependencies)

### Step 4: Update Entry Points

Update imports in files that use the component:
- `src/pages/index.astro` - Main page imports
- `src/lib/scripts/entry.js` - JavaScript initialization
- Any other files that import the component

### Step 5: VERIFY (CRITICAL - DO NOT SKIP)

**MUST verify BEFORE asking for human confirmation:**

1. Run build: `npm run build`
   - If build FAILS: Report error, STOP, do NOT continue
   
2. Run tests: `npm test`
   - If tests FAIL: Report error, STOP, do NOT continue

If either fails, report the error and do NOT proceed to commit.

### Step 6: Report to Human

Show the human:
- List of files moved/modified
- Build result (pass/fail)
- Test results (pass/fail with count)

Then ASK for confirmation:
```
✅ Modularization of [Name] completed

📁 Files moved:
- src/components/X.astro → src/features/x/x.astro
- ...

🔧 Verification:
- ✅ Build: OK
- ✅ Tests: 200 passed

⚠️ Do you want me to proceed with the commit? (yes/no)
```

### Step 7: Wait for Confirmation

**CRITICAL**: Wait for human confirmation before committing. Do NOT auto-commit.

If human says "yes" or "proceed" → Create commit with descriptive message
If human says "no" or "not now" → Do NOT commit, leave changes unstaged

### Step 8: Cleanup (after successful commit)

Remove old files only after confirming the feature works:
- Original component files from src/components/
- Original styles from src/styles/components/
- Original JS from src/lib/scripts/

## Commit Message Format

Use this format:
```
refactor: modularize [ComponentName] as self-contained feature

- Move component to src/features/[name]/
- Move sub-components to components/ subdirectory
- Move SCSS styles to feature folder
- Move JS logic to feature folder
- Move tests to feature folder
- Update imports in index.astro and entry.js
- Fix test import paths for new location
```

## Verification Checklist

Before asking human for confirmation:
- [ ] All related files identified
- [ ] Files moved to correct locations
- [ ] Internal imports updated
- [ ] Entry point imports updated
- [ ] Build passes (`npm run build`)
- [ ] Tests pass (`npm test`)
- [ ] Report prepared for human

## Error Handling

If verification fails:
1. Report which step failed
2. Show the error message
3. Explain what needs to be fixed
4. Do NOT proceed to commit
5. Wait for human instructions