import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  createLink,
  editLink,
  getLinks,
  deleteLinkById,
  getTranscript,
  sendToWebhookWithChat,
  updateLinkStatus,
} from './taskService';
import api from './axiosInstance';
import axios from 'axios';

// Mock the axios instance
vi.mock('./axiosInstance', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    patch: vi.fn(),
  },
}));

// Mock axios for webhook calls
vi.mock('axios', () => ({
  default: {
    post: vi.fn(),
  },
}));

describe('taskService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createLink', () => {
    it('should call API with correct endpoint and data', async () => {
      const mockResponse = {
        data: {
          link: {
            id: 1,
            user_id: 1,
            title: 'Test Video',
            youtube_url: 'https://youtube.com/watch?v=test',
            notes: 'Test notes',
          },
        },
      };
      api.post.mockResolvedValue(mockResponse);

      const result = await createLink(1, 'Test Video', 'https://youtube.com/watch?v=test', 'Test notes');

      expect(api.post).toHaveBeenCalledWith('/api/tasks', {
        user_id: 1,
        title: 'Test Video',
        youtube_url: 'https://youtube.com/watch?v=test',
        notes: 'Test notes',
      });
      expect(result).toEqual(mockResponse);
    });

    it('should throw error when API call fails', async () => {
      const mockError = new Error('Server error');
      api.post.mockRejectedValue(mockError);

      await expect(createLink(1, 'Test', 'https://youtube.com', '')).rejects.toThrow('Server error');
    });

    it('should handle null notes', async () => {
      const mockResponse = { data: { link: { id: 1 } } };
      api.post.mockResolvedValue(mockResponse);

      await createLink(1, 'Test', 'https://youtube.com', null);

      expect(api.post).toHaveBeenCalledWith('/api/tasks', {
        user_id: 1,
        title: 'Test',
        youtube_url: 'https://youtube.com',
        notes: null,
      });
    });
  });

  describe('editLink', () => {
    it('should call API with correct endpoint and data', async () => {
      const mockResponse = {
        data: {
          link: {
            id: 1,
            title: 'Updated Title',
            youtube_url: 'https://youtube.com/watch?v=updated',
            notes: 'Updated notes',
          },
        },
      };
      api.put.mockResolvedValue(mockResponse);

      const result = await editLink(1, 'Updated Title', 'https://youtube.com/watch?v=updated', 'Updated notes');

      expect(api.put).toHaveBeenCalledWith('/api/tasks/1', {
        title: 'Updated Title',
        youtube_url: 'https://youtube.com/watch?v=updated',
        notes: 'Updated notes',
      });
      expect(result).toEqual(mockResponse);
    });

    it('should throw error for non-existent link', async () => {
      const mockError = new Error('Link not found');
      mockError.response = { status: 404 };
      api.put.mockRejectedValue(mockError);

      await expect(editLink(99999, 'Title', 'https://youtube.com', '')).rejects.toThrow('Link not found');
    });
  });

  describe('getLinks', () => {
    it('should call API with correct endpoint', async () => {
      const mockResponse = {
        data: {
          links: [
            { id: 1, title: 'Link 1' },
            { id: 2, title: 'Link 2' },
          ],
        },
      };
      api.get.mockResolvedValue(mockResponse);

      const result = await getLinks(1);

      expect(api.get).toHaveBeenCalledWith('/api/tasks/1');
      expect(result).toEqual(mockResponse);
    });

    it('should return empty array for user with no links', async () => {
      const mockResponse = { data: { links: [] } };
      api.get.mockResolvedValue(mockResponse);

      const result = await getLinks(99999);

      expect(result.data.links).toHaveLength(0);
    });
  });

  describe('deleteLinkById', () => {
    it('should call API with correct endpoint', async () => {
      const mockResponse = { data: { message: 'Link deleted' } };
      api.delete.mockResolvedValue(mockResponse);

      const result = await deleteLinkById(1);

      expect(api.delete).toHaveBeenCalledWith('/api/tasks/1');
      expect(result).toEqual(mockResponse);
    });

    it('should throw error for non-existent link', async () => {
      const mockError = new Error('Link not found');
      mockError.response = { status: 404 };
      api.delete.mockRejectedValue(mockError);

      await expect(deleteLinkById(99999)).rejects.toThrow('Link not found');
    });
  });

  describe('getTranscript', () => {
    it('should call webhook with correct data for transcript', async () => {
      const mockResponse = { status: 200, data: { success: true } };
      axios.post.mockResolvedValue(mockResponse);

      const result = await getTranscript('test@example.com', 'Test Video', 'https://youtube.com/watch?v=test');

      expect(axios.post).toHaveBeenCalledWith(expect.any(String), {
        email: 'test@example.com',
        title: 'Test Video',
        youtube_url: 'https://youtube.com/watch?v=test',
        use: 'transcript',
      });
      expect(result).toEqual(mockResponse);
    });

    it('should throw error when webhook fails', async () => {
      const mockError = new Error('Webhook failed');
      axios.post.mockRejectedValue(mockError);

      await expect(getTranscript('test@example.com', 'Test', 'https://youtube.com')).rejects.toThrow('Webhook failed');
    });
  });

  describe('sendToWebhookWithChat', () => {
    it('should call webhook with correct data for chat', async () => {
      const mockResponse = { status: 200, data: { success: true } };
      axios.post.mockResolvedValue(mockResponse);

      const result = await sendToWebhookWithChat('test@example.com', 'Test Video', 'https://youtube.com/watch?v=test');

      expect(axios.post).toHaveBeenCalledWith(expect.any(String), {
        email: 'test@example.com',
        title: 'Test Video',
        youtube_url: 'https://youtube.com/watch?v=test',
        use: 'chat',
      });
      expect(result).toEqual(mockResponse);
    });

    it('should throw error when webhook fails', async () => {
      const mockError = new Error('Webhook failed');
      axios.post.mockRejectedValue(mockError);

      await expect(sendToWebhookWithChat('test@example.com', 'Test', 'https://youtube.com')).rejects.toThrow('Webhook failed');
    });
  });

  describe('updateLinkStatus', () => {
    it('should call API with correct endpoint and data for pending', async () => {
      const mockResponse = { data: { link: { id: 1, status: 'pending' } } };
      api.patch.mockResolvedValue(mockResponse);

      const result = await updateLinkStatus(1, 'pending');

      expect(api.patch).toHaveBeenCalledWith('/api/tasks/1/status', { status: 'pending' });
      expect(result).toEqual(mockResponse);
    });

    it('should call API with correct endpoint and data for processed', async () => {
      const mockResponse = { data: { link: { id: 1, status: 'processed' } } };
      api.patch.mockResolvedValue(mockResponse);

      const result = await updateLinkStatus(1, 'processed');

      expect(api.patch).toHaveBeenCalledWith('/api/tasks/1/status', { status: 'processed' });
      expect(result).toEqual(mockResponse);
    });

    it('should call API with correct endpoint and data for failed', async () => {
      const mockResponse = { data: { link: { id: 1, status: 'failed' } } };
      api.patch.mockResolvedValue(mockResponse);

      const result = await updateLinkStatus(1, 'failed');

      expect(api.patch).toHaveBeenCalledWith('/api/tasks/1/status', { status: 'failed' });
      expect(result).toEqual(mockResponse);
    });

    it('should throw error for non-existent link', async () => {
      const mockError = new Error('Link not found');
      mockError.response = { status: 404 };
      api.patch.mockRejectedValue(mockError);

      await expect(updateLinkStatus(99999, 'pending')).rejects.toThrow('Link not found');
    });
  });
});
