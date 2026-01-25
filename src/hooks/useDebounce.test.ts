/**
 * Tests for debounce hooks
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDebounce, useDebouncedCallback, useDebouncedSave } from './useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 300));
    expect(result.current).toBe('initial');
  });

  it('debounces value changes', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 300), {
      initialProps: { value: 'initial' },
    });

    // Change value
    rerender({ value: 'updated' });

    // Value should not change immediately
    expect(result.current).toBe('initial');

    // Advance time
    act(() => {
      vi.advanceTimersByTime(300);
    });

    // Now value should be updated
    expect(result.current).toBe('updated');
  });

  it('resets timer on rapid changes', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 300), {
      initialProps: { value: 'a' },
    });

    // Rapid changes
    rerender({ value: 'b' });
    act(() => {
      vi.advanceTimersByTime(100);
    });

    rerender({ value: 'c' });
    act(() => {
      vi.advanceTimersByTime(100);
    });

    rerender({ value: 'd' });

    // Still showing initial value
    expect(result.current).toBe('a');

    // Advance full delay
    act(() => {
      vi.advanceTimersByTime(300);
    });

    // Should show final value
    expect(result.current).toBe('d');
  });
});

describe('useDebouncedCallback', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('debounces callback invocations', () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useDebouncedCallback(callback, 300));

    // Call multiple times rapidly
    act(() => {
      result.current('a');
      result.current('b');
      result.current('c');
    });

    // Callback should not be called yet
    expect(callback).not.toHaveBeenCalled();

    // Advance time
    act(() => {
      vi.advanceTimersByTime(300);
    });

    // Callback should be called once with last value
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('c');
  });

  it('cleans up on unmount', () => {
    const callback = vi.fn();
    const { result, unmount } = renderHook(() => useDebouncedCallback(callback, 300));

    act(() => {
      result.current('test');
    });

    // Unmount before timer fires
    unmount();

    // Advance time
    act(() => {
      vi.advanceTimersByTime(300);
    });

    // Callback should not be called
    expect(callback).not.toHaveBeenCalled();
  });
});

describe('useDebouncedSave', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns initial value', () => {
    const onSave = vi.fn();
    const { result } = renderHook(() => useDebouncedSave('initial', onSave, 300));

    expect(result.current[0]).toBe('initial');
  });

  it('updates local value immediately', () => {
    const onSave = vi.fn();
    const { result } = renderHook(() => useDebouncedSave('initial', onSave, 300));

    act(() => {
      result.current[1]('updated');
    });

    expect(result.current[0]).toBe('updated');
  });

  it('calls onSave after debounce delay', () => {
    const onSave = vi.fn();
    const { result } = renderHook(() => useDebouncedSave('initial', onSave, 300));

    act(() => {
      result.current[1]('updated');
    });

    // onSave should not be called yet
    expect(onSave).not.toHaveBeenCalled();

    // Advance time
    act(() => {
      vi.advanceTimersByTime(300);
    });

    // onSave should be called with new value
    expect(onSave).toHaveBeenCalledTimes(1);
    expect(onSave).toHaveBeenCalledWith('updated');
  });

  it('syncs with external value changes', () => {
    const onSave = vi.fn();
    const { result, rerender } = renderHook(({ value }) => useDebouncedSave(value, onSave, 300), {
      initialProps: { value: 'initial' },
    });

    // External value changes
    rerender({ value: 'external update' });

    // Local value should sync
    expect(result.current[0]).toBe('external update');
  });

  it('does not save if value matches external', () => {
    const onSave = vi.fn();
    const { result } = renderHook(() => useDebouncedSave('initial', onSave, 300));

    // Set to same value
    act(() => {
      result.current[1]('initial');
    });

    // Advance time
    act(() => {
      vi.advanceTimersByTime(300);
    });

    // onSave should not be called
    expect(onSave).not.toHaveBeenCalled();
  });
});
