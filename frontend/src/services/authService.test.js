import { describe, it, expect, vi, beforeEach } from 'vitest';
import { registerUser, loginUser } from './authService';
import api from './axiosInstance';

// Mock the axios instance
vi.mock('./axiosInstance', () => ({
  default: {
    post: vi.fn(),
  },
}));

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('registerUser', () => {
    it('should call API with correct endpoint and data', async () => {
      const mockResponse = { data: { user: { id: 1, email: 'test@example.com' } } };
      api.post.mockResolvedValue(mockResponse);

      const result = await registerUser('test@example.com');

      expect(api.post).toHaveBeenCalledWith('/api/users/', { email: 'test@example.com' });
      expect(result).toEqual(mockResponse);
    });

    it('should throw error when API call fails', async () => {
      const mockError = new Error('Network error');
      api.post.mockRejectedValue(mockError);

      await expect(registerUser('test@example.com')).rejects.toThrow('Network error');
    });

    it('should handle empty email', async () => {
      const mockResponse = { data: { user: { id: 1, email: '' } } };
      api.post.mockResolvedValue(mockResponse);

      const result = await registerUser('');

      expect(api.post).toHaveBeenCalledWith('/api/users/', { email: '' });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('loginUser', () => {
    it('should call API with correct endpoint', async () => {
      const mockResponse = { data: { user: { id: 1, email: 'test@example.com' } } };
      api.post.mockResolvedValue(mockResponse);

      const result = await loginUser('test@example.com');

      expect(api.post).toHaveBeenCalledWith('/api/users/test@example.com');
      expect(result).toEqual(mockResponse);
    });

    it('should throw error when user not found', async () => {
      const mockError = new Error('User not found');
      mockError.response = { status: 404 };
      api.post.mockRejectedValue(mockError);

      await expect(loginUser('nonexistent@example.com')).rejects.toThrow('User not found');
    });

    it('should encode special characters in email', async () => {
      const mockResponse = { data: { user: { id: 1, email: 'test+special@example.com' } } };
      api.post.mockResolvedValue(mockResponse);

      await loginUser('test+special@example.com');

      expect(api.post).toHaveBeenCalledWith('/api/users/test+special@example.com');
    });
  });
});
