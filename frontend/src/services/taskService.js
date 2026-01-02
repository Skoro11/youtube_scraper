import api from "./axiosInstance";

export async function createTask(
  user_id,
  task_name,
  repository_branch,
  project_name,
  task_description,
  deadline
) {
  try {
    const response = await api.post("/api/tasks", {
      user_id: user_id,
      task_name: task_name,
      repository_branch: repository_branch,
      project_name: project_name,
      task_description: task_description,
      deadline: deadline,
    });

    return response;
  } catch (error) {
    console.log(error.message);
  }
}

export async function editTask(
  taskId,
  task_name,
  repository_branch,
  project_name,
  task_description,
  deadline,
  status
) {
  try {
    const response = await api.put(`/api/tasks/${taskId}`, {
      task_name: task_name,
      repository_branch: repository_branch,
      project_name: project_name,
      task_description: task_description,
      deadline: deadline,
      status: status,
    });
    return response;
  } catch (error) {
    console.log(error.message);
  }
}

export async function getTasks(user_id) {
  try {
    const response = await api.get(`/api/tasks/${user_id}`);
    return response;
  } catch (error) {
    console.log(error.message);
  }
}

export async function deleteTaskById(task_id) {
  try {
    const response = await api.delete(`/api/tasks/${task_id}`);
    return response;
  } catch (error) {
    console.log(error.message);
  }
}
