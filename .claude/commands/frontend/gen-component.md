# Generate Component Command

Generate a React component following the project's component architecture patterns.

## Arguments

- `$ARGUMENTS` - Component name and optional category (e.g., "Button", "common/Card", "dashboard/StatsPanel")

## Instructions

Generate a React component file based on the specified name and category.

### Component Categories

1. **common/** - Reusable UI components (Modal, Toast, Button, StatusBadge, LoadingSpinner)
2. **dashboard/** - Dashboard-specific components (FilterCards, LinksTable, LinkTableRow)
3. **dashboard/modals/** - Modal dialogs for dashboard CRUD operations
4. **No prefix** - Standalone components in components root

### File Location Rules

- `common/{Name}` → `frontend/src/components/common/{Name}.jsx`
- `dashboard/{Name}` → `frontend/src/components/dashboard/{Name}.jsx`
- `dashboard/modals/{Name}` → `frontend/src/components/dashboard/modals/{Name}.jsx`
- `{Name}` (no category) → `frontend/src/components/{Name}.jsx`

### Component Requirements

1. **File Structure**:
   ```javascript
   import React from "react";
   // Additional imports as needed

   export default function ComponentName({ prop1, prop2 }) {
     // Component logic

     return (
       // JSX
     );
   }
   ```

2. **Naming Convention**:
   - PascalCase for component names
   - File name matches component name exactly
   - Props destructured in function signature

3. **Styling**:
   - Use Tailwind CSS classes inline
   - Follow existing component styling patterns
   - Common color palette: indigo for primary actions, gray for neutral, red for errors, green for success

4. **Props Pattern**:
   - Destructure props in function signature
   - Use sensible defaults where appropriate
   - Document required vs optional props

### Component Templates by Category

**Common Component (Presentational)**:
```javascript
import React from "react";

export default function ComponentName({ children, className = "", ...props }) {
  return (
    <div className={`base-styles ${className}`} {...props}>
      {children}
    </div>
  );
}
```

**Dashboard Component (Feature-Specific)**:
```javascript
import React from "react";
// Import utilities, constants as needed

export default function ComponentName({ data, onAction, isLoading = false }) {
  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="...">
      {/* Component content */}
    </div>
  );
}
```

**Modal Component**:
```javascript
import React from "react";
import Modal from "../../common/Modal";

export default function ComponentNameModal({ isOpen, onClose, data, onSubmit }) {
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(/* form data */);
  };

  return (
    <Modal title="Modal Title" onClose={onClose}>
      <form onSubmit={handleSubmit}>
        {/* Form fields */}
        <div className="flex justify-end gap-2 mt-4">
          <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 hover:text-gray-800">
            Cancel
          </button>
          <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
            Submit
          </button>
        </div>
      </form>
    </Modal>
  );
}
```

### Before Generating

Ask the user for:
1. **Component category**: common, dashboard, dashboard/modals, or root
2. **Props needed**: What data/callbacks will the component receive?
3. **Purpose**: Brief description of what the component does
4. **Interactive elements**: Forms, buttons, click handlers needed?

### After Generating

1. Inform the user to import the component:
   ```javascript
   import ComponentName from "../components/category/ComponentName";
   ```

2. Suggest running `/frontend:gen-component-test {ComponentName}` to create tests

3. If the component uses utilities, remind about imports from `../utils/` or `../constants/`

### Reference Files

Study these existing components for patterns:
- `frontend/src/components/common/Modal.jsx` - Base modal pattern
- `frontend/src/components/common/Toast.jsx` - Notification pattern
- `frontend/src/components/common/StatusBadge.jsx` - Display component
- `frontend/src/components/dashboard/FilterCards.jsx` - Interactive dashboard component
- `frontend/src/components/dashboard/LinksTable.jsx` - Data display component
