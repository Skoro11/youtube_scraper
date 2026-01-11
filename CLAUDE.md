# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

YouTube Link Manager is a web application for managing YouTube video links, fetching transcripts via n8n webhooks, and chatting with AI about video content. Built with a React frontend and Express.js backend, using PostgreSQL for persistence.

## Development Commands

### Backend (Express.js)

```bash
cd backend
npm install          # Install dependencies
npm run dev          # Start with nodemon (hot reload)
npm start            # Start production server
```

Backend runs on port 3000.

### Frontend (React + Vite)

```bash
cd frontend
npm install          # Install dependencies
npm run dev          # Start dev server
npm run build        # Production build
npm run preview      # Preview production build
```

Frontend runs on port 5173.

### Testing

#### Backend Tests
```bash
cd backend
npm test             # Run API tests
npm run test:user    # Run user tests
npm run test:e2e     # Run end-to-end tests
npm run test:all     # Run all tests
```

#### Frontend Tests
```bash
cd frontend
npm test             # Run tests once
npm run test:watch   # Run tests in watch mode
```

### API Testing

Use `backend/tests/rest.http` with VS Code REST Client extension for manual API testing.

## Architecture

### Backend Structure

- **server.js** - Express app entry point, CORS config, route mounting
- **config/database.js** - PostgreSQL client (pg), auto-creates tables on startup
- **routes/** - Express routers (userRoutes.js, taskRoutes.js)
- **controllers/** - Request handlers, validation
- **services/** - Database query logic, webhook sending

### Frontend Structure

- **App.jsx** - React Router setup with two routes: `/` (Dashboard) and `/login`
- **pages/** - Main page components (DashboardPage, LoginPage)
- **components/** - Reusable UI (Navbar)
- **services/** - API communication via axios
  - `axiosInstance.js` - Configured axios with base URL from `VITE_API_URL`
  - `authService.js` - User registration and login calls
  - `taskService.js` - YouTube link CRUD, transcript fetching, status updates

### Database Schema (PostgreSQL)

- **users**: id, email (unique), created_at
- **youtube_links**: id, user_id, title, youtube_url, notes, status, created_at

Status values: `pending`, `sent`, `processed`, `failed`

### API Endpoints

#### Users
- `POST /api/users/` - Register user
- `POST /api/users/:email` - Login user
- `DELETE /api/users/:email` - Delete user

#### YouTube Links
- `POST /api/tasks` - Create YouTube link
- `GET /api/tasks/:userId` - Get user's links
- `GET /api/tasks/:linkId/:userId` - Get single link
- `PUT /api/tasks/:linkId` - Update link
- `PATCH /api/tasks/:linkId/status` - Update link status
- `DELETE /api/tasks/:linkId` - Delete link

## n8n Webhook Integration

The frontend communicates directly with n8n webhooks for transcript and chat functionality:

### Transcript Webhook
When user clicks "Get transcript", the frontend POSTs to `VITE_N8N_WEBHOOK_URL`:
```json
{
  "email": "user@example.com",
  "title": "Video title",
  "youtube_url": "https://youtube.com/watch?v=..."
}
```

### Chat Webhook
When user clicks "Chat", the frontend:
1. POSTs to `VITE_N8N_WEBHOOK_URL` to send video data
2. Opens `VITE_N8N_CHAT_WEBHOOK_URL` in a new tab for AI chat

## Environment Variables

### Backend (.env)

```
POSTGRES_HOST=localhost
POSTGRES_USER=postgres
POSTGRES_PORT=5431
POSTGRES_PASSWORD=<password>
POSTGRES_DB=postgres
FRONTEND_URL=http://localhost:5173
PORT=3000

# n8n Webhook Configuration (optional, for backend webhook calls)
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/youtube-links
```

### Frontend (.env)

```
VITE_API_URL=http://localhost:3000
VITE_N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/transcript
VITE_N8N_CHAT_WEBHOOK_URL=https://your-n8n-instance.com/webhook/chat
```

## Tech Stack

- **Frontend**: React 18, React Router 7, Tailwind CSS, Vite, Axios
- **Backend**: Express.js (ES modules), PostgreSQL (pg client), Axios, express-validator
- **Testing**: Vitest + Testing Library (frontend), Supertest (backend)
- **Dev tools**: Nodemon (backend hot reload)
- **Integration**: n8n webhooks for transcript fetching and AI chat
