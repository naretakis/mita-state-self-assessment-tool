/**
 * Export Service
 *
 * Core service for exporting assessment data in various formats.
 * Supports JSON, ZIP (with attachments), PDF, and CSV exports.
 */

import JSZip from 'jszip';
import { db } from '../db';
import { getDomainById, getAreaById } from '../capabilities';
import { getAreasFromDomain } from '../../types';
import type {
  ExportOptions,
  ExportData,
  AttachmentMetadata,
  MaturityProfile,
  CapabilityAreaProfile,
  MaturityProfileRow,
  ExportProgressCallback,
} from './types';
import type {
  CapabilityAssessment,
  OrbitRating,
  AssessmentHistory,
  Tag,
  OrbitDimensionId,
} from '../../types';
import { generatePdfReport } from './pdfExport';
import { generateMaturityProfileCsv, generateCombinedMaturityProfileCsv } from './csvExport';

/** Current export format version */
const EXPORT_VERSION = '1.0';

/** App version from package.json */
const APP_VERSION = '0.1.0';

/**
 * Collects all data for export based on scope
 */
async function collectExportData(options: ExportOptions): Promise<ExportData> {
  const { scope, domainId, areaId } = options;

  let assessments: CapabilityAssessment[] = [];
  let ratings: OrbitRating[] = [];
  let history: AssessmentHistory[] = [];
  let scopeDetails: ExportData['scopeDetails'];

  if (scope === 'area' && areaId) {
    // Single capability area
    const area = getAreaById(areaId);
    const assessment = await db.capabilityAssessments
      .where('capabilityAreaId')
      .equals(areaId)
      .first();

    if (assessment) {
      assessments = [assessment];
      ratings = await db.orbitRatings
        .where('capabilityAssessmentId')
        .equals(assessment.id)
        .toArray();
      history = await db.assessmentHistory.where('capabilityAreaId').equals(areaId).toArray();
    }

    scopeDetails = {
      areaId,
      areaName: area?.name,
      domainId: assessment?.capabilityDomainId,
      domainName: assessment?.capabilityDomainName,
    };
  } else if (scope === 'domain' && domainId) {
    // All areas in a domain
    const domain = getDomainById(domainId);
    if (domain) {
      const areas = getAreasFromDomain(domain);
      const areaIds = areas.map((a) => a.id);

      assessments = await db.capabilityAssessments
        .where('capabilityAreaId')
        .anyOf(areaIds)
        .toArray();

      const assessmentIds = assessments.map((a) => a.id);
      ratings = await db.orbitRatings
        .where('capabilityAssessmentId')
        .anyOf(assessmentIds)
        .toArray();

      history = await db.assessmentHistory.where('capabilityAreaId').anyOf(areaIds).toArray();

      scopeDetails = {
        domainId,
        domainName: domain.name,
      };
    }
  } else {
    // Full export
    assessments = await db.capabilityAssessments.toArray();
    ratings = await db.orbitRatings.toArray();
    history = await db.assessmentHistory.toArray();
  }

  // Get all tags
  const tags: Tag[] = await db.tags.toArray();

  // Get attachment metadata (not blobs)
  const assessmentIds = assessments.map((a) => a.id);
  const attachmentsRaw = await db.attachments
    .where('capabilityAssessmentId')
    .anyOf(assessmentIds)
    .toArray();

  const attachments: AttachmentMetadata[] = attachmentsRaw.map((a) => ({
    id: a.id,
    capabilityAssessmentId: a.capabilityAssessmentId,
    orbitRatingId: a.orbitRatingId,
    fileName: a.fileName,
    fileType: a.fileType,
    fileSize: a.fileSize,
    description: a.description,
    uploadedAt: a.uploadedAt.toISOString(),
  }));

  return {
    exportVersion: EXPORT_VERSION,
    exportDate: new Date().toISOString(),
    appVersion: APP_VERSION,
    scope,
    scopeDetails,
    data: {
      assessments,
      ratings,
      history,
      tags,
      attachments,
    },
    metadata: {
      totalAssessments: assessments.length,
      totalRatings: ratings.length,
      totalHistory: history.length,
      totalAttachments: attachments.length,
      capabilities: assessments.map((a) => `${a.capabilityDomainId}/${a.capabilityAreaId}`),
    },
  };
}

/**
 * Exports data as JSON string
 */
export async function exportAsJson(options: ExportOptions): Promise<string> {
  const data = await collectExportData(options);
  return JSON.stringify(data, null, 2);
}

/**
 * Exports data as a ZIP file containing JSON, CSV profiles, and attachments
 */
export async function exportAsZip(
  options: ExportOptions,
  onProgress?: ExportProgressCallback
): Promise<Blob> {
  const zip = new JSZip();

  onProgress?.(10, 'Collecting assessment data...');

  // Collect export data
  const exportData = await collectExportData(options);

  onProgress?.(30, 'Adding JSON data...');

  // Add JSON data file
  zip.file('data.json', JSON.stringify(exportData, null, 2));

  onProgress?.(40, 'Generating CSV maturity profiles...');

  // Add CSV maturity profiles
  const csvFolder = zip.folder('maturity-profiles');
  if (csvFolder) {
    const profiles = await generateAllMaturityProfiles(options);

    // Add individual domain CSVs
    for (const profile of profiles) {
      const csv = generateMaturityProfileCsv(profile);
      const fileName = `${profile.domainName.toLowerCase().replace(/\s+/g, '-')}-maturity-profile.csv`;
      csvFolder.file(fileName, csv);
    }

    // Add combined CSV with all domains
    if (profiles.length > 0) {
      const combinedCsv = generateCombinedMaturityProfileCsv(
        profiles,
        options.stateName ?? 'State'
      );
      csvFolder.file('all-domains-maturity-profile.csv', combinedCsv);
    }
  }

  onProgress?.(60, 'Adding attachments...');

  // Add attachments if requested
  if (options.includeAttachments !== false) {
    const attachmentsFolder = zip.folder('attachments');
    if (attachmentsFolder) {
      const assessmentIds = exportData.data.assessments.map((a) => a.id);
      const attachments = await db.attachments
        .where('capabilityAssessmentId')
        .anyOf(assessmentIds)
        .toArray();

      for (const attachment of attachments) {
        // Find the assessment for folder structure
        const assessment = exportData.data.assessments.find(
          (a) => a.id === attachment.capabilityAssessmentId
        );
        if (assessment) {
          const folderPath = `${assessment.capabilityDomainId}/${assessment.capabilityAreaId}`;
          const folder = attachmentsFolder.folder(folderPath);
          folder?.file(attachment.fileName, attachment.blob);
        }
      }
    }
  }

  onProgress?.(80, 'Creating manifest...');

  // Add manifest
  const manifest = {
    exportVersion: EXPORT_VERSION,
    exportDate: exportData.exportDate,
    appVersion: APP_VERSION,
    scope: options.scope,
    contents: {
      dataJson: true,
      maturityProfiles: true,
      attachments: options.includeAttachments !== false,
    },
    stats: exportData.metadata,
  };
  zip.file('manifest.json', JSON.stringify(manifest, null, 2));

  onProgress?.(90, 'Compressing...');

  // Generate ZIP blob
  const blob = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE' });

  onProgress?.(100, 'Complete');

  return blob;
}

/**
 * Generates maturity profiles for all domains in scope
 */
async function generateAllMaturityProfiles(options: ExportOptions): Promise<MaturityProfile[]> {
  const profiles: MaturityProfile[] = [];
  const stateName = options.stateName ?? 'State';

  if (options.scope === 'area' && options.areaId) {
    // Single area - get its domain
    const assessment = await db.capabilityAssessments
      .where('capabilityAreaId')
      .equals(options.areaId)
      .first();

    if (assessment) {
      const profile = await generateDomainMaturityProfile(assessment.capabilityDomainId, stateName);
      if (profile) profiles.push(profile);
    }
  } else if (options.scope === 'domain' && options.domainId) {
    // Single domain
    const profile = await generateDomainMaturityProfile(options.domainId, stateName);
    if (profile) profiles.push(profile);
  } else {
    // Full export - all domains with assessments
    const assessments = await db.capabilityAssessments.toArray();
    const domainIds = [...new Set(assessments.map((a) => a.capabilityDomainId))];

    for (const domainId of domainIds) {
      const profile = await generateDomainMaturityProfile(domainId, stateName);
      if (profile) profiles.push(profile);
    }
  }

  return profiles;
}

/**
 * Generates a maturity profile for a single domain
 * Creates a profile with sections for each capability area
 */
async function generateDomainMaturityProfile(
  domainId: string,
  stateName: string
): Promise<MaturityProfile | null> {
  const domain = getDomainById(domainId);
  if (!domain) return null;

  const areas = getAreasFromDomain(domain);
  const areaIds = areas.map((a) => a.id);

  // Get all finalized assessments for this domain
  const assessments = await db.capabilityAssessments
    .where('capabilityAreaId')
    .anyOf(areaIds)
    .and((a) => a.status === 'finalized')
    .toArray();

  if (assessments.length === 0) return null;

  // Get all ratings for these assessments
  const assessmentIds = assessments.map((a) => a.id);
  const allRatings = await db.orbitRatings
    .where('capabilityAssessmentId')
    .anyOf(assessmentIds)
    .toArray();

  // Build capability area profiles
  const areaProfiles: CapabilityAreaProfile[] = [];

  for (const assessment of assessments) {
    const areaRatings = allRatings.filter((r) => r.capabilityAssessmentId === assessment.id);
    const areaProfile = generateCapabilityAreaProfile(assessment, areaRatings);
    areaProfiles.push(areaProfile);
  }

  return {
    stateName,
    domainName: domain.name,
    areas: areaProfiles,
  };
}

/**
 * Generates a profile for a single capability area
 */
function generateCapabilityAreaProfile(
  assessment: CapabilityAssessment,
  ratings: OrbitRating[]
): CapabilityAreaProfile {
  // Map dimension IDs to display names (matches MITA 4.0 ORBIT model)
  const dimensionMap: Record<OrbitDimensionId, string> = {
    outcomes: 'Outcomes',
    roles: 'Roles',
    businessArchitecture: 'Business Architecture',
    informationData: 'Information & Data',
    technology: 'Technology',
  };

  // Group ratings by dimension and calculate averages
  const dimensionData: Record<
    string,
    {
      asIs: number[];
      toBe: number[];
      notes: string[];
      barriers: string[];
      plans: string[];
    }
  > = {};

  // Initialize all dimensions
  for (const dimName of Object.values(dimensionMap)) {
    dimensionData[dimName] = {
      asIs: [],
      toBe: [],
      notes: [],
      barriers: [],
      plans: [],
    };
  }

  // Aggregate data from ratings
  for (const rating of ratings) {
    const dimName = dimensionMap[rating.dimensionId];
    if (!dimName) continue;

    const dimData = dimensionData[dimName];
    if (!dimData) continue;

    // Collect scores (only positive values)
    if (rating.currentLevel > 0) {
      dimData.asIs.push(rating.currentLevel);
    }
    if (rating.targetLevel && rating.targetLevel > 0) {
      dimData.toBe.push(rating.targetLevel);
    }

    // Collect text fields (non-empty only)
    if (rating.notes && rating.notes.trim()) {
      dimData.notes.push(rating.notes.trim());
    }
    if (rating.barriers && rating.barriers.trim()) {
      dimData.barriers.push(rating.barriers.trim());
    }
    if (rating.plans && rating.plans.trim()) {
      dimData.plans.push(rating.plans.trim());
    }
  }

  // Build rows for each dimension
  const rows: MaturityProfileRow[] = [];

  for (const [, dimName] of Object.entries(dimensionMap)) {
    const dimData = dimensionData[dimName];
    if (!dimData) continue;

    // Calculate averages
    const asIsAvg =
      dimData.asIs.length > 0
        ? (dimData.asIs.reduce((a, b) => a + b, 0) / dimData.asIs.length).toFixed(1)
        : '';

    const toBeAvg =
      dimData.toBe.length > 0
        ? (dimData.toBe.reduce((a, b) => a + b, 0) / dimData.toBe.length).toFixed(1)
        : '';

    // Combine text fields (join multiple entries with semicolon)
    const notes = dimData.notes.join('; ');
    const barriers = dimData.barriers.join('; ');
    const plans = dimData.plans.join('; ');

    rows.push({
      dimension: dimName,
      asIs: asIsAvg,
      toBe: toBeAvg,
      notes,
      barriers,
      plans,
    });
  }

  return {
    domainName: assessment.capabilityDomainName,
    areaName: assessment.capabilityAreaName,
    rows,
  };
}

/**
 * Exports data as PDF report
 */
export async function exportAsPdf(
  options: ExportOptions,
  onProgress?: ExportProgressCallback
): Promise<Blob> {
  onProgress?.(10, 'Collecting data...');
  const exportData = await collectExportData(options);

  onProgress?.(50, 'Generating PDF...');
  const blob = await generatePdfReport(exportData, options);

  onProgress?.(100, 'Complete');
  return blob;
}

/**
 * Exports a single domain's maturity profile as CSV
 */
export async function exportDomainCsv(
  domainId: string,
  stateName: string = 'State'
): Promise<string | null> {
  const profile = await generateDomainMaturityProfile(domainId, stateName);
  if (!profile) return null;
  return generateMaturityProfileCsv(profile);
}

/**
 * Exports all domains' maturity profiles as a single combined CSV
 */
export async function exportAllDomainsCsv(stateName: string = 'State'): Promise<string | null> {
  const profiles = await generateAllMaturityProfiles({ scope: 'full', format: 'csv', stateName });
  if (profiles.length === 0) return null;
  return generateCombinedMaturityProfileCsv(profiles, stateName);
}

/**
 * Downloads a blob as a file
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Downloads text as a file
 */
export function downloadText(text: string, filename: string, mimeType: string): void {
  const blob = new Blob([text], { type: mimeType });
  downloadBlob(blob, filename);
}

/**
 * Generates a filename with timestamp
 */
export function generateFilename(prefix: string, extension: string, scope?: string): string {
  const date = new Date().toISOString().split('T')[0];
  const scopePart = scope ? `-${scope}` : '';
  return `mita-${prefix}${scopePart}-${date}.${extension}`;
}
