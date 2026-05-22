## Why

The SPA shell is running but has no authentication. Users can't log in, register, or access protected resources. We need a headless authentication backend that provides cookie-based session auth for the Vue SPA, with role-based authorization for access control.

## What Changes

- Install Laravel Fortify (headless auth backend) and Laravel Sanctum (cookie-based SPA auth)
- Install Spatie Laravel Permission for role-based authorization (roles & permissions)
- Configure Fortify with `views: false` for JSON-only responses (registration, login, password reset, email verification, profile updates)
- Configure Sanctum for stateful SPA authentication (CSRF cookie + session)
- Create custom `LoginResponse` that returns user data as JSON
- Create `FortifyServiceProvider` with auth actions (CreateNewUser, ResetUserPassword, UpdateUserPassword, UpdateUserProfileInformation)
- Configure CORS to allow auth-related endpoints (`login`, `logout`, `register`, `forgot-password`, etc.)
- Update User model with `HasRoles` trait, Sanctum tokens, and MediaLibrary support
- Add `username` column to users table for login via email or username
- Create `AuthController` for returning current authenticated user data
- Set up API routes with `auth:sanctum` middleware
- Create `RolesAndPermissionsSeeder` with admin (super-admin via Gate::before) and regular (edit-profile) roles
- Update migrations for the new User fields
- Configure `bootstrap/app.php` with `statefulApi()` middleware
- Install Spatie MediaLibrary for avatar support on User model
- Create base controller with standardized JSON response methods

## Capabilities

### New Capabilities
- `auth-backend`: Fortify + Sanctum configuration, custom responses, auth actions, CORS setup, and API route protection
- `authorization`: Spatie Permission roles & permissions setup, seeder, super-admin gate, and controller-level authorization
- `user-management-backend`: User model with extended fields, avatar support via MediaLibrary, UserController with CRUD, UserService, API Resources, and Form Requests

### Modified Capabilities

## Impact

- **Dependencies (composer)**: `laravel/fortify`, `laravel/sanctum`, `spatie/laravel-permission`, `spatie/laravel-medialibrary`
- **Dependencies (npm)**: none
- **Migrations**: Add `username` column to users table, add spatie permission tables (roles, permissions, model_has_roles, model_has_permissions, role_has_permissions), add media table, add personal_access_tokens table, add two_factor columns
- **Config files**: New `config/fortify.php`, `config/sanctum.php`, `config/cors.php`, `config/permission.php`
- **Routes**: New `routes/api.php` with auth and user resource routes
- **Middleware**: `statefulApi()`, `apply_locale` alias
- **Seeders**: RolesAndPermissionsSeeder (admin/regular roles), UsersTableSeeder
