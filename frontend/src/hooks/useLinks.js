import { useState, useEffect, useCallback } from "react";
import {
  createLink,
  deleteLinkById,
  getLinks,
  editLink,
  getTranscript,
  updateLinkStatus,
  sendToWebhookWithChat,
} from "../services/taskService";
import { LINK_STATUS } from "../constants/status";

export function useLinks(userId) {
  const [links, setLinks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchLinks = useCallback(async () => {
    if (!userId) return;
    setIsLoading(true);
    try {
      const response = await getLinks(userId);
      setLinks(response.data.links);
    } catch (error) {
      console.error("Failed to fetch links:", error);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    fetchLinks();
  }, [userId, fetchLinks]);

  const addLink = useCallback(
    async (linkData) => {
      const response = await createLink(
        userId,
        linkData.title,
        linkData.youtube_url,
        linkData.notes
      );
      const newLink = response.data.link;
      setLinks((prev) => [newLink, ...prev]);
      return newLink;
    },
    [userId]
  );

  const updateLink = useCallback(async (linkId, linkData) => {
    const response = await editLink(
      linkId,
      linkData.title,
      linkData.youtube_url,
      linkData.notes
    );
    const updatedLink = response.data.link;
    setLinks((prev) =>
      prev.map((link) => (link.id === linkId ? updatedLink : link))
    );
    return updatedLink;
  }, []);

  const removeLink = useCallback(async (linkId) => {
    const response = await deleteLinkById(linkId);
    if (response) {
      setLinks((prev) => prev.filter((link) => link.id !== linkId));
    }
  }, []);

  const updateStatus = useCallback(async (linkId, status) => {
    await updateLinkStatus(linkId, status);
    setLinks((prev) =>
      prev.map((link) => (link.id === linkId ? { ...link, status } : link))
    );
  }, []);

  const sendWebhook = useCallback(
    async (linkId, email, title, youtubeUrl) => {
      try {
        const response = await getTranscript(email, title, youtubeUrl);
        const newStatus =
          response.status === 200 ? LINK_STATUS.PROCESSED : LINK_STATUS.FAILED;
        await updateStatus(linkId, newStatus);
        return { success: response.status === 200, response };
      } catch (error) {
        await updateStatus(linkId, LINK_STATUS.FAILED);
        throw error;
      }
    },
    [updateStatus]
  );

  const sendWebhookForChat = useCallback(
    async (linkId, email, title, youtubeUrl) => {
      try {
        const response = await sendToWebhookWithChat(email, title, youtubeUrl);
        const newStatus =
          response.status === 200 ? LINK_STATUS.PROCESSED : LINK_STATUS.FAILED;
        await updateStatus(linkId, newStatus);
        return { success: response.status === 200, response };
      } catch (error) {
        await updateStatus(linkId, LINK_STATUS.FAILED);
        throw error;
      }
    },
    [updateStatus]
  );

  return {
    links,
    isLoading,
    fetchLinks,
    addLink,
    updateLink,
    removeLink,
    updateStatus,
    sendWebhook,
    sendWebhookForChat,
  };
}
