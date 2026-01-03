# Generate Controller Command

Generate an Express.js controller for the backend following existing codebase patterns.

## Arguments

- `$ARGUMENTS` - Resource name (e.g., "project", "comment", "notification")

## Instructions

Generate a controller file at `backend/src/controllers/{resource}Controller.js` for the specified resource.

### Controller Requirements

1. **File Location**: `backend/src/controllers/{resource}Controller.js`

2. **Import Pattern**: Import service functions from the corresponding service file:
   ```javascript
   import { create{Resource}, get{Resource}s, get{Resource}ById, update{Resource}, delete{Resource} } from "../services/{resource}Service.js";
   ```

3. **Export Style**: Use named exports for all controller functions (no default export)

4. **Naming Convention**: Function names should follow `{action}{Resource}Controller` pattern:
   - `create{Resource}Controller` - Handle POST requests to create a resource
   - `get{Resource}sController` - Handle GET requests to list resources (plural)
   - `get{Resource}Controller` - Handle GET request for a single resource
   - `update{Resource}Controller` - Handle PUT requests to update a resource
   - `delete{Resource}Controller` - Handle DELETE requests to remove a resource

5. **Function Structure**: Each controller function must:
   - Be an `async` function accepting `(req, res)` parameters
   - Wrap logic in try/catch for error handling
   - Extract params from `req.params` and body data from `req.body`
   - Validate required fields and return 400 status with `{ message: "..." }` if invalid
   - Call the appropriate service function
   - Return appropriate HTTP status codes:
     - 201 for successful creation
     - 200 for successful retrieval/update/deletion
     - 400 for validation errors
     - 404 for not found
     - 500 for server errors
   - Return JSON responses in format: `{ message: "...", {resource}: data }` or `{ {resource}s: data }`

6. **Error Handling Pattern**:
   ```javascript
   try {
     // ... logic
   } catch (error) {
     res.status(500).json({ message: "Server error", error: error.message });
   }
   ```

### Example Output Structure

For resource "project", generate:

```javascript
import {
  createProject,
  getProjects,
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

    const projects = await getProjects(user_id);

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

### Additional Context

Before generating the controller:

1. **Ask the user** for the fields/properties the resource will have (e.g., name, description, status, deadline)
2. **Ask which CRUD operations** are needed (default: all five - create, getAll, getOne, update, delete)
3. **Ask if the resource is user-scoped** (requires user_id for ownership/filtering)

After generating:

1. Inform the user they may need to run `/gen-service {resource}` to create the corresponding service
2. Inform the user they may need to create routes in `backend/src/routes/{resource}Routes.js`
3. Inform the user they may need to register routes in `backend/src/server.js`

### Integration Notes

This command is designed to work with:
- `/gen-service` - Generates the service layer that this controller depends on
- Future `/gen-routes` - Would generate the Express router for this controller
- Future `/gen-full-resource` - Would orchestrate all generators for a complete resource
