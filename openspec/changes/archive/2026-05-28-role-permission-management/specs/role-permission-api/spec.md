## ADDED Requirements

### Requirement: Role CRUD via REST API
The system SHALL provide RESTful API endpoints for managing roles at `/api/roles` following the existing controller/service/resource pattern.

#### Scenario: List roles with pagination and permissions
- **WHEN** an authorized user with `view-roles` permission sends `GET /api/roles`
- **THEN** the server responds with paginated role data including `id`, `name`, `permissions` (array of permission names), `users_count`, and timestamps

#### Scenario: List roles with search
- **WHEN** an authorized user sends `GET /api/roles?search=admin`
- **THEN** the response includes only roles whose name matches the search term

#### Scenario: Create a new role with permissions
- **WHEN** an authorized user with `create-roles` permission sends `POST /api/roles` with `name` and `permissions` array
- **THEN** the server creates the role, syncs the specified permissions, and responds with the new role including its permissions

#### Scenario: Create a role without permissions
- **WHEN** an authorized user sends `POST /api/roles` with only `name`
- **THEN** the server creates the role with no permissions assigned

#### Scenario: View a single role with details
- **WHEN** an authorized user with `view-roles` permission sends `GET /api/roles/{id}`
- **THEN** the server responds with the role's `id`, `name`, `permissions`, `users_count`, and timestamps

#### Scenario: Update a role name and permissions
- **WHEN** an authorized user with `update-roles` permission sends `PUT /api/roles/{id}` with updated `name` and `permissions`
- **THEN** the server updates the role name, syncs permissions (replacing previous assignments), and responds with the updated role

#### Scenario: Delete a role
- **WHEN** an authorized user with `delete-roles` permission sends `DELETE /api/roles/{id}`
- **THEN** the server removes the role and responds with a success message

### Requirement: Role API authorization
The system SHALL enforce permission-based authorization on all role management endpoints.

#### Scenario: Superadmin can manage roles
- **WHEN** a user with the `superadmin` role sends any role management request
- **THEN** the server allows the request to proceed

#### Scenario: Admin cannot manage roles
- **WHEN** a user with the `admin` role (without role-management permissions) sends a role management request
- **THEN** the server responds with `403 Forbidden`

#### Scenario: User cannot manage roles
- **WHEN** a user with the `user` role sends a role management request
- **THEN** the server responds with `403 Forbidden`

#### Scenario: Unauthenticated request is rejected
- **WHEN** an unauthenticated request is sent to any role management endpoint
- **THEN** the server responds with `401 Unauthorized`

### Requirement: Role validation via Form Requests
The system SHALL validate role creation and update input using dedicated Form Request classes.

#### Scenario: Create role requires name
- **WHEN** a `POST /api/roles` request is sent without a `name` field
- **THEN** the server responds with `422 Unprocessable Entity` and a `name` validation error

#### Scenario: Create role requires unique name
- **WHEN** a `POST /api/roles` request is sent with a `name` that already exists (same guard)
- **THEN** the server responds with `422 Unprocessable Entity` and a `name` uniqueness error

#### Scenario: Update role allows same name
- **WHEN** a `PUT /api/roles/{id}` request is sent with the role's current name
- **THEN** the server accepts the request without a uniqueness error

#### Scenario: Update role rejects duplicate name from another role
- **WHEN** a `PUT /api/roles/{id}` request is sent with a name belonging to a different role
- **THEN** the server responds with `422 Unprocessable Entity` and a `name` uniqueness error

#### Scenario: Role permissions must exist in database
- **WHEN** a role creation or update request includes a permission name that does not exist
- **THEN** the server responds with `422 Unprocessable Entity` and a `permissions` validation error

### Requirement: Permission listing via API
The system SHALL provide a read-only endpoint listing all available permissions.

#### Scenario: List all permissions
- **WHEN** an authorized user with `view-roles` permission sends `GET /api/permissions`
- **THEN** the server responds with an array of all permissions, each containing `id` and `name`, ordered alphabetically

#### Scenario: Unauthorized permission listing
- **WHEN** a user without `view-roles` permission sends `GET /api/permissions`
- **THEN** the server responds with `403 Forbidden`

### Requirement: Role search endpoint preserved
The system SHALL maintain the existing `GET /api/roles/search` endpoint for use in role selection dropdowns.

#### Scenario: Search roles for dropdown
- **WHEN** an authenticated user sends `GET /api/roles/search?search=admin`
- **THEN** the server responds with paginated role data matching the search term
