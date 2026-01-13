# ORBIT Maturity Model Implementation Plan

## Document Purpose
This document tracks the implementation of the MITA 4.0 ORBIT-based maturity model into the State Self-Assessment Tool. It captures context from the source document (MGB Review_MITA 4.0 Maturity Model.docx) and tracks implementation progress.

## Source Document Summary

### Document: MGB Review_MITA 4.0 Maturity Model.docx
- **Version**: 0.1 (August 8, 2025)
- **Authors**: Z. Rioux, S. Lucas
- **Status**: Draft for pilot approval

### Key Changes from MITA 3.0 to MITA 4.0

The MITA 4.0 Maturity Model introduces a **standardized, universal assessment framework** that applies the same maturity criteria across ALL capability domains and areas. This is a fundamental shift from the previous approach where each capability area had its own custom maturity definitions.

### ORBIT Framework Structure

**ORBIT** = **O**utcomes, **R**oles, **B**usiness Architecture, **I**nformation & Data, **T**echnology

Each capability is assessed based on these five dimensions, with **standard maturity criteria** that apply regardless of which capability domain or area is being assessed.

### Maturity Levels (1-5)

| Level | Name | Description |
|-------|------|-------------|
| 1 | Initial | Unstructured, reactive, inconsistent processes. Seeking to adopt frameworks. |
| 2 | Developing | Basic processes exist but not fully standardized. Beginning to adopt frameworks. |
| 3 | Defined | Processes standardized, documented, and aligned. Fully implemented frameworks. |
| 4 | Managed | Fully operational, consistent. Actively monitors metrics. Thought-leader. |
| 5 | Optimized | Advanced, data-driven strategies. Institutionalized innovation. Nationally recognized. |
| N/A | Not Applicable | Criteria inapplicable to business operations or MES. |

---

## ORBIT Dimension Details

### O - Outcomes (Optional)
Assesses organizational culture, capability, quality, alignment, metrics usage, and reusability related to outcome development.

**Aspects:**
- Culture & Mindset
- Capability
- Quality & Consistency
- Alignment to Goals & Priorities
- Use of Metrics
- Reusability & Integration

### R - Roles (Optional)
Assesses technology resources, organizational alignment, governance, communication, culture/leadership, and resourcing capacity.

**Aspects:**
- Technology Resources
- Organizational Goals Alignment
- Governance & Standardization
- Communication (Internal/External)
- Culture & Leadership
- Resourcing Capacity (Staffing, Training, Recruitment)

### B - Business Architecture
Assesses business capability documentation, processes, models, role management, strategic planning, enterprise architecture, and policy management.

**Aspects:**
- Business Capability
- Business Process
- Business Process Model
- Role Management
- Strategic Planning
- Enterprise Architecture
- Policy Management

### I - Information and Data
Assesses data management practices across multiple sub-domains.

**Aspects:**
- Data Storage & Warehousing
- Data Architecture & Modeling
- Document & Content Management
- Data Governance
- Data Privacy & Security
- Data Quality
- Data Integration & Interoperability
- Master Data Management
- Reference Data Management
- Business Intelligence
- Metadata Management

### T - Technology
The Technology dimension is the most complex, with **7 sub-domains**, each containing multiple aspects with detailed maturity criteria, assessment questions, and evidence requirements.

**Sub-Domains:**
1. **Infrastructure** - Compute/Hosting, Storage, Networking, Resilience/Scaling
2. **Integration** - API/Interface Management, System Messaging, External Partner Integration
3. **Platform Services** - Application Hosting, Business Rules/Workflow, Common Platform Functions
4. **Application Architecture** - Modular Architecture, User Interfaces, Session/State Management
5. **Security and Identity** - Identity/Access Services, Consent Management, System/Data Protection, Security Monitoring
6. **Operations and Monitoring** - System Monitoring, System Operations
7. **Development and Release** - Code/Configuration Management, Testing/Release, Security/Compliance

---

## Current Application State

### Existing Content Structure
- Content files in `public/content/` contain capability-specific maturity definitions
- Each file (e.g., `provider-enrollment.md`) has custom Level 1-5 descriptions and checkboxes per dimension
- Types in `src/types/index.ts` support capability-specific dimension definitions

### What Needs to Change
1. **Content files** should only contain capability domain/area metadata and descriptions
2. **ORBIT maturity criteria** should be stored as a separate, universal data structure
3. **Assessment UI** should display standard ORBIT questions for any selected capability
4. **Scoring** should work with the new standardized criteria structure

---

## Implementation Tasks

### Phase 1: Data Model & Content Structure
- [x] **1.1** Create ORBIT maturity model YAML/JSON data files
  - [x] 1.1.1 Outcomes criteria (optional) - `public/content/orbit/outcomes.yaml`
  - [x] 1.1.2 Roles criteria (optional) - `public/content/orbit/roles.yaml`
  - [x] 1.1.3 Business Architecture criteria - `public/content/orbit/business-architecture.yaml`
  - [x] 1.1.4 Information and Data criteria - `public/content/orbit/information-data.yaml`
  - [x] 1.1.5 Technology criteria (all 7 sub-domains):
    - `public/content/orbit/technology/index.yaml`
    - `public/content/orbit/technology/infrastructure.yaml`
    - `public/content/orbit/technology/integration.yaml`
    - `public/content/orbit/technology/platform-services.yaml`
    - `public/content/orbit/technology/application-architecture.yaml`
    - `public/content/orbit/technology/security-identity.yaml`
    - `public/content/orbit/technology/operations-monitoring.yaml`
    - `public/content/orbit/technology/development-release.yaml`
- [x] **1.2** Update TypeScript types for new ORBIT model
  - [x] 1.2.1 Create OrbitMaturityModel types - `src/types/orbit.ts`
  - [x] 1.2.2 Create Technology sub-domain types - included in orbit.ts
  - [x] 1.2.3 Update Assessment types to reference standard criteria - exported from index.ts
- [x] **1.3** Simplify capability content files
  - [x] 1.3.1 Remove maturity-level specific content from capability files
  - [x] 1.3.2 Keep only domain/area metadata and descriptions
  - Created new simplified YAML format in `public/content/capabilities/`:
    - `index.yaml` - capability reference model index
    - `provider-enrollment.yaml` - simplified capability definition
    - `provider-management.yaml` - simplified capability definition
    - `provider-termination.yaml` - simplified capability definition

### Phase 2: Services & Data Loading
- [x] **2.1** Create OrbitMaturityService to load and manage ORBIT criteria (completed with Phase 1.2)
- [x] **2.2** Create CapabilityService for simplified capability files
  - Created `src/services/CapabilityService.ts` - loads YAML capability files
  - Created `src/hooks/useCapabilities.ts` - React hooks for capability access
  - Created `src/services/index.ts` - central service exports
  - Updated `src/hooks/index.ts` - exports new capability hooks
  - Legacy ContentService preserved for backward compatibility
- [ ] **2.3** Update ScoringService for new assessment structure

### Phase 3: UI Components
- [ ] **3.1** Create ORBIT dimension assessment components
  - [ ] 3.1.1 Standard question/evidence display component
  - [ ] 3.1.2 Technology sub-domain navigation
- [ ] **3.2** Update assessment workflow to use standard ORBIT criteria
- [ ] **3.3** Update reporting/visualization for new structure

### Phase 4: Migration & Testing
- [ ] **4.1** Create migration utility for existing assessments (if needed)
- [ ] **4.2** Update existing tests
- [ ] **4.3** Add new tests for ORBIT model
- [ ] **4.4** End-to-end testing

### Phase 5: Documentation
- [ ] **5.1** Update README with new model information
- [ ] **5.2** Update CHANGELOG
- [ ] **5.3** Update instruction files (architecture.md, data_models.md, etc.)

---

## Technical Design Decisions

### ORBIT Data Storage Format
**Decision**: Use YAML files in `public/content/orbit/` directory
**Rationale**: 
- Consistent with existing content management approach
- Human-readable and editable
- Can be loaded at runtime like existing capability files

### Technology Sub-Domain Handling
**Decision**: Create separate YAML files per Technology sub-domain
**Rationale**:
- Technology section is very large (7 sub-domains, each with multiple aspects)
- Separate files improve maintainability
- Allows lazy loading if needed

### Assessment Data Structure
**Decision**: Store dimension responses with references to standard ORBIT criteria
**Rationale**:
- Assessments reference the universal criteria by ID
- Allows criteria updates without breaking existing assessments
- Maintains separation between criteria definitions and user responses

### Backward Compatibility
**Decision**: Support migration from old assessment format
**Rationale**:
- Existing pilot users may have in-progress assessments
- Provide clear migration path or export/re-import workflow

---

## File Structure (Proposed)

```
public/content/
├── orbit/
│   ├── outcomes.yaml           # O - Outcomes criteria (optional)
│   ├── roles.yaml              # R - Roles criteria (optional)
│   ├── business-architecture.yaml  # B - Business Architecture
│   ├── information-data.yaml   # I - Information and Data
│   └── technology/
│       ├── index.yaml          # T - Technology overview
│       ├── infrastructure.yaml
│       ├── integration.yaml
│       ├── platform-services.yaml
│       ├── application-architecture.yaml
│       ├── security-identity.yaml
│       ├── operations-monitoring.yaml
│       └── development-release.yaml
├── capabilities/
│   ├── provider-enrollment.yaml    # Simplified - metadata only
│   ├── provider-management.yaml
│   └── provider-termination.yaml
```

---

## Progress Log

| Date | Task | Status | Notes |
|------|------|--------|-------|
| 2026-01-13 | Document created | ✅ Complete | Initial implementation plan |
| 2026-01-13 | Phase 1.1 - ORBIT YAML files | ✅ Complete | All 11 YAML files created |
| | - outcomes.yaml | ✅ | Optional dimension, 6 aspects |
| | - roles.yaml | ✅ | Optional dimension, 6 aspects |
| | - business-architecture.yaml | ✅ | Required, 7 aspects |
| | - information-data.yaml | ✅ | Required, 11 aspects |
| | - technology/index.yaml | ✅ | Overview + 7 sub-domains |
| | - technology/infrastructure.yaml | ✅ | 4 aspects with Q&E |
| | - technology/integration.yaml | ✅ | 3 aspects with Q&E |
| | - technology/platform-services.yaml | ✅ | 3 aspects with Q&E |
| | - technology/application-architecture.yaml | ✅ | 3 aspects with Q&E |
| | - technology/security-identity.yaml | ✅ | 4 aspects with Q&E |
| | - technology/operations-monitoring.yaml | ✅ | 2 aspects with Q&E |
| | - technology/development-release.yaml | ✅ | 3 aspects with Q&E |
| 2026-01-13 | Phase 1.2 - TypeScript types | ✅ Complete | |
| | - src/types/orbit.ts | ✅ | All ORBIT types defined |
| | - src/types/index.ts | ✅ | Exports ORBIT types |
| | - src/services/OrbitMaturityService.ts | ✅ | YAML loader service |
| | Phase 2.1 - OrbitMaturityService | ✅ Complete | Included with 1.2 |
| | Phase 1.3 - Simplify capability files | ✅ Complete | New YAML format |
| 2026-01-13 | Phase 2.2 - CapabilityService | ✅ Complete | |
| | - src/services/CapabilityService.ts | ✅ | YAML capability loader |
| | - src/hooks/useCapabilities.ts | ✅ | React hooks for capabilities |
| | - src/services/index.ts | ✅ | Central service exports |
| | - src/hooks/index.ts | ✅ | Updated with new exports |
| | Phase 2.3 - ScoringService update | 🔜 Next | |

---

## Open Questions

1. **Optional Dimensions**: How should Outcomes and Roles (marked optional) be handled in the UI? Show but mark as optional? Allow skip?

2. **Technology Sub-Domain Selection**: Should users assess ALL technology sub-domains, or select relevant ones per capability?

3. **Evidence Collection**: The model specifies evidence types (E:) for each level. Should we provide structured evidence upload/documentation fields?

4. **Maturity Profile Export**: CMS requires a standardized Maturity Profile format (.csv for MESH upload). Need to ensure export aligns with this requirement.

---

## References

- Source Document: `MGB Review_MITA 4.0 Maturity Model.docx`
- MITA 4.0 Capability Reference Model (referenced in source doc)
- Existing architecture: `instructions/architecture.md`
- Existing data models: `instructions/data_models.md`
