import client from "../config/database.js";

export async function createTask(
  user_id,
  task_name,
  repository_branch,
  project_name,
  task_description,
  deadline
) {
  const status = "pending";

  const result = await client.query(
    `
    INSERT INTO tasks (
      user_id,
      task_name,
      repository_branch,
      project_name,
      status,
      task_description,
      deadline
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING
      id,
      user_id,
      task_name,
      repository_branch,
      project_name,
      status,
      task_description,
      deadline,
      created_at
    `,
    [
      user_id,
      task_name,
      repository_branch,
      project_name,
      status,
      task_description,
      deadline,
    ]
  );

  return result.rows[0];
}

export async function getTasksByUser(user_id) {
  const result = await client.query(
    `
    SELECT
      id,
      user_id,
      task_name,
      repository_branch,
      project_name,
      status,
      task_description,
      deadline,
      created_at
    FROM tasks
    WHERE user_id = $1
    ORDER BY created_at DESC
    `,
    [user_id]
  );

  return result.rows;
}

export async function getTaskById(task_id, user_id) {
  const result = await client.query(
    `
    SELECT
      id,
      user_id,
      task_name,
      repository_branch,
      project_name,
      status,
      task_description,
      deadline,
      created_at
    FROM tasks
    WHERE id = $1 AND user_id = $2
    `,
    [task_id, user_id]
  );

  return result.rows[0] || null;
}

export async function updateTask(
  task_id,
  task_name,
  repository_branch,
  project_name,
  status,
  task_description,
  deadline
) {
  const result = await client.query(
    `
    UPDATE tasks
    SET
      task_name = $1,
      repository_branch = $2,
      project_name = $3,
      status = $4,
      task_description = $5,
      deadline = $6
    WHERE id = $7
    RETURNING
      id,
      user_id,
      task_name,
      repository_branch,
      project_name,
      status,
      task_description,
      deadline,
      created_at
    `,
    [
      task_name,
      repository_branch,
      project_name,
      status,
      task_description,
      deadline,
      task_id,
    ]
  );

  return result.rows[0] || null;
}

export async function deleteTask(task_id, user_id) {
  const result = await client.query(
    `
    DELETE FROM tasks
    WHERE id = $1
    RETURNING id
    `,
    [task_id]
  );

  return result.rowCount > 0;
}
