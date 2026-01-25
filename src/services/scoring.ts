/**
 * Scoring service for calculating maturity scores.
 * Uses simple averaging across all dimensions (no weighting per stakeholder decision).
 */

/**
 * Calculates the average of an array of numbers, excluding null/undefined values.
 *
 * @param values - Array of numbers (may include null/undefined)
 * @returns Average value or null if no valid values
 */
export function calculateAverage(values: (number | null | undefined)[]): number | null {
  const validValues = values.filter((v): v is number => v !== null && v !== undefined);

  if (validValues.length === 0) {
    return null;
  }

  const sum = validValues.reduce((acc, val) => acc + val, 0);
  return sum / validValues.length;
}

/**
 * Rounds a score to one decimal place.
 *
 * @param score - The score to round
 * @returns Rounded score or null if input is null
 */
export function roundScore(score: number | null): number | null {
  if (score === null) {
    return null;
  }
  return Math.round(score * 10) / 10;
}

/**
 * Calculate average score from an array of numeric values, rounded to 1 decimal place.
 * This is the standard scoring function used throughout the application.
 *
 * @param values - Array of numeric scores (1-5)
 * @returns Average rounded to 1 decimal, or null if empty array
 *
 * @example
 * calculateAverageScore([3, 4, 5]) // returns 4.0
 * calculateAverageScore([2.5, 3.5]) // returns 3.0
 * calculateAverageScore([]) // returns null
 */
export function calculateAverageScore(values: number[]): number | null {
  if (values.length === 0) return null;
  const sum = values.reduce((a, b) => a + b, 0);
  const avg = sum / values.length;
  return Math.round(avg * 10) / 10;
}
