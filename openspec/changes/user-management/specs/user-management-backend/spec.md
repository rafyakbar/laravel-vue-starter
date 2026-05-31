## MODIFIED Requirements

### Requirement: User CRUD via API
The system SHALL provide RESTful API endpoints for managing users at `/api/users`.

#### Scenario: List users with pagination
- **WHEN** an authorized user sends `GET /api/users`
- **THEN** the server responds with paginated user data (10 per page) as API Resources

#### Scenario: Create a new user
- **WHEN** an authorized user sends `POST /api/users` with valid data
- **THEN** the server creates the user, assigns roles, and responds with the new record

#### Scenario: Update an existing user with roles and permissions
- **WHEN** an authorized user sends `PUT /api/users/{id}` with updated data including optional `roles` and `permissions` arrays
- **THEN** the server updates the user record (email cannot be changed), syncs roles via `syncRoles()`, and syncs direct permissions via `syncPermissions()`

#### Scenario: Delete a user
- **WHEN** an authorized user sends `DELETE /api/users/{id}`
- **THEN** the server soft-deletes or removes the user and responds with success

### Requirement: API Resources transform user data
The system SHALL use Eloquent API Resources to transform user model data for API responses.

#### Scenario: UserResource transforms timestamps
- **WHEN** a user record is returned via API
- **THEN** `created_at` and `updated_at` are formatted as human-readable relative time (diffForHumans)

#### Scenario: UserResource includes direct permissions on show endpoint
- **WHEN** a single user is fetched via `GET /api/users/{id}`
- **THEN** the response includes a `direct_permissions` array of permission name strings assigned directly to the user (not via roles)

## ADDED Requirements

### Requirement: Direct permission sync on user update
The system SHALL allow syncing direct permissions on a user via the update endpoint.

#### Scenario: Sync direct permissions
- **WHEN** an authorized user sends `PUT /api/users/{id}` with a `permissions` array
- **THEN** the server calls `$user->syncPermissions($permissions)` and the user's direct permissions match the provided array

#### Scenario: Skip permission sync when field absent
- **WHEN** an authorized user sends `PUT /api/users/{id}` without a `permissions` field
- **THEN** the server does NOT modify the user's existing direct permissions

#### Scenario: Clear all direct permissions with empty array
- **WHEN** an authorized user sends `PUT /api/users/{id}` with `permissions: []`
- **THEN** the server removes all direct permissions from the user

### Requirement: UpdateUserRequest validates permissions field
The system SHALL validate the optional `permissions` field on user update requests.

#### Scenario: Valid permissions array passes validation
- **WHEN** the request includes `permissions: ["edit-profile", "view-users"]` with valid permission names
- **THEN** the request passes validation

#### Scenario: Invalid permission name fails validation
- **WHEN** the request includes `permissions: ["nonexistent-permission"]`
- **THEN** the server responds with `422 Unprocessable Entity` indicating the permission does not exist
