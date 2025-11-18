# MITA State Self-Assessment Tool

A modern, browser-based application for state Medicaid agencies to assess the maturity of their Medicaid systems using the MITA NextGen capability-based framework.

## Project Overview

The MITA State Self-Assessment (SS-A) Tool helps state Medicaid agencies assess their systems using the MITA NextGen capability-based framework. It offers:

1. A modern, browser-based application with intuitive user experience
2. Integration with the MITA NextGen capability-based framework
3. Efficient assessment workflows with decision tree navigation
4. Local browser storage for data persistence
5. Visualization and export capabilities for actionable reporting

For detailed project documentation, including architecture, workflows, and development guidelines, see the **Kiro Specs** in the `.kiro/specs/` directory. The legacy instructions folder has been deprecated in favor of comprehensive Kiro specifications.

## Key Features

- **Professional User Interface**: Modern landing page with government-standard CMS Design System styling
- **Assessment Dashboard**: Comprehensive dashboard for managing assessments with progress tracking
- **In-browser functionality**: Works entirely in the browser with local storage
- **MITA NextGen Framework**: Full integration with the capability-based ORBIT dimensions including detailed checkbox-based assessment criteria
- **Guided Assessment Workflow**: Step-by-step assessment process with capability overviews and dimension-specific forms
- **Assessment Sidebar Navigation**: Industry-standard collapsible sidebar with capability progress tracking, direct section navigation, and mobile-responsive overlay design
- **Interactive Maturity Level Selection**: Card-based selection interface with validation, supporting evidence collection, and detailed checkbox-based evaluation criteria
- **Real-time Progress Tracking**: Sticky header with completion percentage, save status indicators, and step-by-step progress visualization
- **Enhanced Scoring System**: Advanced maturity score calculations with checkbox partial credit, real-time score updates, and comprehensive scoring breakdown
- **Comprehensive Results and Reporting**: Enhanced maturity score calculations, interactive charts, and detailed analysis with partial credit visualization
- **Assessment Results Visualization**: Bar charts for overall scores and radar charts for ORBIT dimension comparisons
- **Comprehensive Export Functionality**: Multi-format export system with PDF, CSV, JSON, and Markdown formats
- **Data Management**: Export/import functionality for assessment data portability
- **Robust Error Handling**: Comprehensive error boundaries with data preservation and recovery options
- **Streamlined Deployment**: Single-branch GitHub Pages deployment with automated workflows

### Navigation & User Experience

#### Assessment Header Features
- **Sticky Header Design**: Always-visible header that stays at the top during assessment navigation
- **Development Banner**: Prominent prototype status banner with links to feedback and documentation
- **Dashboard Navigation**: Quick return to dashboard with keyboard shortcut support (Alt+D)
- **Assessment Context**: Clear display of assessment name, system name, and current step information
- **Progress Tracking**: Real-time completion percentage with step counter (e.g., "Step 3 of 15")
- **Auto-Save Status**: Visual indicators showing "Saving...", "Saved [timestamp]", or "Not saved" states
- **Mobile-Responsive**: Adaptive layout with touch-friendly controls and optimized mobile navigation
- **Keyboard Shortcuts**: Alt+S to toggle sidebar, Alt+D for dashboard navigation

#### Assessment Sidebar Features
- **Capability-Based Navigation**: Organized by capability areas with expandable sections for ORBIT dimensions
- **Real-time Score Display**: Dynamic maturity scores that update instantly as users complete checkboxes
- **Enhanced Scoring Visualization**: Shows base maturity level scores plus checkbox bonus points with visual indicators
- **Progress Indicators**: Visual completion tracking with percentage bars for each capability area
- **Direct Section Access**: Jump to any assessment section without sequential navigation requirements
- **Collapsible Design**: Desktop sidebar can be collapsed to maximize content area with persistent state
- **Mobile Overlay**: Transforms to full-screen overlay on mobile devices with backdrop and swipe gestures

### Enhanced Scoring System

#### Real-time Score Calculation
- **Base Maturity Scores**: Traditional 1-5 maturity level scoring as the foundation
- **Checkbox Partial Credit**: Additional 0.25 points per completed checkbox within the selected maturity level
- **Dynamic Updates**: Scores update instantly in the sidebar as users interact with checkboxes
- **Visual Feedback**: Current dimension highlighted with blue badges and pulse animation
- **Completion Indicators**: Green badges for completed dimensions with final enhanced scores

#### Comprehensive Results Display
- **Enhanced Score Breakdown**: Results page shows base score + partial credit = final score
- **Detailed Dimension Analysis**: Each ORBIT dimension displays enhanced scores with bonus indicators
- **Interactive Visualizations**: Charts and graphs reflect true enhanced scores, not just base maturity levels
- **Export Integration**: PDF and CSV exports include enhanced scoring data with detailed breakdowns
- **Status Indicators**: Visual icons showing completed (✓), current (●), and pending (○) states for each step
- **Results Access**: Quick access to assessment results with keyboard shortcut (Alt+R)
- **Touch Gestures**: Swipe left to close on mobile devices for intuitive navigation
- **Keyboard Navigation**: Full keyboard accessibility with proper focus management and ARIA support
- **Auto-Expansion**: Automatically expands the capability section containing the current step

### Comprehensive Export Functionality

#### Multi-Format Export System
- **PDF Format**: Professional reports with typography, charts, and complete assessment data
- **CSV Format**: Structured data export for spreadsheet analysis and data processing
- **JSON Format**: Complete raw data export for system integration and backup purposes
- **Markdown Format**: Human-readable format for documentation and sharing

#### Export Features
- **Direct Action Buttons**: Streamlined export interface with one-click export for each format
- **Complete Data Capture**: All assessment metadata, enhanced scores, and user-generated content
- **Professional Formatting**: PDF exports include charts, proper typography, and structured layouts
- **Error Handling**: Robust error handling with user feedback and retry mechanisms
- **Performance Optimization**: Efficient export processing with progress indicators
- **Accessibility Compliance**: Full keyboard navigation and screen reader support

#### Enhanced Results Display
- **Compact Layout**: Reduced vertical scrolling with optimized spacing and component sizing
- **Consistent Design**: Proper contrast and readability with light mode styling
- **Interactive Elements**: Expandable sections with improved button sizing and hover states
- **Mobile Optimization**: Responsive design that works across all device sizes

## Contributing

Contributions are welcome! This project follows an open-source approach to enable community contributions.

Please see [CONTRIBUTING.md](CONTRIBUTING.md) for detailed contribution guidelines, including:
- Development workflow
- Code standards and quality requirements
- Pull request process
- Issue reporting guidelines

For detailed development information, review the **Kiro Steering Files** in `.kiro/steering/` and the **Kiro Specs** in `.kiro/specs/`. The legacy instructions folder has been deprecated.

### Documentation and Quality Assurance

This project includes automated documentation and quality checks:

#### Kiro Hooks
The project includes several Kiro hooks in `.kiro/hooks/` to help maintain documentation:
- **Document New Feature**: Updates README, CHANGELOG, and instruction files for new features
- **Update Changelog**: Adds properly formatted entries to CHANGELOG.md with current date
- **Sync All Documentation**: Comprehensive documentation review and consistency check
- **Pre-Commit Check**: Validates code quality and reminds about documentation updates

#### Automated Quality Checks
- **Git Pre-Commit Hook**: Automatically runs `npm run check` and reminds about documentation updates
- **Quality Gate**: Comprehensive checks including formatting, linting, testing, and build verification
- **Documentation Validation**: Ensures consistency between documentation and implementation

#### NPM Scripts for Documentation
- `npm run check`: Standard quality gate (format, lint, test, build)
- `npm run check:full`: Extended quality gate with documentation reminder
- `npm run docs:check`: Documentation consistency reminder

See [CHANGELOG.md](CHANGELOG.md) for version history and recent changes.

## Project Structure

```
mita-state-self-assessment-tool/
├── .github/
│   ├── ISSUE_TEMPLATE/  # GitHub issue templates
│   ├── workflows/       # CI/CD configuration
│   └── pull_request_template.md
├── public/
│   └── content/         # MITA capability definitions in Markdown
├── src/
│   ├── components/      # React components
│   │   ├── assessment/  # Assessment-specific components
│   │   ├── common/      # Shared UI components
│   │   ├── content/     # Content display components
│   │   ├── dashboard/   # Dashboard components
│   │   ├── layout/      # Layout components
│   │   ├── reporting/   # Reporting and visualization components
│   │   └── storage/     # Storage management components
│   ├── examples/        # Code examples and demonstrations
│   ├── hooks/           # Custom React hooks
│   ├── pages/           # Next.js pages
│   │   └── assessment/  # Assessment-related pages
│   ├── services/        # Application services
│   ├── styles/          # CSS styles
│   ├── types/           # TypeScript type definitions
│   └── utils/           # Utility functions
├── .kiro/               # Kiro specs, steering files, and hooks (primary documentation)
├── instructions/        # DEPRECATED - Legacy project documentation (see .kiro/ instead)
├── tests/               # Test files
│   ├── e2e/            # End-to-end tests
│   ├── fixtures/       # Test data and mocks
│   ├── integration/    # Integration tests
│   ├── unit/           # Unit tests
│   └── utils/          # Test utilities
├── CHANGELOG.md         # Version history and changes
├── CONTRIBUTING.md      # Contribution guidelines
├── DEPENDENCY_UPDATES.md # Dependency management log
└── [config files]       # Various configuration files
```

## Available Scripts

- `npm run format`: Format code with Prettier
- `npm run format:check`: Check formatting without making changes
- `npm run lint`: Run ESLint to check code quality
- `npm run lint:fix`: Automatically fix ESLint issues
- `npm run lint:report`: Generate a JSON report of linting issues
- `npm test`: Run all tests
- `npm run test:watch`: Run tests in watch mode
- `npm run test:coverage`: Generate test coverage report
- `npm run dev`: Start the development server
- `npm run build`: Build the application for production
- `npm run check`: Run formatting checks, linting, tests, and build verification
- `npm start`: Start the production server
- `npm run export`: Export the application as static HTML

## Development Workflow

1. **Branch Management**:
   - `main`: Production branch
   - Feature branches should be created from `main`

2. **Code Style**:
   - Follow the ESLint and Prettier configurations
   - Run `npm run check` before committing
   - VS Code users: Install recommended extensions for automatic formatting:
     - ESLint (dbaeumer.vscode-eslint)
     - Prettier (esbenp.prettier-vscode)

3. **Testing**:
   - Write tests for new features and bug fixes using Jest
   - Ensure all tests pass before submitting a pull request
   - Note: E2E tests are currently placeholders and will require Playwright or Cypress setup for actual implementation

4. **Pull Requests**:
   - Create pull requests against the `main` branch
   - Include a description of changes and related issues
   - Ensure CI checks pass before merging

## Deployment

The application is automatically deployed to GitHub Pages when changes are pushed to the `main` branch.

### Deployment URL
https://naretakis.github.io/mita-state-self-assessment-tool

### Manual Deployment
To trigger a manual deployment:
1. Go to the Actions tab in GitHub
2. Select "Deploy to GitHub Pages" workflow
3. Click "Run workflow"
4. Select the main branch
5. Click "Run workflow"

### Local Development
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run start
```

### Deployment Process

The application uses a streamlined single-branch deployment workflow:

1. **Automatic Deployment**: Push to `main` branch triggers GitHub Actions workflow
2. **Build Process**: Next.js builds static site with production configuration
3. **GitHub Pages Deployment**: Built files are automatically deployed to GitHub Pages
4. **Fast & Reliable**: Typical deployment completes in 3-5 minutes

### Setup Instructions

For detailed setup instructions, see [GITHUB_PAGES_SETUP.md](GITHUB_PAGES_SETUP.md).

**Quick Setup**:

1. **Enable GitHub Pages**:
   - Go to repository Settings > Pages
   - Source: GitHub Actions (not "Deploy from a branch")
   - Enable HTTPS enforcement

2. **Configuration**:
   - Base path is configured via `NEXT_PUBLIC_BASE_PATH` environment variable
   - Default: `/mita-state-self-assessment-tool`
   - Can be customized for forks/clones by updating the workflow file

### Troubleshooting

For comprehensive troubleshooting, see [GITHUB_PAGES_SETUP.md](GITHUB_PAGES_SETUP.md#troubleshooting).

**Common Issues**:

- **404 Errors**: Ensure GitHub Pages is enabled with "GitHub Actions" as source
- **Asset Loading Issues**: Verify `NEXT_PUBLIC_BASE_PATH` matches your repository name
- **Build Failures**: Check GitHub Actions logs for specific error messages
- **Slow Deployments**: First deployment may take longer; subsequent deployments use caching
- **Changes Not Appearing**: Hard refresh browser (Ctrl+Shift+R) or clear cache

## ContentService Structure

The application includes a ContentService that loads capability definitions from markdown files and provides methods to access them by ID or domain. The capability definitions are parsed using the capabilityParser utility.

## Browser Storage

The application uses browser storage for data persistence:

- **localStorage**: For long-term storage of assessment data
- **sessionStorage**: For temporary session data
- **indexedDB**: For larger datasets and offline capabilities, implemented using the idb library

The application includes a StorageService that provides a unified API for database operations and a useStorageAvailability hook that checks for storage availability and provides appropriate fallbacks.

## Performance Optimizations

The application includes several performance optimizations:

- **Code Splitting**: Dynamic imports for better loading performance
- **Image Optimization**: Progressive loading with placeholders
- **Caching Strategies**: In-memory caching with TTL
- **Webpack Optimizations**: Custom chunk splitting for optimal loading
- **Browser Storage**: Efficient local data persistence

## Accessibility

The application follows accessibility best practices:

- Uses semantic HTML elements
- Implements proper ARIA attributes
- Ensures keyboard navigation
- Maintains sufficient color contrast
- Integrates with CMS Design System for accessible components

## Built With

- [Next.js 15.3.3](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [CMS Design System](https://design.cms.gov/) - UI component library
- [Chart.js](https://www.chartjs.org/) - Data visualization
- [React Chart.js 2](https://react-chartjs-2.js.org/) - React wrapper for Chart.js
- [jsPDF](https://github.com/parallax/jsPDF) - PDF generation
- [jsPDF AutoTable](https://github.com/simonbengtsson/jsPDF-AutoTable) - Table generation for PDFs
- [gray-matter](https://github.com/jonschlinkert/gray-matter) - Front matter parser
- [react-markdown](https://github.com/remarkjs/react-markdown) - Markdown renderer
- [remark-gfm](https://github.com/remarkjs/remark-gfm) - GitHub Flavored Markdown support
- [js-yaml](https://github.com/nodeca/js-yaml) - YAML parsing
- [idb](https://github.com/jakearchibald/idb) - IndexedDB with Promises
- [Jest](https://jestjs.io/) - Testing framework
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) - Component testing utilities

## License

This project is licensed under the GNU General Public License v3.0 (GPL-3.0) - see the LICENSE file for details.

## How to Get Started Running the Tool Locally

### Prerequisites

- Node.js 18.0.0 or higher
- npm or yarn
- Git

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/username/mita-state-self-assessment-tool.git
   cd mita-state-self-assessment-tool
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env.local` file based on `.env.local.example`:
   ```
   cp .env.local.example .env.local
   ```

4. Start the development server:
   ```
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Development Roadmap

For detailed development priorities, timelines, and feature planning, see [ROADMAP.md](ROADMAP.md).

### Current Focus (November 2025)

The project is currently focused on:
1. **Infrastructure Simplification** - Streamlining deployment to single-branch GitHub Pages
2. **Repository Organization** - Cleaning up specs and documentation structure
3. **Content Updates** - Incorporating latest MITA framework definitions
4. **UX/UI Overhaul** - Modernizing interface with responsive design and improved accessibility

### Project Status

The application has implemented core functionality, with solid foundations in:
- ✅ Assessment workflow and navigation
- ✅ Data visualization and reporting
- ✅ Storage and data management

Target: Minimum Lovable Product (MLP) by December 2025
