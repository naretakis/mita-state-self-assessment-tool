/**
 * ORBIT Model Service
 *
 * Provides access to the ORBIT maturity model data.
 * The ORBIT model defines the standardized maturity criteria
 * applied to ALL capability areas.
 */

import orbitData from '../data/orbit-model.json';
import type {
  OrbitModel,
  OrbitDimension,
  OrbitDimensionId,
  TechnologyDimension,
  TechnologySubDimension,
  TechnologySubDimensionId,
  OrbitAspect,
  MaturityLevelMeta,
  LevelKey,
} from '../types';

// Type assertion for imported JSON
const orbitModel = orbitData as unknown as OrbitModel;

/**
 * Get the complete ORBIT model
 * @returns The full ORBIT maturity model with all dimensions and aspects
 */
export function getOrbitModel(): OrbitModel {
  return orbitModel;
}

/**
 * Get ORBIT model version
 * @returns The version string of the ORBIT model
 */
export function getOrbitModelVersion(): string {
  return orbitModel.version;
}

/**
 * Get all dimension IDs
 * @returns Array of all five ORBIT dimension IDs
 */
export function getAllDimensionIds(): OrbitDimensionId[] {
  return ['outcomes', 'roles', 'businessArchitecture', 'informationData', 'technology'];
}

/**
 * Get required dimension IDs
 * @returns Array of dimension IDs that are required for assessment
 */
export function getRequiredDimensionIds(): OrbitDimensionId[] {
  return ['businessArchitecture', 'informationData', 'technology'];
}

/**
 * Get optional dimension IDs
 * @returns Array of dimension IDs that are optional for assessment
 */
export function getOptionalDimensionIds(): OrbitDimensionId[] {
  return ['outcomes', 'roles'];
}

/**
 * Get a specific dimension by ID
 * @param dimensionId - The dimension ID to find
 * @returns The dimension if found, undefined otherwise
 */
export function getDimension(
  dimensionId: OrbitDimensionId
): OrbitDimension | TechnologyDimension | undefined {
  return orbitModel.dimensions[dimensionId];
}

/**
 * Get all standard (non-Technology) dimensions
 * @returns Array of the four standard dimensions (Outcomes, Roles, Business Architecture, Information & Data)
 */
export function getStandardDimensions(): OrbitDimension[] {
  return [
    orbitModel.dimensions.outcomes,
    orbitModel.dimensions.roles,
    orbitModel.dimensions.businessArchitecture,
    orbitModel.dimensions.informationData,
  ];
}

/**
 * Get the Technology dimension
 * @returns The Technology dimension with its sub-dimensions
 */
export function getTechnologyDimension(): TechnologyDimension {
  return orbitModel.dimensions.technology;
}

/**
 * Get all Technology sub-dimensions
 * @returns Array of all seven Technology sub-dimensions
 */
export function getTechnologySubDimensions(): TechnologySubDimension[] {
  return orbitModel.dimensions.technology.subDimensions;
}

/**
 * Get a specific Technology sub-dimension by ID
 * @param subDimensionId - The sub-dimension ID to find
 * @returns The sub-dimension if found, undefined otherwise
 */
export function getTechnologySubDimension(
  subDimensionId: TechnologySubDimensionId
): TechnologySubDimension | undefined {
  return orbitModel.dimensions.technology.subDimensions.find((sd) => sd.id === subDimensionId);
}

/**
 * Get all aspects for a dimension
 * @param dimensionId - The dimension ID
 * @returns Array of aspects (flattened for Technology dimension)
 */
export function getAspectsForDimension(dimensionId: OrbitDimensionId): OrbitAspect[] {
  const dimension = getDimension(dimensionId);
  if (!dimension) return [];

  if (dimensionId === 'technology') {
    // For Technology, flatten all sub-dimension aspects
    return (dimension as TechnologyDimension).subDimensions.flatMap((sd) => sd.aspects);
  }

  return (dimension as OrbitDimension).aspects;
}

/**
 * Get all aspects for a Technology sub-dimension
 * @param subDimensionId - The sub-dimension ID
 * @returns Array of aspects in the sub-dimension
 */
export function getAspectsForSubDimension(subDimensionId: TechnologySubDimensionId): OrbitAspect[] {
  const subDimension = getTechnologySubDimension(subDimensionId);
  return subDimension?.aspects ?? [];
}

/**
 * Get a specific aspect by dimension and aspect ID
 * @param dimensionId - The dimension ID
 * @param aspectId - The aspect ID to find
 * @param subDimensionId - Optional sub-dimension ID for Technology aspects
 * @returns The aspect if found, undefined otherwise
 */
export function getAspect(
  dimensionId: OrbitDimensionId,
  aspectId: string,
  subDimensionId?: TechnologySubDimensionId
): OrbitAspect | undefined {
  if (dimensionId === 'technology' && subDimensionId) {
    const subDimension = getTechnologySubDimension(subDimensionId);
    return subDimension?.aspects.find((a) => a.id === aspectId);
  }

  const dimension = getDimension(dimensionId);
  if (!dimension) return undefined;

  if (dimensionId === 'technology') {
    // Search all sub-dimensions
    for (const sd of (dimension as TechnologyDimension).subDimensions) {
      const aspect = sd.aspects.find((a) => a.id === aspectId);
      if (aspect) return aspect;
    }
    return undefined;
  }

  return (dimension as OrbitDimension).aspects.find((a) => a.id === aspectId);
}

/**
 * Get maturity level metadata
 * @param level - The maturity level key (level1-level5 or notApplicable)
 * @returns Metadata for the maturity level including name and description
 */
export function getMaturityLevelMeta(level: LevelKey | 'notApplicable'): MaturityLevelMeta {
  return orbitModel.maturityLevels[level];
}

/**
 * Get all maturity level metadata
 * @returns Record of all maturity levels with their metadata
 */
export function getAllMaturityLevels(): Record<LevelKey | 'notApplicable', MaturityLevelMeta> {
  return orbitModel.maturityLevels;
}

/**
 * Get total aspect count across all dimensions
 * @returns Total number of aspects in the ORBIT model
 */
export function getTotalAspectCount(): number {
  let count = 0;

  // Standard dimensions
  for (const dimId of ['outcomes', 'roles', 'businessArchitecture', 'informationData'] as const) {
    count += orbitModel.dimensions[dimId].aspects.length;
  }

  // Technology sub-dimensions
  for (const sd of orbitModel.dimensions.technology.subDimensions) {
    count += sd.aspects.length;
  }

  return count;
}

/**
 * Get aspect count for a specific dimension
 * @param dimensionId - The dimension ID
 * @returns Number of aspects in the dimension
 */
export function getAspectCountForDimension(dimensionId: OrbitDimensionId): number {
  const dimension = getDimension(dimensionId);
  if (!dimension) return 0;

  if (dimensionId === 'technology') {
    return (dimension as TechnologyDimension).subDimensions.reduce(
      (sum, sd) => sum + sd.aspects.length,
      0
    );
  }

  return (dimension as OrbitDimension).aspects.length;
}

/**
 * Get required aspect count (aspects in required dimensions only)
 * @returns Total number of aspects in required dimensions
 */
export function getRequiredAspectCount(): number {
  return getRequiredDimensionIds().reduce(
    (sum, dimId) => sum + getAspectCountForDimension(dimId),
    0
  );
}

/**
 * Check if a dimension is required
 * @param dimensionId - The dimension ID to check
 * @returns True if the dimension is required for assessment
 */
export function isDimensionRequired(dimensionId: OrbitDimensionId): boolean {
  const dimension = getDimension(dimensionId);
  return dimension?.required ?? false;
}

/**
 * Get the sub-dimension that contains a specific aspect (for Technology dimension)
 * @param aspectId - The aspect ID to find
 * @returns The parent sub-dimension if found, undefined otherwise
 */
export function getSubDimensionForAspect(aspectId: string): TechnologySubDimension | undefined {
  for (const sd of orbitModel.dimensions.technology.subDimensions) {
    if (sd.aspects.some((a) => a.id === aspectId)) {
      return sd;
    }
  }
  return undefined;
}

/**
 * Get all aspect IDs for a dimension (flat list)
 * @param dimensionId - The dimension ID
 * @returns Array of aspect IDs
 */
export function getAspectIdsForDimension(dimensionId: OrbitDimensionId): string[] {
  return getAspectsForDimension(dimensionId).map((a) => a.id);
}

/**
 * Get dimension and sub-dimension info for an aspect
 * @param aspectId - The aspect ID to locate
 * @returns Object with dimensionId and optional subDimensionId, or undefined if not found
 */
export function getAspectLocation(aspectId: string):
  | {
      dimensionId: OrbitDimensionId;
      subDimensionId?: TechnologySubDimensionId;
    }
  | undefined {
  // Check standard dimensions first
  for (const dimId of ['outcomes', 'roles', 'businessArchitecture', 'informationData'] as const) {
    const dimension = orbitModel.dimensions[dimId];
    if (dimension.aspects.some((a) => a.id === aspectId)) {
      return { dimensionId: dimId };
    }
  }

  // Check Technology sub-dimensions
  for (const sd of orbitModel.dimensions.technology.subDimensions) {
    if (sd.aspects.some((a) => a.id === aspectId)) {
      return {
        dimensionId: 'technology',
        subDimensionId: sd.id,
      };
    }
  }

  return undefined;
}
