import { render, screen, fireEvent } from '@testing-library/react';
import { CapabilityList } from '../../../../src/components/content';
import { useContent } from '../../../../src/components/content/ContentProvider';

// Mock the useContent hook
jest.mock('../../../../src/components/content/ContentProvider', () => ({
  useContent: jest.fn(),
}));

describe('CapabilityList', () => {
  const mockCapabilities = [
    {
      id: 'capability-1',
      name: 'Capability 1',
      domainName: 'Domain 1',
      version: '1.0',
      description: 'Description for capability 1',
      lastUpdated: '2025-06-01',
      dimensions: {
        outcome: {
          description: 'Outcome description',
          assessmentQuestions: ['Question 1'],
          maturityLevels: {
            level1: 'Level 1',
            level2: 'Level 2',
            level3: 'Level 3',
            level4: 'Level 4',
            level5: 'Level 5',
          },
        },
        role: {
          description: 'Role description',
          assessmentQuestions: ['Question 1'],
          maturityLevels: {
            level1: 'Level 1',
            level2: 'Level 2',
            level3: 'Level 3',
            level4: 'Level 4',
            level5: 'Level 5',
          },
        },
        businessProcess: {
          description: 'Business Process description',
          assessmentQuestions: ['Question 1'],
          maturityLevels: {
            level1: 'Level 1',
            level2: 'Level 2',
            level3: 'Level 3',
            level4: 'Level 4',
            level5: 'Level 5',
          },
        },
        information: {
          description: 'Information description',
          assessmentQuestions: ['Question 1'],
          maturityLevels: {
            level1: 'Level 1',
            level2: 'Level 2',
            level3: 'Level 3',
            level4: 'Level 4',
            level5: 'Level 5',
          },
        },
        technology: {
          description: 'Technology description',
          assessmentQuestions: ['Question 1'],
          maturityLevels: {
            level1: 'Level 1',
            level2: 'Level 2',
            level3: 'Level 3',
            level4: 'Level 4',
            level5: 'Level 5',
          },
        },
      },
    },
    {
      id: 'capability-2',
      name: 'Capability 2',
      domainName: 'Domain 2',
      version: '1.0',
      description: 'Description for capability 2',
      lastUpdated: '2025-06-02',
      dimensions: {
        outcome: {
          description: 'Outcome description',
          assessmentQuestions: ['Question 1'],
          maturityLevels: {
            level1: 'Level 1',
            level2: 'Level 2',
            level3: 'Level 3',
            level4: 'Level 4',
            level5: 'Level 5',
          },
        },
        role: {
          description: 'Role description',
          assessmentQuestions: ['Question 1'],
          maturityLevels: {
            level1: 'Level 1',
            level2: 'Level 2',
            level3: 'Level 3',
            level4: 'Level 4',
            level5: 'Level 5',
          },
        },
        businessProcess: {
          description: 'Business Process description',
          assessmentQuestions: ['Question 1'],
          maturityLevels: {
            level1: 'Level 1',
            level2: 'Level 2',
            level3: 'Level 3',
            level4: 'Level 4',
            level5: 'Level 5',
          },
        },
        information: {
          description: 'Information description',
          assessmentQuestions: ['Question 1'],
          maturityLevels: {
            level1: 'Level 1',
            level2: 'Level 2',
            level3: 'Level 3',
            level4: 'Level 4',
            level5: 'Level 5',
          },
        },
        technology: {
          description: 'Technology description',
          assessmentQuestions: ['Question 1'],
          maturityLevels: {
            level1: 'Level 1',
            level2: 'Level 2',
            level3: 'Level 3',
            level4: 'Level 4',
            level5: 'Level 5',
          },
        },
      },
    },
  ];

  beforeEach(() => {
    // Reset mock
    (useContent as jest.Mock).mockReset();
  });

  test('renders loading state', () => {
    (useContent as jest.Mock).mockReturnValue({
      capabilities: [],
      isLoading: true,
      error: null,
    });

    render(<CapabilityList />);
    expect(screen.getByText('Loading capabilities...')).toBeInTheDocument();
  });

  test('renders error state', () => {
    const errorMessage = 'Failed to load capabilities';
    (useContent as jest.Mock).mockReturnValue({
      capabilities: [],
      isLoading: false,
      error: new Error(errorMessage),
    });

    render(<CapabilityList />);
    expect(screen.getByText(`Error loading capabilities: ${errorMessage}`)).toBeInTheDocument();
  });

  test('renders empty state', () => {
    (useContent as jest.Mock).mockReturnValue({
      capabilities: [],
      isLoading: false,
      error: null,
    });

    render(<CapabilityList />);
    expect(screen.getByText('No capabilities found.')).toBeInTheDocument();
  });

  test('renders capabilities list', () => {
    (useContent as jest.Mock).mockReturnValue({
      capabilities: mockCapabilities,
      isLoading: false,
      error: null,
    });

    render(<CapabilityList />);

    expect(screen.getByText('Capabilities')).toBeInTheDocument();
    expect(screen.getByText('Capability 1')).toBeInTheDocument();
    expect(screen.getByText('Capability 2')).toBeInTheDocument();
    expect(screen.getByText('Domain: Domain 1')).toBeInTheDocument();
    expect(screen.getByText('Domain: Domain 2')).toBeInTheDocument();
  });

  test('filters capabilities by domain', () => {
    (useContent as jest.Mock).mockReturnValue({
      capabilities: mockCapabilities,
      isLoading: false,
      error: null,
    });

    render(<CapabilityList domainFilter="Domain 1" />);

    expect(screen.getByText('Capabilities for Domain 1')).toBeInTheDocument();
    expect(screen.getByText('Capability 1')).toBeInTheDocument();
    expect(screen.queryByText('Capability 2')).not.toBeInTheDocument();
  });

  test('calls onSelectCapability when capability is clicked', () => {
    (useContent as jest.Mock).mockReturnValue({
      capabilities: mockCapabilities,
      isLoading: false,
      error: null,
    });

    const mockOnSelectCapability = jest.fn();
    render(<CapabilityList onSelectCapability={mockOnSelectCapability} />);

    fireEvent.click(screen.getByText('Capability 1'));

    expect(mockOnSelectCapability).toHaveBeenCalledWith(mockCapabilities[0]);
  });
});
