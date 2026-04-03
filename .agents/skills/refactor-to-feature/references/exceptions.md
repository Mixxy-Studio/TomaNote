# Exceptions - What NOT to Modularize

This document lists component types that should NOT be modularized into features.

## UI Primitives

These remain in `src/components/` or `src/components/icons/`:

- **Icon.astro** - Reusable icon component used everywhere
- Generic buttons (not feature-specific)
- Generic inputs
- Basic containers

**Rationale**: These are shared across multiple features. Modularizing them would create duplication.

## Layouts

Do NOT move:
- `src/layouts/*.astro`

**Rationale**: Layouts are structural components that wrap pages. They are not "features" and should remain separate.

## Pages

Do NOT move:
- `src/pages/**/*.astro`
- `src/pages/**/*.ts`

**Rationale**: Pages are route entry points. They import features but are not features themselves.

## Assets

Do NOT move:
- `src/assets/**/*` - Images, fonts, icons
- `src/styles/**/*` - Global styles (not component-specific)

**Rationale**: Assets are static files that need specific handling (build optimizations, etc.).

## Utilities

Do NOT move:
- `src/lib/scripts/utils/**/*` - Utility functions
- `src/lib/scripts/core/**/*` - Core system logic

**Rationale**: These are shared libraries, not individual feature components.

## Decision Tree

```
Is this component used by multiple features?
├── YES → Keep in src/components/ (UI primitive)
└── NO → Is it a standalone feature (has Astro + SCSS + JS + tests)?
    ├── YES → Modularize to src/features/
    └── NO → Leave where it is
```

## Already Modularized

These features already exist in `src/features/`:
- `roadmap/` - Roadmap feature
- `floating-menu/` - Floating menu feature

## Pattern to Follow

If you need to decide whether to modularize:
1. Check if it's a "feature" with multiple related files
2. Check if it's used only by one part of the app
3. Check if it has its own styles, logic, and tests
4. If all yes → modularize
5. If any no → keep in components/ or leave as-is

## When in Doubt

Ask the human: "Should I modularize this component?" before proceeding.