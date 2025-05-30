import { Capability, CapabilityDefinition } from '@/types';
import matter from 'gray-matter';

/**
 * Service for loading and managing capability definitions from YAML/Markdown
 */
export const ContentService = {
  /**
   * Load capability definition from markdown content
   */
  parseCapabilityContent: (content: string): CapabilityDefinition | null => {
    try {
      const { data, content: markdownContent } = matter(content);
      
      // Extract front matter data
      const { 
        capabilityDomain, 
        capabilityArea,
        version,
        mitadefinitionupdatedlastUpdated
      } = data;
      
      // Generate a unique ID for the capability
      const id = `${capabilityDomain.toLowerCase()}-${capabilityArea.toLowerCase().replace(/\s+/g, '-')}`;
      
      // This is a simplified implementation - in a real app, we would parse the markdown
      // content to extract the dimension descriptions and maturity levels
      
      // Create a basic capability definition
      return {
        id,
        name: capabilityArea,
        domainName: capabilityDomain,
        moduleName: 'Default Module', // This would be extracted from content in a real implementation
        version: version || '1.0',
        lastUpdated: mitadefinitionupdatedlastUpdated || new Date().toISOString(),
        description: 'Capability description', // This would be extracted from content
        dimensions: {
          outcome: createDimensionDefinition('Outcome'),
          role: createDimensionDefinition('Role'),
          businessProcess: createDimensionDefinition('Business Process'),
          information: createDimensionDefinition('Information'),
          technology: createDimensionDefinition('Technology'),
        }
      };
    } catch (error) {
      console.error('Error parsing capability content:', error);
      return null;
    }
  },

  /**
   * Load all capabilities from content files
   * This is a placeholder - in a real app, we would load files from the public/content directory
   */
  loadAllCapabilities: async (): Promise<CapabilityDefinition[]> => {
    // This would be implemented to load all capability files
    return [];
  },
  
  /**
   * Get capability by ID
   */
  getCapability: async (id: string): Promise<CapabilityDefinition | null> => {
    const capabilities = await ContentService.loadAllCapabilities();
    return capabilities.find(cap => cap.id === id) || null;
  },
  
  /**
   * Get all capabilities for a domain
   */
  getCapabilitiesByDomain: async (domainName: string): Promise<CapabilityDefinition[]> => {
    const capabilities = await ContentService.loadAllCapabilities();
    return capabilities.filter(cap => cap.domainName === domainName);
  }
};

/**
 * Helper function to create a dimension definition
 */
function createDimensionDefinition(name: string) {
  return {
    description: `${name} dimension description`,
    assessmentQuestions: [
      'What is the current state?',
      'What evidence supports this assessment?',
      'What barriers exist to advancement?'
    ],
    maturityLevels: {
      level1: 'Level 1 definition',
      level2: 'Level 2 definition',
      level3: 'Level 3 definition',
      level4: 'Level 4 definition',
      level5: 'Level 5 definition',
    }
  };
}

export default ContentService;