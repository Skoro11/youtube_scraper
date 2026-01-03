# Generate Full Resource Command

Generate a complete backend resource with service, controller, routes, and database table in one flow.

## Arguments

- `$ARGUMENTS` - Resource name (e.g., "project", "comment", "notification")

## Instructions

This command orchestrates the creation of a complete backend resource by generating all necessary layers in the correct order.

### Step 1: Gather Requirements

Before generating any files, collect all necessary information upfront:

1. **Resource name**: Use the provided argument (e.g., "project")
2. **Table name**: Ask user or default to pluralized resource (e.g., "projects")
3. **Fields/columns**: Ask user for the resource properties:
   - Field name
   - Data type (VARCHAR, TEXT, INTEGER, BOOLEAN, TIMESTAMP, etc.)
   - Required or optional
   - Default value (if any)
4. **User-scoped**: Ask if the resource belongs to a user (has user_id foreign key)
5. **CRUD operations**: Ask which operations are needed (default: all five)
6. **Default status**: Ask if there's a status field with a default value (e.g., "pending", "active")

### Step 2: Generate Database Table SQL

Provide the CREATE TABLE statement first:

```sql
-- Add to database migration or run directly
CREATE TABLE IF NOT EXISTS {table} (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,  -- if user-scoped
  {field1} {TYPE} {constraints},
  {field2} {TYPE} {constraints},
  ...
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Step 3: Generate Service Layer

Create `backend/src/services/{resource}Service.js` with:

- Import database client
- CRUD functions matching the requested operations
- Parameterized SQL queries
- Proper return values (rows[0], rows, rowCount > 0)

Reference: Follow patterns from `/gen-service` command

### Step 4: Generate Controller Layer

Create `backend/src/controllers/{resource}Controller.js` with:

- Import service functions
- Async controller functions with req/res
- Input validation
- Proper HTTP status codes
- Error handling with try/catch

Reference: Follow patterns from `/gen-controller` command

### Step 5: Generate Routes Layer

Create `backend/src/routes/{resource}Routes.js` with:

- Import express and controllers
- REST route definitions
- Route comments with full paths

Reference: Follow patterns from `/gen-routes` command

### Step 6: Provide Server Registration

Output the code to add to `backend/src/server.js`:

```javascript
// Add import at top
import {resource}Routes from "./routes/{resource}Routes.js";

// Add with other app.use() statements
app.use("/api/{resources}", {resource}Routes);
```

### Example Complete Flow

For `/gen-full-resource project` with fields: name (required), description (optional), status (default: "active"):

**1. Database Table:**
```sql
CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**2. Service** (`backend/src/services/projectService.js`):
```javascript
import client from "../config/database.js";

export async function createProject(user_id, name, description) {
  const status = "active";
  const result = await client.query(
    `INSERT INTO projects (user_id, name, description, status)
     VALUES ($1, $2, $3, $4)
     RETURNING id, user_id, name, description, status, created_at`,
    [user_id, name, description, status]
  );
  return result.rows[0];
}

export async function getProjectsByUser(user_id) {
  const result = await client.query(
    `SELECT id, user_id, name, description, status, created_at
     FROM projects WHERE user_id = $1 ORDER BY created_at DESC`,
    [user_id]
  );
  return result.rows;
}

export async function getProjectById(project_id, user_id) {
  const result = await client.query(
    `SELECT id, user_id, name, description, status, created_at
     FROM projects WHERE id = $1 AND user_id = $2`,
    [project_id, user_id]
  );
  return result.rows[0] || null;
}

export async function updateProject(project_id, name, description, status) {
  const result = await client.query(
    `UPDATE projects SET name = $1, description = $2, status = $3
     WHERE id = $4
     RETURNING id, user_id, name, description, status, created_at`,
    [name, description, status, project_id]
  );
  return result.rows[0] || null;
}

export async function deleteProject(project_id, user_id) {
  const result = await client.query(
    `DELETE FROM projects WHERE id = $1 AND user_id = $2 RETURNING id`,
    [project_id, user_id]
  );
  return result.rowCount > 0;
}
```

**3. Controller** (`backend/src/controllers/projectController.js`):
```javascript
import {
  createProject,
  getProjectsByUser,
  getProjectById,
  updateProject,
  deleteProject,
} from "../services/projectService.js";

export async function createProjectController(req, res) {
  try {
    const { user_id, name, description } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Project name is required" });
    }
    const project = await createProject(user_id, name, description);
    res.status(201).json({ message: "Project created", project });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

export async function getProjectsController(req, res) {
  try {
    const { userId: user_id } = req.params;
    const projects = await getProjectsByUser(user_id);
    res.status(200).json({ projects });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

export async function getProjectController(req, res) {
  try {
    const { projectId: project_id, userId: user_id } = req.params;
    if (!project_id) {
      return res.status(400).json({ message: "Project ID is required" });
    }
    const project = await getProjectById(project_id, user_id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.status(200).json({ project });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

export async function updateProjectController(req, res) {
  try {
    const { projectId: project_id } = req.params;
    const { name, description, status } = req.body;
    if (!project_id) {
      return res.status(400).json({ message: "Project ID is required" });
    }
    const updatedProject = await updateProject(project_id, name, description, status);
    if (!updatedProject) {
      return res.status(404).json({ message: "Project not found or not allowed" });
    }
    res.status(200).json({ message: "Project updated", project: updatedProject });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

export async function deleteProjectController(req, res) {
  try {
    const { projectId: project_id, userId: user_id } = req.params;
    if (!project_id) {
      return res.status(400).json({ message: "Project ID is required" });
    }
    const deleted = await deleteProject(project_id, user_id);
    if (!deleted) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.status(200).json({ message: "Project deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}
```

**4. Routes** (`backend/src/routes/projectRoutes.js`):
```javascript
import express from "express";
import {
  createProjectController,
  getProjectsController,
  getProjectController,
  updateProjectController,
  deleteProjectController,
} from "../controllers/projectController.js";

const router = express.Router();

// POST /api/projects
router.post("/", createProjectController);

// GET /api/projects/:userId
router.get("/:userId", getProjectsController);

// GET /api/projects/:projectId/:userId
router.get("/:projectId/:userId", getProjectController);

// PUT /api/projects/:projectId
router.put("/:projectId", updateProjectController);

// DELETE /api/projects/:projectId/:userId
router.delete("/:projectId/:userId", deleteProjectController);

export default router;
```

**5. Server Registration** (add to `backend/src/server.js`):
```javascript
import projectRoutes from "./routes/projectRoutes.js";
app.use("/api/projects", projectRoutes);
```

### Output Summary

After generation, provide a summary:

```
✓ Generated backend/src/services/{resource}Service.js
✓ Generated backend/src/controllers/{resource}Controller.js
✓ Generated backend/src/routes/{resource}Routes.js

Next steps:
1. Run the CREATE TABLE SQL in your database
2. Add the import and app.use() lines to backend/src/server.js
3. Restart the backend server

API Endpoints created:
  POST   /api/{resources}              - Create {resource}
  GET    /api/{resources}/:userId      - Get all {resources}
  GET    /api/{resources}/:id/:userId  - Get single {resource}
  PUT    /api/{resources}/:id          - Update {resource}
  DELETE /api/{resources}/:id/:userId  - Delete {resource}
```

### Integration Notes

This command combines:
- `/gen-service` - Database operations layer
- `/gen-controller` - Request handling layer
- `/gen-routes` - API routing layer

For generating individual layers separately, use the specific commands above.
