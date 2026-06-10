# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [0.4.3] - June 10, 2026

### Added
- All components restructured into src/features/ as self-contained modules: FloatingMenu, ContextualMenu, ModalInfo, CreateTab, CloseTabConfirmation, and Roadmap
- Custom <dialog> element for tab deletion, replacing the native browser confirm()
- ARIA attributes on modals, improved keyboard navigation, screen reader support
- Google Search Console verification meta tag, BreadcrumbList and HowTo schemas, 3 new SEO views, default hreflang set to 'en', AI agent indexing (Google, GPT, Anthropic)
- Floating menu position auto-adjusts based on install mode (PWA vs browser), tablet and mobile display corrections, pasted text preserves its original structure
- All comments and test descriptions translated to English, contextual menu and confirmation modal translation
- Removed outline on [contenteditable]:focus, added global dialog::backdrop, --nav-bottom adjusted to 1rem, removed redundant font styles
- 6 icons added: close button, rocket, file-text, chevron-right, alert, and trash
- New Roadmap tab replacing the News tab, with i18n integration and automated sync from roadmap-data.json
- Scripts for automated roadmap translation sync and CHANGELOG.md generation
- Removed orphaned scripts (roadmap-gen.js), unused roadmap.old-* translation keys, duplicate files deleted

## [0.4.2] - April 1, 2026

### Added
- The native browser confirm() is being phased out, so a custom confirmation modal was implemented, aligned with the app's design.
- The floating menu appeared in different positions between the web version and the installed PWA, so a dynamic script was implemented to calculate the correct position in both contexts.
- Tests cover new and modified features. The tab closing logic was moved to a modular standalone script, and tests were added for the floating menu and tab close confirmation.
- The 'alert' and 'trash' icons were added to provide a clearer representation of the tab closing flow for users.
- The text editor now includes global styles for consistent rendering, especially optimized for content pasted from external web pages.

### Previous Versions

<details>
<summary>[0.4.2] - March 27, 2026</summary>

- Custom modal dialog for tab deletion, replacing deprecated browser confirm()
- Dynamic floating menu positioning, safe area insets support for iOS PWA, virtual keyboard detection, fixed positioning in standalone mode
- Added alert and trash icons
- 19 new tests added for confirmation, tab deletion and floating menu modules. Total: 163 passing tests

</details>

<details>
<summary>[0.4.1] - March 25, 2026</summary>

- Pasted text now inserts at cursor position using Selection API instead of execCommand
- Resolved 7 critical and high severity vulnerabilities (minimatch, rollup, svgo, immutable, ajv, devalue). Regenerated package-lock.json
- Migrated deprecated Sass global functions to modular API (map-get → map.get, etc.)
- Added security scripts and GitHub Action for automated security audits
- Comprehensive tests for paste functionality. Total: 146 passing tests

</details>

<details>
<summary>[0.4.0] - March 24, 2026</summary>

- Floating menu with grouped actions (content, font, tabs)
- Drag & drop tab reordering powered by SortableJS
- Options: Base, Medium, Large
- Support for custom fonts via URL paste
- Full i18n system: English (US) & Spanish (CO)
- Dedicated tabs: About, License, Terms, News, Typography, Appearance, Language
- Complete settings modal redesign and new icons

</details>

<details>
<summary>[0.3.2] - February 4, 2026</summary>

- 7 issues resolved: new tab accessibility, mobile responsiveness, bold formatting, custom font removal, domain persistence, duplicate alerts and Apple warnings
- Vitest framework with jsdom, test suites for ThemeManager, FontManager, TabManager and ContextMenu
- Changed default language from Spanish to English across the interface
- Updated critical dependencies (diff, h3, devalue) and added SECURITY.md policy
- Tree-shaking, minification, removed duplicate listeners and font preconnect

</details>

<details>
<summary>[0.3.0] - December 29, 2025</summary>

- 6 visual styles available to customize the appearance
- Install as application on PC and mobile devices
- Significant improvements for desktop and tablets
- Improvements to increase application visibility

</details>

<details>
<summary>[0.2.2] - December 29, 2025</summary>

- Preview environment prepared for update to version 0.3.0

</details>

<details>
<summary>[0.2.1] - December 17, 2025</summary>

- Minor text adjustments in the information modal
- Security limits added to GitHub Actions workflow
- Deployment automation vulnerabilities fixed

</details>

<details>
<summary>[0.2.0] - December 17, 2025</summary>

- Full project rewrite to improve structure and maintainability
- Significant optimizations in initial loading time
- Scripts organized into independent and reusable modules
- Cleaner code ready for future features

</details>

