## Requirements

### Requirement: User model with profile fields
The system SHALL store users with name, email, and password fields (Laravel default schema).

#### Scenario: User has name attribute
- **WHEN** the user's data is serialized
- **THEN** a `name` attribute is included as stored in the database

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

### Requirement: User search and filtering
The system SHALL support search across user fields and filtering by role.

#### Scenario: Search users by name
- **WHEN** a request includes `?search=john`
- **THEN** the response includes only users whose name, username, or email match the search term

#### Scenario: Filter users by role
- **WHEN** a request includes `?filters[role]=admin`
- **THEN** the response includes only users with the "admin" role

### Requirement: User avatar upload via MediaLibrary
The system SHALL allow avatar uploads for users using Spatie MediaLibrary with automatic conversions.

#### Scenario: Upload avatar
- **WHEN** an authorized user sends `PUT /api/users/{id}/avatar` with a file
- **THEN** the server stores the file, generates conversions (300px, 600px, 1200px crops), and responds with the updated user

#### Scenario: Avatar URLs are included in user response
- **WHEN** user data is serialized via API Resource
- **THEN** the response includes `avatar_url` (original) and `avatar_thumb_url` (300px) fields

### Requirement: Service layer handles business logic
The system SHALL delegate business logic from controllers to service classes (`UserService`).

#### Scenario: Controller delegates to service
- **WHEN** the UserController receives a create request
- **THEN** it validates via Form Request, authorizes, then calls `UserService::create()` for the actual logic

### Requirement: API Resources transform user data
The system SHALL use Eloquent API Resources to transform user model data for API responses.

#### Scenario: UserResource transforms timestamps
- **WHEN** a user record is returned via API
- **THEN** `created_at` and `updated_at` are formatted as human-readable relative time (diffForHumans)

#### Scenario: UserResource includes direct permissions on show endpoint
- **WHEN** a single user is fetched via `GET /api/users/{id}`
- **THEN** the response includes a `direct_permissions` array of permission name strings assigned directly to the user (not via roles)

### Requirement: Form Requests validate user input
The system SHALL use dedicated Form Request classes for store and update validation.

#### Scenario: StoreUserRequest validates required fields
- **WHEN** a create request is missing required fields
- **THEN** the server responds with `422 Unprocessable Entity` and field-specific error messages

### Requirement: Token-based auth for mobile/external clients
The system SHALL provide a `POST /api/sanctum/token` endpoint for generating bearer tokens for non-SPA clients.

#### Scenario: Generate token with valid credentials
- **WHEN** a client sends `POST /api/sanctum/token` with email, password, and device_name
- **THEN** the server responds with a plain-text bearer token

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

### Requirement: User list is ordered by newest first by default
The system SHALL return users ordered by `created_at` descending when no explicit sort is provided.

#### Scenario: Default ordering returns newest user first
- **WHEN** `GET /api/users` is called without sort params
- **THEN** the response data is ordered from the most recently created user to the oldest

### Requirement: Password reset requires confirmation
The system SHALL validate `password_confirmation` when `password` is provided in a user update request.

#### Scenario: Password update with matching confirmation succeeds
- **WHEN** `PUT /api/users/{id}` is sent with `password` and matching `password_confirmation`
- **THEN** the server accepts the request and updates the password

#### Scenario: Password update with mismatched confirmation fails validation
- **WHEN** `PUT /api/users/{id}` is sent with `password` and a non-matching `password_confirmation`
- **THEN** the server responds with `422 Unprocessable Entity`
