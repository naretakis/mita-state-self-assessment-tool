import { render, screen, waitFor } from '@testing-library/react';

import { ContentLoader } from '../../../src/components/content/ContentLoader';

// Mock the CapabilityService
jest.mock('../../../src/services/CapabilityService', () => ({
  __esModule: true,
  default: {
    getAllCapabilities: jest.fn().mockResolvedValue([
      {
        id: 'test-capability',
        domainId: 'test-domain',
        domainName: 'Test Domain',
        areaId: 'test-capability',
        areaName: 'Test Capability',
        version: '4.0',
        description: 'Test description',
        domainDescription: 'Test Domain Description',
        areaDescription: 'Test area description',
        createdAt: '2025-06-01',
        updatedAt: '2025-06-01',
      },
    ]),
  },
}));

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
              capabilityAreaName: 'Test Capability',
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
    const capabilityService = require('../../../src/services/CapabilityService').default;
    capabilityService.getAllCapabilities.mockRejectedValueOnce(new Error('Failed to load content'));

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

  test('provides capability access methods', async () => {
    const mockChildrenFn = jest.fn().mockReturnValue(<div>Test Content</div>);

    render(<ContentLoader contentDirectory="/test/content">{mockChildrenFn}</ContentLoader>);

    await waitFor(() => {
      // Verify getCapability method is provided
      const { getCapability } = mockChildrenFn.mock.calls[mockChildrenFn.mock.calls.length - 1][0];
      const capability = getCapability('test-capability');

      expect(capability).toBeDefined();
      expect(capability?.id).toBe('test-capability');
      expect(capability?.capabilityAreaName).toBe('Test Capability');
      expect(capability?.capabilityDomainName).toBe('Test Domain');

      // Verify dimensions are properly loaded (default ORBIT dimensions)
      expect(capability?.dimensions.outcome).toBeDefined();
      expect(capability?.dimensions.role).toBeDefined();
      expect(capability?.dimensions.businessProcess).toBeDefined();
      expect(capability?.dimensions.information).toBeDefined();
      expect(capability?.dimensions.technology).toBeDefined();
    });
  });

  test('provides domain filtering', async () => {
    const mockChildrenFn = jest.fn().mockReturnValue(<div>Test Content</div>);

    render(<ContentLoader contentDirectory="/test/content">{mockChildrenFn}</ContentLoader>);

    await waitFor(() => {
      // Verify getCapabilitiesByDomain method is provided
      const { getCapabilitiesByDomain } =
        mockChildrenFn.mock.calls[mockChildrenFn.mock.calls.length - 1][0];

      // Test with existing domain
      const capabilities = getCapabilitiesByDomain('Test Domain');
      expect(capabilities).toHaveLength(1);
      expect(capabilities[0].id).toBe('test-capability');
      expect(capabilities[0].capabilityDomainName).toBe('Test Domain');

      // Test with non-existing domain
      const emptyCapabilities = getCapabilitiesByDomain('Non-Existent Domain');
      expect(emptyCapabilities).toHaveLength(0);
    });
  });
});
