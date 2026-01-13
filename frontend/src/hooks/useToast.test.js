import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useToast } from './useToast';

describe('useToast', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should initialize with hidden toast', () => {
    const { result } = renderHook(() => useToast());

    expect(result.current.toast.show).toBe(false);
    expect(result.current.toast.message).toBe('');
    expect(result.current.toast.type).toBe('');
  });

  it('should show toast with message and type', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.showToast('Test message', 'success');
    });

    expect(result.current.toast.show).toBe(true);
    expect(result.current.toast.message).toBe('Test message');
    expect(result.current.toast.type).toBe('success');
  });

  it('should default to success type', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.showToast('Test message');
    });

    expect(result.current.toast.type).toBe('success');
  });

  it('should auto-hide toast after duration', () => {
    const { result } = renderHook(() => useToast(1000));

    act(() => {
      result.current.showToast('Test message', 'success');
    });

    expect(result.current.toast.show).toBe(true);

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current.toast.show).toBe(false);
  });

  it('should hide toast manually', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.showToast('Test message', 'error');
    });

    expect(result.current.toast.show).toBe(true);

    act(() => {
      result.current.hideToast();
    });

    expect(result.current.toast.show).toBe(false);
  });

  it('should show error type toast', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.showToast('Error occurred', 'error');
    });

    expect(result.current.toast.type).toBe('error');
  });
});
