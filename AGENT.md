# AGENT.md - Notepad Development Guide

## Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run deploy` - Deploy to GitHub Pages

## Architecture
- **Framework**: Astro.js with TypeScript support
- **Styling**: SCSS + TailwindCSS
- **Deployment**: GitHub Pages at `/notepad` base path
- **Storage**: LocalStorage for data persistence
- **Structure**: Component-based architecture with Astro components

## Code Style
- **Files**: Use kebab-case for files (ContextualMenu.astro)
- **Imports**: Relative imports with explicit extensions, group by type (layouts, components)
- **Components**: PascalCase for component names
- **Languages**: Spanish text in UI, English in code/comments
- **Styling**: SCSS modules in `/src/styles/` organized by category (base/, components/, vendors/)
- **Scripts**: Inline scripts using `is:inline` for client-side functionality
- **Conventions**: Use semantic HTML, BEM-like CSS classes, data-attributes for actions

No test framework configured - manual testing required.
