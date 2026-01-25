/**
 * Hook for managing ORBIT ratings within a capability assessment
 *
 * Provides CRUD operations for aspect-level ratings.
 * Each aspect in each dimension has one rating per assessment.
 */

import { useLiveQuery } from 'dexie-react-hooks';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../services/db';
import { calculateAverageScore } from '../services/scoring';
import type {
  OrbitRating,
  OrbitDimensionId,
  TechnologySubDimensionId,
  MaturityLevelWithNA,
  QuestionResponse,
  EvidenceResponse,
} from '../types';

/**
 * Return type for useOrbitRatings hook
 */
export interface UseOrbitRatingsReturn {
  ratings: OrbitRating[];
  saveRating: (params: {
    dimensionId: OrbitDimensionId;
    subDimensionId?: TechnologySubDimensionId;
    aspectId: string;
    currentLevel: MaturityLevelWithNA;
    targetLevel?: MaturityLevelWithNA;
    questionResponses?: QuestionResponse[];
    evidenceResponses?: EvidenceResponse[];
    notes?: string;
    barriers?: string;
    plans?: string;
  }) => Promise<void>;
  updateLevel: (
    dimensionId: OrbitDimensionId,
    aspectId: string,
    currentLevel: MaturityLevelWithNA,
    subDimensionId?: TechnologySubDimensionId
  ) => Promise<void>;
  updateTargetLevel: (
    dimensionId: OrbitDimensionId,
    aspectId: string,
    targetLevel: MaturityLevelWithNA | undefined,
    subDimensionId?: TechnologySubDimensionId
  ) => Promise<void>;
  updateNotes: (
    dimensionId: OrbitDimensionId,
    aspectId: string,
    notes: string,
    subDimensionId?: TechnologySubDimensionId
  ) => Promise<void>;
  updateBarriers: (
    dimensionId: OrbitDimensionId,
    aspectId: string,
    barriers: string,
    subDimensionId?: TechnologySubDimensionId
  ) => Promise<void>;
  updatePlans: (
    dimensionId: OrbitDimensionId,
    aspectId: string,
    plans: string,
    subDimensionId?: TechnologySubDimensionId
  ) => Promise<void>;
  getRating: (
    dimensionId: OrbitDimensionId,
    aspectId: string,
    subDimensionId?: TechnologySubDimensionId
  ) => OrbitRating | undefined;
  getRatingsForDimension: (dimensionId: OrbitDimensionId) => OrbitRating[];
  getRatingsForSubDimension: (subDimensionId: TechnologySubDimensionId) => OrbitRating[];
  getAssessedCount: () => number;
  getAssessedCountForDimension: (dimensionId: OrbitDimensionId) => number;
  isDimensionComplete: (dimensionId: OrbitDimensionId, totalAspects: number) => boolean;
  getAverageLevelForDimension: (dimensionId: OrbitDimensionId) => number | null;
  getOverallAverageLevel: () => number | null;
}

/**
 * Hook for managing ORBIT ratings within an assessment
 */
export function useOrbitRatings(capabilityAssessmentId: string | undefined): UseOrbitRatingsReturn {
  // Get all ratings for this assessment
  const ratings = useLiveQuery(
    () =>
      capabilityAssessmentId
        ? db.orbitRatings.where('capabilityAssessmentId').equals(capabilityAssessmentId).toArray()
        : [],
    [capabilityAssessmentId]
  );

  /**
   * Save or update a rating for an aspect
   */
  const saveRating = async (params: {
    dimensionId: OrbitDimensionId;
    subDimensionId?: TechnologySubDimensionId;
    aspectId: string;
    currentLevel: MaturityLevelWithNA;
    targetLevel?: MaturityLevelWithNA;
    questionResponses?: QuestionResponse[];
    evidenceResponses?: EvidenceResponse[];
    notes?: string;
    barriers?: string;
    plans?: string;
  }): Promise<void> => {
    if (!capabilityAssessmentId) return;

    const {
      dimensionId,
      subDimensionId,
      aspectId,
      currentLevel,
      targetLevel,
      questionResponses = [],
      evidenceResponses = [],
      notes = '',
      barriers = '',
      plans = '',
    } = params;

    const now = new Date();

    // Check if rating exists for this aspect
    const existing = await findExistingRating(
      capabilityAssessmentId,
      dimensionId,
      aspectId,
      subDimensionId
    );

    if (existing) {
      // Update existing rating
      await db.orbitRatings.update(existing.id, {
        currentLevel,
        targetLevel,
        questionResponses,
        evidenceResponses,
        notes,
        barriers,
        plans,
        carriedForward: false,
        updatedAt: now,
      });
    } else {
      // Create new rating
      const rating: OrbitRating = {
        id: uuidv4(),
        capabilityAssessmentId,
        dimensionId,
        subDimensionId,
        aspectId,
        currentLevel,
        targetLevel,
        questionResponses,
        evidenceResponses,
        notes,
        barriers,
        plans,
        carriedForward: false,
        attachmentIds: [],
        updatedAt: now,
      };
      await db.orbitRatings.add(rating);
    }

    // Update assessment timestamp
    await db.capabilityAssessments.update(capabilityAssessmentId, {
      updatedAt: now,
    });
  };

  /**
   * Update just the maturity level for an aspect
   */
  const updateLevel = async (
    dimensionId: OrbitDimensionId,
    aspectId: string,
    currentLevel: MaturityLevelWithNA,
    subDimensionId?: TechnologySubDimensionId
  ): Promise<void> => {
    if (!capabilityAssessmentId) return;

    const existing = await findExistingRating(
      capabilityAssessmentId,
      dimensionId,
      aspectId,
      subDimensionId
    );

    const now = new Date();

    if (existing) {
      await db.orbitRatings.update(existing.id, {
        currentLevel,
        carriedForward: false,
        updatedAt: now,
      });
    } else {
      await db.orbitRatings.add({
        id: uuidv4(),
        capabilityAssessmentId,
        dimensionId,
        subDimensionId,
        aspectId,
        currentLevel,
        questionResponses: [],
        evidenceResponses: [],
        notes: '',
        barriers: '',
        plans: '',
        carriedForward: false,
        attachmentIds: [],
        updatedAt: now,
      });
    }

    await db.capabilityAssessments.update(capabilityAssessmentId, {
      updatedAt: now,
    });
  };

  /**
   * Update the target (To Be) maturity level for an aspect
   */
  const updateTargetLevel = async (
    dimensionId: OrbitDimensionId,
    aspectId: string,
    targetLevel: MaturityLevelWithNA | undefined,
    subDimensionId?: TechnologySubDimensionId
  ): Promise<void> => {
    if (!capabilityAssessmentId) return;

    const existing = await findExistingRating(
      capabilityAssessmentId,
      dimensionId,
      aspectId,
      subDimensionId
    );

    const now = new Date();

    if (existing) {
      await db.orbitRatings.update(existing.id, {
        targetLevel,
        updatedAt: now,
      });
    } else {
      // Create a new rating with just the target level
      await db.orbitRatings.add({
        id: uuidv4(),
        capabilityAssessmentId,
        dimensionId,
        subDimensionId,
        aspectId,
        currentLevel: 0,
        targetLevel,
        questionResponses: [],
        evidenceResponses: [],
        notes: '',
        barriers: '',
        plans: '',
        carriedForward: false,
        attachmentIds: [],
        updatedAt: now,
      });
    }

    await db.capabilityAssessments.update(capabilityAssessmentId, {
      updatedAt: now,
    });
  };

  /**
   * Update notes for an aspect
   */
  const updateNotes = async (
    dimensionId: OrbitDimensionId,
    aspectId: string,
    notes: string,
    subDimensionId?: TechnologySubDimensionId
  ): Promise<void> => {
    if (!capabilityAssessmentId) return;

    const existing = await findExistingRating(
      capabilityAssessmentId,
      dimensionId,
      aspectId,
      subDimensionId
    );

    if (existing) {
      await db.orbitRatings.update(existing.id, {
        notes,
        updatedAt: new Date(),
      });
    }
  };

  /**
   * Update barriers for an aspect
   */
  const updateBarriers = async (
    dimensionId: OrbitDimensionId,
    aspectId: string,
    barriers: string,
    subDimensionId?: TechnologySubDimensionId
  ): Promise<void> => {
    if (!capabilityAssessmentId) return;

    const existing = await findExistingRating(
      capabilityAssessmentId,
      dimensionId,
      aspectId,
      subDimensionId
    );

    if (existing) {
      await db.orbitRatings.update(existing.id, {
        barriers,
        updatedAt: new Date(),
      });
    }
  };

  /**
   * Update advancement plans for an aspect
   */
  const updatePlans = async (
    dimensionId: OrbitDimensionId,
    aspectId: string,
    plans: string,
    subDimensionId?: TechnologySubDimensionId
  ): Promise<void> => {
    if (!capabilityAssessmentId) return;

    const existing = await findExistingRating(
      capabilityAssessmentId,
      dimensionId,
      aspectId,
      subDimensionId
    );

    if (existing) {
      await db.orbitRatings.update(existing.id, {
        plans,
        updatedAt: new Date(),
      });
    }
  };

  /**
   * Get rating for a specific aspect
   */
  const getRating = (
    dimensionId: OrbitDimensionId,
    aspectId: string,
    subDimensionId?: TechnologySubDimensionId
  ): OrbitRating | undefined => {
    return ratings?.find(
      (r) =>
        r.dimensionId === dimensionId &&
        r.aspectId === aspectId &&
        r.subDimensionId === subDimensionId
    );
  };

  /**
   * Get all ratings for a dimension
   */
  const getRatingsForDimension = (dimensionId: OrbitDimensionId): OrbitRating[] => {
    return ratings?.filter((r) => r.dimensionId === dimensionId) ?? [];
  };

  /**
   * Get all ratings for a Technology sub-dimension
   */
  const getRatingsForSubDimension = (subDimensionId: TechnologySubDimensionId): OrbitRating[] => {
    return (
      ratings?.filter(
        (r) => r.dimensionId === 'technology' && r.subDimensionId === subDimensionId
      ) ?? []
    );
  };

  /**
   * Get count of assessed aspects (level > 0)
   */
  const getAssessedCount = (): number => {
    return ratings?.filter((r) => r.currentLevel > 0 || r.currentLevel === -1).length ?? 0;
  };

  /**
   * Get count of assessed aspects for a dimension
   */
  const getAssessedCountForDimension = (dimensionId: OrbitDimensionId): number => {
    return (
      ratings?.filter(
        (r) => r.dimensionId === dimensionId && (r.currentLevel > 0 || r.currentLevel === -1)
      ).length ?? 0
    );
  };

  /**
   * Check if all aspects in a dimension are assessed
   */
  const isDimensionComplete = (dimensionId: OrbitDimensionId, totalAspects: number): boolean => {
    return getAssessedCountForDimension(dimensionId) >= totalAspects;
  };

  /**
   * Calculate average level for a dimension (excluding N/A and not assessed)
   */
  const getAverageLevelForDimension = (dimensionId: OrbitDimensionId): number | null => {
    const dimRatings = getRatingsForDimension(dimensionId).filter((r) => r.currentLevel > 0);
    if (dimRatings.length === 0) return null;
    return calculateAverageScore(dimRatings.map((r) => r.currentLevel));
  };

  /**
   * Calculate overall average level (excluding N/A and not assessed)
   */
  const getOverallAverageLevel = (): number | null => {
    const assessed = ratings?.filter((r) => r.currentLevel > 0) ?? [];
    if (assessed.length === 0) return null;
    return calculateAverageScore(assessed.map((r) => r.currentLevel));
  };

  return {
    ratings: ratings ?? [],
    saveRating,
    updateLevel,
    updateTargetLevel,
    updateNotes,
    updateBarriers,
    updatePlans,
    getRating,
    getRatingsForDimension,
    getRatingsForSubDimension,
    getAssessedCount,
    getAssessedCountForDimension,
    isDimensionComplete,
    getAverageLevelForDimension,
    getOverallAverageLevel,
  };
}

/**
 * Find existing rating for an aspect
 */
async function findExistingRating(
  capabilityAssessmentId: string,
  dimensionId: OrbitDimensionId,
  aspectId: string,
  subDimensionId?: TechnologySubDimensionId
): Promise<OrbitRating | undefined> {
  if (subDimensionId) {
    return db.orbitRatings
      .where('[capabilityAssessmentId+dimensionId+subDimensionId+aspectId]')
      .equals([capabilityAssessmentId, dimensionId, subDimensionId, aspectId])
      .first();
  }

  // For non-Technology dimensions, use the simpler compound index
  const ratings = await db.orbitRatings
    .where('[capabilityAssessmentId+dimensionId+aspectId]')
    .equals([capabilityAssessmentId, dimensionId, aspectId])
    .toArray();

  return ratings.find((r) => !r.subDimensionId);
}
