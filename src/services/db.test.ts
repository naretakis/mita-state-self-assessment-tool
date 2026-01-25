/**
 * Database Service Tests
 *
 * Tests for Dexie database operations including CRUD and utility functions.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { db, clearDatabase, getDatabaseStats } from './db';

describe('db', () => {
  // Clear database before each test for isolation
  beforeEach(async () => {
    await clearDatabase();
  });

  afterEach(async () => {
    await clearDatabase();
  });

  describe('database tables', () => {
    it('should have all required tables', () => {
      expect(db.capabilityAssessments).toBeDefined();
      expect(db.orbitRatings).toBeDefined();
      expect(db.attachments).toBeDefined();
      expect(db.assessmentHistory).toBeDefined();
      expect(db.tags).toBeDefined();
    });
  });

  describe('clearDatabase', () => {
    it('should clear all tables', async () => {
      // Add test data to each table
      await db.capabilityAssessments.add({
        id: 'test-assessment-1',
        capabilityDomainId: 'domain-1',
        capabilityDomainName: 'Test Domain',
        capabilityAreaId: 'area-1',
        capabilityAreaName: 'Test Area',
        status: 'in_progress',
        tags: ['test'],
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await db.orbitRatings.add({
        id: 'test-rating-1',
        capabilityAssessmentId: 'test-assessment-1',
        dimensionId: 'outcomes',
        aspectId: 'aspect-1',
        currentLevel: 3,
        questionResponses: [],
        evidenceResponses: [],
        notes: '',
        barriers: '',
        plans: '',
        carriedForward: false,
        attachmentIds: [],
        updatedAt: new Date(),
      });

      await db.tags.add({
        id: 'test-tag-1',
        name: 'test-tag',
        usageCount: 1,
        lastUsed: new Date(),
      });

      // Verify data was added
      expect(await db.capabilityAssessments.count()).toBe(1);
      expect(await db.orbitRatings.count()).toBe(1);
      expect(await db.tags.count()).toBe(1);

      // Clear database
      await clearDatabase();

      // Verify all tables are empty
      expect(await db.capabilityAssessments.count()).toBe(0);
      expect(await db.orbitRatings.count()).toBe(0);
      expect(await db.attachments.count()).toBe(0);
      expect(await db.assessmentHistory.count()).toBe(0);
      expect(await db.tags.count()).toBe(0);
    });
  });

  describe('getDatabaseStats', () => {
    it('should return zero counts for empty database', async () => {
      const stats = await getDatabaseStats();

      expect(stats.assessments).toBe(0);
      expect(stats.ratings).toBe(0);
      expect(stats.attachments).toBe(0);
      expect(stats.history).toBe(0);
      expect(stats.tags).toBe(0);
      expect(stats.totalSize).toBe(0);
    });

    it('should return correct counts after adding data', async () => {
      // Add test data
      await db.capabilityAssessments.add({
        id: 'assessment-1',
        capabilityDomainId: 'domain-1',
        capabilityDomainName: 'Domain 1',
        capabilityAreaId: 'area-1',
        capabilityAreaName: 'Area 1',
        status: 'in_progress',
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await db.capabilityAssessments.add({
        id: 'assessment-2',
        capabilityDomainId: 'domain-1',
        capabilityDomainName: 'Domain 1',
        capabilityAreaId: 'area-2',
        capabilityAreaName: 'Area 2',
        status: 'finalized',
        tags: ['tag1'],
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await db.orbitRatings.add({
        id: 'rating-1',
        capabilityAssessmentId: 'assessment-1',
        dimensionId: 'outcomes',
        aspectId: 'aspect-1',
        currentLevel: 2,
        questionResponses: [],
        evidenceResponses: [],
        notes: '',
        barriers: '',
        plans: '',
        carriedForward: false,
        attachmentIds: [],
        updatedAt: new Date(),
      });

      await db.tags.add({
        id: 'tag-1',
        name: 'tag1',
        usageCount: 1,
        lastUsed: new Date(),
      });

      const stats = await getDatabaseStats();

      expect(stats.assessments).toBe(2);
      expect(stats.ratings).toBe(1);
      expect(stats.attachments).toBe(0);
      expect(stats.history).toBe(0);
      expect(stats.tags).toBe(1);
    });

    it('should calculate total size from attachments', async () => {
      // Add attachment with known size
      const testBlob = new Blob(['test content'], { type: 'text/plain' });

      await db.attachments.add({
        id: 'attachment-1',
        capabilityAssessmentId: 'assessment-1',
        orbitRatingId: 'rating-1',
        fileName: 'test.txt',
        fileType: 'text/plain',
        fileSize: 1000,
        blob: testBlob,
        uploadedAt: new Date(),
      });

      await db.attachments.add({
        id: 'attachment-2',
        capabilityAssessmentId: 'assessment-1',
        orbitRatingId: 'rating-2',
        fileName: 'test2.txt',
        fileType: 'text/plain',
        fileSize: 2500,
        blob: testBlob,
        uploadedAt: new Date(),
      });

      const stats = await getDatabaseStats();

      expect(stats.attachments).toBe(2);
      expect(stats.totalSize).toBe(3500);
    });
  });

  describe('capabilityAssessments table', () => {
    it('should support CRUD operations', async () => {
      const assessment = {
        id: 'crud-test',
        capabilityDomainId: 'domain-1',
        capabilityDomainName: 'Test Domain',
        capabilityAreaId: 'area-1',
        capabilityAreaName: 'Test Area',
        status: 'in_progress' as const,
        tags: ['tag1', 'tag2'],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Create
      await db.capabilityAssessments.add(assessment);
      const created = await db.capabilityAssessments.get('crud-test');
      expect(created).toBeDefined();
      expect(created?.capabilityAreaName).toBe('Test Area');

      // Update
      await db.capabilityAssessments.update('crud-test', { status: 'finalized' });
      const updated = await db.capabilityAssessments.get('crud-test');
      expect(updated?.status).toBe('finalized');

      // Delete
      await db.capabilityAssessments.delete('crud-test');
      const deleted = await db.capabilityAssessments.get('crud-test');
      expect(deleted).toBeUndefined();
    });

    it('should support querying by capabilityAreaId', async () => {
      await db.capabilityAssessments.add({
        id: 'assessment-1',
        capabilityDomainId: 'domain-1',
        capabilityDomainName: 'Domain',
        capabilityAreaId: 'area-1',
        capabilityAreaName: 'Area 1',
        status: 'in_progress',
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await db.capabilityAssessments
        .where('capabilityAreaId')
        .equals('area-1')
        .first();

      expect(result).toBeDefined();
      expect(result?.id).toBe('assessment-1');
    });

    it('should support querying by status', async () => {
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

      const finalized = await db.capabilityAssessments
        .where('status')
        .equals('finalized')
        .toArray();

      expect(finalized).toHaveLength(2);
    });
  });

  describe('orbitRatings table', () => {
    it('should support compound index queries', async () => {
      await db.orbitRatings.add({
        id: 'rating-1',
        capabilityAssessmentId: 'assessment-1',
        dimensionId: 'outcomes',
        aspectId: 'value-delivery',
        currentLevel: 3,
        questionResponses: [],
        evidenceResponses: [],
        notes: 'Test notes',
        barriers: '',
        plans: '',
        carriedForward: false,
        attachmentIds: [],
        updatedAt: new Date(),
      });

      // Query using compound index
      const result = await db.orbitRatings
        .where('[capabilityAssessmentId+dimensionId+aspectId]')
        .equals(['assessment-1', 'outcomes', 'value-delivery'])
        .first();

      expect(result).toBeDefined();
      expect(result?.currentLevel).toBe(3);
    });

    it('should support Technology sub-dimension compound index', async () => {
      await db.orbitRatings.add({
        id: 'tech-rating-1',
        capabilityAssessmentId: 'assessment-1',
        dimensionId: 'technology',
        subDimensionId: 'infrastructure',
        aspectId: 'cloud-adoption',
        currentLevel: 4,
        questionResponses: [],
        evidenceResponses: [],
        notes: '',
        barriers: '',
        plans: '',
        carriedForward: false,
        attachmentIds: [],
        updatedAt: new Date(),
      });

      const result = await db.orbitRatings
        .where('[capabilityAssessmentId+dimensionId+subDimensionId+aspectId]')
        .equals(['assessment-1', 'technology', 'infrastructure', 'cloud-adoption'])
        .first();

      expect(result).toBeDefined();
      expect(result?.currentLevel).toBe(4);
    });
  });

  describe('assessmentHistory table', () => {
    it('should store historical snapshots', async () => {
      const historyEntry = {
        id: 'history-1',
        capabilityAssessmentId: 'assessment-1',
        capabilityAreaId: 'area-1',
        snapshotDate: new Date('2025-01-15'),
        tags: ['phase1'],
        overallScore: 3.5,
        dimensionScores: {
          outcomes: 3.0,
          roles: 4.0,
          businessArchitecture: 3.5,
        },
        ratings: [
          {
            dimensionId: 'outcomes' as const,
            aspectId: 'value-delivery',
            currentLevel: 3 as const,
            questionResponses: [],
            evidenceResponses: [],
            notes: '',
            barriers: '',
            plans: '',
          },
        ],
      };

      await db.assessmentHistory.add(historyEntry);

      const retrieved = await db.assessmentHistory.get('history-1');
      expect(retrieved).toBeDefined();
      expect(retrieved?.overallScore).toBe(3.5);
      expect(retrieved?.dimensionScores.outcomes).toBe(3.0);
    });

    it('should support querying by capabilityAreaId', async () => {
      await db.assessmentHistory.bulkAdd([
        {
          id: 'h1',
          capabilityAssessmentId: 'a1',
          capabilityAreaId: 'area-1',
          snapshotDate: new Date('2025-01-01'),
          tags: [],
          overallScore: 2.0,
          dimensionScores: {},
          ratings: [],
        },
        {
          id: 'h2',
          capabilityAssessmentId: 'a1',
          capabilityAreaId: 'area-1',
          snapshotDate: new Date('2025-01-15'),
          tags: [],
          overallScore: 3.0,
          dimensionScores: {},
          ratings: [],
        },
        {
          id: 'h3',
          capabilityAssessmentId: 'a2',
          capabilityAreaId: 'area-2',
          snapshotDate: new Date('2025-01-10'),
          tags: [],
          overallScore: 2.5,
          dimensionScores: {},
          ratings: [],
        },
      ]);

      const area1History = await db.assessmentHistory
        .where('capabilityAreaId')
        .equals('area-1')
        .toArray();

      expect(area1History).toHaveLength(2);
    });
  });

  describe('tags table', () => {
    it('should track tag usage', async () => {
      await db.tags.add({
        id: 'tag-1',
        name: 'priority',
        usageCount: 5,
        lastUsed: new Date(),
      });

      const tag = await db.tags.where('name').equals('priority').first();
      expect(tag?.usageCount).toBe(5);

      // Update usage
      await db.tags.update('tag-1', { usageCount: 6 });
      const updated = await db.tags.get('tag-1');
      expect(updated?.usageCount).toBe(6);
    });

    it('should support ordering by usageCount', async () => {
      await db.tags.bulkAdd([
        { id: 't1', name: 'rare', usageCount: 1, lastUsed: new Date() },
        { id: 't2', name: 'common', usageCount: 10, lastUsed: new Date() },
        { id: 't3', name: 'medium', usageCount: 5, lastUsed: new Date() },
      ]);

      const sorted = await db.tags.orderBy('usageCount').reverse().toArray();

      expect(sorted[0]!.name).toBe('common');
      expect(sorted[1]!.name).toBe('medium');
      expect(sorted[2]!.name).toBe('rare');
    });
  });

  describe('attachments table', () => {
    it('should store and retrieve blobs', async () => {
      const content = 'Test file content for attachment';
      const blob = new Blob([content], { type: 'text/plain' });

      await db.attachments.add({
        id: 'att-1',
        capabilityAssessmentId: 'assessment-1',
        orbitRatingId: 'rating-1',
        fileName: 'evidence.txt',
        fileType: 'text/plain',
        fileSize: blob.size,
        blob,
        description: 'Supporting evidence',
        uploadedAt: new Date(),
      });

      const retrieved = await db.attachments.get('att-1');
      expect(retrieved).toBeDefined();
      expect(retrieved?.fileName).toBe('evidence.txt');
      expect(retrieved?.description).toBe('Supporting evidence');
      expect(retrieved?.fileSize).toBe(blob.size);
      // Note: fake-indexeddb may not preserve Blob objects perfectly,
      // so we just verify the record was stored with the blob field
      expect(retrieved?.blob).toBeDefined();
    });

    it('should support querying by orbitRatingId', async () => {
      const blob = new Blob(['test'], { type: 'text/plain' });

      await db.attachments.bulkAdd([
        {
          id: 'a1',
          capabilityAssessmentId: 'assessment-1',
          orbitRatingId: 'rating-1',
          fileName: 'file1.txt',
          fileType: 'text/plain',
          fileSize: 100,
          blob,
          uploadedAt: new Date(),
        },
        {
          id: 'a2',
          capabilityAssessmentId: 'assessment-1',
          orbitRatingId: 'rating-1',
          fileName: 'file2.txt',
          fileType: 'text/plain',
          fileSize: 200,
          blob,
          uploadedAt: new Date(),
        },
        {
          id: 'a3',
          capabilityAssessmentId: 'assessment-1',
          orbitRatingId: 'rating-2',
          fileName: 'file3.txt',
          fileType: 'text/plain',
          fileSize: 150,
          blob,
          uploadedAt: new Date(),
        },
      ]);

      const rating1Attachments = await db.attachments
        .where('orbitRatingId')
        .equals('rating-1')
        .toArray();

      expect(rating1Attachments).toHaveLength(2);
    });
  });
});
