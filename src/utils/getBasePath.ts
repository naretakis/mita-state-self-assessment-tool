/**
 * Utility function to get the correct base path for assets
 * This is important for multi-branch deployments where the base path changes
 */
export function getBasePath(): string {
  // In the browser
  if (typeof window !== 'undefined') {
    const path = window.location.pathname;
    const repoName = 'mita-state-self-assessment-tool';
    
    // Find the repository name in the path
    const repoIndex = path.indexOf(repoName);
    
    if (repoIndex !== -1) {
      // Get everything after the repo name
      const pathAfterRepo = path.substring(repoIndex + repoName.length);
      
      // Check if this is a branch path
      const segments = pathAfterRepo.split('/').filter(Boolean);
      if (segments.length > 0) {
        const branchName = segments[0];
        // Return the branch-specific base path
        return `/${repoName}/${branchName}`;
      }
      // Return the main branch base path
      return `/${repoName}`;
    }
  }
  
  // Default to empty string for local development
  return '';
}