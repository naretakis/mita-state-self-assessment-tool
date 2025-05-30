# MITA State Self-Assessment Tool - Data Models

## Overview

This document describes the data structures and storage approaches used in the MITA State Self-Assessment (SS-A) Tool. Understanding these models is essential for implementing the application's state management, persistence, and export functionality.

## Core Data Models

### Assessment

The top-level structure representing a complete state self-assessment:

```TypeScript
interface Assessment {
  id: string;                    // Unique identifier
  stateName: string;             // Name of the state
  createdAt: string;             // ISO date string of creation
  updatedAt: string;             // ISO date string of last update
  status: AssessmentStatus;      // Status indicator
  capabilities: CapabilityAssessment[]; // Assessed capabilities
  metadata: AssessmentMetadata;  // Additional assessment information
}

type AssessmentStatus = 
  | 'not-started'
  | 'in-progress' 
  | 'completed';

interface AssessmentMetadata {
  version: string;              // Assessment version
  completedBy?: string;         // Person completing the assessment
  reviewedBy?: string;          // Person reviewing the assessment
  submissionDate?: string;      // Date of submission (if applicable)
  notes?: string;               // General assessment notes
}
```

### Capability Assessment

Represents an assessment of a specific capability area:

```TypeScript
interface CapabilityAssessment {
  id: string;                   // Unique identifier
  capabilityId: string;         // Reference to capability definition
  name: string;                 // Capability area name
  domainName: string;           // Capability domain name
  moduleName: string;           // Module name
  status: 'not-started' | 'in-progress' | 'completed';
  dimensions: {
    outcome: DimensionAssessment;
    role: DimensionAssessment;
    businessProcess: DimensionAssessment;
    informationData: DimensionAssessment;
    technology: DimensionAssessment;
  };
}
```

### Dimension Assessment

Represents the assessment of a single ORBIT dimension:

```TypeScript
interface DimensionAssessment {
  maturityLevel: number;        // Selected maturity level (1-5)
  evidence: string;             // Evidence supporting selected level
  barriers: string;             // Barriers to advancement
  plans: string;                // Plans for improvement
  notes: string;                // Additional notes
  targetMaturityLevel?: number; // Target maturity level
  lastUpdated: string;          // ISO date string of last update
}
```

### Capability Definition

Represents the structure of a capability area defined in content files:

```TypeScript
interface CapabilityDefinition {
  id: string;                   // Unique identifier
  name: string;                 // Capability area name
  domainName: string;           // Capability domain name  
  moduleName: string;           // Module name
  version: string;              // Content version
  lastUpdated: string;          // Last content update
  description: string;          // General capability description
  dimensions: {
    outcome: DimensionDefinition;
    role: DimensionDefinition;
    businessProcess: DimensionDefinition;
    informationData: DimensionDefinition;
    technology: DimensionDefinition;
  };
}
```

### Dimension Definition

Represents the content definition for a dimension:

```TypeScript
interface DimensionDefinition {
  description: string;          // Dimension description
  assessmentQuestions: string[];// Assessment guidance questions
  maturityLevels: {            // Definitions for each maturity level
    level1: string;
    level2: string;
    level3: string;
    level4: string;
    level5: string;
  };
}
```

## Browser Storage Models

### Storage Manager

The application implements a tiered storage approach:

```TypeScript
interface StorageManager {
  // Save assessment data to browser storage
  saveAssessment(assessment: Assessment): Promise<boolean>;
  
  // Load assessment by ID
  loadAssessment(id: string): Promise<Assessment | null>;
  
  // List all saved assessments
  listAssessments(): Promise<AssessmentSummary[]>;
  
  // Delete assessment by ID
  deleteAssessment(id: string): Promise<boolean>;
  
  // Export assessment to JSON file
  exportAssessment(id: string): Promise<Blob>;
  
  // Import assessment from JSON file
  importAssessment(file: File): Promise<Assessment>;
}

interface AssessmentSummary {
  id: string;
  stateName: string;
  createdAt: string;
  updatedAt: string;
  status: AssessmentStatus;
  completionPercentage: number;
}
```

### Storage Implementation

The application uses a tiered storage approach:

1. **Primary Storage**: `localStorage` for storing assessment metadata and small assessments
2. **Secondary Storage**: `IndexedDB` for storing larger assessments that exceed localStorage limits
3. **Export Mechanism**: File downloads for backup and sharing

## State Management Models

The application uses React Context for state management:

```TypeScript
interface AssessmentContext {
  // Current assessment state
  currentAssessment: Assessment | null;
  
  // Loading state
  loading: boolean;
  
  // Error state
  error: Error | null;
  
  // Actions
  createAssessment: (stateName: string) => Promise<string>;
  loadAssessment: (id: string) => Promise<void>;
  saveAssessment: () => Promise<boolean>;
  updateCapabilityDimension: (
    capabilityId: string,
    dimension: keyof typeof ORBIT_DIMENSIONS,
    data: Partial<DimensionAssessment>
  ) => void;
  exportAssessment: (format: 'json' | 'pdf' | 'csv') => Promise<void>;
}

interface AssessmentProviderProps {
  children: React.ReactNode;
  storageManager: StorageManager;
}
```

## Content Structure Models

The application loads capability definitions from YAML/Markdown files:

```TypeScript
interface ContentManager {
  // Load capability definitions
  loadCapabilityDefinitions(): Promise<CapabilityDefinition[]>;
  
  // Get capability by ID
  getCapability(id: string): Promise<CapabilityDefinition | null>;
  
  // Get all capabilities for a domain
  getCapabilitiesByDomain(domainName: string): Promise<CapabilityDefinition[]>;
}
```

### YAML/Markdown Structure

Content files use front matter for metadata and markdown sections for content:

```YAML
---
capabilityDomain: [Capability Domain Name]
capabilityArea: [Capability Area Name]
version: 1.0
mitadefinitioncreated: [created date]
mitadefinitionupdatedlastUpdated: [last modified date]
assessmentcreated: [date the state intiatited their assessment]
assessmentupdated: [date of the last updated to their assessment]
assessmentstatus: [uses type AssessmentStatus]

---

## Capability Domain: [Domain Name]

[Description content]

## Capability Area: [Area Name]

[Description content]

## Outcomes

### Description
[Outcomes description]

### Assessment Questions
1. [Question 1]
2. [Question 2]
3. [Question 3]

### Maturity Level Definitions

#### Level 1: Initial
[Level 1 definition]

#### Level 2: Repeatable
[Level 2 definition]

#### Level 3: Defined
[Level 3 definition]

#### Level 4: Managed
[Level 4 definition]

#### Level 5: Optimized
[Level 5 definition]

## Roles

[Similar structure for Roles dimension]

## Business Processes

[Similar structure for Business Processes dimension]

## Information

[Similar structure for Information dimension]

## Technology

[Similar structure for Technology dimension]
```

## Export Models

### PDF Export

Structure for PDF generation:

```TypeScript
interface PDFExportOptions {
  includeEvidence: boolean;
  includeBarriers: boolean;
  includePlans: boolean;
  includeNotes: boolean;
  includeVisualizations: boolean;
  selectedCapabilities?: string[]; // Capability IDs to include
}

interface PDFExportService {
  generatePDF(assessment: Assessment, options: PDFExportOptions): Promise<Blob>;
}
```

### CSV Export

Structure for CSV generation:

```TypeScript
interface CSVExportOptions {
  includeEvidence: boolean;
  includeBarriers: boolean;
  includePlans: boolean;
  includeNotes: boolean;
  flattenStructure: boolean;
  selectedCapabilities?: string[]; // Capability IDs to include
}

interface CSVExportService {
  generateCSV(assessment: Assessment, options: CSVExportOptions): Promise<Blob>;
}
```

## Implementation Considerations

When implementing these data models:

1. **Type Safety**: Use TypeScript interfaces consistently throughout the codebase
2. **Immutability**: Prefer immutable update patterns for state changes
3. **Validation**: Implement runtime validation for data loaded from storage or imported files
4. **Migration**: Include version fields to support future data model migrations
5. **Optimization**: Consider performance implications for large assessments

## Storage Size Considerations

Browser storage has limitations that should be considered:

1. **localStorage**: \~5MB limit in most browsers
2. **IndexedDB**: \~50MB or more, varies by browser
3. **Chunking**: Large assessments may need to be chunked for storage
4. **Compression**: Consider compressing data before storage

## Error Handling

The data layer should implement robust error handling:

1. **Storage Failures**: Handle cases where storage limits are exceeded
2. **Corrupt Data**: Validate data integrity when loading from storage
3. **Version Mismatches**: Handle loading data from different versions
4. **Import Errors**: Validate imported data for structure and content
5. **Export Failures**: Handle export generation failures gracefully

