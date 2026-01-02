# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Github Branch Manager is a task management application with a React frontend and Express.js backend, using PostgreSQL for persistence.

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

### API Testing

Use `backend/tests/rest.http` with VS Code REST Client extension for manual API testing.

## Architecture

### Backend Structure

- **server.js** - Express app entry point, CORS config, route mounting
- **config/database.js** - PostgreSQL client (pg), auto-creates tables on startup
- **routes/** - Express routers (userRoutes.js, taskRoutes.js)
- **controllers/** - Request handlers, validation, response formatting
- **services/** - Database query logic

### Frontend Structure

- **App.jsx** - React Router setup with two routes: `/` (Dashboard) and `/login`
- **pages/** - Main page components (DashboardPage, LoginPage)
- **components/** - Reusable UI (Navbar, auth/, shared/)
- **services/** - API communication via axios
  - `axiosInstance.js` - Configured axios with base URL from `VITE_API_URL`
  - `authService.js` - User registration and login calls

### Database Schema (PostgreSQL)

- **users**: id, email (unique), created_at
- **tasks**: id, user_id, task_name, repository_branch, project_name, status, task_description, deadline, created_at

### API Endpoints

- `POST /api/users/` - Register user
- `POST /api/users/:email` - Login user
- `DELETE /api/users/:email` - Delete user
- `POST /api/tasks` - Create task
- `GET /api/tasks/:userId` - Get user's tasks
- `GET /api/tasks/:taskId/:userId` - Get single task
- `PUT /api/tasks/:taskId/:userId` - Update task
- `DELETE /api/tasks/:taskId/:userId` - Delete task

## Environment Variables

### Backend (.env)

```
POSTGRES_HOST=localhost
POSTGRES_USER=postgres
POSTGRES_PORT=5431
POSTGRES_PASSWORD=<password>
POSTGRES_DB=postgres
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)

```
VITE_API_URL=http://localhost:3000
```

## Tech Stack

- **Frontend**: React 18, React Router 7, Tailwind CSS, Vite, Axios
- **Backend**: Express.js (ES modules), PostgreSQL (pg client)
- **Dev tools**: Nodemon (backend hot reload)
