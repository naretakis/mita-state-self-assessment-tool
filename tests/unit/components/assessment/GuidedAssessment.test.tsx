import React from 'react';
import { render, screen } from '@testing-library/react';
import { useRouter } from 'next/router';

import GuidedAssessment from '../../../../src/components/assessment/GuidedAssessment';

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

// Mock services
jest.mock('../../../../src/services/ContentService');
jest.mock('../../../../src/services/EnhancedStorageService');

const mockRouter = {
  push: jest.fn(),
  query: {},
  pathname: '/assessment/test-id',
};

describe('GuidedAssessment', () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    render(<GuidedAssessment assessmentId="test-id" />);

    expect(screen.getByText('Loading assessment...')).toBeInTheDocument();
  });

  it('renders with correct assessment ID prop', () => {
    const assessmentId = 'test-assessment-123';
    render(<GuidedAssessment assessmentId={assessmentId} />);

    // Component should attempt to load the assessment with the provided ID
    expect(screen.getByText('Loading assessment...')).toBeInTheDocument();
  });
});
