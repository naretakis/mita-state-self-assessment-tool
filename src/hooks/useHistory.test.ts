/**
 * useHistory Hook Tests
 *
 * Tests for assessment history access and management.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useHistory } from './useHistory';
import { db, clearDatabase } from '../services/db';
import type { AssessmentHistory } from '../types';

describe('useHistory', () => {
  beforeEach(async () => {
    await clearDatabase();
  });

  afterEach(async () => {
    await clearDatabase();
  });

  const createHistoryEntry = (overrides: Partial<AssessmentHistory> = {}): AssessmentHistory => ({
    id: `history-${Date.now()}-${Math.random()}`,
    capabilityAssessmentId: 'assessment-1',
    capabilityAreaId: 'area-1',
    snapshotDate: new Date(),
    tags: [],
    overallScore: 3.0,
    dimensionScores: {},
    ratings: [],
    ...overrides,
  });

  describe('initial state', () => {
    it('should return empty history array initially', async () => {
      const { result } = renderHook(() => useHistory());

      await waitFor(() => {
        expect(result.current.history).toEqual([]);
      });
    });

    it('should load existing history from database', async () => {
      await db.assessmentHistory.bulkAdd([
        createHistoryEntry({ id: 'h1' }),
        createHistoryEntry({ id: 'h2' }),
      ]);

      const { result } = renderHook(() => useHistory());

      await waitFor(() => {
        expect(result.current.history).toHaveLength(2);
      });
    });
  });

  describe('getHistoryForArea', () => {
    it('should return history entries for specific capability area', async () => {
      await db.assessmentHistory.bulkAdd([
        createHistoryEntry({ id: 'h1', capabilityAreaId: 'area-1' }),
        createHistoryEntry({ id: 'h2', capabilityAreaId: 'area-1' }),
        createHistoryEntry({ id: 'h3', capabilityAreaId: 'area-2' }),
      ]);

      const { result } = renderHook(() => useHistory());

      await waitFor(() => {
        expect(result.current.history).toHaveLength(3);
      });

      const area1History = result.current.getHistoryForArea('area-1');
      expect(area1History).toHaveLength(2);
      expect(area1History.every((h) => h.capabilityAreaId === 'area-1')).toBe(true);
    });

    it('should return empty array for area with no history', async () => {
      const { result } = renderHook(() => useHistory());

      await waitFor(() => {
        expect(result.current.history).toBeDefined();
      });

      const history = result.current.getHistoryForArea('non-existent');
      expect(history).toEqual([]);
    });
  });

  describe('getHistoryForAssessment', () => {
    it('should return history entries for specific assessment', async () => {
      await db.assessmentHistory.bulkAdd([
        createHistoryEntry({ id: 'h1', capabilityAssessmentId: 'assessment-1' }),
        createHistoryEntry({ id: 'h2', capabilityAssessmentId: 'assessment-1' }),
        createHistoryEntry({ id: 'h3', capabilityAssessmentId: 'assessment-2' }),
      ]);

      const { result } = renderHook(() => useHistory());

      await waitFor(() => {
        expect(result.current.history).toHaveLength(3);
      });

      const assessmentHistory = result.current.getHistoryForAssessment('assessment-1');
      expect(assessmentHistory).toHaveLength(2);
    });
  });

  describe('getLatestHistoryForArea', () => {
    it('should return most recent history entry for area', async () => {
      await db.assessmentHistory.bulkAdd([
        createHistoryEntry({
          id: 'h1',
          capabilityAreaId: 'area-1',
          snapshotDate: new Date('2025-01-01'),
          overallScore: 2.0,
        }),
        createHistoryEntry({
          id: 'h2',
          capabilityAreaId: 'area-1',
          snapshotDate: new Date('2025-01-15'),
          overallScore: 3.0,
        }),
        createHistoryEntry({
          id: 'h3',
          capabilityAreaId: 'area-1',
          snapshotDate: new Date('2025-01-10'),
          overallScore: 2.5,
        }),
      ]);

      const { result } = renderHook(() => useHistory());

      await waitFor(() => {
        expect(result.current.history).toHaveLength(3);
      });

      const latest = result.current.getLatestHistoryForArea('area-1');
      expect(latest?.overallScore).toBe(3.0); // Most recent by snapshotDate
    });

    it('should return undefined for area with no history', async () => {
      const { result } = renderHook(() => useHistory());

      await waitFor(() => {
        expect(result.current.history).toBeDefined();
      });

      expect(result.current.getLatestHistoryForArea('no-history')).toBeUndefined();
    });
  });

  describe('getHistoryById', () => {
    it('should return specific history entry by ID', async () => {
      await db.assessmentHistory.add(createHistoryEntry({ id: 'specific-id', overallScore: 4.5 }));

      const { result } = renderHook(() => useHistory());

      await waitFor(() => {
        expect(result.current.history).toHaveLength(1);
      });

      const entry = result.current.getHistoryById('specific-id');
      expect(entry?.overallScore).toBe(4.5);
    });

    it('should return undefined for non-existent ID', async () => {
      const { result } = renderHook(() => useHistory());

      await waitFor(() => {
        expect(result.current.history).toBeDefined();
      });

      expect(result.current.getHistoryById('fake-id')).toBeUndefined();
    });
  });

  describe('deleteHistoryEntry', () => {
    it('should delete a specific history entry', async () => {
      await db.assessmentHistory.bulkAdd([
        createHistoryEntry({ id: 'keep' }),
        createHistoryEntry({ id: 'delete-me' }),
      ]);

      const { result } = renderHook(() => useHistory());

      await waitFor(() => {
        expect(result.current.history).toHaveLength(2);
      });

      await act(async () => {
        await result.current.deleteHistoryEntry('delete-me');
      });

      const remaining = await db.assessmentHistory.toArray();
      expect(remaining).toHaveLength(1);
      expect(remaining[0]!.id).toBe('keep');
    });
  });

  describe('deleteHistoryForArea', () => {
    it('should delete all history for a capability area', async () => {
      await db.assessmentHistory.bulkAdd([
        createHistoryEntry({ id: 'h1', capabilityAreaId: 'area-to-clear' }),
        createHistoryEntry({ id: 'h2', capabilityAreaId: 'area-to-clear' }),
        createHistoryEntry({ id: 'h3', capabilityAreaId: 'area-to-keep' }),
      ]);

      const { result } = renderHook(() => useHistory());

      await waitFor(() => {
        expect(result.current.history).toHaveLength(3);
      });

      await act(async () => {
        await result.current.deleteHistoryForArea('area-to-clear');
      });

      const remaining = await db.assessmentHistory.toArray();
      expect(remaining).toHaveLength(1);
      expect(remaining[0]!.capabilityAreaId).toBe('area-to-keep');
    });
  });

  describe('getHistoryCountForArea', () => {
    it('should return correct count of history entries', async () => {
      await db.assessmentHistory.bulkAdd([
        createHistoryEntry({ id: 'h1', capabilityAreaId: 'area-1' }),
        createHistoryEntry({ id: 'h2', capabilityAreaId: 'area-1' }),
        createHistoryEntry({ id: 'h3', capabilityAreaId: 'area-1' }),
        createHistoryEntry({ id: 'h4', capabilityAreaId: 'area-2' }),
      ]);

      const { result } = renderHook(() => useHistory());

      await waitFor(() => {
        expect(result.current.history).toHaveLength(4);
      });

      expect(result.current.getHistoryCountForArea('area-1')).toBe(3);
      expect(result.current.getHistoryCountForArea('area-2')).toBe(1);
      expect(result.current.getHistoryCountForArea('area-3')).toBe(0);
    });
  });

  describe('getTotalHistoryCount', () => {
    it('should return total count of all history entries', async () => {
      await db.assessmentHistory.bulkAdd([
        createHistoryEntry({ id: 'h1' }),
        createHistoryEntry({ id: 'h2' }),
        createHistoryEntry({ id: 'h3' }),
      ]);

      const { result } = renderHook(() => useHistory());

      await waitFor(() => {
        expect(result.current.history).toHaveLength(3);
      });

      expect(result.current.getTotalHistoryCount()).toBe(3);
    });
  });

  describe('getScoreTrend', () => {
    it('should return scores in chronological order', async () => {
      await db.assessmentHistory.bulkAdd([
        createHistoryEntry({
          id: 'h1',
          capabilityAreaId: 'area-1',
          snapshotDate: new Date('2025-01-01'),
          overallScore: 2.0,
        }),
        createHistoryEntry({
          id: 'h2',
          capabilityAreaId: 'area-1',
          snapshotDate: new Date('2025-01-15'),
          overallScore: 3.5,
        }),
        createHistoryEntry({
          id: 'h3',
          capabilityAreaId: 'area-1',
          snapshotDate: new Date('2025-01-10'),
          overallScore: 2.8,
        }),
      ]);

      const { result } = renderHook(() => useHistory());

      await waitFor(() => {
        expect(result.current.history).toHaveLength(3);
      });

      const trend = result.current.getScoreTrend('area-1');
      expect(trend).toHaveLength(3);
      // Should be oldest first for trend display
      expect(trend[0]!.score).toBe(2.0);
      expect(trend[1]!.score).toBe(2.8);
      expect(trend[2]!.score).toBe(3.5);
    });

    it('should return empty array for area with no history', async () => {
      const { result } = renderHook(() => useHistory());

      await waitFor(() => {
        expect(result.current.history).toBeDefined();
      });

      expect(result.current.getScoreTrend('no-history')).toEqual([]);
    });
  });

  describe('compareHistory', () => {
    it('should compare two history entries', async () => {
      await db.assessmentHistory.bulkAdd([
        createHistoryEntry({
          id: 'h1',
          overallScore: 2.5,
          dimensionScores: { outcomes: 2.0, roles: 3.0 },
        }),
        createHistoryEntry({
          id: 'h2',
          overallScore: 3.5,
          dimensionScores: { outcomes: 3.0, roles: 4.0 },
        }),
      ]);

      const { result } = renderHook(() => useHistory());

      await waitFor(() => {
        expect(result.current.history).toHaveLength(2);
      });

      const comparison = result.current.compareHistory('h1', 'h2');
      expect(comparison).toBeDefined();
      expect(comparison?.scoreDiff).toBe(1.0); // 3.5 - 2.5
      expect(comparison?.dimensionDiffs.outcomes).toBe(1.0); // 3.0 - 2.0
      expect(comparison?.dimensionDiffs.roles).toBe(1.0); // 4.0 - 3.0
    });

    it('should return undefined if either entry does not exist', async () => {
      await db.assessmentHistory.add(createHistoryEntry({ id: 'h1' }));

      const { result } = renderHook(() => useHistory());

      await waitFor(() => {
        expect(result.current.history).toHaveLength(1);
      });

      expect(result.current.compareHistory('h1', 'non-existent')).toBeUndefined();
      expect(result.current.compareHistory('non-existent', 'h1')).toBeUndefined();
    });

    it('should handle dimensions present in only one entry', async () => {
      await db.assessmentHistory.bulkAdd([
        createHistoryEntry({
          id: 'h1',
          overallScore: 2.0,
          dimensionScores: { outcomes: 2.0 },
        }),
        createHistoryEntry({
          id: 'h2',
          overallScore: 3.0,
          dimensionScores: { outcomes: 3.0, roles: 4.0 },
        }),
      ]);

      const { result } = renderHook(() => useHistory());

      await waitFor(() => {
        expect(result.current.history).toHaveLength(2);
      });

      const comparison = result.current.compareHistory('h1', 'h2');
      expect(comparison?.dimensionDiffs.outcomes).toBe(1.0);
      expect(comparison?.dimensionDiffs.roles).toBe(4.0); // 4.0 - 0
    });
  });
});
