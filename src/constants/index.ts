/**
 * Application Constants
 *
 * Centralized constants to eliminate magic numbers and strings throughout the codebase.
 * Organized by category for easy discovery and maintenance.
 */

// =============================================================================
// External Links
// =============================================================================

/**
 * GitHub repository URL.
 * Can be overridden via VITE_GITHUB_REPO_URL environment variable.
 */
export const GITHUB_REPO_URL =
  import.meta.env.VITE_GITHUB_REPO_URL ||
  'https://github.com/naretakis/mita-state-self-assessment-tool';

// =============================================================================
// Maturity Score Thresholds
// =============================================================================

/**
 * Thresholds for categorizing maturity scores into quality levels.
 * Used by getScoreColor and other score-related utilities.
 */
export const MATURITY_THRESHOLDS = {
  /** Score >= 4 is considered excellent */
  EXCELLENT: 4,
  /** Score >= 3 is considered good */
  GOOD: 3,
  /** Score >= 2 is considered developing */
  DEVELOPING: 2,
} as const;

// =============================================================================
// UI Constants
// =============================================================================

/**
 * User interface constants for consistent behavior across components.
 */
export const UI = {
  /** Maximum number of tags to display before showing "+N more" */
  TAGS_MAX_VISIBLE: 3,
  /** Debounce delay in milliseconds for text input auto-save */
  DEBOUNCE_MS: 300,
  /** Stripe pattern dimensions for progress bars */
  STRIPE_PATTERN: {
    ANGLE: -45,
    WIDTH: 4,
    TOTAL: 8,
  },
} as const;
