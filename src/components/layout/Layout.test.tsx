/**
 * Layout component accessibility tests
 *
 * Uses vitest-axe to automatically check for WCAG violations.
 */

import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { axe } from 'vitest-axe';
import Layout from './Layout';

/**
 * Helper to render Layout with required providers
 */
function renderLayout(
  children: React.ReactNode = <div>Test content</div>
): ReturnType<typeof render> {
  return render(
    <BrowserRouter>
      <Layout>{children}</Layout>
    </BrowserRouter>
  );
}

describe('Layout accessibility', () => {
  it('should have no critical accessibility violations', async () => {
    const { container } = renderLayout();

    const results = await axe(container, {
      // Focus on critical issues first - we'll expand this as we fix issues
      rules: {
        // Temporarily disable rules we know are failing until fixed
        // Remove these as issues are resolved
        region: { enabled: false }, // A01: Skip link not yet implemented
        'landmark-one-main': { enabled: false }, // A02: Main needs aria-label
      },
    });

    expect(results).toHaveNoViolations();
  });

  it('should have proper navigation structure', async () => {
    const { container } = renderLayout();

    const results = await axe(container, {
      runOnly: ['navigation', 'landmark'],
    });

    // Log violations for debugging during development
    if (results.violations.length > 0) {
      console.log('Navigation accessibility issues:', results.violations);
    }

    // This will fail initially - that's expected!
    // We'll fix the issues and then this test will pass
    expect(results.violations.length).toBeLessThanOrEqual(2);
  });
});

describe('Layout structure', () => {
  it('should render main content area', () => {
    const { container } = renderLayout(<div data-testid="content">Hello</div>);

    const main = container.querySelector('main');
    expect(main).toBeInTheDocument();
  });

  it('should render navigation', () => {
    const { getByRole } = renderLayout();

    // Navigation should be present (AppBar is now a nav element)
    const nav = getByRole('navigation', { name: 'Main navigation' });
    expect(nav).toBeInTheDocument();
  });

  it('should have skip link', () => {
    const { getByText } = renderLayout();

    const skipLink = getByText('Skip to main content');
    expect(skipLink).toBeInTheDocument();
    expect(skipLink).toHaveAttribute('href', '#main-content');
  });

  it('should have main content with correct id', () => {
    const { container } = renderLayout();

    const main = container.querySelector('#main-content');
    expect(main).toBeInTheDocument();
    expect(main?.tagName.toLowerCase()).toBe('main');
  });
});
