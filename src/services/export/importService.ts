/**
 * Import Service
 *
 * Handles importing assessment data from JSON and ZIP files.
 * Uses "Merge with History" strategy:
 * - Newer imports become current, existing moves to history
 * - Older imports are added to history, existing stays current
 */

import JSZip from 'jszip';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../db';
import type { ExportData, ImportResult, ImportItemResult, ImportProgressCallback } from './types';
import type {
  CapabilityAssessment,
  OrbitRating,
  AssessmentHistory,
  HistoricalRating,
  Attachment,
} from '../../types';

/** Current supported export version */
const SUPPORTED_VERSIONS = ['1.0'];

/**
 * Validates export data structure
 */
function validateExportData(data: unknown): data is ExportData {
  if (!data || typeof data !== 'object') return false;

  const d = data as Record<string, unknown>;

  if (typeof d.exportVersion !== 'string') return false;
  if (typeof d.exportDate !== 'string') return false;
  if (!d.data || typeof d.data !== 'object') return false;

  const dataObj = d.data as Record<string, unknown>;
  if (!Array.isArray(dataObj.assessments)) return false;
  if (!Array.isArray(dataObj.ratings)) return false;

  return true;
}

/**
 * Creates a history snapshot from an assessment and its ratings
 */
async function createHistorySnapshot(
  assessment: CapabilityAssessment,
  ratings: OrbitRating[],
  score: number
): Promise<AssessmentHistory> {
  const historicalRatings: HistoricalRating[] = ratings.map((r) => ({
    dimensionId: r.dimensionId,
    subDimensionId: r.subDimensionId,
    aspectId: r.aspectId,
    currentLevel: r.currentLevel,
    targetLevel: r.targetLevel,
    questionResponses: r.questionResponses,
    evidenceResponses: r.evidenceResponses,
    notes: r.notes,
    barriers: r.barriers,
    plans: r.plans,
  }));

  // Calculate dimension scores
  const dimensionScores: Record<string, number> = {};
  const dimensionRatings = new Map<string, number[]>();

  for (const rating of ratings) {
    if (rating.currentLevel > 0) {
      const key = rating.subDimensionId
        ? `${rating.dimensionId}:${rating.subDimensionId}`
        : rating.dimensionId;
      const existing = dimensionRatings.get(key) ?? [];
      existing.push(rating.currentLevel);
      dimensionRatings.set(key, existing);
    }
  }

  for (const [key, scores] of dimensionRatings) {
    dimensionScores[key] = scores.reduce((a, b) => a + b, 0) / scores.length;
  }

  return {
    id: uuidv4(),
    capabilityAssessmentId: assessment.id,
    capabilityAreaId: assessment.capabilityAreaId,
    snapshotDate: assessment.finalizedAt ?? assessment.updatedAt,
    tags: [...assessment.tags],
    overallScore: score,
    dimensionScores,
    ratings: historicalRatings,
  };
}

/**
 * Imports data from a JSON string
 */
export async function importFromJson(
  jsonString: string,
  onProgress?: ImportProgressCallback
): Promise<ImportResult> {
  onProgress?.(10, 'Parsing JSON...');

  let data: unknown;
  try {
    data = JSON.parse(jsonString);
  } catch {
    return {
      success: false,
      importedAsCurrent: 0,
      importedAsHistory: 0,
      skipped: 0,
      errors: ['Invalid JSON format'],
      details: [],
    };
  }

  if (!validateExportData(data)) {
    return {
      success: false,
      importedAsCurrent: 0,
      importedAsHistory: 0,
      skipped: 0,
      errors: ['Invalid export data structure'],
      details: [],
    };
  }

  if (!SUPPORTED_VERSIONS.includes(data.exportVersion)) {
    return {
      success: false,
      importedAsCurrent: 0,
      importedAsHistory: 0,
      skipped: 0,
      errors: [`Unsupported export version: ${data.exportVersion}`],
      details: [],
    };
  }

  onProgress?.(30, 'Processing assessments...');

  return await processImport(data, onProgress);
}

/**
 * Imports data from a ZIP file
 */
export async function importFromZip(
  zipBlob: Blob,
  onProgress?: ImportProgressCallback
): Promise<ImportResult> {
  onProgress?.(10, 'Reading ZIP file...');

  let zip: JSZip;
  try {
    zip = await JSZip.loadAsync(zipBlob);
  } catch {
    return {
      success: false,
      importedAsCurrent: 0,
      importedAsHistory: 0,
      skipped: 0,
      errors: ['Invalid ZIP file'],
      details: [],
    };
  }

  // Read data.json
  const dataFile = zip.file('data.json');
  if (!dataFile) {
    return {
      success: false,
      importedAsCurrent: 0,
      importedAsHistory: 0,
      skipped: 0,
      errors: ['ZIP file missing data.json'],
      details: [],
    };
  }

  onProgress?.(20, 'Parsing data...');

  const jsonString = await dataFile.async('string');
  let data: unknown;
  try {
    data = JSON.parse(jsonString);
  } catch {
    return {
      success: false,
      importedAsCurrent: 0,
      importedAsHistory: 0,
      skipped: 0,
      errors: ['Invalid JSON in data.json'],
      details: [],
    };
  }

  if (!validateExportData(data)) {
    return {
      success: false,
      importedAsCurrent: 0,
      importedAsHistory: 0,
      skipped: 0,
      errors: ['Invalid export data structure'],
      details: [],
    };
  }

  onProgress?.(40, 'Processing assessments...');

  // Process the main import
  const result = await processImport(data, (p, m) => {
    // Scale progress from 40-80%
    onProgress?.(40 + p * 0.4, m);
  });

  // Import attachments
  onProgress?.(80, 'Importing attachments...');

  const attachmentsFolder = zip.folder('attachments');
  if (attachmentsFolder) {
    const attachmentFiles: { path: string; file: JSZip.JSZipObject }[] = [];

    attachmentsFolder.forEach((relativePath, file) => {
      if (!file.dir) {
        attachmentFiles.push({ path: relativePath, file });
      }
    });

    for (const { path, file } of attachmentFiles) {
      try {
        // Find matching attachment metadata
        const fileName = path.split('/').pop() ?? '';
        const attachmentMeta = data.data.attachments.find((a) => a.fileName === fileName);

        if (attachmentMeta) {
          // Check if attachment already exists
          const existing = await db.attachments.get(attachmentMeta.id);
          if (!existing) {
            const blob = await file.async('blob');

            // Find the new assessment ID (may have been remapped)
            const assessment = await db.capabilityAssessments
              .where('capabilityAreaId')
              .equals(
                data.data.assessments.find((a) => a.id === attachmentMeta.capabilityAssessmentId)
                  ?.capabilityAreaId ?? ''
              )
              .first();

            if (assessment) {
              // Find the rating
              const rating = await db.orbitRatings
                .where('capabilityAssessmentId')
                .equals(assessment.id)
                .toArray()
                .then((ratings) =>
                  ratings.find((r) => {
                    const originalRating = data.data.ratings.find(
                      (or) => or.id === attachmentMeta.orbitRatingId
                    );
                    return (
                      originalRating &&
                      r.dimensionId === originalRating.dimensionId &&
                      r.aspectId === originalRating.aspectId
                    );
                  })
                );

              if (rating) {
                const attachment: Attachment = {
                  id: uuidv4(),
                  capabilityAssessmentId: assessment.id,
                  orbitRatingId: rating.id,
                  fileName: attachmentMeta.fileName,
                  fileType: attachmentMeta.fileType,
                  fileSize: attachmentMeta.fileSize,
                  blob,
                  description: attachmentMeta.description,
                  uploadedAt: new Date(attachmentMeta.uploadedAt),
                };

                await db.attachments.add(attachment);

                // Update rating's attachmentIds
                await db.orbitRatings.update(rating.id, {
                  attachmentIds: [...rating.attachmentIds, attachment.id],
                });
              }
            }
          }
        }
      } catch (error) {
        console.error('Failed to import attachment:', path, error);
      }
    }
  }

  onProgress?.(100, 'Complete');

  return result;
}

/**
 * Core import processing logic
 */
async function processImport(
  data: ExportData,
  onProgress?: ImportProgressCallback
): Promise<ImportResult> {
  const result: ImportResult = {
    success: true,
    importedAsCurrent: 0,
    importedAsHistory: 0,
    skipped: 0,
    errors: [],
    details: [],
  };

  const totalAssessments = data.data.assessments.length;

  for (let i = 0; i < data.data.assessments.length; i++) {
    const importedAssessment = data.data.assessments[i];
    if (!importedAssessment) continue;

    const progress = Math.round(((i + 1) / totalAssessments) * 100);
    onProgress?.(progress, `Processing ${importedAssessment.capabilityAreaName}...`);

    try {
      const itemResult = await processAssessmentImport(importedAssessment, data);
      result.details.push(itemResult);

      switch (itemResult.action) {
        case 'imported_current':
          result.importedAsCurrent++;
          break;
        case 'imported_history':
          result.importedAsHistory++;
          break;
        case 'skipped':
          result.skipped++;
          break;
        case 'error':
          result.errors.push(itemResult.reason ?? 'Unknown error');
          break;
      }
    } catch (error) {
      result.errors.push(`Failed to import ${importedAssessment.capabilityAreaName}: ${error}`);
      result.details.push({
        areaId: importedAssessment.capabilityAreaId,
        areaName: importedAssessment.capabilityAreaName,
        action: 'error',
        reason: String(error),
      });
    }
  }

  // Import tags
  for (const tag of data.data.tags) {
    const existing = await db.tags.where('name').equals(tag.name).first();
    if (!existing) {
      await db.tags.add({
        ...tag,
        lastUsed: new Date(tag.lastUsed),
      });
    }
  }

  // Import history entries
  for (const historyEntry of data.data.history) {
    const existing = await db.assessmentHistory.get(historyEntry.id);
    if (!existing) {
      await db.assessmentHistory.add({
        ...historyEntry,
        snapshotDate: new Date(historyEntry.snapshotDate),
      });
    }
  }

  result.success = result.errors.length === 0;
  return result;
}

/**
 * Processes a single assessment import with merge logic
 */
async function processAssessmentImport(
  importedAssessment: CapabilityAssessment,
  data: ExportData
): Promise<ImportItemResult> {
  const areaId = importedAssessment.capabilityAreaId;

  // Get imported ratings for this assessment
  const importedRatings = data.data.ratings.filter(
    (r) => r.capabilityAssessmentId === importedAssessment.id
  );

  // Check for existing assessment
  const existingAssessment = await db.capabilityAssessments
    .where('capabilityAreaId')
    .equals(areaId)
    .first();

  // Convert dates for comparison
  const importedDate = new Date(importedAssessment.updatedAt);

  if (!existingAssessment) {
    // No existing - import as current
    const newAssessmentId = uuidv4();

    await db.capabilityAssessments.add({
      ...importedAssessment,
      id: newAssessmentId,
      createdAt: new Date(importedAssessment.createdAt),
      updatedAt: importedDate,
      finalizedAt: importedAssessment.finalizedAt
        ? new Date(importedAssessment.finalizedAt)
        : undefined,
    });

    // Add ratings with new IDs
    for (const rating of importedRatings) {
      await db.orbitRatings.add({
        ...rating,
        id: uuidv4(),
        capabilityAssessmentId: newAssessmentId,
        updatedAt: new Date(rating.updatedAt),
        attachmentIds: [], // Attachments handled separately
      });
    }

    return {
      areaId,
      areaName: importedAssessment.capabilityAreaName,
      action: 'imported_current',
    };
  }

  // Existing assessment found - compare timestamps
  const existingDate = existingAssessment.updatedAt;
  const timeDiff = Math.abs(importedDate.getTime() - existingDate.getTime());

  // Check if this is essentially the same data (same timestamp within 1 second and same score)
  const isSameData =
    timeDiff < 1000 &&
    importedAssessment.overallScore !== undefined &&
    existingAssessment.overallScore !== undefined &&
    Math.abs(importedAssessment.overallScore - existingAssessment.overallScore) < 0.01;

  if (isSameData) {
    // Skip - this is a duplicate of what's already current
    return {
      areaId,
      areaName: importedAssessment.capabilityAreaName,
      action: 'skipped',
      reason: 'Identical to current assessment',
    };
  }

  if (importedDate > existingDate) {
    // Imported is newer - move existing to history, import as current

    // Get existing ratings
    const existingRatings = await db.orbitRatings
      .where('capabilityAssessmentId')
      .equals(existingAssessment.id)
      .toArray();

    // Create history snapshot of existing
    if (existingAssessment.status === 'finalized' && existingAssessment.overallScore) {
      const historySnapshot = await createHistorySnapshot(
        existingAssessment,
        existingRatings,
        existingAssessment.overallScore
      );
      await db.assessmentHistory.add(historySnapshot);
    }

    // Delete existing ratings
    await db.orbitRatings.where('capabilityAssessmentId').equals(existingAssessment.id).delete();

    // Update existing assessment with imported data
    await db.capabilityAssessments.update(existingAssessment.id, {
      status: importedAssessment.status,
      tags: importedAssessment.tags,
      updatedAt: importedDate,
      finalizedAt: importedAssessment.finalizedAt
        ? new Date(importedAssessment.finalizedAt)
        : undefined,
      overallScore: importedAssessment.overallScore,
    });

    // Add imported ratings
    for (const rating of importedRatings) {
      await db.orbitRatings.add({
        ...rating,
        id: uuidv4(),
        capabilityAssessmentId: existingAssessment.id,
        updatedAt: new Date(rating.updatedAt),
        attachmentIds: [],
      });
    }

    return {
      areaId,
      areaName: importedAssessment.capabilityAreaName,
      action: 'imported_current',
      reason: 'Replaced older local assessment (moved to history)',
    };
  } else {
    // Imported is older - add to history only

    if (importedAssessment.status === 'finalized' && importedAssessment.overallScore) {
      // Check if this exact snapshot already exists in history
      const existingHistory = await db.assessmentHistory
        .where('capabilityAreaId')
        .equals(areaId)
        .toArray();

      const alreadyExists = existingHistory.some(
        (h) =>
          Math.abs(h.snapshotDate.getTime() - importedDate.getTime()) < 1000 &&
          Math.abs(h.overallScore - importedAssessment.overallScore!) < 0.01
      );

      if (alreadyExists) {
        return {
          areaId,
          areaName: importedAssessment.capabilityAreaName,
          action: 'skipped',
          reason: 'Historical entry already exists',
        };
      }

      // Create history entry from imported data
      const historicalRatings: HistoricalRating[] = importedRatings.map((r) => ({
        dimensionId: r.dimensionId,
        subDimensionId: r.subDimensionId,
        aspectId: r.aspectId,
        currentLevel: r.currentLevel,
        targetLevel: r.targetLevel,
        questionResponses: r.questionResponses,
        evidenceResponses: r.evidenceResponses,
        notes: r.notes,
        barriers: r.barriers,
        plans: r.plans,
      }));

      const dimensionScores: Record<string, number> = {};
      const dimensionRatings = new Map<string, number[]>();

      for (const rating of importedRatings) {
        if (rating.currentLevel > 0) {
          const key = rating.subDimensionId
            ? `${rating.dimensionId}:${rating.subDimensionId}`
            : rating.dimensionId;
          const existing = dimensionRatings.get(key) ?? [];
          existing.push(rating.currentLevel);
          dimensionRatings.set(key, existing);
        }
      }

      for (const [key, scores] of dimensionRatings) {
        dimensionScores[key] = scores.reduce((a, b) => a + b, 0) / scores.length;
      }

      await db.assessmentHistory.add({
        id: uuidv4(),
        capabilityAssessmentId: existingAssessment.id,
        capabilityAreaId: areaId,
        snapshotDate: importedDate,
        tags: importedAssessment.tags,
        overallScore: importedAssessment.overallScore,
        dimensionScores,
        ratings: historicalRatings,
      });

      return {
        areaId,
        areaName: importedAssessment.capabilityAreaName,
        action: 'imported_history',
        reason: 'Added as historical entry (local is newer)',
      };
    }

    return {
      areaId,
      areaName: importedAssessment.capabilityAreaName,
      action: 'skipped',
      reason: 'Local assessment is newer and imported is not finalized',
    };
  }
}

/**
 * Reads a file as text
 */
export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}
