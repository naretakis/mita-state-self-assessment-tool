/**
 * OrbitMaturityService
 *
 * Service for loading and managing ORBIT maturity model definitions.
 * Loads YAML files from public/content/orbit/ and provides access to
 * the standardized maturity criteria.
 */

import yaml from 'js-yaml';

import type {
  LevelKey,
  OrbitAspect,
  OrbitDimensionDefinition,
  OrbitDimensionId,
  OrbitMaturityModel,
  TechnologyDimension,
  TechnologySubDomain,
  TechnologySubDomainId,
} from '../types/orbit';

// =============================================================================
// Types for YAML parsing (raw structure from files)
// =============================================================================

interface RawLevelDefinition {
  name: string;
  description: string;
  questions?: Array<{ text: string; type: string; options?: string[] }>;
  evidence?: string[];
}

interface RawAspect {
  id: string;
  name: string;
  description: string;
  levels: {
    level1: RawLevelDefinition;
    level2: RawLevelDefinition;
    level3: RawLevelDefinition;
    level4: RawLevelDefinition;
    level5: RawLevelDefinition;
  };
}

interface RawDimensionDefinition {
  id: string;
  name: string;
  description: string;
  required: boolean;
  aspects: RawAspect[];
}

interface RawTechnologyIndex {
  id: string;
  name: string;
  description: string;
  required: boolean;
  subDomains: Array<{ id: string; name: string; file: string }>;
  overallLevels: {
    level1: { name: string; description: string };
    level2: { name: string; description: string };
    level3: { name: string; description: string };
    level4: { name: string; description: string };
    level5: { name: string; description: string };
  };
}

interface RawTechnologySubDomain {
  id: string;
  name: string;
  parentDomain: string;
  description: string;
  overallLevels: {
    level1: { name: string; description: string };
    level2: { name: string; description: string };
    level3: { name: string; description: string };
    level4: { name: string; description: string };
    level5: { name: string; description: string };
  };
  aspects: RawAspect[];
}

// =============================================================================
// Service Implementation
// =============================================================================

class OrbitMaturityService {
  private model: OrbitMaturityModel | null = null;
  private loading: boolean = false;
  private loadPromise: Promise<OrbitMaturityModel> | null = null;

  /**
   * Get base path for GitHub Pages deployment
   */
  private getBasePath(): string {
    if (typeof window === 'undefined') {
      return '';
    }
    const pathname = window.location.pathname;
    if (pathname.includes('/mita-state-self-assessment-tool')) {
      return '/mita-state-self-assessment-tool';
    }
    return '';
  }

  /**
   * Load the complete ORBIT maturity model
   */
  async loadModel(): Promise<OrbitMaturityModel> {
    // Return cached model if available
    if (this.model) {
      return this.model;
    }

    // Return existing promise if already loading
    if (this.loadPromise) {
      return this.loadPromise;
    }

    this.loading = true;
    this.loadPromise = this.doLoadModel();

    try {
      this.model = await this.loadPromise;
      return this.model;
    } finally {
      this.loading = false;
      this.loadPromise = null;
    }
  }

  /**
   * Internal method to load all ORBIT files
   */
  private async doLoadModel(): Promise<OrbitMaturityModel> {
    // Load all dimensions in parallel
    const [outcomes, roles, business, information, technology] = await Promise.all([
      this.loadDimension('outcomes'),
      this.loadDimension('roles'),
      this.loadDimension('business-architecture'),
      this.loadDimension('information-data'),
      this.loadTechnologyDimension(),
    ]);

    return {
      outcomes,
      roles,
      business,
      information,
      technology,
    };
  }

  /**
   * Load a standard (non-Technology) dimension
   */
  private async loadDimension(filename: string): Promise<OrbitDimensionDefinition> {
    const basePath = this.getBasePath();
    const url = `${basePath}/content/orbit/${filename}.yaml`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to load ORBIT dimension: ${filename} (${response.status})`);
    }

    const text = await response.text();
    const raw = yaml.load(text) as RawDimensionDefinition;

    return this.transformDimension(raw);
  }

  /**
   * Load the Technology dimension with all sub-domains
   */
  private async loadTechnologyDimension(): Promise<TechnologyDimension> {
    // First load the index
    const basePath = this.getBasePath();
    const indexUrl = `${basePath}/content/orbit/technology/index.yaml`;
    const indexResponse = await fetch(indexUrl);

    if (!indexResponse.ok) {
      throw new Error(`Failed to load Technology index (${indexResponse.status})`);
    }

    const indexText = await indexResponse.text();
    const rawIndex = yaml.load(indexText) as RawTechnologyIndex;

    // Load all sub-domains in parallel
    const subDomainPromises = rawIndex.subDomains.map(ref =>
      this.loadTechnologySubDomain(ref.file)
    );

    const subDomains = await Promise.all(subDomainPromises);

    return {
      id: 'technology',
      name: rawIndex.name,
      description: rawIndex.description,
      required: true,
      overallLevels: rawIndex.overallLevels,
      subDomains,
    };
  }

  /**
   * Load a Technology sub-domain
   */
  private async loadTechnologySubDomain(filename: string): Promise<TechnologySubDomain> {
    const basePath = this.getBasePath();
    const url = `${basePath}/content/orbit/technology/${filename}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to load Technology sub-domain: ${filename} (${response.status})`);
    }

    const text = await response.text();
    const raw = yaml.load(text) as RawTechnologySubDomain;

    return {
      id: raw.id as TechnologySubDomainId,
      name: raw.name,
      parentDomain: 'technology',
      description: raw.description,
      overallLevels: raw.overallLevels,
      aspects: raw.aspects.map(a => this.transformAspect(a)),
    };
  }

  /**
   * Transform raw dimension data to typed structure
   */
  private transformDimension(raw: RawDimensionDefinition): OrbitDimensionDefinition {
    return {
      id: raw.id,
      name: raw.name,
      description: raw.description,
      required: raw.required,
      aspects: raw.aspects.map(a => this.transformAspect(a)),
    };
  }

  /**
   * Transform raw aspect data to typed structure
   */
  private transformAspect(raw: RawAspect): OrbitAspect {
    const levels: Record<LevelKey, OrbitAspect['levels'][LevelKey]> = {} as OrbitAspect['levels'];

    for (const levelKey of ['level1', 'level2', 'level3', 'level4', 'level5'] as LevelKey[]) {
      const rawLevel = raw.levels[levelKey];
      levels[levelKey] = {
        name: rawLevel.name,
        description: rawLevel.description,
        questions: (rawLevel.questions || []).map(q => ({
          text: q.text,
          type: q.type as 'yes-no' | 'text' | 'select',
          options: q.options,
        })),
        evidence: rawLevel.evidence || [],
      };
    }

    return {
      id: raw.id,
      name: raw.name,
      description: raw.description,
      levels,
    };
  }

  // ===========================================================================
  // Accessor Methods
  // ===========================================================================

  /**
   * Get a specific dimension by ID
   */
  async getDimension(
    dimensionId: OrbitDimensionId
  ): Promise<OrbitDimensionDefinition | TechnologyDimension> {
    const model = await this.loadModel();

    switch (dimensionId) {
      case 'outcomes':
        return model.outcomes;
      case 'roles':
        return model.roles;
      case 'business':
        return model.business;
      case 'information':
        return model.information;
      case 'technology':
        return model.technology;
      default:
        throw new Error(`Unknown dimension: ${dimensionId}`);
    }
  }

  /**
   * Get a Technology sub-domain by ID
   */
  async getTechnologySubDomain(subDomainId: TechnologySubDomainId): Promise<TechnologySubDomain> {
    const model = await this.loadModel();
    const subDomain = model.technology.subDomains.find(sd => sd.id === subDomainId);

    if (!subDomain) {
      throw new Error(`Unknown Technology sub-domain: ${subDomainId}`);
    }

    return subDomain;
  }

  /**
   * Get all aspects for a dimension
   */
  async getAspects(dimensionId: Exclude<OrbitDimensionId, 'technology'>): Promise<OrbitAspect[]> {
    const dimension = (await this.getDimension(dimensionId)) as OrbitDimensionDefinition;
    return dimension.aspects;
  }

  /**
   * Get all aspects for a Technology sub-domain
   */
  async getTechnologyAspects(subDomainId: TechnologySubDomainId): Promise<OrbitAspect[]> {
    const subDomain = await this.getTechnologySubDomain(subDomainId);
    return subDomain.aspects;
  }

  /**
   * Get a specific aspect by dimension and aspect ID
   */
  async getAspect(
    dimensionId: Exclude<OrbitDimensionId, 'technology'>,
    aspectId: string
  ): Promise<OrbitAspect | null> {
    const aspects = await this.getAspects(dimensionId);
    return aspects.find(a => a.id === aspectId) || null;
  }

  /**
   * Get a specific aspect from a Technology sub-domain
   */
  async getTechnologyAspect(
    subDomainId: TechnologySubDomainId,
    aspectId: string
  ): Promise<OrbitAspect | null> {
    const aspects = await this.getTechnologyAspects(subDomainId);
    return aspects.find(a => a.id === aspectId) || null;
  }

  /**
   * Get all Technology sub-domain IDs
   */
  async getTechnologySubDomainIds(): Promise<TechnologySubDomainId[]> {
    const model = await this.loadModel();
    return model.technology.subDomains.map(sd => sd.id);
  }

  /**
   * Get summary of all dimensions for navigation/overview
   */
  async getDimensionSummary(): Promise<
    Array<{
      id: OrbitDimensionId;
      name: string;
      required: boolean;
      aspectCount: number;
      subDomains?: Array<{ id: TechnologySubDomainId; name: string; aspectCount: number }>;
    }>
  > {
    const model = await this.loadModel();

    return [
      {
        id: 'outcomes' as OrbitDimensionId,
        name: model.outcomes.name,
        required: model.outcomes.required,
        aspectCount: model.outcomes.aspects.length,
      },
      {
        id: 'roles' as OrbitDimensionId,
        name: model.roles.name,
        required: model.roles.required,
        aspectCount: model.roles.aspects.length,
      },
      {
        id: 'business' as OrbitDimensionId,
        name: model.business.name,
        required: model.business.required,
        aspectCount: model.business.aspects.length,
      },
      {
        id: 'information' as OrbitDimensionId,
        name: model.information.name,
        required: model.information.required,
        aspectCount: model.information.aspects.length,
      },
      {
        id: 'technology' as OrbitDimensionId,
        name: model.technology.name,
        required: model.technology.required,
        aspectCount: model.technology.subDomains.reduce((sum, sd) => sum + sd.aspects.length, 0),
        subDomains: model.technology.subDomains.map(sd => ({
          id: sd.id,
          name: sd.name,
          aspectCount: sd.aspects.length,
        })),
      },
    ];
  }

  /**
   * Clear cached model (useful for testing or forced refresh)
   */
  clearCache(): void {
    this.model = null;
    this.loadPromise = null;
  }

  /**
   * Check if model is currently loading
   */
  isLoading(): boolean {
    return this.loading;
  }

  /**
   * Check if model is loaded
   */
  isLoaded(): boolean {
    return this.model !== null;
  }
}

// Export singleton instance
const orbitMaturityService = new OrbitMaturityService();
export default orbitMaturityService;

// Also export the class for testing
export { OrbitMaturityService };
