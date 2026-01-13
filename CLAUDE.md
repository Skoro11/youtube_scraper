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

```
frontend/src/
├── components/
│   ├── common/           # Reusable UI components
│   │   ├── Modal.jsx
│   │   ├── Toast.jsx
│   │   ├── StatusBadge.jsx
│   │   └── LoadingSpinner.jsx
│   ├── dashboard/        # Dashboard-specific components
│   │   ├── FilterCards.jsx
│   │   ├── LinksTable.jsx
│   │   ├── LinkTableRow.jsx
│   │   └── modals/
│   │       ├── ViewLinkModal.jsx
│   │       ├── CreateLinkModal.jsx
│   │       └── EditLinkModal.jsx
│   └── Navbar.jsx
├── constants/
│   └── status.js         # LINK_STATUS, STATUS_CONFIG, FILTER_OPTIONS
├── hooks/
│   ├── useAuth.js        # Authentication state management
│   ├── useLinks.js       # YouTube links CRUD operations
│   ├── useToast.js       # Toast notification management
│   ├── useLinkForm.js    # Form state for link creation/editing
│   └── useN8nChat.js     # n8n chat widget integration
├── pages/
│   ├── DashboardPage.jsx # Main dashboard (container component)
│   └── LoginPage.jsx     # Login/registration page
├── services/
│   ├── axiosInstance.js  # Configured axios with base URL
│   ├── authService.js    # User registration and login
│   └── taskService.js    # YouTube link CRUD, webhooks
├── utils/
│   ├── youtube.js        # extractVideoId(), getThumbnailUrl()
│   ├── status.js         # getStatusStyle(), getStatusLabel()
│   └── date.js           # formatDate()
├── App.jsx               # React Router setup
└── main.jsx              # Entry point
```

#### Key Components

**Common Components (`components/common/`):**
- `Modal` - Generic modal wrapper with title, close button, content
- `Toast` - Notification component (success/error states)
- `StatusBadge` - Status display badge with styling
- `LoadingSpinner` - SVG-based loading spinner

**Dashboard Components (`components/dashboard/`):**
- `FilterCards` - Filter UI showing link counts (All/Processed/Failed)
- `LinksTable` - Table displaying all user's YouTube links
- `LinkTableRow` - Individual row with thumbnail, URL, status, actions
- Modals for CRUD operations (View, Create, Edit)

#### Custom Hooks (`hooks/`)

- `useAuth` - Retrieves user from localStorage, redirects if not authenticated
- `useLinks` - Manages link CRUD, filtering, webhook calls (sendWebhook, sendWebhookForChat)
- `useToast` - Toast visibility and auto-hide timeout
- `useLinkForm` - Form state with handleInputChange, setFormFromLink, resetForm
- `useN8nChat` - Initializes embedded n8n chat widget

#### Utilities (`utils/`)

- `youtube.js` - Extract video IDs, generate thumbnail URLs
- `status.js` - Get Tailwind styles and labels for status values
- `date.js` - Date formatting utilities

#### Constants (`constants/status.js`)

```javascript
LINK_STATUS = { PENDING, SENT, PROCESSED, FAILED }
STATUS_CONFIG = { [status]: { label, style } }
FILTER_OPTIONS = { ALL, PROCESSED, FAILED }
```

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
  "youtube_url": "https://youtube.com/watch?v=...",
  "use": "transcript"
}
```

### Embedded Chat Widget (RAG Integration)
The application uses `@n8n/chat` to embed a chat widget directly in the dashboard:

- **Initialization**: The `useN8nChat` hook initializes the widget when a processed link is available
- **Webhook URL**: Configured via `VITE_N8N_CHAT_WEBHOOK_URL`
- **Context**: Passes video metadata (title, URL) to the AI for context-aware responses
- **Cleanup**: Widget is removed when navigating away from the dashboard

The chat widget allows users to have AI-powered conversations about their processed YouTube videos.

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
- **Integration**: n8n webhooks for transcript fetching, @n8n/chat for embedded AI chat widget

## Architectural Patterns

### Frontend Architecture

**Container/Presentational Pattern:**
- `DashboardPage` is the container component managing all state
- Child components (FilterCards, LinksTable, modals) are presentational

**Custom Hooks for Logic Encapsulation:**
- Business logic extracted from components into reusable hooks
- Each hook has a single responsibility (auth, links, toast, form, chat)

**Modal-Based UI:**
- All CRUD operations happen in modal dialogs
- Consistent UX pattern for Create, View, and Edit operations

**Data Flow:**
```
DashboardPage (Container)
├── useAuth (user state)
├── useLinks (links CRUD & webhooks)
├── useToast (notifications)
├── useLinkForm (form state)
├── useN8nChat (chat widget)
└── Child Components
    ├── FilterCards
    ├── LinksTable → LinkTableRow
    └── Modals (Create, View, Edit)
```

### Status Lifecycle

Links follow this status progression:
1. `pending` - Initial state when link created
2. `sent` - After webhook sent to n8n
3. `processed` - After n8n processing complete
4. `failed` - If webhook or processing failed
