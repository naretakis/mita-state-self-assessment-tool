import { Capability } from '@/types';
import matter from 'gray-matter';

/**
 * Service for loading and managing capability definitions from YAML/Markdown
 */
export const ContentService = {
  /**
   * Load capability definition from markdown content
   */
  parseCapabilityContent: (content: string): Capability | null => {
    try {
      const { data } = matter(content);
      
      // Extract front matter data
      const { capabilityDomain, capabilityArea } = data;
      
      // This is a simplified implementation - in a real app, we would parse the markdown
      // content to extract the dimension descriptions and maturity levels
      
      return {
        id: `${capabilityDomain.toLowerCase()}-${capabilityArea.toLowerCase().replace(/\\s+/g, '-')}`,
        name: capabilityArea,
        description: 'Capability description',
        domain: capabilityDomain,
        area: capabilityArea,
        dimensions: {
          outcome: {
            description: 'Outcome dimension',
            levels: [
              { level: 1, description: 'Level 1', criteria: ['Criterion 1'] },
              { level: 2, description: 'Level 2', criteria: ['Criterion 1'] },
              { level: 3, description: 'Level 3', criteria: ['Criterion 1'] },
              { level: 4, description: 'Level 4', criteria: ['Criterion 1'] },
              { level: 5, description: 'Level 5', criteria: ['Criterion 1'] },
            ],
          },
          role: {
            description: 'Role dimension',
            levels: [
              { level: 1, description: 'Level 1', criteria: ['Criterion 1'] },
              { level: 2, description: 'Level 2', criteria: ['Criterion 1'] },
              { level: 3, description: 'Level 3', criteria: ['Criterion 1'] },
              { level: 4, description: 'Level 4', criteria: ['Criterion 1'] },
              { level: 5, description: 'Level 5', criteria: ['Criterion 1'] },
            ],
          },
          businessProcess: {
            description: 'Business Process dimension',
            levels: [
              { level: 1, description: 'Level 1', criteria: ['Criterion 1'] },
              { level: 2, description: 'Level 2', criteria: ['Criterion 1'] },
              { level: 3, description: 'Level 3', criteria: ['Criterion 1'] },
              { level: 4, description: 'Level 4', criteria: ['Criterion 1'] },
              { level: 5, description: 'Level 5', criteria: ['Criterion 1'] },
            ],
          },
          information: {
            description: 'Information dimension',
            levels: [
              { level: 1, description: 'Level 1', criteria: ['Criterion 1'] },
              { level: 2, description: 'Level 2', criteria: ['Criterion 1'] },
              { level: 3, description: 'Level 3', criteria: ['Criterion 1'] },
              { level: 4, description: 'Level 4', criteria: ['Criterion 1'] },
              { level: 5, description: 'Level 5', criteria: ['Criterion 1'] },
            ],
          },
          technology: {
            description: 'Technology dimension',
            levels: [
              { level: 1, description: 'Level 1', criteria: ['Criterion 1'] },
              { level: 2, description: 'Level 2', criteria: ['Criterion 1'] },
              { level: 3, description: 'Level 3', criteria: ['Criterion 1'] },
              { level: 4, description: 'Level 4', criteria: ['Criterion 1'] },
              { level: 5, description: 'Level 5', criteria: ['Criterion 1'] },
            ],
          },
        },
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
  loadAllCapabilities: async (): Promise<Capability[]> => {
    // This would be implemented to load all capability files
    return [];
  },
};

export default ContentService;