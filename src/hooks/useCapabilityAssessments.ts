/**
 * Hook for managing capability assessments
 *
 * Provides CRUD operations and reactive queries for capability assessments.
 * Each capability area has at most one active assessment (in_progress or finalized).
 */

import { useLiveQuery } from 'dexie-react-hooks';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../services/db';
import { getAreaWithDomain } from '../services/capabilities';
import type { CapabilityAssessment, AssessmentStatus } from '../types';

/**
 * Return type for useCapabilityAssessments hook
 */
export interface UseCapabilityAssessmentsReturn {
  assessments: CapabilityAssessment[];
  startAssessment: (capabilityAreaId: string, initialTags?: string[]) => Promise<string>;
  editAssessment: (assessmentId: string) => Promise<void>;
  finalizeAssessment: (assessmentId: string) => Promise<void>;
  updateTags: (assessmentId: string, tags: string[]) => Promise<void>;
  deleteAssessment: (assessmentId: string) => Promise<void>;
  revertEdit: (assessmentId: string) => Promise<void>;
  getAssessmentForArea: (capabilityAreaId: string) => CapabilityAssessment | undefined;
  getStatusForArea: (capabilityAreaId: string) => 'not_started' | AssessmentStatus;
  getAssessmentsByStatus: (status: AssessmentStatus) => CapabilityAssessment[];
  getAssessmentsByTag: (tag: string) => CapabilityAssessment[];
  getStatusCounts: (totalAreas?: number) => {
    notStarted: number;
    inProgress: number;
    finalized: number;
  };
}

/**
 * Hook for managing capability assessments
 */
export function useCapabilityAssessments(): UseCapabilityAssessmentsReturn {
  // Get all capability assessments, ordered by most recently updated
  const assessments = useLiveQuery(
    () => db.capabilityAssessments.orderBy('updatedAt').reverse().toArray(),
    []
  );

  /**
   * Start a new assessment for a capability area
   * @param capabilityAreaId - The capability area to assess
   * @param initialTags - Optional initial tags
   * @returns The new assessment ID
   */
  const startAssessment = async (
    capabilityAreaId: string,
    initialTags: string[] = []
  ): Promise<string> => {
    const areaInfo = getAreaWithDomain(capabilityAreaId);
    if (!areaInfo) {
      throw new Error(`Capability area not found: ${capabilityAreaId}`);
    }

    const { area, domain } = areaInfo;
    const now = new Date();
    const assessmentId = uuidv4();

    const assessment: CapabilityAssessment = {
      id: assessmentId,
      capabilityDomainId: domain.id,
      capabilityDomainName: domain.name,
      capabilityAreaId: area.id,
      capabilityAreaName: area.name,
      status: 'in_progress',
      tags: initialTags,
      createdAt: now,
      updatedAt: now,
    };

    await db.capabilityAssessments.add(assessment);

    // Update tag usage
    for (const tag of initialTags) {
      await updateTagUsage(tag);
    }

    return assessmentId;
  };

  /**
   * Edit an existing finalized assessment
   * Creates a history snapshot and converts to in_progress
   */
  const editAssessment = async (assessmentId: string): Promise<void> => {
    const assessment = await db.capabilityAssessments.get(assessmentId);
    if (!assessment) {
      throw new Error(`Assessment not found: ${assessmentId}`);
    }

    if (assessment.status !== 'finalized') {
      return; // Already in progress
    }

    // Create history snapshot before editing
    await createHistorySnapshot(assessmentId);

    // Convert ratings to carry-forward mode (set previousLevel)
    const ratings = await db.orbitRatings
      .where('capabilityAssessmentId')
      .equals(assessmentId)
      .toArray();

    const now = new Date();
    for (const rating of ratings) {
      if (rating.currentLevel !== 0) {
        await db.orbitRatings.update(rating.id, {
          previousLevel: rating.currentLevel,
          carriedForward: true,
          updatedAt: now,
        });
      }
    }

    // Update assessment status
    await db.capabilityAssessments.update(assessmentId, {
      status: 'in_progress',
      updatedAt: now,
    });
  };

  /**
   * Finalize an assessment
   * Calculates scores and marks as finalized
   */
  const finalizeAssessment = async (assessmentId: string): Promise<void> => {
    const assessment = await db.capabilityAssessments.get(assessmentId);
    if (!assessment) {
      throw new Error(`Assessment not found: ${assessmentId}`);
    }

    // Calculate overall score from ratings
    const ratings = await db.orbitRatings
      .where('capabilityAssessmentId')
      .equals(assessmentId)
      .toArray();

    const assessedRatings = ratings.filter(
      (r) => r.currentLevel > 0 // Exclude 0 (not assessed) and -1 (N/A)
    );

    const overallScore =
      assessedRatings.length > 0
        ? assessedRatings.reduce((sum, r) => sum + r.currentLevel, 0) / assessedRatings.length
        : undefined;

    const now = new Date();

    await db.capabilityAssessments.update(assessmentId, {
      status: 'finalized',
      finalizedAt: now,
      updatedAt: now,
      overallScore: overallScore ? Math.round(overallScore * 10) / 10 : undefined,
    });

    // Update tag usage
    for (const tag of assessment.tags) {
      await updateTagUsage(tag);
    }
  };

  /**
   * Update tags on an assessment
   */
  const updateTags = async (assessmentId: string, tags: string[]): Promise<void> => {
    await db.capabilityAssessments.update(assessmentId, {
      tags,
      updatedAt: new Date(),
    });

    for (const tag of tags) {
      await updateTagUsage(tag);
    }
  };

  /**
   * Delete an assessment and all related data
   */
  const deleteAssessment = async (assessmentId: string): Promise<void> => {
    await db.transaction(
      'rw',
      [db.capabilityAssessments, db.orbitRatings, db.attachments],
      async () => {
        // Delete attachments
        await db.attachments.where('capabilityAssessmentId').equals(assessmentId).delete();
        // Delete ratings
        await db.orbitRatings.where('capabilityAssessmentId').equals(assessmentId).delete();
        // Delete assessment
        await db.capabilityAssessments.delete(assessmentId);
      }
    );
  };

  /**
   * Revert an edit session, restoring from history
   */
  const revertEdit = async (assessmentId: string): Promise<void> => {
    const assessment = await db.capabilityAssessments.get(assessmentId);
    if (!assessment) {
      throw new Error(`Assessment not found: ${assessmentId}`);
    }

    // Get most recent history entry
    const latestHistory = await db.assessmentHistory
      .where('capabilityAssessmentId')
      .equals(assessmentId)
      .reverse()
      .sortBy('snapshotDate')
      .then((entries) => entries[0]);

    if (!latestHistory) {
      // No history - just set back to finalized if it was
      await db.capabilityAssessments.update(assessmentId, {
        status: 'finalized',
        updatedAt: new Date(),
      });
      return;
    }

    await db.transaction(
      'rw',
      [db.capabilityAssessments, db.orbitRatings, db.assessmentHistory],
      async () => {
        // Delete current ratings
        await db.orbitRatings.where('capabilityAssessmentId').equals(assessmentId).delete();

        // Restore ratings from history
        const now = new Date();
        for (const hr of latestHistory.ratings) {
          await db.orbitRatings.add({
            id: uuidv4(),
            capabilityAssessmentId: assessmentId,
            dimensionId: hr.dimensionId,
            subDimensionId: hr.subDimensionId,
            aspectId: hr.aspectId,
            currentLevel: hr.currentLevel,
            questionResponses: hr.questionResponses,
            evidenceResponses: hr.evidenceResponses,
            notes: hr.notes,
            barriers: hr.barriers,
            plans: hr.plans,
            carriedForward: false,
            attachmentIds: [],
            updatedAt: now,
          });
        }

        // Restore assessment state
        await db.capabilityAssessments.update(assessmentId, {
          status: 'finalized',
          tags: latestHistory.tags,
          overallScore: latestHistory.overallScore,
          finalizedAt: latestHistory.snapshotDate,
          updatedAt: now,
        });

        // Remove the history entry we restored from
        await db.assessmentHistory.delete(latestHistory.id);
      }
    );
  };

  /**
   * Get assessment for a specific capability area
   */
  const getAssessmentForArea = (capabilityAreaId: string): CapabilityAssessment | undefined => {
    return assessments?.find((a) => a.capabilityAreaId === capabilityAreaId);
  };

  /**
   * Get assessment status for a capability area
   */
  const getStatusForArea = (capabilityAreaId: string): 'not_started' | AssessmentStatus => {
    const assessment = getAssessmentForArea(capabilityAreaId);
    return assessment?.status ?? 'not_started';
  };

  /**
   * Get assessments by status
   */
  const getAssessmentsByStatus = (status: AssessmentStatus): CapabilityAssessment[] => {
    return assessments?.filter((a) => a.status === status) ?? [];
  };

  /**
   * Get assessments by tag
   */
  const getAssessmentsByTag = (tag: string): CapabilityAssessment[] => {
    return assessments?.filter((a) => a.tags.includes(tag)) ?? [];
  };

  /**
   * Get assessment counts by status.
   * Note: notStarted requires knowing total capability areas, which is passed as a parameter.
   * @param totalAreas - Total number of capability areas (optional, defaults to 0 for notStarted)
   */
  const getStatusCounts = (
    totalAreas?: number
  ): {
    notStarted: number;
    inProgress: number;
    finalized: number;
  } => {
    const inProgress = assessments?.filter((a) => a.status === 'in_progress').length ?? 0;
    const finalized = assessments?.filter((a) => a.status === 'finalized').length ?? 0;
    const notStarted = totalAreas !== undefined ? totalAreas - inProgress - finalized : 0;
    return { notStarted: Math.max(0, notStarted), inProgress, finalized };
  };

  return {
    assessments: assessments ?? [],
    startAssessment,
    editAssessment,
    finalizeAssessment,
    updateTags,
    deleteAssessment,
    revertEdit,
    getAssessmentForArea,
    getStatusForArea,
    getAssessmentsByStatus,
    getAssessmentsByTag,
    getStatusCounts,
  };
}

/**
 * Return type for useCapabilityAssessment hook
 */
export interface UseCapabilityAssessmentReturn {
  assessment: CapabilityAssessment | undefined;
}

/**
 * Hook for a single capability assessment
 */
export function useCapabilityAssessment(
  assessmentId: string | undefined
): UseCapabilityAssessmentReturn {
  const assessment = useLiveQuery(
    () => (assessmentId ? db.capabilityAssessments.get(assessmentId) : undefined),
    [assessmentId]
  );

  return { assessment };
}

/**
 * Create a history snapshot of an assessment
 * @internal
 */
async function createHistorySnapshot(assessmentId: string): Promise<void> {
  const assessment = await db.capabilityAssessments.get(assessmentId);
  if (!assessment || assessment.overallScore === undefined) return;

  const ratings = await db.orbitRatings
    .where('capabilityAssessmentId')
    .equals(assessmentId)
    .toArray();

  // Calculate dimension scores
  const dimensionScores: Record<string, number> = {};
  const ratingsByDimension = new Map<string, number[]>();

  for (const rating of ratings) {
    if (rating.currentLevel > 0) {
      const key = rating.subDimensionId
        ? `${rating.dimensionId}:${rating.subDimensionId}`
        : rating.dimensionId;
      const levels = ratingsByDimension.get(key) ?? [];
      levels.push(rating.currentLevel);
      ratingsByDimension.set(key, levels);
    }
  }

  for (const [key, levels] of ratingsByDimension) {
    dimensionScores[key] = levels.reduce((a, b) => a + b, 0) / levels.length;
  }

  await db.assessmentHistory.add({
    id: uuidv4(),
    capabilityAssessmentId: assessmentId,
    capabilityAreaId: assessment.capabilityAreaId,
    snapshotDate: assessment.finalizedAt ?? assessment.updatedAt,
    tags: assessment.tags,
    overallScore: assessment.overallScore,
    dimensionScores,
    ratings: ratings.map((r) => ({
      dimensionId: r.dimensionId,
      subDimensionId: r.subDimensionId,
      aspectId: r.aspectId,
      currentLevel: r.currentLevel,
      questionResponses: r.questionResponses,
      evidenceResponses: r.evidenceResponses,
      notes: r.notes,
      barriers: r.barriers,
      plans: r.plans,
    })),
  });
}

/**
 * Update tag usage count
 * @internal
 */
async function updateTagUsage(tagName: string): Promise<void> {
  const existing = await db.tags.where('name').equals(tagName).first();
  const now = new Date();

  if (existing) {
    await db.tags.update(existing.id, {
      usageCount: existing.usageCount + 1,
      lastUsed: now,
    });
  } else {
    await db.tags.add({
      id: uuidv4(),
      name: tagName,
      usageCount: 1,
      lastUsed: now,
    });
  }
}
