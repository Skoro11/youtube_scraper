import { describe, it, expect } from 'vitest';
import { formatDate } from './date';

describe('date utils', () => {
  describe('formatDate', () => {
    it('should format date string correctly', () => {
      const date = '2024-01-15T10:30:00Z';
      const result = formatDate(date);

      // Check that it contains expected parts (locale-independent check)
      expect(result).toContain('January');
      expect(result).toContain('15');
      expect(result).toContain('2024');
    });

    it('should format Date object correctly', () => {
      const date = new Date('2024-06-20T14:45:00Z');
      const result = formatDate(date);

      expect(result).toContain('June');
      expect(result).toContain('20');
      expect(result).toContain('2024');
    });

    it('should include time in the output', () => {
      const date = '2024-03-10T09:15:00Z';
      const result = formatDate(date);

      // Result should include time components
      expect(result).toMatch(/\d{1,2}:\d{2}/);
    });

    it('should handle different months', () => {
      const dates = [
        { input: '2024-02-01T00:00:00Z', month: 'February' },
        { input: '2024-07-15T00:00:00Z', month: 'July' },
        { input: '2024-12-25T00:00:00Z', month: 'December' },
      ];

      dates.forEach(({ input, month }) => {
        expect(formatDate(input)).toContain(month);
      });
    });
  });
});
