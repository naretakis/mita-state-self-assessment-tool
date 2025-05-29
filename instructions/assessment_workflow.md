# MITA State Self-Assessment Tool - Assessment Workflow

## Overview

This document outlines the assessment workflow and user journey for the MITA State Self-Assessment (SS-A) Tool. It describes how users navigate through the assessment process, from initial setup to final reporting.

## User Journey Map

```
+----------------+     +----------------+     +----------------+     +----------------+     +----------------+
|                |     |                |     |                |     |                |     |                |
|  Preparation   |---->|   Assessment   |---->| Collaboration  |---->|   Reporting    |---->|  Utilization   |
|                |     |                |     |                |     |                |     |                |
+----------------+     +----------------+     +----------------+     +----------------+     +----------------+
```

## Phase 1: Preparation

### User Actions

1. Access the SS-A Tool through a web browser
2. Create a new assessment or load an existing one
3. Select the state name and assessment metadata
4. Review assessment instructions and MITA framework overview

### System Behavior

* Displays landing page with options to create or resume assessment
* Loads assessment metadata input form for new assessments
* Retrieves saved assessments from browser storage for resuming work
* Provides contextual help and framework documentation

## Phase 2: Assessment

### User Actions

1. Select a capability domain to assess (e.g., Provider Management)
2. Choose a specific capability area within that domain
3. Review capability definition and maturity criteria
4. Assess current maturity level for each ORBIT dimension
5. Provide evidence supporting the selected maturity level
6. Document plans for advancement
7. Save progress

### System Behavior

* Displays capability tree navigation
* Loads capability definitions from markdown/YAML content
* Presents assessment forms for each ORBIT dimension
* Provides reference materials and maturity definitions
* Validates user inputs for completeness
* Saves assessment progress to browser storage
* Provides visual indication of completion status

## Phase 3: Collaboration

### User Actions

1. Export specific sections or the entire assessment as PDF or CSV
2. Share exports with subject matter experts for input
3. Review feedback from colleagues
4. Update assessment based on collective input
5. Import updates if collaborating across browsers/devices

### System Behavior

* Generates formatted PDF reports with assessment details
* Creates structured CSV exports of assessment data
* Provides import functionality for data from other sessions
* Validates imports for data integrity
* Merges imported data with existing assessment content

## Phase 4: Reporting

### User Actions

1. View maturity dashboard showing assessment results
2. Analyze strengths and gaps across capabilities
3. Review progress toward target maturity levels
4. Generate comprehensive assessment report
5. Export final results in desired format (PDF/CSV)

### System Behavior

* Calculates aggregate maturity scores
* Generates visualizations of maturity across capabilities
* Compares current state to target state
* Highlights improvement opportunities
* Creates formatted reports with visualizations and details

## Phase 5: Utilization

### User Actions

1. Use assessment results to inform APD development
2. Share insights with leadership and stakeholders
3. Incorporate findings into strategic planning
4. Track progress against maturity goals over time

### System Behavior

* Provides guidance on using results for planning
* Offers export formats suitable for presentations
* Maintains historical assessment data for comparison

## Decision Tree Navigation

The SS-A Tool implements a guided decision tree approach to streamline the assessment process:

```
Start
 |
 v
Select Capability Domain
 |
 v
Select Capability Area
 |
 v
Assessment Landing Page for Capability
 |
 |-----> Assess Outcome Dimension
 |        |
 |        v
 |       Answer Assessment Questions
 |        |
 |        v
 |       Select Maturity Level
 |        |
 |        v
 |       Provide Supporting Evidence
 |
 |-----> Assess Role Dimension
 |        |
 |        v
 |       [Same subprocess as Outcome]
 |
 |-----> Assess Business Process Dimension
 |        |
 |        v
 |       [Same subprocess as Outcome]
 |
 |-----> Assess Information Dimension
 |        |
 |        v
 |       [Same subprocess as Outcome]
 |
 |-----> Assess Technology Dimension
 |        |
 |        v
 |       [Same subprocess as Outcome]
 |
 v
Review Capability Summary
 |
 v
Save & Continue to Next Capability
```

## Assessment States

An assessment can exist in the following states:

1. **Not Started**: Capability assessment has not been initiated
2. **In Progress**: Partially completed assessment with saved data
3. **Completed**: All dimensions assessed with maturity levels selected
4. **Reviewed**: Assessment has been marked as reviewed by user
5. **Exported**: Assessment has been exported to PDF/CSV

## Progress Tracking

The system tracks and displays assessment progress at multiple levels:

1. **Overall Assessment**: Percentage of capability areas with completed assessments
2. **Capability Domain**: Completion status for domains (e.g., Provider Management)
3. **Capability Area**: Status of individual capability assessments
4. **Dimension**: Completion status for each ORBIT dimension

## Form Structure

Each dimension assessment includes the following components:

1. **Dimension Overview**: Description of the dimension and assessment approach
2. **Reference Materials**: Context-specific guidance and documentation
3. **Assessment Questions**: Structured questions to guide maturity determination
4. **Maturity Selection**: Radio buttons or similar controls for selecting maturity level
5. **Evidence Fields**: Text areas for documenting supporting evidence
6. **Advancement Plans**: Areas to document plans for maturity improvement
7. **Notes**: General notes field for additional context or considerations

## Save and Resume Workflow

The SS-A Tool implements an autosave approach with explicit save options:

1. **Autosave**: Assessment data saved to browser storage every 30 seconds
2. **Explicit Save**: User-triggered save action at any point
3. **Navigation Warning**: Alert when leaving unsaved changes
4. **Resume Options**: List of saved assessments on landing page
5. **Storage Management**: Options to manage saved assessments

## Browser Storage Implementation

For data persistence without a server:

1. **localStorage**: Primary storage for assessment metadata and progress tracking
2. **IndexedDB**: Storage for detailed assessment data that may exceed localStorage limits
3. **Export/Import**: JSON export/import functionality to transfer data between sessions

## Accessibility Considerations

The assessment workflow incorporates accessibility best practices:

1. **Keyboard Navigation**: Complete assessment possible using keyboard alone
2. **Screen Reader Support**: ARIA labels and proper semantic structure
3. **Focus Management**: Clear visual indicators of focused elements
4. **Error Handling**: Accessible error messages and validation
5. **Color Independence**: Information conveyed by more than just color
6. **Responsive Design**: Adaptable to different screen sizes and zoom levels

## Implementation Guidance

When implementing the assessment workflow:

1. Prioritize user experience and intuitiveness
2. Ensure browser storage operations don't block the UI thread
3. Provide clear feedback on save/load operations
4. Implement graceful error handling for storage failures
5. Design for progressive enhancement
6. Test with real users throughout development

