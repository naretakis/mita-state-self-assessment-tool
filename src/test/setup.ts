import '@testing-library/jest-dom/vitest';
import * as matchers from 'vitest-axe/matchers';
import { expect } from 'vitest';

// Extend vitest expect with axe matchers
expect.extend(matchers);

// Mock IndexedDB for Dexie tests
import 'fake-indexeddb/auto';

// Configure React act() environment for testing
// @ts-expect-error - globalThis typing
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

// Suppress act() warnings from Dexie's useLiveQuery hook
// These warnings occur because useLiveQuery triggers async state updates
// that are expected behavior and don't affect test correctness
const originalError = console.error;
console.error = (...args: unknown[]) => {
  const message = args[0];
  if (typeof message === 'string' && message.includes('not wrapped in act')) {
    return;
  }
  originalError.apply(console, args);
};
