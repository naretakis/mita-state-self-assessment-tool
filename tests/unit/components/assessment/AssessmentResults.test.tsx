import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

import { AssessmentResults } from '../../../../src/components/assessment/AssessmentResults';
import { StorageProvider } from '../../../../src/components/storage/StorageProvider';
import type { Assessment } from '../../../../src/types';

// Mock Chart.js
jest.mock('chart.js', () => ({
  Chart: {
    register: jest.fn(),
  },
  CategoryScale: jest.fn(),
  LinearScale: jest.fn(),
  BarElement: jest.fn(),
  Title: jest.fn(),
  Tooltip: jest.fn(),
  Legend: jest.fn(),
  RadialLinearScale: jest.fn(),
  PointElement: jest.fn(),
  LineElement: jest.fn(),
  Filler: jest.fn(),
}));

jest.mock('react-chartjs-2', () => ({
  Bar: () => <div data-testid="bar-chart">Bar Chart</div>,
  Radar: () => <div data-testid="radar-chart">Radar Chart</div>,
}));

// Mock jsPDF
jest.mock('jspdf', () => {
  return jest.fn().mockImplementation(() => ({
    setFontSize: jest.fn(),
    text: jest.fn(),
    addPage: jest.fn(),
    save: jest.fn(),
    splitTextToSize: jest.fn(() => ['line1', 'line2']),
  }));
});

jest.mock('jspdf-autotable', () => jest.fn());

// Mock enhanced storage service
jest.mock('../../../../src/services/EnhancedStorageService', () => ({
  __esModule: true,
  default: {
    initialize: jest.fn().mockResolvedValue({
      isLocalStorageAvailable: true,
      isIndexedDBAvailable: true,
      localStorageUsage: 0,
      localStorageLimit: 5242880,
      indexedDBAvailable: true,
      preferredStorage: 'localStorage',
    }),
    loadAssessment: jest.fn(),
    updateAssessmentStatus: jest.fn().mockResolvedValue(true),
    listAssessments: jest.fn().mockResolvedValue([]),
    saveAssessment: jest.fn().mockResolvedValue(true),
    deleteAssessment: jest.fn().mockResolvedValue(true),
    exportAssessment: jest.fn().mockResolvedValue(new Blob()),
    importAssessment: jest.fn(),
  },
}));

// Mock assessment data
const mockAssessment: Assessment = {
  id: 'test-assessment-1',
  stateName: 'Test State',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-02T00:00:00.000Z',
  status: 'completed',
  capabilities: [
    {
      id: 'test-capability-1',
      capabilityDomainName: 'Provider Management',
      capabilityAreaName: 'Provider Enrollment',
      status: 'completed',
      dimensions: {
        outcome: {
          maturityLevel: 3,
          evidence: 'Test evidence',
          barriers: 'Test barriers',
          plans: 'Test plans',
          notes: 'Test notes',
          lastUpdated: '2024-01-01T00:00:00.000Z',
        },
        role: {
          maturityLevel: 4,
          evidence: 'Test evidence',
          barriers: 'Test barriers',
          plans: 'Test plans',
          notes: 'Test notes',
          lastUpdated: '2024-01-01T00:00:00.000Z',
        },
        businessProcess: {
          maturityLevel: 2,
          evidence: 'Test evidence',
          barriers: 'Test barriers',
          plans: 'Test plans',
          notes: 'Test notes',
          lastUpdated: '2024-01-01T00:00:00.000Z',
        },
        information: {
          maturityLevel: 3,
          evidence: 'Test evidence',
          barriers: 'Test barriers',
          plans: 'Test plans',
          notes: 'Test notes',
          lastUpdated: '2024-01-01T00:00:00.000Z',
        },
        technology: {
          maturityLevel: 5,
          evidence: 'Test evidence',
          barriers: 'Test barriers',
          plans: 'Test plans',
          notes: 'Test notes',
          lastUpdated: '2024-01-01T00:00:00.000Z',
        },
      },
    },
  ],
  metadata: {
    assessmentVersion: '1.0',
    completedBy: 'Test User',
    completionDate: '2024-01-02',
    notes: 'Test assessment',
  },
};

describe('AssessmentResults', () => {
  const renderWithProvider = (component: React.ReactElement) => {
    return render(<StorageProvider>{component}</StorageProvider>);
  };

  beforeEach(() => {
    jest.clearAllMocks();
    const mockEnhancedStorageService =
      require('../../../../src/services/EnhancedStorageService').default;
    mockEnhancedStorageService.loadAssessment.mockResolvedValue(mockAssessment);
    mockEnhancedStorageService.importAssessment.mockResolvedValue(mockAssessment);
  });

  it('renders loading state initially', () => {
    renderWithProvider(<AssessmentResults assessmentId="test-assessment-1" />);

    expect(screen.getByText('Calculating assessment results...')).toBeInTheDocument();
    expect(screen.getByRole('status', { name: 'Loading results' })).toBeInTheDocument();
  });

  it('renders assessment results after loading', async () => {
    renderWithProvider(<AssessmentResults assessmentId="test-assessment-1" />);

    await waitFor(() => {
      expect(screen.getByText('Assessment Results')).toBeInTheDocument();
    });

    expect(screen.getByText('MITA maturity assessment results for Test State')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });

  it('displays summary cards with correct data', async () => {
    renderWithProvider(<AssessmentResults assessmentId="test-assessment-1" />);

    await waitFor(() => {
      expect(screen.getByText('Overall Average')).toBeInTheDocument();
    });

    expect(screen.getByText('3.4')).toBeInTheDocument(); // (3+4+2+3+5)/5 = 3.4
    expect(screen.getByText('1')).toBeInTheDocument(); // 1 capability area
    expect(screen.getByText('1')).toBeInTheDocument(); // 1 domain
  });

  it('renders charts', async () => {
    renderWithProvider(<AssessmentResults assessmentId="test-assessment-1" />);

    await waitFor(() => {
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    });

    expect(screen.getByTestId('radar-chart')).toBeInTheDocument();
  });

  it('displays detailed results table', async () => {
    renderWithProvider(<AssessmentResults assessmentId="test-assessment-1" />);

    await waitFor(() => {
      expect(screen.getByText('Detailed Results')).toBeInTheDocument();
    });

    expect(screen.getByText('Provider Management')).toBeInTheDocument();
    expect(screen.getByText('Provider Enrollment')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument(); // Outcome score
    expect(screen.getByText('4')).toBeInTheDocument(); // Role score
    expect(screen.getByText('2')).toBeInTheDocument(); // Business Process score
    expect(screen.getByText('5')).toBeInTheDocument(); // Technology score
  });

  it('provides export options', async () => {
    renderWithProvider(<AssessmentResults assessmentId="test-assessment-1" />);

    await waitFor(() => {
      expect(screen.getByText('Export Results')).toBeInTheDocument();
    });

    expect(screen.getByText('Download PDF')).toBeInTheDocument();
    expect(screen.getByText('Download CSV')).toBeInTheDocument();
  });

  it('provides navigation options', async () => {
    renderWithProvider(<AssessmentResults assessmentId="test-assessment-1" />);

    await waitFor(() => {
      expect(screen.getByText('Return to Dashboard')).toBeInTheDocument();
    });

    expect(screen.getByText('View Assessment Details')).toBeInTheDocument();
  });

  it('handles assessment not found error', async () => {
    const mockEnhancedStorageService =
      require('../../../../src/services/EnhancedStorageService').default;
    mockEnhancedStorageService.loadAssessment.mockResolvedValueOnce(null);

    renderWithProvider(<AssessmentResults assessmentId="non-existent-id" />);

    await waitFor(() => {
      expect(screen.getByText('Error Loading Results')).toBeInTheDocument();
    });

    expect(screen.getByText('Assessment not found')).toBeInTheDocument();
  });
});
