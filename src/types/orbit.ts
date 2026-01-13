/**
 * MITA 4.0 ORBIT Maturity Model Type Definitions
 *
 * These types define the structure for the standardized ORBIT maturity criteria
 * that apply universally across all capability domains and areas.
 *
 * ORBIT = Outcomes, Roles, Business Architecture, Information & Data, Technology
 */

// =============================================================================
// Core ORBIT Types
// =============================================================================

/**
 * The five ORBIT dimensions
 */
export type OrbitDimensionId = 'outcomes' | 'roles' | 'business' | 'information' | 'technology';

/**
 * Maturity levels 1-5, plus 0 for not assessed and -1 for N/A
 */
export type MaturityLevel = 0 | 1 | 2 | 3 | 4 | 5;
export type MaturityLevelWithNA = MaturityLevel | -1;

/**
 * Level names as defined in MITA 4.0
 */
export const MATURITY_LEVEL_NAMES: Record<MaturityLevel, string> = {
  0: 'Not Assessed',
  1: 'Initial',
  2: 'Developing',
  3: 'Defined',
  4: 'Managed',
  5: 'Optimized',
};

/**
 * Question types for assessment
 */
export type QuestionType = 'yes-no' | 'text' | 'select';

// =============================================================================
// ORBIT Dimension Definition Types (Content Structure)
// =============================================================================

/**
 * A single assessment question
 */
export interface OrbitQuestion {
  text: string;
  type: QuestionType;
  options?: string[]; // For select type questions
}

/**
 * Evidence item that can be provided for a maturity level
 */
export interface OrbitEvidence {
  description: string;
  required?: boolean;
}

/**
 * Definition of a single maturity level within an aspect
 */
export interface OrbitLevelDefinition {
  name: string;
  description: string;
  questions: OrbitQuestion[];
  evidence: string[]; // Evidence descriptions
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
 * An aspect within an ORBIT dimension (e.g., "Data Governance" within Information)
 */
export interface OrbitAspect {
  id: string;
  name: string;
  description: string;
  levels: OrbitLevelDefinitions;
}

/**
 * Base interface for ORBIT dimension definitions
 */
export interface OrbitDimensionDefinition {
  id: string;
  name: string;
  description: string;
  required: boolean;
  aspects: OrbitAspect[];
}

// =============================================================================
// Technology Sub-Domain Types
// =============================================================================

/**
 * Technology sub-domain IDs
 */
export type TechnologySubDomainId =
  | 'infrastructure'
  | 'integration'
  | 'platform-services'
  | 'application-architecture'
  | 'security-identity'
  | 'operations-monitoring'
  | 'development-release';

/**
 * Technology sub-domain reference in the index
 */
export interface TechnologySubDomainRef {
  id: TechnologySubDomainId;
  name: string;
  file: string;
}

/**
 * Overall level definitions for Technology dimension and sub-domains
 */
export interface TechnologyOverallLevels {
  level1: { name: string; description: string };
  level2: { name: string; description: string };
  level3: { name: string; description: string };
  level4: { name: string; description: string };
  level5: { name: string; description: string };
}

/**
 * Technology dimension index (overview)
 */
export interface TechnologyDimensionIndex {
  id: 'technology';
  name: string;
  description: string;
  required: true;
  subDomains: TechnologySubDomainRef[];
  overallLevels: TechnologyOverallLevels;
}

/**
 * Technology sub-domain definition
 */
export interface TechnologySubDomain {
  id: TechnologySubDomainId;
  name: string;
  parentDomain: 'technology';
  description: string;
  overallLevels: TechnologyOverallLevels;
  aspects: OrbitAspect[];
}

/**
 * Complete Technology dimension with all sub-domains loaded
 */
export interface TechnologyDimension extends Omit<TechnologyDimensionIndex, 'subDomains'> {
  subDomains: TechnologySubDomain[];
}

// =============================================================================
// Complete ORBIT Model Type
// =============================================================================

/**
 * The complete ORBIT maturity model with all dimensions loaded
 */
export interface OrbitMaturityModel {
  outcomes: OrbitDimensionDefinition;
  roles: OrbitDimensionDefinition;
  business: OrbitDimensionDefinition;
  information: OrbitDimensionDefinition;
  technology: TechnologyDimension;
}

// =============================================================================
// Assessment Response Types (User Input)
// =============================================================================

/**
 * Response to a single question
 */
export interface QuestionResponse {
  questionIndex: number;
  answer: boolean | string | null;
}

/**
 * Evidence provided for a level
 */
export interface EvidenceResponse {
  evidenceIndex: number;
  provided: boolean;
  notes?: string;
  attachmentRef?: string; // Reference to uploaded file if applicable
}

/**
 * Assessment response for a single aspect at a specific level
 */
export interface AspectLevelResponse {
  levelSelected: MaturityLevelWithNA;
  questions: QuestionResponse[];
  evidence: EvidenceResponse[];
  notes: string;
  lastUpdated: string;
}

/**
 * Assessment response for a complete aspect
 */
export interface AspectAssessmentResponse {
  aspectId: string;
  currentLevel: MaturityLevelWithNA;
  targetLevel?: MaturityLevel;
  levelResponses: Partial<Record<1 | 2 | 3 | 4 | 5, AspectLevelResponse>>;
  barriers: string;
  plans: string;
  notes: string;
  lastUpdated: string;
}

/**
 * Assessment response for a Technology sub-domain
 */
export interface TechnologySubDomainResponse {
  subDomainId: TechnologySubDomainId;
  aspects: Record<string, AspectAssessmentResponse>;
  overallLevel: MaturityLevelWithNA;
  notes: string;
  lastUpdated: string;
}

/**
 * Assessment response for the Technology dimension
 */
export interface TechnologyDimensionResponse {
  subDomains: Record<TechnologySubDomainId, TechnologySubDomainResponse>;
  overallLevel: MaturityLevelWithNA;
  notes: string;
  lastUpdated: string;
}

/**
 * Assessment response for a standard ORBIT dimension (non-Technology)
 */
export interface StandardDimensionResponse {
  dimensionId: Exclude<OrbitDimensionId, 'technology'>;
  aspects: Record<string, AspectAssessmentResponse>;
  overallLevel: MaturityLevelWithNA;
  notes: string;
  lastUpdated: string;
}

/**
 * Complete ORBIT assessment response for a capability
 */
export interface OrbitAssessmentResponse {
  outcomes?: StandardDimensionResponse;
  roles?: StandardDimensionResponse;
  business: StandardDimensionResponse;
  information: StandardDimensionResponse;
  technology: TechnologyDimensionResponse;
}

// =============================================================================
// Capability Types (Simplified)
// =============================================================================

/**
 * Simplified capability definition - just metadata, no maturity criteria
 * (maturity criteria now come from standard ORBIT model)
 */
export interface CapabilityMetadata {
  id: string;
  domainId: string;
  domainName: string;
  areaId: string;
  areaName: string;
  version: string;
  description: string;
  domainDescription: string;
  areaDescription: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Capability domain grouping
 */
export interface CapabilityDomain {
  id: string;
  name: string;
  description: string;
  areas: CapabilityMetadata[];
}

// =============================================================================
// Assessment Types (Updated for ORBIT)
// =============================================================================

/**
 * A capability area assessment using the ORBIT model
 */
export interface OrbitCapabilityAssessment {
  id: string;
  capabilityId: string;
  capabilityDomainName: string;
  capabilityAreaName: string;
  status: 'not-started' | 'in-progress' | 'completed';
  orbit: OrbitAssessmentResponse;
  createdAt: string;
  updatedAt: string;
}

/**
 * Complete assessment using the ORBIT model
 */
export interface OrbitAssessment {
  id: string;
  stateName: string;
  createdAt: string;
  updatedAt: string;
  status: 'not-started' | 'in-progress' | 'completed';
  capabilities: OrbitCapabilityAssessment[];
  metadata: {
    assessmentVersion: string;
    orbitModelVersion: string;
    systemName?: string;
    completedBy?: string;
    completionDate?: string;
    notes?: string;
  };
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
  currentLevel: MaturityLevelWithNA;
  targetLevel?: MaturityLevel;
  questionCompletion: {
    answered: number;
    total: number;
    percentage: number;
  };
  evidenceCompletion: {
    provided: number;
    total: number;
    percentage: number;
  };
}

/**
 * Score for a Technology sub-domain
 */
export interface TechnologySubDomainScore {
  subDomainId: TechnologySubDomainId;
  subDomainName: string;
  overallLevel: MaturityLevelWithNA;
  aspectScores: AspectScore[];
  averageLevel: number;
}

/**
 * Score for a standard dimension
 */
export interface DimensionScore {
  dimensionId: OrbitDimensionId;
  dimensionName: string;
  overallLevel: MaturityLevelWithNA;
  aspectScores: AspectScore[];
  averageLevel: number;
  // For Technology dimension only
  subDomainScores?: TechnologySubDomainScore[];
}

/**
 * Complete ORBIT score for a capability
 */
export interface OrbitCapabilityScore {
  capabilityId: string;
  capabilityName: string;
  domainName: string;
  dimensionScores: Record<OrbitDimensionId, DimensionScore>;
  overallAverageLevel: number;
  completionPercentage: number;
}

// =============================================================================
// Utility Types
// =============================================================================

/**
 * Helper type for level keys
 */
export type LevelKey = 'level1' | 'level2' | 'level3' | 'level4' | 'level5';

/**
 * Convert MaturityLevel to LevelKey
 */
export function maturityLevelToKey(level: 1 | 2 | 3 | 4 | 5): LevelKey {
  return `level${level}` as LevelKey;
}

/**
 * Convert LevelKey to MaturityLevel
 */
export function levelKeyToMaturity(key: LevelKey): 1 | 2 | 3 | 4 | 5 {
  return parseInt(key.replace('level', ''), 10) as 1 | 2 | 3 | 4 | 5;
}

/**
 * Check if a dimension is required
 */
export function isDimensionRequired(dimensionId: OrbitDimensionId): boolean {
  return dimensionId !== 'outcomes' && dimensionId !== 'roles';
}

/**
 * Get display name for a dimension
 */
export function getDimensionDisplayName(dimensionId: OrbitDimensionId): string {
  const names: Record<OrbitDimensionId, string> = {
    outcomes: 'Outcomes',
    roles: 'Roles',
    business: 'Business Architecture',
    information: 'Information & Data',
    technology: 'Technology',
  };
  return names[dimensionId];
}
