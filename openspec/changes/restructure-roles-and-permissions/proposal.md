## Why

The original 2-role authorization system (`admin` / `regular`) is too coarse for a real starter:

1. **No content-management role tier** — `admin` is the super-user via `Gate::before` bypass, leaving no role between full system access and basic profile editing.
2. **`Gate::before` causes downstream complications** — bypass returns true for any permission check, but `getAllPermissions()` returns nothing for the user. This means the frontend `permissions` array is empty for the superadmin, breaking client-side checks like `permissions.includes('access-admin-panel')` and forcing complicated workarounds.
3. **Role naming is ambiguous** — `regular` is vague; `user` is clearer.
4. **No clean admin-panel gate** — the frontend can only check `is_admin`. There's no dedicated permission to gate the entire `/admin` area separately from individual feature permissions.
5. **Default registration role is misnamed** — public-registered users should land on the lowest tier called `user`, not `regular`.

This change restructures roles to a 3-tier hierarchy (`superadmin` / `admin` / `user`) AND replaces the `Gate::before` bypass with **explicit permission grants** for superadmin. Superadmin holds all permissions in the database, so `getAllPermissions()` returns the full list and the frontend has a single, consistent source of truth.

This follows Spatie's "roles for grouping, permissions for checks" best practice while keeping behavior predictable and observable.

## What Changes

- **BREAKING** Replace 2-role system with 3-role hierarchy:
  - `superadmin` — system owner; holds **all permissions explicitly** (no `Gate::before` bypass)
  - `admin` — content manager with admin-panel access, but cannot manage users or roles
  - `user` — default for new public registrations, no admin-panel access
- **BREAKING** Replace `regular` role with `user`
- **BREAKING** Remove `Gate::before` bypass entirely — all roles use explicit permission grants
- Expand permission list with new groupings:
  - User Management: `view-users`, `create-users`, `update-users`, `delete-users`
  - Role Management (new): `view-roles`, `create-roles`, `update-roles`, `delete-roles`, `assign-roles`
  - Profile: `edit-profile` (granted to all roles)
  - Admin Panel (new): `access-admin-panel` (granted to `admin` and `superadmin`)
- Assign permissions per role:
  - `superadmin` — receives ALL permissions explicitly via `Role::syncPermissions(Permission::all())`
  - `admin` — `access-admin-panel`, `edit-profile`
  - `user` — `edit-profile` only
- Update `CreateNewUser` Fortify action to assign `user` role on registration
- Add `is_superadmin`, `is_admin`, `is_user` accessors on User model
- Add `app/helpers.php` with `default_route_for_user()` helper for login redirect logic
- Update seeders, factory states, Pest helpers, and all existing tests for new role names
- Frontend updates: router guard for `requiresPermission`, login/register redirect logic, sidebar visibility filtering, conditional layout for `/profile`
- Single `/profile` route at root level (replaces `/admin/profile`); admin/superadmin see profile inside `AdminLayout`, regular users see standalone

## Capabilities

### Modified Capabilities

- `authorization`: 3-role hierarchy with explicit permission grants (no Gate::before bypass), grouped permissions, admin-panel gate
- `auth-backend`: Default role for public registration changes from `regular` to `user`
- `user-management-backend`: Permissions still drive authorization; only `superadmin` holds user/role management permissions
- `auth-backend-tests`: Test helpers, factory states, and assertions updated for new role hierarchy

## Impact

- **Database changes**: No schema migration needed; Spatie tables already support the structure
- **New files**:
  - `app/helpers.php` — `default_route_for_user(User $user): string`
  - `resources/app/views/pages/ProfilePage.vue` — single `/profile` route component (layout-aware)
- **Modified files**:
  - Backend: `RolesAndPermissionsSeeder`, `UsersTableSeeder`, `UserFactory`, `User` model, `UserResource`, `AppServiceProvider`, `CreateNewUser`, `composer.json`
  - Tests: `Pest.php`, all `tests/Feature/Authorization/*.php`, `RegistrationTest.php`, all `tests/Feature/Api/*.php`
  - Frontend: `router/index.ts`, `router/guards.ts`, `LoginPage`, `RegisterPage`, `HomePage`, `AdminSidebar`, `AdminUserMenu`, `AdminBottomNav`, `AdminLayout`, `nav-items.ts`, `types/auth.ts`, `locales/en.ts`, `locales/id.ts`
- **Removed files**:
  - `resources/app/views/pages/admin/ProfilePage.vue` — replaced by single `/profile`
- **Breaking changes** (clearly documented):
  - `regular` role removed; replace with `user`
  - `admin` role no longer super-user (now content-manager)
  - `Gate::before` bypass removed — admin must hold explicit permissions
  - `admin.profile` route removed; use `profile` route name instead
