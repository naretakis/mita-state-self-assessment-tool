# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.2] - 2026-01-25

### Added

- 404 Not Found page for invalid routes within the application
- GitHub Pages SPA redirect support to fix browser refresh on deep links

### Changed

- Renamed `/about` route to `/guide` to avoid conflict with GitHub Pages reserved paths

### Fixed

- Browser refresh on any route now correctly reloads the page instead of showing GitHub's 404
- Fixed infinite scroll issue on Results page when assessments are displayed
- Fixed scroll jumping when selecting domains/areas in Results by Domain section

## [2.0.1] - 2026-01-25

### Fixed

- Navigation now scrolls to top of page when clicking header links
- Assessment dimension sidebar navigation now scrolls content to top when switching dimensions

## [2.0.0] - 2026-01-25

The MITA tool 2.0 release implements the complete ORBIT Maturity Model assessment workflow as defined in the MITA 4.0 framework.

### Features

- **Dashboard**: Hierarchical view of all 14 capability domains and 75 capability areas with progress tracking, status indicators, and tag-based filtering
- **ORBIT Assessment Workflow**: Complete assessment interface for all 52 aspects across 5 dimensions (Outcomes, Roles, Business Architecture, Information & Data, Technology)
- **Maturity Rating**: 5-level maturity scale (Initial → Optimized) plus N/A option, with current level and target level ("To Be") tracking
- **Question Checklists**: Guided assessment questions and evidence tracking per maturity level
- **File Attachments**: Support for PDF, DOC, XLS, and image attachments stored locally in IndexedDB
- **Auto-Save**: Debounced auto-save for seamless editing with notes, barriers, and advancement plans per aspect
- **Assessment History**: Snapshots of finalized assessments for tracking progress over time
- **Results Visualization**: Domain and capability area score breakdowns with dimension-level detail

### Export Capabilities

- **PDF Export**: Professional reports for stakeholder presentations
- **CSV Export**: CMS Maturity Profile standard format for MESH upload
- **JSON Export**: Full data backup for restore or migration
- **ZIP Export**: Complete package with JSON data, PDF report, and all attachments

### Technical Foundation

- Privacy-first architecture: all data stored locally in browser (IndexedDB via Dexie.js)
- Offline-first PWA: full functionality after initial load without network
- WCAG 2.1 AA accessibility compliance for government use
- React 18 with TypeScript strict mode
- Material UI v6 with USWDS-aligned color theme
- Comprehensive test suite with Vitest and React Testing Library
