/**
 * useCapabilities Hook
 *
 * React hooks for accessing capability definitions from the CapabilityService.
 * Works with the new ORBIT-compatible simplified capability format.
 */

import { useCallback, useEffect, useState } from 'react';

import capabilityService from '../services/CapabilityService';

import type { CapabilityDomain, CapabilityMetadata } from '../types/orbit';

// =============================================================================
// Hook: useCapabilities
// =============================================================================

interface UseCapabilitiesResult {
  domains: CapabilityDomain[];
  capabilities: CapabilityMetadata[];
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
}

/**
 * Hook to load all capability domains and areas
 */
export function useCapabilities(): UseCapabilitiesResult {
  const [domains, setDomains] = useState<CapabilityDomain[]>([]);
  const [capabilities, setCapabilities] = useState<CapabilityMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [loadedDomains, loadedCapabilities] = await Promise.all([
        capabilityService.getAllDomains(),
        capabilityService.getAllCapabilities(),
      ]);

      setDomains(loadedDomains);
      setCapabilities(loadedCapabilities);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load capabilities'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    domains,
    capabilities,
    loading,
    error,
    refresh: loadData,
  };
}

// =============================================================================
// Hook: useCapability
// =============================================================================

interface UseCapabilityResult {
  capability: CapabilityMetadata | null;
  loading: boolean;
  error: Error | null;
}

/**
 * Hook to load a single capability by ID
 */
export function useCapability(capabilityId: string | null): UseCapabilityResult {
  const [capability, setCapability] = useState<CapabilityMetadata | null>(null);
  const [loading, setLoading] = useState(!!capabilityId);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!capabilityId) {
      setCapability(null);
      setLoading(false);
      return;
    }

    let cancelled = false;

    const loadCapability = async () => {
      setLoading(true);
      setError(null);

      try {
        const loaded = await capabilityService.getCapability(capabilityId);
        if (!cancelled) {
          setCapability(loaded);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error('Failed to load capability'));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadCapability();

    return () => {
      cancelled = true;
    };
  }, [capabilityId]);

  return { capability, loading, error };
}

// =============================================================================
// Hook: useCapabilityDomain
// =============================================================================

interface UseCapabilityDomainResult {
  domain: CapabilityDomain | null;
  capabilities: CapabilityMetadata[];
  loading: boolean;
  error: Error | null;
}

/**
 * Hook to load a capability domain and its areas
 */
export function useCapabilityDomain(domainId: string | null): UseCapabilityDomainResult {
  const [domain, setDomain] = useState<CapabilityDomain | null>(null);
  const [capabilities, setCapabilities] = useState<CapabilityMetadata[]>([]);
  const [loading, setLoading] = useState(!!domainId);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!domainId) {
      setDomain(null);
      setCapabilities([]);
      setLoading(false);
      return;
    }

    let cancelled = false;

    const loadDomain = async () => {
      setLoading(true);
      setError(null);

      try {
        const [loadedDomain, loadedCapabilities] = await Promise.all([
          capabilityService.getDomain(domainId),
          capabilityService.getCapabilitiesByDomain(domainId),
        ]);

        if (!cancelled) {
          setDomain(loadedDomain);
          setCapabilities(loadedCapabilities);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error('Failed to load domain'));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadDomain();

    return () => {
      cancelled = true;
    };
  }, [domainId]);

  return { domain, capabilities, loading, error };
}

// =============================================================================
// Hook: useCapabilitySelection
// =============================================================================

interface UseCapabilitySelectionResult {
  domains: CapabilityDomain[];
  selectedDomainId: string | null;
  selectedCapabilityId: string | null;
  selectedDomain: CapabilityDomain | null;
  selectedCapability: CapabilityMetadata | null;
  availableCapabilities: CapabilityMetadata[];
  loading: boolean;
  error: Error | null;
  selectDomain: (domainId: string | null) => void;
  selectCapability: (capabilityId: string | null) => void;
  clearSelection: () => void;
}

/**
 * Hook for managing capability selection (domain -> area workflow)
 */
export function useCapabilitySelection(): UseCapabilitySelectionResult {
  const { domains, loading: domainsLoading, error: domainsError } = useCapabilities();
  const [selectedDomainId, setSelectedDomainId] = useState<string | null>(null);
  const [selectedCapabilityId, setSelectedCapabilityId] = useState<string | null>(null);

  // Derive selected domain
  const selectedDomain = selectedDomainId
    ? domains.find(d => d.id === selectedDomainId) || null
    : null;

  // Derive available capabilities for selected domain
  const availableCapabilities = selectedDomain?.areas || [];

  // Derive selected capability
  const selectedCapability = selectedCapabilityId
    ? availableCapabilities.find(c => c.id === selectedCapabilityId) || null
    : null;

  const selectDomain = useCallback((domainId: string | null) => {
    setSelectedDomainId(domainId);
    setSelectedCapabilityId(null); // Clear capability when domain changes
  }, []);

  const selectCapability = useCallback((capabilityId: string | null) => {
    setSelectedCapabilityId(capabilityId);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedDomainId(null);
    setSelectedCapabilityId(null);
  }, []);

  return {
    domains,
    selectedDomainId,
    selectedCapabilityId,
    selectedDomain,
    selectedCapability,
    availableCapabilities,
    loading: domainsLoading,
    error: domainsError,
    selectDomain,
    selectCapability,
    clearSelection,
  };
}
