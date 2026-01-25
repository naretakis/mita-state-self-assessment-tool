# MITA 4.0 State Self-Assessment Tool — Project Foundation

## Overview

A Progressive Web App (PWA) enabling State Medicaid Agencies (SMAs) to self-assess their Medicaid Enterprise maturity using the **MITA 4.0 ORBIT Maturity Model**. The application is fully client-side, offline-first, and stores all data locally in the browser.

**Project Start Date:** January 16, 2026  
**Target Deployment:** GitHub Pages

---

## Version History

| Version | Date         | Description                                                                                                                  |
| ------- | ------------ | ---------------------------------------------------------------------------------------------------------------------------- |
| 0.1     | Jan 16, 2026 | Initial project setup and foundation document                                                                                |
| 0.2     | Jan 16, 2026 | Complete ORBIT model from MITA 4.0 Reference Doc v0.1; added Maturity Profile CSV format                                     |
| 0.3     | Jan 21, 2026 | Updated capabilities.json from MITA 4.0 Capability Reference Model v1.0; added layer, topics, and categorized domain support |

---

## Background & Context

This project is a fresh reimplementation combining the best elements from two predecessor prototypes:

### Reference Repositories

1. **mita-3.0-ssa** (`mita-3.0/` in workspace)
   - Vite + React 19 + TypeScript + MUI v7 + Dexie.js
   - Excellent dashboard design with expandable business areas
   - Tag-based filtering and organization
   - Assessment history with snapshots
   - Carry-forward hints when editing assessments
   - **What we're keeping:** Dashboard patterns, Dexie.js data layer, UI/UX patterns

2. **mita-state-self-assessment-tool** (`mita-old/` in workspace)
   - Next.js + TypeScript + CMS Design System
   - ORBIT maturity model implementation
   - Multi-format export (PDF, CSV, JSON, Markdown)
   - Enhanced scoring with partial credit
   - Comprehensive error handling
   - **What we're keeping:** ORBIT model structure, export functionality, scoring logic

### Key Paradigm Shift: BCM/BPT → ORBIT

**MITA 3.0 (BCM/BPT Model):**

- 72 capabilities, each with unique maturity questions
- Business Capability Models (BCM) defined questions per capability
- Business Process Templates (BPT) provided process documentation

**MITA 4.0 (ORBIT Model):**

- Standardized maturity criteria applied to ALL capability areas
- Same ORBIT questions asked for every capability
- Five dimensions: Outcomes, Roles, Business Architecture, Information & Data, Technology
- Capability Reference Model defines domains and areas (metadata only, no questions)

---

## Core Principles

1. **Privacy First**: All data stays in the browser. No data transmitted or stored remotely.
2. **Offline First**: Full functionality after initial load, even without network.
3. **Maintainability**: Capability and ORBIT data in separate, easily-editable JSON files.
4. **Accessibility**: Government-appropriate, WCAG 2.1 AA compliant UI.
5. **Simplicity**: Clean architecture, minimal dependencies, clear code.

---

## Tech Stack

| Layer            | Technology                      | Rationale                                                     |
| ---------------- | ------------------------------- | ------------------------------------------------------------- |
| Build Tool       | Vite                            | Fast builds, native ESM, simpler than Next.js for static PWAs |
| Framework        | React 18                        | Industry standard, large ecosystem                            |
| Language         | TypeScript                      | Type safety, better DX, catches errors early                  |
| Routing          | React Router v7                 | De facto standard for React SPAs                              |
| UI Library       | Material UI (MUI) v6            | Clean design, accessible, well-documented                     |
| State Management | React Hooks + Dexie React Hooks | Sufficient for app complexity                                 |
| Client Storage   | Dexie.js (IndexedDB)            | Clean API, reactive queries, handles large data               |
| PDF Export       | jsPDF + jsPDF-AutoTable         | Proven, professional reports                                  |
| ZIP Export       | JSZip                           | Bundle attachments with reports                               |
| Charts           | Chart.js + react-chartjs-2      | Proven in mita-old, good visualizations                       |
| PWA              | vite-plugin-pwa                 | Workbox-based, Vite-native                                    |
| Hosting          | GitHub Pages                    | Free, simple, fits static export model                        |
| CI/CD            | GitHub Actions                  | Native to GitHub, straightforward deployment                  |

---

## Data Architecture

### Two Primary Data Files

The application uses two JSON files that can be easily edited to update capabilities or ORBIT criteria:

#### 1. `src/data/capabilities.json` — Capability Reference Model

Defines the capability domains and areas that can be assessed. No maturity questions here—just metadata. Domains are organized into three layers: Strategic, Core, and Support.

**Standard Domain Structure:**

```json
{
  "version": "4.0",
  "lastUpdated": "2026-01-21",
  "description": "The MITA 4.0 Capability Reference Model...",
  "domains": [
    {
      "id": "provider-management",
      "name": "Provider Management",
      "layer": "core",
      "description": "The Provider Management capability domain...",
      "areas": [
        {
          "id": "provider-enrollment",
          "name": "Provider Enrollment",
          "description": "Encompasses the required business processes...",
          "topics": ["Application Intake", "Eligibility Criteria", "Credential Validation"]
        }
      ]
    }
  ]
}
```

**Categorized Domain Structure (Data Management, Technical):**

```json
{
  "id": "data-management",
  "name": "Data Management",
  "layer": "support",
  "description": "The Data Management Capability Domain...",
  "categories": [
    {
      "id": "foundational",
      "name": "Foundational",
      "description": "Data management capability areas that all other...",
      "areas": [
        {
          "id": "data-governance",
          "name": "Data Governance",
          "description": "Provides the ability to establish policies...",
          "topics": ["Policies and Standards", "Roles and Responsibilities"]
        }
      ]
    }
  ]
}
```

**Capability Model Summary:**
| Layer | Domains | Capability Areas |
|-------|---------|------------------|
| Strategic | 2 | 5 |
| Core | 8 | 31 |
| Support | 4 | 39 |
| **Total** | **14** | **75** |

#### 2. `src/data/orbit-model.json` — ORBIT Maturity Criteria

Defines the standardized maturity criteria applied to ALL capability areas.

```json
{
  "version": "4.0",
  "lastUpdated": "2026-01-16",
  "dimensions": {
    "outcomes": {
      "id": "outcomes",
      "name": "Outcomes",
      "description": "...",
      "required": false,
      "aspects": [
        {
          "id": "culture-mindset",
          "name": "Culture & Mindset",
          "description": "...",
          "levels": {
            "level1": { "name": "Initial", "description": "...", "questions": [], "evidence": [] },
            "level2": { ... },
            "level3": { ... },
            "level4": { ... },
            "level5": { ... }
          }
        }
      ]
    },
    "technology": {
      "id": "technology",
      "name": "Technology",
      "required": true,
      "subDimensions": [
        {
          "id": "infrastructure",
          "name": "Infrastructure",
          "aspects": [...]
        }
      ]
    }
  }
}
```

### Database Schema (Dexie.js / IndexedDB)

```typescript
// Capability Assessment - one per capability area being assessed
// NOTE: "not started" is implied - if no record exists, the capability hasn't been started
interface CapabilityAssessment {
  id: string; // UUID
  capabilityDomainId: string; // e.g., "care-management"
  capabilityDomainName: string; // e.g., "Care Management"
  capabilityAreaId: string; // e.g., "establish-case"
  capabilityAreaName: string; // e.g., "Establish Case"
  status: 'in_progress' | 'finalized'; // "not started" = no record exists
  tags: string[]; // User-defined tags for filtering
  createdAt: Date;
  updatedAt: Date;
  finalizedAt?: Date;
  overallScore?: number; // Calculated average when finalized
}

// ORBIT Rating - one per aspect per capability assessment
interface OrbitRating {
  id: string; // UUID
  capabilityAssessmentId: string; // FK to CapabilityAssessment
  dimensionId: string; // 'outcomes' | 'roles' | 'business' | 'information' | 'technology'
  subDimensionId?: string; // Only for technology dimension (e.g., 'infrastructure')
  aspectId: string; // e.g., 'data-governance'
  currentLevel: 0 | 1 | 2 | 3 | 4 | 5 | -1; // -1 = N/A, 0 = not assessed
  previousLevel?: 1 | 2 | 3 | 4 | 5 | -1; // Carry-forward hint from previous assessment
  questionResponses: QuestionResponse[];
  evidenceResponses: EvidenceResponse[];
  notes: string;
  barriers: string;
  plans: string;
  carriedForward: boolean; // True if copied from previous assessment
  attachmentIds: string[]; // FK references to Attachment records
  updatedAt: Date;
}

// File Attachment - stored as Blob in IndexedDB
interface Attachment {
  id: string; // UUID
  capabilityAssessmentId: string; // FK to CapabilityAssessment
  orbitRatingId: string; // FK to OrbitRating (aspect-level attachment)
  fileName: string; // Original file name
  fileType: string; // MIME type (e.g., 'application/pdf')
  fileSize: number; // Size in bytes
  blob: Blob; // The actual file data
  description?: string; // Optional description of the attachment
  uploadedAt: Date;
}

// Assessment History - snapshots of finalized assessments
interface AssessmentHistory {
  id: string;
  capabilityAssessmentId: string;
  capabilityAreaId: string;
  snapshotDate: Date;
  tags: string[];
  overallScore: number;
  dimensionScores: Record<string, number>;
  ratings: OrbitRating[]; // Full snapshot
}

// Tags - for autocomplete
interface Tag {
  id: string;
  name: string;
  usageCount: number;
  lastUsed: Date;
}
```

---

## ORBIT Model Structure

> **Source:** MITA 4.0 Maturity Model Reference Document v0.1 (August 8, 2025)

### Five Dimensions

| Dimension                 | Required | Aspects                      | Description                                   |
| ------------------------- | -------- | ---------------------------- | --------------------------------------------- |
| **Outcomes**              | No       | 6                            | Business results and value delivery           |
| **Roles**                 | No       | 6                            | Organizational structure and responsibilities |
| **Business Architecture** | Yes      | 7                            | Process design and enterprise alignment       |
| **Information & Data**    | Yes      | 11                           | Data governance and management                |
| **Technology**            | Yes      | 22 (across 7 sub-dimensions) | Infrastructure, integration, security, etc.   |

### Complete Aspect Breakdown

#### Outcomes (Optional) — 6 Aspects

1. Culture & Mindset
2. Capability
3. Quality & Consistency
4. Alignment to Goals & Priorities
5. Use of Metrics
6. Reusability & Integration

#### Roles (Optional) — 6 Aspects

1. Technology Resources
2. Organizational Goals Alignment
3. Governance & Standardization
4. Communication (Internal / External)
5. Culture & Leadership
6. Resourcing Capacity (Staffing, Training, Recruitment)

#### Business Architecture (Required) — 7 Aspects

1. Business Capability
2. Business Process
3. Business Process Model
4. Role Management
5. Strategic Planning
6. Enterprise Architecture
7. Policy Management

#### Information & Data (Required) — 11 Aspects

1. Data Storage & Warehousing
2. Data Architecture & Modeling
3. Document & Content Management
4. Data Governance
5. Data Privacy & Security
6. Data Quality
7. Data Integration & Interoperability
8. Master Data Management
9. Reference Data Management
10. Business Intelligence
11. Metadata Management

#### Technology (Required) — 7 Sub-Dimensions, 22 Aspects

| Sub-Dimension                | Aspects                                                                                       |
| ---------------------------- | --------------------------------------------------------------------------------------------- |
| **Infrastructure**           | Compute & Hosting, Storage, Networking & Connectivity, Resilience & Scaling                   |
| **Integration**              | API & Interface Management, System Messaging, External Partner Integration                    |
| **Platform Services**        | Application Hosting, Business Rules & Workflow, Common Platform Functions                     |
| **Application Architecture** | Modular Architecture, User Interfaces, Session & State Management                             |
| **Security & Identity**      | Identity & Access Services, Consent Management, System & Data Protection, Security Monitoring |
| **Operations & Maintenance** | System Monitoring, System Operations                                                          |
| **Development & Release**    | Code & Configuration Management, Testing & Release, Security & Compliance                     |

### Terminology

To avoid confusion between the Capability Reference Model and ORBIT Model:

- **Capability Domain** → High-level capability grouping (e.g., "Care Management")
- **Capability Area** → Specific capability being assessed (e.g., "Establish Case")
- **Dimension** → ORBIT assessment category (Outcomes, Roles, Business, Information, Technology)
- **Sub-Dimension** → Only applies to Technology dimension (e.g., "Infrastructure", "Integration")
- **Aspect** → Individual assessment criteria within a dimension/sub-dimension (e.g., "Data Governance")

### Maturity Levels

| Level | Name           | Description                                                                                                                                                                                                                                                            |
| ----- | -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1     | Initial        | SMA seeks to adopt enterprise-wide planning and architectural frameworks to improve program delivery. Current processes are unstructured, reactive, and inconsistent.                                                                                                  |
| 2     | Developing     | SMA complies with federal regulations and guidance and has begun adopting MES industry-recognized planning and architectural frameworks. Although basic processes and systems exist, they are not fully standardized or documented.                                    |
| 3     | Defined        | SMA complies with federal regulations and guidance and has fully implemented MES industry-recognized planning and architectural frameworks. Processes, systems, and strategies are standardized, well-documented, and aligned across the organization.                 |
| 4     | Managed        | SMA maintains compliance, follows industry-recognized planning and architectural frameworks, and monitors MES performance to meet goals. The organization is a thought-leader in the MES ecosystem and actively collaborates and shares approaches with other SMAs.    |
| 5     | Optimized      | The SMA employs advanced, data-driven strategies to manage MES planning and architecture to align predictive decision-making with the SMA's long-term goals. The organization is nationally recognized and actively collaborates and shares solutions with other SMAs. |
| N/A   | Not Applicable | Does not apply to this capability. Added by request of SMAs during listening sessions in late 2024.                                                                                                                                                                    |

> **Note:** The MITA 4.0 Reference Document includes personas to describe maturity levels (see Figure 2 in the source document), but the specific persona names are in an image and not available in text form.

### Scoring Logic

- **Aspect Score**: Selected maturity level (1-5, or excluded if N/A)
- **Dimension Score**: Average of aspect scores within dimension
- **Capability Area Score**: Average of all dimension scores
- **Capability Domain Score**: Average of all capability area scores within domain
- **No weighting** — simple averages throughout

---

## Application Structure

```
mita-4.0/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── assessment/          # ORBIT assessment components
│   │   ├── dashboard/           # Dashboard components
│   │   ├── export/              # Export dialogs and handlers
│   │   └── layout/              # Header, footer, navigation
│   ├── data/
│   │   ├── capabilities.json    # Capability domains and areas
│   │   └── orbit-model.json     # ORBIT maturity criteria
│   ├── hooks/
│   │   ├── useCapabilityAssessments.ts
│   │   ├── useOrbitRatings.ts
│   │   ├── useScores.ts
│   │   ├── useTags.ts
│   │   └── useHistory.ts
│   ├── pages/
│   │   ├── Home.tsx             # Landing page
│   │   ├── Dashboard.tsx        # Main assessment hub
│   │   ├── Assessment.tsx       # ORBIT assessment flow
│   │   ├── Results.tsx          # Overall results
│   │   ├── DomainResults.tsx    # Domain-level results
│   │   ├── AreaResults.tsx      # Capability area results
│   │   └── About.tsx            # About MITA 4.0 and the tool
│   ├── services/
│   │   ├── db.ts                # Dexie database setup
│   │   ├── capabilities.ts      # Capability data utilities
│   │   ├── orbit.ts             # ORBIT model utilities
│   │   ├── scoring.ts           # Score calculations
│   │   └── export/              # Export handlers (PDF, CSV, etc.)
│   ├── types/
│   │   └── index.ts             # TypeScript interfaces
│   ├── theme/
│   │   └── index.ts             # MUI theme customization
│   ├── App.tsx
│   ├── main.tsx
│   └── vite-env.d.ts
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── PROJECT_FOUNDATION.md
```

---

## Screen Specifications

### 1. Home (Landing Page)

**Purpose:** Explain the tool, establish trust around privacy.

**Content:**

- Hero section with tool name and tagline
- Clear statement: "All data stays in your browser"
- "Get Started" CTA → Dashboard
- Brief explanation of MITA 4.0 and ORBIT framework
- Feature highlights (privacy, offline, export)

### 2. Dashboard (Central Hub)

**Purpose:** View all capability domains/areas and their assessment status.

**Layout:**

- Header with navigation
- Filter bar (tag filter, search)
- Expandable table: Domains → Areas
- Progress indicators (stacked bars for domains, simple bars for areas)
- Action menu for each capability area

**Columns:**
| Column | Description |
|--------|-------------|
| Domain / Area | Expandable hierarchy |
| Score | Average maturity score (1-5) or "—" |
| Tags | Chips from latest finalized |
| Status | Progress bar (not started = no record exists) |
| Completion | Percentage |
| Last Assessed | Date |
| Action | Start / ••• menu |

**Action Menu (per capability area):**
| Status | Available Actions |
|--------|-------------------|
| Not Started | Start |
| In Progress | Resume, View, Delete |
| Finalized | Edit, View, Export, Delete |

**Dashboard Features (from mita-3.0):**

1. **Tagging System**
   - Add custom tags to assessments (e.g., "#wave-1", "#provider-module")
   - Tag autocomplete from previously used tags
   - Filter dashboard by tags (multi-select)
   - Tags displayed as chips on capability rows
   - Aggregated tags shown at domain level

2. **Progress Tracking**
   - Stacked progress bars for domains (finalized | in-progress | not-started counts)
   - Simple progress bars for capability areas (% of aspects answered)
   - Overall completion stats in header
   - Visual distinction between finalized (solid) and in-progress (striped)

3. **Assessment History**
   - Expandable history panel per capability area
   - Shows all previous finalized assessments with dates and scores
   - "Current" badge on active finalized assessment
   - View historical assessment details
   - Delete individual history entries

4. **Assessment Actions**
   - **Start**: Create new assessment for capability area
   - **Resume**: Continue in-progress assessment
   - **Edit**: Modify finalized assessment (creates history snapshot first)
   - **View**: Read-only view of assessment
   - **Export**: Export individual capability area report (PDF)
   - **Delete**: Remove assessment (with confirmation)

5. **Carry-Forward / Previous Scores Display**
   - When editing a finalized assessment, previous ratings are preserved as "hints"
   - UI shows previous level selection with visual indicator (e.g., dashed border, "Previous: Level 3" badge)
   - User must explicitly re-confirm or change each rating
   - Prevents accidental submission of stale data
   - Notes, barriers, and plans are copied and editable
   - Tags are copied and editable

### 3. Assessment Page (ORBIT Flow)

**Purpose:** Guide user through ORBIT dimension assessments for a capability area.

**Layout:**

- Sticky header: Capability name, progress, tags
- Sidebar: Dimension navigation (collapsible on mobile)
- Main content: Current dimension/aspect assessment
- Footer: Previous / Next navigation

**Flow:**

1. Capability Overview (context)
2. Outcomes (optional) → 6 aspects
3. Roles (optional) → 6 aspects
4. Business Architecture → 7 aspects
5. Information & Data → 11 aspects
6. Technology → 7 sub-dimensions → 22 aspects
7. Review & Finalize

**Per-Aspect Assessment Fields:**

- Maturity level selection (1-5 or N/A)
- Question checkboxes (per level)
- Evidence checkboxes (per level)
- Notes (free text)
- Barriers and challenges (free text)
- Advancement plans (free text)
- **File attachments** (upload PDFs, docs, images as evidence)

**File Attachment Features:**

- Drag-and-drop or click to upload
- Supported formats: PDF, DOC/DOCX, XLS/XLSX, PNG, JPG, TXT
- Max file size: 10MB per file (configurable)
- Multiple attachments per aspect
- Preview/download attached files
- Delete attachments
- Optional description per attachment
- Files stored locally in IndexedDB (no server upload)

### 4. Results Pages

Results pages provide visual summaries of assessment data at three levels:

#### Overall Results (`/results`)

- **Summary cards**: Total capability areas assessed, overall average maturity, completion %
- **Domain comparison chart**: Bar or radar chart comparing all domain scores
- **Maturity heatmap**: Domains × Dimensions grid showing maturity levels with color coding
- **Quick links**: Navigate to individual domain results

#### Domain Results (`/results/:domainId`)

- **Domain summary card**: Domain name, average score, areas assessed
- **Capability area comparison**: Bar chart of all area scores within domain
- **Dimension breakdown table**: Each area's scores across ORBIT dimensions
- **Trend indicators**: Show improvement from previous assessments (if history exists)

#### Capability Area Results (`/results/:domainId/:areaId`)

- **ORBIT radar chart**: Spider/radar chart showing all 5 dimension scores
- **Dimension score cards**: Individual cards for each dimension with score and status
- **Aspect breakdown**: Expandable sections showing aspect-level details
- **Assessment notes**: Summary of notes, barriers, and advancement plans
- **History comparison**: Side-by-side with previous assessment (if exists)

#### Export Integration

Export functionality is integrated into Results pages rather than a standalone page:

- Each Results page has an "Export" button that exports that specific view
- Overall Results → Export full Maturity Profile (PDF/CSV)
- Domain Results → Export domain report (PDF)
- Capability Area Results → Export area report (PDF)
- Dashboard also has "Export All" quick action

### 5. About Page (`/about`)

**Purpose:** Provide detailed information about MITA 4.0 and the tool.

**Content:**

- **MITA 4.0 Overview**: What is MITA, purpose, goals
- **ORBIT Framework**: Detailed explanation of the 5 dimensions
- **Maturity Levels**: Level 1-5 descriptions with examples/personas
- **Capability Reference Model**: Overview of domains and areas
- **How to Use This Tool**: Quick start guide
- **Resources**: Links to official CMS/MITA documentation
- **About This Tool**: Version, credits, open source info

### 6. Export

Export is integrated into Results pages (see above). Supported formats:

- **PDF**: Professional report with scores, charts, details
- **CSV**: Maturity Profile format for CMS submission
- **JSON**: Full data backup/restore (importable format)
- **ZIP**: Complete export package including:
  - PDF report
  - JSON data
  - All file attachments organized by capability area/aspect
  - Manifest file listing all contents

#### Maturity Profile CSV Format (CMS Standard)

The Maturity Profile is the standardized format for submitting assessment results to CMS. SMAs complete one profile per Capability Domain assessed. The template is located at `src/data/templates/maturity-profile-template.csv`.

```csv
MITA 4.0 Maturity Profile: <state name>,,,
,,,
Capability Domain: <Domain Name Here>,,,
ORBIT,As Is,To Be,Notes:
Outcomes,,,
Roles,,,
Business Processes,,,
Business Architecture,,,
Information/Data Architecture,,,
Technical Architecture,,,
```

**Export Requirements:**

- One CSV file per Capability Domain
- "As Is" column contains current maturity level (1-5 or N/A)
- "To Be" column contains target maturity level (optional)
- "Notes" column for additional context
- File can be uploaded to MES Hub (MESH) for CMS review

**Attachment Handling in Export:**

- Attachments are bundled into the ZIP export
- Folder structure: `attachments/{domain}/{area}/{dimension}/{aspect}/filename.pdf`
- PDF report includes attachment references (file names listed, not embedded)
- JSON export includes attachment metadata (not blob data)
- Full ZIP export includes everything for complete backup/restore

### 7. Import

Since this is a local-only application, import functionality is critical for:

- Sharing assessments between users/browsers
- Backing up and restoring data
- Migrating to a new device
- Collaboration (export → share → import)

**Import Formats:**

- **JSON**: Import assessment data (without attachments)
- **ZIP**: Import complete package (assessment data + attachments)

**Import Flow:**

1. User clicks "Import" button (available in Dashboard header)
2. File picker opens (accepts .json or .zip)
3. System validates the file structure and version compatibility
4. Preview dialog shows what will be imported:
   - Number of capability assessments
   - Number of attachments (if ZIP)
   - Any conflicts with existing data
5. User chooses conflict resolution:
   - **Skip**: Don't import items that already exist
   - **Replace**: Overwrite existing items with imported data
   - **Keep Both**: Import as new items (new IDs generated)
6. Import executes with progress indicator
7. Success/error summary displayed

**Import Validation:**

- Schema version check (warn if importing from different version)
- Required fields validation
- File integrity check for attachments
- Size limits enforcement

**Conflict Detection:**

- Match by capability area ID + assessment ID
- Show side-by-side comparison for conflicts
- Allow per-item conflict resolution for advanced users

**Import Location:**

- "Import" button in Dashboard header (next to "Export All")
- Also accessible from Settings/Data Management section

### Export/Import Data Format

The JSON export follows a standardized structure for portability:

```json
{
  "exportVersion": "1.0",
  "exportDate": "2026-01-16T12:00:00Z",
  "appVersion": "0.1.0",
  "data": {
    "assessments": [...],      // CapabilityAssessment records
    "ratings": [...],          // OrbitRating records
    "history": [...],          // AssessmentHistory records
    "tags": [...],             // Tag records
    "attachments": [...]       // Attachment metadata (blobs in ZIP only)
  },
  "metadata": {
    "totalAssessments": 5,
    "totalAttachments": 12,
    "capabilities": ["care-management/establish-case", ...]
  }
}
```

**ZIP Structure:**

```
export-2026-01-16.zip
├── data.json                 # Full JSON export
├── report.pdf                # PDF summary report
├── attachments/
│   ├── care-management/
│   │   └── establish-case/
│   │       └── business/
│   │           └── business-capability/
│   │               ├── evidence-doc.pdf
│   │               └── screenshot.png
│   └── ...
└── manifest.json             # File listing with checksums
```

---

## Development Phases

### Phase 1: Project Setup ✅

- [x] Create project structure
- [x] Configure Vite, TypeScript, ESLint
- [x] Set up MUI theme
- [x] Create basic routing (Home, Dashboard)
- [x] Create Layout component
- [x] Create PROJECT_FOUNDATION.md
- [x] Install dependencies and verify dev server runs

### Phase 2: Data Layer ✅

- [x] Create `capabilities.json` from mita-old source
- [x] Create `orbit-model.json` from MITA 4.0 Reference Document
- [x] Set up Dexie database schema
- [x] Create TypeScript types
- [x] Create data loading utilities
- [x] Create core hooks (useCapabilityAssessments, useOrbitRatings)

### Phase 3: Dashboard ✅

- [x] Build capability domain/area expandable table
- [x] Implement progress indicators (stacked bars for domains, simple for areas)
- [x] Add action menu (Start, Resume, Edit, View, Export, Delete)
- [x] Implement tag input component with autocomplete
- [x] Add tag filtering (multi-select)
- [x] Show assessment history panel (expandable per area)
- [x] Add delete confirmation dialogs
- [x] Implement search/filter by capability name

### Phase 4: Assessment Flow

- [x] Create assessment page layout
- [x] Build dimension navigation sidebar
- [x] Create aspect assessment component
- [x] Implement maturity level selection
- [x] Add question/evidence checkboxes
- [x] Add notes, barriers, plans text fields
- [x] Build file attachment component (upload, preview, delete)
- [x] Implement attachment storage in IndexedDB
- [x] Implement auto-save
- [x] Build finalization flow

### Phase 5: Scoring & History

- [x] Implement scoring calculations (aspect → dimension → area → domain)
- [x] Create score display components
- [x] Implement assessment history snapshots on finalize
- [x] Implement edit flow (snapshot current → convert to suggestions)
- [x] Add carry-forward functionality (previousLevel field, visual hints)
- [x] Build history view dialog
- [x] Implement revert/discard edit functionality

### Phase 6: Results Pages

- [x] Create results page layout components
- [x] Build overall results page (`/results`)
- [x] Build domain results page (`/results/:domainId`)
- [x] Build capability area results page (`/results/:domainId/:areaId`)
- [x] Implement radar/spider charts for ORBIT dimensions
- [x] Implement bar charts for domain/area comparisons
- [x] Create maturity heatmap component
- [x] Add navigation between results levels

### Phase 7: Export & Import ✅

- [x] Create export service architecture
- [x] Implement PDF export with jsPDF (include charts)
- [x] Implement CSV export (Maturity Profile format)
- [x] Implement JSON export
- [x] Implement ZIP export with attachments (using JSZip)
- [x] Build export dialog UI with format selection
- [x] Handle attachment bundling and folder structure
- [x] Implement JSON import with validation
- [x] Implement ZIP import (data + attachments)
- [x] Build import dialog with preview and conflict resolution
- [x] Add import/export buttons to Dashboard header

### Phase 8: PWA & Polish

- [ ] Configure vite-plugin-pwa
- [ ] Add PWA icons and manifest
- [ ] Test offline functionality
- [ ] Build About page with MITA 4.0 content
- [ ] Accessibility audit
- [ ] Responsive design testing
- [ ] Error handling and edge cases

### Phase 9: Deployment

- [ ] Set up GitHub Actions workflow
- [ ] Configure GitHub Pages
- [ ] Test production build
- [ ] Deploy and verify

---

## Open Questions / Decisions

| Question                     | Status      | Decision                                                                                       |
| ---------------------------- | ----------- | ---------------------------------------------------------------------------------------------- |
| CSV export format for CMS    | ✅ Resolved | Maturity Profile template defined (see Export section)                                         |
| PDF report template          | Pending     | Template to be provided                                                                        |
| Capability list completeness | ✅ Resolved | Full model captured from MITA 4.0 Capability Reference Model v1.0 (75 areas across 14 domains) |
| ORBIT criteria completeness  | ✅ Resolved | Full model captured in `orbit-model.json` from MITA 4.0 Reference Doc v0.1                     |

---

## Key Decisions Made

| Decision                           | Rationale                                   |
| ---------------------------------- | ------------------------------------------- |
| Vite over Next.js                  | Simpler for static PWA, faster builds       |
| Two JSON data files                | Easy maintenance, clear separation          |
| Dexie.js for storage               | Reactive hooks, handles large data well     |
| MUI for UI                         | Clean, accessible, government-appropriate   |
| No weighting in scoring            | Per stakeholder decision, simple averages   |
| Single capability assessment model | Simpler UX than multi-capability containers |

---

## References

- [MITA 4.0 Maturity Model Reference](mita-old/instructions/MITA_4_MATURITY_MODEL_REFERENCE.md)
- [mita-3.0-ssa Repository](https://github.com/naretakis/mita-3.0-ssa)
- [mita-state-self-assessment-tool Repository](https://github.com/naretakis/mita-state-self-assessment-tool)
