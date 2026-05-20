## Context

The Vue 3 SPA shell is complete (catch-all route, Vue Router, Pinia, shadcn-vue). The project needs a backend authentication layer that serves JSON responses for the SPA, with role-based authorization and user management CRUD.

## Goals / Non-Goals

**Goals:**
- Install and configure Fortify + Sanctum for cookie-based SPA auth
- Install Bouncer for roles & abilities
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

**Choice**: Install exact packages matching the target architecture:
- `laravel/fortify@^1.36`
- `laravel/sanctum@^4.0`
- `silber/bouncer@^1.0`
- `spatie/laravel-medialibrary@^11.21`

**Rationale**: These are the proven versions from the reference architecture. Sanctum 4 is Laravel 13 compatible.

### 2. User model fields: keep default `name` column + add `username`

**Choice**: Keep the single `name` field from Laravel's default migration. Add a unique `username` column for alternative login.

**Rationale**: Simpler schema than split first/last/middle. Username provides a human-readable identifier and an alternative login method. Fortify's `authenticateUsing` callback detects whether the input is email or username.

### 3. Login via email or username

**Choice**: Use `Fortify::authenticateUsing()` with a custom callback that checks if the login field contains `@` to determine whether to query by `email` or `username`.

**Rationale**: Single login field on the frontend (no separate inputs). Detection is simple and reliable — emails always contain `@`, usernames never do.

### 3. Service layer pattern

**Choice**: `UserService` in `app/Services/User/UserService.php` handles all business logic.

**Rationale**: Controllers stay thin (authorize + delegate). Logic is reusable from artisan commands, jobs, or other controllers.

### 4. Custom LoginResponse returns JSON with user data

**Choice**: Override Fortify's `LoginResponse` contract to return `{"user": {...}}` instead of a redirect.

**Rationale**: SPA needs user data immediately after login without a second API call.

### 5. Base Controller with standardized response methods

**Choice**: Create a base `Controller` with `responseSuccess()`, `responseStoreSuccess()`, `responseUpdateSuccess()`, `responseDeleteSuccess()`, `responseFail()` helper methods.

**Rationale**: Consistent JSON response format across all controllers. Frontend can rely on predictable response structure.

### 6. ApplyLocale middleware for per-request locale

**Choice**: Create middleware that reads `X-Locale` header and sets `app()->setLocale()`.

**Rationale**: Frontend sends user's preferred locale with each API request. Backend responds with translated messages.

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
│   ├── User.php                        # Updated with Bouncer, MediaLibrary, extended fields
│   └── Role.php                        # Extends Bouncer's Role
├── Providers/
│   ├── AppServiceProvider.php          # Reset password URL, rate limiters
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
└── sanctum.php

database/
├── migrations/
│   └── (updated users table + bouncer + media + tokens + 2fa)
├── factories/UserFactory.php           # Updated
└── seeders/
    ├── BouncerSeeder.php
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

### config/cors.php
- `paths`: `['api/*', 'login', 'logout', 'register', 'user/password', 'forgot-password', 'reset-password', 'sanctum/csrf-cookie', 'user/profile-information', 'email/verification-notification']`
- `supports_credentials`: `true`

### bootstrap/app.php additions
- `$middleware->statefulApi()`
- `$middleware->alias(['apply_locale' => ApplyLocale::class])`
- `withRouting` adds `api: __DIR__.'/../routes/api.php'`

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

- **[Risk] Bouncer DB queries on every authorization check** → Mitigation: Acceptable for admin panel traffic. Cache if needed later.
- **[Risk] Synchronous media conversions block upload response** → Mitigation: Avatar files are small. Move to queue for larger files later.
- **[Trade-off] No 2FA in initial setup** → Feature is commented out in fortify config, can be enabled later without breaking changes.
- **[Trade-off] Email uses `log` driver** → Development convenience. Switch to SMTP/Mailgun for production.
