# MITA State Self-Assessment Tool - Prompt Library

## Introduction

This document provides a collection of effective prompts for Amazon Q Developer to assist with implementing the MITA State Self-Assessment Tool. These prompts are organized by development phase to help you leverage AI assistance effectively throughout the project lifecycle.

## How to Use This Library

1. **Provide Context**: Always reference the project documentation in your prompts
2. **Be Specific**: Include details about the desired outcome
3. **Request Explanations**: Ask Amazon Q to explain its code and reasoning
4. **Iterate**: Refine prompts based on initial responses

## Development Phase 1: Project Setup and Configuration ✅COMPLETED

### Phase 1 Completion Summary

All items in Development Phase 1 have been successfully completed. The project has a solid foundation with:

- Well-structured repository following Next.js and TypeScript best practices
- Configured GitHub Pages deployment with multi-branch support
- Comprehensive package.json with all required dependencies
- Testing framework with Jest and React Testing Library
- Optimized build configuration with code splitting and caching strategies

### Repository Structure Setup ✅DONE

```
I'm building the MITA State Self-Assessment Tool as described in instructions/index.md and following the Development Guide in instructions/development_guide.md. I'll be providing additional prompts for each part of the development, but for now, please help me set up the initial folder structure for a Next.js project with TypeScript following the architecture outlined in instructions/architecture.md and the Development Guide in instructions/development_guide.md. Include appropriate configuration files for Next.js, TypeScript, ESLint, and Prettier.
```

### GitHub Pages Configuration ✅DONE

```
Based on the MITA SS-A Tool project described in instructions/index.md, help me create 
a GitHub Actions workflow file (.github/workflows/deploy.yml) that will:

1. Build the Next.js application for static export
2. Deploy the built files to GitHub Pages
3. Run on push to the `main`, `dev`, and `test` branches allowing for three diffierent versions of the app to be deployed at once
4. Include proper caching for dependencies
```

### Package.json Setup ✅DONE

```
For the MITA SS-A Tool project described in instructions/index.md, please help me create 
a package.json file with:

1. Required dependencies for Next.js, React, TypeScript, and the CMS Design System
2. Development dependencies for testing tools
3. Appropriate scripts for development, building, testing, and linting
4. Project metadata as described in our implementation plan
```

### Testing Framework Setup ✅DONE

```
Following our development approach in instructions/development_guide.md, help me set up a testing framework for the MITA SS-A Tool including:

1. Jest configuration for unit tests
2. React Testing Library setup for component testing
3. Basic test structure for components
4. Example test for a simple component
```

### Build Optimization ✅DONE

```
Based on our architecture in instructions/architecture.md, please help me optimize the build configuration for our Next.js application to:

1. Minimize bundle size through code splitting
2. Implement efficient caching strategies
3. Optimize image loading and processing
4. Ensure fast initial load times
```

## Development Phase 2: Content Structure Implementation ✅COMPLETED

### Phase 2 Completion Summary

All items in Development Phase 2 have been successfully completed. The project now has:

- YAML/Markdown Parser that loads and parses capability definitions with proper typing
- Sample capability content files for Provider Enrollment, Management, and Termination
- Comprehensive TypeScript interfaces for content structure
- Content loading component that dynamically loads and provides capability definitions
- Storage service foundation for persisting assessment data

### YAML/Markdown Parser ✅DONE

```
Following the content structure outlined in instructions/data_models.md, help me create 
a parser utility that will:

1. Load Markdown files containing MITA capability definitions
2. Parse the front matter metadata
3. Extract structured content from the Markdown sections
4. Return typed capability definition objects that match the interfaces in instructions/data_models.md
```

### Sample Capability Content ✅DONE

```
Based on the MITA framework structure in instructions/mita_framework.md, please create 
a sample markdown file for a Provider Enrollment capability area that:

1. Includes the proper YAML front matter
2. Contains sections for all five ORBIT dimensions (Outcome, Role, Business Process, Information, Technology)
3. Includes assessment questions and maturity level definitions for each dimension
4. Follows the structure detailed in instructions/data_models.md
```

### Type Definitions for Content ✅DONE

```
Using the data models described in instructions/data_models.md, please create TypeScript 
interfaces for the content structure of our MITA capability definitions. Include:

1. Interfaces for capability metadata
2. Type definitions for the five ORBIT dimensions (Outcome, Role, Business Process, Information, Technology) 
3. Interfaces for assessment questions and maturity levels for each ORBIT dimension
4. TypeScript enums or constants to represent the ORBIT dimension types
5. Proper documentation comments explaining the relationship between dimensions
```

### Content Loading Component ✅DONE

```
Following our architecture in instructions/architecture.md, help me create a React component that:

1. Dynamically loads capability definitions from Markdown files
2. Parses the content using the parser we've created
3. Provides a clean interface for other components to access this content
4. Handles loading states and errors appropriately
```

## Development Phase 3: Core Feature Implementation

### Landing Page Component ✅DONE

```
Following the user journey in instructions/assessment_workflow.md, help me create a landing page component that:

1. Displays welcome message and tool overview with clear navigation options
2. Provides "Getting Started" link to proceed to user dashboard
3. Includes "About MITA" link to framework information page
4. Loads quickly with minimal dependencies and accessible entry points
5. Uses CMS Design System components for visual consistency
```

### User Dashboard Component ✅DONE

```
Based on the dashboard workflow in instructions/assessment_workflow.md, help me create a user dashboard component that:

1. Loads and displays saved assessments from browser storage with progress indicators
2. Shows assessment metadata (dates, domains, completion status) for each assessment
3. Provides "Begin New Assessment" and "Open Existing Assessment" actions
4. Displays assessment states (Not Started, In Progress, Completed, Reviewed, Exported)
5. Integrates with storage service to manage saved assessments
```

### MITA Information Page

```
Following the information flow in instructions/assessment_workflow.md, help me create a MITA information page that:

1. Presents educational content about MITA framework in accessible format
2. Includes external link to official MITA website (opens in new tab)
3. Provides "Getting Started" link to proceed to dashboard
4. Maintains user's place in application flow with clear navigation pathways
5. Uses proper semantic structure for screen reader support
```

### Assessment Setup Component ✅DONE

```
Based on the assessment setup flow in instructions/assessment_workflow.md, help me create a component that:

1. Displays capability domains and areas in organized, selectable structure
2. Validates that at least one capability area is selected before proceeding
3. Saves selections to browser storage and generates customized assessment flow
4. Provides navigation back to modify selections and review before proceeding
5. Links to begin the guided assessment walkthrough
```

### Guided Assessment Walkthrough

```
Following the guided assessment process in instructions/assessment_workflow.md, help me create a multi-page assessment component that:

1. Presents assessment questions in logical sequence with capability overview
2. Implements systematic ORBIT dimension evaluation (Outcome, Role, Business Process, Information, Technology)
3. Provides maturity level selection, evidence documentation, and advancement planning fields
4. Auto-saves user inputs every 30 seconds and validates required fields
5. Supports forward/backward navigation and tracks completion status across dimensions
```

### ORBIT Dimension Assessment Form

```
Based on the form structure in instructions/assessment_workflow.md, help me create a dimension assessment component that:

1. Includes dimension overview, reference materials, and structured assessment questions
2. Provides maturity selection controls (radio buttons) and evidence text areas
3. Contains advancement plans section and general notes field
4. Handles user input validation and state updates
5. Integrates with the guided walkthrough navigation flow
```

### Assessment Results Component

```
Following the assessment results workflow in instructions/assessment_workflow.md, help me create a results component that:

1. Calculates and displays MITA maturity scores for assessed capability areas
2. Provides visualization of results across capability areas
3. Generates formatted PDF/CSV reports for download
4. Updates assessment status to "Completed" and adds to user dashboard
5. Includes navigation back to dashboard and sharing options
```

### Assessment Management Component

```
Based on the assessment management flow in instructions/assessment_workflow.md, help me create a component that:

1. Loads existing assessment data from browser storage
2. Provides "Update/Edit" and "View" (read-only) modes for existing assessments
3. Maintains data integrity during updates and tracks modification dates
4. Provides confirmation dialogs for destructive actions like delete
5. Supports version history and assessment archiving
```

### Browser Storage Service

```
Following the storage implementation in instructions/assessment_workflow.md, help me create a storage service that:

1. Uses localStorage for assessment metadata and IndexedDB for detailed assessment data
2. Implements autosave every 30 seconds and explicit user-triggered save
3. Provides JSON export/import functionality for data transfer between sessions
4. Handles storage quotas and errors gracefully with user feedback
5. Supports assessment state management (Not Started, In Progress, Completed, etc.)
```

### Error Boundary Component

```
Following the error handling approach described in instructions/architecture.md and instructions/development_guide.md, please create a React error boundary component that:

1. Catches errors in child components
2. Displays a user-friendly error message using CMS Design System components
3. Logs error details for debugging
4. Provides recovery options when possible
5. Implements the graceful degradation strategy outlined in the architecture documentation
```

### Storage Error Handling

```
Based on our data models in instructions/data_models.md, implement robust error handling for storage operations that:

1. Detects when browser storage limits are exceeded
2. Provides clear user feedback about storage issues
3. Offers fallback options (e.g., immediate export)
4. Prevents data loss during errors
```

## Development Phase 4: Data Visualization and Export

### Maturity Dashboard

```
Based on the reporting requirements in instructions/assessment_workflow.md and data structure in instructions/data_models.md, help me create a dashboard component that:

1. Visualizes maturity levels across capability areas using a chart library
2. Shows progress towards target maturity
3. Provides filtering options by module and domain
4. Uses the CMS Design System components for consistent styling
```

### PDF Export Functionality

```
Using the export models defined in instructions/data_models.md, implement a service that:

1. Generates a PDF report from assessment data
2. Includes configurable sections based on PDFExportOptions
3. Formats content according to CMS Design System styling
4. Uses react-pdf or a similar library for PDF generation
```

### CSV Export Functionality

```
Following the CSVExportService interface in instructions/data_models.md, implement a service that:

1. Converts assessment data to CSV format
2. Handles nested data structures appropriately
3. Supports the options defined in CSVExportOptions
4. Creates a downloadable CSV file
```

### Phase 4: Reporting Components

```
Based on the Reporting phase described in instructions/assessment_workflow.md and the data models in instructions/data_models.md, please help me implement the reporting components including:

1. Maturity dashboard with visualizations of current assessment status
2. Gap analysis view comparing current to target maturity levels
3. Capability domain summary reports
4. Comprehensive assessment report generator
5. Export options in PDF and CSV formats with configurable content
```

### Phase 5: Utilization Components

```
Based on the Utilization phase described in instructions/assessment_workflow.md, please help me implement components that support using assessment results including:

1. Strategic planning guidance based on assessment results
2. Export formats suitable for leadership presentations
3. Historical comparison visualizations to track progress
4. Integration points with APD development processes
5. Executive summary generation for stakeholder communication
```

## Development Phase 5: Final Integration and Refinement

### Application Integration

```
Based on our architecture in instructions/architecture.md, help me integrate the various components we've built into a cohesive application with:

1. Consistent navigation between sections
2. Proper state management across components
3. Smooth transitions between assessment stages
4. Error boundaries to prevent catastrophic failures
```

### Accessibility Implementation

```
Following the accessibility requirements in instructions/development_guide.md, help me ensure our application is accessible by:

1. Adding proper ARIA attributes where needed
2. Implementing keyboard navigation
3. Ensuring appropriate color contrast
4. Supporting screen readers effectively
```

### Accessibility Audit

```
Please review this component for accessibility issues and provide fixes to ensure:

1. All interactive elements are keyboard accessible
2. Proper ARIA attributes are used
3. Color contrast meets WCAG 2.1 AA standards
4. Screen reader announcements work correctly
```

### Focus Management

```
Help me implement proper focus management for this multi-step form that:

1. Maintains focus position during updates
2. Sets focus appropriately when new sections appear
3. Provides keyboard shortcuts for common actions
4. Follows best practices for modal dialogs
```

### Performance Optimization

```
Help me optimize the performance of our MITA SS-A Tool based on instructions/architecture.md and instructions/development_guide.md by:

1. Implementing code splitting for larger components
2. Optimizing bundle size through treeshaking
3. Adding memoization for expensive calculations
4. Improving rendering performance of list components
```

### Cross-Browser Testing

```
Following the browser compatibility requirements in instructions/development_guide.md, help me create a testing strategy to verify our application works correctly across:

1. Chrome, Firefox, Safari, and Edge browsers
2. Tablet devices
3. Different operating systems
4. Various connection speeds
```

## Troubleshooting Prompts

### Debugging Storage Issues

```
I'm experiencing an issue where assessment data isn't being saved correctly. 
Based on our storage implementation in instructions/data_models.md, please help me:

1. Create debugging steps to identify the problem
2. Implement better error logging
3. Add recovery mechanisms for corrupted data
4. Test the fixes thoroughly
```

### Performance Optimization

```
Our application is running slowly when loading large assessments. Using our architecture 
described in instructions/architecture.md, please suggest:

1. Performance optimizations for data loading
2. Rendering improvements for large forms
3. State management optimizations
4. Memory usage improvements
```

## Component Testing Prompts

### Component Test

```
Following the testing approach in instructions/development_guide.md and using the component structures from instructions/architecture.md, please help me create a Jest test for the AssessmentForm component that:

1. Tests rendering with various props
2. Verifies user interactions work correctly
3. Ensures form validation functions properly
4. Mocks context providers and services as needed
```

### Storage Service Test

```
Following the testing strategies outlined in instructions/development_guide.md, please write Jest tests for our StorageService that:

1. Mock browser storage APIs
2. Test saving and loading assessment data
3. Verify error handling for storage failures
4. Test the fallback from localStorage to IndexedDB
```

### Integration Test

```
Following the testing approach outlined in instructions/development_guide.md, help me create an integration test for the assessment workflow that:

1. Tests the interaction between multiple components
2. Verifies data flows correctly through the system
3. Tests end-to-end assessment completion
4. Mocks browser storage for test stability
```

## Advanced Features Prompts

### Import/Export Enhancement

```
Based on the collaboration approach described in instructions/assessment_workflow.md, help me enhance our import/export functionality with:

1. Selective import capabilities (choosing specific sections)
2. Conflict resolution when merging changes
3. Export format validation and versioning
4. Support for encrypted exports for sensitive data
```

### Offline Support

```
Following the browser storage approach in instructions/architecture.md and instructions/data_models.md, help me implement robust offline support that:

1. Detects when the application goes offline
2. Provides appropriate user feedback
3. Ensures data integrity during offline operation
4. Synchronizes correctly when coming back online
```

