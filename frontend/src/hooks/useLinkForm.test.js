import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLinkForm } from './useLinkForm';

describe('useLinkForm', () => {
  it('should initialize with empty form data', () => {
    const { result } = renderHook(() => useLinkForm());

    expect(result.current.formData).toEqual({
      id: null,
      title: '',
      youtube_url: '',
      notes: '',
    });
  });

  it('should update form data on input change', () => {
    const { result } = renderHook(() => useLinkForm());

    act(() => {
      result.current.handleInputChange({
        target: { name: 'title', value: 'Test Title' },
      });
    });

    expect(result.current.formData.title).toBe('Test Title');
  });

  it('should update multiple fields independently', () => {
    const { result } = renderHook(() => useLinkForm());

    act(() => {
      result.current.handleInputChange({
        target: { name: 'title', value: 'Test Title' },
      });
    });

    act(() => {
      result.current.handleInputChange({
        target: { name: 'youtube_url', value: 'https://youtube.com/watch?v=test' },
      });
    });

    expect(result.current.formData.title).toBe('Test Title');
    expect(result.current.formData.youtube_url).toBe('https://youtube.com/watch?v=test');
  });

  it('should set form from link object', () => {
    const { result } = renderHook(() => useLinkForm());

    const link = {
      id: 1,
      title: 'Existing Link',
      youtube_url: 'https://youtube.com/watch?v=existing',
      notes: 'Some notes',
      status: 'processed',
    };

    act(() => {
      result.current.setFormFromLink(link);
    });

    expect(result.current.formData).toEqual({
      id: 1,
      title: 'Existing Link',
      youtube_url: 'https://youtube.com/watch?v=existing',
      notes: 'Some notes',
      status: 'processed',
    });
  });

  it('should handle null notes when setting from link', () => {
    const { result } = renderHook(() => useLinkForm());

    const link = {
      id: 1,
      title: 'Link without notes',
      youtube_url: 'https://youtube.com/watch?v=test',
      notes: null,
      status: 'pending',
    };

    act(() => {
      result.current.setFormFromLink(link);
    });

    expect(result.current.formData.notes).toBe('');
  });

  it('should reset form to initial state', () => {
    const { result } = renderHook(() => useLinkForm());

    // First fill the form
    act(() => {
      result.current.handleInputChange({
        target: { name: 'title', value: 'Test Title' },
      });
      result.current.handleInputChange({
        target: { name: 'youtube_url', value: 'https://youtube.com' },
      });
    });

    // Then reset
    act(() => {
      result.current.resetForm();
    });

    expect(result.current.formData).toEqual({
      id: null,
      title: '',
      youtube_url: '',
      notes: '',
    });
  });
});
