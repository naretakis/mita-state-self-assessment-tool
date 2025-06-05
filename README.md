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

3. Create a `.env.local` file based on `.env.local.example`:
   ```
   cp .env.local.example .env.local
   ```

4. Start the development server:
   ```
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

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

- `npm run check`: Run linting, formatting checks, and tests
- `npm start`: Start the production server
- `npm run export`: Export the application as static HTML

## Development Workflow

1. **Branch Management**:
   - `main`: Production branch
   - `dev`: Development branch
   - `test`: Testing branch
   - Feature branches should be created from `dev`

2. **Code Style**:
   - Follow the ESLint and Prettier configurations
   - Run `npm run check` before committing
   - VS Code users: Install recommended extensions for automatic formatting

3. **Testing**:
   - Write tests for new features and bug fixes
   - Ensure all tests pass before submitting a pull request

4. **Pull Requests**:
   - Create pull requests against the `dev` branch
   - Include a description of changes and related issues
   - Ensure CI checks pass before merging

## Deployment

The application is deployed to GitHub Pages using GitHub Actions:

### GitHub Actions Workflow

A workflow file (`.github/workflows/deploy.yml`) handles automated deployment with multi-branch support:

- **Triggers**: Runs on pushes to `main`, `dev`, and `test` branches
- **Multi-branch deployment**: Supports three environments simultaneously:
  - Production (`main` branch): https://naretakis.github.io/mita-state-self-assessment-tool/
  - Development (`dev` branch): https://naretakis.github.io/mita-state-self-assessment-tool/dev/
  - Testing (`test` branch): https://naretakis.github.io/mita-state-self-assessment-tool/test/
- **Content preservation**: Downloads existing site content before deployment to preserve all environments
- **Branch-specific builds**: Each branch builds with the correct base path configuration
- **Single deployment target**: All branches deploy to the same GitHub Pages site but in different directories

### Setup Instructions

1. **Enable GitHub Pages**:
   - Go to repository Settings > Pages
   - Set the source to "GitHub Actions"

2. **Configure Next.js**:
   - The `next.config.js` file is already configured to use the correct base paths
   - Environment variables set in the workflow control the base path for each branch

3. **Branch Management**:
   - Push to `main` for production updates
   - Push to `dev` for development environment updates
   - Push to `test` for testing environment updates

4. **Accessing Deployments**:
   - Each environment is accessible at its respective URL
   - The workflow preserves all environments during each deployment

## MITA Framework Structure

The MITA NextGen framework uses a capability-based approach organized around ORBIT dimensions:

- **O**utcomes: Business results and objectives
- **R**oles: Who performs functions and responsibilities
- **B**usiness Processes: Workflows and procedures
- **I**nformation: Data structure and sharing
- **T**echnology: Technical implementation

Each capability is assessed across these dimensions with maturity levels from 1 (Initial) to 5 (Optimized).

## Browser Storage

The application uses browser storage for data persistence:

- **localStorage**: For long-term storage of assessment data
- **sessionStorage**: For temporary session data
- **indexedDB**: For larger datasets and offline capabilities

The application checks for storage availability and provides appropriate fallbacks.

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

## Contributing

Contributions are welcome! This project follows an open-source approach to enable community contributions.

### Contribution Guidelines

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`npm test`)
5. Commit your changes (`git commit -m 'Add some amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

Please review the development guidelines in the [instructions folder](instructions/development_guide.md) before contributing.

## License

This project is licensed under the GNU General Public License v3.0 (GPL-3.0) - see the LICENSE file for details.