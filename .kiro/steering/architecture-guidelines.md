---
inclusion: fileMatch
fileMatchPattern: 'src/**/*'
---

# Architecture Guidelines

## Core Architectural Principles
1. **Content-Code Separation**: MITA capability definitions are separate from application logic
2. **Client-Side Only**: No server-side processing or storage dependencies
3. **Browser Storage Strategy**: localStorage first, IndexedDB fallback for larger data
4. **Progressive Enhancement**: Check for feature availability and degrade gracefully

## Key Services Architecture
- **ContentService**: Loads and manages capability definitions from YAML/Markdown
- **AssessmentService**: Handles assessment logic and state management
- **StorageService**: Manages browser storage operations with fallback strategies
- **ExportService**: Generates PDF and CSV exports from assessment data

## Data Flow Pattern
1. Content Loading → Parse YAML/Markdown files at runtime
2. User Input → Assessment data captured through controlled forms
3. State Management → React Context maintains application state
4. Data Persistence → Assessment data saved to browser storage
5. Reporting → Visualization components render data from state
6. Export → PDF/CSV generated from application state

## Storage Schema
```typescript
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
        outcome: MaturityDimension;
        role: MaturityDimension;
        businessProcess: MaturityDimension;
        information: MaturityDimension;
        technology: MaturityDimension;
      }
    }
  }
}
```

## Error Handling Strategy
- **Graceful Degradation**: Ensure core functionality works despite errors
- **Meaningful Messages**: Provide clear error messaging for users
- **Recovery Options**: Offer paths to recover from common errors
- **Data Protection**: Prevent data loss during error conditions

## Browser Compatibility
- Support modern browsers: Chrome, Firefox, Safari, Edge (latest 2 versions)
- Tablet support required, mobile optional
- Test storage mechanisms across all target browsers

#[[file:instructions/architecture.md]]