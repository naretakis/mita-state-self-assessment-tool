/**
 * Dexie Database Setup for MITA 4.0 State Self-Assessment Tool
 *
 * Uses IndexedDB via Dexie.js for local-only data persistence.
 * All assessment data stays in the browser.
 */

import Dexie, { type EntityTable } from 'dexie';
import type {
  CapabilityAssessment,
  OrbitRating,
  Attachment,
  AssessmentHistory,
  Tag,
} from '../types';

/**
 * MITA 4.0 Database
 */
const db = new Dexie('Mita4Database') as Dexie & {
  capabilityAssessments: EntityTable<CapabilityAssessment, 'id'>;
  orbitRatings: EntityTable<OrbitRating, 'id'>;
  attachments: EntityTable<Attachment, 'id'>;
  assessmentHistory: EntityTable<AssessmentHistory, 'id'>;
  tags: EntityTable<Tag, 'id'>;
};

/**
 * Database schema v1
 *
 * Index definitions:
 * - Primary key is always first
 * - Compound indexes use [field1+field2] syntax
 * - Multi-entry indexes use *field syntax
 */
db.version(1).stores({
  // Capability assessments - one per capability area
  capabilityAssessments: 'id, capabilityAreaId, capabilityDomainId, status, updatedAt, *tags',

  // ORBIT ratings - one per aspect per assessment
  // Compound index prevents duplicate ratings for same aspect
  orbitRatings:
    'id, capabilityAssessmentId, [capabilityAssessmentId+dimensionId+aspectId], [capabilityAssessmentId+dimensionId+subDimensionId+aspectId]',

  // File attachments - stored as Blobs
  attachments: 'id, capabilityAssessmentId, orbitRatingId, uploadedAt',

  // Assessment history - snapshots of finalized assessments
  assessmentHistory: 'id, capabilityAssessmentId, capabilityAreaId, snapshotDate',

  // Tags for autocomplete
  tags: 'id, name, usageCount, lastUsed',
});

export { db };

/**
 * Clear all data from the database
 * Useful for testing or user-initiated reset
 */
export async function clearDatabase(): Promise<void> {
  await db.transaction(
    'rw',
    [db.capabilityAssessments, db.orbitRatings, db.attachments, db.assessmentHistory, db.tags],
    async () => {
      await db.capabilityAssessments.clear();
      await db.orbitRatings.clear();
      await db.attachments.clear();
      await db.assessmentHistory.clear();
      await db.tags.clear();
    }
  );
}

/**
 * Get database statistics
 */
export async function getDatabaseStats(): Promise<{
  assessments: number;
  ratings: number;
  attachments: number;
  history: number;
  tags: number;
  totalSize: number;
}> {
  const [assessments, ratings, attachments, history, tags] = await Promise.all([
    db.capabilityAssessments.count(),
    db.orbitRatings.count(),
    db.attachments.count(),
    db.assessmentHistory.count(),
    db.tags.count(),
  ]);

  // Estimate total size from attachments
  const allAttachments = await db.attachments.toArray();
  const totalSize = allAttachments.reduce((sum, a) => sum + a.fileSize, 0);

  return {
    assessments,
    ratings,
    attachments,
    history,
    tags,
    totalSize,
  };
}
