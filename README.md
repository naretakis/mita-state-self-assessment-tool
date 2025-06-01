# MITA State Self-Assessment Tool

A modern, browser-based application for state Medicaid agencies to assess the maturity of their Medicaid systems using the MITA NextGen capability-based framework.

## Project Overview

The MITA State Self-Assessment (SS-A) Tool helps state Medicaid agencies assess their systems using the MITA NextGen capability-based framework. It offers:

1. A modern, browser-based application with intuitive user experience
2. Integration with the MITA NextGen capability-based framework
3. Efficient assessment workflows with decision tree navigation
4. Local browser storage for data persistence
5. Visualization and export capabilities for actionable reporting

For detailed project documentation, including architecture, workflows, and development guidelines, see the [Project Documentation](instructions/index.md) in the instructions folder.

## Key Features

- **In-browser functionality**: Works entirely in the browser with local storage
- **MITA NextGen Framework**: Full integration with the capability-based ORBIT dimensions
- **Decision tree-guided assessment**: Intuitive workflow for completing assessments
- **Maturity visualization**: Interactive dashboards showing maturity across capabilities
- **Export functionality**: Generate PDF and CSV reports for sharing and documentation
- **Multi-branch deployment**: Supports parallel development with isolated environments

## Getting Started

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

3. Start the development server:
   ```
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
mita-state-self-assessment-tool/
├── public/
│   └── content/         # MITA capability definitions in Markdown
├── src/
│   ├── components/      # React components
│   │   ├── assessment/  # Assessment-specific components
│   │   ├── common/      # Shared UI components
│   │   ├── layout/      # Layout components
│   │   └── reporting/   # Reporting and visualization components
│   ├── hooks/           # Custom React hooks
│   ├── pages/           # Next.js pages
│   ├── services/        # Application services
│   ├── styles/          # CSS styles
│   ├── types/           # TypeScript type definitions
│   └── utils/           # Utility functions
├── instructions/        # Project documentation
├── tests/               # Test files
├── .github/workflows/   # CI/CD configuration
└── [config files]       # Various configuration files
```

## Deployment

The application is deployed to GitHub Pages using GitHub Actions:

### GitHub Actions Workflow

A workflow file (`.github/workflows/deploy.yml`) handles automated deployment:

- **Triggers**: Runs on pushes to `main`, `dev`, and `test` branches
- **Multi-branch deployment**: Supports three environments simultaneously:
  - Production (`main` branch): `https://[username].github.io/mita-state-self-assessment-tool/`
  - Development (`dev` branch): `https://[username].github.io/mita-state-self-assessment-tool/dev/`
  - Testing (`test` branch): `https://[username].github.io/mita-state-self-assessment-tool/test/`
- **Build process**: Builds the Next.js app with static export
- **Dependency caching**: Implements npm caching for faster builds

To enable GitHub Pages deployment:
1. Go to repository Settings > Pages
2. Set the source to "GitHub Actions"

## MITA Framework Structure

The MITA NextGen framework uses a capability-based approach organized around ORBIT dimensions:

- **O**utcomes: Business results and objectives
- **R**oles: Who performs functions and responsibilities
- **B**usiness Processes: Workflows and procedures
- **I**nformation: Data structure and sharing
- **T**echnology: Technical implementation

Each capability is assessed across these dimensions with maturity levels from 1 (Initial) to 5 (Optimized).

## Testing

The project uses Jest and React Testing Library for testing:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Test Structure

- **Unit Tests**: Test individual components and functions
- **Integration Tests**: Test component interactions
- **E2E Tests**: Test complete user flows

## Performance Optimizations

The application includes several performance optimizations:

- **Code Splitting**: Dynamic imports for better loading performance
- **Image Optimization**: Progressive loading with placeholders
- **Caching Strategies**: In-memory caching with TTL
- **Webpack Optimizations**: Custom chunk splitting for optimal loading
- **Browser Storage**: Efficient local data persistence

## Built With

- [Next.js 15](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [CMS Design System](https://design.cms.gov/) - UI component library
- [Chart.js](https://www.chartjs.org/) - Data visualization
- [jsPDF](https://github.com/parallax/jsPDF) - PDF generation
- [gray-matter](https://github.com/jonschlinkert/gray-matter) - Front matter parser
- [react-markdown](https://github.com/remarkjs/react-markdown) - Markdown renderer

## Development Roadmap

The Minimum Lovable Product (MLP) focuses on core functionality by August 2025:

### In Scope
- In-browser functionality with local storage
- MITA NextGen Framework integration
- Decision tree-guided assessment process
- Basic maturity visualization and reporting
- PDF and CSV export functionality

### Future Enhancements (Post-MLP)
- Authentication and access control
- Advanced collaboration features
- Centralized data repository
- APD integration
- Advanced analytics

## License

This project is licensed under the GNU General Public License v3.0 (GPL-3.0) - see the LICENSE file for details.

## Contributing

Contributions are welcome! This project follows an open-source approach to enable community contributions. Please review the development guidelines in the [instructions folder](instructions/development_guide.md) before contributing.