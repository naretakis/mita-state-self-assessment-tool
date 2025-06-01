import { CapabilityDefinition } from '../types';
import { memoryCache, CACHE_DURATIONS } from './cacheUtils';

/**
 * Client-side utility for loading capability content
 * Fetches capability definitions from content files and caches them
 *
 * @param capabilityId - ID of the capability to load
 * @returns Promise resolving to the capability definition or null if not found
 */
export async function loadCapabilityContent(
  capabilityId: string
): Promise<CapabilityDefinition | null> {
  // Check cache first
  const cachedCapability = memoryCache.get<CapabilityDefinition>(`capability-${capabilityId}`);
  if (cachedCapability) {
    return cachedCapability;
  }

  try {
    // Fetch the content file
    const response = await fetch(`/content/${capabilityId}.md`);
    if (!response.ok) {
      throw new Error(`Failed to load capability: ${response.status}`);
    }

    const content = await response.text();

    // Use dynamic import to load the parser only when needed
    const { parseCapabilityMarkdown } = await import('./markdownParser');
    const capability = parseCapabilityMarkdown(content);

    // Cache the result
    memoryCache.set(`capability-${capabilityId}`, capability, CACHE_DURATIONS.MEDIUM);

    return capability;
  } catch (error) {
    console.error(`Error loading capability ${capabilityId}:`, error);
    return null;
  }
}

/**
 * Load multiple capabilities at once
 *
 * @param capabilityIds - Array of capability IDs to load
 * @returns Promise resolving to an array of capability definitions
 */
export async function loadMultipleCapabilities(
  capabilityIds: string[]
): Promise<CapabilityDefinition[]> {
  const promises = capabilityIds.map(id => loadCapabilityContent(id));
  const results = await Promise.all(promises);
  return results.filter((capability): capability is CapabilityDefinition => capability !== null);
}

export default { loadCapabilityContent, loadMultipleCapabilities };
