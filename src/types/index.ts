/**
 * MITA 4.0 State Self-Assessment Tool - Type Definitions
 *
 * This file contains all TypeScript interfaces for the application,
 * following the schema defined in PROJECT_FOUNDATION.md.
 */

// =============================================================================
// Capability Reference Model Types
// =============================================================================

/**
 * Capability layer classification
 */
export type CapabilityLayer = 'strategic' | 'core' | 'support';

/**
 * A capability area within a domain or category
 */
export interface CapabilityArea {
  id: string;
  name: string;
  description: string;
  topics: string[];
}

/**
 * A category within a domain (used by Data Management and Technical domains)
 */
export interface CapabilityCategory {
  id: string;
  name: string;
  description: string;
  areas: CapabilityArea[];
}

/**
 * A standard capability domain with direct areas
 */
export interface StandardCapabilityDomain {
  id: string;
  name: string;
  layer: CapabilityLayer;
  description: string;
  areas: CapabilityArea[];
  categories?: never;
}

/**
 * A categorized capability domain (Data Management, Technical)
 */
export interface CategorizedCapabilityDomain {
  id: string;
  name: string;
  layer: CapabilityLayer;
  description: string;
  categories: CapabilityCategory[];
  areas?: never;
}

/**
 * A capability domain - either standard (with areas) or categorized (with categories)
 */
export type CapabilityDomain = StandardCapabilityDomain | CategorizedCapabilityDomain;

/**
 * Type guard to check if a domain has categories
 */
export function isCategorizedDomain(
  domain: CapabilityDomain
): domain is CategorizedCapabilityDomain {
  return 'categories' in domain && Array.isArray(domain.categories);
}

/**
 * Get all areas from a domain (handles both standard and categorized)
 */
export function getAreasFromDomain(domain: CapabilityDomain): CapabilityArea[] {
  if (isCategorizedDomain(domain)) {
    return domain.categories.flatMap((c) => c.areas);
  }
  return domain.areas;
}

/**
 * The complete capability reference model
 */
export interface CapabilityReferenceModel {
  version: string;
  lastUpdated: string;
  description: string;
  domains: CapabilityDomain[];
}

// =============================================================================
// ORBIT Model Types
// =============================================================================

/**
 * The five ORBIT dimension IDs
 */
export type OrbitDimensionId =
  | 'outcomes'
  | 'roles'
  | 'businessArchitecture'
  | 'informationData'
  | 'technology';

/**
 * Technology sub-dimension IDs
 */
export type TechnologySubDimensionId =
  | 'infrastructure'
  | 'integration'
  | 'platformServices'
  | 'applicationArchitecture'
  | 'securityIdentity'
  | 'operationsMaintenance'
  | 'developmentRelease';

/**
 * Maturity levels 1-5, 0 for not assessed, -1 for N/A
 */
export type MaturityLevel = 0 | 1 | 2 | 3 | 4 | 5;
export type MaturityLevelWithNA = MaturityLevel | -1;

/**
 * Level key type for accessing level definitions
 */
export type LevelKey = 'level1' | 'level2' | 'level3' | 'level4' | 'level5';

/**
 * Maturity level names
 */
export const MATURITY_LEVEL_NAMES: Record<MaturityLevel | -1, string> = {
  [-1]: 'Not Applicable',
  0: 'Not Assessed',
  1: 'Initial',
  2: 'Developing',
  3: 'Defined',
  4: 'Managed',
  5: 'Optimized',
};

/**
 * Definition of a single maturity level within an aspect
 */
export interface OrbitLevelDefinition {
  description: string;
  questions: string[];
  evidence: string[];
}

/**
 * All five level definitions for an aspect
 */
export interface OrbitLevelDefinitions {
  level1: OrbitLevelDefinition;
  level2: OrbitLevelDefinition;
  level3: OrbitLevelDefinition;
  level4: OrbitLevelDefinition;
  level5: OrbitLevelDefinition;
}

/**
 * An aspect within an ORBIT dimension
 */
export interface OrbitAspect {
  id: string;
  name: string;
  description: string;
  levels: OrbitLevelDefinitions;
}

/**
 * A standard ORBIT dimension (non-Technology)
 */
export interface OrbitDimension {
  id: string;
  name: string;
  description: string;
  required: boolean;
  aspects: OrbitAspect[];
}

/**
 * A Technology sub-dimension
 */
export interface TechnologySubDimension {
  id: TechnologySubDimensionId;
  name: string;
  description: string;
  aspects: OrbitAspect[];
}

/**
 * The Technology dimension with sub-dimensions
 */
export interface TechnologyDimension {
  id: 'technology';
  name: string;
  description: string;
  required: true;
  subDimensions: TechnologySubDimension[];
}

/**
 * Maturity level metadata
 */
export interface MaturityLevelMeta {
  name: string;
  description: string;
}

/**
 * The complete ORBIT maturity model
 */
export interface OrbitModel {
  version: string;
  lastUpdated: string;
  source: string;
  maturityLevels: {
    level1: MaturityLevelMeta;
    level2: MaturityLevelMeta;
    level3: MaturityLevelMeta;
    level4: MaturityLevelMeta;
    level5: MaturityLevelMeta;
    notApplicable: MaturityLevelMeta;
  };
  dimensions: {
    outcomes: OrbitDimension;
    roles: OrbitDimension;
    businessArchitecture: OrbitDimension;
    informationData: OrbitDimension;
    technology: TechnologyDimension;
  };
}

// =============================================================================
// Database Entity Types (Dexie/IndexedDB)
// =============================================================================

/**
 * Assessment status
 * Note: "not started" is implied by no record existing
 */
export type AssessmentStatus = 'in_progress' | 'finalized';

/**
 * Capability Assessment - one per capability area being assessed
 */
export interface CapabilityAssessment {
  id: string;
  capabilityDomainId: string;
  capabilityDomainName: string;
  capabilityAreaId: string;
  capabilityAreaName: string;
  status: AssessmentStatus;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  finalizedAt?: Date;
  overallScore?: number;
}

/**
 * Response to a single question
 */
export interface QuestionResponse {
  questionIndex: number;
  answer: boolean;
}

/**
 * Evidence response
 */
export interface EvidenceResponse {
  evidenceIndex: number;
  provided: boolean;
  notes?: string;
}

/**
 * ORBIT Rating - one per aspect per capability assessment
 */
export interface OrbitRating {
  id: string;
  capabilityAssessmentId: string;
  dimensionId: OrbitDimensionId;
  subDimensionId?: TechnologySubDimensionId;
  aspectId: string;
  currentLevel: MaturityLevelWithNA;
  targetLevel?: MaturityLevelWithNA; // "To Be" target maturity level
  previousLevel?: MaturityLevelWithNA;
  questionResponses: QuestionResponse[];
  evidenceResponses: EvidenceResponse[];
  notes: string;
  barriers: string;
  plans: string;
  carriedForward: boolean;
  attachmentIds: string[];
  updatedAt: Date;
}

/**
 * File Attachment - stored as Blob in IndexedDB
 */
export interface Attachment {
  id: string;
  capabilityAssessmentId: string;
  orbitRatingId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  blob: Blob;
  description?: string;
  uploadedAt: Date;
}

/**
 * Historical rating snapshot (without attachment blobs)
 */
export interface HistoricalRating {
  dimensionId: OrbitDimensionId;
  subDimensionId?: TechnologySubDimensionId;
  aspectId: string;
  currentLevel: MaturityLevelWithNA;
  targetLevel?: MaturityLevelWithNA;
  questionResponses: QuestionResponse[];
  evidenceResponses: EvidenceResponse[];
  notes: string;
  barriers: string;
  plans: string;
}

/**
 * Assessment History - snapshots of finalized assessments
 */
export interface AssessmentHistory {
  id: string;
  capabilityAssessmentId: string;
  capabilityAreaId: string;
  snapshotDate: Date;
  tags: string[];
  overallScore: number;
  dimensionScores: Record<string, number>;
  ratings: HistoricalRating[];
}

/**
 * Tag record for autocomplete
 */
export interface Tag {
  id: string;
  name: string;
  usageCount: number;
  lastUsed: Date;
}

// =============================================================================
// Scoring Types
// =============================================================================

/**
 * Score for a single aspect
 */
export interface AspectScore {
  aspectId: string;
  aspectName: string;
  dimensionId: OrbitDimensionId;
  subDimensionId?: TechnologySubDimensionId;
  currentLevel: MaturityLevelWithNA;
  isAssessed: boolean;
}

/**
 * Score for a dimension
 */
export interface DimensionScore {
  dimensionId: OrbitDimensionId;
  dimensionName: string;
  required: boolean;
  averageLevel: number | null;
  aspectScores: AspectScore[];
  subDimensionScores?: SubDimensionScore[];
}

/**
 * Score for a Technology sub-dimension
 */
export interface SubDimensionScore {
  subDimensionId: TechnologySubDimensionId;
  subDimensionName: string;
  averageLevel: number | null;
  aspectScores: AspectScore[];
}

// =============================================================================
// Utility Functions
// =============================================================================

/**
 * Convert MaturityLevel to LevelKey
 */
export function maturityLevelToKey(level: 1 | 2 | 3 | 4 | 5): LevelKey {
  return `level${level}` as LevelKey;
}
