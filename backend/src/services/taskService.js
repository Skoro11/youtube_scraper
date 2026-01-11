import client from "../config/database.js";
import axios from "axios";

export async function createLink(user_id, title, youtube_url, notes) {
  const status = "pending";

  const result = await client.query(
    `
    INSERT INTO youtube_links (
      user_id,
      title,
      youtube_url,
      notes,
      status
    )
    VALUES ($1, $2, $3, $4, $5)
    RETURNING
      id,
      user_id,
      title,
      youtube_url,
      notes,
      status,
      created_at
    `,
    [user_id, title, youtube_url, notes, status]
  );

  return result.rows[0];
}

export async function getLinksByUser(user_id) {
  const result = await client.query(
    `
    SELECT
      id,
      user_id,
      title,
      youtube_url,
      notes,
      status,
      created_at
    FROM youtube_links
    WHERE user_id = $1
    ORDER BY created_at DESC
    `,
    [user_id]
  );

  return result.rows;
}

export async function getLinkById(link_id, user_id) {
  const result = await client.query(
    `
    SELECT
      id,
      user_id,
      title,
      youtube_url,
      notes,
      status,
      created_at
    FROM youtube_links
    WHERE id = $1 AND user_id = $2
    `,
    [link_id, user_id]
  );

  return result.rows[0] || null;
}

export async function updateLink(link_id, title, youtube_url, notes) {
  const result = await client.query(
    `
    UPDATE youtube_links
    SET
      title = $1,
      youtube_url = $2,
      notes = $3
    WHERE id = $4
    RETURNING
      id,
      user_id,
      title,
      youtube_url,
      notes,
      status,
      created_at
    `,
    [title, youtube_url, notes, link_id]
  );

  return result.rows[0] || null;
}

export async function deleteLink(link_id) {
  const result = await client.query(
    `
    DELETE FROM youtube_links
    WHERE id = $1
    RETURNING id
    `,
    [link_id]
  );

  return result.rowCount > 0;
}

export async function updateLinkStatus(link_id, status) {
  const result = await client.query(
    `
    UPDATE youtube_links
    SET status = $1
    WHERE id = $2
    RETURNING
      id,
      user_id,
      title,
      youtube_url,
      notes,
      status,
      created_at
    `,
    [status, link_id]
  );

  return result.rows[0] || null;
}

export async function sendWebhook(email, title, youtube_url) {
  try {
    const response = await axios.post(process.env.N8N_WEBHOOK_URL, {
      email: email,
      title: title,
      youtube_url: youtube_url,
    });
    console.log("Response webhook", response);
  } catch (error) {
    console.log.log("Error sendWebHook", error.message);
  }
}
