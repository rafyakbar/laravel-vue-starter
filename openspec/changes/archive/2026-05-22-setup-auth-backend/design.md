## Context

The Vue 3 SPA shell is complete (catch-all route, Vue Router, Pinia, shadcn-vue). The project needs a backend authentication layer that serves JSON responses for the SPA, with role-based authorization and user management CRUD.

## Goals / Non-Goals

**Goals:**
- Install and configure Fortify + Sanctum for cookie-based SPA auth
- Install Spatie Laravel Permission for roles & permissions
- Install Spatie MediaLibrary for user avatars
- Create the full User management backend (model, controller, service, resources, requests)
- Seed default roles (admin, regular) and a test admin user
- Configure CORS, middleware, and API routes

**Non-Goals:**
- Frontend auth pages (login, register, etc.) — separate change
- Frontend auth store and router guards — separate change
- Two-factor authentication setup (commented out, available later)
- Additional CRUD resources beyond Users

## Decisions

### 1. Composer packages and versions

**Choice**: Install the latest compatible packages:
- `laravel/fortify` (latest: v1.x, supports Laravel 13)
- `laravel/sanctum` (latest: v4.x, supports Laravel 13)
- `spatie/laravel-permission` (latest: v7.x for Laravel 12/13 with PHP 8.3+)
- `spatie/laravel-medialibrary` (latest: v11.x)

**Rationale**: Let composer resolve the latest compatible versions automatically. No need to pin — the packages follow semver and support the current Laravel version.

### 2. User model fields: keep default `name` column + add `username`

**Choice**: Keep the single `name` field from Laravel's default migration. Add a unique `username` column for alternative login.

**Rationale**: Simpler schema than split first/last/middle. Username provides a human-readable identifier and an alternative login method. Fortify's `authenticateUsing` callback detects whether the input is email or username.

### 3. Login via email or username

**Choice**: Use `Fortify::authenticateUsing()` with a custom callback that checks if the login field contains `@` to determine whether to query by `email` or `username`.

**Rationale**: Single login field on the frontend (no separate inputs). Detection is simple and reliable — emails always contain `@`, usernames never do.

### 4. Service layer pattern

**Choice**: `UserService` in `app/Services/User/UserService.php` handles all business logic.

**Rationale**: Controllers stay thin (authorize + delegate). Logic is reusable from artisan commands, jobs, or other controllers.

### 5. Custom LoginResponse returns JSON with user data

**Choice**: Override Fortify's `LoginResponse` contract to return `{"user": {...}}` instead of a redirect.

**Rationale**: SPA needs user data immediately after login without a second API call.

### 6. Base Controller with standardized response methods

**Choice**: Create a base `Controller` with `responseSuccess()`, `responseStoreSuccess()`, `responseUpdateSuccess()`, `responseDeleteSuccess()`, `responseFail()` helper methods.

**Rationale**: Consistent JSON response format across all controllers. Frontend can rely on predictable response structure.

### 7. ApplyLocale middleware for per-request locale

**Choice**: Create middleware that reads `X-Locale` header and sets `app()->setLocale()`.

**Rationale**: Frontend sends user's preferred locale with each API request. Backend responds with translated messages.

### 8. Super-admin via Gate::before

**Choice**: Register a `Gate::before()` callback in `AppServiceProvider` that grants the `admin` role full access to all gates and policies.

**Rationale**: Spatie Permission doesn't have a built-in "super admin" concept like Bouncer's `everything()`. The Laravel-idiomatic way is to use `Gate::before()` so the admin role bypasses individual permission checks. This keeps controllers simple — they only need `$this->authorize()` calls and admins automatically pass.

## File Structure

```
app/
├── Actions/Fortify/
│   ├── CreateNewUser.php
│   ├── PasswordValidationRules.php     # Trait: reusable password rules
│   ├── ResetUserPassword.php
│   ├── UpdateUserPassword.php
│   └── UpdateUserProfileInformation.php
├── Http/
│   ├── Controllers/
│   │   ├── Controller.php              # Base with response helpers
│   │   ├── AuthController.php          # GET /api/users/auth
│   │   ├── UserController.php          # User CRUD
│   │   ├── RoleController.php          # Role search
│   │   └── TokenController.php         # POST /api/sanctum/token
│   ├── Middleware/
│   │   ├── ApplyLocale.php
│   │   └── RedirectIfAuthenticated.php # Custom redirect (JSON for XHR)
│   ├── Requests/
│   │   ├── BaseRequest.php
│   │   ├── StoreUserRequest.php
│   │   ├── UpdateUserRequest.php
│   │   ├── UpdateAvatarRequest.php
│   │   └── DestroyUserRequest.php
│   ├── Resources/
│   │   ├── UserResource.php
│   │   ├── UserBasicResource.php       # Simplified user (id, name, email)
│   │   └── RoleResource.php            # Role (id as name, title)
│   └── Responses/
│       └── LoginResponse.php
├── Models/
│   └── User.php                        # Updated with HasRoles, MediaLibrary, extended fields
├── Providers/
│   ├── AppServiceProvider.php          # Gate::before for admin, reset password URL, rate limiters
│   └── FortifyServiceProvider.php      # Auth actions, rate limiters
├── Services/
│   ├── User/UserService.php
│   ├── Role/RoleService.php
│   └── Media/MediaService.php
├── Traits/
│   ├── Filterable.php
│   └── Searchable.php
└── Utilities/
    └── Data.php                        # Helper for array manipulation

config/
├── cors.php
├── fortify.php
├── permission.php
└── sanctum.php

database/
├── migrations/
│   └── (updated users table + spatie permission + media + tokens + 2fa)
├── factories/UserFactory.php           # Updated
└── seeders/
    ├── RolesAndPermissionsSeeder.php
    └── UsersTableSeeder.php

routes/
├── api.php                             # New: auth + user resource routes
└── web.php                             # Existing catch-all

bootstrap/
└── app.php                             # Updated: statefulApi(), apply_locale alias
```

## Key Configuration

### config/fortify.php
- `guard`: `'web'`
- `views`: `false`
- `home`: `env('APP_URL') . '/panel/dashboard'`
- Features: registration, resetPasswords, emailVerification, updateProfileInformation, updatePasswords

### config/sanctum.php
- `stateful`: reads from `SANCTUM_STATEFUL_DOMAINS` env
- `guard`: `['web']`

### config/permission.php
- Default Spatie Permission config (published from package)
- Models: `Spatie\Permission\Models\Permission`, `Spatie\Permission\Models\Role`
- Default guard: `web`

### config/cors.php
- `paths`: `['api/*', 'login', 'logout', 'register', 'user/password', 'forgot-password', 'reset-password', 'sanctum/csrf-cookie', 'user/profile-information', 'email/verification-notification']`
- `supports_credentials`: `true`

### bootstrap/app.php additions
- `$middleware->statefulApi()`
- `$middleware->alias(['apply_locale' => ApplyLocale::class])`
- `withRouting` adds `api: __DIR__.'/../routes/api.php'`

### AppServiceProvider boot()
```php
Gate::before(function ($user, $ability) {
    return $user->hasRole('admin') ? true : null;
});
```

### routes/api.php
```php
Route::post('/sanctum/token', TokenController::class);

Route::middleware(['auth:sanctum', 'apply_locale'])->group(function () {
    Route::get('/users/auth', AuthController::class);
    Route::put('/users/{user}/avatar', [UserController::class, 'updateAvatar']);
    Route::resource('users', UserController::class);
    Route::get('/roles/search', [RoleController::class, 'search']);
});
```

## Risks / Trade-offs

- **[Risk] Permission lookups on every authorization check** → Mitigation: Spatie Permission caches permissions automatically. Cache flushed on role/permission changes.
- **[Risk] Synchronous media conversions block upload response** → Mitigation: Avatar files are small. Move to queue for larger files later.
- **[Trade-off] No 2FA in initial setup** → Feature is commented out in fortify config, can be enabled later without breaking changes.
- **[Trade-off] Email uses `log` driver** → Development convenience. Switch to SMTP/Mailgun for production.
- **[Trade-off] Super-admin uses `Gate::before` not a permission** → Cleaner than seeding every permission for admin, but the admin role won't appear in `getAllPermissions()` lists. Frontend handles this by checking `hasRole('admin')` separately.
