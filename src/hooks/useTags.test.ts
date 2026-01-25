/**
 * useTags Hook Tests
 *
 * Tests for tag management functionality.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useTags } from './useTags';
import { db, clearDatabase } from '../services/db';

describe('useTags', () => {
  beforeEach(async () => {
    await clearDatabase();
  });

  afterEach(async () => {
    await clearDatabase();
  });

  describe('initial state', () => {
    it('should return empty tags array initially', async () => {
      const { result } = renderHook(() => useTags());

      await waitFor(() => {
        expect(result.current.tags).toEqual([]);
      });
    });

    it('should load existing tags from database', async () => {
      // Pre-populate database
      await db.tags.bulkAdd([
        { id: 't1', name: 'phase1', usageCount: 5, lastUsed: new Date() },
        { id: 't2', name: 'priority', usageCount: 3, lastUsed: new Date() },
      ]);

      const { result } = renderHook(() => useTags());

      await waitFor(() => {
        expect(result.current.tags).toHaveLength(2);
      });
    });
  });

  describe('createTag', () => {
    it('should create a new tag', async () => {
      const { result } = renderHook(() => useTags());

      await waitFor(() => {
        expect(result.current.tags).toBeDefined();
      });

      let newTag: Awaited<ReturnType<typeof result.current.createTag>> | undefined;
      await act(async () => {
        newTag = await result.current.createTag('new-tag');
      });

      expect(newTag).toBeDefined();
      expect(newTag?.name).toBe('new-tag');
      expect(newTag?.usageCount).toBe(0);

      // Verify in database
      const dbTag = await db.tags.where('name').equals('new-tag').first();
      expect(dbTag).toBeDefined();
    });

    it('should return existing tag if name already exists', async () => {
      await db.tags.add({
        id: 'existing',
        name: 'existing-tag',
        usageCount: 10,
        lastUsed: new Date(),
      });

      const { result } = renderHook(() => useTags());

      await waitFor(() => {
        expect(result.current.tags).toHaveLength(1);
      });

      let tag: Awaited<ReturnType<typeof result.current.createTag>> | undefined;
      await act(async () => {
        tag = await result.current.createTag('existing-tag');
      });

      expect(tag?.id).toBe('existing');
      expect(tag?.usageCount).toBe(10);

      // Should not create duplicate
      const allTags = await db.tags.toArray();
      expect(allTags).toHaveLength(1);
    });
  });

  describe('incrementUsage', () => {
    it('should increment usage count for existing tag', async () => {
      await db.tags.add({
        id: 't1',
        name: 'test-tag',
        usageCount: 5,
        lastUsed: new Date('2025-01-01'),
      });

      const { result } = renderHook(() => useTags());

      await waitFor(() => {
        expect(result.current.tags).toHaveLength(1);
      });

      await act(async () => {
        await result.current.incrementUsage('test-tag');
      });

      const updated = await db.tags.get('t1');
      expect(updated?.usageCount).toBe(6);
      expect(updated?.lastUsed.getTime()).toBeGreaterThan(new Date('2025-01-01').getTime());
    });

    it('should create tag if it does not exist', async () => {
      const { result } = renderHook(() => useTags());

      await waitFor(() => {
        expect(result.current.tags).toBeDefined();
      });

      await act(async () => {
        await result.current.incrementUsage('brand-new-tag');
      });

      const tag = await db.tags.where('name').equals('brand-new-tag').first();
      expect(tag).toBeDefined();
      expect(tag?.usageCount).toBe(1);
    });
  });

  describe('deleteTag', () => {
    it('should delete a tag by ID', async () => {
      await db.tags.add({
        id: 'to-delete',
        name: 'delete-me',
        usageCount: 1,
        lastUsed: new Date(),
      });

      const { result } = renderHook(() => useTags());

      await waitFor(() => {
        expect(result.current.tags).toHaveLength(1);
      });

      await act(async () => {
        await result.current.deleteTag('to-delete');
      });

      const deleted = await db.tags.get('to-delete');
      expect(deleted).toBeUndefined();
    });
  });

  describe('renameTag', () => {
    it('should rename a tag and update assessments', async () => {
      await db.tags.add({
        id: 't1',
        name: 'old-name',
        usageCount: 2,
        lastUsed: new Date(),
      });

      await db.capabilityAssessments.add({
        id: 'a1',
        capabilityDomainId: 'd1',
        capabilityDomainName: 'Domain',
        capabilityAreaId: 'area-1',
        capabilityAreaName: 'Area',
        status: 'in_progress',
        tags: ['old-name', 'other-tag'],
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const { result } = renderHook(() => useTags());

      await waitFor(() => {
        expect(result.current.tags).toHaveLength(1);
      });

      await act(async () => {
        await result.current.renameTag('old-name', 'new-name');
      });

      // Check tag was renamed
      const renamedTag = await db.tags.get('t1');
      expect(renamedTag?.name).toBe('new-name');

      // Check assessment tags were updated
      const assessment = await db.capabilityAssessments.get('a1');
      expect(assessment?.tags).toContain('new-name');
      expect(assessment?.tags).not.toContain('old-name');
      expect(assessment?.tags).toContain('other-tag');
    });
  });

  describe('getSuggestions', () => {
    it('should return matching tags for query', async () => {
      await db.tags.bulkAdd([
        { id: 't1', name: 'phase1', usageCount: 5, lastUsed: new Date() },
        { id: 't2', name: 'phase2', usageCount: 3, lastUsed: new Date() },
        { id: 't3', name: 'priority', usageCount: 10, lastUsed: new Date() },
      ]);

      const { result } = renderHook(() => useTags());

      await waitFor(() => {
        expect(result.current.tags).toHaveLength(3);
      });

      const suggestions = result.current.getSuggestions('phase');
      expect(suggestions).toHaveLength(2);
      expect(suggestions.map((s) => s.name)).toContain('phase1');
      expect(suggestions.map((s) => s.name)).toContain('phase2');
    });

    it('should be case-insensitive', async () => {
      await db.tags.add({
        id: 't1',
        name: 'Priority',
        usageCount: 1,
        lastUsed: new Date(),
      });

      const { result } = renderHook(() => useTags());

      await waitFor(() => {
        expect(result.current.tags).toHaveLength(1);
      });

      const suggestions = result.current.getSuggestions('prio');
      expect(suggestions).toHaveLength(1);
      expect(suggestions[0]!.name).toBe('Priority');
    });

    it('should respect limit parameter', async () => {
      await db.tags.bulkAdd([
        { id: 't1', name: 'tag1', usageCount: 1, lastUsed: new Date() },
        { id: 't2', name: 'tag2', usageCount: 2, lastUsed: new Date() },
        { id: 't3', name: 'tag3', usageCount: 3, lastUsed: new Date() },
        { id: 't4', name: 'tag4', usageCount: 4, lastUsed: new Date() },
        { id: 't5', name: 'tag5', usageCount: 5, lastUsed: new Date() },
      ]);

      const { result } = renderHook(() => useTags());

      await waitFor(() => {
        expect(result.current.tags).toHaveLength(5);
      });

      const suggestions = result.current.getSuggestions('tag', 3);
      expect(suggestions).toHaveLength(3);
    });
  });

  describe('getRecentTags', () => {
    it('should return tags sorted by lastUsed descending', async () => {
      await db.tags.bulkAdd([
        { id: 't1', name: 'oldest', usageCount: 1, lastUsed: new Date('2025-01-01') },
        { id: 't2', name: 'newest', usageCount: 1, lastUsed: new Date('2025-01-20') },
        { id: 't3', name: 'middle', usageCount: 1, lastUsed: new Date('2025-01-10') },
      ]);

      const { result } = renderHook(() => useTags());

      await waitFor(() => {
        expect(result.current.tags).toHaveLength(3);
      });

      const recent = result.current.getRecentTags();
      expect(recent[0]!.name).toBe('newest');
      expect(recent[1]!.name).toBe('middle');
      expect(recent[2]!.name).toBe('oldest');
    });
  });

  describe('getPopularTags', () => {
    it('should return tags sorted by usageCount descending', async () => {
      await db.tags.bulkAdd([
        { id: 't1', name: 'rare', usageCount: 1, lastUsed: new Date() },
        { id: 't2', name: 'popular', usageCount: 100, lastUsed: new Date() },
        { id: 't3', name: 'medium', usageCount: 10, lastUsed: new Date() },
      ]);

      const { result } = renderHook(() => useTags());

      await waitFor(() => {
        expect(result.current.tags).toHaveLength(3);
      });

      const popular = result.current.getPopularTags();
      expect(popular[0]!.name).toBe('popular');
      expect(popular[1]!.name).toBe('medium');
      expect(popular[2]!.name).toBe('rare');
    });
  });

  describe('getAllTagNames', () => {
    it('should return array of tag names', async () => {
      await db.tags.bulkAdd([
        { id: 't1', name: 'alpha', usageCount: 1, lastUsed: new Date() },
        { id: 't2', name: 'beta', usageCount: 2, lastUsed: new Date() },
      ]);

      const { result } = renderHook(() => useTags());

      await waitFor(() => {
        expect(result.current.tags).toHaveLength(2);
      });

      const names = result.current.getAllTagNames();
      expect(names).toContain('alpha');
      expect(names).toContain('beta');
    });
  });

  describe('tagExists', () => {
    it('should return true for existing tag', async () => {
      await db.tags.add({
        id: 't1',
        name: 'exists',
        usageCount: 1,
        lastUsed: new Date(),
      });

      const { result } = renderHook(() => useTags());

      await waitFor(() => {
        expect(result.current.tags).toHaveLength(1);
      });

      expect(result.current.tagExists('exists')).toBe(true);
    });

    it('should return false for non-existing tag', async () => {
      const { result } = renderHook(() => useTags());

      await waitFor(() => {
        expect(result.current.tags).toBeDefined();
      });

      expect(result.current.tagExists('does-not-exist')).toBe(false);
    });
  });

  describe('getTagByName', () => {
    it('should return tag object by name', async () => {
      await db.tags.add({
        id: 't1',
        name: 'find-me',
        usageCount: 42,
        lastUsed: new Date(),
      });

      const { result } = renderHook(() => useTags());

      await waitFor(() => {
        expect(result.current.tags).toHaveLength(1);
      });

      const tag = result.current.getTagByName('find-me');
      expect(tag?.id).toBe('t1');
      expect(tag?.usageCount).toBe(42);
    });

    it('should return undefined for non-existing tag', async () => {
      const { result } = renderHook(() => useTags());

      await waitFor(() => {
        expect(result.current.tags).toBeDefined();
      });

      expect(result.current.getTagByName('nope')).toBeUndefined();
    });
  });

  describe('cleanupUnusedTags', () => {
    it('should delete tags with usageCount of 0', async () => {
      await db.tags.bulkAdd([
        { id: 't1', name: 'used', usageCount: 5, lastUsed: new Date() },
        { id: 't2', name: 'unused1', usageCount: 0, lastUsed: new Date() },
        { id: 't3', name: 'unused2', usageCount: 0, lastUsed: new Date() },
      ]);

      const { result } = renderHook(() => useTags());

      await waitFor(() => {
        expect(result.current.tags).toHaveLength(3);
      });

      let deletedCount;
      await act(async () => {
        deletedCount = await result.current.cleanupUnusedTags();
      });

      expect(deletedCount).toBe(2);

      const remaining = await db.tags.toArray();
      expect(remaining).toHaveLength(1);
      expect(remaining[0]!.name).toBe('used');
    });
  });
});
