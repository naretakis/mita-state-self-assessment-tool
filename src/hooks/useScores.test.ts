/**
 * useScores Hook Tests
 *
 * Tests for maturity score calculations and access.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useScores } from './useScores';
import { db, clearDatabase } from '../services/db';

describe('useScores', () => {
  beforeEach(async () => {
    await clearDatabase();
  });

  afterEach(async () => {
    await clearDatabase();
  });

  describe('initial state', () => {
    it('should return empty scoresByArea map initially', async () => {
      const { result } = renderHook(() => useScores());

      await waitFor(() => {
        expect(result.current.scoresByArea.size).toBe(0);
      });
    });
  });

  describe('getCapabilityScoreData', () => {
    it('should return score data for assessed capability', async () => {
      await db.capabilityAssessments.add({
        id: 'a1',
        capabilityDomainId: 'member-management',
        capabilityDomainName: 'Member Management',
        capabilityAreaId: 'area-1',
        capabilityAreaName: 'Area 1',
        status: 'finalized',
        tags: ['phase1'],
        createdAt: new Date(),
        updatedAt: new Date(),
        finalizedAt: new Date(),
        overallScore: 3.5,
      });

      const { result } = renderHook(() => useScores());

      await waitFor(() => {
        expect(result.current.scoresByArea.size).toBe(1);
      });

      const scoreData = result.current.getCapabilityScoreData('area-1');
      expect(scoreData).toBeDefined();
      expect(scoreData?.score).toBe(3.5);
      expect(scoreData?.status).toBe('finalized');
      expect(scoreData?.tags).toContain('phase1');
    });

    it('should return undefined for non-assessed capability', async () => {
      const { result } = renderHook(() => useScores());

      await waitFor(() => {
        expect(result.current.scoresByArea).toBeDefined();
      });

      expect(result.current.getCapabilityScoreData('non-existent')).toBeUndefined();
    });
  });

  describe('getCapabilityScore', () => {
    it('should return score for capability area', async () => {
      await db.capabilityAssessments.add({
        id: 'a1',
        capabilityDomainId: 'd1',
        capabilityDomainName: 'Domain',
        capabilityAreaId: 'area-1',
        capabilityAreaName: 'Area 1',
        status: 'finalized',
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        overallScore: 4.2,
      });

      const { result } = renderHook(() => useScores());

      await waitFor(() => {
        expect(result.current.scoresByArea.size).toBe(1);
      });

      expect(result.current.getCapabilityScore('area-1')).toBe(4.2);
    });

    it('should return null for non-assessed capability', async () => {
      const { result } = renderHook(() => useScores());

      await waitFor(() => {
        expect(result.current.scoresByArea).toBeDefined();
      });

      expect(result.current.getCapabilityScore('non-existent')).toBeNull();
    });
  });

  describe('getDomainScore', () => {
    it('should calculate average score for domain from finalized assessments', async () => {
      await db.capabilityAssessments.bulkAdd([
        {
          id: 'a1',
          capabilityDomainId: 'domain-1',
          capabilityDomainName: 'Domain 1',
          capabilityAreaId: 'area-1',
          capabilityAreaName: 'Area 1',
          status: 'finalized',
          tags: [],
          createdAt: new Date(),
          updatedAt: new Date(),
          overallScore: 3.0,
        },
        {
          id: 'a2',
          capabilityDomainId: 'domain-1',
          capabilityDomainName: 'Domain 1',
          capabilityAreaId: 'area-2',
          capabilityAreaName: 'Area 2',
          status: 'finalized',
          tags: [],
          createdAt: new Date(),
          updatedAt: new Date(),
          overallScore: 5.0,
        },
        {
          id: 'a3',
          capabilityDomainId: 'domain-1',
          capabilityDomainName: 'Domain 1',
          capabilityAreaId: 'area-3',
          capabilityAreaName: 'Area 3',
          status: 'in_progress', // Not finalized - excluded
          tags: [],
          createdAt: new Date(),
          updatedAt: new Date(),
          overallScore: 1.0,
        },
      ]);

      const { result } = renderHook(() => useScores());

      await waitFor(() => {
        expect(result.current.scoresByArea.size).toBe(3);
      });

      expect(result.current.getDomainScore('domain-1')).toBe(4.0); // (3 + 5) / 2
    });

    it('should return null for domain with no finalized assessments', async () => {
      await db.capabilityAssessments.add({
        id: 'a1',
        capabilityDomainId: 'domain-1',
        capabilityDomainName: 'Domain 1',
        capabilityAreaId: 'area-1',
        capabilityAreaName: 'Area 1',
        status: 'in_progress',
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const { result } = renderHook(() => useScores());

      await waitFor(() => {
        expect(result.current.scoresByArea.size).toBe(1);
      });

      expect(result.current.getDomainScore('domain-1')).toBeNull();
    });
  });

  describe('getOverallScore', () => {
    it('should calculate average across all finalized assessments', async () => {
      await db.capabilityAssessments.bulkAdd([
        {
          id: 'a1',
          capabilityDomainId: 'd1',
          capabilityDomainName: 'D1',
          capabilityAreaId: 'area-1',
          capabilityAreaName: 'Area 1',
          status: 'finalized',
          tags: [],
          createdAt: new Date(),
          updatedAt: new Date(),
          overallScore: 2.0,
        },
        {
          id: 'a2',
          capabilityDomainId: 'd2',
          capabilityDomainName: 'D2',
          capabilityAreaId: 'area-2',
          capabilityAreaName: 'Area 2',
          status: 'finalized',
          tags: [],
          createdAt: new Date(),
          updatedAt: new Date(),
          overallScore: 4.0,
        },
        {
          id: 'a3',
          capabilityDomainId: 'd3',
          capabilityDomainName: 'D3',
          capabilityAreaId: 'area-3',
          capabilityAreaName: 'Area 3',
          status: 'finalized',
          tags: [],
          createdAt: new Date(),
          updatedAt: new Date(),
          overallScore: 3.0,
        },
      ]);

      const { result } = renderHook(() => useScores());

      await waitFor(() => {
        expect(result.current.scoresByArea.size).toBe(3);
      });

      expect(result.current.getOverallScore()).toBe(3.0); // (2 + 4 + 3) / 3
    });

    it('should return null when no finalized assessments exist', async () => {
      const { result } = renderHook(() => useScores());

      await waitFor(() => {
        expect(result.current.scoresByArea).toBeDefined();
      });

      expect(result.current.getOverallScore()).toBeNull();
    });
  });

  describe('getCapabilityStatus', () => {
    it('should return not_started for non-assessed capability', async () => {
      const { result } = renderHook(() => useScores());

      await waitFor(() => {
        expect(result.current.scoresByArea).toBeDefined();
      });

      expect(result.current.getCapabilityStatus('non-existent')).toBe('not_started');
    });

    it('should return correct status for assessed capability', async () => {
      await db.capabilityAssessments.add({
        id: 'a1',
        capabilityDomainId: 'd1',
        capabilityDomainName: 'D1',
        capabilityAreaId: 'area-1',
        capabilityAreaName: 'Area 1',
        status: 'in_progress',
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const { result } = renderHook(() => useScores());

      await waitFor(() => {
        expect(result.current.scoresByArea.size).toBe(1);
      });

      expect(result.current.getCapabilityStatus('area-1')).toBe('in_progress');
    });
  });

  describe('getCapabilityCompletion', () => {
    it('should return completion percentage', async () => {
      await db.capabilityAssessments.add({
        id: 'a1',
        capabilityDomainId: 'd1',
        capabilityDomainName: 'D1',
        capabilityAreaId: 'area-1',
        capabilityAreaName: 'Area 1',
        status: 'in_progress',
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Add some ratings
      await db.orbitRatings.bulkAdd([
        {
          id: 'r1',
          capabilityAssessmentId: 'a1',
          dimensionId: 'outcomes',
          aspectId: 'a1',
          currentLevel: 3,
          questionResponses: [],
          evidenceResponses: [],
          notes: '',
          barriers: '',
          plans: '',
          carriedForward: false,
          attachmentIds: [],
          updatedAt: new Date(),
        },
        {
          id: 'r2',
          capabilityAssessmentId: 'a1',
          dimensionId: 'roles',
          aspectId: 'a2',
          currentLevel: -1, // N/A counts as assessed
          questionResponses: [],
          evidenceResponses: [],
          notes: '',
          barriers: '',
          plans: '',
          carriedForward: false,
          attachmentIds: [],
          updatedAt: new Date(),
        },
      ]);

      const { result } = renderHook(() => useScores());

      await waitFor(() => {
        expect(result.current.scoresByArea.size).toBe(1);
      });

      const completion = result.current.getCapabilityCompletion('area-1');
      expect(completion).toBeGreaterThan(0);
    });

    it('should return 0 for non-assessed capability', async () => {
      const { result } = renderHook(() => useScores());

      await waitFor(() => {
        expect(result.current.scoresByArea).toBeDefined();
      });

      expect(result.current.getCapabilityCompletion('non-existent')).toBe(0);
    });
  });

  describe('getCapabilityTags', () => {
    it('should return tags for finalized assessment', async () => {
      await db.capabilityAssessments.add({
        id: 'a1',
        capabilityDomainId: 'd1',
        capabilityDomainName: 'D1',
        capabilityAreaId: 'area-1',
        capabilityAreaName: 'Area 1',
        status: 'finalized',
        tags: ['phase1', 'priority'],
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const { result } = renderHook(() => useScores());

      await waitFor(() => {
        expect(result.current.scoresByArea.size).toBe(1);
      });

      const tags = result.current.getCapabilityTags('area-1');
      expect(tags).toContain('phase1');
      expect(tags).toContain('priority');
    });

    it('should return empty array for in_progress assessment', async () => {
      await db.capabilityAssessments.add({
        id: 'a1',
        capabilityDomainId: 'd1',
        capabilityDomainName: 'D1',
        capabilityAreaId: 'area-1',
        capabilityAreaName: 'Area 1',
        status: 'in_progress',
        tags: ['draft-tag'],
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const { result } = renderHook(() => useScores());

      await waitFor(() => {
        expect(result.current.scoresByArea.size).toBe(1);
      });

      expect(result.current.getCapabilityTags('area-1')).toEqual([]);
    });
  });

  describe('getAllTagsInUse', () => {
    it('should return unique tags from finalized assessments', async () => {
      await db.capabilityAssessments.bulkAdd([
        {
          id: 'a1',
          capabilityDomainId: 'd1',
          capabilityDomainName: 'D1',
          capabilityAreaId: 'area-1',
          capabilityAreaName: 'Area 1',
          status: 'finalized',
          tags: ['phase1', 'priority'],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'a2',
          capabilityDomainId: 'd1',
          capabilityDomainName: 'D1',
          capabilityAreaId: 'area-2',
          capabilityAreaName: 'Area 2',
          status: 'finalized',
          tags: ['phase1', 'review'],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);

      const { result } = renderHook(() => useScores());

      await waitFor(() => {
        expect(result.current.scoresByArea.size).toBe(2);
      });

      const tags = result.current.getAllTagsInUse();
      expect(tags).toHaveLength(3);
      expect(tags).toContain('phase1');
      expect(tags).toContain('priority');
      expect(tags).toContain('review');
    });
  });

  describe('getCapabilitiesByTag', () => {
    it('should return capability area IDs with specific tag', async () => {
      await db.capabilityAssessments.bulkAdd([
        {
          id: 'a1',
          capabilityDomainId: 'd1',
          capabilityDomainName: 'D1',
          capabilityAreaId: 'area-1',
          capabilityAreaName: 'Area 1',
          status: 'finalized',
          tags: ['target-tag'],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'a2',
          capabilityDomainId: 'd1',
          capabilityDomainName: 'D1',
          capabilityAreaId: 'area-2',
          capabilityAreaName: 'Area 2',
          status: 'finalized',
          tags: ['other-tag'],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'a3',
          capabilityDomainId: 'd1',
          capabilityDomainName: 'D1',
          capabilityAreaId: 'area-3',
          capabilityAreaName: 'Area 3',
          status: 'finalized',
          tags: ['target-tag'],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);

      const { result } = renderHook(() => useScores());

      await waitFor(() => {
        expect(result.current.scoresByArea.size).toBe(3);
      });

      const capabilities = result.current.getCapabilitiesByTag('target-tag');
      expect(capabilities).toHaveLength(2);
      expect(capabilities).toContain('area-1');
      expect(capabilities).toContain('area-3');
    });
  });

  describe('getStatusCounts', () => {
    it('should return correct counts by status', async () => {
      await db.capabilityAssessments.bulkAdd([
        {
          id: 'a1',
          capabilityDomainId: 'd1',
          capabilityDomainName: 'D1',
          capabilityAreaId: 'area-1',
          capabilityAreaName: 'Area 1',
          status: 'in_progress',
          tags: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'a2',
          capabilityDomainId: 'd1',
          capabilityDomainName: 'D1',
          capabilityAreaId: 'area-2',
          capabilityAreaName: 'Area 2',
          status: 'finalized',
          tags: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'a3',
          capabilityDomainId: 'd1',
          capabilityDomainName: 'D1',
          capabilityAreaId: 'area-3',
          capabilityAreaName: 'Area 3',
          status: 'finalized',
          tags: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);

      const { result } = renderHook(() => useScores());

      await waitFor(() => {
        expect(result.current.scoresByArea.size).toBe(3);
      });

      const counts = result.current.getStatusCounts();
      expect(counts.inProgress).toBe(1);
      expect(counts.finalized).toBe(2);
      expect(counts.total).toBe(75); // Total capability areas from capabilities.json
    });
  });

  describe('getDomainStatusCounts', () => {
    it('should return status counts for specific domain', async () => {
      // Using actual domain ID from capabilities.json
      await db.capabilityAssessments.bulkAdd([
        {
          id: 'a1',
          capabilityDomainId: 'provider-management',
          capabilityDomainName: 'Provider Management',
          capabilityAreaId: 'provider-enrollment',
          capabilityAreaName: 'Provider Enrollment',
          status: 'finalized',
          tags: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'a2',
          capabilityDomainId: 'provider-management',
          capabilityDomainName: 'Provider Management',
          capabilityAreaId: 'provider-screening',
          capabilityAreaName: 'Provider Screening',
          status: 'in_progress',
          tags: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);

      const { result } = renderHook(() => useScores());

      await waitFor(() => {
        expect(result.current.scoresByArea.size).toBe(2);
      });

      const counts = result.current.getDomainStatusCounts('provider-management');
      expect(counts.finalized).toBe(1);
      expect(counts.inProgress).toBe(1);
      expect(counts.total).toBeGreaterThan(0);
    });

    it('should return zeros for non-existent domain', async () => {
      const { result } = renderHook(() => useScores());

      await waitFor(() => {
        expect(result.current.scoresByArea).toBeDefined();
      });

      const counts = result.current.getDomainStatusCounts('non-existent');
      expect(counts.total).toBe(0);
      expect(counts.finalized).toBe(0);
      expect(counts.inProgress).toBe(0);
      expect(counts.notStarted).toBe(0);
    });
  });

  describe('getDimensionScoresForAssessment', () => {
    it('should return dimension scores for assessment', async () => {
      await db.capabilityAssessments.add({
        id: 'a1',
        capabilityDomainId: 'd1',
        capabilityDomainName: 'D1',
        capabilityAreaId: 'area-1',
        capabilityAreaName: 'Area 1',
        status: 'finalized',
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        overallScore: 3.5,
      });

      // Use real aspect IDs from the ORBIT model
      await db.orbitRatings.bulkAdd([
        {
          id: 'r1',
          capabilityAssessmentId: 'a1',
          dimensionId: 'outcomes',
          aspectId: 'culture-mindset', // Real ORBIT aspect ID
          currentLevel: 3,
          questionResponses: [],
          evidenceResponses: [],
          notes: '',
          barriers: '',
          plans: '',
          carriedForward: false,
          attachmentIds: [],
          updatedAt: new Date(),
        },
        {
          id: 'r2',
          capabilityAssessmentId: 'a1',
          dimensionId: 'outcomes',
          aspectId: 'capability', // Real ORBIT aspect ID
          currentLevel: 4,
          questionResponses: [],
          evidenceResponses: [],
          notes: '',
          barriers: '',
          plans: '',
          carriedForward: false,
          attachmentIds: [],
          updatedAt: new Date(),
        },
        {
          id: 'r3',
          capabilityAssessmentId: 'a1',
          dimensionId: 'roles',
          aspectId: 'technology-resources', // Real ORBIT aspect ID
          currentLevel: 5,
          questionResponses: [],
          evidenceResponses: [],
          notes: '',
          barriers: '',
          plans: '',
          carriedForward: false,
          attachmentIds: [],
          updatedAt: new Date(),
        },
      ]);

      const { result } = renderHook(() => useScores());

      await waitFor(() => {
        expect(result.current.scoresByArea.size).toBe(1);
      });

      const dimensionScores = result.current.getDimensionScoresForAssessment('a1');
      expect(dimensionScores).toBeDefined();
      expect(dimensionScores).toHaveLength(5); // All 5 ORBIT dimensions

      const outcomesScore = dimensionScores?.find((d) => d.dimensionId === 'outcomes');
      expect(outcomesScore?.averageLevel).toBe(3.5); // (3 + 4) / 2

      const rolesScore = dimensionScores?.find((d) => d.dimensionId === 'roles');
      expect(rolesScore?.averageLevel).toBe(5.0);
    });

    it('should return undefined for non-existent assessment', async () => {
      const { result } = renderHook(() => useScores());

      await waitFor(() => {
        expect(result.current.scoresByArea).toBeDefined();
      });

      expect(result.current.getDimensionScoresForAssessment('non-existent')).toBeUndefined();
    });
  });
});
