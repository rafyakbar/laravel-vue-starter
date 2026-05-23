## MODIFIED Requirements

### Requirement: Reusable Pest helpers for authenticated users
The test suite SHALL provide global helper functions in `tests/Pest.php` for common authenticated-user setup so tests can call them without duplicating code. The helpers SHALL match the three-role hierarchy: `superadmin`, `admin`, `user`.

#### Scenario: actingAsSuperadmin helper
- **WHEN** a test calls `actingAsSuperadmin()`
- **THEN** roles and permissions are seeded, a user is created and assigned the `superadmin` role
- **AND** the test is logged in as that user via `actingAs()`

#### Scenario: actingAsAdmin helper
- **WHEN** a test calls `actingAsAdmin()`
- **THEN** roles and permissions are seeded, a user is created and assigned the `admin` role
- **AND** the test is logged in as that user via `actingAs()`

#### Scenario: actingAsUser helper
- **WHEN** a test calls `actingAsUser()`
- **THEN** roles and permissions are seeded, a user is created and assigned the `user` role
- **AND** the test is logged in as that user via `actingAs()`

### Requirement: User factory states for roles
The `UserFactory` SHALL provide `superadmin()`, `admin()`, and `user()` states so tests can create users with specific roles without manual `assignRole` calls.

#### Scenario: Factory superadmin state
- **WHEN** a test calls `User::factory()->superadmin()->create()`
- **THEN** a user is created and assigned the `superadmin` role (assuming roles are seeded first)

#### Scenario: Factory admin state
- **WHEN** a test calls `User::factory()->admin()->create()`
- **THEN** a user is created and assigned the `admin` role

#### Scenario: Factory user state
- **WHEN** a test calls `User::factory()->user()->create()`
- **THEN** a user is created and assigned the `user` role

## REMOVED Requirements

### Requirement: User factory has regular() state
**Reason**: The `regular` role is renamed to `user`. The factory state is renamed accordingly.

**Migration**: Replace `User::factory()->regular()` with `User::factory()->user()`.

### Requirement: actingAsRegular Pest helper
**Reason**: The `regular` role is renamed to `user`. The helper is renamed accordingly.

**Migration**: Replace `actingAsRegular()` with `actingAsUser()` throughout the test suite.
