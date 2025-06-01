/**
 * Utility for dynamic imports with code splitting
 * This helps reduce initial bundle size by loading components only when needed
 */

import { ComponentType, lazy, LazyExoticComponent } from 'react';
import React from 'react';

/**
 * Dynamically imports a component with error handling
 * @param importFn - Import function that returns a promise
 * @returns A lazy-loaded component
 */
export function dynamicImport<T extends ComponentType<unknown>>(
  importFn: () => Promise<{ default: T }>
): LazyExoticComponent<T> {
  return lazy(() => {
    return importFn().catch(error => {
      console.error('Error loading component:', error);
      // Return a minimal fallback component
      return {
        default: (() =>
          React.createElement('div', null, 'Failed to load component')) as unknown as T,
      };
    });
  });
}

/**
 * Preloads a component without rendering it
 * Useful for preloading components that will be needed soon
 * @param importFn - Import function that returns a promise
 */
export function preloadComponent<T extends ComponentType<unknown>>(
  importFn: () => Promise<{ default: T }>
): void {
  importFn().catch(error => {
    console.error('Error preloading component:', error);
  });
}

/**
 * Creates a dynamic import with retry logic
 * @param importFn - Import function that returns a promise
 * @param retries - Number of retries (default: 3)
 * @returns A function that returns a promise resolving to the module
 */
export function createRetryableImport<T>(
  importFn: () => Promise<T>,
  retries = 3
): () => Promise<T> {
  return () =>
    new Promise<T>((resolve, reject) => {
      const attempt = (attemptsLeft: number) => {
        importFn()
          .then(resolve)
          .catch(error => {
            if (attemptsLeft <= 1) {
              reject(error);
            } else {
              // Exponential backoff
              const delay = Math.pow(2, retries - attemptsLeft + 1) * 100;
              setTimeout(() => attempt(attemptsLeft - 1), delay);
            }
          });
      };
      attempt(retries);
    });
}
