import { Client } from "pg";
import dotenv from "dotenv";

dotenv.config();

const client = new Client({
  host: process.env.POSTGRES_HOST || "localhost",
  user: process.env.POSTGRES_USER || "postgres",
  port: process.env.POSTGRES_PORT || 5431,
  password: process.env.POSTGRES_PASSWORD || "me123",
  database: process.env.POSTGRES_DB || "postgres",
});

client.connect();

// Create tables on startup
client.query(
  `
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`,
  (err, res) => {
    if (!err) {
      console.log("User table created successfully");
    } else {
      console.log("Error ", err.message);
    }
    // Don't call client.end() here - keep connection open for other queries
  }
);

client.query(
  `
  CREATE TABLE IF NOT EXISTS youtube_links (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  title VARCHAR(255) NOT NULL,
  youtube_url VARCHAR(500) NOT NULL,
  notes TEXT,
  status VARCHAR(100) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
`,
  (err, res) => {
    if (!err) {
      console.log("YouTube Links table created successfully");
    } else {
      console.log("Error ", err.message);
    }
  }
);
// Export the client so other files can use it
export default client;
