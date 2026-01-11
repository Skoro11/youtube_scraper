import {
  createLink,
  getLinksByUser,
  getLinkById,
  updateLink,
  deleteLink,
  updateLinkStatus,
} from "../services/taskService.js";

export async function createLinkController(req, res) {
  try {
    const { user_id, title, youtube_url, notes } = req.body;

    if (!youtube_url) {
      return res.status(400).json({ message: "YouTube URL is required" });
    }

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const link = await createLink(user_id, title, youtube_url, notes);

    res.status(201).json({ message: "Link created and sent to webhook", link });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

export async function getLinksController(req, res) {
  try {
    const { userId: user_id } = req.params;

    const links = await getLinksByUser(user_id);

    res.status(200).json({ links });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

export async function getLinkController(req, res) {
  try {
    const { linkId: link_id, userId: user_id } = req.params;

    if (!link_id) {
      return res.status(400).json({ message: "Link ID is required" });
    }

    const link = await getLinkById(link_id, user_id);

    if (!link) {
      return res.status(404).json({ message: "Link not found" });
    }

    res.status(200).json({ link });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

export async function updateLinkController(req, res) {
  try {
    const { linkId: link_id } = req.params;
    const { title, youtube_url, notes } = req.body;

    if (!link_id) {
      return res.status(400).json({ message: "Link ID is required" });
    }

    const updatedLink = await updateLink(link_id, title, youtube_url, notes);

    if (!updatedLink) {
      return res.status(404).json({ message: "Link not found or not allowed" });
    }

    res.status(200).json({ message: "Link updated", link: updatedLink });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

export async function deleteLinkController(req, res) {
  try {
    const { linkId: link_id, userId: user_id } = req.params;

    if (!link_id) {
      return res.status(400).json({ message: "Link ID is required" });
    }

    const deleted = await deleteLink(link_id, user_id);

    if (!deleted) {
      return res.status(404).json({ message: "Link not found" });
    }

    res.status(200).json({ message: "Link deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

export async function updateStatusController(req, res) {
  try {
    const { linkId: link_id } = req.params;
    const { status } = req.body;

    if (!link_id) {
      return res.status(400).json({ message: "Link ID is required" });
    }

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const updatedLink = await updateLinkStatus(link_id, status);

    if (!updatedLink) {
      return res.status(404).json({ message: "Link not found" });
    }

    res.status(200).json({ message: "Status updated", link: updatedLink });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}
