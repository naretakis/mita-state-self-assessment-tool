/**
 * Export/Import Types
 *
 * Type definitions for the export and import system.
 */

import type { CapabilityAssessment, OrbitRating, AssessmentHistory, Tag } from '../../types';

/**
 * Export scope options
 */
export type ExportScope = 'full' | 'domain' | 'area';

/**
 * Export format options
 */
export type ExportFormat = 'json' | 'zip' | 'pdf' | 'csv';

/**
 * Export options
 */
export interface ExportOptions {
  scope: ExportScope;
  format: ExportFormat;
  domainId?: string;
  areaId?: string;
  includeAttachments?: boolean;
  includeHistory?: boolean;
  stateName?: string;
}

/**
 * Attachment metadata without blob (for JSON export)
 */
export interface AttachmentMetadata {
  id: string;
  capabilityAssessmentId: string;
  orbitRatingId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  description?: string;
  uploadedAt: string;
}

/**
 * Export data structure (JSON format)
 */
export interface ExportData {
  exportVersion: string;
  exportDate: string;
  appVersion: string;
  scope: ExportScope;
  scopeDetails?: {
    domainId?: string;
    domainName?: string;
    areaId?: string;
    areaName?: string;
  };
  data: {
    assessments: CapabilityAssessment[];
    ratings: OrbitRating[];
    history: AssessmentHistory[];
    tags: Tag[];
    attachments: AttachmentMetadata[];
  };
  metadata: {
    totalAssessments: number;
    totalRatings: number;
    totalHistory: number;
    totalAttachments: number;
    capabilities: string[];
  };
}

/**
 * Import result summary
 */
export interface ImportResult {
  success: boolean;
  importedAsCurrent: number;
  importedAsHistory: number;
  skipped: number;
  errors: string[];
  details: ImportItemResult[];
}

/**
 * Individual import item result
 */
export interface ImportItemResult {
  areaId: string;
  areaName: string;
  action: 'imported_current' | 'imported_history' | 'skipped' | 'error';
  reason?: string;
}

/**
 * CSV Maturity Profile row
 */
export interface MaturityProfileRow {
  dimension: string;
  asIs: string;
  toBe: string;
  notes: string;
  barriers: string;
  plans: string;
}

/**
 * CSV Maturity Profile for a capability area
 */
export interface CapabilityAreaProfile {
  domainName: string;
  areaName: string;
  rows: MaturityProfileRow[];
}

/**
 * CSV Maturity Profile (collection of capability area profiles)
 */
export interface MaturityProfile {
  stateName: string;
  domainName: string;
  areas: CapabilityAreaProfile[];
}

/**
 * Export progress callback
 */
export type ExportProgressCallback = (progress: number, message: string) => void;

/**
 * Import progress callback
 */
export type ImportProgressCallback = (progress: number, message: string) => void;
