## ADDED Requirements

### Requirement: Test infrastructure uses RefreshDatabase
The test suite SHALL use `RefreshDatabase` for the `Feature` directory and run against an in-memory SQLite database for fast, isolated test runs.

#### Scenario: Pest.php enables RefreshDatabase
- **WHEN** the test suite is loaded
- **THEN** `tests/Pest.php` binds `RefreshDatabase` to all tests in the `Feature` directory

#### Scenario: phpunit.xml uses in-memory SQLite
- **WHEN** tests run via `php artisan test`
- **THEN** the database connection is `sqlite` and the database is `:memory:`

### Requirement: Reusable Pest helpers for authenticated users
The test suite SHALL provide global helper functions in `tests/Pest.php` for common authenticated-user setup so tests can call them without duplicating code.

#### Scenario: actingAsAdmin helper
- **WHEN** a test calls `actingAsAdmin()`
- **THEN** roles and permissions are seeded, an admin user is created and assigned the `admin` role
- **AND** the test is logged in as that user via `actingAs()`

#### Scenario: actingAsRegular helper
- **WHEN** a test calls `actingAsRegular()`
- **THEN** roles and permissions are seeded, a regular user is created and assigned the `regular` role
- **AND** the test is logged in as that user via `actingAs()`

### Requirement: User factory states for roles
The `UserFactory` SHALL provide `admin()` and `regular()` states so tests can create users with specific roles without manual `assignRole` calls.

#### Scenario: Factory admin state
- **WHEN** a test calls `User::factory()->admin()->create()`
- **THEN** a user is created and assigned the `admin` role (assuming roles are seeded first)

#### Scenario: Factory regular state
- **WHEN** a test calls `User::factory()->regular()->create()`
- **THEN** a user is created and assigned the `regular` role (assuming roles are seeded first)

### Requirement: Login flow tests
The test suite SHALL include feature tests covering the login flow for both email and username, including success, failure, and rate limiting cases.

#### Scenario: Login with valid email
- **WHEN** the test posts valid email + password to `/login` with `Accept: application/json`
- **THEN** the response is 200, the user is authenticated, and the response body contains `{"user": {...}}`

#### Scenario: Login with valid username
- **WHEN** the test posts valid username + password to `/login` with `Accept: application/json`
- **THEN** the response is 200 and the user is authenticated

#### Scenario: Login with invalid credentials
- **WHEN** the test posts wrong password to `/login`
- **THEN** the response is 422 and the user is not authenticated

#### Scenario: Login rate limiting
- **WHEN** the test posts wrong credentials more than 5 times within a minute for the same identifier+IP
- **THEN** the response is 429 Too Many Requests

### Requirement: Registration flow tests
The test suite SHALL include feature tests covering registration including success, duplicate email, duplicate username, and assignment of the `regular` role.

#### Scenario: Successful registration
- **WHEN** the test posts valid name, username, email, password, password_confirmation to `/register`
- **THEN** the response is 201 (or 200), the user exists in the database, and the user has the `regular` role

#### Scenario: Registration with duplicate email
- **WHEN** the test posts to `/register` with an email that already exists
- **THEN** the response is 422 with an `email` validation error

#### Scenario: Registration with duplicate username
- **WHEN** the test posts to `/register` with a username that already exists
- **THEN** the response is 422 with a `username` validation error

### Requirement: Password reset flow tests
The test suite SHALL include feature tests covering forgot-password and reset-password endpoints.

#### Scenario: Request password reset link
- **WHEN** the test posts a valid email to `/forgot-password` with `Notification::fake()` enabled
- **THEN** the response is successful and a `ResetPassword` notification is sent to the user

#### Scenario: Reset password with valid token
- **WHEN** the test posts a valid token, email, password, and password_confirmation to `/reset-password`
- **THEN** the response is successful and the user's password is updated

### Requirement: Email verification flow test
The test suite SHALL include a feature test covering the email verification notification endpoint.

#### Scenario: Send verification notification
- **WHEN** an unverified authenticated user posts to `/email/verification-notification` with `Notification::fake()` enabled
- **THEN** a `VerifyEmail` notification is sent

### Requirement: Profile and password update tests
The test suite SHALL include feature tests covering profile information update and password update endpoints.

#### Scenario: Update profile information
- **WHEN** an authenticated user puts updated name and email to `/user/profile-information`
- **THEN** the response is successful and the user record is updated in the database

#### Scenario: Update password with correct current password
- **WHEN** an authenticated user puts a valid `current_password` and a new `password` (with confirmation) to `/user/password`
- **THEN** the response is successful and the password hash in the database matches the new password

#### Scenario: Update password with incorrect current password
- **WHEN** an authenticated user puts an incorrect `current_password` to `/user/password`
- **THEN** the response is 422

### Requirement: Logout flow test
The test suite SHALL include a feature test covering the logout endpoint.

#### Scenario: Successful logout
- **WHEN** an authenticated user posts to `/logout`
- **THEN** the response is successful and the user is no longer authenticated

### Requirement: Authorization tests for permissions and Gate::before
The test suite SHALL include feature tests verifying Spatie Permission RBAC behavior and the `Gate::before` super-admin bypass.

#### Scenario: Admin can perform any action via Gate::before
- **WHEN** the test calls `$admin->can('arbitrary-permission')` for any permission name
- **THEN** the result is `true` because `Gate::before` returns true for users with the `admin` role

#### Scenario: Non-admin without permission denied
- **WHEN** the test calls `$user->can('view-users')` on a regular user without the `view-users` permission
- **THEN** the result is `false`

#### Scenario: Non-admin with permission allowed
- **WHEN** the test calls `$user->can('edit-profile')` on a regular user (who has `edit-profile` via the `regular` role)
- **THEN** the result is `true`

#### Scenario: RolesAndPermissionsSeeder creates expected roles and permissions
- **WHEN** the test runs the seeder
- **THEN** the `admin` and `regular` roles exist
- **AND** the `view-users`, `create-users`, `update-users`, `delete-users`, `edit-profile` permissions exist
- **AND** the `regular` role has the `edit-profile` permission

### Requirement: User CRUD API tests
The test suite SHALL include feature tests covering the `/api/users` resource endpoints with authorization checks.

#### Scenario: Admin can list users
- **WHEN** an admin user gets `/api/users`
- **THEN** the response is 200 with paginated user data

#### Scenario: Regular user cannot list users
- **WHEN** a regular user gets `/api/users`
- **THEN** the response is 403

#### Scenario: Admin can create a user
- **WHEN** an admin user posts valid user data (with roles array) to `/api/users`
- **THEN** the response is successful and the user exists with assigned roles

#### Scenario: Admin can update a user
- **WHEN** an admin user puts updated data to `/api/users/{user}`
- **THEN** the response is successful and the user record is updated

#### Scenario: Admin can delete a user
- **WHEN** an admin user deletes `/api/users/{user}`
- **THEN** the response is successful and the user no longer exists

#### Scenario: Unauthenticated request returns 401
- **WHEN** an unauthenticated request is sent to `/api/users`
- **THEN** the response is 401

### Requirement: User search and filter tests
The test suite SHALL include feature tests for searching users by keyword and filtering by role.

#### Scenario: Search users by name
- **WHEN** an admin gets `/api/users?search=john`
- **THEN** the response includes only users whose `name`, `username`, or `email` contains "john"

#### Scenario: Filter users by role
- **WHEN** an admin gets `/api/users?filters[role]=admin`
- **THEN** the response includes only users with the `admin` role

### Requirement: Avatar upload test
The test suite SHALL include a feature test for the avatar upload endpoint using a fake uploaded file.

#### Scenario: Upload avatar
- **WHEN** an authenticated user puts a fake image to `/api/users/{user}/avatar`
- **THEN** the response is successful and the user has a media item in the `avatars` collection

### Requirement: Auth endpoint test
The test suite SHALL include a feature test for `/api/users/auth` covering authenticated and unauthenticated cases.

#### Scenario: Authenticated user fetches own data
- **WHEN** an authenticated user gets `/api/users/auth`
- **THEN** the response contains the user's data including `roles` and `permissions` arrays

#### Scenario: Unauthenticated user is rejected
- **WHEN** an unauthenticated request is sent to `/api/users/auth`
- **THEN** the response is 401

### Requirement: Sanctum token endpoint test
The test suite SHALL include a feature test for `POST /api/sanctum/token` covering token generation for valid and invalid credentials.

#### Scenario: Generate token with valid credentials
- **WHEN** the test posts valid email, password, and device_name to `/api/sanctum/token`
- **THEN** the response is 200 and contains a `token` field with a non-empty string

#### Scenario: Reject token request with invalid credentials
- **WHEN** the test posts an incorrect password to `/api/sanctum/token`
- **THEN** the response is 422

### Requirement: All tests pass via php artisan test
The test suite SHALL be runnable via `php artisan test --compact` with all tests passing.

#### Scenario: Full test suite passes
- **WHEN** `php artisan test --compact` is executed
- **THEN** the exit code is 0 and all tests pass with zero failures
