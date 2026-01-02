import express from "express";
import {
  createTaskController,
  getTasksController,
  getTaskController,
  updateTaskController,
  deleteTaskController,
} from "../controllers/taskController.js";

const router = express.Router();

// POST /tasks
router.post("/", createTaskController);

// GET /tasks
router.get("/:userId", getTasksController);

// GET /tasks/:taskId
router.get("/:taskId/:userId", getTaskController);

// PUT /tasks/:taskId
router.put("/:taskId", updateTaskController);

// DELETE /tasks/:taskId
router.delete("/:taskId", deleteTaskController);

export default router;
