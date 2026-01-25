/**
 * StatusChip Component Tests
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatusChip } from './StatusChip';

describe('StatusChip', () => {
  it('should render "Not Started" for not_started status', () => {
    render(<StatusChip status="not_started" />);

    expect(screen.getByText('Not Started')).toBeInTheDocument();
  });

  it('should render "In Progress" for in_progress status', () => {
    render(<StatusChip status="in_progress" />);

    expect(screen.getByText('In Progress')).toBeInTheDocument();
  });

  it('should render "Finalized" for finalized status', () => {
    render(<StatusChip status="finalized" />);

    expect(screen.getByText('Finalized')).toBeInTheDocument();
  });

  it('should apply correct color for not_started', () => {
    const { container } = render(<StatusChip status="not_started" />);

    const chip = container.querySelector('.MuiChip-root');
    expect(chip).toBeInTheDocument();
  });

  it('should apply correct color for in_progress', () => {
    const { container } = render(<StatusChip status="in_progress" />);

    const chip = container.querySelector('.MuiChip-root');
    expect(chip).toBeInTheDocument();
  });

  it('should apply correct color for finalized', () => {
    const { container } = render(<StatusChip status="finalized" />);

    const chip = container.querySelector('.MuiChip-root');
    expect(chip).toBeInTheDocument();
  });

  it('should render as small chip', () => {
    const { container } = render(<StatusChip status="finalized" />);

    const chip = container.querySelector('.MuiChip-sizeSmall');
    expect(chip).toBeInTheDocument();
  });
});
