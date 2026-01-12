import express from "express";
import {
  createLinkController,
  getLinksController,
  getLinkController,
  updateLinkController,
  deleteLinkController,
  updateStatusController,
} from "../controllers/taskController.js";

const router = express.Router();

// POST /links - Create new YouTube link
router.post("/", createLinkController);

// GET /links/:userId - Get all links for a user
router.get("/:userId", getLinksController);

/* // GET /links/:linkId/:userId - Get single link
router.get("/:linkId/:userId", getLinkController); */

// PUT /links/:linkId - Update link
router.put("/:linkId", updateLinkController);

// DELETE /links/:linkId - Delete link
router.delete("/:linkId", deleteLinkController);

// PATCH /links/:linkId/status - Update link status
router.patch("/:linkId/status", updateStatusController);

export default router;
