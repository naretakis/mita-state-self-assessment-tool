import { render, screen, waitFor } from '@testing-library/react';
import { ContentLoader } from '../../../src/components/content/ContentLoader';
import ContentService from '../../../src/services/ContentService';

// Mock the ContentService
jest.mock('../../../src/services/ContentService', () => {
  return jest.fn().mockImplementation(() => ({
    initialize: jest.fn().mockResolvedValue(undefined),
    getAllCapabilities: jest.fn().mockReturnValue([
      {
        id: 'test-capability',
        name: 'Test Capability',
        domainName: 'Test Domain',
        moduleName: 'Test Module',
        version: '1.0',
        lastUpdated: '2025-06-01',
        description: 'Test description',
        dimensions: {
          outcome: {
            description: 'Outcome description',
            assessmentQuestions: ['Question 1', 'Question 2'],
            maturityLevels: {
              level1: 'Level 1 description',
              level2: 'Level 2 description',
              level3: 'Level 3 description',
              level4: 'Level 4 description',
              level5: 'Level 5 description',
            },
          },
          role: {
            description: 'Role description',
            assessmentQuestions: ['Question 1', 'Question 2'],
            maturityLevels: {
              level1: 'Level 1 description',
              level2: 'Level 2 description',
              level3: 'Level 3 description',
              level4: 'Level 4 description',
              level5: 'Level 5 description',
            },
          },
          businessProcess: {
            description: 'Business Process description',
            assessmentQuestions: ['Question 1', 'Question 2'],
            maturityLevels: {
              level1: 'Level 1 description',
              level2: 'Level 2 description',
              level3: 'Level 3 description',
              level4: 'Level 4 description',
              level5: 'Level 5 description',
            },
          },
          information: {
            description: 'Information description',
            assessmentQuestions: ['Question 1', 'Question 2'],
            maturityLevels: {
              level1: 'Level 1 description',
              level2: 'Level 2 description',
              level3: 'Level 3 description',
              level4: 'Level 4 description',
              level5: 'Level 5 description',
            },
          },
          technology: {
            description: 'Technology description',
            assessmentQuestions: ['Question 1', 'Question 2'],
            maturityLevels: {
              level1: 'Level 1 description',
              level2: 'Level 2 description',
              level3: 'Level 3 description',
              level4: 'Level 4 description',
              level5: 'Level 5 description',
            },
          },
        },
      },
    ]),
    getCapability: jest.fn().mockImplementation(id => {
      if (id === 'test-capability') {
        return {
          id: 'test-capability',
          name: 'Test Capability',
          domainName: 'Test Domain',
          // ... other properties
        };
      }
      return null;
    }),
    getCapabilitiesByDomain: jest.fn().mockImplementation(domain => {
      if (domain === 'Test Domain') {
        return [
          {
            id: 'test-capability',
            name: 'Test Capability',
            domainName: 'Test Domain',
            // ... other properties
          },
        ];
      }
      return [];
    }),
  }));
});

describe('ContentLoader', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders children with content state', async () => {
    const mockChildrenFn = jest.fn().mockReturnValue(<div>Test Content</div>);
    const mockOnLoaded = jest.fn();

    render(
      <ContentLoader contentDirectory="/test/content" onLoaded={mockOnLoaded}>
        {mockChildrenFn}
      </ContentLoader>
    );

    // Initially should be loading
    expect(mockChildrenFn).toHaveBeenCalledWith(
      expect.objectContaining({
        isLoading: true,
        error: null,
      })
    );

    // After loading completes
    await waitFor(() => {
      expect(mockChildrenFn).toHaveBeenCalledWith(
        expect.objectContaining({
          isLoading: false,
          error: null,
          capabilities: expect.arrayContaining([
            expect.objectContaining({
              id: 'test-capability',
              name: 'Test Capability',
            }),
          ]),
        })
      );
    });

    // Should call onLoaded callback
    expect(mockOnLoaded).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'test-capability',
        }),
      ])
    );

    // Should render children
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  test('handles loading errors', async () => {
    // Mock implementation that throws an error
    (ContentService as jest.Mock).mockImplementationOnce(() => ({
      initialize: jest.fn().mockRejectedValue(new Error('Failed to load content')),
      getAllCapabilities: jest.fn(),
    }));

    const mockChildrenFn = jest.fn().mockReturnValue(<div>Error State</div>);

    render(<ContentLoader contentDirectory="/test/content">{mockChildrenFn}</ContentLoader>);

    // After error occurs
    await waitFor(() => {
      expect(mockChildrenFn).toHaveBeenCalledWith(
        expect.objectContaining({
          isLoading: false,
          error: expect.objectContaining({
            message: 'Failed to load content',
          }),
          capabilities: [],
        })
      );
    });
  });
});
