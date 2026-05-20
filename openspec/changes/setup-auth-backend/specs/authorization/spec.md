## ADDED Requirements

### Requirement: Role-based access control via Bouncer
The system SHALL use Silber Bouncer to manage roles and abilities, stored in the database and assignable at runtime.

#### Scenario: Admin role has full access
- **WHEN** a user with the "admin" role attempts any action
- **THEN** the system SHALL allow the action (admin has `everything()` ability)

#### Scenario: Regular role has limited access
- **WHEN** a user with the "regular" role attempts an action beyond `edit-profile`
- **THEN** the system SHALL deny the action with `403 Forbidden`

### Requirement: Controller-level authorization
The system SHALL enforce authorization in controllers using `$this->authorize()` before performing operations.

#### Scenario: Authorized user accesses resource
- **WHEN** an authenticated user with the required ability sends a request to a protected endpoint
- **THEN** the controller allows the request to proceed

#### Scenario: Unauthorized user accesses resource
- **WHEN** an authenticated user WITHOUT the required ability sends a request to a protected endpoint
- **THEN** the controller responds with `403 Forbidden`

### Requirement: Roles are seeded via BouncerSeeder
The system SHALL provide a database seeder that creates default roles and assigns abilities.

#### Scenario: Running BouncerSeeder
- **WHEN** `php artisan db:seed --class=BouncerSeeder` is executed
- **THEN** the "admin" role with `everything()` ability and "regular" role with `edit-profile` ability are created

### Requirement: User abilities are included in API responses
The system SHALL include the authenticated user's abilities in the user API response so the frontend can perform client-side access control.

#### Scenario: User data includes abilities array
- **WHEN** the frontend fetches `GET /api/users/auth`
- **THEN** the response includes an `abilities` array with the user's assigned abilities
