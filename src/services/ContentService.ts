import { parseCapabilityMarkdown } from '../utils/capabilityParser';

import type { CapabilityDefinition } from '../types';

/**
 * Service for loading and managing capability content
 */
export class ContentService {
  private capabilities: CapabilityDefinition[] = [];
  private contentDirectory: string;
  private isClient: boolean;

  constructor(contentDirectory: string) {
    this.contentDirectory = contentDirectory;
    this.isClient = typeof window !== 'undefined';
  }

  /**
   * Initialize the content service by loading all capability definitions
   */
  async initialize(): Promise<void> {
    try {
      if (this.isClient) {
        // In browser environment, fetch from API
        await this.fetchCapabilitiesFromAPI();
      } else {
        // This branch won't be executed in the browser
        console.warn('Server-side initialization not implemented');
        this.capabilities = [];
      }
    } catch (error) {
      console.error('Failed to load capability definitions:', error);
      throw error;
    }
  }

  /**
   * Fetch capabilities from API endpoint
   * This method is used in the browser environment
   */
  private async fetchCapabilitiesFromAPI(): Promise<void> {
    try {
      // For now, we'll use mock data in the client
      // In a real implementation, you would fetch from an API endpoint
      this.capabilities = this.getMockCapabilities();

      // Example of how you would fetch from an API:
      // const response = await fetch('/api/capabilities');
      // if (!response.ok) {
      //   throw new Error(`Failed to fetch capabilities: ${response.statusText}`);
      // }
      // this.capabilities = await response.json();
    } catch (error) {
      console.error('Failed to fetch capabilities from API:', error);
      throw error;
    }
  }

  /**
   * Get all capability definitions
   */
  getAllCapabilities(): CapabilityDefinition[] {
    return this.capabilities;
  }

  /**
   * Get a capability by ID
   */
  getCapability(id: string): CapabilityDefinition | null {
    return this.capabilities.find(cap => cap.id === id) || null;
  }

  /**
   * Get capabilities by domain name
   */
  getCapabilitiesByDomain(domainName: string): CapabilityDefinition[] {
    return this.capabilities.filter(cap => cap.domainName === domainName);
  }

  /**
   * Load a single capability from content
   */
  parseCapabilityContent(content: string): CapabilityDefinition {
    try {
      return parseCapabilityMarkdown(content);
    } catch (error) {
      console.error(`Failed to parse capability content:`, error);
      throw error;
    }
  }

  /**
   * Get mock capabilities for development
   * This is a temporary solution until we have a proper API
   */
  private getMockCapabilities(): CapabilityDefinition[] {
    // Return a simple mock capability for development purposes
    return [
      {
        id: 'mock-capability-1',
        name: 'Mock Capability 1',
        domainName: 'Business Relationship Management',
        moduleName: 'Client Management',
        version: '1.0',
        lastUpdated: '2023-01-01',
        description: 'This is a mock capability for development purposes.',
        dimensions: {
          outcome: {
            description: 'Mock outcome dimension',
            assessmentQuestions: ['Question 1?', 'Question 2?'],
            maturityLevels: {
              level1: 'Level 1 description',
              level2: 'Level 2 description',
              level3: 'Level 3 description',
              level4: 'Level 4 description',
              level5: 'Level 5 description',
            },
          },
          role: {
            description: 'Mock role dimension',
            assessmentQuestions: ['Question 1?', 'Question 2?'],
            maturityLevels: {
              level1: 'Level 1 description',
              level2: 'Level 2 description',
              level3: 'Level 3 description',
              level4: 'Level 4 description',
              level5: 'Level 5 description',
            },
          },
          businessProcess: {
            description: 'Mock business process dimension',
            assessmentQuestions: ['Question 1?', 'Question 2?'],
            maturityLevels: {
              level1: 'Level 1 description',
              level2: 'Level 2 description',
              level3: 'Level 3 description',
              level4: 'Level 4 description',
              level5: 'Level 5 description',
            },
          },
          information: {
            description: 'Mock information dimension',
            assessmentQuestions: ['Question 1?', 'Question 2?'],
            maturityLevels: {
              level1: 'Level 1 description',
              level2: 'Level 2 description',
              level3: 'Level 3 description',
              level4: 'Level 4 description',
              level5: 'Level 5 description',
            },
          },
          technology: {
            description: 'Mock technology dimension',
            assessmentQuestions: ['Question 1?', 'Question 2?'],
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
    ];
  }
}

export default ContentService;
