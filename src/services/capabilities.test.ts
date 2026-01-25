/**
 * Tests for Capability Data Service
 */

import { describe, it, expect } from 'vitest';
import {
  getCapabilityModel,
  getAllDomains,
  getDomainById,
  getDomainByName,
  getDomainsByLayer,
  getAllAreas,
  getAreasByDomainId,
  getCategoriesByDomainId,
  getAreaById,
  getAreaWithDomain,
  getDomainForArea,
  getTotalAreaCount,
  getTotalDomainCount,
  searchAreas,
  getCapabilityModelVersion,
} from './capabilities';
import { isCategorizedDomain } from '../types';

describe('capabilities service', () => {
  describe('getCapabilityModel', () => {
    it('should return the complete capability model', () => {
      const model = getCapabilityModel();
      expect(model).toBeDefined();
      expect(model.version).toBe('4.0');
      expect(model.domains).toBeInstanceOf(Array);
      expect(model.domains.length).toBeGreaterThan(0);
    });
  });

  describe('getAllDomains', () => {
    it('should return all capability domains', () => {
      const domains = getAllDomains();
      expect(domains).toBeInstanceOf(Array);
      expect(domains.length).toBe(14);
    });

    it('should have required properties on each domain', () => {
      const domains = getAllDomains();
      for (const domain of domains) {
        expect(domain.id).toBeDefined();
        expect(domain.name).toBeDefined();
        expect(domain.description).toBeDefined();
        expect(domain.layer).toBeDefined();
        // Either areas or categories must exist
        expect(
          ('areas' in domain && Array.isArray(domain.areas)) ||
            ('categories' in domain && Array.isArray(domain.categories))
        ).toBe(true);
      }
    });
  });

  describe('getDomainsByLayer', () => {
    it('should return strategic domains', () => {
      const domains = getDomainsByLayer('strategic');
      expect(domains.length).toBe(2);
      expect(domains.every((d) => d.layer === 'strategic')).toBe(true);
    });

    it('should return core domains', () => {
      const domains = getDomainsByLayer('core');
      expect(domains.length).toBe(8);
      expect(domains.every((d) => d.layer === 'core')).toBe(true);
    });

    it('should return support domains', () => {
      const domains = getDomainsByLayer('support');
      expect(domains.length).toBe(4);
      expect(domains.every((d) => d.layer === 'support')).toBe(true);
    });
  });

  describe('getDomainById', () => {
    it('should return domain when found', () => {
      const domain = getDomainById('provider-management');
      expect(domain).toBeDefined();
      expect(domain?.name).toBe('Provider Management');
    });

    it('should return undefined when not found', () => {
      const domain = getDomainById('non-existent');
      expect(domain).toBeUndefined();
    });
  });

  describe('getDomainByName', () => {
    it('should return domain when found (case-insensitive)', () => {
      const domain = getDomainByName('PROVIDER MANAGEMENT');
      expect(domain).toBeDefined();
      expect(domain?.id).toBe('provider-management');
    });

    it('should return undefined when not found', () => {
      const domain = getDomainByName('Non Existent Domain');
      expect(domain).toBeUndefined();
    });
  });

  describe('getAllAreas', () => {
    it('should return all capability areas including from categorized domains', () => {
      const areas = getAllAreas();
      expect(areas).toBeInstanceOf(Array);
      expect(areas.length).toBe(75);
    });

    it('should have required properties on each area', () => {
      const areas = getAllAreas();
      for (const area of areas) {
        expect(area.id).toBeDefined();
        expect(area.name).toBeDefined();
        expect(area.description).toBeDefined();
        expect(area.topics).toBeInstanceOf(Array);
      }
    });
  });

  describe('getAreasByDomainId', () => {
    it('should return areas for a standard domain', () => {
      const areas = getAreasByDomainId('provider-management');
      expect(areas).toBeInstanceOf(Array);
      expect(areas.length).toBe(4);
    });

    it('should return areas for a categorized domain (flattened)', () => {
      const areas = getAreasByDomainId('data-management');
      expect(areas).toBeInstanceOf(Array);
      expect(areas.length).toBe(11); // 4 foundational + 7 lifecycle
    });

    it('should return empty array for invalid domain', () => {
      const areas = getAreasByDomainId('non-existent');
      expect(areas).toEqual([]);
    });
  });

  describe('getCategoriesByDomainId', () => {
    it('should return categories for a categorized domain', () => {
      const categories = getCategoriesByDomainId('data-management');
      expect(categories.length).toBe(2);
      expect(categories[0]?.id).toBe('foundational');
      expect(categories[1]?.id).toBe('lifecycle');
    });

    it('should return categories for technical domain', () => {
      const categories = getCategoriesByDomainId('technical');
      expect(categories.length).toBe(7);
    });

    it('should return empty array for standard domain', () => {
      const categories = getCategoriesByDomainId('provider-management');
      expect(categories).toEqual([]);
    });
  });

  describe('getAreaById', () => {
    it('should return area when found in standard domain', () => {
      const area = getAreaById('provider-enrollment');
      expect(area).toBeDefined();
      expect(area?.name).toBe('Provider Enrollment');
    });

    it('should return area when found in categorized domain', () => {
      const area = getAreaById('data-governance');
      expect(area).toBeDefined();
      expect(area?.name).toBe('Data Governance');
    });

    it('should return undefined when not found', () => {
      const area = getAreaById('non-existent');
      expect(area).toBeUndefined();
    });
  });

  describe('getAreaWithDomain', () => {
    it('should return area with its parent domain for standard domain', () => {
      const result = getAreaWithDomain('provider-enrollment');
      expect(result).toBeDefined();
      expect(result?.area.id).toBe('provider-enrollment');
      expect(result?.domain.id).toBe('provider-management');
      expect(result?.category).toBeUndefined();
    });

    it('should return area with domain and category for categorized domain', () => {
      const result = getAreaWithDomain('data-governance');
      expect(result).toBeDefined();
      expect(result?.area.id).toBe('data-governance');
      expect(result?.domain.id).toBe('data-management');
      expect(result?.category?.id).toBe('foundational');
    });

    it('should return undefined when area not found', () => {
      const result = getAreaWithDomain('non-existent');
      expect(result).toBeUndefined();
    });
  });

  describe('getDomainForArea', () => {
    it('should return parent domain for an area in standard domain', () => {
      const domain = getDomainForArea('provider-enrollment');
      expect(domain).toBeDefined();
      expect(domain?.id).toBe('provider-management');
    });

    it('should return parent domain for an area in categorized domain', () => {
      const domain = getDomainForArea('data-governance');
      expect(domain).toBeDefined();
      expect(domain?.id).toBe('data-management');
    });

    it('should return undefined when area not found', () => {
      const domain = getDomainForArea('non-existent');
      expect(domain).toBeUndefined();
    });
  });

  describe('getTotalAreaCount', () => {
    it('should return total count of all areas', () => {
      const count = getTotalAreaCount();
      expect(count).toBe(75);
    });
  });

  describe('getTotalDomainCount', () => {
    it('should return total count of all domains', () => {
      const count = getTotalDomainCount();
      expect(count).toBe(14);
    });
  });

  describe('searchAreas', () => {
    it('should find areas by name', () => {
      const results = searchAreas('provider');
      expect(results.length).toBeGreaterThan(0);
      expect(results.some((r) => r.area.id === 'provider-enrollment')).toBe(true);
    });

    it('should find areas by description', () => {
      const results = searchAreas('enrollment');
      expect(results.length).toBeGreaterThan(0);
    });

    it('should find areas by topics', () => {
      const results = searchAreas('HIPAA');
      expect(results.length).toBeGreaterThan(0);
    });

    it('should be case-insensitive', () => {
      const results = searchAreas('PROVIDER');
      expect(results.length).toBeGreaterThan(0);
    });

    it('should return empty array when no matches', () => {
      const results = searchAreas('xyznonexistent');
      expect(results).toEqual([]);
    });

    it('should include category for areas in categorized domains', () => {
      const results = searchAreas('data governance');
      const dataGovResult = results.find((r) => r.area.id === 'data-governance');
      expect(dataGovResult).toBeDefined();
      expect(dataGovResult?.category?.id).toBe('foundational');
    });
  });

  describe('getCapabilityModelVersion', () => {
    it('should return the model version', () => {
      const version = getCapabilityModelVersion();
      expect(version).toBe('4.0');
    });
  });

  describe('categorized domains', () => {
    it('should correctly identify Data Management as categorized', () => {
      const domain = getDomainById('data-management');
      expect(domain).toBeDefined();
      expect(isCategorizedDomain(domain!)).toBe(true);
    });

    it('should correctly identify Technical as categorized', () => {
      const domain = getDomainById('technical');
      expect(domain).toBeDefined();
      expect(isCategorizedDomain(domain!)).toBe(true);
    });

    it('should correctly identify Provider Management as standard', () => {
      const domain = getDomainById('provider-management');
      expect(domain).toBeDefined();
      expect(isCategorizedDomain(domain!)).toBe(false);
    });
  });
});
