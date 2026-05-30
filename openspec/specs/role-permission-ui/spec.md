## ADDED Requirements

### Requirement: Roles page displays role data in a table
The system SHALL render a paginated, searchable table of roles on the `/admin/roles` page showing role name, assigned permissions, and user count.

#### Scenario: Page loads with role data
- **WHEN** a user with `view-roles` permission navigates to `/admin/roles`
- **THEN** the page displays a table with columns: Role Name, Permissions, and Users count
- **AND** the table shows all seeded roles (superadmin, admin, user)

#### Scenario: Permissions displayed as badges
- **WHEN** the roles table renders a role with permissions
- **THEN** up to 3 permission names are shown as badges, with a "+N" indicator for additional permissions

#### Scenario: Search filters roles
- **WHEN** the user types in the search input
- **THEN** the table refetches with roles matching the search term

#### Scenario: Empty state when no results
- **WHEN** the search returns no matching roles
- **THEN** the table displays a "No data found" message

### Requirement: Create role dialog
The system SHALL provide a dialog for creating new roles with a name field and permission checkboxes.

#### Scenario: Open create dialog
- **WHEN** the user clicks the "Create Role" button
- **THEN** a dialog opens with a role name input and a scrollable grid of permission checkboxes

#### Scenario: Create role with selected permissions
- **WHEN** the user fills the role name, selects permissions, and clicks "Save"
- **THEN** the system sends `POST /api/roles` with the name and selected permissions
- **AND** the dialog closes and the table refreshes with the new role

#### Scenario: Validation errors displayed inline
- **WHEN** the user submits an invalid form (e.g., duplicate name)
- **THEN** the server's validation error messages are displayed below the relevant fields

### Requirement: Edit role dialog
The system SHALL provide a dialog for editing existing roles, pre-populated with current data.

#### Scenario: Open edit dialog
- **WHEN** the user clicks the edit button on a role row
- **THEN** a dialog opens with the role's current name and its permissions pre-checked

#### Scenario: Update role permissions
- **WHEN** the user modifies the name or permission selection and clicks "Save"
- **THEN** the system sends `PUT /api/roles/{id}` with the updated data
- **AND** the dialog closes and the table refreshes

### Requirement: Delete role confirmation
The system SHALL require confirmation before deleting a role.

#### Scenario: Open delete confirmation
- **WHEN** the user clicks the delete button on a role row
- **THEN** a confirmation dialog appears with the message "Are you sure you want to delete this role? This action cannot be undone."

#### Scenario: Confirm deletion
- **WHEN** the user clicks "Confirm" in the delete dialog
- **THEN** the system sends `DELETE /api/roles/{id}`
- **AND** the dialog closes and the table refreshes without the deleted role

#### Scenario: Cancel deletion
- **WHEN** the user clicks "Cancel" in the delete dialog
- **THEN** the dialog closes without sending any API request

### Requirement: Reusable DataTable shared component
The system SHALL provide a generic `DataTable` component in `resources/app/components/shared/` that supports search, pagination, loading skeleton, and customizable cell rendering via slots.

#### Scenario: DataTable renders columns and data
- **WHEN** the DataTable receives `columns` and `data` props
- **THEN** it renders a table with the specified column headers and row data

#### Scenario: DataTable shows loading skeleton
- **WHEN** the `loading` prop is `true`
- **THEN** the table displays skeleton placeholders instead of data rows

#### Scenario: DataTable emits search and pagination events
- **WHEN** the user types in the search input or clicks pagination buttons
- **THEN** the DataTable emits `update:search` and `page-change` events respectively

### Requirement: Reusable ConfirmDialog shared component
The system SHALL provide a `ConfirmDialog` component in `resources/app/components/shared/` that wraps the shadcn-vue Dialog with standardized confirm/cancel actions.

#### Scenario: ConfirmDialog displays title and description
- **WHEN** the ConfirmDialog is opened with `title` and `description` props
- **THEN** it renders a dialog with the specified heading and description text

#### Scenario: ConfirmDialog emits confirm event
- **WHEN** the user clicks the confirm button
- **THEN** the component emits a `confirm` event

### Requirement: i18n support for role management
The system SHALL provide translation keys for all role management UI text in both English (`en.ts`) and Indonesian (`id.ts`).

#### Scenario: English translations rendered
- **WHEN** the language preference is set to English
- **THEN** the roles page displays "Roles & Permissions", "Create Role", "Role Name", "Permissions", etc.

#### Scenario: Indonesian translations rendered
- **WHEN** the language preference is set to Indonesian
- **THEN** the roles page displays "Peran & Izin", "Buat Peran", "Nama Peran", "Izin", etc.
