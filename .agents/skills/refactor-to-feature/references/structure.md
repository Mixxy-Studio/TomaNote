# Feature Structure Reference

This document defines the standard structure for self-contained features in TomaNote.

## Directory Structure

```
src/features/[feature-name]/
├── [feature-name].astro          # REQUIRED: Main component
├── [feature-name].scss           # OPTIONAL: Feature-specific styles
├── [feature-name].js            # OPTIONAL: JS logic (class, utilities)
├── components/                   # OPTIONAL: Sub-components
│   ├── SubComponent1.astro
│   └── SubComponent2.astro
├── __tests__/                    # OPTIONAL: Test files
│   └── [feature-name].test.js
└── locales/                      # OPTIONAL: Translations
    ├── es.json
    └── en.json
```

## File Purposes

### Main Component (`*.astro`)
The entry point component that imports:
- Styles (if any)
- Sub-components
- Other dependencies

Example:
```astro
---
// Styles
import "./feature-name.scss";

// Components
import SubComponent1 from "./components/SubComponent1.astro";
import SubComponent2 from "./components/SubComponent2.astro";
---
```

### Styles (`*.scss`)
Feature-specific styles. Imported by the main component.

### JS Logic (`*.js`)
If the feature has JavaScript behavior, this file contains the class or utility functions. Imported by `src/lib/scripts/entry.js`.

### Sub-components
Smaller components that are only used by this feature. Not shared with other features.

### Tests
Unit tests for the JS logic. Follow naming: `[feature-name].test.js`

### Locales
Feature-specific translations. Only if the feature has unique strings not in the main locale files.

## Naming Conventions

- Feature names: lowercase with hyphens (e.g., `floating-menu`, `roadmap`)
- File names: match feature name
- Component names: PascalCase (e.g., `FloatingMenu.astro` in code)
- Test files: `[feature-name].test.js`

## Import Patterns

### Internal (within feature)
```astro
import SubComponent from "./components/SubComponent.astro";
```

### External (UI primitives)
```astro
import Icon from "../../components/icons/Icon.astro";
```

### External (lib scripts)
```javascript
import { SomeUtil } from "../../lib/scripts/utils/someUtil.js";
```

## Reference

See `workflow.md` for the complete modularization process.
See `exceptions.md` for what NOT to modularize.