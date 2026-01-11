import client from "../config/database.js";

export async function createUser(email) {
  try {
    const result = await client.query(
      `INSERT INTO users (email) VALUES ($1) RETURNING id, email, created_at`,
      [email]
    );
    return result.rows[0];
  } catch (error) {
    throw error;
  }
}

export async function findUser(email) {
  try {
    const result = await client.query(`SELECT * FROM users WHERE email = $1`, [
      email,
    ]);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
}

export async function findUserById(user_id) {
  const result = await client.query(
    `
    SELECT id, email, created_at
    FROM users
    WHERE id = $1
    `,
    [user_id]
  );

  return result.rows[0];
}

export async function deleteUser(email) {
  try {
    const result = await client.query(
      `DELETE FROM users WHERE email = $1 RETURNING *`,
      [email]
    );
    return result.rows[0]; // Returns deleted user, or undefined if not found
  } catch (error) {
    throw error;
  }
}
