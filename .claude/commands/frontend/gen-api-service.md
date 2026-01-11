# Generate API Service Command

Generate a frontend API service for communicating with the backend following existing codebase patterns.

## Arguments

- `$ARGUMENTS` - Resource name (e.g., "project", "comment", "notification")

## Instructions

Generate a service file at `frontend/src/services/{resource}Service.js` for the specified resource.

### API Service Requirements

1. **File Location**: `frontend/src/services/{resource}Service.js`

2. **Import Pattern**: Import the configured axios instance:
   ```javascript
   import api from "./axiosInstance";
   ```

3. **Export Style**: Use named exports for all service functions (no default export)

4. **Naming Convention**: Function names should follow these patterns:
   - `create{Resource}` - POST request to create a resource
   - `get{Resource}s` - GET request to fetch all resources (for a user)
   - `get{Resource}ById` - GET request to fetch a single resource
   - `edit{Resource}` - PUT request to update a resource
   - `delete{Resource}ById` - DELETE request to remove a resource

5. **Function Structure**: Each service function must:
   - Be an `async` function
   - Wrap the API call in try/catch
   - Use the `api` instance (not raw axios)
   - Return the axios response directly
   - Log errors to console in catch block

6. **API Path Patterns**:
   - Create: `POST /api/{resources}`
   - Get all: `GET /api/{resources}/:userId`
   - Get one: `GET /api/{resources}/:resourceId/:userId`
   - Update: `PUT /api/{resources}/:resourceId`
   - Delete: `DELETE /api/{resources}/:resourceId/:userId`

### Example Output Structure

For resource "project" with fields (user_id, name, description, status), generate:

```javascript
import api from "./axiosInstance";

export async function createProject(user_id, name, description) {
  try {
    const response = await api.post("/api/projects", {
      user_id: user_id,
      name: name,
      description: description,
    });

    return response;
  } catch (error) {
    console.log(error.message);
  }
}

export async function getProjects(user_id) {
  try {
    const response = await api.get(`/api/projects/${user_id}`);
    return response;
  } catch (error) {
    console.log(error.message);
  }
}

export async function getProjectById(project_id, user_id) {
  try {
    const response = await api.get(`/api/projects/${project_id}/${user_id}`);
    return response;
  } catch (error) {
    console.log(error.message);
  }
}

export async function editProject(
  projectId,
  name,
  description,
  status
) {
  try {
    const response = await api.put(`/api/projects/${projectId}`, {
      name: name,
      description: description,
      status: status,
    });
    return response;
  } catch (error) {
    console.log(error.message);
  }
}

export async function deleteProjectById(project_id, user_id) {
  try {
    const response = await api.delete(`/api/projects/${project_id}/${user_id}`);
    return response;
  } catch (error) {
    console.log(error.message);
  }
}
```

### Additional Context

Before generating the service:

1. **Ask for the fields/properties** the resource has (for create and edit functions)
2. **Ask which CRUD operations** are needed (default: all five)
3. **Ask if the resource is user-scoped** (affects API paths with userId)
4. **Confirm the API base path** (default: `/api/{resources}`)

After generating:

1. Inform the user they can import the service in their components:
   ```javascript
   import { createProject, getProjects, editProject, deleteProjectById } from "../services/projectService";
   ```

2. Remind user to ensure the backend endpoints exist (run `/gen-full-resource {resource}` if needed)

### Usage in Components

Provide example usage for React components:

```javascript
// In a React component
import { useState, useEffect } from "react";
import { getProjects, createProject, deleteProjectById } from "../services/projectService";

function ProjectList({ userId }) {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    async function fetchProjects() {
      const response = await getProjects(userId);
      if (response?.data?.projects) {
        setProjects(response.data.projects);
      }
    }
    fetchProjects();
  }, [userId]);

  const handleCreate = async (name, description) => {
    const response = await createProject(userId, name, description);
    if (response?.data?.project) {
      setProjects([response.data.project, ...projects]);
    }
  };

  const handleDelete = async (projectId) => {
    const response = await deleteProjectById(projectId, userId);
    if (response?.status === 200) {
      setProjects(projects.filter(p => p.id !== projectId));
    }
  };

  // ... render
}
```

### Response Data Access

Remind the user about axios response structure:
- `response.data` - The response body from the backend
- `response.data.{resource}` - Single resource (create, update, get one)
- `response.data.{resources}` - Array of resources (get all)
- `response.data.message` - Status message from backend
- `response.status` - HTTP status code

### Integration Notes

This command is designed to work with:

- `/gen-full-resource` - Generates the complete backend for this resource
- `/gen-service` - Generates backend service layer
- `/gen-controller` - Generates backend controller layer
- `/gen-routes` - Generates backend routes layer

### Complete Full-Stack Flow

```
Backend:
/gen-full-resource {resource}  -> Service + Controller + Routes + SQL

Frontend:
/gen-api-service {resource}    -> API service for axios calls
```

After running both, you have a complete CRUD flow from frontend to database.
