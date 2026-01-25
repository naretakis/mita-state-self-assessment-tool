/**
 * Hook for managing file attachments
 *
 * Provides CRUD operations for attachments stored in IndexedDB.
 */

import { useLiveQuery } from 'dexie-react-hooks';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../services/db';
import type { Attachment } from '../types';

/**
 * Return type for useAttachments hook
 */
export interface UseAttachmentsReturn {
  attachments: Attachment[];
  attachmentsByRating: Map<string, Attachment[]>;
  uploadAttachment: (orbitRatingId: string, file: File, description?: string) => Promise<string>;
  deleteAttachment: (attachmentId: string) => Promise<void>;
  downloadAttachment: (attachment: Attachment) => void;
  getAttachmentsForRating: (orbitRatingId: string) => Attachment[];
  getTotalSize: () => number;
}

/**
 * Hook for managing attachments within an assessment
 */
export function useAttachments(capabilityAssessmentId: string | undefined): UseAttachmentsReturn {
  // Get all attachments for this assessment
  const attachments = useLiveQuery(
    () =>
      capabilityAssessmentId
        ? db.attachments.where('capabilityAssessmentId').equals(capabilityAssessmentId).toArray()
        : [],
    [capabilityAssessmentId]
  );

  // Group attachments by rating ID
  const attachmentsByRating = new Map<string, Attachment[]>();
  for (const attachment of attachments ?? []) {
    const existing = attachmentsByRating.get(attachment.orbitRatingId) ?? [];
    existing.push(attachment);
    attachmentsByRating.set(attachment.orbitRatingId, existing);
  }

  /**
   * Upload a new attachment
   */
  const uploadAttachment = async (
    orbitRatingId: string,
    file: File,
    description?: string
  ): Promise<string> => {
    if (!capabilityAssessmentId) {
      throw new Error('No assessment ID provided');
    }

    const attachmentId = uuidv4();
    const now = new Date();

    // Read file as blob
    const blob = new Blob([await file.arrayBuffer()], { type: file.type });

    const attachment: Attachment = {
      id: attachmentId,
      capabilityAssessmentId,
      orbitRatingId,
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      blob,
      description,
      uploadedAt: now,
    };

    await db.attachments.add(attachment);

    // Update the rating's attachmentIds array
    const rating = await db.orbitRatings.get(orbitRatingId);
    if (rating) {
      await db.orbitRatings.update(orbitRatingId, {
        attachmentIds: [...rating.attachmentIds, attachmentId],
        updatedAt: now,
      });
    }

    // Update assessment timestamp
    await db.capabilityAssessments.update(capabilityAssessmentId, {
      updatedAt: now,
    });

    return attachmentId;
  };

  /**
   * Delete an attachment
   */
  const deleteAttachment = async (attachmentId: string): Promise<void> => {
    const attachment = await db.attachments.get(attachmentId);
    if (!attachment) return;

    // Remove from rating's attachmentIds
    const rating = await db.orbitRatings.get(attachment.orbitRatingId);
    if (rating) {
      await db.orbitRatings.update(attachment.orbitRatingId, {
        attachmentIds: rating.attachmentIds.filter((id) => id !== attachmentId),
        updatedAt: new Date(),
      });
    }

    // Delete the attachment
    await db.attachments.delete(attachmentId);

    // Update assessment timestamp
    if (capabilityAssessmentId) {
      await db.capabilityAssessments.update(capabilityAssessmentId, {
        updatedAt: new Date(),
      });
    }
  };

  /**
   * Download an attachment (trigger browser download)
   */
  const downloadAttachment = (attachment: Attachment): void => {
    const url = URL.createObjectURL(attachment.blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = attachment.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  /**
   * Get attachments for a specific rating
   */
  const getAttachmentsForRating = (orbitRatingId: string): Attachment[] => {
    return attachmentsByRating.get(orbitRatingId) ?? [];
  };

  /**
   * Get total size of all attachments
   */
  const getTotalSize = (): number => {
    return (attachments ?? []).reduce((sum, a) => sum + a.fileSize, 0);
  };

  return {
    attachments: attachments ?? [],
    attachmentsByRating,
    uploadAttachment,
    deleteAttachment,
    downloadAttachment,
    getAttachmentsForRating,
    getTotalSize,
  };
}
