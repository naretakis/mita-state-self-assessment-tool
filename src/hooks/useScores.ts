/**
 * Hook for accessing and calculating maturity scores
 *
 * Provides score calculations at aspect, dimension, capability area, and domain levels.
 * Scores are simple averages (no weighting) as per PROJECT_FOUNDATION.md.
 */

import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../services/db';
import { getTotalAreaCount, getAreasByDomainId } from '../services/capabilities';
import {
  getAllDimensionIds,
  getTotalAspectCount,
  getTechnologySubDimensions,
  getAspectsForDimension,
  getAspectsForSubDimension,
} from '../services/orbit';
import type { OrbitRating, OrbitDimensionId, DimensionScore, SubDimensionScore } from '../types';

/**
 * Score data for a capability area
 */
export interface CapabilityScoreData {
  capabilityAreaId: string;
  capabilityDomainId: string;
  score: number | null;
  assessmentId: string | null;
  assessmentDate: Date | null;
  tags: string[];
  status: 'not_started' | 'in_progress' | 'finalized';
  completionPercentage: number;
}

/**
 * Return type for useScores hook
 */
export interface UseScoresReturn {
  scoresByArea: Map<string, CapabilityScoreData>;
  getCapabilityScoreData: (capabilityAreaId: string) => CapabilityScoreData | undefined;
  getCapabilityScore: (capabilityAreaId: string) => number | null;
  getDomainScore: (domainId: string) => number | null;
  getOverallScore: () => number | null;
  getCapabilityStatus: (capabilityAreaId: string) => 'not_started' | 'in_progress' | 'finalized';
  getCapabilityCompletion: (capabilityAreaId: string) => number;
  getCapabilityTags: (capabilityAreaId: string) => string[];
  getAllTagsInUse: () => string[];
  getCapabilitiesByTag: (tag: string) => string[];
  getDomainTags: (domainId: string) => string[];
  getStatusCounts: () => {
    notStarted: number;
    inProgress: number;
    finalized: number;
    total: number;
  };
  getDomainStatusCounts: (domainId: string) => {
    notStarted: number;
    inProgress: number;
    finalized: number;
    total: number;
  };
  getDimensionScoresForAssessment: (assessmentId: string) => DimensionScore[] | undefined;
}

/**
 * Hook for accessing maturity scores
 */
export function useScores(): UseScoresReturn {
  // Get all assessments and ratings
  const data = useLiveQuery(async () => {
    const assessments = await db.capabilityAssessments.toArray();
    const ratings = await db.orbitRatings.toArray();

    // Group ratings by assessment
    const ratingsByAssessment = new Map<string, OrbitRating[]>();
    for (const rating of ratings) {
      const existing = ratingsByAssessment.get(rating.capabilityAssessmentId) ?? [];
      existing.push(rating);
      ratingsByAssessment.set(rating.capabilityAssessmentId, existing);
    }

    // Build score data for each capability area
    const scoresByArea = new Map<string, CapabilityScoreData>();
    const totalAspects = getTotalAspectCount();

    for (const assessment of assessments) {
      const assessmentRatings = ratingsByAssessment.get(assessment.id) ?? [];
      const assessedCount = assessmentRatings.filter(
        (r) => r.currentLevel > 0 || r.currentLevel === -1
      ).length;

      scoresByArea.set(assessment.capabilityAreaId, {
        capabilityAreaId: assessment.capabilityAreaId,
        capabilityDomainId: assessment.capabilityDomainId,
        score: assessment.overallScore ?? null,
        assessmentId: assessment.id,
        assessmentDate: assessment.finalizedAt ?? assessment.updatedAt,
        tags: assessment.tags,
        status: assessment.status,
        completionPercentage: Math.round((assessedCount / totalAspects) * 100),
      });
    }

    return { assessments, ratingsByAssessment, scoresByArea };
  }, []);

  /**
   * Get score data for a specific capability area
   */
  const getCapabilityScoreData = (capabilityAreaId: string): CapabilityScoreData | undefined => {
    return data?.scoresByArea.get(capabilityAreaId);
  };

  /**
   * Get just the score for a capability area
   */
  const getCapabilityScore = (capabilityAreaId: string): number | null => {
    return data?.scoresByArea.get(capabilityAreaId)?.score ?? null;
  };

  /**
   * Get average score for a domain (from finalized assessments only)
   */
  const getDomainScore = (domainId: string): number | null => {
    if (!data) return null;

    const domainScores: number[] = [];
    for (const scoreData of data.scoresByArea.values()) {
      if (
        scoreData.capabilityDomainId === domainId &&
        scoreData.status === 'finalized' &&
        scoreData.score !== null
      ) {
        domainScores.push(scoreData.score);
      }
    }

    if (domainScores.length === 0) return null;
    const avg = domainScores.reduce((a, b) => a + b, 0) / domainScores.length;
    return Math.round(avg * 10) / 10;
  };

  /**
   * Get overall average score across all finalized assessments
   */
  const getOverallScore = (): number | null => {
    if (!data) return null;

    const scores: number[] = [];
    for (const scoreData of data.scoresByArea.values()) {
      if (scoreData.status === 'finalized' && scoreData.score !== null) {
        scores.push(scoreData.score);
      }
    }

    if (scores.length === 0) return null;
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    return Math.round(avg * 10) / 10;
  };

  /**
   * Get status for a capability area
   */
  const getCapabilityStatus = (
    capabilityAreaId: string
  ): 'not_started' | 'in_progress' | 'finalized' => {
    return data?.scoresByArea.get(capabilityAreaId)?.status ?? 'not_started';
  };

  /**
   * Get completion percentage for a capability area
   */
  const getCapabilityCompletion = (capabilityAreaId: string): number => {
    return data?.scoresByArea.get(capabilityAreaId)?.completionPercentage ?? 0;
  };

  /**
   * Get tags for a capability area (from finalized assessment)
   */
  const getCapabilityTags = (capabilityAreaId: string): string[] => {
    const scoreData = data?.scoresByArea.get(capabilityAreaId);
    if (scoreData?.status === 'finalized') {
      return scoreData.tags;
    }
    return [];
  };

  /**
   * Get all unique tags in use across finalized assessments
   */
  const getAllTagsInUse = (): string[] => {
    if (!data) return [];

    const tagSet = new Set<string>();
    for (const scoreData of data.scoresByArea.values()) {
      if (scoreData.status === 'finalized') {
        for (const tag of scoreData.tags) {
          tagSet.add(tag);
        }
      }
    }

    return Array.from(tagSet).sort();
  };

  /**
   * Get capability areas that have a specific tag
   */
  const getCapabilitiesByTag = (tag: string): string[] => {
    if (!data) return [];

    const capabilities: string[] = [];
    for (const [areaId, scoreData] of data.scoresByArea) {
      if (scoreData.status === 'finalized' && scoreData.tags.includes(tag)) {
        capabilities.push(areaId);
      }
    }

    return capabilities;
  };

  /**
   * Get aggregated tags for a domain (unique tags from all finalized capability areas)
   */
  const getDomainTags = (domainId: string): string[] => {
    if (!data) return [];

    const tagSet = new Set<string>();
    for (const scoreData of data.scoresByArea.values()) {
      if (scoreData.capabilityDomainId === domainId && scoreData.status === 'finalized') {
        for (const tag of scoreData.tags) {
          tagSet.add(tag);
        }
      }
    }

    return Array.from(tagSet).sort();
  };

  /**
   * Get assessment counts by status
   */
  const getStatusCounts = (): {
    notStarted: number;
    inProgress: number;
    finalized: number;
    total: number;
  } => {
    const total = getTotalAreaCount();
    const inProgress = data?.assessments.filter((a) => a.status === 'in_progress').length ?? 0;
    const finalized = data?.assessments.filter((a) => a.status === 'finalized').length ?? 0;
    const notStarted = total - inProgress - finalized;

    return { notStarted, inProgress, finalized, total };
  };

  /**
   * Get domain-level status counts
   */
  const getDomainStatusCounts = (
    domainId: string
  ): {
    notStarted: number;
    inProgress: number;
    finalized: number;
    total: number;
  } => {
    const areas = getAreasByDomainId(domainId);
    if (areas.length === 0) return { notStarted: 0, inProgress: 0, finalized: 0, total: 0 };

    const total = areas.length;
    let inProgress = 0;
    let finalized = 0;

    for (const area of areas) {
      const status = getCapabilityStatus(area.id);
      if (status === 'in_progress') inProgress++;
      else if (status === 'finalized') finalized++;
    }

    return { notStarted: total - inProgress - finalized, inProgress, finalized, total };
  };

  /**
   * Get dimension scores for an assessment.
   * For Technology dimension, calculates sub-dimension averages first,
   * then averages those for the overall Technology score.
   */
  const getDimensionScoresForAssessment = (assessmentId: string): DimensionScore[] | undefined => {
    if (!data) return undefined;

    const ratings = data.ratingsByAssessment.get(assessmentId);
    if (!ratings) return undefined;

    const techSubDims = getTechnologySubDimensions();

    return getAllDimensionIds().map((dimId) => {
      const dimRatings = ratings.filter((r) => r.dimensionId === dimId);

      // Get all aspects from ORBIT model for this dimension
      const orbitAspects = getAspectsForDimension(dimId);

      // Build aspect scores from ORBIT model, checking if each has a rating
      const aspectScores = orbitAspects.map((aspect) => {
        const rating = dimRatings.find((r) => r.aspectId === aspect.id);
        return {
          aspectId: aspect.id,
          aspectName: aspect.name,
          dimensionId: dimId,
          subDimensionId: rating?.subDimensionId,
          currentLevel: rating?.currentLevel ?? 0,
          isAssessed: rating ? rating.currentLevel !== 0 : false,
        };
      });

      let avgLevel: number | null = null;
      let subDimensionScores: SubDimensionScore[] | undefined;

      if (dimId === 'technology') {
        // For Technology: calculate each sub-dimension average, then average those
        subDimensionScores = techSubDims.map((subDim) => {
          // Get all aspects from ORBIT model for this sub-dimension
          const subDimOrbitAspects = getAspectsForSubDimension(subDim.id);
          const subDimRatings = dimRatings.filter((r) => r.subDimensionId === subDim.id);

          // Build aspect scores from ORBIT model
          const subDimAspectScores = subDimOrbitAspects.map((aspect) => {
            const rating = subDimRatings.find((r) => r.aspectId === aspect.id);
            return {
              aspectId: aspect.id,
              aspectName: aspect.name,
              dimensionId: dimId,
              subDimensionId: subDim.id,
              currentLevel: rating?.currentLevel ?? 0,
              isAssessed: rating ? rating.currentLevel !== 0 : false,
            };
          });

          const assessed = subDimAspectScores.filter((a) => a.currentLevel > 0);
          const subAvg =
            assessed.length > 0
              ? assessed.reduce((sum, a) => sum + a.currentLevel, 0) / assessed.length
              : null;

          return {
            subDimensionId: subDim.id,
            subDimensionName: subDim.name,
            averageLevel: subAvg ? Math.round(subAvg * 10) / 10 : null,
            aspectScores: subDimAspectScores,
          };
        });

        // Technology dimension score = average of sub-dimension scores
        const validSubScores = subDimensionScores
          .map((s) => s.averageLevel)
          .filter((v): v is number => v !== null);
        avgLevel =
          validSubScores.length > 0
            ? Math.round((validSubScores.reduce((a, b) => a + b, 0) / validSubScores.length) * 10) /
              10
            : null;
      } else {
        // For non-Technology dimensions: simple average of aspect scores
        const assessed = aspectScores.filter((a) => a.currentLevel > 0);
        avgLevel =
          assessed.length > 0
            ? Math.round(
                (assessed.reduce((sum, a) => sum + a.currentLevel, 0) / assessed.length) * 10
              ) / 10
            : null;
      }

      return {
        dimensionId: dimId,
        dimensionName: getDimensionDisplayName(dimId),
        required: isDimensionRequired(dimId),
        averageLevel: avgLevel,
        aspectScores,
        subDimensionScores,
      };
    });
  };

  return {
    scoresByArea: data?.scoresByArea ?? new Map(),
    getCapabilityScoreData,
    getCapabilityScore,
    getDomainScore,
    getOverallScore,
    getCapabilityStatus,
    getCapabilityCompletion,
    getCapabilityTags,
    getAllTagsInUse,
    getCapabilitiesByTag,
    getDomainTags,
    getStatusCounts,
    getDomainStatusCounts,
    getDimensionScoresForAssessment,
  };
}

/**
 * Helper: Get dimension display name
 */
function getDimensionDisplayName(dimensionId: OrbitDimensionId): string {
  const names: Record<OrbitDimensionId, string> = {
    outcomes: 'Outcomes',
    roles: 'Roles',
    businessArchitecture: 'Business Architecture',
    informationData: 'Information & Data',
    technology: 'Technology',
  };
  return names[dimensionId];
}

/**
 * Helper: Check if dimension is required
 */
function isDimensionRequired(dimensionId: OrbitDimensionId): boolean {
  return (
    dimensionId === 'businessArchitecture' ||
    dimensionId === 'informationData' ||
    dimensionId === 'technology'
  );
}
