/**
 * Hook for managing tags
 *
 * Provides tag autocomplete suggestions and usage tracking.
 */

import { useLiveQuery } from 'dexie-react-hooks';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../services/db';
import type { Tag } from '../types';

/**
 * Return type for useTags hook
 */
export interface UseTagsReturn {
  tags: Tag[];
  getSuggestions: (query: string, limit?: number) => Tag[];
  getRecentTags: (limit?: number) => Tag[];
  getPopularTags: (limit?: number) => Tag[];
  createTag: (name: string) => Promise<Tag>;
  incrementUsage: (name: string) => Promise<void>;
  deleteTag: (tagId: string) => Promise<void>;
  renameTag: (oldName: string, newName: string) => Promise<void>;
  getAllTagNames: () => string[];
  tagExists: (name: string) => boolean;
  getTagByName: (name: string) => Tag | undefined;
  cleanupUnusedTags: () => Promise<number>;
}

/**
 * Hook for managing tags
 */
export function useTags(): UseTagsReturn {
  // Get all tags, ordered by usage count (most used first)
  const tags = useLiveQuery(() => db.tags.orderBy('usageCount').reverse().toArray(), []);

  /**
   * Get tag suggestions for autocomplete
   * @param query - Partial tag name to match
   * @param limit - Maximum number of suggestions
   */
  const getSuggestions = (query: string, limit = 10): Tag[] => {
    if (!tags) return [];

    const lowerQuery = query.toLowerCase();
    return tags.filter((t) => t.name.toLowerCase().includes(lowerQuery)).slice(0, limit);
  };

  /**
   * Get most recently used tags
   * @param limit - Maximum number of tags
   */
  const getRecentTags = (limit = 10): Tag[] => {
    if (!tags) return [];

    return [...tags].sort((a, b) => b.lastUsed.getTime() - a.lastUsed.getTime()).slice(0, limit);
  };

  /**
   * Get most frequently used tags
   * @param limit - Maximum number of tags
   */
  const getPopularTags = (limit = 10): Tag[] => {
    if (!tags) return [];
    return tags.slice(0, limit);
  };

  /**
   * Create a new tag (if it doesn't exist)
   * @param name - Tag name
   */
  const createTag = async (name: string): Promise<Tag> => {
    const existing = await db.tags.where('name').equals(name).first();
    if (existing) {
      return existing;
    }

    const now = new Date();
    const tag: Tag = {
      id: uuidv4(),
      name,
      usageCount: 0,
      lastUsed: now,
    };

    await db.tags.add(tag);
    return tag;
  };

  /**
   * Increment usage count for a tag
   * @param name - Tag name
   */
  const incrementUsage = async (name: string): Promise<void> => {
    const existing = await db.tags.where('name').equals(name).first();
    const now = new Date();

    if (existing) {
      await db.tags.update(existing.id, {
        usageCount: existing.usageCount + 1,
        lastUsed: now,
      });
    } else {
      await db.tags.add({
        id: uuidv4(),
        name,
        usageCount: 1,
        lastUsed: now,
      });
    }
  };

  /**
   * Delete a tag
   * Note: This doesn't remove the tag from assessments
   * @param tagId - Tag ID to delete
   */
  const deleteTag = async (tagId: string): Promise<void> => {
    await db.tags.delete(tagId);
  };

  /**
   * Rename a tag across all assessments
   * @param oldName - Current tag name
   * @param newName - New tag name
   */
  const renameTag = async (oldName: string, newName: string): Promise<void> => {
    await db.transaction('rw', [db.tags, db.capabilityAssessments], async () => {
      // Update tag record
      const tag = await db.tags.where('name').equals(oldName).first();
      if (tag) {
        await db.tags.update(tag.id, { name: newName });
      }

      // Update all assessments with this tag
      const assessments = await db.capabilityAssessments
        .filter((a) => a.tags.includes(oldName))
        .toArray();

      for (const assessment of assessments) {
        const newTags = assessment.tags.map((t) => (t === oldName ? newName : t));
        await db.capabilityAssessments.update(assessment.id, { tags: newTags });
      }
    });
  };

  /**
   * Get all tag names as a simple array
   */
  const getAllTagNames = (): string[] => {
    return tags?.map((t) => t.name) ?? [];
  };

  /**
   * Check if a tag exists
   * @param name - Tag name to check
   */
  const tagExists = (name: string): boolean => {
    return tags?.some((t) => t.name === name) ?? false;
  };

  /**
   * Get tag by name
   * @param name - Tag name
   */
  const getTagByName = (name: string): Tag | undefined => {
    return tags?.find((t) => t.name === name);
  };

  /**
   * Clean up unused tags (usageCount = 0)
   */
  const cleanupUnusedTags = async (): Promise<number> => {
    const unused = await db.tags.where('usageCount').equals(0).toArray();
    await db.tags.bulkDelete(unused.map((t) => t.id));
    return unused.length;
  };

  return {
    tags: tags ?? [],
    getSuggestions,
    getRecentTags,
    getPopularTags,
    createTag,
    incrementUsage,
    deleteTag,
    renameTag,
    getAllTagNames,
    tagExists,
    getTagByName,
    cleanupUnusedTags,
  };
}
