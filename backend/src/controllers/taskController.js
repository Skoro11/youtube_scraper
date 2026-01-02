import {
  createTask,
  getTasksByUser,
  getTaskById,
  updateTask,
  deleteTask,
} from "../services/taskService.js";

export async function createTaskController(req, res) {
  try {
    const {
      user_id,
      task_name,
      repository_branch,
      project_name,
      task_description,
      deadline,
    } = req.body;

    if (!task_name) {
      return res.status(400).json({ message: "Task name is required" });
    }

    const task = await createTask(
      user_id,
      task_name,
      repository_branch,
      project_name,
      task_description,
      deadline
    );

    res.status(201).json({ message: "Task created", task });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

export async function getTasksController(req, res) {
  try {
    const { userId: user_id } = req.params;

    const tasks = await getTasksByUser(user_id);

    res.status(200).json({ tasks });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

export async function getTaskController(req, res) {
  try {
    const { taskId: task_id, userId: user_id } = req.params;

    if (!task_id) {
      return res.status(400).json({ message: "Task ID is required" });
    }

    const task = await getTaskById(task_id, user_id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ task });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

export async function updateTaskController(req, res) {
  try {
    const { taskId: task_id } = req.params;
    const {
      task_name,
      repository_branch,
      project_name,
      status,
      task_description,
      deadline,
    } = req.body;

    if (!task_id) {
      return res.status(400).json({ message: "Task ID is required" });
    }

    const updatedTask = await updateTask(
      task_id,
      task_name,
      repository_branch,
      project_name,
      status,
      task_description,
      deadline
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found or not allowed" });
    }

    res.status(200).json({ message: "Task updated", task: updatedTask });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

export async function deleteTaskController(req, res) {
  try {
    const { taskId: task_id, userId: user_id } = req.params;

    if (!task_id) {
      return res.status(400).json({ message: "Task ID is required" });
    }

    const deleted = await deleteTask(task_id, user_id);

    if (!deleted) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}
