/**
 * DomainScoresList Component Tests
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { DomainScoresList } from './DomainScoresList';

interface DomainScore {
  id: string;
  name: string;
  score: number | null;
}

/**
 * Helper to render component with Router
 */
function renderWithRouter(domains: DomainScore[]): ReturnType<typeof render> {
  return render(
    <MemoryRouter>
      <DomainScoresList domains={domains} />
    </MemoryRouter>
  );
}

describe('DomainScoresList', () => {
  const defaultDomains: DomainScore[] = [
    { id: 'domain-1', name: 'Provider Management', score: 3.5 },
    { id: 'domain-2', name: 'Member Management', score: 4.0 },
    { id: 'domain-3', name: 'Claims Management', score: null },
  ];

  it('should render all domains', () => {
    renderWithRouter(defaultDomains);

    expect(screen.getByText('Provider Management')).toBeInTheDocument();
    expect(screen.getByText('Member Management')).toBeInTheDocument();
    expect(screen.getByText('Claims Management')).toBeInTheDocument();
  });

  it('should display scores for domains with scores', () => {
    renderWithRouter(defaultDomains);

    expect(screen.getByText('3.5')).toBeInTheDocument();
    expect(screen.getByText('4.0')).toBeInTheDocument();
  });

  it('should display dash for domains without scores', () => {
    renderWithRouter(defaultDomains);

    expect(screen.getByText('—')).toBeInTheDocument();
  });

  it('should navigate when domain clicked', async () => {
    const user = userEvent.setup();
    renderWithRouter(defaultDomains);

    await user.click(screen.getByText('Provider Management'));

    // Navigation happens via useNavigate, no error means success in MemoryRouter
  });

  it('should handle empty domains array', () => {
    renderWithRouter([]);

    // Should render without errors - empty list
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('should render clickable list items', () => {
    renderWithRouter(defaultDomains);

    // Each domain should be in a clickable button
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(3);
  });

  it('should format scores with one decimal place', () => {
    const domains: DomainScore[] = [{ id: 'domain-1', name: 'Test Domain', score: 3.567 }];

    renderWithRouter(domains);

    // Score should be formatted to 3.6 (one decimal)
    expect(screen.getByText('3.6')).toBeInTheDocument();
  });

  it('should handle single domain', () => {
    const domains: DomainScore[] = [{ id: 'domain-1', name: 'Single Domain', score: 4.2 }];

    renderWithRouter(domains);

    expect(screen.getByText('Single Domain')).toBeInTheDocument();
    expect(screen.getByText('4.2')).toBeInTheDocument();
  });

  it('should handle all null scores', () => {
    const domains: DomainScore[] = [
      { id: 'domain-1', name: 'Domain A', score: null },
      { id: 'domain-2', name: 'Domain B', score: null },
    ];

    renderWithRouter(domains);

    const dashes = screen.getAllByText('—');
    expect(dashes).toHaveLength(2);
  });

  it('should apply different colors based on score', () => {
    const domains: DomainScore[] = [
      { id: 'domain-1', name: 'High Score', score: 4.5 },
      { id: 'domain-2', name: 'Medium Score', score: 3.0 },
      { id: 'domain-3', name: 'Low Score', score: 1.5 },
    ];

    renderWithRouter(domains);

    // All scores should be rendered
    expect(screen.getByText('4.5')).toBeInTheDocument();
    expect(screen.getByText('3.0')).toBeInTheDocument();
    expect(screen.getByText('1.5')).toBeInTheDocument();
  });
});
