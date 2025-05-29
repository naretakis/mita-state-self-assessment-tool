# MITA State Self-Assessment Tool

A modern, browser-based application for state Medicaid agencies to assess the maturity of their Medicaid systems using the MITA NextGen capability-based framework.

## Project Overview

The MITA State Self-Assessment (SS-A) Tool helps state Medicaid agencies assess their systems using the new MITA NextGen capability-based framework. It offers:

1. A modern, browser-based application with intuitive user experience
2. Integration with the MITA NextGen capability-based framework
3. Efficient assessment workflows with decision tree navigation
4. Local browser storage for data persistence
5. Visualization and export capabilities for actionable reporting

## Getting Started

### Prerequisites

- Node.js (LTS version recommended)
- npm or yarn
- Git

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-username/mita-state-self-assessment-tool.git
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
├── .eslintrc.json       # ESLint configuration
├── .prettierrc          # Prettier configuration
├── next.config.js       # Next.js configuration
├── package.json         # Project dependencies
└── tsconfig.json        # TypeScript configuration
```

## Features

- In-browser functionality with local storage
- MITA NextGen Framework integration
- Decision tree-guided assessment process
- Basic maturity visualization and reporting
- PDF and CSV export functionality

## Built With

- [Next.js 15](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [gray-matter](https://github.com/jonschlinkert/gray-matter) - Front matter parser
- [react-markdown](https://github.com/remarkjs/react-markdown) - Markdown renderer

## License

This project is licensed under the MIT License - see the LICENSE file for details.