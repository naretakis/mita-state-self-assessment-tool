/**
 * Debounce Hooks
 *
 * Provides debouncing utilities for values and callbacks.
 * Useful for reducing API calls and expensive operations on rapid user input.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { UI } from '../constants';

/**
 * Debounce a value - returns the value after a delay.
 * Useful for delaying expensive operations until user stops typing.
 *
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds (defaults to UI.DEBOUNCE_MS)
 * @returns The debounced value
 *
 * @example
 * const [searchTerm, setSearchTerm] = useState('');
 * const debouncedSearch = useDebounce(searchTerm, 300);
 *
 * useEffect(() => {
 *   // This only runs 300ms after user stops typing
 *   performSearch(debouncedSearch);
 * }, [debouncedSearch]);
 */
export function useDebounce<T>(value: T, delay: number = UI.DEBOUNCE_MS): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Debounce a callback function.
 * The callback will only be invoked after the specified delay has passed
 * since the last invocation.
 *
 * @param callback - The function to debounce
 * @param delay - Delay in milliseconds (defaults to UI.DEBOUNCE_MS)
 * @returns A debounced version of the callback
 *
 * @example
 * const saveNotes = useDebouncedCallback((notes: string) => {
 *   api.saveNotes(notes);
 * }, 500);
 *
 * // In component:
 * <TextField onChange={(e) => saveNotes(e.target.value)} />
 */
export function useDebouncedCallback<T extends (...args: Parameters<T>) => void>(
  callback: T,
  delay: number = UI.DEBOUNCE_MS
): T {
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const callbackRef = useRef(callback);

  // Keep callback ref up to date
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return useCallback(
    ((...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args);
      }, delay);
    }) as T,
    [delay]
  );
}

/**
 * Hook for debounced text field auto-save pattern.
 * Manages local state and syncs to parent after debounce delay.
 *
 * @param externalValue - The value from parent/database
 * @param onSave - Callback to save the value
 * @param delay - Delay in milliseconds (defaults to UI.DEBOUNCE_MS)
 * @returns Tuple of [localValue, setLocalValue]
 *
 * @example
 * const [notes, setNotes] = useDebouncedSave(
 *   rating?.notes ?? '',
 *   (value) => onNotesChange(value),
 *   500
 * );
 *
 * <TextField value={notes} onChange={(e) => setNotes(e.target.value)} />
 */
export function useDebouncedSave(
  externalValue: string,
  onSave: (value: string) => void,
  delay: number = UI.DEBOUNCE_MS
): [string, (value: string) => void] {
  const [localValue, setLocalValue] = useState(externalValue);
  const isFirstRender = useRef(true);

  // Sync local state when external value changes (e.g., from database)
  useEffect(() => {
    setLocalValue(externalValue);
  }, [externalValue]);

  // Debounced save effect
  useEffect(() => {
    // Skip on first render to avoid unnecessary save
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // Only save if value actually changed from external
    if (localValue === externalValue) {
      return;
    }

    const timer = setTimeout(() => {
      onSave(localValue);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [localValue, externalValue, onSave, delay]);

  return [localValue, setLocalValue];
}
