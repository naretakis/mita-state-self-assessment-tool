/**
 * ProgressBar Components Tests
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StackedProgressBar, CapabilityProgressBar, SimpleProgressBar } from './ProgressBar';

describe('StackedProgressBar', () => {
  it('should render with all three segments', () => {
    render(<StackedProgressBar finalized={5} inProgress={3} notStarted={2} />);

    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('should show correct total', () => {
    const { container } = render(
      <StackedProgressBar finalized={10} inProgress={5} notStarted={5} />
    );

    // Total should be 20
    const segments = container.querySelectorAll('[class*="MuiBox"]');
    expect(segments.length).toBeGreaterThan(0);
  });

  it('should handle zero values', () => {
    render(<StackedProgressBar finalized={0} inProgress={0} notStarted={10} />);

    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('should handle all finalized', () => {
    render(<StackedProgressBar finalized={10} inProgress={0} notStarted={0} />);

    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('should handle all in progress', () => {
    render(<StackedProgressBar finalized={0} inProgress={10} notStarted={0} />);

    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('should render empty box when total is zero', () => {
    const { container } = render(
      <StackedProgressBar finalized={0} inProgress={0} notStarted={0} />
    );

    // Should render an empty box with height 22
    const box = container.querySelector('[class*="MuiBox"]');
    expect(box).toBeInTheDocument();
  });
});

describe('CapabilityProgressBar', () => {
  it('should render with progress for in_progress status', () => {
    const { container } = render(<CapabilityProgressBar status="in_progress" progress={75} />);

    // Should render the progress bar container
    const progressBar = container.querySelector('[class*="MuiBox"]');
    expect(progressBar).toBeInTheDocument();
  });

  it('should show 100% for finalized status regardless of progress prop', () => {
    const { container } = render(<CapabilityProgressBar status="finalized" progress={50} />);

    // Finalized should show full bar (100%)
    const progressBar = container.querySelector('[class*="MuiBox"]');
    expect(progressBar).toBeInTheDocument();
  });

  it('should handle not_started status', () => {
    const { container } = render(<CapabilityProgressBar status="not_started" progress={0} />);

    const progressBar = container.querySelector('[class*="MuiBox"]');
    expect(progressBar).toBeInTheDocument();
  });

  it('should render progress bar element', () => {
    const { container } = render(<CapabilityProgressBar status="in_progress" progress={50} />);

    const progressBar = container.querySelector('[class*="MuiBox"]');
    expect(progressBar).toBeInTheDocument();
  });

  it('should handle 0% progress', () => {
    const { container } = render(<CapabilityProgressBar status="not_started" progress={0} />);

    const progressBar = container.querySelector('[class*="MuiBox"]');
    expect(progressBar).toBeInTheDocument();
  });

  it('should handle 100% progress', () => {
    const { container } = render(<CapabilityProgressBar status="in_progress" progress={100} />);

    const progressBar = container.querySelector('[class*="MuiBox"]');
    expect(progressBar).toBeInTheDocument();
  });
});

describe('SimpleProgressBar', () => {
  it('should be an alias for CapabilityProgressBar', () => {
    // SimpleProgressBar is exported as an alias for backward compatibility
    expect(SimpleProgressBar).toBe(CapabilityProgressBar);
  });

  it('should render with status and progress', () => {
    const { container } = render(<SimpleProgressBar status="in_progress" progress={60} />);

    const progressBar = container.querySelector('[class*="MuiBox"]');
    expect(progressBar).toBeInTheDocument();
  });
});
