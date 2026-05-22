## 1. Test Infrastructure

- [x] 1.1 Update `tests/Pest.php` — uncomment and enable `RefreshDatabase` for the `Feature` directory
- [x] 1.2 Add Pest helper functions in `tests/Pest.php` — `seedRolesAndPermissions()`, `actingAsAdmin()`, `actingAsRegular()`
- [x] 1.3 Verify `phpunit.xml` uses `DB_CONNECTION=sqlite` and `DB_DATABASE=:memory:`
- [x] 1.4 Add `admin()` and `regular()` factory states to `database/factories/UserFactory.php`
- [x] 1.5 Replace `tests/Feature/ExampleTest.php` with a meaningful smoke test (e.g., assert root route returns 200)

## 2. Auth Tests (Fortify endpoints)

- [x] 2.1 Create `tests/Feature/Auth/LoginTest.php` — login with email, login with username, invalid credentials, rate limiting
- [x] 2.2 Create `tests/Feature/Auth/RegistrationTest.php` — successful registration assigns regular role, duplicate email, duplicate username
- [x] 2.3 Create `tests/Feature/Auth/PasswordResetTest.php` — request reset link sends notification, reset with valid token updates password
- [x] 2.4 Create `tests/Feature/Auth/EmailVerificationTest.php` — sending verification notification triggers `VerifyEmail` mail
- [x] 2.5 Create `tests/Feature/Auth/ProfileUpdateTest.php` — update profile information, update password (correct + incorrect current_password)
- [x] 2.6 Create `tests/Feature/Auth/LogoutTest.php` — logout invalidates session

## 3. Authorization Tests

- [x] 3.1 Create `tests/Feature/Authorization/SuperAdminGateTest.php` — admin passes any `can()` check via `Gate::before`, non-admin requires explicit permission
- [x] 3.2 Create `tests/Feature/Authorization/PermissionTest.php` — regular role has `edit-profile`, regular role does NOT have `view-users`, etc.
- [x] 3.3 Create `tests/Feature/Authorization/RolesAndPermissionsSeederTest.php` — seeder creates `admin` and `regular` roles and all expected permissions

## 4. API Tests

- [x] 4.1 Create `tests/Feature/Api/AuthEndpointTest.php` — `GET /api/users/auth` returns user with roles+permissions when authenticated, 401 when not
- [x] 4.2 Create `tests/Feature/Api/UserApiTest.php` — list, create, show, update, delete users; admin allowed, regular forbidden, unauthenticated 401
- [x] 4.3 Create `tests/Feature/Api/UserSearchFilterTest.php` — search by name/username/email, filter by role
- [x] 4.4 Create `tests/Feature/Api/UserAvatarTest.php` — upload avatar via fake `UploadedFile`, asserts media item created in `avatars` collection
- [x] 4.5 Create `tests/Feature/Api/RoleApiTest.php` — `GET /api/roles/search` returns roles list
- [x] 4.6 Create `tests/Feature/Api/TokenApiTest.php` — generate Sanctum token with valid credentials, reject invalid

## 5. Verification

- [x] 5.1 Run `php artisan test --compact` — all tests pass
- [x] 5.2 Run `vendor/bin/pint --dirty --format agent` — format any newly added PHP files
- [x] 5.3 Run `php artisan test --compact tests/Feature/Auth` — confirm Auth subset passes in isolation
- [x] 5.4 Run `php artisan test --compact tests/Feature/Api` — confirm Api subset passes in isolation
- [x] 5.5 Run `php artisan test --compact tests/Feature/Authorization` — confirm Authorization subset passes in isolation
