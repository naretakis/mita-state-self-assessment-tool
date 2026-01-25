import { describe, it, expect } from 'vitest';
import { calculateAverage, roundScore, calculateAverageScore } from './scoring';

describe('scoring', () => {
  describe('calculateAverage', () => {
    it('should calculate average of valid numbers', () => {
      expect(calculateAverage([1, 2, 3, 4, 5])).toBe(3);
    });

    it('should return null for empty array', () => {
      expect(calculateAverage([])).toBeNull();
    });

    it('should exclude null values from calculation', () => {
      expect(calculateAverage([1, null, 3, null, 5])).toBe(3);
    });

    it('should exclude undefined values from calculation', () => {
      expect(calculateAverage([2, undefined, 4])).toBe(3);
    });

    it('should return null if all values are null/undefined', () => {
      expect(calculateAverage([null, undefined, null])).toBeNull();
    });

    it('should handle single value', () => {
      expect(calculateAverage([5])).toBe(5);
    });

    it('should handle decimal results', () => {
      expect(calculateAverage([1, 2])).toBe(1.5);
    });
  });

  describe('roundScore', () => {
    it('should round to one decimal place', () => {
      expect(roundScore(3.456)).toBe(3.5);
    });

    it('should return null for null input', () => {
      expect(roundScore(null)).toBeNull();
    });

    it('should handle whole numbers', () => {
      expect(roundScore(4)).toBe(4);
    });

    it('should round down when appropriate', () => {
      expect(roundScore(3.44)).toBe(3.4);
    });
  });

  describe('calculateAverageScore', () => {
    it('should calculate average and round to 1 decimal', () => {
      expect(calculateAverageScore([3, 4, 5])).toBe(4.0);
    });

    it('should return null for empty array', () => {
      expect(calculateAverageScore([])).toBeNull();
    });

    it('should handle single value', () => {
      expect(calculateAverageScore([3])).toBe(3.0);
    });

    it('should round correctly', () => {
      expect(calculateAverageScore([2.5, 3.5])).toBe(3.0);
      expect(calculateAverageScore([1, 2, 3])).toBe(2.0);
    });

    it('should handle decimal inputs', () => {
      expect(calculateAverageScore([3.3, 3.7])).toBe(3.5);
    });

    it('should handle maturity level values (1-5)', () => {
      expect(calculateAverageScore([1, 2, 3, 4, 5])).toBe(3.0);
      expect(calculateAverageScore([4, 4, 5, 5])).toBe(4.5);
    });
  });
});
