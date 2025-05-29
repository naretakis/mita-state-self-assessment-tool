# MITA State Self-Assessment Tool - Architecture Overview

## System Architecture

The MITA SS-A Tool follows a modern, browser-based architecture that emphasizes content-code separation and client-side processing. This document outlines the technical architecture to guide Amazon Q Developer in implementing the application.

### High-Level Architecture

```
+-----------------------------------+
|            User Interface         |
|  +-----------+    +-------------+ |
|  | Assessment|    | Reporting & | |
|  | Workflow  |    | Export      | |
|  +-----------+    +-------------+ |
+-------------------+---------------+
|         Application Logic         |
|  +-----------+    +-------------+ |
|  | Content   |    | State       | |
|  | Loader    |    | Management  | |
|  +-----------+    +-------------+ |
|  | Decision   |   | Data        | |
|  | Tree       |   | Validation  | |
|  +-----------+    +-------------+ |
+-------------------+---------------+
|            Data Layer             |
|  +-----------+    +-------------+ |
|  | Browser   |    | Content     | |
|  | Storage   |    | Parser      | |
|  +-----------+    +-------------+ |
+-----------------------------------+
```

## Key Components

### 1. UI Layer

#### Assessment Components

* **CapabilitySelector**: Allows users to select capability areas for assessment
* **AssessmentForm**: Dynamic form generation based on capability structure
* **DecisionTreeNavigator**: Guides users through the assessment process
* **ProgressTracker**: Displays progress through the assessment

#### Reporting Components

* **MaturityDashboard**: Visualizes maturity levels across capabilities
* **SummaryView**: Provides high-level overview of assessment results
* **ExportComponent**: Handles PDF and CSV generation and download

### 2. Application Layer

#### Core Services

* **ContentService**: Loads and manages capability definitions from YAML/Markdown
* **AssessmentService**: Handles assessment logic and state
* **StorageService**: Manages browser storage operations
* **ExportService**: Generates PDF and CSV exports

#### State Management

* **Context Providers**: React Context API for sharing state
* **Reducers**: State update logic for assessment data
* **Storage Hooks**: Custom hooks for localStorage/IndexedDB interaction

### 3. Data Layer

#### Storage Mechanisms

* **LocalStorage**: Primary storage for smaller assessments
* **IndexedDB**: Storage for larger data sets
* **SessionStorage**: Temporary session data

#### Content Structure

* **Markdown Parser**: Converts markdown content to structured data
* **TypeScript Interfaces**: Type definitions for content structure
* **Validation Utilities**: Ensures content integrity

## Content-Code Separation

A key architectural principle of the MITA SS-A Tool is the separation of content (MITA capability definitions) from code (application logic). This provides several benefits:

1. **Content Maintainability**: Subject matter experts can update capability definitions without code changes
2. **Enhanced Flexibility**: New capability areas can be added through content files only
3. **Versioning Simplicity**: Content can be versioned independently from application code
4. **Improved Testability**: Application logic can be tested with mock content

The content is structured in YAML/Markdown files with a standardized format:

```Markdown
---
capabilityDomain: Provider
capabilityArea: Provider Enrollment
version: 1.0
lastUpdated: 2025-04-15
---

## Outcomes
[Outcome description and assessment questions]

## Roles
[Role description and assessment questions]

## Business Processes
[Business process description and assessment questions]

## Information
[Information model description and assessment questions]

## Technology
[Technology description and assessment questions]
```

## Data Flow

1. **Content Loading**: Application loads YAML/Markdown files at runtime
2. **User Input**: Assessment data captured through forms
3. **State Management**: React Context maintains application state
4. **Data Persistence**: Assessment data saved to browser storage
5. **Reporting**: Visualization components render data from state
6. **Export**: PDF/CSV generated from application state

## Browser Storage Strategy

The application uses a tiered approach to browser storage:

1. **localStorage**: First choice for storing assessment data (limited to \~5MB)
2. **IndexedDB**: Fallback for larger assessments (up to 50MB+)
3. **Memory Cache**: Runtime state management with React Context
4. **Export Files**: Generated files (PDF/CSV) for sharing and backup

### Storage Schema

```TypeScript
interface AssessmentData {
  assessmentId: string;
  stateName: string;
  createdAt: string;
  updatedAt: string;
  status: 'in-progress' | 'completed';
  capabilities: {
    [capabilityId: string]: {
      id: string;
      name: string;
      dimensions: {
        outcome: {
          maturityLevel: number;
          notes: string;
          evidence: string;
        },
        role: {
          maturityLevel: number;
          notes: string;
          evidence: string;
        },
        businessProcess: {
          maturityLevel: number;
          notes: string;
          evidence: string;
        },
        information: {
          maturityLevel: number;
          notes: string;
          evidence: string;
        },
        technology: {
          maturityLevel: number;
          notes: string;
          evidence: string;
        }
      }
    }
  }
}
```

## Deployment Architecture

```
+-----------------------------------+
|        GitHub Repository          |
|  +-------------------------+      |
|  |  Source Code            |      |
|  +-------------------------+      |
|  |  Content (YAML/Markdown)|      |
|  +-------------------------+      |
|  |  CI/CD Workflow         |      |
|  +-------------------------+      |
+----------------+------------------+
                 |
                 v
+-----------------------------------+
|        GitHub Actions             |
|  +-------------------------+      |
|  |  Build Process          |      |
|  |  (Next.js Export)       |      |
|  +-------------------------+      |
+----------------+------------------+
                 |
                 v
+-----------------------------------+
|        GitHub Pages              |
|  +-------------------------+      |
|  |  Static Site            |      |
|  +-------------------------+      |
+-----------------------------------+
```

## Key Technical Constraints

1. **Client-Side Only**: No server-side processing or storage
2. **Browser Compatibility**: Support for modern browsers (Chrome, Firefox, Safari, Edge)
3. **Mobile Responsiveness**: Tablet support required; mobile optional
4. **Performance**: Quick initial load; efficient operation with large data sets
5. **Accessibility**: WCAG 2.1 AA compliance required

## Error Handling Approach

1. **Graceful Degradation**: Ensure core functionality works despite errors
2. **Meaningful Messages**: Clear error messaging for users
3. **Recovery Options**: Provide paths to recover from common errors
4. **Data Protection**: Prevent data loss during errors

## Technical Decisions Rationale

1. **Next.js with Static Export**: Provides SEO benefits and optimized loading while enabling GitHub Pages hosting
2. **TypeScript**: Ensures type safety and improves developer experience
3. **CMS Design System**: Provides accessible, compliant UI components
4. **Content in YAML/Markdown**: Separates content from code for easier maintenance
5. **Browser Storage**: Enables offline functionality without server dependencies

## Performance Considerations

1. **Code Splitting**: Load components as needed
2. **Lazy Loading**: Defer non-critical content loading
3. **Optimized Assets**: Minimize image and CSS sizes
4. **Memoization**: Prevent unnecessary re-renders
5. **Storage Limits**: Handle browser storage constraints gracefully

