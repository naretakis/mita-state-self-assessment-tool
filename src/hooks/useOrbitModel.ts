/**
 * useOrbitModel Hook
 *
 * React hook for loading and accessing the ORBIT maturity model.
 * Provides loading state, error handling, and memoized accessors.
 */

import { useCallback, useEffect, useMemo, useState } from 'react';

import orbitMaturityService from '../services/OrbitMaturityService';

import type {
  OrbitAspect,
  OrbitDimensionDefinition,
  OrbitDimensionId,
  OrbitMaturityModel,
  TechnologyDimension,
  TechnologySubDomain,
  TechnologySubDomainId,
} from '../types/orbit';

// =============================================================================
// Hook Return Types
// =============================================================================

export interface UseOrbitModelReturn {
  /** The complete ORBIT model, null if not loaded */
  model: OrbitMaturityModel | null;
  /** Loading state */
  loading: boolean;
  /** Error if loading failed */
  error: Error | null;
  /** Reload the model (clears cache first) */
  reload: () => Promise<void>;
  /** Get a specific dimension */
  getDimension: (
    dimensionId: OrbitDimensionId
  ) => OrbitDimensionDefinition | TechnologyDimension | null;
  /** Get a Technology sub-domain */
  getTechnologySubDomain: (subDomainId: TechnologySubDomainId) => TechnologySubDomain | null;
  /** Get aspects for a non-Technology dimension */
  getAspects: (dimensionId: Exclude<OrbitDimensionId, 'technology'>) => OrbitAspect[];
  /** Get aspects for a Technology sub-domain */
  getTechnologyAspects: (subDomainId: TechnologySubDomainId) => OrbitAspect[];
  /** Get dimension summary for navigation */
  dimensionSummary: DimensionSummaryItem[];
}

export interface DimensionSummaryItem {
  id: OrbitDimensionId;
  name: string;
  required: boolean;
  aspectCount: number;
  subDomains?: Array<{
    id: TechnologySubDomainId;
    name: string;
    aspectCount: number;
  }>;
}

// =============================================================================
// Hook Implementation
// =============================================================================

export function useOrbitModel(): UseOrbitModelReturn {
  const [model, setModel] = useState<OrbitMaturityModel | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Load the model on mount
  useEffect(() => {
    let mounted = true;

    const loadModel = async () => {
      try {
        setLoading(true);
        setError(null);
        const loadedModel = await orbitMaturityService.loadModel();
        if (mounted) {
          setModel(loadedModel);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Failed to load ORBIT model'));
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadModel();

    return () => {
      mounted = false;
    };
  }, []);

  // Reload function
  const reload = useCallback(async () => {
    orbitMaturityService.clearCache();
    setLoading(true);
    setError(null);

    try {
      const loadedModel = await orbitMaturityService.loadModel();
      setModel(loadedModel);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to reload ORBIT model'));
    } finally {
      setLoading(false);
    }
  }, []);

  // Get dimension by ID
  const getDimension = useCallback(
    (dimensionId: OrbitDimensionId): OrbitDimensionDefinition | TechnologyDimension | null => {
      if (!model) {
        return null;
      }

      switch (dimensionId) {
        case 'outcomes':
          return model.outcomes;
        case 'roles':
          return model.roles;
        case 'business':
          return model.business;
        case 'information':
          return model.information;
        case 'technology':
          return model.technology;
        default:
          return null;
      }
    },
    [model]
  );

  // Get Technology sub-domain
  const getTechnologySubDomain = useCallback(
    (subDomainId: TechnologySubDomainId): TechnologySubDomain | null => {
      if (!model) {
        return null;
      }
      return model.technology.subDomains.find(sd => sd.id === subDomainId) || null;
    },
    [model]
  );

  // Get aspects for a non-Technology dimension
  const getAspects = useCallback(
    (dimensionId: Exclude<OrbitDimensionId, 'technology'>): OrbitAspect[] => {
      if (!model) {
        return [];
      }

      const dimension = getDimension(dimensionId) as OrbitDimensionDefinition | null;
      return dimension?.aspects || [];
    },
    [model, getDimension]
  );

  // Get aspects for a Technology sub-domain
  const getTechnologyAspects = useCallback(
    (subDomainId: TechnologySubDomainId): OrbitAspect[] => {
      const subDomain = getTechnologySubDomain(subDomainId);
      if (!subDomain) {
        return [];
      }
      return subDomain.aspects;
    },
    [getTechnologySubDomain]
  );

  // Memoized dimension summary
  const dimensionSummary = useMemo<DimensionSummaryItem[]>(() => {
    if (!model) {
      return [];
    }

    return [
      {
        id: 'outcomes' as OrbitDimensionId,
        name: model.outcomes.name,
        required: model.outcomes.required,
        aspectCount: model.outcomes.aspects.length,
      },
      {
        id: 'roles' as OrbitDimensionId,
        name: model.roles.name,
        required: model.roles.required,
        aspectCount: model.roles.aspects.length,
      },
      {
        id: 'business' as OrbitDimensionId,
        name: model.business.name,
        required: model.business.required,
        aspectCount: model.business.aspects.length,
      },
      {
        id: 'information' as OrbitDimensionId,
        name: model.information.name,
        required: model.information.required,
        aspectCount: model.information.aspects.length,
      },
      {
        id: 'technology' as OrbitDimensionId,
        name: model.technology.name,
        required: model.technology.required,
        aspectCount: model.technology.subDomains.reduce((sum, sd) => sum + sd.aspects.length, 0),
        subDomains: model.technology.subDomains.map(sd => ({
          id: sd.id,
          name: sd.name,
          aspectCount: sd.aspects.length,
        })),
      },
    ];
  }, [model]);

  return {
    model,
    loading,
    error,
    reload,
    getDimension,
    getTechnologySubDomain,
    getAspects,
    getTechnologyAspects,
    dimensionSummary,
  };
}

// =============================================================================
// Additional Specialized Hooks
// =============================================================================

/**
 * Hook for accessing a specific dimension
 */
export function useOrbitDimension(dimensionId: OrbitDimensionId) {
  const { loading, error, getDimension } = useOrbitModel();

  const dimension = useMemo(() => {
    return getDimension(dimensionId);
  }, [getDimension, dimensionId]);

  return { dimension, loading, error };
}

/**
 * Hook for accessing a specific Technology sub-domain
 */
export function useTechnologySubDomain(subDomainId: TechnologySubDomainId) {
  const { loading, error, getTechnologySubDomain } = useOrbitModel();

  const subDomain = useMemo(() => {
    return getTechnologySubDomain(subDomainId);
  }, [getTechnologySubDomain, subDomainId]);

  return { subDomain, loading, error };
}

/**
 * Hook for getting all Technology sub-domains
 */
export function useTechnologySubDomains() {
  const { model, loading, error } = useOrbitModel();

  const subDomains = useMemo(() => {
    if (!model) {
      return [];
    }
    return model.technology.subDomains;
  }, [model]);

  return { subDomains, loading, error };
}

export default useOrbitModel;
