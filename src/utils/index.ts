/**
 * Utilities barrel export
 *
 * Re-exports all utility functions for convenient importing.
 */

export { getScoreColor, SCORE_COLORS } from './colors';
export {
  AssessmentError,
  withErrorHandling,
  isAssessmentError,
  getErrorMessage,
  type AssessmentErrorCode,
} from './errors';
