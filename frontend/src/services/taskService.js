import api from "./axiosInstance";
import axios from "axios";
export async function createLink(user_id, title, youtube_url, notes) {
  try {
    const response = await api.post("/api/tasks", {
      user_id: user_id,
      title: title,
      youtube_url: youtube_url,
      notes: notes,
    });

    return response;
  } catch (error) {
    console.error("Create link error:", error.message);
    throw error;
  }
}

export async function editLink(linkId, title, youtube_url, notes) {
  try {
    const response = await api.put(`/api/tasks/${linkId}`, {
      title: title,
      youtube_url: youtube_url,
      notes: notes,
    });
    return response;
  } catch (error) {
    console.error("Edit link error:", error.message);
    throw error;
  }
}

export async function getLinks(user_id) {
  try {
    const response = await api.get(`/api/tasks/${user_id}`);
    return response;
  } catch (error) {
    console.error("Get links error:", error.message);
    throw error;
  }
}

export async function deleteLinkById(link_id) {
  try {
    const response = await api.delete(`/api/tasks/${link_id}`);
    return response;
  } catch (error) {
    console.error("Delete link error:", error.message);
    throw error;
  }
}

export async function getTranscript(email, title, youtube_url) {
  try {
    console.log(import.meta.env.VITE_N8N_WEBHOOK_URL);
    const response = await axios.post(import.meta.env.VITE_N8N_WEBHOOK_URL, {
      email: email,
      title: title,
      youtube_url: youtube_url,
    });
    return response;
  } catch (error) {
    console.log("Get trascript error", error.message);
    throw error;
  }
}

export async function updateLinkStatus(linkId, status) {
  try {
    const response = await api.patch(`/api/tasks/${linkId}/status`, {
      status: status,
    });
    return response;
  } catch (error) {
    console.error("Update status error:", error.message);
    throw error;
  }
}
