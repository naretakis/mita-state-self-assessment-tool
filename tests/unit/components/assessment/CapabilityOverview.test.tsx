import { fireEvent, render, screen } from '@testing-library/react';

import CapabilityOverview from '../../../../src/components/assessment/CapabilityOverview';

import type { CapabilityAreaAssessment, CapabilityDefinition } from '../../../../src/types';

// Mock capability data
const mockCapability: CapabilityAreaAssessment = {
  id: 'provider-provider-enrollment',
  capabilityAreaName: 'Provider Enrollment',
  status: 'not-started',
  dimensions: {
    outcome: {
      maturityLevel: null,
      evidence: '',
      notes: '',
    },
    role: {
      maturityLevel: null,
      evidence: '',
      notes: '',
    },
    businessProcess: {
      maturityLevel: null,
      evidence: '',
      notes: '',
    },
    information: {
      maturityLevel: null,
      evidence: '',
      notes: '',
    },
    technology: {
      maturityLevel: null,
      evidence: '',
      notes: '',
    },
  },
};

const mockDefinition: CapabilityDefinition = {
  id: 'provider-provider-enrollment',
  capabilityDomainName: 'Provider',
  capabilityAreaName: 'Provider Enrollment',
  domainDescription: 'The Provider capability domain encompasses provider-related processes.',
  areaDescription:
    'Provider Enrollment encompasses the processes for registering healthcare providers.',
  capabilityVersion: '1.1',
  capabilityAreaCreated: '2025-06-01',
  capabilityAreaLastUpdated: '2025-06-05',
  dimensions: {
    outcome: {
      name: 'Outcomes',
      description: 'Business results and effectiveness',
      maturityAssessmentQuestions: [],
      maturityLevels: {},
    },
    role: {
      name: 'Roles',
      description: 'Who performs functions and responsibilities',
      maturityAssessmentQuestions: [],
      maturityLevels: {},
    },
    businessProcess: {
      name: 'Business Processes',
      description: 'Workflows and procedures',
      maturityAssessmentQuestions: [],
      maturityLevels: {},
    },
    information: {
      name: 'Information',
      description: 'Data structure and sharing',
      maturityAssessmentQuestions: [],
      maturityLevels: {},
    },
    technology: {
      name: 'Technology',
      description: 'Technical implementation',
      maturityAssessmentQuestions: [],
      maturityLevels: {},
    },
  },
};

describe('CapabilityOverview', () => {
  const mockOnNext = jest.fn();
  const mockOnPrevious = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders capability domain and area information', () => {
    render(
      <CapabilityOverview
        capability={mockCapability}
        definition={mockDefinition}
        onNext={mockOnNext}
        onPrevious={mockOnPrevious}
      />
    );

    expect(screen.getByText('Domain: Provider')).toBeInTheDocument();
    expect(screen.getByText('Capability Area: Provider Enrollment')).toBeInTheDocument();
    expect(screen.getByText(mockDefinition.domainDescription)).toBeInTheDocument();
    expect(screen.getByText(mockDefinition.areaDescription)).toBeInTheDocument();
  });

  it('displays ORBIT dimensions summary', () => {
    render(
      <CapabilityOverview
        capability={mockCapability}
        definition={mockDefinition}
        onNext={mockOnNext}
        onPrevious={mockOnPrevious}
      />
    );

    expect(screen.getByText('Outcomes:')).toBeInTheDocument();
    expect(screen.getByText('Business results and objectives')).toBeInTheDocument();
    expect(screen.getByText('Roles:')).toBeInTheDocument();
    expect(screen.getByText('Who performs functions and responsibilities')).toBeInTheDocument();
    expect(screen.getByText('Business Processes:')).toBeInTheDocument();
    expect(screen.getByText('Workflows and procedures')).toBeInTheDocument();
    expect(screen.getByText('Information:')).toBeInTheDocument();
    expect(screen.getByText('Data structure and sharing')).toBeInTheDocument();
    expect(screen.getByText('Technology:')).toBeInTheDocument();
    expect(screen.getByText('Technical implementation')).toBeInTheDocument();
  });

  it('displays assessment tips and materials needed', () => {
    render(
      <CapabilityOverview
        capability={mockCapability}
        definition={mockDefinition}
        onNext={mockOnNext}
        onPrevious={mockOnPrevious}
      />
    );

    expect(screen.getByText('Getting Started Tips')).toBeInTheDocument();
    expect(screen.getByText('Materials You May Need')).toBeInTheDocument();
    expect(screen.getByText(/Attest with an honest assessment/)).toBeInTheDocument();
    expect(screen.getByText(/Subject matter experts/)).toBeInTheDocument();
  });

  it('calls onNext when Begin Assessment button is clicked', () => {
    render(
      <CapabilityOverview
        capability={mockCapability}
        definition={mockDefinition}
        onNext={mockOnNext}
        onPrevious={mockOnPrevious}
      />
    );

    const beginButton = screen.getByText('Begin Assessment →');
    fireEvent.click(beginButton);

    expect(mockOnNext).toHaveBeenCalledTimes(1);
  });

  it('calls onPrevious when Previous button is clicked', () => {
    render(
      <CapabilityOverview
        capability={mockCapability}
        definition={mockDefinition}
        onNext={mockOnNext}
        onPrevious={mockOnPrevious}
      />
    );

    const previousButton = screen.getByText('← Previous');
    fireEvent.click(previousButton);

    expect(mockOnPrevious).toHaveBeenCalledTimes(1);
  });

  it('does not render Previous button when onPrevious is not provided', () => {
    render(
      <CapabilityOverview
        capability={mockCapability}
        definition={mockDefinition}
        onNext={mockOnNext}
      />
    );

    expect(screen.queryByText('← Previous')).not.toBeInTheDocument();
    expect(screen.getByText('Begin Assessment →')).toBeInTheDocument();
  });

  it('has proper accessibility structure', () => {
    render(
      <CapabilityOverview
        capability={mockCapability}
        definition={mockDefinition}
        onNext={mockOnNext}
        onPrevious={mockOnPrevious}
      />
    );

    // Check for proper heading hierarchy
    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1).toHaveTextContent('Domain: Provider');

    const h2Elements = screen.getAllByRole('heading', { level: 2 });
    expect(h2Elements).toHaveLength(2);
    expect(h2Elements[0]).toHaveTextContent('Capability Area: Provider Enrollment');
    expect(h2Elements[1]).toHaveTextContent('Assessment Overview');

    // Check for proper button accessibility
    const beginButton = screen.getByRole('button', { name: 'Begin Assessment →' });
    expect(beginButton).toBeInTheDocument();

    const previousButton = screen.getByRole('button', { name: '← Previous' });
    expect(previousButton).toBeInTheDocument();
  });
});
