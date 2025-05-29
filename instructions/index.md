# MITA State Self-Assessment (SS-A) Tool - Project Overview

## Introduction

This document serves as the main entry point for understanding the MITA State Self-Assessment (SS-A) Tool project. The SS-A Tool is designed to help state Medicaid agencies assess the maturity of their Medicaid systems using the new MITA NextGen capability-based framework.

## Project Purpose

State Medicaid agencies currently struggle with an outdated, cumbersome assessment process that fails to provide meaningful insights. The reimagined SS-A Tool addresses this by offering:

1. A modern, browser-based application with intuitive user experience
2. Integration with the MITA NextGen capability-based framework
3. Efficient assessment workflows with decision tree navigation
4. Local browser storage for data persistence
5. Visualization and export capabilities for actionable reporting

## Key Documents

This Instructions folder contains essential context for developing the SS-A Tool using Amazon Q Developer:

1. [Architecture Overview](architecture.md) - Technical architecture and system design
2. [MITA Framework Structure](mita_framework.md) - Details of the MITA NextGen capability model and ORBIT dimensions
3. [Assessment Workflow](assessment_workflow.md) - User journey and assessment processes
4. [Data Models](data_models.md) - Data structures and storage approach
5. [Development Guide](development_guide.md) - Implementation guidelines and best practices
6. [Prompt Library](prompt_library.md) - Effective prompts for Amazon Q Developer

## Project Scope

The Minimum Lovable Product (MLP) focuses on delivering core functionality by August 2025:

### Core Capabilities (In Scope)

* In-browser functionality with local storage
* MITA NextGen Framework integration
* Decision tree-guided assessment process
* Basic maturity visualization and reporting
* PDF and CSV export functionality

### Future Capabilities (Out of Scope for MLP)

* Authentication and access control
* Advanced collaboration features
* Centralized data repository
* APD integration
* Advanced analytics

## Technical Stack

* **Framework**: Next.js with TypeScript
* **UI Components**: CMS Design System (latest version)
* **Content Storage**: YAML/Markdown files for capability definitions
* **Data Persistence**: Browser localStorage/IndexedDB
* **Deployment**: GitHub Pages for static hosting

## Development Approach

This project uses Amazon Q Developer in VS Code to implement the application without requiring specialized technical resources. The development process follows these key principles:

1. Incremental implementation with frequent deployments
2. Strong separation between content and code
3. Client-side processing with no server dependencies
4. Emphasis on accessibility and usability
5. Open-source approach to enable community contributions

## Getting Started

To begin development:

1. Review all files in the Instructions folder to understand the project context
2. Set up the development environment as described in the [Development Guide](development-guide.md)
3. Follow the phased implementation approach in the GenAI Implementation Plan
4. Use the prompt library to effectively leverage Amazon Q Developer

## Success Criteria

The MLP will be considered successful if it achieves:

1. Working prototype demonstrating core functionality by August 2025
2. Adoption by 3-5 pilot states for initial testing
3. Positive feedback on usability and value from state users
4. Documentation sufficient for open-source collaboration
5. Alignment with latest CMS Design System standards
6. Establishment of foundation for future enhancements

