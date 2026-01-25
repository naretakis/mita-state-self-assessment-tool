# MITA 4.0 State Self-Assessment Tool

A Progressive Web App (PWA) enabling State Medicaid Agencies (SMAs) to self-assess their Medicaid Enterprise maturity using the **MITA 4.0 Maturity Model**.

## Overview

The MITA 4.0 State Self-Assessment Tool helps State Medicaid Agencies evaluate their Medicaid Enterprise Systems (MES) maturity across **75 capability areas** using the standardized **ORBIT Maturity Model**. The tool is:

- **Privacy-First**: All data stays in your browser. No data is transmitted or stored remotely.
- **Offline-First**: Full functionality after initial load, even without network connectivity.
- **Accessible**: WCAG 2.1 AA compliant for government use.

### What is ORBIT?

ORBIT is the MITA 4.0 maturity assessment framework with five dimensions:

| Dimension                 | Required | Aspects                      |
| ------------------------- | -------- | ---------------------------- |
| **O**utcomes              | Optional | 6                            |
| **R**oles                 | Optional | 6                            |
| **B**usiness Architecture | Required | 7                            |
| **I**nformation & Data    | Required | 11                           |
| **T**echnology            | Required | 22 (across 7 sub-dimensions) |

Each aspect is rated on a 5-level maturity scale:

- **Level 1**: Initial
- **Level 2**: Developing
- **Level 3**: Defined
- **Level 4**: Managed
- **Level 5**: Optimized

## Features

### Dashboard

- Hierarchical view of all 14 capability domains and 75 areas
- Progress tracking with visual indicators
- Tag-based organization and filtering
- Assessment history with snapshots

### Assessment Workflow

- Guided assessment through all ORBIT dimensions
- Question checklists and evidence tracking per maturity level
- File attachment support (PDF, DOC, XLS, images)
- Auto-save with debounced updates
- Notes, barriers, and advancement plans per aspect

### Results & Reporting

- Overall maturity scores and visualizations
- Domain and capability area breakdowns
- Strengths and gaps analysis
- Radar charts and comparison views

### Import/Export

- **PDF**: Professional reports for stakeholders
- **CSV**: CMS Maturity Profile standard format
- **JSON**: Full data backup and restore
- **ZIP**: Complete package with attachments

## Quick Start

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/mita-4.0-ssa.git
cd mita-4.0-ssa/mita-4.0

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
# Build
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
mita-4.0/
├── src/
│   ├── components/       # React components by feature
│   │   ├── assessment/   # ORBIT assessment UI
│   │   ├── dashboard/    # Dashboard components
│   │   ├── export/       # Import/export dialogs
│   │   ├── layout/       # Header, footer, navigation
│   │   └── results/      # Results visualization
│   ├── data/             # Static JSON data files
│   │   ├── capabilities.json   # 75 capability areas
│   │   └── orbit-model.json    # ORBIT maturity criteria
│   ├── hooks/            # Custom React hooks
│   ├── pages/            # Route page components
│   ├── services/         # Business logic & utilities
│   │   └── export/       # Export handlers
│   ├── types/            # TypeScript interfaces
│   ├── theme/            # MUI theme customization
│   └── utils/            # Utility functions
├── docs/                 # MITA 4.0 reference documents
└── public/               # Static assets
```

## Tech Stack

| Layer      | Technology                      |
| ---------- | ------------------------------- |
| Build      | Vite 6                          |
| Framework  | React 18                        |
| Language   | TypeScript (strict mode)        |
| Routing    | React Router v7                 |
| UI         | Material UI v6                  |
| State      | React Hooks + Dexie React Hooks |
| Storage    | Dexie.js (IndexedDB)            |
| PDF Export | jsPDF + jsPDF-AutoTable         |
| ZIP Export | JSZip                           |
| Charts     | Chart.js + react-chartjs-2      |
| Testing    | Vitest + React Testing Library  |

## Available Scripts

```bash
# Development
npm run dev          # Start dev server
npm run build        # Production build
npm run preview      # Preview production build

# Code Quality
npm run lint         # ESLint check
npm run lint:fix     # ESLint auto-fix
npm run format       # Prettier format
npm run format:check # Prettier check
npm run typecheck    # TypeScript type check
npm run audit:code   # Detect unused code (knip)

# Testing
npm test             # Run tests once
npm run test:watch   # Watch mode
npm run test:coverage # Coverage report
```

## Data Architecture

The application uses two primary JSON files that can be edited to update capabilities or ORBIT criteria:

### Capability Reference Model (`capabilities.json`)

Defines **what** can be assessed:

- 14 capability domains across 3 layers (Strategic, Core, Support)
- 75 capability areas with descriptions and topics
- No maturity questions—just metadata

### ORBIT Model (`orbit-model.json`)

Defines **how** assessments are conducted:

- 5 dimensions with 52 total aspects
- Standardized maturity criteria applied to ALL capability areas
- Questions and evidence requirements per maturity level

### Local Storage (IndexedDB)

All user data is stored locally:

- Capability assessments (one per area)
- ORBIT ratings (one per aspect per assessment)
- File attachments (stored as Blobs)
- Assessment history (snapshots)
- Tags for organization

## Browser Support

- Chrome 90+
- Firefox 90+
- Safari 15+
- Edge 90+

Requires IndexedDB and Service Worker support for full PWA functionality.

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`npm test`)
5. Run linting (`npm run lint`)
6. Commit with conventional commits (`git commit -m 'feat: add amazing feature'`)
7. Push to your branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

## Documentation

- [PROJECT_FOUNDATION.md](PROJECT_FOUNDATION.md) - Architecture and design decisions
- [CHANGELOG.md](CHANGELOG.md) - Version history
- [docs/MITA_4.0_Maturity_Model_List_Format.md](docs/MITA_4.0_Maturity_Model_List_Format.md) - ORBIT maturity criteria reference
- [docs/MITA_4.0_Capability_Reference_Model.md](docs/MITA_4.0_Capability_Reference_Model.md) - Capability domains and areas reference

## License

This project is licensed under the GPLv3 (GNU General Public License Version 3) License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- MITA Governance Board
- MITA 4.0 NextGen Workgroup
- Centers for Medicare & Medicaid Services (CMS)
