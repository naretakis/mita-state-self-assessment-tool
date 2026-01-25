/**
 * Tests for error utilities
 */

import { describe, it, expect } from 'vitest';
import { AssessmentError, withErrorHandling, isAssessmentError, getErrorMessage } from './errors';

describe('AssessmentError', () => {
  it('creates error with message and code', () => {
    const error = new AssessmentError('Test error', 'ASSESSMENT_NOT_FOUND');

    expect(error.message).toBe('Test error');
    expect(error.code).toBe('ASSESSMENT_NOT_FOUND');
    expect(error.name).toBe('AssessmentError');
    expect(error.context).toBeUndefined();
  });

  it('creates error with context', () => {
    const context = { assessmentId: '123', userId: 'abc' };
    const error = new AssessmentError('Test error', 'STORAGE_ERROR', context);

    expect(error.context).toEqual(context);
  });

  it('is an instance of Error', () => {
    const error = new AssessmentError('Test', 'INVALID_INPUT');

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(AssessmentError);
  });
});

describe('withErrorHandling', () => {
  it('returns result on success', async () => {
    const result = await withErrorHandling(() => Promise.resolve('success'), 'STORAGE_ERROR');

    expect(result).toBe('success');
  });

  it('wraps non-AssessmentError in AssessmentError', async () => {
    await expect(
      withErrorHandling(() => Promise.reject(new Error('Original error')), 'STORAGE_ERROR', {
        operation: 'test',
      })
    ).rejects.toThrow(AssessmentError);

    try {
      await withErrorHandling(() => Promise.reject(new Error('Original error')), 'STORAGE_ERROR', {
        operation: 'test',
      });
    } catch (error) {
      expect(isAssessmentError(error)).toBe(true);
      if (isAssessmentError(error)) {
        expect(error.code).toBe('STORAGE_ERROR');
        expect(error.message).toBe('Original error');
        expect(error.context).toEqual({ operation: 'test' });
      }
    }
  });

  it('re-throws AssessmentError unchanged', async () => {
    const originalError = new AssessmentError('Original', 'ASSESSMENT_NOT_FOUND', { id: '1' });

    try {
      await withErrorHandling(
        () => Promise.reject(originalError),
        'STORAGE_ERROR' // Different code - should not be used
      );
    } catch (error) {
      expect(error).toBe(originalError);
      if (isAssessmentError(error)) {
        expect(error.code).toBe('ASSESSMENT_NOT_FOUND'); // Original code preserved
      }
    }
  });

  it('handles non-Error rejections', async () => {
    try {
      await withErrorHandling(() => Promise.reject('string error'), 'INVALID_INPUT');
    } catch (error) {
      expect(isAssessmentError(error)).toBe(true);
      if (isAssessmentError(error)) {
        expect(error.message).toBe('Unknown error');
      }
    }
  });
});

describe('isAssessmentError', () => {
  it('returns true for AssessmentError', () => {
    const error = new AssessmentError('Test', 'INVALID_INPUT');
    expect(isAssessmentError(error)).toBe(true);
  });

  it('returns false for regular Error', () => {
    const error = new Error('Test');
    expect(isAssessmentError(error)).toBe(false);
  });

  it('returns false for non-errors', () => {
    expect(isAssessmentError(null)).toBe(false);
    expect(isAssessmentError(undefined)).toBe(false);
    expect(isAssessmentError('string')).toBe(false);
    expect(isAssessmentError({})).toBe(false);
  });
});

describe('getErrorMessage', () => {
  it('returns user-friendly messages for all error codes', () => {
    expect(getErrorMessage('ASSESSMENT_NOT_FOUND')).toContain('assessment');
    expect(getErrorMessage('AREA_NOT_FOUND')).toContain('capability area');
    expect(getErrorMessage('RATING_NOT_FOUND')).toContain('rating');
    expect(getErrorMessage('INVALID_INPUT')).toContain('invalid');
    expect(getErrorMessage('STORAGE_ERROR')).toContain('storage');
    expect(getErrorMessage('ATTACHMENT_ERROR')).toContain('attachment');
    expect(getErrorMessage('EXPORT_ERROR')).toContain('export');
    expect(getErrorMessage('IMPORT_ERROR')).toContain('import');
  });
});
