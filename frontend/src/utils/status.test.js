import { describe, it, expect } from 'vitest';
import { getStatusStyle, getStatusLabel } from './status';

describe('status utils', () => {
  describe('getStatusStyle', () => {
    it('should return correct style for pending status', () => {
      expect(getStatusStyle('pending')).toBe('bg-yellow-100 text-yellow-800');
    });

    it('should return correct style for sent status', () => {
      expect(getStatusStyle('sent')).toBe('bg-blue-100 text-blue-800');
    });

    it('should return correct style for processed status', () => {
      expect(getStatusStyle('processed')).toBe('bg-green-100 text-green-800');
    });

    it('should return correct style for failed status', () => {
      expect(getStatusStyle('failed')).toBe('bg-red-100 text-red-800');
    });

    it('should return default style for unknown status', () => {
      expect(getStatusStyle('unknown')).toBe('bg-gray-100 text-gray-800');
    });

    it('should return default style for null status', () => {
      expect(getStatusStyle(null)).toBe('bg-gray-100 text-gray-800');
    });

    it('should return default style for undefined status', () => {
      expect(getStatusStyle(undefined)).toBe('bg-gray-100 text-gray-800');
    });
  });

  describe('getStatusLabel', () => {
    it('should return correct label for pending status', () => {
      expect(getStatusLabel('pending')).toBe('Pending');
    });

    it('should return correct label for sent status', () => {
      expect(getStatusLabel('sent')).toBe('Sent');
    });

    it('should return correct label for processed status', () => {
      expect(getStatusLabel('processed')).toBe('Processed');
    });

    it('should return correct label for failed status', () => {
      expect(getStatusLabel('failed')).toBe('Failed');
    });

    it('should return the status itself for unknown status', () => {
      expect(getStatusLabel('custom_status')).toBe('custom_status');
    });

    it('should return null for null status', () => {
      expect(getStatusLabel(null)).toBe(null);
    });

    it('should return undefined for undefined status', () => {
      expect(getStatusLabel(undefined)).toBe(undefined);
    });
  });
});
