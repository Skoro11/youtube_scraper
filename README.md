# YouTube Link Manager

A web application for managing YouTube video links and automatically sending them to n8n webhooks for automation workflows.

## Features

- **YouTube Link Management**: Create, view, edit, and delete YouTube video links
- **n8n Webhook Integration**: Automatically send links to your n8n workflow when created
- **Status Tracking**: Track link status (Pending, Sent, Processed, Failed)
- **Webhook Monitoring**: See webhook delivery status for each link
- **Filter Links**: Filter links by status for better organization
- **Simple Authentication**: Email-based user registration and login

## Tech Stack

### Frontend

- React 18
- React Router 7
- Tailwind CSS
- Vite
- Axios

### Backend

- Node.js
- Express.js
- PostgreSQL (pg client)
- Axios (webhook calls)
- Nodemon (development)

## Project Structure

```
youtube-link-manager/
├── frontend/
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Page components (Dashboard, Login)
│   │   ├── services/         # API communication layer
│   │   ├── App.jsx           # Router setup
│   │   └── main.jsx          # Entry point
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── config/           # Database configuration
│   │   ├── controllers/      # Request handlers + webhook logic
│   │   ├── routes/           # API route definitions
│   │   ├── services/         # Database queries + webhook sending
│   │   └── server.js         # Express app entry point
│   └── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- n8n instance with a webhook trigger (optional, for automation)

### Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file with your configuration:

   ```env
   POSTGRES_HOST=localhost
   POSTGRES_USER=postgres
   POSTGRES_PORT=5432
   POSTGRES_PASSWORD=your_password
   POSTGRES_DB=postgres
   FRONTEND_URL=http://localhost:5173
   PORT=3000

   # n8n Webhook Configuration
   N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/youtube-links
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

   The backend will run on `http://localhost:3000`

### Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file:

   ```env
   VITE_API_URL=http://localhost:3000
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

   The frontend will run on `http://localhost:5173`

## API Endpoints

### Users

| Method | Endpoint            | Description         |
| ------ | ------------------- | ------------------- |
| POST   | `/api/users/`       | Register a new user |
| POST   | `/api/users/:email` | Login user          |
| DELETE | `/api/users/:email` | Delete user         |

### YouTube Links

| Method | Endpoint                            | Description                               |
| ------ | ----------------------------------- | ----------------------------------------- |
| POST   | `/api/tasks`                        | Create a new link (auto-sends to webhook) |
| GET    | `/api/tasks/:userId`                | Get all links for a user                  |
| GET    | `/api/tasks/:linkId/:userId`        | Get a specific link                       |
| PUT    | `/api/tasks/:linkId`                | Update a link                             |
| DELETE | `/api/tasks/:linkId`                | Delete a link                             |
| POST   | `/api/tasks/:linkId/:userId/resend` | Resend link to webhook                    |

## Database Schema

### Users Table

| Column     | Type         | Description           |
| ---------- | ------------ | --------------------- |
| id         | SERIAL       | Primary key           |
| email      | VARCHAR(100) | Unique user email     |
| created_at | TIMESTAMP    | Account creation date |

### YouTube Links Table

| Column           | Type         | Description                      |
| ---------------- | ------------ | -------------------------------- |
| id               | SERIAL       | Primary key                      |
| user_id          | INTEGER      | Foreign key to users             |
| title            | VARCHAR(255) | Title/description for the link   |
| youtube_url      | VARCHAR(500) | YouTube video URL                |
| notes            | TEXT         | Optional notes                   |
| status           | VARCHAR(100) | pending, sent, processed, failed |
| webhook_sent     | BOOLEAN      | Whether webhook was sent         |
| webhook_response | TEXT         | Response from webhook            |
| created_at       | TIMESTAMPTZ  | Link creation date               |

## n8n Webhook Integration

When a YouTube link is created, it's automatically sent to your configured n8n webhook. The webhook receives:

```json
{
  "id": 1,
  "user_id": 1,
  "title": "Video title",
  "youtube_url": "https://youtube.com/watch?v=dQw4w9WgXcQ",
  "notes": "Optional notes about this video",
  "created_at": "2024-01-01T00:00:00.000Z"
}
```

### Setting up n8n

1. Create a new workflow in n8n
2. Add a **Webhook** trigger node
3. Copy the webhook URL (Production or Test)
4. Paste it in your backend `.env` file as `N8N_WEBHOOK_URL`
5. Add any processing nodes you want (e.g., download video, extract metadata, send to Notion, etc.)

## Deployment

### Railway (Backend + Database)

1. Create a new project on Railway
2. Add a PostgreSQL database service
3. Deploy the backend service with these environment variables:

   - `POSTGRES_HOST` - Use Railway's internal hostname
   - `POSTGRES_USER` - From Railway PostgreSQL
   - `POSTGRES_PORT` - From Railway PostgreSQL
   - `POSTGRES_PASSWORD` - From Railway PostgreSQL
   - `POSTGRES_DB` - From Railway PostgreSQL
   - `FRONTEND_URL` - Your frontend's public URL
   - `N8N_WEBHOOK_URL` - Your n8n webhook URL
   - `PORT` - Railway sets this automatically

4. Generate a public domain for the backend service

### Vercel/Railway (Frontend)

1. Deploy the frontend with this environment variable:
   - `VITE_API_URL` - Your backend's **public** URL (with `https://`)

**Important**: The `VITE_API_URL` must include the full URL with protocol (e.g., `https://your-backend.up.railway.app`)

## Usage

1. Open the application and navigate to the login page
2. Register with your email address
3. Login with your registered email
4. Add YouTube links with:
   - Title (description of the video)
   - YouTube URL
   - Optional notes
5. Links are automatically sent to your n8n webhook
6. View, edit, or delete links from the dashboard
7. Filter links by status using the filter cards
8. Resend to webhook if needed from the link details modal

## License

MIT
