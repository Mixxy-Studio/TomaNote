# Modularization Workflow

This document provides step-by-step instructions for modularizing a component into a self-contained feature.

## Pre-requisites

Before starting, ensure you understand:
- The component's current structure
- All related files (Astro, SCSS, JS, tests, translations)
- Where the component is imported (pages, entry.js)

## Step-by-Step Process

### Phase 1: Analysis

1. **Identify the component to modularize**
   - Get the component name from the user
   - Confirm which files belong to it

2. **Find all related files**
   
   Check these locations:
   
   | Location | What to look for |
   |----------|------------------|
   | `src/components/` | Main component file |
   | `src/components/menu/` | Sub-components |
   | `src/styles/components/` | SCSS files |
   | `src/lib/scripts/ui/` | JS logic |
   | `src/lib/scripts/core/` | Core JS logic |
   | `src/lib/scripts/**/__tests__/` | Test files |
   | `src/locales/` | Translation strings |

3. **Create a file inventory**
   - List all files that will be moved
   - Note their current paths
   - Identify any dependencies between files

### Phase 2: Execution

4. **Create feature directory**
   ```bash
   mkdir -p src/features/[name]
   mkdir -p src/features/[name]/components
   mkdir -p src/features/[name]/__tests__
   mkdir -p src/features/[name]/locales  # if needed
   ```

5. **Move main component**
   - Copy main Astro component to `src/features/[name]/[name].astro`
   - Update imports within the component:
     - Sub-components → `./components/`
     - Styles → `./[name].scss`
     - Icons → `../../components/icons/Icon.astro`

6. **Move sub-components**
   - Copy sub-components to `src/features/[name]/components/`
   - Update their imports:
     - Icon.astro → `../../../components/icons/Icon.astro`
     - Other sub-components → relative paths

7. **Move styles**
   - Copy SCSS to `src/features/[name]/[name].scss`
   - No internal changes needed (paths are class-based)

8. **Move JS logic**
   - Copy JS to `src/features/[name]/[name].js`
   - Update imports to lib modules:
     - From `../utils/` → `../../lib/scripts/utils/`
     - From `../core/` → `../../lib/scripts/core/`

9. **Move tests**
   - Copy test files to `src/features/[name]/__tests__/`
   - Update imports:
     - Import of the module → relative path to `../[name].js`
     - Imports of dependencies → `../../../lib/scripts/`

### Phase 3: Entry Point Updates

10. **Update page imports**
    - Edit `src/pages/index.astro`
    - Change: `import Component from "../components/Component.astro"`
    - To: `import Component from "../features/[name]/[name].astro"`

11. **Update entry.js**
    - If the component has JS logic, update the import path in `src/lib/scripts/entry.js`
    - Change: `import("./ui/component.js")`
    - To: `import("../../features/[name]/[name].js")`

### Phase 4: Verification (CRITICAL)

12. **Run build**
    ```bash
    npm run build
    ```
    - If FAILS: Stop, report error, do not continue

13. **Run tests**
    ```bash
    npm test
    ```
    - If tests FAIL: Stop, report error, do not continue

### Phase 5: Human Verification

14. **Prepare report**
    Create a summary showing:
    - Files moved (old path → new path)
    - Build result
    - Test results

15. **Ask for confirmation**
    Show the human:
    - What changed
    - Verification results
    - Ask: "Do you want me to proceed with the commit?"

16. **Wait for response**
    - If "yes": Proceed to commit
    - If "no": Leave changes unstaged, wait for instructions

### Phase 6: Commit (only after confirmation)

17. **Stage files**
    ```bash
    git add src/features/[name]/ src/pages/index.astro src/lib/scripts/entry.js
    ```

18. **Create commit**
    Use the format:
    ```
    refactor: modularize [Name] as self-contained feature
    
    - Move component to src/features/[name]/
    - Move sub-components to components/ subdirectory
    - Move SCSS styles to feature folder
    - Move JS logic to feature folder
    - Move tests to feature folder
    - Update imports in index.astro and entry.js
    ```

19. **Verify clean state**
    ```bash
    git status
    ```

## Common Issues

### Path Issues
- Check: Do imports use correct relative paths?
- Check: Are Icon.astro imports using `../../components/icons/Icon.astro`?

### Build Failures
- Common cause: Missing imports
- Solution: Review the error, fix imports, rebuild

### Test Failures
- Common cause: Import paths in test files
- Solution: Update mock paths and import paths in tests

## Rollback Plan

If something goes wrong:
1. Keep the new feature directory
2. Restore original files from git
3. Compare what changed
4. Fix issues in the new feature directory
5. Re-verify