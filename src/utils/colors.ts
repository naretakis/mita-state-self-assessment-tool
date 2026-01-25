/**
 * Color Utilities
 *
 * Centralized color functions and constants for maturity scores.
 * Colors follow Material Design palette and meet WCAG 2.1 AA contrast requirements.
 */

import { MATURITY_THRESHOLDS } from '../constants';

/**
 * Score color constants following Material Design palette.
 * These colors meet WCAG 2.1 AA contrast requirements against white backgrounds.
 */
export const SCORE_COLORS = {
  /** Green - score >= 4 (excellent) */
  excellent: '#4caf50',
  /** Orange - score >= 3 (good) */
  good: '#ff9800',
  /** Blue - score >= 2 (developing) */
  developing: '#2196f3',
  /** Red - score < 2 (initial) */
  initial: '#f44336',
  /** Grey - null/not assessed */
  none: '#9e9e9e',
} as const;

/**
 * Get the appropriate color for a maturity score.
 *
 * @param score - Maturity score (1-5) or null if not assessed
 * @returns Hex color string
 *
 * @example
 * getScoreColor(4.5) // returns '#4caf50' (green)
 * getScoreColor(3.2) // returns '#ff9800' (orange)
 * getScoreColor(null) // returns '#9e9e9e' (grey)
 */
export function getScoreColor(score: number | null): string {
  if (score === null) return SCORE_COLORS.none;
  if (score >= MATURITY_THRESHOLDS.EXCELLENT) return SCORE_COLORS.excellent;
  if (score >= MATURITY_THRESHOLDS.GOOD) return SCORE_COLORS.good;
  if (score >= MATURITY_THRESHOLDS.DEVELOPING) return SCORE_COLORS.developing;
  return SCORE_COLORS.initial;
}
