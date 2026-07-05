## Requirements

### Requirement: Users page displays user data in a table
The system SHALL render a paginated, searchable table of users on the `/admin/users` page showing name, email, username, roles, and avatar.

#### Scenario: Page loads with user data
- **WHEN** a user with `view-users` permission navigates to `/admin/users`
- **THEN** the page displays a table with columns: Avatar, Name, Email, Username, Roles, and Actions
- **AND** the table shows paginated user data

#### Scenario: Roles displayed as badges
- **WHEN** the users table renders a user with roles
- **THEN** role names are shown as badges in the Roles column

#### Scenario: Search filters users
- **WHEN** the user types in the search input
- **THEN** the table refetches with users matching the search term (name, email, or username)

#### Scenario: Empty state when no results
- **WHEN** the search returns no matching users
- **THEN** the table displays a "No data found" message

### Requirement: Create user dialog
The system SHALL provide a dialog for creating new users with name, username, email, password, and role checkboxes.

#### Scenario: Open create dialog
- **WHEN** the user clicks the "Create User" button
- **THEN** a dialog opens with fields: Name, Username, Email, Password, and a scrollable grid of role checkboxes

#### Scenario: Create user with selected roles
- **WHEN** the user fills all required fields, selects roles, and clicks "Save"
- **THEN** the system sends `POST /api/users` with the name, username, email, password, and selected roles
- **AND** the dialog closes and the table refreshes with the new user

#### Scenario: Validation errors displayed inline
- **WHEN** the user submits an invalid form (e.g., duplicate email)
- **THEN** the server's 422 validation error messages are displayed below the relevant fields

### Requirement: Edit user dialog
The system SHALL provide a dialog for editing existing users, pre-populated with current data, including role and direct permission assignment.

#### Scenario: Open edit dialog
- **WHEN** the user clicks the edit button on a user row
- **THEN** a dialog opens with the user's current name, username, their roles pre-checked, and their direct permissions pre-checked

#### Scenario: Edit dialog does not show email field
- **WHEN** the edit dialog opens
- **THEN** the email field is NOT present (email cannot be changed per API contract)

#### Scenario: Update user roles and permissions
- **WHEN** the user modifies the name, role selection, or permission selection and clicks "Save"
- **THEN** the system sends `PUT /api/users/{id}` with the updated data including `roles` and `permissions` arrays
- **AND** the dialog closes and the table refreshes

#### Scenario: Validation errors on edit
- **WHEN** the user submits an invalid edit form
- **THEN** the server's 422 validation error messages are displayed below the relevant fields

### Requirement: Delete user confirmation
The system SHALL require confirmation before deleting a user.

#### Scenario: Open delete confirmation
- **WHEN** the user clicks the delete button on a user row
- **THEN** a confirmation dialog appears asking to confirm deletion

#### Scenario: Confirm deletion
- **WHEN** the user clicks "Confirm" in the delete dialog
- **THEN** the system sends `DELETE /api/users/{id}`
- **AND** the dialog closes and the table refreshes without the deleted user

#### Scenario: Cancel deletion
- **WHEN** the user clicks "Cancel" in the delete dialog
- **THEN** the dialog closes without sending any API request

### Requirement: User management page is restricted to authorized users
The system SHALL restrict access to the users page based on permissions.

#### Scenario: Admin cannot access users page
- **WHEN** a user with only `access-admin-panel` permission navigates to `/admin/users`
- **THEN** the page shows a forbidden/restricted state or redirects away

#### Scenario: Superadmin can access users page
- **WHEN** a superadmin navigates to `/admin/users`
- **THEN** the page loads successfully with the user table and "Create User" button visible

### Requirement: Responsive user management UI
The system SHALL render the users page correctly at mobile (375x667) and tablet (768x1024) viewports.

#### Scenario: Users page is accessible on mobile via sidebar drawer
- **WHEN** a superadmin on mobile (375x667) opens the sidebar drawer and clicks "Users"
- **THEN** the browser navigates to `/admin/users` and the page heading is visible

#### Scenario: Users table is visible on tablet viewport
- **WHEN** a superadmin on tablet (768x1024) navigates to `/admin/users`
- **THEN** the table renders with column headers and user data visible
- **AND** the bottom nav is NOT visible

### Requirement: Current user cannot edit or delete themselves in the users table
The system SHALL disable the edit and delete action buttons for the currently authenticated user's row in the users table, while still displaying that row in the list.

#### Scenario: Current user row is visible in the table
- **WHEN** a superadmin views `/admin/users`
- **THEN** their own account appears in the table as a normal row

#### Scenario: Edit button is not available for the current user's own row
- **WHEN** a superadmin views the row belonging to their own account
- **THEN** the edit button is NOT rendered or is disabled

#### Scenario: Delete button is not available for the current user's own row
- **WHEN** a superadmin views the row belonging to their own account
- **THEN** the delete button is NOT rendered or is disabled

### Requirement: Reset password dialog
The system SHALL provide a separate dialog to reset a user's password, requiring a new password and confirmation. This dialog is distinct from the edit user dialog.

#### Scenario: Open reset password dialog
- **WHEN** the user clicks the "Reset Password" button on a user row (excluding their own row)
- **THEN** a dialog opens with two fields: New Password and Confirm Password

#### Scenario: Reset password with matching confirmation succeeds
- **WHEN** the user fills both fields with matching values and clicks "Reset Password"
- **THEN** the system sends `PUT /api/users/{id}` with `password` and `password_confirmation`
- **AND** the dialog closes on success

#### Scenario: Reset password with mismatched confirmation shows error
- **WHEN** the user fills both fields with non-matching values and submits
- **THEN** the server returns a 422 and the error is displayed below the confirm field

#### Scenario: Reset password button not shown for current user
- **WHEN** the current user views their own row
- **THEN** the reset password button is NOT rendered
