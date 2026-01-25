/**
 * Hook for accessing assessment history
 *
 * Provides access to historical snapshots of finalized assessments.
 */

import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../services/db';
import type { AssessmentHistory } from '../types';

/**
 * Return type for useHistory hook
 */
export interface UseHistoryReturn {
  history: AssessmentHistory[];
  getHistoryForArea: (capabilityAreaId: string) => AssessmentHistory[];
  getHistoryForAssessment: (assessmentId: string) => AssessmentHistory[];
  getLatestHistoryForArea: (capabilityAreaId: string) => AssessmentHistory | undefined;
  getHistoryById: (historyId: string) => AssessmentHistory | undefined;
  deleteHistoryEntry: (historyId: string) => Promise<void>;
  deleteHistoryForArea: (capabilityAreaId: string) => Promise<void>;
  getHistoryCountForArea: (capabilityAreaId: string) => number;
  getTotalHistoryCount: () => number;
  getScoreTrend: (capabilityAreaId: string) => Array<{ date: Date; score: number }>;
  compareHistory: (
    historyId1: string,
    historyId2: string
  ) =>
    | {
        entry1: AssessmentHistory;
        entry2: AssessmentHistory;
        scoreDiff: number;
        dimensionDiffs: Record<string, number>;
      }
    | undefined;
}

/**
 * Hook for accessing assessment history
 */
export function useHistory(): UseHistoryReturn {
  // Get all history entries, ordered by most recent first
  const history = useLiveQuery(
    () => db.assessmentHistory.orderBy('snapshotDate').reverse().toArray(),
    []
  );

  /**
   * Get history for a specific capability area
   * @param capabilityAreaId - The capability area ID
   */
  const getHistoryForArea = (capabilityAreaId: string): AssessmentHistory[] => {
    return history?.filter((h) => h.capabilityAreaId === capabilityAreaId) ?? [];
  };

  /**
   * Get history for a specific assessment
   * @param assessmentId - The assessment ID
   */
  const getHistoryForAssessment = (assessmentId: string): AssessmentHistory[] => {
    return history?.filter((h) => h.capabilityAssessmentId === assessmentId) ?? [];
  };

  /**
   * Get the most recent history entry for a capability area
   * @param capabilityAreaId - The capability area ID
   */
  const getLatestHistoryForArea = (capabilityAreaId: string): AssessmentHistory | undefined => {
    return history?.find((h) => h.capabilityAreaId === capabilityAreaId);
  };

  /**
   * Get a specific history entry by ID
   * @param historyId - The history entry ID
   */
  const getHistoryById = (historyId: string): AssessmentHistory | undefined => {
    return history?.find((h) => h.id === historyId);
  };

  /**
   * Delete a history entry
   * @param historyId - The history entry ID to delete
   */
  const deleteHistoryEntry = async (historyId: string): Promise<void> => {
    await db.assessmentHistory.delete(historyId);
  };

  /**
   * Delete all history for a capability area
   * @param capabilityAreaId - The capability area ID
   */
  const deleteHistoryForArea = async (capabilityAreaId: string): Promise<void> => {
    await db.assessmentHistory.where('capabilityAreaId').equals(capabilityAreaId).delete();
  };

  /**
   * Get history count for a capability area
   * @param capabilityAreaId - The capability area ID
   */
  const getHistoryCountForArea = (capabilityAreaId: string): number => {
    return history?.filter((h) => h.capabilityAreaId === capabilityAreaId).length ?? 0;
  };

  /**
   * Get total history entry count
   */
  const getTotalHistoryCount = (): number => {
    return history?.length ?? 0;
  };

  /**
   * Get score trend for a capability area
   * Returns scores in chronological order (oldest first)
   * @param capabilityAreaId - The capability area ID
   */
  const getScoreTrend = (capabilityAreaId: string): Array<{ date: Date; score: number }> => {
    const areaHistory = getHistoryForArea(capabilityAreaId);
    return areaHistory.map((h) => ({ date: h.snapshotDate, score: h.overallScore })).reverse(); // Oldest first for trend display
  };

  /**
   * Compare two history entries
   * @param historyId1 - First history entry ID
   * @param historyId2 - Second history entry ID
   */
  const compareHistory = (
    historyId1: string,
    historyId2: string
  ):
    | {
        entry1: AssessmentHistory;
        entry2: AssessmentHistory;
        scoreDiff: number;
        dimensionDiffs: Record<string, number>;
      }
    | undefined => {
    const entry1 = getHistoryById(historyId1);
    const entry2 = getHistoryById(historyId2);

    if (!entry1 || !entry2) return undefined;

    const scoreDiff = entry2.overallScore - entry1.overallScore;

    const dimensionDiffs: Record<string, number> = {};
    const allDimensions = new Set([
      ...Object.keys(entry1.dimensionScores),
      ...Object.keys(entry2.dimensionScores),
    ]);

    for (const dim of allDimensions) {
      const score1 = entry1.dimensionScores[dim] ?? 0;
      const score2 = entry2.dimensionScores[dim] ?? 0;
      dimensionDiffs[dim] = score2 - score1;
    }

    return { entry1, entry2, scoreDiff, dimensionDiffs };
  };

  return {
    history: history ?? [],
    getHistoryForArea,
    getHistoryForAssessment,
    getLatestHistoryForArea,
    getHistoryById,
    deleteHistoryEntry,
    deleteHistoryForArea,
    getHistoryCountForArea,
    getTotalHistoryCount,
    getScoreTrend,
    compareHistory,
  };
}
