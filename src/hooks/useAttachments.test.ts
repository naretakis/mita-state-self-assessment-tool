/**
 * useAttachments Hook Tests
 *
 * Tests for file attachment management.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useAttachments } from './useAttachments';
import { db, clearDatabase } from '../services/db';

describe('useAttachments', () => {
  const assessmentId = 'test-assessment';
  const ratingId = 'test-rating';

  beforeEach(async () => {
    await clearDatabase();

    // Create test assessment and rating
    await db.capabilityAssessments.add({
      id: assessmentId,
      capabilityDomainId: 'd1',
      capabilityDomainName: 'Domain',
      capabilityAreaId: 'area-1',
      capabilityAreaName: 'Area 1',
      status: 'in_progress',
      tags: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await db.orbitRatings.add({
      id: ratingId,
      capabilityAssessmentId: assessmentId,
      dimensionId: 'outcomes',
      aspectId: 'value-delivery',
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
  });

  afterEach(async () => {
    await clearDatabase();
  });

  describe('initial state', () => {
    it('should return empty attachments array initially', async () => {
      const { result } = renderHook(() => useAttachments(assessmentId));

      await waitFor(() => {
        expect(result.current.attachments).toEqual([]);
      });
    });

    it('should return empty array for undefined assessmentId', async () => {
      const { result } = renderHook(() => useAttachments(undefined));

      await waitFor(() => {
        expect(result.current.attachments).toEqual([]);
      });
    });

    it('should load existing attachments from database', async () => {
      const blob = new Blob(['test content'], { type: 'text/plain' });

      await db.attachments.add({
        id: 'att1',
        capabilityAssessmentId: assessmentId,
        orbitRatingId: ratingId,
        fileName: 'test.txt',
        fileType: 'text/plain',
        fileSize: 100,
        blob,
        uploadedAt: new Date(),
      });

      const { result } = renderHook(() => useAttachments(assessmentId));

      await waitFor(() => {
        expect(result.current.attachments).toHaveLength(1);
      });

      expect(result.current.attachments[0]!.fileName).toBe('test.txt');
    });
  });

  describe('uploadAttachment', () => {
    it('should upload a new attachment', async () => {
      const { result } = renderHook(() => useAttachments(assessmentId));

      await waitFor(() => {
        expect(result.current.attachments).toBeDefined();
      });

      // Create a mock file with arrayBuffer method (jsdom doesn't support File.arrayBuffer)
      const content = new Uint8Array([116, 101, 115, 116]); // "test"
      const file = {
        name: 'evidence.pdf',
        type: 'application/pdf',
        size: content.length,
        arrayBuffer: async () => content.buffer,
      } as unknown as File;

      let attachmentId: string;
      await act(async () => {
        attachmentId = await result.current.uploadAttachment(ratingId, file, 'Test description');
      });

      expect(attachmentId!).toBeDefined();

      // Verify in database
      const attachment = await db.attachments.get(attachmentId!);
      expect(attachment).toBeDefined();
      expect(attachment?.fileName).toBe('evidence.pdf');
      expect(attachment?.fileType).toBe('application/pdf');
      expect(attachment?.description).toBe('Test description');
    });

    it('should update rating attachmentIds array', async () => {
      const { result } = renderHook(() => useAttachments(assessmentId));

      await waitFor(() => {
        expect(result.current.attachments).toBeDefined();
      });

      const content = new Uint8Array([116, 101, 115, 116]);
      const file = {
        name: 'test.txt',
        type: 'text/plain',
        size: content.length,
        arrayBuffer: async () => content.buffer,
      } as unknown as File;

      let attachmentId: string;
      await act(async () => {
        attachmentId = await result.current.uploadAttachment(ratingId, file);
      });

      const rating = await db.orbitRatings.get(ratingId);
      expect(rating?.attachmentIds).toContain(attachmentId!);
    });

    it('should update assessment timestamp', async () => {
      const originalAssessment = await db.capabilityAssessments.get(assessmentId);
      const originalUpdatedAt = originalAssessment?.updatedAt;

      const { result } = renderHook(() => useAttachments(assessmentId));

      await waitFor(() => {
        expect(result.current.attachments).toBeDefined();
      });

      // Wait a bit to ensure timestamp difference
      await new Promise((resolve) => setTimeout(resolve, 10));

      const content = new Uint8Array([116, 101, 115, 116]);
      const file = {
        name: 'test.txt',
        type: 'text/plain',
        size: content.length,
        arrayBuffer: async () => content.buffer,
      } as unknown as File;

      await act(async () => {
        await result.current.uploadAttachment(ratingId, file);
      });

      const updatedAssessment = await db.capabilityAssessments.get(assessmentId);
      expect(updatedAssessment?.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt!.getTime());
    });

    it('should throw error if assessmentId is undefined', async () => {
      const { result } = renderHook(() => useAttachments(undefined));

      await waitFor(() => {
        expect(result.current.attachments).toBeDefined();
      });

      const file = new File(['test'], 'test.txt', { type: 'text/plain' });

      await expect(
        act(async () => {
          await result.current.uploadAttachment(ratingId, file);
        })
      ).rejects.toThrow('No assessment ID provided');
    });
  });

  describe('deleteAttachment', () => {
    it('should delete an attachment', async () => {
      const blob = new Blob(['test'], { type: 'text/plain' });

      await db.attachments.add({
        id: 'to-delete',
        capabilityAssessmentId: assessmentId,
        orbitRatingId: ratingId,
        fileName: 'delete-me.txt',
        fileType: 'text/plain',
        fileSize: 100,
        blob,
        uploadedAt: new Date(),
      });

      // Update rating to include attachment
      await db.orbitRatings.update(ratingId, { attachmentIds: ['to-delete'] });

      const { result } = renderHook(() => useAttachments(assessmentId));

      await waitFor(() => {
        expect(result.current.attachments).toHaveLength(1);
      });

      await act(async () => {
        await result.current.deleteAttachment('to-delete');
      });

      // Verify deleted from database
      const deleted = await db.attachments.get('to-delete');
      expect(deleted).toBeUndefined();

      // Verify removed from rating's attachmentIds
      const rating = await db.orbitRatings.get(ratingId);
      expect(rating?.attachmentIds).not.toContain('to-delete');
    });

    it('should handle deleting non-existent attachment gracefully', async () => {
      const { result } = renderHook(() => useAttachments(assessmentId));

      await waitFor(() => {
        expect(result.current.attachments).toBeDefined();
      });

      // Should not throw
      await act(async () => {
        await result.current.deleteAttachment('non-existent');
      });
    });
  });

  describe('downloadAttachment', () => {
    it('should trigger browser download', async () => {
      const blob = new Blob(['test content'], { type: 'text/plain' });

      await db.attachments.add({
        id: 'download-me',
        capabilityAssessmentId: assessmentId,
        orbitRatingId: ratingId,
        fileName: 'download.txt',
        fileType: 'text/plain',
        fileSize: 100,
        blob,
        uploadedAt: new Date(),
      });

      const { result } = renderHook(() => useAttachments(assessmentId));

      await waitFor(() => {
        expect(result.current.attachments).toHaveLength(1);
      });

      // Mock URL methods (jsdom doesn't have createObjectURL)
      const mockUrl = 'blob:test-url';
      const originalCreateObjectURL = URL.createObjectURL;
      const originalRevokeObjectURL = URL.revokeObjectURL;
      URL.createObjectURL = vi.fn().mockReturnValue(mockUrl);
      URL.revokeObjectURL = vi.fn();

      const mockLink = {
        href: '',
        download: '',
        click: vi.fn(),
      };
      const createElementSpy = vi
        .spyOn(document, 'createElement')
        .mockReturnValue(mockLink as unknown as HTMLAnchorElement);
      const appendChildSpy = vi
        .spyOn(document.body, 'appendChild')
        .mockImplementation(() => mockLink as unknown as HTMLAnchorElement);
      const removeChildSpy = vi
        .spyOn(document.body, 'removeChild')
        .mockImplementation(() => mockLink as unknown as HTMLAnchorElement);

      const attachment = result.current.attachments[0]!;
      result.current.downloadAttachment(attachment);

      expect(URL.createObjectURL).toHaveBeenCalledWith(attachment.blob);
      expect(mockLink.href).toBe(mockUrl);
      expect(mockLink.download).toBe('download.txt');
      expect(mockLink.click).toHaveBeenCalled();
      expect(URL.revokeObjectURL).toHaveBeenCalledWith(mockUrl);

      // Cleanup
      URL.createObjectURL = originalCreateObjectURL;
      URL.revokeObjectURL = originalRevokeObjectURL;
      createElementSpy.mockRestore();
      appendChildSpy.mockRestore();
      removeChildSpy.mockRestore();
    });
  });

  describe('getAttachmentsForRating', () => {
    it('should return attachments for specific rating', async () => {
      const blob = new Blob(['test'], { type: 'text/plain' });

      // Create another rating
      await db.orbitRatings.add({
        id: 'other-rating',
        capabilityAssessmentId: assessmentId,
        dimensionId: 'roles',
        aspectId: 'other-aspect',
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

      await db.attachments.bulkAdd([
        {
          id: 'att1',
          capabilityAssessmentId: assessmentId,
          orbitRatingId: ratingId,
          fileName: 'file1.txt',
          fileType: 'text/plain',
          fileSize: 100,
          blob,
          uploadedAt: new Date(),
        },
        {
          id: 'att2',
          capabilityAssessmentId: assessmentId,
          orbitRatingId: ratingId,
          fileName: 'file2.txt',
          fileType: 'text/plain',
          fileSize: 200,
          blob,
          uploadedAt: new Date(),
        },
        {
          id: 'att3',
          capabilityAssessmentId: assessmentId,
          orbitRatingId: 'other-rating',
          fileName: 'file3.txt',
          fileType: 'text/plain',
          fileSize: 150,
          blob,
          uploadedAt: new Date(),
        },
      ]);

      const { result } = renderHook(() => useAttachments(assessmentId));

      await waitFor(() => {
        expect(result.current.attachments).toHaveLength(3);
      });

      const ratingAttachments = result.current.getAttachmentsForRating(ratingId);
      expect(ratingAttachments).toHaveLength(2);
      expect(ratingAttachments.map((a) => a.fileName)).toContain('file1.txt');
      expect(ratingAttachments.map((a) => a.fileName)).toContain('file2.txt');
    });

    it('should return empty array for rating with no attachments', async () => {
      const { result } = renderHook(() => useAttachments(assessmentId));

      await waitFor(() => {
        expect(result.current.attachments).toBeDefined();
      });

      expect(result.current.getAttachmentsForRating('no-attachments')).toEqual([]);
    });
  });

  describe('getTotalSize', () => {
    it('should return total size of all attachments', async () => {
      const blob = new Blob(['test'], { type: 'text/plain' });

      await db.attachments.bulkAdd([
        {
          id: 'att1',
          capabilityAssessmentId: assessmentId,
          orbitRatingId: ratingId,
          fileName: 'file1.txt',
          fileType: 'text/plain',
          fileSize: 1000,
          blob,
          uploadedAt: new Date(),
        },
        {
          id: 'att2',
          capabilityAssessmentId: assessmentId,
          orbitRatingId: ratingId,
          fileName: 'file2.txt',
          fileType: 'text/plain',
          fileSize: 2500,
          blob,
          uploadedAt: new Date(),
        },
        {
          id: 'att3',
          capabilityAssessmentId: assessmentId,
          orbitRatingId: ratingId,
          fileName: 'file3.txt',
          fileType: 'text/plain',
          fileSize: 500,
          blob,
          uploadedAt: new Date(),
        },
      ]);

      const { result } = renderHook(() => useAttachments(assessmentId));

      await waitFor(() => {
        expect(result.current.attachments).toHaveLength(3);
      });

      expect(result.current.getTotalSize()).toBe(4000);
    });

    it('should return 0 when no attachments exist', async () => {
      const { result } = renderHook(() => useAttachments(assessmentId));

      await waitFor(() => {
        expect(result.current.attachments).toBeDefined();
      });

      expect(result.current.getTotalSize()).toBe(0);
    });
  });

  describe('attachmentsByRating', () => {
    it('should group attachments by rating ID', async () => {
      const blob = new Blob(['test'], { type: 'text/plain' });

      await db.orbitRatings.add({
        id: 'rating-2',
        capabilityAssessmentId: assessmentId,
        dimensionId: 'roles',
        aspectId: 'other',
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

      await db.attachments.bulkAdd([
        {
          id: 'att1',
          capabilityAssessmentId: assessmentId,
          orbitRatingId: ratingId,
          fileName: 'file1.txt',
          fileType: 'text/plain',
          fileSize: 100,
          blob,
          uploadedAt: new Date(),
        },
        {
          id: 'att2',
          capabilityAssessmentId: assessmentId,
          orbitRatingId: ratingId,
          fileName: 'file2.txt',
          fileType: 'text/plain',
          fileSize: 200,
          blob,
          uploadedAt: new Date(),
        },
        {
          id: 'att3',
          capabilityAssessmentId: assessmentId,
          orbitRatingId: 'rating-2',
          fileName: 'file3.txt',
          fileType: 'text/plain',
          fileSize: 150,
          blob,
          uploadedAt: new Date(),
        },
      ]);

      const { result } = renderHook(() => useAttachments(assessmentId));

      await waitFor(() => {
        expect(result.current.attachments).toHaveLength(3);
      });

      expect(result.current.attachmentsByRating.get(ratingId)).toHaveLength(2);
      expect(result.current.attachmentsByRating.get('rating-2')).toHaveLength(1);
    });
  });
});
