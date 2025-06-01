/**
 * Utility function to get the correct base path for the application
 * This handles different deployment environments including multi-branch deployments
 */
export function getBasePath(): string {
  // Use environment variable if available (set during build time)
  if (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_BASE_PATH) {
    return process.env.NEXT_PUBLIC_BASE_PATH;
  }
  
  // Default production path for main branch
  if (typeof process !== 'undefined' && process.env.NODE_ENV === 'production') {
    return '/mita-state-self-assessment-tool';
  }
  
  // Empty string for development environment
  return '';
}

/**
 * Get the full URL for an asset, including the base path
 * @param path - The relative path to the asset
 * @returns The full URL with base path
 */
export function getAssetPath(path: string): string {
  const basePath = getBasePath();
  // Ensure path starts with / and doesn't duplicate with basePath
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${basePath}${normalizedPath}`;
}