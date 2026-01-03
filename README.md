# Branch Manager

A task management application designed for developers to track their work across different GitHub repository branches and projects.

## Features

- **Task Management**: Create, view, edit, and delete tasks
- **Branch Tracking**: Associate tasks with specific GitHub repository branches
- **Project Organization**: Group tasks by project name
- **Status Tracking**: Track task progress with statuses (Pending, In Progress, Completed)
- **Deadline Management**: Set and monitor task deadlines
- **Filter Tasks**: Filter tasks by status for better organization
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
- Nodemon (development)

## Project Structure

```
branch-manager/
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
│   │   ├── controllers/      # Request handlers
│   │   ├── routes/           # API route definitions
│   │   ├── services/         # Database query logic
│   │   └── server.js         # Express app entry point
│   └── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with your database credentials:
   ```env
   POSTGRES_HOST=localhost
   POSTGRES_USER=postgres
   POSTGRES_PORT=5432
   POSTGRES_PASSWORD=your_password
   POSTGRES_DB=postgres
   FRONTEND_URL=http://localhost:5173
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
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/users/` | Register a new user |
| POST | `/api/users/:email` | Login user |
| DELETE | `/api/users/:email` | Delete user |

### Tasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/tasks` | Create a new task |
| GET | `/api/tasks/:userId` | Get all tasks for a user |
| GET | `/api/tasks/:taskId/:userId` | Get a specific task |
| PUT | `/api/tasks/:taskId/:userId` | Update a task |
| DELETE | `/api/tasks/:taskId/:userId` | Delete a task |

## Database Schema

### Users Table
| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Primary key |
| email | VARCHAR(100) | Unique user email |
| created_at | TIMESTAMP | Account creation date |

### Tasks Table
| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Primary key |
| user_id | INTEGER | Foreign key to users |
| task_name | VARCHAR(100) | Name of the task |
| repository_branch | VARCHAR(100) | Associated Git branch |
| project_name | VARCHAR(100) | Project name |
| status | VARCHAR(100) | pending, in_progress, completed |
| task_description | TEXT | Detailed description |
| deadline | TIMESTAMPTZ | Task deadline |
| created_at | TIMESTAMPTZ | Task creation date |

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
4. Create tasks with:
   - Task name
   - GitHub repository branch
   - Project name
   - Description
   - Deadline
5. View, edit, or delete tasks from the dashboard
6. Filter tasks by status using the filter cards

## License

MIT
