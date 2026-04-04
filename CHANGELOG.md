# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [0.4.3] - April 14, 2026

### Added
- New API to create and share custom plugins
- Completely redesigned interface with real-time metrics
- Now the app works offline and can be installed as a native app
- Automatic synchronization with repositories and issues
- WCAG 2.1 level AA compliance

## [0.4.2] - March 31, 2026

### Added
- Initial load optimization reducing response time by 40%
- Complete dark mode implementation with customizable color palette
- Over 15 bugs reported by the community have been fixed

### Previous Versions

<details>
<summary>[0.4.2] - March 26, 2026</summary>

- Custom modal dialog for tab deletion, replacing deprecated browser confirm()
- Dynamic floating menu positioning, safe area insets support for iOS PWA, virtual keyboard detection, fixed positioning in standalone mode
- Added alert and trash icons
- 19 new tests added for confirmation, tab deletion and floating menu modules. Total: 163 passing tests

</details>

<details>
<summary>[0.4.1] - March 24, 2026</summary>

- Pasted text now inserts at cursor position using Selection API instead of execCommand
- Resolved 7 critical and high severity vulnerabilities (minimatch, rollup, svgo, immutable, ajv, devalue). Regenerated package-lock.json
- Migrated deprecated Sass global functions to modular API (map-get → map.get, etc.)
- Added security scripts and GitHub Action for automated security audits
- Comprehensive tests for paste functionality. Total: 146 passing tests

</details>

<details>
<summary>[0.4.0] - March 23, 2026</summary>

- Floating menu with grouped actions (content, font, tabs)
- Drag & drop tab reordering powered by SortableJS
- Options: Base, Medium, Large
- Support for custom fonts via URL paste
- Full i18n system: English (US) & Spanish (CO)
- Dedicated tabs: About, License, Terms, News, Typography, Appearance, Language
- Complete settings modal redesign and new icons

</details>

<details>
<summary>[0.3.2] - February 3, 2026</summary>

- 7 issues resolved: new tab accessibility, mobile responsiveness, bold formatting, custom font removal, domain persistence, duplicate alerts and Apple warnings
- Vitest framework with jsdom, test suites for ThemeManager, FontManager, TabManager and ContextMenu
- Changed default language from Spanish to English across the interface
- Updated critical dependencies (diff, h3, devalue) and added SECURITY.md policy
- Tree-shaking, minification, removed duplicate listeners and font preconnect

</details>

<details>
<summary>[0.3.0] - December 28, 2025</summary>

- 6 visual styles available to customize the appearance
- Install as application on PC and mobile devices
- Significant improvements for desktop and tablets
- Improvements to increase application visibility

</details>

<details>
<summary>[0.2.2] - December 28, 2025</summary>

- Preview environment prepared for update to version 0.3.0

</details>

<details>
<summary>[0.2.1] - December 16, 2025</summary>

- Minor text adjustments in the information modal
- Security limits added to GitHub Actions workflow
- Deployment automation vulnerabilities fixed

</details>

<details>
<summary>[0.2.0] - December 16, 2025</summary>

- Full project rewrite to improve structure and maintainability
- Significant optimizations in initial loading time
- Scripts organized into independent and reusable modules
- Cleaner code ready for future features

</details>

