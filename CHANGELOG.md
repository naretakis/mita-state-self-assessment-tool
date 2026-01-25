# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Debounce hooks (`useDebounce`, `useDebouncedCallback`, `useDebouncedSave`) for optimized text input handling
- Comprehensive WCAG 2.1 AA accessibility improvements across all pages and components:
  - Skip-to-main-content link in Layout for keyboard navigation
  - Proper landmark labels (`aria-label`) on navigation, main content, and footer regions
  - `aria-current="page"` on active navigation items
  - Semantic heading hierarchy (h1, h2, h3) on all pages
  - `role="progressbar"` with `aria-valuenow/min/max` on progress indicators
  - `scope="col"` on all table headers for screen reader navigation
  - `aria-expanded` and `aria-label` on expandable rows and accordion controls
  - `aria-live="polite"` regions for dynamic status announcements (save status, snackbars)
  - Keyboard navigation support on clickable table rows (Enter/Space activation)
  - `aria-labelledby` on dialogs for proper screen reader announcements
  - `aria-hidden="true"` on decorative icons
  - Accessible chart alternatives with `role="img"` and descriptive `aria-label`
  - Focus management in master-detail views (focus moves to detail heading on selection)
- Accessibility testing infrastructure:
  - `eslint-plugin-jsx-a11y` for static accessibility analysis
  - `@axe-core/react` for runtime accessibility testing in development
  - `vitest-axe` for accessibility assertions in unit tests
  - TypeScript declarations for vitest-axe (`src/test/vitest-axe.d.ts`)
- `ACCESSIBILITY_REFACTOR.md` documenting the accessibility audit and remediation plan

### Fixed

- Fixed TypeScript ref type errors in `ResultsMasterDetail.tsx` - changed `RefObject<HTMLHeadingElement | null>` to `RefObject<HTMLHeadingElement>` to satisfy MUI Typography component requirements
- Added explicit return type to `renderLayout` helper function in `Layout.test.tsx` to satisfy ESLint rules
- Added eslint-disable comment for intentional `autoFocus` usage in `AttachmentUpload.tsx` dialog (autoFocus is appropriate UX for dialogs)
- Centralized constants module (`src/constants/index.ts`) with maturity thresholds, UI constants, PDF settings, and dimension IDs
- Utility modules (`src/utils/`) with color utilities (`getScoreColor`, `SCORE_COLORS`) and error handling (`AssessmentError`, `withErrorHandling`)
- PDF export styles module (`src/services/export/pdfStyles.ts`) with centralized styling constants
- `useDebounce.test.ts` - 10 tests for debounce hook functionality
- History View page (`/history/:historyId`) for viewing read-only historical assessment snapshots
- `TagsDisplay` component for compact tag display with overflow handling (shows first N tags with "+X more" tooltip)
- `getDomainTags()` function in `useScores` hook to get aggregated tags for a domain
- "View History" option in `ActionMenu` for assessments with history
- Development standards and best practices documentation
- Scoring service functions (`calculateAverage`, `roundScore`) exported from services barrel
- Comprehensive test coverage for hooks and services:
  - `db.test.ts` - 16 tests for database operations (CRUD, queries, stats)
  - `useTags.test.ts` - 19 tests for tag management
  - `useHistory.test.ts` - 18 tests for assessment history
  - `useCapabilityAssessments.test.ts` - 27 tests for assessment CRUD
  - `useOrbitRatings.test.ts` - 27 tests for ORBIT rating management
  - `useScores.test.ts` - 22 tests for score calculations
  - `useAttachments.test.ts` - 15 tests for file attachment handling
- Test coverage now at 98.3% for hooks, 97.72% for services (232 total tests)
- Comprehensive test coverage for export services:
  - `csvExport.test.ts` - 23 tests for CSV generation and parsing
  - `exportService.test.ts` - 19 tests for JSON/ZIP export functionality
  - `importService.test.ts` - 22 tests for import with merge logic
- Comprehensive test coverage for dashboard components:
  - `ProgressBar.test.tsx` - 14 tests for StackedProgressBar and CapabilityProgressBar
  - `StatusChip.test.tsx` - 7 tests for assessment status display
  - `TagsDisplay.test.tsx` - 9 tests for tag rendering with overflow
  - `HistoryPanel.test.tsx` - 10 tests for history panel functionality
  - `ActionMenu.test.tsx` - 15 tests for capability action menu
- Comprehensive test coverage for results components:
  - `DimensionScoresTable.test.tsx` - 11 tests for dimension scores display
  - `DomainScoresList.test.tsx` - 10 tests for domain navigation list
- Test coverage improved from 19.9% to 34.2% overall (412 total tests)
- New capability service functions: `getDomainsByLayer()`, `getCategoriesByDomainId()`
- Type guards for domain types: `isCategorizedDomain()`, `isStandardDomain()`
- Helper function `getAreasFromDomain()` for unified area access

### Changed

- Redesigned `CapabilityRow` component: replaced expand arrow with info icon tooltip, added dedicated history button for not-started assessments with history
- Updated `DomainTable` to use `TagsDisplay` for compact tag rendering
- Configured Vite build to split vendor chunks for better caching and faster loads:
  - `vendor-mui` (324 KB) - Material UI + Emotion styling
  - `vendor` (509 KB) - React, Chart.js, Dexie, jsPDF, JSZip
  - `index` (219 KB) - Application code
  - Simplified from 5 chunks to 2 vendor chunks to avoid circular dependency warnings
- **Complete rewrite of `capabilities.json`** from MITA 4.0 Capability Reference Model v1.0
  - Now contains 14 domains (was 12) and 75 capability areas (was 42)
  - Added `layer` field to domains (`strategic`, `core`, `support`)
  - Added `topics` array to each capability area
  - Data Management and Technical domains now use nested `categories` structure
- Updated TypeScript types to support new capability schema:
  - Added `CapabilityLayer`, `CapabilityCategory` types
  - Split `CapabilityDomain` into `StandardCapabilityDomain` and `CategorizedCapabilityDomain`
- Updated `DomainTable` component to render category headers for categorized domains
- Updated capabilities service to handle both standard and categorized domains
- Search now includes topics in addition to name and description

### Fixed

- Import service now detects and skips duplicate assessments (same timestamp and score) to prevent false "imported" counts when re-importing the same data
- Applied Prettier formatting to `ImportExport.tsx`, `exportService.ts`, and `pdfExport.ts`
- Removed console.log statements from `ImportExport.tsx` placeholder functions (handleExportPDF, handleExportCSV, handleExportJSON, handleImportJSON)
- Applied Prettier formatting to `CapabilityRow.tsx` to fix code style inconsistency
- Applied Prettier formatting to `AssessmentSidebar.tsx`, `DimensionPage.tsx`, and `Assessment.tsx`
- Added missing exports `getDomainsByLayer()` and `getCategoriesByDomainId()` to services barrel file (`services/index.ts`)
- Suppressed React act() warnings in test setup caused by Dexie's useLiveQuery async state updates
- Synced `vite.config.ts` with `vite.config.js` chunk splitting configuration
- Corrected Technology sub-dimension #6 naming from "Operations and Monitoring" to "Operations and Maintenance" to align with MITA 4.0 Maturity Model gold standard document
  - Updated `orbit-model.json` (id: `operations-maintenance`, name: "Operations and Maintenance")
  - Updated `types/index.ts` (`TechnologySubDimensionId` type)
  - Updated `PROJECT_FOUNDATION.md` documentation
- Fixed Information & Data aspect count in PROJECT_FOUNDATION.md Assessment Flow section (was 10, should be 11)
- Added explicit return types to handler functions in `AttachmentUpload.tsx` and `DimensionPage.tsx` to satisfy ESLint rules
- Removed console.log statements from `Dashboard.tsx` placeholder functions (handleExportAssessment, handleViewHistory)

### Removed

- `StrengthsGaps` component and tests - Strengths & Gaps analysis section removed from Results page
- `getAllCapabilityAreas()` function from capabilities service (use `getAllAreas()` instead)

## [0.1.0] - 2026-01-16

### Added

- Initial project setup with Vite, React 18, TypeScript
- MUI v6 theme configuration
- Basic routing (Home, Dashboard pages)
- Layout component with header and navigation
- PROJECT_FOUNDATION.md with architecture decisions
- GitHub Pages deployment configuration
