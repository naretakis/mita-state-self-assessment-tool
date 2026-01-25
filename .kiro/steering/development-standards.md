# Development Standards & Best Practices

This document defines the development standards for the MITA 4.0 State Self-Assessment Tool. These standards MUST be followed for all code changes.

---

## 1. Documentation Standards

### What to Document

| Document                  | When to Update                                                |
| ------------------------- | ------------------------------------------------------------- |
| **README.md**             | Project setup changes, new major features, dependency changes |
| **CHANGELOG.md**          | Every feature, fix, or breaking change (before PR merge)      |
| **PROJECT_FOUNDATION.md** | Architecture decisions, data model changes, phase completion  |

### CHANGELOG Format

Follow [Keep a Changelog](https://keepachangelog.com/) format:

```markdown
## [Unreleased]

### Added

- New feature description

### Changed

- Modified behavior description

### Fixed

- Bug fix description

### Removed

- Removed feature description
```

### Code Comments

- Use JSDoc for exported functions, hooks, and components
- Explain "why" not "what" in inline comments
- Document complex business logic and non-obvious decisions
- Keep comments up-to-date when code changes

```typescript
/**
 * Calculates the maturity score for a capability area.
 * Uses simple averaging across all dimensions (no weighting per stakeholder decision).
 *
 * @param ratings - Array of OrbitRating records for the capability
 * @returns Average score (1-5) or null if no ratings
 */
export function calculateCapabilityScore(ratings: OrbitRating[]): number | null {
  // ...
}
```

---

## 2. Code Style & Formatting

### Prettier Configuration

All code MUST be formatted with Prettier before commit. Configuration is in `.prettierrc`.

### ESLint

All code MUST pass ESLint with zero errors. Warnings should be addressed promptly.

### Import Organization

Organize imports in this order, with blank lines between groups:

```typescript
// 1. React and external libraries
import { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';

// 2. Internal modules (relative paths)
import { useCapabilityAssessments } from '../hooks';
import { calculateScore } from '../services/scoring';

// 3. Types (can be grouped with their source)
import type { CapabilityAssessment, OrbitRating } from '../types';

// 4. Local imports (components, utilities in same feature)
import { AssessmentCard } from './AssessmentCard';

// 5. Styles and assets (if any)
import './styles.css';
```

### Naming Conventions

| Type             | Convention                  | Example                       |
| ---------------- | --------------------------- | ----------------------------- |
| Components       | PascalCase                  | `AssessmentCard.tsx`          |
| Hooks            | camelCase with `use` prefix | `useCapabilityAssessments.ts` |
| Services/Utils   | camelCase                   | `scoring.ts`, `db.ts`         |
| Types/Interfaces | PascalCase                  | `CapabilityAssessment`        |
| Constants        | SCREAMING_SNAKE_CASE        | `MAX_FILE_SIZE`               |
| CSS classes      | kebab-case                  | `assessment-card`             |
| Test files       | `*.test.ts` or `*.test.tsx` | `scoring.test.ts`             |

### File Structure

```
src/
├── components/
│   ├── assessment/
│   │   ├── AspectCard.tsx          # Component
│   │   ├── AspectCard.test.tsx     # Tests alongside component
│   │   └── index.ts                # Barrel export
│   ├── dashboard/
│   ├── export/
│   ├── layout/
│   └── results/
├── constants/
│   └── index.ts
├── hooks/
│   ├── useCapabilityAssessments.ts
│   └── useCapabilityAssessments.test.ts
├── services/
│   ├── scoring.ts
│   └── scoring.test.ts
├── utils/
│   ├── errors.ts
│   └── colors.ts
└── types/
    └── index.ts
```

---

## 3. TypeScript Standards

### Strict Mode

TypeScript strict mode is enabled. Do NOT disable it.

### No `any`

Never use `any`. Use proper types, `unknown`, or generics instead.

```typescript
// ❌ Bad
function processData(data: any): any { ... }

// ✅ Good
function processData<T>(data: T): ProcessedResult<T> { ... }
```

### Explicit Return Types

Always specify return types for exported functions:

```typescript
// ❌ Bad
export function calculateScore(ratings: OrbitRating[]) { ... }

// ✅ Good
export function calculateScore(ratings: OrbitRating[]): number | null { ... }
```

### Interface vs Type

- Use `interface` for object shapes that may be extended
- Use `type` for unions, intersections, and computed types

```typescript
// Object shapes
interface CapabilityAssessment {
  id: string;
  status: AssessmentStatus;
}

// Unions and computed types
type AssessmentStatus = 'in_progress' | 'finalized';
type ScoreMap = Record<string, number>;
```

---

## 4. Testing Standards

### Testing Framework

- **Vitest** for unit and integration tests
- **React Testing Library** for component tests
- **fake-indexeddb** for IndexedDB mocking in tests
- **vitest-axe** for accessibility testing

### What to Test

| Priority | What                             | Coverage Target |
| -------- | -------------------------------- | --------------- |
| High     | Hooks (business logic)           | 90%+            |
| High     | Services/utilities               | 90%+            |
| Medium   | Complex components               | 70%+            |
| Low      | Simple presentational components | Optional        |

### What NOT to Test

- Pure styling/layout
- Third-party library behavior
- Simple pass-through components
- Implementation details (test behavior, not internals)

### Test File Location

Place test files alongside the code they test:

```
hooks/
├── useCapabilityAssessments.ts
└── useCapabilityAssessments.test.ts
```

### Test Naming

```typescript
describe('useCapabilityAssessments', () => {
  describe('createAssessment', () => {
    it('should create a new assessment with default values', () => { ... });
    it('should throw error if capability area does not exist', () => { ... });
  });
});
```

### Running Tests

```bash
npm test              # Run all tests
npm run test:watch    # Watch mode during development
npm run test:coverage # Generate coverage report
```

---

## 5. Component Patterns

### Functional Components Only

Use functional components with hooks. No class components.

### Component Structure

```typescript
import { useState } from 'react';
import { Box, Typography } from '@mui/material';
import type { AssessmentCardProps } from './types';

/**
 * Displays a summary card for a capability assessment.
 */
export function AssessmentCard({ assessment, onEdit }: AssessmentCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <Box>
      <Typography>{assessment.name}</Typography>
      {/* ... */}
    </Box>
  );
}
```

### Props Interface

Define props interface in the same file or a co-located `types.ts`:

```typescript
interface AssessmentCardProps {
  assessment: CapabilityAssessment;
  onEdit: (id: string) => void;
  className?: string;
}
```

### Avoid Prop Drilling

Use React Context or composition for deeply nested data. Hooks like `useCapabilityAssessments` should provide data access.

---

## 6. Error Handling

### Service Layer

Services should throw typed errors using `AssessmentError` with error codes:

```typescript
import { AssessmentError } from '../utils/errors';

// Throw with error code and optional context
throw new AssessmentError('Assessment not found', 'ASSESSMENT_NOT_FOUND', { assessmentId: id });
```

Available error codes: `ASSESSMENT_NOT_FOUND`, `AREA_NOT_FOUND`, `RATING_NOT_FOUND`, `INVALID_INPUT`, `STORAGE_ERROR`, `ATTACHMENT_ERROR`, `EXPORT_ERROR`, `IMPORT_ERROR`.

### Component Layer

Use Error Boundaries for unexpected errors. Handle expected errors gracefully:

```typescript
import { isAssessmentError, getErrorMessage } from '../utils/errors';

// In error handling
if (isAssessmentError(error)) {
  const message = getErrorMessage(error.code);
  setSnackbar({ open: true, message, severity: 'error' });
}
```

### Async Operations

Always handle errors in async operations:

```typescript
try {
  await saveAssessment(data);
} catch (error) {
  if (error instanceof ValidationError) {
    setFieldErrors(error.fields);
  } else {
    console.error('Failed to save assessment:', error);
    showErrorNotification('Failed to save. Please try again.');
  }
}
```

---

## 7. Git & Commit Standards

### Commit Message Format

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types:**

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Formatting, no code change
- `refactor`: Code change that neither fixes nor adds
- `test`: Adding or updating tests
- `chore`: Build, tooling, dependencies

**Examples:**

```
feat(dashboard): add tag filtering to capability list
fix(assessment): prevent duplicate ratings on rapid save
docs: update CHANGELOG for v0.2.0
test(scoring): add edge case tests for N/A ratings
```

### Branch Strategy

For solo development, working directly on `main` is acceptable. For features that span multiple sessions:

```
main              # Production-ready code
feature/phase-2   # Larger feature work
```

### Pre-commit Hooks

Husky runs automatically on commit via lint-staged:

1. TypeScript/TSX files: Prettier format + ESLint fix
2. JSON/MD/CSS files: Prettier format

If any check fails, the commit is blocked.

Note: TypeScript type-checking is done separately via `npm run typecheck` or during build.

---

## 8. Performance Guidelines

### React Performance

- Use `useMemo` for expensive calculations
- Use `useCallback` for callbacks passed to child components
- Avoid creating objects/arrays in render

```typescript
// ❌ Bad - creates new object every render
<Component style={{ margin: 10 }} />

// ✅ Good - stable reference
const style = useMemo(() => ({ margin: 10 }), []);
<Component style={style} />
```

### Data Loading

- Use Dexie's reactive hooks (`useLiveQuery`) for automatic updates
- Implement loading states for async operations
- Consider pagination for large lists

---

## 9. Accessibility (a11y)

### Requirements

- WCAG 2.1 AA compliance required
- All interactive elements must be keyboard accessible
- Proper heading hierarchy (h1 → h2 → h3)
- Meaningful alt text for images
- Sufficient color contrast

### MUI Accessibility

MUI components are accessible by default. Maintain this by:

- Using semantic props (`aria-label`, `aria-describedby`)
- Not overriding focus styles without replacement
- Testing with keyboard navigation

---

## 10. Dependency Management

### Adding Dependencies

Before adding a new dependency:

1. Check if existing dependencies can solve the problem
2. Evaluate bundle size impact
3. Check maintenance status and security
4. Prefer well-maintained, popular packages

### Updating Dependencies

- Run `npm audit` regularly
- Update patch versions freely
- Test thoroughly when updating minor/major versions
- Document breaking changes in CHANGELOG

---

## Quick Reference Checklist

Before committing, verify:

- [ ] Code is formatted (Prettier)
- [ ] ESLint passes with no errors
- [ ] TypeScript compiles with no errors
- [ ] Tests pass and cover new code
- [ ] CHANGELOG updated (if user-facing change)
- [ ] Commit message follows conventional format
- [ ] No `console.log` statements left in code
- [ ] No `any` types introduced
- [ ] Exported functions have JSDoc comments
