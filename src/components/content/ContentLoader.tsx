'use client';

import { useEffect, useState } from 'react';

import capabilityService from '../../services/CapabilityService';

import type { CapabilityDefinition } from '../../types';

interface ContentLoaderProps {
  contentDirectory: string;
  onLoaded?: (capabilities: CapabilityDefinition[]) => void;
  children: (props: ContentLoaderState) => React.ReactNode;
}

interface ContentLoaderState {
  capabilities: CapabilityDefinition[];
  isLoading: boolean;
  error: Error | null;
  getCapability: (id: string) => CapabilityDefinition | null;
  getCapabilitiesByDomain: (domainName: string) => CapabilityDefinition[];
}

/**
 * Create a default dimension definition for ORBIT model
 */
const createDefaultDimension = () => ({
  description: '',
  maturityAssessment: [],
  maturityLevels: {
    level1: 'Level 1 - Initial',
    level2: 'Level 2 - Developing',
    level3: 'Level 3 - Defined',
    level4: 'Level 4 - Managed',
    level5: 'Level 5 - Optimized',
  },
});

/**
 * Component for loading capability content and providing it to child components
 */
export function ContentLoader({ onLoaded, children }: ContentLoaderProps) {
  const [capabilities, setCapabilities] = useState<CapabilityDefinition[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadContent() {
      try {
        setIsLoading(true);
        setError(null);

        const capabilityMetadata = await capabilityService.getAllCapabilities();

        // Convert CapabilityMetadata to CapabilityDefinition format
        const loadedCapabilities: CapabilityDefinition[] = capabilityMetadata.map(cap => ({
          id: cap.id,
          version: cap.version,
          capabilityDomainName: cap.domainName,
          capabilityAreaName: cap.areaName,
          capabilityVersion: cap.version,
          capabilityAreaCreated: cap.createdAt,
          capabilityAreaLastUpdated: cap.updatedAt,
          description: cap.description,
          domainDescription: cap.domainDescription,
          areaDescription: cap.areaDescription,
          dimensions: {
            outcome: createDefaultDimension(),
            role: createDefaultDimension(),
            businessProcess: createDefaultDimension(),
            information: createDefaultDimension(),
            technology: createDefaultDimension(),
          },
        }));

        setCapabilities(loadedCapabilities);

        if (onLoaded) {
          onLoaded(loadedCapabilities);
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load content'));
      } finally {
        setIsLoading(false);
      }
    }

    loadContent();
  }, [onLoaded]);

  const getCapability = (id: string): CapabilityDefinition | null => {
    return capabilities.find(cap => cap.id === id) || null;
  };

  const getCapabilitiesByDomain = (domainName: string): CapabilityDefinition[] => {
    return capabilities.filter(cap => cap.capabilityDomainName === domainName);
  };

  return children({
    capabilities,
    isLoading,
    error,
    getCapability,
    getCapabilitiesByDomain,
  });
}

export default ContentLoader;
