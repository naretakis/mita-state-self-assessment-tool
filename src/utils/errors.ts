/**
 * Error Utilities
 *
 * Centralized error handling for consistent error patterns across the application.
 * Provides custom error classes and helper functions for async operations.
 */

/**
 * Error codes for assessment-related errors.
 * Used to categorize errors for handling and logging.
 */
export type AssessmentErrorCode =
  | 'ASSESSMENT_NOT_FOUND'
  | 'AREA_NOT_FOUND'
  | 'RATING_NOT_FOUND'
  | 'INVALID_INPUT'
  | 'STORAGE_ERROR'
  | 'ATTACHMENT_ERROR'
  | 'EXPORT_ERROR'
  | 'IMPORT_ERROR';

/**
 * Custom error class for assessment-related errors.
 * Provides structured error information with error codes and context.
 *
 * @example
 * throw new AssessmentError('Assessment not found', 'ASSESSMENT_NOT_FOUND', { id: '123' });
 */
export class AssessmentError extends Error {
  /**
   * Creates a new AssessmentError
   * @param message - Human-readable error message
   * @param code - Error code for categorization
   * @param context - Optional context data for debugging
   */
  constructor(
    message: string,
    public readonly code: AssessmentErrorCode,
    public readonly context?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'AssessmentError';

    // Maintains proper stack trace for where error was thrown (V8 engines)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AssessmentError);
    }
  }
}

/**
 * Wrapper for async operations with consistent error handling.
 * Catches errors and wraps them in AssessmentError if not already.
 *
 * @param operation - Async function to execute
 * @param errorCode - Error code to use if operation fails
 * @param context - Optional context data for debugging
 * @returns Result of the operation
 * @throws AssessmentError if operation fails
 *
 * @example
 * const result = await withErrorHandling(
 *   () => db.assessments.get(id),
 *   'ASSESSMENT_NOT_FOUND',
 *   { assessmentId: id }
 * );
 */
export async function withErrorHandling<T>(
  operation: () => Promise<T>,
  errorCode: AssessmentErrorCode,
  context?: Record<string, unknown>
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    // Re-throw if already an AssessmentError
    if (error instanceof AssessmentError) {
      throw error;
    }

    // Wrap other errors
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new AssessmentError(message, errorCode, context);
  }
}

/**
 * Type guard to check if an error is an AssessmentError
 *
 * @param error - Error to check
 * @returns True if error is an AssessmentError
 *
 * @example
 * try {
 *   await someOperation();
 * } catch (error) {
 *   if (isAssessmentError(error)) {
 *     console.log(error.code, error.context);
 *   }
 * }
 */
export function isAssessmentError(error: unknown): error is AssessmentError {
  return error instanceof AssessmentError;
}

/**
 * Get a user-friendly error message for an error code
 *
 * @param code - The error code
 * @returns Human-readable error message
 */
export function getErrorMessage(code: AssessmentErrorCode): string {
  const messages: Record<AssessmentErrorCode, string> = {
    ASSESSMENT_NOT_FOUND: 'The requested assessment could not be found.',
    AREA_NOT_FOUND: 'The capability area could not be found.',
    RATING_NOT_FOUND: 'The rating could not be found.',
    INVALID_INPUT: 'The provided input is invalid.',
    STORAGE_ERROR: 'An error occurred while accessing local storage.',
    ATTACHMENT_ERROR: 'An error occurred while handling the attachment.',
    EXPORT_ERROR: 'An error occurred while exporting data.',
    IMPORT_ERROR: 'An error occurred while importing data.',
  };

  return messages[code];
}
