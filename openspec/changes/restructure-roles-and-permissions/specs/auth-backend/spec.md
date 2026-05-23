## MODIFIED Requirements

### Requirement: Public registration assigns default role
The system SHALL assign the `user` role to any account created via the public registration endpoint (`POST /register` via Fortify's `CreateNewUser` action). This is the lowest-privilege role and grants only `edit-profile` permission.

#### Scenario: Public registration assigns user role
- **WHEN** a new account is created via `POST /register`
- **THEN** the new user record has the `user` role assigned
- **AND** the new user does NOT have `admin` or `superadmin` roles

#### Scenario: Newly registered user can edit their own profile
- **WHEN** a newly registered user calls `$user->can('edit-profile')`
- **THEN** the result is `true`

#### Scenario: Newly registered user cannot access admin panel
- **WHEN** a newly registered user calls `$user->can('access-admin-panel')`
- **THEN** the result is `false`
