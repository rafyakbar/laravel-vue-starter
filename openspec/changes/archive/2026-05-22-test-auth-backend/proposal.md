## Why

The auth backend (Fortify + Sanctum + Spatie Permission) is implemented but has zero test coverage. Without tests, regressions in login/registration/authorization will only surface at runtime. We need feature tests that verify the contracts established in the `auth-backend`, `authorization`, and `user-management-backend` specs.

## What Changes

- Add Pest 4 feature tests covering all auth backend endpoints and behaviors
- Configure `tests/Pest.php` to use `RefreshDatabase` for the `Feature` directory
- Add a `tests/Feature/Auth/` test suite covering Fortify endpoints (login, register, password reset, email verification, profile update, password update, logout)
- Add a `tests/Feature/Api/` test suite covering the user/role/auth/token API endpoints
- Add an `Authorization` test suite covering Spatie Permission RBAC and `Gate::before` super-admin
- Add helper functions in `tests/Pest.php` for common setup (creating admin/regular users, acting as authenticated)
- Add factory states to `UserFactory` for `admin` and `regular` roles
- Replace `tests/Feature/ExampleTest.php` with a meaningful smoke test
- Update `phpunit.xml` if needed to ensure SQLite in-memory test DB is used
- Run `php artisan test --compact` and confirm all tests pass

## Capabilities

### New Capabilities

- `auth-backend-tests`: Feature test coverage for all auth-backend, authorization, and user-management-backend specs — verifies login/register/password/email-verification/logout flows, CORS, rate limiting, RBAC, super-admin gate, user CRUD, search/filter, avatar upload, and token generation

### Modified Capabilities

<!-- None — tests verify existing specs without changing requirements -->

## Impact

- **Dependencies (composer)**: none (Pest 4 already installed)
- **Dependencies (npm)**: none
- **New files**: ~10 test files under `tests/Feature/`, helpers in `tests/Pest.php`, factory states in `database/factories/UserFactory.php`
- **Modified files**: `tests/Pest.php` (enable `RefreshDatabase` for Feature), `tests/Feature/ExampleTest.php` (replace with smoke test)
- **Migrations/Schema**: none
- **Config**: `phpunit.xml` (verify test DB is in-memory SQLite)
- **CI**: tests must pass via `php artisan test --compact`
