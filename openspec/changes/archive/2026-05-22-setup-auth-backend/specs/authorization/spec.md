## ADDED Requirements

### Requirement: Role-based access control via Spatie Laravel Permission
The system SHALL use Spatie Laravel Permission to manage roles and permissions, stored in the database and assignable at runtime via the `HasRoles` trait on the User model.

#### Scenario: Admin role has full access
- **WHEN** a user with the "admin" role attempts any action requiring authorization
- **THEN** the system SHALL allow the action via the `Gate::before` callback that grants admins access to all gates and policies

#### Scenario: Regular role has limited access
- **WHEN** a user with the "regular" role attempts an action that requires a permission they don't have
- **THEN** the system SHALL deny the action with `403 Forbidden`

#### Scenario: Regular role can edit their own profile
- **WHEN** a user with the "regular" role attempts the `edit-profile` action
- **THEN** the system SHALL allow the action because `regular` is granted the `edit-profile` permission

### Requirement: Super-admin bypass via Gate::before
The system SHALL register a `Gate::before` callback in `AppServiceProvider` that grants the `admin` role unconditional access to all authorization checks.

#### Scenario: Admin bypasses individual permission checks
- **WHEN** an admin user calls `$user->can('any-permission')` for a permission they have not been explicitly granted
- **THEN** the call returns `true` due to the `Gate::before` callback

#### Scenario: Non-admin requires explicit permission
- **WHEN** a non-admin user calls `$user->can('view-users')` without that permission
- **THEN** the call returns `false`

### Requirement: Controller-level authorization
The system SHALL enforce authorization in controllers using `$this->authorize()` with permission names before performing operations.

#### Scenario: Authorized user accesses resource
- **WHEN** an authenticated user with the required permission sends a request to a protected endpoint
- **THEN** the controller allows the request to proceed

#### Scenario: Unauthorized user accesses resource
- **WHEN** an authenticated user WITHOUT the required permission sends a request to a protected endpoint
- **THEN** the controller responds with `403 Forbidden`

### Requirement: Roles and permissions are seeded via RolesAndPermissionsSeeder
The system SHALL provide a database seeder that creates default roles and permissions and assigns permissions to roles.

#### Scenario: Running RolesAndPermissionsSeeder
- **WHEN** `php artisan db:seed --class=RolesAndPermissionsSeeder` is executed
- **THEN** the "admin" and "regular" roles are created
- **AND** the user-management permissions (`view-users`, `create-users`, `update-users`, `delete-users`) and `edit-profile` permission are created
- **AND** the `regular` role is assigned the `edit-profile` permission

### Requirement: User permissions are included in API responses
The system SHALL include the authenticated user's roles and effective permissions in the user API response so the frontend can perform client-side access control.

#### Scenario: User data includes permissions and roles
- **WHEN** the frontend fetches `GET /api/users/auth`
- **THEN** the response includes a `roles` array with the user's role names
- **AND** the response includes a `permissions` array with the user's effective permission names (computed via `getAllPermissions()` for non-admin, or a sentinel value indicating super-admin for admin users)

### Requirement: Permission cache management
The system SHALL leverage Spatie Permission's built-in cache to minimize permission table queries, with the cache automatically flushed when roles or permissions change.

#### Scenario: Permission cache is used on subsequent requests
- **WHEN** a user's permissions are checked multiple times within a request
- **THEN** the system reads from the in-memory cache rather than re-querying the database

#### Scenario: Cache flushed on role assignment change
- **WHEN** an admin assigns a new role to a user via the API
- **THEN** Spatie Permission flushes the cache so the change takes effect immediately
