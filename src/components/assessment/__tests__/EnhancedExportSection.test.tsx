/**
 * Tests for EnhancedExportSection component
 */

import React from 'react';

import { render, screen } from '@testing-library/react';

import { EnhancedExportSection } from '../EnhancedExportSection';

import type { Assessment } from '../../../types';

// Mock the ExportButton component
jest.mock('../../export/ExportButton', () => ({
  ExportButton: ({ children }: { children: React.ReactNode }) => (
    <button data-testid="export-button">{children}</button>
  ),
}));

const mockAssessment: Assessment = {
  id: 'test-assessment-1',
  stateName: 'Test State',
  createdAt: '2025-01-01T00:00:00Z',
  updatedAt: '2025-01-02T00:00:00Z',
  status: 'completed',
  capabilities: [],
  metadata: {
    assessmentVersion: '1.0',
    systemName: 'Test System',
  },
};

describe('EnhancedExportSection', () => {
  it('should render export section with title', () => {
    render(<EnhancedExportSection assessment={mockAssessment} />);

    expect(screen.getByText('Export Assessment Results')).toBeInTheDocument();
  });

  it('should render export button', () => {
    render(<EnhancedExportSection assessment={mockAssessment} />);

    expect(screen.getByTestId('export-button')).toBeInTheDocument();
    expect(screen.getByText('Export Assessment')).toBeInTheDocument();
  });

  it('should display information about enhanced features', () => {
    render(<EnhancedExportSection assessment={mockAssessment} />);

    expect(screen.getByText(/enhanced scoring/i)).toBeInTheDocument();
    expect(screen.getByText(/comprehensive metadata/i)).toBeInTheDocument();
  });

  it('should display available formats', () => {
    render(<EnhancedExportSection assessment={mockAssessment} />);

    expect(screen.getByText(/PDF:/)).toBeInTheDocument();
    expect(screen.getByText(/CSV:/)).toBeInTheDocument();
    expect(screen.getByText(/Markdown:/)).toBeInTheDocument();
    expect(screen.getByText(/JSON:/)).toBeInTheDocument();
  });

  it("should display what's new section", () => {
    render(<EnhancedExportSection assessment={mockAssessment} />);

    expect(screen.getByText("What's New")).toBeInTheDocument();
    expect(screen.getByText(/Enhanced Features:/)).toBeInTheDocument();
  });

  it('should display export format details in expandable section', () => {
    render(<EnhancedExportSection assessment={mockAssessment} />);

    expect(screen.getByText('Export Format Details')).toBeInTheDocument();
  });
});
