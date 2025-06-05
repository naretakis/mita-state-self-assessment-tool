# Changelog

## Overview
This changelog documents the development process of the MITA State Self-Assessment Tool, a modern browser-based application for state Medicaid agencies to assess the maturity of their Medicaid systems using the MITA NextGen capability-based framework.

## [0.2.0] - 2025-06-04 through 2025-06-05

### MITA Framework Enhancements
- Completed the parser utility for MITA capability definitions
- Updated sample provider files with comprehensive content
- Added provider-management.md and provider-termination.md content files
- Enhanced provider-enrollment.md with additional assessment questions and maturity level details

### Code Quality and Formatting
- Implemented comprehensive linting overhaul with ESLint and Prettier
- Added VSCode extensions and settings for consistent development experience
- Fixed duplicate export in markdownParser.ts
- Cleaned up ignore files and build files
- Implemented extensive formatting and linting fixes across the codebase

### Parser Implementation
- Added parseCapabilityMarkdown function to extract structured data from markdown files
- Implemented dimension parsing for ORBIT framework (Outcomes, Roles, Business Processes, Information, Technology)
- Added support for maturity level definitions extraction
- Created utility functions for dimension creation and management

## [0.1.0] - 2025-05-29 through 2025-05-01

### Project Setup and Infrastructure
- Created initial repository structure with Next.js, TypeScript, and React
- Configured GitHub Pages deployment with multi-branch support (main, dev, test)
- Added GitHub Actions workflow for automated deployments
- Set up project documentation in instructions folder
- Implemented .nojekyll file and CNAME configuration for GitHub Pages
- Fixed 404 redirect handling for multi-branch deployment

### Core Framework Implementation
- Implemented CMS Design System integration
- Created base layout components with responsive design
- Added browser storage detection and fallback mechanisms
- Set up TypeScript interfaces for data models
- Implemented Jest testing framework with React Testing Library

### MITA Framework Integration
- Created markdown parser for MITA capability definitions
- Implemented ORBIT dimensions structure (Outcomes, Roles, Business Processes, Information, Technology)
- Added sample provider capability content files (Provider Enrollment, Management, Termination)
- Implemented maturity level definitions (Levels 1-5)

### Development Tools and Optimizations
- Set up ESLint and Prettier for code quality
- Implemented build optimizations for better performance
- Added dynamic imports for code splitting
- Created test utilities for component testing
- Configured Jest for unit, integration, and E2E testing

### Documentation
- Created comprehensive README with project overview
- Added detailed development guide with best practices
- Documented MITA framework structure and assessment approach
- Created data models documentation
- Added assessment workflow documentation

### Bug Fixes and Improvements
- Fixed TypeScript errors in StorageService
- Resolved ESLint configuration issues
- Fixed markdownParser.ts by removing old references
- Improved multi-branch deployment configuration
- Updated package dependencies to resolve vulnerabilities