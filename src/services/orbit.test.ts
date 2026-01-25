/**
 * Tests for ORBIT Model Service
 */

import { describe, it, expect } from 'vitest';
import {
  getOrbitModel,
  getOrbitModelVersion,
  getAllDimensionIds,
  getRequiredDimensionIds,
  getOptionalDimensionIds,
  getDimension,
  getStandardDimensions,
  getTechnologyDimension,
  getTechnologySubDimensions,
  getTechnologySubDimension,
  getAspectsForDimension,
  getAspectsForSubDimension,
  getAspect,
  getMaturityLevelMeta,
  getAllMaturityLevels,
  getTotalAspectCount,
  getAspectCountForDimension,
  getRequiredAspectCount,
  isDimensionRequired,
  getSubDimensionForAspect,
  getAspectIdsForDimension,
  getAspectLocation,
} from './orbit';

describe('orbit service', () => {
  describe('getOrbitModel', () => {
    it('should return the complete ORBIT model', () => {
      const model = getOrbitModel();
      expect(model).toBeDefined();
      expect(model.version).toBe('4.0');
      expect(model.dimensions).toBeDefined();
    });
  });

  describe('getOrbitModelVersion', () => {
    it('should return the model version', () => {
      const version = getOrbitModelVersion();
      expect(version).toBe('4.0');
    });
  });

  describe('getAllDimensionIds', () => {
    it('should return all five dimension IDs', () => {
      const ids = getAllDimensionIds();
      expect(ids).toEqual([
        'outcomes',
        'roles',
        'businessArchitecture',
        'informationData',
        'technology',
      ]);
    });
  });

  describe('getRequiredDimensionIds', () => {
    it('should return required dimension IDs', () => {
      const ids = getRequiredDimensionIds();
      expect(ids).toEqual(['businessArchitecture', 'informationData', 'technology']);
    });
  });

  describe('getOptionalDimensionIds', () => {
    it('should return optional dimension IDs', () => {
      const ids = getOptionalDimensionIds();
      expect(ids).toEqual(['outcomes', 'roles']);
    });
  });

  describe('getDimension', () => {
    it('should return a standard dimension', () => {
      const dimension = getDimension('outcomes');
      expect(dimension).toBeDefined();
      expect(dimension?.name).toBe('Outcomes');
      expect(dimension?.required).toBe(false);
    });

    it('should return the technology dimension', () => {
      const dimension = getDimension('technology');
      expect(dimension).toBeDefined();
      expect(dimension?.name).toBe('Technology');
      expect(dimension?.required).toBe(true);
    });
  });

  describe('getStandardDimensions', () => {
    it('should return four standard dimensions', () => {
      const dimensions = getStandardDimensions();
      expect(dimensions.length).toBe(4);
      expect(dimensions.map((d) => d.id)).toEqual([
        'outcomes',
        'roles',
        'businessArchitecture',
        'informationData',
      ]);
    });
  });

  describe('getTechnologyDimension', () => {
    it('should return the technology dimension with sub-dimensions', () => {
      const tech = getTechnologyDimension();
      expect(tech).toBeDefined();
      expect(tech.id).toBe('technology');
      expect(tech.subDimensions).toBeInstanceOf(Array);
      expect(tech.subDimensions.length).toBe(7);
    });
  });

  describe('getTechnologySubDimensions', () => {
    it('should return all seven technology sub-dimensions', () => {
      const subDimensions = getTechnologySubDimensions();
      expect(subDimensions.length).toBe(7);
    });
  });

  describe('getTechnologySubDimension', () => {
    it('should return a specific sub-dimension', () => {
      const subDim = getTechnologySubDimension('infrastructure');
      expect(subDim).toBeDefined();
      expect(subDim?.name).toBe('Infrastructure');
    });

    it('should return undefined for invalid sub-dimension', () => {
      const subDim = getTechnologySubDimension('invalid' as never);
      expect(subDim).toBeUndefined();
    });
  });

  describe('getAspectsForDimension', () => {
    it('should return aspects for a standard dimension', () => {
      const aspects = getAspectsForDimension('outcomes');
      expect(aspects.length).toBe(6);
    });

    it('should return all aspects for technology dimension', () => {
      const aspects = getAspectsForDimension('technology');
      expect(aspects.length).toBeGreaterThan(0);
    });

    it('should return empty array for invalid dimension', () => {
      const aspects = getAspectsForDimension('invalid' as never);
      expect(aspects).toEqual([]);
    });
  });

  describe('getAspectsForSubDimension', () => {
    it('should return aspects for a technology sub-dimension', () => {
      const aspects = getAspectsForSubDimension('infrastructure');
      expect(aspects.length).toBeGreaterThan(0);
    });
  });

  describe('getAspect', () => {
    it('should return an aspect from a standard dimension', () => {
      const aspect = getAspect('outcomes', 'culture-mindset');
      expect(aspect).toBeDefined();
      expect(aspect?.name).toBe('Culture & Mindset');
    });

    it('should return an aspect from a technology sub-dimension', () => {
      const aspect = getAspect('technology', 'compute-hosting', 'infrastructure');
      expect(aspect).toBeDefined();
    });

    it('should return undefined for invalid aspect', () => {
      const aspect = getAspect('outcomes', 'invalid');
      expect(aspect).toBeUndefined();
    });
  });

  describe('getMaturityLevelMeta', () => {
    it('should return metadata for a maturity level', () => {
      const meta = getMaturityLevelMeta('level1');
      expect(meta).toBeDefined();
      expect(meta.name).toBe('Initial');
    });

    it('should return metadata for N/A', () => {
      const meta = getMaturityLevelMeta('notApplicable');
      expect(meta).toBeDefined();
      expect(meta.name).toBe('Not Applicable');
    });
  });

  describe('getAllMaturityLevels', () => {
    it('should return all maturity level metadata', () => {
      const levels = getAllMaturityLevels();
      expect(levels.level1).toBeDefined();
      expect(levels.level2).toBeDefined();
      expect(levels.level3).toBeDefined();
      expect(levels.level4).toBeDefined();
      expect(levels.level5).toBeDefined();
      expect(levels.notApplicable).toBeDefined();
    });
  });

  describe('getTotalAspectCount', () => {
    it('should return total count of all aspects', () => {
      const count = getTotalAspectCount();
      expect(count).toBeGreaterThan(40); // Should be around 52
    });
  });

  describe('getAspectCountForDimension', () => {
    it('should return aspect count for outcomes', () => {
      const count = getAspectCountForDimension('outcomes');
      expect(count).toBe(6);
    });

    it('should return aspect count for roles', () => {
      const count = getAspectCountForDimension('roles');
      expect(count).toBe(6);
    });

    it('should return aspect count for technology (all sub-dimensions)', () => {
      const count = getAspectCountForDimension('technology');
      expect(count).toBeGreaterThan(15);
    });
  });

  describe('getRequiredAspectCount', () => {
    it('should return count of aspects in required dimensions only', () => {
      const count = getRequiredAspectCount();
      const businessCount = getAspectCountForDimension('businessArchitecture');
      const infoCount = getAspectCountForDimension('informationData');
      const techCount = getAspectCountForDimension('technology');
      expect(count).toBe(businessCount + infoCount + techCount);
    });
  });

  describe('isDimensionRequired', () => {
    it('should return false for outcomes', () => {
      expect(isDimensionRequired('outcomes')).toBe(false);
    });

    it('should return false for roles', () => {
      expect(isDimensionRequired('roles')).toBe(false);
    });

    it('should return true for businessArchitecture', () => {
      expect(isDimensionRequired('businessArchitecture')).toBe(true);
    });

    it('should return true for informationData', () => {
      expect(isDimensionRequired('informationData')).toBe(true);
    });

    it('should return true for technology', () => {
      expect(isDimensionRequired('technology')).toBe(true);
    });
  });

  describe('getSubDimensionForAspect', () => {
    it('should return sub-dimension for a technology aspect', () => {
      const subDim = getSubDimensionForAspect('compute-hosting');
      expect(subDim).toBeDefined();
      expect(subDim?.id).toBe('infrastructure');
    });

    it('should return undefined for non-technology aspect', () => {
      const subDim = getSubDimensionForAspect('culture-mindset');
      expect(subDim).toBeUndefined();
    });
  });

  describe('getAspectIdsForDimension', () => {
    it('should return aspect IDs for a dimension', () => {
      const ids = getAspectIdsForDimension('outcomes');
      expect(ids.length).toBe(6);
      expect(ids).toContain('culture-mindset');
    });
  });

  describe('getAspectLocation', () => {
    it('should return location for a standard dimension aspect', () => {
      const location = getAspectLocation('culture-mindset');
      expect(location).toBeDefined();
      expect(location?.dimensionId).toBe('outcomes');
      expect(location?.subDimensionId).toBeUndefined();
    });

    it('should return location for a technology aspect', () => {
      const location = getAspectLocation('compute-hosting');
      expect(location).toBeDefined();
      expect(location?.dimensionId).toBe('technology');
      expect(location?.subDimensionId).toBe('infrastructure');
    });

    it('should return undefined for invalid aspect', () => {
      const location = getAspectLocation('invalid');
      expect(location).toBeUndefined();
    });
  });
});
