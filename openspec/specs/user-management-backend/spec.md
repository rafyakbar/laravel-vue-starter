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

#### Scenario: Update an existing user
- **WHEN** an authorized user sends `PUT /api/users/{id}` with updated data
- **THEN** the server updates the user record (email cannot be changed)

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
