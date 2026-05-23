## Requirements

### Requirement: Role-based access control via Spatie Laravel Permission
The system SHALL use Spatie Laravel Permission to manage roles and permissions, stored in the database and assignable at runtime via the `HasRoles` trait on the User model. The system SHALL provide three default roles forming a hierarchy: `superadmin` (system owner with all permissions), `admin` (content manager), and `user` (default for new registrations).

#### Scenario: Superadmin holds all permissions explicitly
- **WHEN** a user with the `superadmin` role calls `$user->getAllPermissions()`
- **THEN** the result includes every permission defined in the database

#### Scenario: Admin role has admin-panel access but not user management
- **WHEN** a user with the `admin` role calls `$user->can('access-admin-panel')`
- **THEN** the result is `true`
- **AND** when the same user calls `$user->can('view-users')`, the result is `false`

#### Scenario: User role has profile editing only
- **WHEN** a user with the `user` role calls `$user->can('edit-profile')`
- **THEN** the result is `true`
- **AND** when the same user calls `$user->can('access-admin-panel')`, the result is `false`

### Requirement: Controller-level authorization
The system SHALL enforce authorization in controllers using `$this->authorize()` with permission names before performing operations.

#### Scenario: Authorized user accesses resource
- **WHEN** an authenticated user with the required permission sends a request to a protected endpoint
- **THEN** the controller allows the request to proceed

#### Scenario: Unauthorized user accesses resource
- **WHEN** an authenticated user WITHOUT the required permission sends a request to a protected endpoint
- **THEN** the controller responds with `403 Forbidden`

### Requirement: Roles and permissions are seeded via RolesAndPermissionsSeeder
The system SHALL provide a database seeder that creates the three default roles, the grouped permission set, and assigns permissions to roles per the defined hierarchy. The `superadmin` role SHALL be assigned ALL permissions explicitly via the seeder.

#### Scenario: Running RolesAndPermissionsSeeder creates three roles
- **WHEN** `php artisan db:seed --class=RolesAndPermissionsSeeder` is executed
- **THEN** the `superadmin`, `admin`, and `user` roles exist in the database

#### Scenario: Seeder creates user-management permissions
- **WHEN** the seeder runs
- **THEN** the permissions `view-users`, `create-users`, `update-users`, `delete-users` exist

#### Scenario: Seeder creates role-management permissions
- **WHEN** the seeder runs
- **THEN** the permissions `view-roles`, `create-roles`, `update-roles`, `delete-roles`, `assign-roles` exist

#### Scenario: Seeder creates profile and admin-panel permissions
- **WHEN** the seeder runs
- **THEN** the permissions `edit-profile` and `access-admin-panel` exist

#### Scenario: Seeder grants all permissions to superadmin role
- **WHEN** the seeder runs
- **THEN** the `superadmin` role holds every permission defined in the database

#### Scenario: Seeder grants admin role its permissions
- **WHEN** the seeder runs
- **THEN** the `admin` role holds `access-admin-panel` and `edit-profile`
- **AND** the `admin` role does NOT hold any user-management or role-management permissions

#### Scenario: Seeder grants user role its permissions
- **WHEN** the seeder runs
- **THEN** the `user` role holds only `edit-profile`
- **AND** the `user` role does NOT hold `access-admin-panel`

### Requirement: User permissions are included in API responses
The system SHALL include the authenticated user's roles and effective permissions in the user API response. Because permissions are explicit (no `Gate::before` bypass), the `permissions` array uniformly reflects what the user can actually do.

#### Scenario: User data includes permissions and roles
- **WHEN** the frontend fetches `GET /api/users/auth`
- **THEN** the response includes a `roles` array with the user's role names
- **AND** the response includes a `permissions` array with the user's effective permission names
- **AND** the response includes boolean flags `is_superadmin`, `is_admin`, `is_user`

#### Scenario: Superadmin response includes all permissions
- **WHEN** a superadmin user fetches `GET /api/users/auth`
- **THEN** the response's `permissions` array contains every permission defined in the database

### Requirement: Permission cache management
The system SHALL leverage Spatie Permission's built-in cache to minimize permission table queries, with the cache automatically flushed when roles or permissions change.

#### Scenario: Permission cache is used on subsequent requests
- **WHEN** a user's permissions are checked multiple times within a request
- **THEN** the system reads from the in-memory cache rather than re-querying the database

#### Scenario: Cache flushed on role assignment change
- **WHEN** an admin assigns a new role to a user via the API
- **THEN** Spatie Permission flushes the cache so the change takes effect immediately

### Requirement: Admin-panel access is gated by `access-admin-panel` permission
The system SHALL define an `access-admin-panel` permission that gates entry to the `/admin/*` area. Both `admin` and `superadmin` roles SHALL hold this permission explicitly.

#### Scenario: Admin role can access admin panel
- **WHEN** an admin user calls `$user->can('access-admin-panel')`
- **THEN** the result is `true`

#### Scenario: Superadmin can access admin panel
- **WHEN** a superadmin user calls `$user->can('access-admin-panel')`
- **THEN** the result is `true` (granted explicitly)

#### Scenario: User role cannot access admin panel
- **WHEN** a user with only the `user` role calls `$user->can('access-admin-panel')`
- **THEN** the result is `false`

### Requirement: Role flags are exposed via User model accessors
The system SHALL expose `is_superadmin`, `is_admin`, and `is_user` boolean accessors on the User model that reflect role assignment, available via `$user->is_superadmin` etc. and serialized in API responses.

#### Scenario: is_superadmin returns true for superadmin role
- **WHEN** a user with the `superadmin` role accesses `$user->is_superadmin`
- **THEN** the result is `true`

#### Scenario: is_admin returns true for admin role
- **WHEN** a user with the `admin` role accesses `$user->is_admin`
- **THEN** the result is `true`

#### Scenario: is_user returns true for user role
- **WHEN** a user with the `user` role accesses `$user->is_user`
- **THEN** the result is `true`

### Requirement: `default_route_for_user()` helper for login redirect
The system SHALL provide a global helper function `default_route_for_user(?User $user): string` that returns the default route path for a given user based on their permissions.

#### Scenario: Returns /admin for users with access-admin-panel
- **WHEN** `default_route_for_user($user)` is called with a user who has the `access-admin-panel` permission
- **THEN** the function returns the string `/admin`

#### Scenario: Returns / for users without access-admin-panel
- **WHEN** `default_route_for_user($user)` is called with a user who does not have the `access-admin-panel` permission (e.g., `user` role)
- **THEN** the function returns the string `/`

#### Scenario: Returns / for null user
- **WHEN** `default_route_for_user(null)` is called
- **THEN** the function returns the string `/`
