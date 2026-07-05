## Why

`UsersPage.vue` is currently a "Coming Soon" placeholder despite the backend API being fully functional. Admins need a UI to manage users (list, create, edit, delete) including role and direct permission assignment per user.

## What Changes

- Replace placeholder `UsersPage.vue` with full CRUD UI following `RolesPage.vue` pattern
- Create/edit user form with fields: name, username, email, password, roles (multi-select checkboxes), and direct permissions (multi-select checkboxes)
- Extend backend `UserService::update()` to sync direct permissions via Spatie
- Pest tests for permission assignment on user update
- Playwright E2E tests: CRUD flow (superadmin) + restricted access (admin) + responsive tests (mobile/tablet)

## Capabilities

### New Capabilities

- `user-management-ui`: Full CRUD UI at `/admin/users` — paginated+searchable table, create/edit dialogs with role & permission checkboxes, delete confirmation dialog

### Modified Capabilities

- `user-management-backend`: Add direct permission sync to `PUT /api/users/{id}` — accept `permissions` field (array of permission names) and sync via `$user->syncPermissions()`

## Impact

- `resources/app/views/pages/admin/UsersPage.vue` — complete rewrite
- `app/Services/UserService.php` — extend update method to handle `permissions`
- `app/Http/Requests/UpdateUserRequest.php` — add validation for `permissions` field
- `app/Http/Resources/UserResource.php` — add `permissions` and `direct_permissions` fields to response
- `tests/Feature/Api/UserApiTest.php` — add test cases for permission assignment
- `tests/e2e/tests/superadmin/user-management.spec.ts` — new
- `tests/e2e/tests/superadmin/user-management-responsive.spec.ts` — new
- `tests/e2e/tests/admin/user-management-restricted.spec.ts` — new
