import { fireEvent, render, screen } from '@testing-library/react';

import AssessmentSidebar from '../../../../src/components/assessment/AssessmentSidebar';

import type { Assessment, CapabilityDefinition, OrbitDimension } from '../../../../src/types';

// Mock data
const mockAssessment: Assessment = {
  id: 'test-assessment',
  stateName: 'Test State',
  createdAt: '2025-01-01T00:00:00Z',
  updatedAt: '2025-01-01T12:00:00Z',
  status: 'in-progress',
  metadata: {
    assessmentVersion: '1.0',
    systemName: 'Test System',
  },
  capabilities: [
    {
      id: 'cap-1',
      capabilityDomainName: 'Test Domain 1',
      capabilityAreaName: 'Test Capability 1',
      status: 'in-progress' as const,
      dimensions: {
        outcome: {
          maturityLevel: 2,
          evidence: 'Test evidence',
          barriers: '',
          plans: '',
          notes: '',
          lastUpdated: new Date().toISOString(),
        },
        role: {
          maturityLevel: 0,
          evidence: '',
          barriers: '',
          plans: '',
          notes: '',
          lastUpdated: new Date().toISOString(),
        },
        businessProcess: {
          maturityLevel: 1,
          evidence: 'Some evidence',
          barriers: '',
          plans: '',
          notes: '',
          lastUpdated: new Date().toISOString(),
        },
        information: {
          maturityLevel: 0,
          evidence: '',
          barriers: '',
          plans: '',
          notes: '',
          lastUpdated: new Date().toISOString(),
        },
        technology: {
          maturityLevel: 3,
          evidence: 'Tech evidence',
          barriers: '',
          plans: '',
          notes: '',
          lastUpdated: new Date().toISOString(),
        },
      },
    },
    {
      id: 'cap-2',
      capabilityDomainName: 'Test Domain 2',
      capabilityAreaName: 'Test Capability 2',
      status: 'not-started' as const,
      dimensions: {
        outcome: {
          maturityLevel: 0,
          evidence: '',
          barriers: '',
          plans: '',
          notes: '',
          lastUpdated: new Date().toISOString(),
        },
        role: {
          maturityLevel: 0,
          evidence: '',
          barriers: '',
          plans: '',
          notes: '',
          lastUpdated: new Date().toISOString(),
        },
        businessProcess: {
          maturityLevel: 0,
          evidence: '',
          barriers: '',
          plans: '',
          notes: '',
          lastUpdated: new Date().toISOString(),
        },
        information: {
          maturityLevel: 0,
          evidence: '',
          barriers: '',
          plans: '',
          notes: '',
          lastUpdated: new Date().toISOString(),
        },
        technology: {
          maturityLevel: 0,
          evidence: '',
          barriers: '',
          plans: '',
          notes: '',
          lastUpdated: new Date().toISOString(),
        },
      },
    },
  ],
};

const mockMaturityLevels = {
  level1: 'Level 1 description',
  level2: 'Level 2 description',
  level3: 'Level 3 description',
  level4: 'Level 4 description',
  level5: 'Level 5 description',
};

const mockCapabilities: CapabilityDefinition[] = [
  {
    id: 'cap-1',
    capabilityAreaName: 'Test Capability 1',
    capabilityDomainName: 'Test Domain 1',
    capabilityVersion: '1.0',
    capabilityAreaCreated: '2025-01-01',
    capabilityAreaLastUpdated: '2025-01-01',
    description: 'Test capability description',
    domainDescription: 'Domain Description 1',
    areaDescription: 'Description 1',
    dimensions: {
      outcome: {
        description: 'Outcome description',
        maturityAssessment: [],
        maturityLevels: mockMaturityLevels,
      },
      role: {
        description: 'Role description',
        maturityAssessment: [],
        maturityLevels: mockMaturityLevels,
      },
      businessProcess: {
        description: 'Business Process description',
        maturityAssessment: [],
        maturityLevels: mockMaturityLevels,
      },
      information: {
        description: 'Information description',
        maturityAssessment: [],
        maturityLevels: mockMaturityLevels,
      },
      technology: {
        description: 'Technology description',
        maturityAssessment: [],
        maturityLevels: mockMaturityLevels,
      },
    },
  },
  {
    id: 'cap-2',
    capabilityAreaName: 'Test Capability 2',
    capabilityDomainName: 'Test Domain 2',
    capabilityVersion: '1.0',
    capabilityAreaCreated: '2025-01-01',
    capabilityAreaLastUpdated: '2025-01-01',
    description: 'Test capability 2 description',
    domainDescription: 'Domain Description 2',
    areaDescription: 'Description 2',
    dimensions: {
      outcome: {
        description: 'Outcome description',
        maturityAssessment: [],
        maturityLevels: mockMaturityLevels,
      },
      role: {
        description: 'Role description',
        maturityAssessment: [],
        maturityLevels: mockMaturityLevels,
      },
      businessProcess: {
        description: 'Business Process description',
        maturityAssessment: [],
        maturityLevels: mockMaturityLevels,
      },
      information: {
        description: 'Information description',
        maturityAssessment: [],
        maturityLevels: mockMaturityLevels,
      },
      technology: {
        description: 'Technology description',
        maturityAssessment: [],
        maturityLevels: mockMaturityLevels,
      },
    },
  },
];

const mockSteps = [
  { type: 'overview' as const, capabilityId: 'cap-1' },
  { type: 'dimension' as const, capabilityId: 'cap-1', dimension: 'outcome' as OrbitDimension },
  { type: 'dimension' as const, capabilityId: 'cap-1', dimension: 'role' as OrbitDimension },
  {
    type: 'dimension' as const,
    capabilityId: 'cap-1',
    dimension: 'businessProcess' as OrbitDimension,
  },
  { type: 'dimension' as const, capabilityId: 'cap-1', dimension: 'information' as OrbitDimension },
  { type: 'dimension' as const, capabilityId: 'cap-1', dimension: 'technology' as OrbitDimension },
  { type: 'overview' as const, capabilityId: 'cap-2' },
];

const defaultProps = {
  assessment: mockAssessment,
  capabilities: mockCapabilities,
  steps: mockSteps,
  currentStepIndex: 0,
  onNavigateToStep: jest.fn(),
  isCollapsed: false,
  onToggleCollapse: jest.fn(),
};

// Mock window.open
Object.defineProperty(window, 'open', {
  writable: true,
  value: jest.fn(),
});

describe('AssessmentSidebar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock desktop viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });
  });

  describe('Basic Rendering', () => {
    it('renders with required props', () => {
      render(<AssessmentSidebar {...defaultProps} />);

      expect(screen.getByLabelText(/assessment navigation/i)).toBeInTheDocument();
      expect(screen.getByText('Test Capability 1')).toBeInTheDocument();
      expect(screen.getByText('Test Capability 2')).toBeInTheDocument();
    });

    it('renders capability progress indicators', () => {
      render(<AssessmentSidebar {...defaultProps} />);

      // Cap-1 has 3 out of 5 dimensions completed (60%)
      expect(screen.getByText('60%')).toBeInTheDocument();
      // Cap-2 has 0 out of 5 dimensions completed (0%)
      expect(screen.getByText('0%')).toBeInTheDocument();
    });

    it('renders results button', () => {
      render(<AssessmentSidebar {...defaultProps} />);

      const resultsButton = screen.getByText('View Results');
      expect(resultsButton).toBeInTheDocument();
    });
  });

  describe('Navigation Functionality', () => {
    it('calls onNavigateToStep when step is clicked', () => {
      const onNavigateToStep = jest.fn();
      render(<AssessmentSidebar {...defaultProps} onNavigateToStep={onNavigateToStep} />);

      // The first capability should be auto-expanded because it contains the current step
      const overviewStep = screen.getByText('Overview').closest('button');
      fireEvent.click(overviewStep!);

      expect(onNavigateToStep).toHaveBeenCalledWith(0);
    });

    it('shows current step correctly', () => {
      render(<AssessmentSidebar {...defaultProps} currentStepIndex={0} />);

      // The overview step should be marked as current
      const overviewButton = screen.getByText('Overview').closest('button');
      expect(overviewButton).toHaveClass('assessment-sidebar__step-button--current');
    });

    it('auto-expands capability containing current step', () => {
      render(<AssessmentSidebar {...defaultProps} currentStepIndex={0} />);

      // The first capability should be auto-expanded, so we should see the overview step
      expect(screen.getByText('Overview')).toBeInTheDocument();
    });
  });

  describe('Progress Calculation', () => {
    it('calculates capability progress correctly', () => {
      render(<AssessmentSidebar {...defaultProps} />);

      // Cap-1: outcome(2), role(0), businessProcess(1), information(0), technology(3)
      // 3 out of 5 dimensions have maturity level > 0 = 60%
      expect(screen.getByText('60%')).toBeInTheDocument();

      // Cap-2: all dimensions have maturity level 0 = 0%
      expect(screen.getByText('0%')).toBeInTheDocument();
    });

    it('handles missing capability data gracefully', () => {
      const assessmentWithMissingCap = {
        ...mockAssessment,
        capabilities: [],
      };

      render(
        <AssessmentSidebar
          {...defaultProps}
          assessment={assessmentWithMissingCap}
          steps={[{ type: 'overview' as const, capabilityId: 'non-existent-cap' }]}
        />
      );

      // Should not crash and should render
      expect(screen.getByLabelText(/assessment navigation/i)).toBeInTheDocument();
    });
  });

  describe('Capability Expansion/Collapse', () => {
    it('expands capability when header is clicked', () => {
      render(<AssessmentSidebar {...defaultProps} currentStepIndex={6} />); // Current step in cap-2

      // Find the first capability button by its heading
      const capabilityHeading = screen.getByText('Test Capability 1');
      const capabilityButton = capabilityHeading.closest('button');

      // Click to expand
      fireEvent.click(capabilityButton!);

      // Should show dimension steps (there are multiple Overview steps, so check for Outcomes which is unique to cap-1)
      expect(screen.getByText('Outcomes')).toBeInTheDocument();
    });

    it('shows expand/collapse icons correctly', () => {
      render(<AssessmentSidebar {...defaultProps} currentStepIndex={6} />); // Current step in cap-2

      // Should show expand icon for collapsed capability
      expect(screen.getByText('▶')).toBeInTheDocument();

      // Click to expand first capability
      const capabilityHeading = screen.getByText('Test Capability 1');
      const capabilityButton = capabilityHeading.closest('button');
      fireEvent.click(capabilityButton!);

      // Should show collapse icon for expanded capability (there are multiple, so check that at least one exists)
      expect(screen.getAllByText('▼').length).toBeGreaterThan(0);
    });
  });

  describe('Mobile Behavior', () => {
    beforeEach(() => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 500,
      });
    });

    it('renders mobile close button when open', () => {
      render(<AssessmentSidebar {...defaultProps} isMobileOpen={true} />);

      const closeButton = screen.getByLabelText(/close navigation/i);
      expect(closeButton).toBeInTheDocument();
    });

    it('calls onMobileToggle when close button is clicked', () => {
      const onMobileToggle = jest.fn();
      render(
        <AssessmentSidebar {...defaultProps} isMobileOpen={true} onMobileToggle={onMobileToggle} />
      );

      const closeButton = screen.getByLabelText(/close navigation/i);
      fireEvent.click(closeButton);

      expect(onMobileToggle).toHaveBeenCalledTimes(1);
    });
  });

  describe('Results Button', () => {
    it('navigates to results page when clicked', () => {
      // Mock window.location.href
      delete (window as any).location;
      window.location = { href: '' } as any;

      render(<AssessmentSidebar {...defaultProps} />);

      const resultsButton = screen.getByText('View Results');
      fireEvent.click(resultsButton);

      expect(window.location.href).toBe('/assessment/test-assessment/results');
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels and roles', () => {
      render(<AssessmentSidebar {...defaultProps} />);

      expect(screen.getByLabelText(/assessment navigation/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/assessment sections/i)).toBeInTheDocument();
    });

    it('has proper progress bar accessibility', () => {
      render(<AssessmentSidebar {...defaultProps} />);

      const progressBars = screen.getAllByRole('progressbar');
      expect(progressBars.length).toBeGreaterThan(0);

      progressBars.forEach(progressBar => {
        expect(progressBar).toHaveAttribute('aria-valuenow');
        expect(progressBar).toHaveAttribute('aria-valuemin', '0');
        expect(progressBar).toHaveAttribute('aria-valuemax', '100');
        expect(progressBar).toHaveAttribute('aria-label');
      });
    });

    it('has proper aria-current for current step', () => {
      render(<AssessmentSidebar {...defaultProps} currentStepIndex={0} />);

      // The overview step should have aria-current="step"
      const overviewButton = screen.getByText('Overview').closest('button');
      expect(overviewButton).toHaveAttribute('aria-current', 'step');
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('handles empty steps array', () => {
      render(<AssessmentSidebar {...defaultProps} steps={[]} />);

      expect(screen.getByLabelText(/assessment navigation/i)).toBeInTheDocument();
      expect(screen.queryByText('Test Capability 1')).not.toBeInTheDocument();
    });

    it('handles invalid currentStepIndex', () => {
      render(<AssessmentSidebar {...defaultProps} currentStepIndex={999} />);

      // Should not crash
      expect(screen.getByLabelText(/assessment navigation/i)).toBeInTheDocument();
    });

    it('handles missing capability definitions', () => {
      render(<AssessmentSidebar {...defaultProps} capabilities={[]} />);

      // Should not crash
      expect(screen.getByLabelText(/assessment navigation/i)).toBeInTheDocument();
    });
  });

  describe('Step Status Logic', () => {
    it('correctly identifies completed steps', () => {
      render(<AssessmentSidebar {...defaultProps} currentStepIndex={0} />);

      // The first capability should be auto-expanded
      // Steps with maturity level > 0 should show as completed
      const completedIcons = screen.getAllByText('✓');
      expect(completedIcons.length).toBeGreaterThan(0);
    });

    it('correctly identifies current step', () => {
      render(<AssessmentSidebar {...defaultProps} currentStepIndex={0} />);

      // Current step should show current icon
      expect(screen.getByText('●')).toBeInTheDocument();
    });

    it('correctly identifies pending steps', () => {
      render(<AssessmentSidebar {...defaultProps} currentStepIndex={0} />);

      // Pending steps should show pending icon
      const pendingIcons = screen.getAllByText('○');
      expect(pendingIcons.length).toBeGreaterThan(0);
    });
  });
});
