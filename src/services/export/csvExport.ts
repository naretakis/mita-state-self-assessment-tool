/**
 * CSV Export Service
 *
 * Generates CSV files in the CMS Maturity Profile format.
 * Format follows the MITA 4.0 Maturity Profile template structure.
 */

import type { MaturityProfile, CapabilityAreaProfile } from './types';

/** CSV column headers */
const CSV_HEADERS = 'ORBIT,As Is,To Be,Notes,Barriers & Challenges,Advancement Plans';

/** Standard ORBIT dimension names for CSV output (matches MITA 4.0 ORBIT model) */
const ORBIT_DIMENSIONS = [
  'Outcomes',
  'Roles',
  'Business Architecture',
  'Information & Data',
  'Technology',
];

/**
 * Generates a CSV string from a maturity profile (single domain)
 * Format matches the CMS standard Maturity Profile template
 */
export function generateMaturityProfileCsv(profile: MaturityProfile): string {
  const lines: string[] = [];

  // Header row with state name
  lines.push(`MITA 4.0 Maturity Profile: ${profile.stateName},,,,,`);
  lines.push(',,,,,');

  // Generate section for each capability area
  for (const area of profile.areas) {
    lines.push(...generateAreaSection(area));
    lines.push(',,,,,'); // Blank line between areas
  }

  return lines.join('\n');
}

/**
 * Generates CSV lines for a single capability area
 */
function generateAreaSection(area: CapabilityAreaProfile): string[] {
  const lines: string[] = [];

  // Domain and area headers
  lines.push(`Capability Domain: ${escapeCSVField(area.domainName)},,,,,`);
  lines.push(`Capability Area: ${escapeCSVField(area.areaName)},,,,,`);

  // Column headers
  lines.push(CSV_HEADERS);

  // Data rows - ensure all dimensions are present in order
  for (const dimName of ORBIT_DIMENSIONS) {
    const row = area.rows.find((r) => r.dimension === dimName);
    if (row) {
      lines.push(
        `${row.dimension},${row.asIs},${row.toBe},${escapeCSVField(row.notes)},${escapeCSVField(row.barriers)},${escapeCSVField(row.plans)}`
      );
    } else {
      // Empty row for dimensions without data
      lines.push(`${dimName},,,,,`);
    }
  }

  return lines;
}

/**
 * Generates a combined CSV string from multiple maturity profiles
 * All capability areas in a single file
 */
export function generateCombinedMaturityProfileCsv(
  profiles: MaturityProfile[],
  stateName: string
): string {
  const lines: string[] = [];

  // Header row with state name
  lines.push(`MITA 4.0 Maturity Profile: ${stateName},,,,,`);
  lines.push(',,,,,');

  // Generate sections for all areas across all domains
  for (const profile of profiles) {
    for (const area of profile.areas) {
      lines.push(...generateAreaSection(area));
      lines.push(',,,,,'); // Blank line between areas
    }
  }

  return lines.join('\n');
}

/**
 * Escapes a CSV field value
 * Wraps in quotes if contains comma, newline, or quote
 */
function escapeCSVField(value: string): string {
  if (!value) return '';

  // Check if escaping is needed
  if (value.includes(',') || value.includes('\n') || value.includes('"')) {
    // Escape quotes by doubling them
    const escaped = value.replace(/"/g, '""');
    return `"${escaped}"`;
  }

  return value;
}

/**
 * Parses a CSV maturity profile back into structured data
 * Used for import validation
 */
export function parseMaturityProfileCsv(csv: string): MaturityProfile | null {
  const lines = csv.split('\n').map((line) => line.trim());

  if (lines.length < 5) return null;

  // Parse header for state name
  const headerLine = lines[0];
  const headerMatch = headerLine?.match(/MITA 4\.0 Maturity Profile:\s*([^,]+)/);
  const stateName = headerMatch?.[1]?.trim() ?? 'Unknown';

  const areas: CapabilityAreaProfile[] = [];
  let currentDomain = '';
  let currentArea: CapabilityAreaProfile | null = null;
  let inDataSection = false;

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line || line === ',,,,,') {
      // End of current area section
      if (currentArea && currentArea.rows.length > 0) {
        areas.push(currentArea);
        currentArea = null;
      }
      inDataSection = false;
      continue;
    }

    // Check for domain header
    const domainMatch = line.match(/^Capability Domain:\s*([^,]+)/);
    if (domainMatch) {
      currentDomain = domainMatch[1]?.trim() ?? '';
      continue;
    }

    // Check for area header
    const areaMatch = line.match(/^Capability Area:\s*([^,]+)/);
    if (areaMatch) {
      currentArea = {
        domainName: currentDomain,
        areaName: areaMatch[1]?.trim() ?? '',
        rows: [],
      };
      continue;
    }

    // Check for column headers
    if (line.startsWith('ORBIT,')) {
      inDataSection = true;
      continue;
    }

    // Parse data row
    if (inDataSection && currentArea) {
      const parts = parseCSVLine(line);
      if (parts.length >= 1 && parts[0]) {
        currentArea.rows.push({
          dimension: parts[0],
          asIs: parts[1] ?? '',
          toBe: parts[2] ?? '',
          notes: parts[3] ?? '',
          barriers: parts[4] ?? '',
          plans: parts[5] ?? '',
        });
      }
    }
  }

  // Add last area if exists
  if (currentArea && currentArea.rows.length > 0) {
    areas.push(currentArea);
  }

  if (areas.length === 0) return null;

  return {
    stateName,
    domainName: areas[0]?.domainName ?? 'Unknown',
    areas,
  };
}

/**
 * Parses a single CSV line handling quoted fields
 */
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (inQuotes) {
      if (char === '"') {
        // Check for escaped quote
        if (i + 1 < line.length && line[i + 1] === '"') {
          current += '"';
          i++; // Skip next quote
        } else {
          inQuotes = false;
        }
      } else {
        current += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ',') {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
  }

  result.push(current.trim());
  return result;
}
