## Why

The SPA shell is running but has no authentication. Users can't log in, register, or access protected resources. We need a headless authentication backend that provides cookie-based session auth for the Vue SPA, with role-based authorization for access control.

## What Changes

- Install Laravel Fortify (headless auth backend) and Laravel Sanctum (cookie-based SPA auth)
- Install Silber Bouncer for role-based authorization (roles & abilities)
- Configure Fortify with `views: false` for JSON-only responses (registration, login, password reset, email verification, profile updates)
- Configure Sanctum for stateful SPA authentication (CSRF cookie + session)
- Create custom `LoginResponse` that returns user data as JSON
- Create `FortifyServiceProvider` with auth actions (CreateNewUser, ResetUserPassword, UpdateUserPassword, UpdateUserProfileInformation)
- Configure CORS to allow auth-related endpoints (`login`, `logout`, `register`, `forgot-password`, etc.)
- Update User model with Bouncer traits, Sanctum tokens, and MediaLibrary support
- Add `username` column to users table for login via email or username
- Create `AuthController` for returning current authenticated user data
- Set up API routes with `auth:sanctum` middleware
- Create `BouncerSeeder` with admin (everything) and regular (edit-profile) roles
- Update migrations for the new User fields
- Configure `bootstrap/app.php` with `statefulApi()` middleware
- Install Spatie MediaLibrary for avatar support on User model
- Create base controller with standardized JSON response methods

## Capabilities

### New Capabilities
- `auth-backend`: Fortify + Sanctum configuration, custom responses, auth actions, CORS setup, and API route protection
- `authorization`: Bouncer roles & abilities setup, seeder, and controller-level authorization
- `user-management-backend`: User model with extended fields, avatar support via MediaLibrary, UserController with CRUD, UserService, API Resources, and Form Requests

### Modified Capabilities

## Impact

- **Dependencies (composer)**: `laravel/fortify@^1.36`, `laravel/sanctum@^4.0`, `silber/bouncer@^1.0`, `spatie/laravel-medialibrary@^11.21`
- **Dependencies (npm)**: none
- **Migrations**: Add `username` column to users table, add bouncer tables, add media table, add personal_access_tokens table, add two_factor columns
- **Config files**: New `config/fortify.php`, `config/sanctum.php`, `config/cors.php`
- **Routes**: New `routes/api.php` with auth and user resource routes
- **Middleware**: `statefulApi()`, `apply_locale` alias
- **Seeders**: BouncerSeeder (admin/regular roles), UsersTableSeeder
