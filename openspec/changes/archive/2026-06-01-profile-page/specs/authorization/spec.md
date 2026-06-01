## ADDED Requirements

### Requirement: All roles have test coverage for the edit-profile permission
The system SHALL have Pest tests verifying that superadmin, admin, and user can each update their own profile (info, password, avatar), and that a user role cannot update another user's avatar via the API endpoint.

#### Scenario: Superadmin can update their own profile info
- **WHEN** superadmin sends a valid profile info update request
- **THEN** the server responds with success and the user record is updated

#### Scenario: Admin can update their own profile info
- **WHEN** admin sends a valid profile info update request
- **THEN** the server responds with success and the user record is updated

#### Scenario: User role can update their own profile info
- **WHEN** a user with the `user` role sends a valid profile info update request
- **THEN** the server responds with success and the user record is updated

#### Scenario: Superadmin can change their own password
- **WHEN** superadmin sends a password change request with the correct current password
- **THEN** the server responds with success and the password is updated

#### Scenario: Admin can change their own password
- **WHEN** admin sends a password change request with the correct current password
- **THEN** the server responds with success and the password is updated

#### Scenario: User role can change their own password
- **WHEN** a user with the `user` role sends a password change request with the correct current password
- **THEN** the server responds with success and the password is updated

#### Scenario: Superadmin can upload their own avatar
- **WHEN** superadmin sends a `PUT /api/users/{self}/avatar` request with a valid image
- **THEN** the server responds with success and the avatar is updated

#### Scenario: Admin can upload their own avatar
- **WHEN** admin sends a `PUT /api/users/{self}/avatar` request with a valid image
- **THEN** the server responds with success and the avatar is updated

#### Scenario: User role can upload their own avatar
- **WHEN** a user with the `user` role sends a `PUT /api/users/{self}/avatar` request with a valid image
- **THEN** the server responds with success and the avatar is updated

#### Scenario: User role cannot upload another user's avatar
- **WHEN** a user with the `user` role sends a `PUT /api/users/{other_user}/avatar` request
- **THEN** the server responds with 403 Forbidden

### Requirement: Seeder grants edit-profile to all three roles
The system SHALL verify via test that the `RolesAndPermissionsSeeder` correctly assigns the `edit-profile` permission to superadmin, admin, and user roles.

#### Scenario: Superadmin has edit-profile permission after seeding
- **WHEN** the seeder runs
- **THEN** a user with the `superadmin` role passes `$user->can('edit-profile')` check

#### Scenario: Admin has edit-profile permission after seeding
- **WHEN** the seeder runs
- **THEN** a user with the `admin` role passes `$user->can('edit-profile')` check

#### Scenario: User role has edit-profile permission after seeding
- **WHEN** the seeder runs
- **THEN** a user with the `user` role passes `$user->can('edit-profile')` check
