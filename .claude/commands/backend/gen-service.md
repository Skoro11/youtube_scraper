# Generate Service Command

Generate a PostgreSQL service layer for the backend following existing codebase patterns.

## Arguments

- `$ARGUMENTS` - Resource name (e.g., "project", "comment", "notification")

## Instructions

Generate a service file at `backend/src/services/{resource}Service.js` for the specified resource.

### Service Requirements

1. **File Location**: `backend/src/services/{resource}Service.js`

2. **Import Pattern**: Import the database client:

   ```javascript
   import client from "../config/database.js";
   ```

3. **Export Style**: Use named exports for all service functions (no default export)

4. **Naming Convention**: Function names should follow these patterns:

   - `create{Resource}` - Insert a new record
   - `get{Resource}s` or `get{Resource}sByUser` - Fetch multiple records (use ByUser suffix if user-scoped)
   - `get{Resource}ById` - Fetch a single record by ID
   - `update{Resource}` - Update an existing record
   - `delete{Resource}` - Remove a record

5. **Function Structure**: Each service function must:

   - Be an `async` function
   - Use parameterized queries with `$1, $2, ...` placeholders (NEVER interpolate values directly)
   - Use backtick template literals for multi-line SQL
   - Return appropriate data:
     - `create`: Return `result.rows[0]` (the created record)
     - `getAll`: Return `result.rows` (array of records)
     - `getById`: Return `result.rows[0] || null`
     - `update`: Return `result.rows[0] || null`
     - `delete`: Return `result.rowCount > 0` (boolean) OR `result.rows[0]` (deleted record)

6. **SQL Patterns**:

   **INSERT** - Always use RETURNING to get the created record:

   ```javascript
   const result = await client.query(
     `
     INSERT INTO {table} (column1, column2, ...)
     VALUES ($1, $2, ...)
     RETURNING id, column1, column2, ..., created_at
     `,
     [value1, value2, ...]
   );
   return result.rows[0];
   ```

   **SELECT ALL** - Order by created_at DESC for consistent ordering:

   ```javascript
   const result = await client.query(
     `
     SELECT id, column1, column2, ..., created_at
     FROM {table}
     WHERE user_id = $1
     ORDER BY created_at DESC
     `,
     [user_id]
   );
   return result.rows;
   ```

   **SELECT BY ID**:

   ```javascript
   const result = await client.query(
     `
     SELECT id, column1, column2, ..., created_at
     FROM {table}
     WHERE id = $1 AND user_id = $2
     `,
     [id, user_id]
   );
   return result.rows[0] || null;
   ```

   **UPDATE** - Use RETURNING to get the updated record:

   ```javascript
   const result = await client.query(
     `
     UPDATE {table}
     SET column1 = $1, column2 = $2, ...
     WHERE id = $n
     RETURNING id, column1, column2, ..., created_at
     `,
     [value1, value2, ..., id]
   );
   return result.rows[0] || null;
   ```

   **DELETE**:

   ```javascript
   const result = await client.query(
     `
     DELETE FROM {table}
     WHERE id = $1
     RETURNING id
     `,
     [id]
   );
   return result.rowCount > 0;
   ```

### Example Output Structure

For resource "project" with fields (user_id, name, description, status), generate:

```javascript
import client from "../config/database.js";

export async function createProject(user_id, name, description) {
  const status = "active";

  const result = await client.query(
    `
    INSERT INTO projects (user_id, name, description, status)
    VALUES ($1, $2, $3, $4)
    RETURNING id, user_id, name, description, status, created_at
    `,
    [user_id, name, description, status]
  );

  return result.rows[0];
}

export async function getProjectsByUser(user_id) {
  const result = await client.query(
    `
    SELECT id, user_id, name, description, status, created_at
    FROM projects
    WHERE user_id = $1
    ORDER BY created_at DESC
    `,
    [user_id]
  );

  return result.rows;
}

export async function getProjectById(project_id, user_id) {
  const result = await client.query(
    `
    SELECT id, user_id, name, description, status, created_at
    FROM projects
    WHERE id = $1 AND user_id = $2
    `,
    [project_id, user_id]
  );

  return result.rows[0] || null;
}

export async function updateProject(project_id, name, description, status) {
  const result = await client.query(
    `
    UPDATE projects
    SET name = $1, description = $2, status = $3
    WHERE id = $4
    RETURNING id, user_id, name, description, status, created_at
    `,
    [name, description, status, project_id]
  );

  return result.rows[0] || null;
}

export async function deleteProject(project_id, user_id) {
  const result = await client.query(
    `
    DELETE FROM projects
    WHERE id = $1 AND user_id = $2
    RETURNING id
    `,
    [project_id, user_id]
  );

  return result.rowCount > 0;
}
```

### Additional Context

Before generating the service:

1. **Ask the user** for the database table name (default: pluralized resource name, e.g., "project" -> "projects")
2. **Ask for the fields/columns** the table has (e.g., name, description, status, deadline)
3. **Ask which CRUD operations** are needed (default: all five - create, getAll, getById, update, delete)
4. **Ask if the resource is user-scoped** (requires user_id column for ownership filtering)
5. **Ask for any default values** on create (e.g., status = "pending")

After generating:

1. Inform the user they may need to add the table to `backend/src/config/database.js` if it auto-creates tables
2. Inform the user they can run `/gen-controller {resource}` to create the corresponding controller
3. Remind about SQL migration if the table doesn't exist yet

### Database Table Creation

If the user needs the table created, provide a CREATE TABLE statement:

```sql
CREATE TABLE IF NOT EXISTS {table} (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Integration Notes

This command is designed to work with:

- `/gen-controller` - Generates the controller layer that imports this service
- Future `/gen-routes` - Would generate the Express router
- Future `/gen-full-resource` - Would orchestrate all generators for a complete resource

### Security Reminders

- ALWAYS use parameterized queries ($1, $2, etc.) - NEVER concatenate user input into SQL
- The service layer should not handle HTTP concerns (status codes, request/response objects)
- Keep business logic minimal - services are primarily for database operations
