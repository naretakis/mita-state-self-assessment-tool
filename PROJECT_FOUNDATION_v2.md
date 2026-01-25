# MITA 4.0 State Self-Assessment Tool — Project Foundation v2

## Overview

A Progressive Web App (PWA) enabling State Medicaid Agencies (SMAs) to self-assess their Medicaid Enterprise maturity using the **MITA 4.0 ORBIT Maturity Model**. The application is fully client-side, offline-first, and stores all data locally in the browser.

**Version:** 2.0  
**Last Updated:** January 25, 2026  
**Target Deployment:** GitHub Pages

> **Note:** This document (v2) reflects the current implementation.

---

## Core Principles

1. **Privacy First**: All data stays in the browser. No data transmitted or stored remotely.
2. **Offline First**: Full functionality after initial load, even without network.
3. **Maintainability**: Capability and ORBIT data in separate, easily-editable JSON files.
4. **Accessibility**: Government-appropriate, WCAG 2.1 AA compliant UI.
5. **Simplicity**: Clean architecture, minimal dependencies, clear code.

---

## Tech Stack

| Layer            | Technology                      |
| ---------------- | ------------------------------- |
| Build Tool       | Vite 6                          |
| Framework        | React 18                        |
| Language         | TypeScript (strict mode)        |
| Routing          | React Router v7                 |
| UI Library       | Material UI (MUI) v6            |
| State Management | React Hooks + Dexie React Hooks |
| Client Storage   | Dexie.js (IndexedDB)            |
| PDF Export       | jsPDF + jsPDF-AutoTable         |
| ZIP Export       | JSZip                           |
| Charts           | Chart.js + react-chartjs-2      |
| Testing          | Vitest + React Testing Library  |
| PWA              | vite-plugin-pwa                 |
| CI/CD            | GitHub Actions                  |

---

## Application Structure

```
mita-4.0/
├── src/
│   ├── components/
│   │   ├── assessment/       # ORBIT assessment workflow components
│   │   ├── dashboard/        # Dashboard and capability management
│   │   ├── export/           # Import/export dialogs
│   │   ├── layout/           # Header, footer, navigation
│   │   └── results/          # Results visualization components
│   ├── constants/            # Application constants
│   ├── data/
│   │   ├── capabilities.json # Capability domains and areas (75 areas)
│   │   ├── orbit-model.json  # ORBIT maturity criteria (52 aspects)
│   │   └── templates/        # Export templates (CSV)
│   ├── hooks/                # Custom React hooks
│   ├── pages/                # Route page components
│   ├── services/
│   │   ├── db.ts             # Dexie database setup
│   │   ├── capabilities.ts   # Capability data utilities
│   │   ├── orbit.ts          # ORBIT model utilities
│   │   ├── scoring.ts        # Score calculations
│   │   └── export/           # Export/import services
│   ├── styles/               # Global CSS utilities
│   ├── test/                 # Test setup
│   ├── theme/                # MUI theme customization
│   ├── types/                # TypeScript interfaces
│   ├── utils/                # Utility functions
│   ├── App.tsx               # Root component with routing
│   └── main.tsx              # Entry point
├── .github/
│   ├── ISSUE_TEMPLATE/       # Bug, feature, docs templates
│   ├── workflows/            # CI and deploy workflows
│   └── PULL_REQUEST_TEMPLATE.md
├── docs/                     # MITA 4.0 reference documents
├── CHANGELOG.md
├── CONTRIBUTING.md
├── README.md
└── SECURITY.md
```

---

## Data Architecture

### Two Primary Data Files

#### 1. `src/data/capabilities.json` — Capability Reference Model

Defines **what** can be assessed. Contains 75 capability areas across 14 domains organized into three layers.

**Domain Structure:**

```typescript
// Standard domain (most domains)
interface StandardCapabilityDomain {
  id: string;
  name: string;
  layer: 'strategic' | 'core' | 'support';
  description: string;
  areas: CapabilityArea[];
}

// Categorized domain (Data Management, Technical)
interface CategorizedCapabilityDomain {
  id: string;
  name: string;
  layer: 'strategic' | 'core' | 'support';
  description: string;
  categories: CapabilityCategory[]; // Contains nested areas
}

interface CapabilityArea {
  id: string;
  name: string;
  description: string;
  topics: string[];
}
```

**Capability Model Summary:**

| Layer     | Domains | Capability Areas |
| --------- | ------- | ---------------- |
| Strategic | 2       | 5                |
| Core      | 8       | 31               |
| Support   | 4       | 39               |
| **Total** | **14**  | **75**           |

#### 2. `src/data/orbit-model.json` — ORBIT Maturity Criteria

Defines **how** assessments are conducted. Contains standardized maturity criteria applied to ALL capability areas.

**ORBIT Model Structure:**

| Dimension             | Required | Aspects                      |
| --------------------- | -------- | ---------------------------- |
| Outcomes              | No       | 6                            |
| Roles                 | No       | 6                            |
| Business Architecture | Yes      | 7                            |
| Information & Data    | Yes      | 11                           |
| Technology            | Yes      | 22 (across 7 sub-dimensions) |
| **Total**             |          | **52**                       |

**Technology Sub-Dimensions:**

1. Infrastructure (4 aspects)
2. Integration (3 aspects)
3. Platform Services (3 aspects)
4. Application Architecture (3 aspects)
5. Security and Identity (4 aspects)
6. Operations and Maintenance (2 aspects)
7. Development and Release (3 aspects)

**Maturity Levels:**

| Level | Name           | Description                                                |
| ----- | -------------- | ---------------------------------------------------------- |
| 1     | Initial        | Unstructured, reactive, inconsistent processes             |
| 2     | Developing     | Basic processes exist, not fully standardized              |
| 3     | Defined        | Standardized, documented, aligned processes                |
| 4     | Managed        | Performance monitored, thought-leader collaboration        |
| 5     | Optimized      | Data-driven, nationally recognized, continuous improvement |
| N/A   | Not Applicable | Does not apply to this capability                          |

---

## Database Schema (Dexie.js / IndexedDB)

### Core Tables

#### CapabilityAssessment

One record per capability area being assessed. "Not started" is implied by no record existing.

```typescript
interface CapabilityAssessment {
  id: string; // UUID
  capabilityDomainId: string; // e.g., "provider-management"
  capabilityDomainName: string; // e.g., "Provider Management"
  capabilityAreaId: string; // e.g., "provider-enrollment"
  capabilityAreaName: string; // e.g., "Provider Enrollment"
  status: 'in_progress' | 'finalized';
  tags: string[]; // User-defined tags
  createdAt: Date;
  updatedAt: Date;
  finalizedAt?: Date;
  overallScore?: number; // Calculated when finalized
}
```

**Indexes:** `id, capabilityAreaId, capabilityDomainId, status, updatedAt, *tags`

#### OrbitRating

One record per aspect per capability assessment.

```typescript
interface OrbitRating {
  id: string; // UUID
  capabilityAssessmentId: string; // FK to CapabilityAssessment
  dimensionId: OrbitDimensionId; // 'outcomes' | 'roles' | 'businessArchitecture' | 'informationData' | 'technology'
  subDimensionId?: TechnologySubDimensionId; // Only for technology dimension
  aspectId: string; // e.g., "data-governance"
  currentLevel: MaturityLevelWithNA; // -1 (N/A), 0 (not assessed), 1-5
  targetLevel?: MaturityLevelWithNA; // "To Be" target level
  previousLevel?: MaturityLevelWithNA; // Carry-forward hint
  questionResponses: QuestionResponse[];
  evidenceResponses: EvidenceResponse[];
  notes: string;
  barriers: string;
  plans: string;
  carriedForward: boolean;
  attachmentIds: string[]; // FK references to Attachment
  updatedAt: Date;
}

type OrbitDimensionId =
  | 'outcomes'
  | 'roles'
  | 'businessArchitecture'
  | 'informationData'
  | 'technology';

type TechnologySubDimensionId =
  | 'infrastructure'
  | 'integration'
  | 'platformServices'
  | 'applicationArchitecture'
  | 'securityIdentity'
  | 'operationsMaintenance'
  | 'developmentRelease';

type MaturityLevelWithNA = -1 | 0 | 1 | 2 | 3 | 4 | 5;
```

**Indexes:** `id, capabilityAssessmentId, [capabilityAssessmentId+dimensionId+aspectId], [capabilityAssessmentId+dimensionId+subDimensionId+aspectId]`

#### Attachment

File attachments stored as Blobs in IndexedDB.

```typescript
interface Attachment {
  id: string;
  capabilityAssessmentId: string;
  orbitRatingId: string;
  fileName: string;
  fileType: string; // MIME type
  fileSize: number; // Bytes
  blob: Blob; // Actual file data
  description?: string;
  uploadedAt: Date;
}
```

**Indexes:** `id, capabilityAssessmentId, orbitRatingId, uploadedAt`

#### AssessmentHistory

Snapshots of finalized assessments for history tracking.

```typescript
interface AssessmentHistory {
  id: string;
  capabilityAssessmentId: string;
  capabilityAreaId: string;
  snapshotDate: Date;
  tags: string[];
  overallScore: number;
  dimensionScores: Record<string, number>;
  ratings: HistoricalRating[]; // Lightweight snapshot (no blobs)
}

interface HistoricalRating {
  dimensionId: OrbitDimensionId;
  subDimensionId?: TechnologySubDimensionId;
  aspectId: string;
  currentLevel: MaturityLevelWithNA;
  targetLevel?: MaturityLevelWithNA;
  questionResponses: QuestionResponse[];
  evidenceResponses: EvidenceResponse[];
  notes: string;
  barriers: string;
  plans: string;
}
```

**Indexes:** `id, capabilityAssessmentId, capabilityAreaId, snapshotDate`

#### Tag

Tags for autocomplete functionality.

```typescript
interface Tag {
  id: string;
  name: string;
  usageCount: number;
  lastUsed: Date;
}
```

**Indexes:** `id, name, usageCount, lastUsed`

---

## Scoring Logic

Scoring uses simple averages throughout (no weighting, per stakeholder decision).

```typescript
interface AspectScore {
  aspectId: string;
  aspectName: string;
  dimensionId: OrbitDimensionId;
  subDimensionId?: TechnologySubDimensionId;
  currentLevel: MaturityLevelWithNA;
  isAssessed: boolean;
}

interface DimensionScore {
  dimensionId: OrbitDimensionId;
  dimensionName: string;
  required: boolean;
  averageLevel: number | null; // null if no aspects assessed
  aspectScores: AspectScore[];
  subDimensionScores?: SubDimensionScore[]; // Only for Technology
}

interface SubDimensionScore {
  subDimensionId: TechnologySubDimensionId;
  subDimensionName: string;
  averageLevel: number | null;
  aspectScores: AspectScore[];
}
```

**Calculation Rules:**

- N/A ratings are excluded from averages
- Unassessed aspects (level 0) are excluded from averages
- Scores are rounded to 1 decimal place
- Dimension score = average of aspect scores
- Capability area score = average of dimension scores
- Domain score = average of capability area scores

---

## Routes

| Route                        | Page          | Purpose                                           |
| ---------------------------- | ------------- | ------------------------------------------------- |
| `/`                          | Landing       | Introduction, privacy statement, feature overview |
| `/dashboard`                 | Dashboard     | Central hub for viewing/managing assessments      |
| `/assessment/:assessmentId`  | Assessment    | ORBIT assessment workflow                         |
| `/history/:historyId`        | HistoryView   | View historical assessment snapshots              |
| `/results`                   | Results       | Overall maturity results                          |
| `/results/:domainId`         | DomainResults | Domain-level results                              |
| `/results/:domainId/:areaId` | AreaResults   | Capability area results                           |
| `/import-export`             | ImportExport  | Data import/export management                     |
| `/about`                     | About         | Tool usage guide and information                  |

---

## Custom Hooks

| Hook                              | Purpose                                          |
| --------------------------------- | ------------------------------------------------ |
| `useCapabilityAssessments()`      | CRUD operations for assessments, status tracking |
| `useOrbitRatings(assessmentId)`   | Rating management, dimension/aspect queries      |
| `useScores()`                     | Score calculations at all levels                 |
| `useTags()`                       | Tag management and autocomplete                  |
| `useHistory()`                    | Assessment history queries and management        |
| `useAttachments(assessmentId)`    | File upload/download/delete                      |
| `useDebounce(value, delay)`       | Debounced value for delayed updates              |
| `useDebouncedCallback(fn, delay)` | Debounced function execution                     |
| `useDebouncedSave(saveFn, delay)` | Auto-save with debouncing and dirty tracking     |

---

## Export Formats

| Format | Purpose              | Contents                             |
| ------ | -------------------- | ------------------------------------ |
| PDF    | Stakeholder reports  | Scores, charts, dimension breakdowns |
| CSV    | CMS Maturity Profile | Standard format for MESH upload      |
| JSON   | Data backup          | Full assessment data (no blobs)      |
| ZIP    | Complete backup      | JSON + PDF + all attachments         |

**CSV Maturity Profile Format:**

```csv
MITA 4.0 Maturity Profile: <state name>,,,
,,,
Capability Domain: <Domain Name>,,,
ORBIT,As Is,To Be,Notes:
Outcomes,<level>,<target>,<notes>
Roles,<level>,<target>,<notes>
Business Architecture,<level>,<target>,<notes>
Information & Data,<level>,<target>,<notes>
Technology,<level>,<target>,<notes>
```

---

## Import/Export Data Format

```json
{
  "exportVersion": "1.0",
  "exportDate": "2026-01-24T12:00:00Z",
  "appVersion": "0.1.0",
  "data": {
    "assessments": [],
    "ratings": [],
    "history": [],
    "tags": [],
    "attachments": []
  },
  "metadata": {
    "totalAssessments": 5,
    "totalAttachments": 12,
    "capabilities": ["provider-management/provider-enrollment", ...]
  }
}
```

**ZIP Structure:**

```
export-2026-01-24.zip
├── data.json
├── report.pdf
├── attachments/
│   └── <domain>/<area>/<dimension>/<aspect>/
│       └── filename.pdf
└── manifest.json
```

---

## Key Terminology

| Term                  | Definition                                                                                         |
| --------------------- | -------------------------------------------------------------------------------------------------- |
| **Capability Domain** | High-level capability grouping (e.g., "Provider Management")                                       |
| **Capability Area**   | Specific capability being assessed (e.g., "Provider Enrollment")                                   |
| **Dimension**         | ORBIT assessment category (Outcomes, Roles, Business Architecture, Information & Data, Technology) |
| **Sub-Dimension**     | Only applies to Technology (e.g., "Infrastructure", "Integration")                                 |
| **Aspect**            | Individual assessment criteria within a dimension (e.g., "Data Governance")                        |
| **Maturity Level**    | Rating from 1 (Initial) to 5 (Optimized), or N/A                                                   |

---

## References

- [MITA 4.0 Maturity Model List Format](docs/MITA_4.0_Maturity_Model_List_Format.md)
- [MITA 4.0 Capability Reference Model](docs/MITA_4.0_Capability_Reference_Model.md)
