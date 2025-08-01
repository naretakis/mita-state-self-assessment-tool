# Coding Standards and Best Practices

## TypeScript Standards
- **Type Everything**: Create interfaces for all data structures
- **Avoid `any`**: Use specific types or `unknown` if type is truly uncertain
- **Nullable Types**: Use union with `null` or `undefined` for optional values
- **Type Guards**: Implement proper type narrowing with type guards

## React Best Practices
- **Functional Components**: Use React functional components with hooks only
- **Custom Hooks**: Extract reusable logic into custom hooks
- **Memoization**: Use `useMemo` and `useCallback` for optimization
- **Context API**: Use React Context for state that needs to be shared
- **Component Structure**: Small, focused components with clear props interfaces

## File Organization
```
src/
├── components/
│   ├── assessment/         # Assessment-specific components
│   ├── common/             # Shared UI components
│   ├── dashboard/          # Dashboard and assessment management
│   ├── layout/             # Layout components
│   └── storage/            # Storage management components
├── hooks/                  # Custom React hooks
├── services/               # Business logic services
├── types/                  # TypeScript type definitions
└── utils/                  # Utility functions
```

## Component Naming Conventions
- Use PascalCase for component files: `AssessmentForm.tsx`
- Use camelCase for utility files: `storageService.ts`
- Use kebab-case for content files: `mita-framework.md`

## State Management Patterns
- Use React Context for global state
- Implement immutable update patterns
- Auto-save functionality every 30 seconds
- Abstract storage operations behind services

## Content Management
- Store content in `public/content` directory
- Use YAML front matter with markdown content
- Follow naming convention: `[module]-[domain]-[capability].md`
- Maintain consistent heading structure

## Performance Requirements
- Monitor bundle size and optimize
- Implement lazy loading for components and content
- Use memoization to prevent unnecessary re-renders
- Minimize browser storage usage

## Accessibility Requirements
- Follow WCAG 2.1 AA guidelines
- Implement appropriate ARIA attributes
- Ensure keyboard navigation works properly
- Test with screen readers
- Maintain proper heading structure
- Ensure sufficient color contrast

## Code Quality Workflow
Before committing or pushing code changes, always run the complete quality check:

### Pre-Commit Checklist
1. **Format Check**: `npm run format` or `npm run prettier`
2. **Lint Check**: `npm run lint` with auto-fix where possible
3. **Type Check**: `npm run type-check` or `npx tsc --noEmit`
4. **Test Suite**: `npm run test` with coverage requirements
5. **Build Check**: `npm run build` to ensure production readiness

### Quality Gate Command
Use `npm run check` as the single command that runs all quality checks:
- Code formatting validation
- ESLint with error reporting
- TypeScript compilation check
- Full test suite execution
- Build verification

### Failure Handling
- **Never commit** code that fails any quality check
- Fix formatting and linting issues before manual review
- Ensure all tests pass and maintain coverage thresholds
- Verify TypeScript compilation succeeds without errors
- Confirm production build completes successfully

### Continuous Integration Alignment
Local `npm run check` should match CI/CD pipeline checks to prevent build failures