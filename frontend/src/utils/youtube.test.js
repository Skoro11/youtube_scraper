import { describe, it, expect } from 'vitest';
import { extractVideoId, getThumbnailUrl } from './youtube';

describe('youtube utils', () => {
  describe('extractVideoId', () => {
    it('should extract video ID from standard YouTube URL', () => {
      const url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
      expect(extractVideoId(url)).toBe('dQw4w9WgXcQ');
    });

    it('should extract video ID from short YouTube URL', () => {
      const url = 'https://youtu.be/dQw4w9WgXcQ';
      expect(extractVideoId(url)).toBe('dQw4w9WgXcQ');
    });

    it('should extract video ID from embed URL', () => {
      const url = 'https://www.youtube.com/embed/dQw4w9WgXcQ';
      expect(extractVideoId(url)).toBe('dQw4w9WgXcQ');
    });

    it('should extract video ID from URL with additional parameters', () => {
      const url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=PLtest';
      expect(extractVideoId(url)).toBe('dQw4w9WgXcQ');
    });

    it('should return null for invalid URL', () => {
      const url = 'https://example.com/video';
      expect(extractVideoId(url)).toBeNull();
    });

    it('should return null for null input', () => {
      expect(extractVideoId(null)).toBeNull();
    });

    it('should return null for undefined input', () => {
      expect(extractVideoId(undefined)).toBeNull();
    });

    it('should return null for empty string', () => {
      expect(extractVideoId('')).toBeNull();
    });
  });

  describe('getThumbnailUrl', () => {
    const videoId = 'dQw4w9WgXcQ';

    it('should return default quality thumbnail URL', () => {
      const result = getThumbnailUrl(videoId);
      expect(result).toBe('https://img.youtube.com/vi/dQw4w9WgXcQ/default.jpg');
    });

    it('should return medium quality thumbnail URL', () => {
      const result = getThumbnailUrl(videoId, 'mq');
      expect(result).toBe('https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg');
    });

    it('should return high quality thumbnail URL', () => {
      const result = getThumbnailUrl(videoId, 'hq');
      expect(result).toBe('https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg');
    });

    it('should return standard definition thumbnail URL', () => {
      const result = getThumbnailUrl(videoId, 'sd');
      expect(result).toBe('https://img.youtube.com/vi/dQw4w9WgXcQ/sddefault.jpg');
    });

    it('should return max resolution thumbnail URL', () => {
      const result = getThumbnailUrl(videoId, 'maxres');
      expect(result).toBe('https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg');
    });

    it('should fallback to default for unknown quality', () => {
      const result = getThumbnailUrl(videoId, 'unknown');
      expect(result).toBe('https://img.youtube.com/vi/dQw4w9WgXcQ/default.jpg');
    });
  });
});
