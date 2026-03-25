# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.4.1](https://github.com/Mixxy-Studio/TomaNote/compare/v0.4.0...v0.4.1) (2026-03-25)

Bug fixes, security updates & maintainability improvements

## 🐛 Bug Fixes

- Fix #25: Paste text now inserts at cursor position in floating menu
- Update paste functionality to use Selection API instead of execCommand

## 🛡️ Security

- Fix #17-24: Resolve 7 critical and high security vulnerabilities
- Regenerate package-lock.json to unblock Dependabot
- Resolve minimatch, rollup, svgo, immutable, ajv, devalue vulnerabilities

## 🔧 Code Quality

- Fix #16: Migrate deprecated Sass global functions to modular API
- Replace map-get, map-has-key, map-keys with map.get, map.has-key, map.keys

## ⚙️ Development Automation

- Add security scripts: security:check, security:fix, security:outdated
- Create GitHub Action for automated security audits (informative only)
- Improve test coverage and prevent regressions

## 🧪 Testing

- Add comprehensive tests for paste functionality with Selection API
- Update contextMenu tests for new paste behavior
- All 146 tests passing

---

### [0.4.0](https://github.com/camiicode/TomaNote/compare/v0.3.2...v0.4.0) (2026-03-24)

Major modular redesign & internationalization

## 🆕 New Features

- Floating menu with grouped tool actions (content, font, tabs)
- Drag & drop tab reordering powered by SortableJS
- Font size selector: Base, Medium, Large
- Custom Google Fonts support via URL paste
- Full i18n system: English (US) & Spanish (CO)
- Settings modal with dedicated tabs: About, License, Terms, News, Typography, Appearance, Language
- EmptyState component for better UX

## 🎨 Design & UX

- Complete modal settings redesign
- New icons: close, rocket, file-text, chevron-right
- Icon component refactor with centralized SVG library
- Responsive improvements for tablet and mobile views

## 🧪 Testing

- Add 21 tests for SettingsModal module
- Add comprehensive tests for i18n core
- Add tests for floating menu, tabs, keyboard shortcuts, tab drag & drop
- Expand FontManager test coverage

## 🔧 Code Quality

- Modular architecture for floating menu components
- TypeScript declarations for window.i18n
- Astro cache folder (.astro) removed from git tracking
- Improved SASS mixins and variables organization

---

### [0.3.2](https://github.com/camiicode/TomaNote/compare/v0.3.1...v0.3.2) (2026-02-04)

Major stability & UX improvements

## 🐛 Critical Bug Fixes (7 Issues Resolved)

- Fix #9: New tab button accessibility - redesigned as floating action button
- Fix #7: Mobile modal responsiveness issues resolved
- Fix #10: Bold formatting inconsistency and reliability
- Fix #8: Custom font removal and reset functionality
- Fix #5: Custom domain persistence through GitHub Pages deployments
- Fix #6: Duplicate confirmation alerts when closing tabs
- Fix #12: Deprecated Apple meta tag warnings

## 🧪 Testing Infrastructure

- Add comprehensive Vitest testing framework with jsdom
- Implement test suites for ThemeManager, FontManager, TabManager, ContextMenu
- Centralize test organization in dedicated **tests** directories

## 🔧 Code Quality & Standards

- Implement Prettier configuration with custom formatting rules
- Update ESLint SASS configuration for V3.0.0+ compatibility
- Remove debug logs and improve code organization
- Enhance Astro configuration with production optimizations

## 🌐 Internationalization

- Change default language from Spanish to English
- Update UI labels and default tab names to English
- Improve accessibility with proper element labeling

## 🛡️ Security Updates

- Update critical dependencies (diff, h3, devalue) via Dependabot
- Add SECURITY.md policy documentation
- Enhance build security with console removal in production

## 📱 Performance & UX

- Optimize build performance with tree-shaking and minification
- Improve mobile experience across all interactive elements
- Remove duplicate event listeners to prevent memory leaks
- Enhance font loading with Google Fonts preconnect

### [0.3.1](https://github.com/camiicode/notepad/compare/v0.3.0...v0.3.1) (2025-12-29)

## [0.3.0](https://github.com/camiicode/notepad/compare/v0.2.2...v0.3.0) (2025-12-29)

###### ✨ Nuevas funcionalidades

- Selector de temas con **6 estilos visuales** disponibles.
- Soporte para **instalación como aplicación (PWA)** en PC y dispositivos móviles.

###### 🎨 Mejoras de diseño y UX

- Rediseño significativo del aplicativo para **desktop y tablets**.
- Ajustes en la paleta de colores del tema por defecto para una experiencia más amable y consistente.

###### 🚀 Optimización

- Mejoras en **SEO** para aumentar la visibilidad y alcance del aplicativo.

### [0.2.2](https://github.com/camiicode/notepad/compare/v0.2.1...v0.2.2) (2025-12-29)

- Se prepara el entorno de preview para actualziaciona version 0.3.0

### 0.2.1 (2025-12-17)

- Ajustes menores de texto en el modal de información.
- chore(ci): agregar límites de seguridad al flujo de trabajo de GitHub Actions
- Vulnerabilidades en automatizacion de despligue corregidos

### 0.2.0 (2025-12-17)

- Se refactoriza el proyecto por completo
- Velocidad de carga
- Modularizacion de scripts
- Mejor mantenibilidad y adicion de futuras feature
