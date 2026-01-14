/**
 * CapabilityService
 *
 * Service for loading and managing capability definitions from the index YAML.
 * Under the ORBIT model, all capabilities use standardized maturity criteria
 * from OrbitMaturityService - no per-capability files are needed.
 *
 * Capabilities contain only metadata and descriptions from the index.
 */

import yaml from 'js-yaml';

import type { CapabilityDomain, CapabilityMetadata } from '../types/orbit';

// =============================================================================
// Types for YAML parsing
// =============================================================================

interface RawCapabilityIndex {
  version: string;
  description: string;
  domains: Array<{
    id: string;
    name: string;
    description: string;
    areas: Array<{
      id: string;
      name: string;
    }>;
  }>;
  metadata: {
    lastUpdated: string;
    orbitModelVersion: string;
  };
}

// =============================================================================
// Service Implementation
// =============================================================================

class CapabilityService {
  private domains: CapabilityDomain[] = [];
  private capabilities: Map<string, CapabilityMetadata> = new Map();
  private loading: boolean = false;
  private loadPromise: Promise<void> | null = null;
  private initialized: boolean = false;

  /**
   * Base path for capability content files
   */
  private getBasePath(): string {
    if (typeof window === 'undefined') {
      return '';
    }
    // Check if we're on GitHub Pages with a base path
    const pathname = window.location.pathname;
    if (pathname.includes('/mita-state-self-assessment-tool')) {
      return '/mita-state-self-assessment-tool';
    }
    return '';
  }

  /**
   * Initialize the service by loading the capability index
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    if (this.loadPromise) {
      return this.loadPromise;
    }

    this.loading = true;
    this.loadPromise = this.doInitialize();

    try {
      await this.loadPromise;
      this.initialized = true;
    } finally {
      this.loading = false;
      this.loadPromise = null;
    }
  }

  /**
   * Internal initialization logic
   */
  private async doInitialize(): Promise<void> {
    const basePath = this.getBasePath();
    const indexUrl = `${basePath}/content/capabilities/index.yaml`;

    try {
      const response = await fetch(indexUrl);
      if (!response.ok) {
        throw new Error(`Failed to load capability index: ${response.status}`);
      }

      const text = await response.text();
      const rawIndex = yaml.load(text) as RawCapabilityIndex;

      // Build capabilities from index
      this.buildCapabilitiesFromIndex(rawIndex);
    } catch (error) {
      console.error('Failed to load capabilities from YAML:', error);
      // Fall back to empty state - UI should handle gracefully
      this.domains = [];
      this.capabilities.clear();
    }
  }

  /**
   * Build all capabilities from the index (no file loading needed)
   */
  private buildCapabilitiesFromIndex(index: RawCapabilityIndex): void {
    this.domains = [];
    this.capabilities.clear();

    for (const rawDomain of index.domains) {
      const domain: CapabilityDomain = {
        id: rawDomain.id,
        name: rawDomain.name,
        description: rawDomain.description,
        areas: [],
      };

      // Create capability metadata from index for each area
      for (const area of rawDomain.areas) {
        const capability = this.createCapabilityFromIndex(rawDomain, area, index.metadata);
        domain.areas.push(capability);
        this.capabilities.set(capability.id, capability);
      }

      this.domains.push(domain);
    }
  }

  /**
   * Create capability metadata from index data
   */
  private createCapabilityFromIndex(
    domain: RawCapabilityIndex['domains'][0],
    area: RawCapabilityIndex['domains'][0]['areas'][0],
    metadata: RawCapabilityIndex['metadata']
  ): CapabilityMetadata {
    return {
      id: area.id,
      domainId: domain.id,
      domainName: domain.name,
      areaId: area.id,
      areaName: area.name,
      version: metadata.orbitModelVersion,
      description: `${area.name} capability area within the ${domain.name} domain.`,
      domainDescription: domain.description,
      areaDescription: `${area.name} capability area within the ${domain.name} domain.`,
      createdAt: metadata.lastUpdated,
      updatedAt: metadata.lastUpdated,
    };
  }

  // ===========================================================================
  // Public Accessor Methods
  // ===========================================================================

  /**
   * Get all capability domains
   */
  async getAllDomains(): Promise<CapabilityDomain[]> {
    await this.initialize();
    return this.domains;
  }

  /**
   * Get a specific domain by ID
   */
  async getDomain(domainId: string): Promise<CapabilityDomain | null> {
    await this.initialize();
    return this.domains.find(d => d.id === domainId) || null;
  }

  /**
   * Get all capabilities (flat list)
   */
  async getAllCapabilities(): Promise<CapabilityMetadata[]> {
    await this.initialize();
    return Array.from(this.capabilities.values());
  }

  /**
   * Get a capability by ID
   */
  async getCapability(id: string): Promise<CapabilityMetadata | null> {
    await this.initialize();
    return this.capabilities.get(id) || null;
  }

  /**
   * Get capabilities by domain ID
   */
  async getCapabilitiesByDomain(domainId: string): Promise<CapabilityMetadata[]> {
    await this.initialize();
    const domain = this.domains.find(d => d.id === domainId);
    return domain?.areas || [];
  }

  /**
   * Get capabilities by domain name (for backward compatibility)
   */
  async getCapabilitiesByDomainName(domainName: string): Promise<CapabilityMetadata[]> {
    await this.initialize();
    const domain = this.domains.find(d => d.name.toLowerCase() === domainName.toLowerCase());
    return domain?.areas || [];
  }

  /**
   * Get domain and area names for display
   */
  async getCapabilityDisplayInfo(
    capabilityId: string
  ): Promise<{ domainName: string; areaName: string } | null> {
    const capability = await this.getCapability(capabilityId);
    if (!capability) {
      return null;
    }

    return {
      domainName: capability.domainName,
      areaName: capability.areaName,
    };
  }

  /**
   * Check if service is initialized
   */
  isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Check if service is currently loading
   */
  isLoading(): boolean {
    return this.loading;
  }

  /**
   * Clear cache and reset state (useful for testing)
   */
  reset(): void {
    this.domains = [];
    this.capabilities.clear();
    this.initialized = false;
    this.loadPromise = null;
  }
}

// Export singleton instance
const capabilityService = new CapabilityService();
export default capabilityService;

// Also export the class for testing
export { CapabilityService };
