## Context

The auth backend is implemented and works (verified manually via tinker), but no automated tests exist. The codebase uses Pest 4. Test infrastructure exists (`tests/Pest.php`, `tests/TestCase.php`) but `RefreshDatabase` is commented out, and only the placeholder `ExampleTest.php` is present.

Three capabilities (`auth-backend`, `authorization`, `user-management-backend`) define ~27 requirements across login, registration, password flows, RBAC, super-admin gate, user CRUD, search/filter, avatar upload, and token generation. Each requirement has scenarios that need to be exercised by tests.

## Goals / Non-Goals

**Goals:**
- Cover every Scenario in the three auth-related specs with at least one Pest feature test
- Use `RefreshDatabase` for fast, isolated test runs with SQLite in-memory
- Establish reusable Pest helpers (`actingAsAdmin()`, `actingAsRegular()`) and factory states (`UserFactory::admin()`, `UserFactory::regular()`)
- Group tests by domain (`tests/Feature/Auth/`, `tests/Feature/Api/`, `tests/Feature/Authorization/`)
- All tests pass via `php artisan test --compact`

**Non-Goals:**
- Browser tests (Pest 4 visit/click) — separate change for E2E
- Frontend Vue component tests
- Unit tests for Service classes (covered indirectly via Feature tests; can add later if needed)
- Performance/load tests
- Two-factor auth tests (2FA disabled in current implementation)

## Decisions

### 1. Use `RefreshDatabase` over `DatabaseTransactions`

**Choice:** Enable `RefreshDatabase` in `tests/Pest.php` for the `Feature` directory.

**Rationale:** Spatie Permission and Sanctum write to multiple tables; transactions can leak permission cache state between tests. `RefreshDatabase` with SQLite in-memory is fast (<1s for full DB rebuild per test class).

**Alternative considered:** `LazilyRefreshDatabase` for speed. Rejected because seeders run roles+permissions setup which we want fresh for every test that needs roles.

### 2. Test database: SQLite in-memory

**Choice:** Configure `phpunit.xml` with `DB_CONNECTION=sqlite` and `DB_DATABASE=:memory:`.

**Rationale:** Fastest possible test runs. Project already uses SQLite in development.

### 3. Group tests by domain, not by class-under-test

**Choice:** Test directories mirror functionality, not source structure:
- `tests/Feature/Auth/LoginTest.php`, `RegistrationTest.php`, `PasswordResetTest.php`, `EmailVerificationTest.php`, `LogoutTest.php`
- `tests/Feature/Api/UserApiTest.php`, `RoleApiTest.php`, `AuthEndpointTest.php`, `TokenApiTest.php`
- `tests/Feature/Authorization/PermissionTest.php`, `SuperAdminGateTest.php`

**Rationale:** Easier to find tests by feature. Multiple controllers/services may be involved in one feature (e.g., login involves Fortify routes, FortifyServiceProvider, LoginResponse).

### 4. Pest helper functions in `tests/Pest.php`

**Choice:** Add `actingAsAdmin()`, `actingAsRegular()`, `seedRolesAndPermissions()` as Pest helper functions.

**Rationale:** DRY — these are used in nearly every auth test. Pest helpers are simpler than trait methods because tests are closures.

```php
function seedRolesAndPermissions(): void {
    (new \Database\Seeders\RolesAndPermissionsSeeder())->run();
}

function actingAsAdmin(): \App\Models\User {
    seedRolesAndPermissions();
    $user = \App\Models\User::factory()->create();
    $user->assignRole('admin');
    test()->actingAs($user);
    return $user;
}

function actingAsRegular(): \App\Models\User {
    seedRolesAndPermissions();
    $user = \App\Models\User::factory()->create();
    $user->assignRole('regular');
    test()->actingAs($user);
    return $user;
}
```

### 5. Factory states for roles

**Choice:** Add `admin()` and `regular()` states to `UserFactory`.

**Rationale:** When tests need multiple users with specific roles, factory states are cleaner than chained `->assignRole()` calls. Permissions seeder must run before states are used.

### 6. Use `assertSuccessful`/`assertNotFound`/`assertForbidden` over `assertStatus`

**Choice:** Per Pest 4 conventions, use specific assertion methods.

**Rationale:** Better failure messages and aligns with the `pest-testing` skill guidance.

### 7. Use `it()` syntax for new tests

**Choice:** New tests use `it('does X', ...)` style.

**Rationale:** The existing `ExampleTest.php` uses `test()`, but for behavioral feature tests describing API contracts, `it('returns 200 for valid login')` reads more naturally. Existing `ExampleTest` will be replaced by a smoke test using `it()` syntax for consistency.

### 8. Login tests use Fortify endpoints, not Sanctum directly

**Choice:** Test `POST /login`, `POST /register`, etc. (Fortify routes) and verify session via `assertAuthenticated()` instead of mocking Sanctum.

**Rationale:** Tests cover the actual contract used by the Vue SPA. Sanctum's stateful session middleware is exercised end-to-end.

## Risks / Trade-offs

- **[Risk] Spatie Permission cache pollution between tests** → Mitigation: Always call `app()[PermissionRegistrar::class]->forgetCachedPermissions()` in seeder, and use `RefreshDatabase` to reset DB state.
- **[Risk] CSRF token requirement breaks tests** → Mitigation: Use `$this->postJson()` for API tests (Sanctum ignores CSRF for `Accept: application/json` requests in test env). For Fortify routes, use `$this->withHeaders(['X-Requested-With' => 'XMLHttpRequest'])` so they return JSON instead of redirect.
- **[Risk] Email verification tests trigger real mail** → Mitigation: Use `Notification::fake()` and `Mail::fake()` per test that triggers mail.
- **[Trade-off] No 2FA tests** → 2FA is disabled in config. Will add tests when 2FA is enabled in a future change.
- **[Trade-off] Avatar upload tests use `UploadedFile::fake()`** → Doesn't test real image conversion (Spatie Image handles that). Acceptable — we test that the file was stored, not the conversion algorithm.
