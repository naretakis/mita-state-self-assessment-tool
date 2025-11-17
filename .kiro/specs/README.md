# MITA State Self-Assessment Tool - Specifications

This folder contains feature specifications following the spec-driven development methodology. Each spec includes requirements, design, and implementation tasks.

## Folder Structure

### Active Specifications

These specs represent features currently in development or planned for near-term implementation:

- **accessibility-and-performance** - WCAG 2.1 AA compliance and performance optimizations
- **comprehensive-export-functionality** - Enhanced export capabilities (JSON, Markdown, PDF, CSV)
- **content-management-system** - Content loading, parsing, and validation improvements
- **data-visualization-and-reporting** - Chart enhancements and export improvements
- **deployment-simplification-and-cleanup** - Simplified single-branch GitHub Pages deployment
- **error-handling-and-resilience** - Comprehensive error handling and recovery mechanisms
- **header-sidebar-review** - Assessment header and sidebar component improvements
- **storage-and-data-management** - Enhanced storage with auto-save and data optimization
- **ui-light-mode-simplification** - Removal of dark mode CSS for simplified styling
- **user-dashboard-and-assessment-management** - Dashboard enhancements and assessment CRUD operations

### Archive Folders

- **archived-done/** - Completed and deployed features (preserved for reference)
- **archived-on-hold/** - Deprioritized or superseded features

## Spec Structure

Each specification folder contains:
- `requirements.md` - User stories and acceptance criteria (EARS format)
- `design.md` - Architecture, components, and correctness properties
- `tasks.md` - Implementation plan with actionable tasks

## Development Workflow

1. **Requirements** - Define user stories and acceptance criteria
2. **Design** - Create architecture and correctness properties
3. **Tasks** - Break down implementation into discrete steps
4. **Implementation** - Execute tasks incrementally
5. **Archive** - Move completed specs to archived-done/

## Related Documentation

- [ROADMAP.md](../../ROADMAP.md) - Project roadmap and priorities
- [CHANGELOG.md](../../CHANGELOG.md) - Version history
- [CONTRIBUTING.md](../../CONTRIBUTING.md) - Contribution guidelines

## Archive Policy

**Move to archived-done/** when:
- All implementation tasks are completed
- Features are deployed to production
- No outstanding bugs or issues remain
- Documentation is updated

**Move to archived-on-hold/** when:
- Feature was planned but not started
- Feature has been deprioritized
- Feature is waiting for external dependencies
- Feature has been superseded by other work
