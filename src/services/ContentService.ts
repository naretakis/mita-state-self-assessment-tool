import fs from 'fs';
import { loadCapabilityDefinitions, parseCapabilityMarkdown } from '../utils/markdownParser';
import type { CapabilityDefinition } from '../types';

/**
 * Service for loading and managing capability content
 */
export class ContentService {
  private capabilities: CapabilityDefinition[] = [];
  private contentDirectory: string;
  
  constructor(contentDirectory: string) {
    this.contentDirectory = contentDirectory;
  }
  
  /**
   * Initialize the content service by loading all capability definitions
   */
  async initialize(): Promise<void> {
    try {
      this.capabilities = await loadCapabilityDefinitions(this.contentDirectory);
    } catch (error) {
      console.error('Failed to load capability definitions:', error);
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
   * Load a single capability from a file
   */
  async loadCapabilityFromFile(filePath: string): Promise<CapabilityDefinition> {
    try {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      return parseCapabilityMarkdown(fileContent);
    } catch (error) {
      console.error(`Failed to load capability from ${filePath}:`, error);
      throw error;
    }
  }
}

export default ContentService;