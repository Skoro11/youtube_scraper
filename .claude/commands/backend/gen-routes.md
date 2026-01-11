# Generate Routes Command

Generate an Express.js router for the backend following existing codebase patterns.

## Arguments

- `$ARGUMENTS` - Resource name (e.g., "project", "comment", "notification")

## Instructions

Generate a routes file at `backend/src/routes/{resource}Routes.js` for the specified resource.

### Routes Requirements

1. **File Location**: `backend/src/routes/{resource}Routes.js`

2. **Import Pattern**:

   ```javascript
   import express from "express";
   import {
     create{Resource}Controller,
     get{Resource}sController,
     get{Resource}Controller,
     update{Resource}Controller,
     delete{Resource}Controller,
   } from "../controllers/{resource}Controller.js";
   ```

3. **Router Setup**:

   ```javascript
   const router = express.Router();
   ```

4. **Export Style**: Use default export for the router:

   ```javascript
   export default router;
   ```

5. **REST Route Patterns** (standard CRUD):

   | Method | Path                   | Controller                   | Description                |
   | ------ | ---------------------- | ---------------------------- | -------------------------- |
   | POST   | `/`                    | `create{Resource}Controller` | Create new resource        |
   | GET    | `/:userId`             | `get{Resource}sController`   | Get all resources for user |
   | GET    | `/:resourceId/:userId` | `get{Resource}Controller`    | Get single resource        |
   | PUT    | `/:resourceId`         | `update{Resource}Controller` | Update resource            |
   | DELETE | `/:resourceId/:userId` | `delete{Resource}Controller` | Delete resource            |

6. **Route Comments**: Add brief comments above each route indicating the full path:
   ```javascript
   // POST /api/{resources}
   router.post("/", create{Resource}Controller);
   ```

### Example Output Structure

For resource "project", generate:

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

### Additional Context

Before generating the routes:

1. **Ask which CRUD operations** are needed (default: all five - create, getAll, getOne, update, delete)
2. **Ask if the resource is user-scoped** (affects whether userId is included in paths)
3. **Ask about any custom routes** beyond standard CRUD (e.g., `PATCH /:id/status`)

After generating:

1. **Provide the server.js registration code** the user needs to add:

   ```javascript
   // Add this import at the top of backend/src/server.js
   import {resource}Routes from "./routes/{resource}Routes.js";

   // Add this line with the other app.use() statements
   app.use("/api/{resources}", {resource}Routes);
   ```

2. Inform the user they need to run `/gen-controller {resource}` if they haven't already
3. Inform the user they need to run `/gen-service {resource}` if they haven't already

### Route Variations

**For non-user-scoped resources** (e.g., public data):

```javascript
// GET /api/projects
router.get("/", getProjectsController);

// GET /api/projects/:projectId
router.get("/:projectId", getProjectController);

// DELETE /api/projects/:projectId
router.delete("/:projectId", deleteProjectController);
```

**For nested resources** (e.g., comments on tasks):

```javascript
// POST /api/tasks/:taskId/comments
router.post("/:taskId/comments", createCommentController);

// GET /api/tasks/:taskId/comments
router.get("/:taskId/comments", getCommentsController);
```

**For custom actions**:

```javascript
// PATCH /api/projects/:projectId/archive
router.patch("/:projectId/archive", archiveProjectController);

// POST /api/projects/:projectId/duplicate
router.post("/:projectId/duplicate", duplicateProjectController);
```

### Server.js Registration Template

Always provide this complete snippet for registering the new routes:

```javascript
// ============================================
// Add to backend/src/server.js
// ============================================

// 1. Add import at the top (with other route imports)
import {resource}Routes from "./routes/{resource}Routes.js";

// 2. Add route mounting (with other app.use statements)
app.use("/api/{resources}", {resource}Routes);
```

### Integration Notes

This command is designed to work with:

- `/gen-service` - Generates the service layer (database operations)
- `/gen-controller` - Generates the controller layer (request handling)
- Future `/gen-full-resource` - Would orchestrate all generators for a complete resource

### Complete Backend Flow

```
/gen-service {resource}    -> Creates {resource}Service.js
/gen-controller {resource} -> Creates {resource}Controller.js
/gen-routes {resource}     -> Creates {resource}Routes.js + server.js snippet
```

After running all three, the user just needs to:

1. Add the import and app.use() lines to server.js
2. Create the database table (if not exists)
3. Restart the backend server
