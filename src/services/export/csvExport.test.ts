/**
 * CSV Export Service Tests
 */

import { describe, it, expect } from 'vitest';
import {
  generateMaturityProfileCsv,
  generateCombinedMaturityProfileCsv,
  parseMaturityProfileCsv,
} from './csvExport';
import type { MaturityProfile, CapabilityAreaProfile } from './types';

describe('csvExport', () => {
  // Test data
  const createAreaProfile = (
    domainName: string,
    areaName: string,
    rows: CapabilityAreaProfile['rows'] = []
  ): CapabilityAreaProfile => ({
    domainName,
    areaName,
    rows:
      rows.length > 0
        ? rows
        : [
            {
              dimension: 'Outcomes',
              asIs: '3.0',
              toBe: '4.0',
              notes: 'Test notes',
              barriers: 'Test barriers',
              plans: 'Test plans',
            },
            {
              dimension: 'Roles',
              asIs: '2.5',
              toBe: '3.5',
              notes: '',
              barriers: '',
              plans: '',
            },
            {
              dimension: 'Business Architecture',
              asIs: '3.5',
              toBe: '4.5',
              notes: 'BA notes',
              barriers: '',
              plans: 'BA plans',
            },
            {
              dimension: 'Information & Data',
              asIs: '2.0',
              toBe: '3.0',
              notes: '',
              barriers: 'Data barriers',
              plans: '',
            },
            {
              dimension: 'Technology',
              asIs: '3.0',
              toBe: '4.0',
              notes: 'Tech notes',
              barriers: 'Tech barriers',
              plans: 'Tech plans',
            },
          ],
  });

  const createProfile = (
    stateName: string,
    domainName: string,
    areas: CapabilityAreaProfile[]
  ): MaturityProfile => ({
    stateName,
    domainName,
    areas,
  });

  describe('generateMaturityProfileCsv', () => {
    it('should generate CSV with correct header', () => {
      const profile = createProfile('Test State', 'Provider Management', [
        createAreaProfile('Provider Management', 'Provider Enrollment'),
      ]);

      const csv = generateMaturityProfileCsv(profile);

      expect(csv).toContain('MITA 4.0 Maturity Profile: Test State');
    });

    it('should include domain and area headers', () => {
      const profile = createProfile('Test State', 'Provider Management', [
        createAreaProfile('Provider Management', 'Provider Enrollment'),
      ]);

      const csv = generateMaturityProfileCsv(profile);

      expect(csv).toContain('Capability Domain: Provider Management');
      expect(csv).toContain('Capability Area: Provider Enrollment');
    });

    it('should include column headers', () => {
      const profile = createProfile('Test State', 'Provider Management', [
        createAreaProfile('Provider Management', 'Provider Enrollment'),
      ]);

      const csv = generateMaturityProfileCsv(profile);

      expect(csv).toContain('ORBIT,As Is,To Be,Notes,Barriers & Challenges,Advancement Plans');
    });

    it('should include all ORBIT dimensions in order', () => {
      const profile = createProfile('Test State', 'Provider Management', [
        createAreaProfile('Provider Management', 'Provider Enrollment'),
      ]);

      const csv = generateMaturityProfileCsv(profile);
      const lines = csv.split('\n');

      // Find the data rows (after column headers)
      const headerIndex = lines.findIndex((l) => l.startsWith('ORBIT,'));
      expect(headerIndex).toBeGreaterThan(-1);

      const dataLines = lines.slice(headerIndex + 1, headerIndex + 6);
      expect(dataLines[0]).toContain('Outcomes');
      expect(dataLines[1]).toContain('Roles');
      expect(dataLines[2]).toContain('Business Architecture');
      expect(dataLines[3]).toContain('Information & Data');
      expect(dataLines[4]).toContain('Technology');
    });

    it('should include score values', () => {
      const profile = createProfile('Test State', 'Provider Management', [
        createAreaProfile('Provider Management', 'Provider Enrollment'),
      ]);

      const csv = generateMaturityProfileCsv(profile);

      expect(csv).toContain('Outcomes,3.0,4.0');
      expect(csv).toContain('Roles,2.5,3.5');
    });

    it('should handle multiple capability areas', () => {
      const profile = createProfile('Test State', 'Provider Management', [
        createAreaProfile('Provider Management', 'Provider Enrollment'),
        createAreaProfile('Provider Management', 'Provider Screening'),
      ]);

      const csv = generateMaturityProfileCsv(profile);

      expect(csv).toContain('Capability Area: Provider Enrollment');
      expect(csv).toContain('Capability Area: Provider Screening');
    });

    it('should escape fields with commas', () => {
      const areaProfile = createAreaProfile('Provider Management', 'Provider Enrollment', [
        {
          dimension: 'Outcomes',
          asIs: '3.0',
          toBe: '4.0',
          notes: 'Note with, comma',
          barriers: '',
          plans: '',
        },
      ]);
      const profile = createProfile('Test State', 'Provider Management', [areaProfile]);

      const csv = generateMaturityProfileCsv(profile);

      expect(csv).toContain('"Note with, comma"');
    });

    it('should escape fields with quotes', () => {
      const areaProfile = createAreaProfile('Provider Management', 'Provider Enrollment', [
        {
          dimension: 'Outcomes',
          asIs: '3.0',
          toBe: '4.0',
          notes: 'Note with "quotes"',
          barriers: '',
          plans: '',
        },
      ]);
      const profile = createProfile('Test State', 'Provider Management', [areaProfile]);

      const csv = generateMaturityProfileCsv(profile);

      expect(csv).toContain('"Note with ""quotes"""');
    });

    it('should escape fields with newlines', () => {
      const areaProfile = createAreaProfile('Provider Management', 'Provider Enrollment', [
        {
          dimension: 'Outcomes',
          asIs: '3.0',
          toBe: '4.0',
          notes: 'Note with\nnewline',
          barriers: '',
          plans: '',
        },
      ]);
      const profile = createProfile('Test State', 'Provider Management', [areaProfile]);

      const csv = generateMaturityProfileCsv(profile);

      expect(csv).toContain('"Note with\nnewline"');
    });

    it('should handle empty notes/barriers/plans', () => {
      const areaProfile = createAreaProfile('Provider Management', 'Provider Enrollment', [
        {
          dimension: 'Outcomes',
          asIs: '3.0',
          toBe: '4.0',
          notes: '',
          barriers: '',
          plans: '',
        },
      ]);
      const profile = createProfile('Test State', 'Provider Management', [areaProfile]);

      const csv = generateMaturityProfileCsv(profile);

      expect(csv).toContain('Outcomes,3.0,4.0,,,');
    });
  });

  describe('generateCombinedMaturityProfileCsv', () => {
    it('should combine multiple profiles into one CSV', () => {
      const profiles: MaturityProfile[] = [
        createProfile('Test State', 'Provider Management', [
          createAreaProfile('Provider Management', 'Provider Enrollment'),
        ]),
        createProfile('Test State', 'Member Management', [
          createAreaProfile('Member Management', 'Member Enrollment'),
        ]),
      ];

      const csv = generateCombinedMaturityProfileCsv(profiles, 'Test State');

      expect(csv).toContain('MITA 4.0 Maturity Profile: Test State');
      expect(csv).toContain('Capability Domain: Provider Management');
      expect(csv).toContain('Capability Domain: Member Management');
      expect(csv).toContain('Capability Area: Provider Enrollment');
      expect(csv).toContain('Capability Area: Member Enrollment');
    });

    it('should use provided state name', () => {
      const profiles: MaturityProfile[] = [
        createProfile('Original State', 'Provider Management', [
          createAreaProfile('Provider Management', 'Provider Enrollment'),
        ]),
      ];

      const csv = generateCombinedMaturityProfileCsv(profiles, 'Override State');

      expect(csv).toContain('MITA 4.0 Maturity Profile: Override State');
    });

    it('should handle empty profiles array', () => {
      const csv = generateCombinedMaturityProfileCsv([], 'Test State');

      expect(csv).toContain('MITA 4.0 Maturity Profile: Test State');
      // Should just have header and blank line
      const lines = csv.split('\n').filter((l) => l.trim() !== '' && l !== ',,,,,');
      expect(lines.length).toBe(1);
    });
  });

  describe('parseMaturityProfileCsv', () => {
    it('should parse a valid CSV back to MaturityProfile', () => {
      const originalProfile = createProfile('Test State', 'Provider Management', [
        createAreaProfile('Provider Management', 'Provider Enrollment'),
      ]);

      const csv = generateMaturityProfileCsv(originalProfile);
      const parsed = parseMaturityProfileCsv(csv);

      expect(parsed).not.toBeNull();
      expect(parsed?.stateName).toBe('Test State');
      expect(parsed?.areas.length).toBe(1);
      expect(parsed?.areas[0]?.areaName).toBe('Provider Enrollment');
    });

    it('should parse dimension rows correctly', () => {
      const originalProfile = createProfile('Test State', 'Provider Management', [
        createAreaProfile('Provider Management', 'Provider Enrollment'),
      ]);

      const csv = generateMaturityProfileCsv(originalProfile);
      const parsed = parseMaturityProfileCsv(csv);

      expect(parsed?.areas[0]?.rows.length).toBe(5);
      const outcomesRow = parsed?.areas[0]?.rows.find((r) => r.dimension === 'Outcomes');
      expect(outcomesRow?.asIs).toBe('3.0');
      expect(outcomesRow?.toBe).toBe('4.0');
      expect(outcomesRow?.notes).toBe('Test notes');
    });

    it('should handle multiple areas', () => {
      const originalProfile = createProfile('Test State', 'Provider Management', [
        createAreaProfile('Provider Management', 'Provider Enrollment'),
        createAreaProfile('Provider Management', 'Provider Screening'),
      ]);

      const csv = generateMaturityProfileCsv(originalProfile);
      const parsed = parseMaturityProfileCsv(csv);

      expect(parsed?.areas.length).toBe(2);
      expect(parsed?.areas[0]?.areaName).toBe('Provider Enrollment');
      expect(parsed?.areas[1]?.areaName).toBe('Provider Screening');
    });

    it('should return null for invalid CSV', () => {
      const result = parseMaturityProfileCsv('invalid csv content');
      expect(result).toBeNull();
    });

    it('should return null for empty CSV', () => {
      const result = parseMaturityProfileCsv('');
      expect(result).toBeNull();
    });

    it('should return null for CSV with only headers', () => {
      const result = parseMaturityProfileCsv('MITA 4.0 Maturity Profile: Test\n,,,,,');
      expect(result).toBeNull();
    });

    it('should handle quoted fields with commas', () => {
      const areaProfile = createAreaProfile('Provider Management', 'Provider Enrollment', [
        {
          dimension: 'Outcomes',
          asIs: '3.0',
          toBe: '4.0',
          notes: 'Note with, comma',
          barriers: '',
          plans: '',
        },
      ]);
      const profile = createProfile('Test State', 'Provider Management', [areaProfile]);

      const csv = generateMaturityProfileCsv(profile);
      const parsed = parseMaturityProfileCsv(csv);

      expect(parsed?.areas[0]?.rows[0]?.notes).toBe('Note with, comma');
    });

    it('should handle quoted fields with escaped quotes', () => {
      const areaProfile = createAreaProfile('Provider Management', 'Provider Enrollment', [
        {
          dimension: 'Outcomes',
          asIs: '3.0',
          toBe: '4.0',
          notes: 'Note with "quotes"',
          barriers: '',
          plans: '',
        },
      ]);
      const profile = createProfile('Test State', 'Provider Management', [areaProfile]);

      const csv = generateMaturityProfileCsv(profile);
      const parsed = parseMaturityProfileCsv(csv);

      expect(parsed?.areas[0]?.rows[0]?.notes).toBe('Note with "quotes"');
    });

    it('should extract state name from header', () => {
      const csv = `MITA 4.0 Maturity Profile: California,,,,,
,,,,,
Capability Domain: Test Domain,,,,,
Capability Area: Test Area,,,,,
ORBIT,As Is,To Be,Notes,Barriers & Challenges,Advancement Plans
Outcomes,3.0,4.0,,,`;

      const parsed = parseMaturityProfileCsv(csv);

      expect(parsed?.stateName).toBe('California');
    });
  });

  describe('round-trip parsing', () => {
    it('should preserve data through generate -> parse cycle', () => {
      const original = createProfile('Round Trip State', 'Test Domain', [
        createAreaProfile('Test Domain', 'Test Area', [
          {
            dimension: 'Outcomes',
            asIs: '2.5',
            toBe: '4.0',
            notes: 'Important notes here',
            barriers: 'Some barriers',
            plans: 'Future plans',
          },
          {
            dimension: 'Roles',
            asIs: '3.0',
            toBe: '3.5',
            notes: '',
            barriers: '',
            plans: '',
          },
          {
            dimension: 'Business Architecture',
            asIs: '4.0',
            toBe: '5.0',
            notes: 'BA specific',
            barriers: '',
            plans: '',
          },
          {
            dimension: 'Information & Data',
            asIs: '2.0',
            toBe: '3.0',
            notes: '',
            barriers: 'Data challenges',
            plans: '',
          },
          {
            dimension: 'Technology',
            asIs: '3.5',
            toBe: '4.5',
            notes: '',
            barriers: '',
            plans: 'Tech roadmap',
          },
        ]),
      ]);

      const csv = generateMaturityProfileCsv(original);
      const parsed = parseMaturityProfileCsv(csv);

      expect(parsed?.stateName).toBe('Round Trip State');
      expect(parsed?.areas[0]?.domainName).toBe('Test Domain');
      expect(parsed?.areas[0]?.areaName).toBe('Test Area');

      const rows = parsed?.areas[0]?.rows ?? [];
      expect(rows.length).toBe(5);

      const outcomes = rows.find((r) => r.dimension === 'Outcomes');
      expect(outcomes?.asIs).toBe('2.5');
      expect(outcomes?.toBe).toBe('4.0');
      expect(outcomes?.notes).toBe('Important notes here');
      expect(outcomes?.barriers).toBe('Some barriers');
      expect(outcomes?.plans).toBe('Future plans');
    });
  });
});
