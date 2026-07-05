## Context

`UsersPage.vue` is a "Coming Soon" placeholder despite the backend API (`/api/users`) being fully functional with CRUD, search, filter, avatar upload, and role assignment. Backend `UserService::update()` does not yet support syncing direct permissions — only syncs roles.

Implementation pattern follows `RolesPage.vue`: single monolithic Vue file with DataTable shared component, create/edit/delete dialogs, and API calls via `apiGet/apiPost/apiPut/apiDelete`.

## Goals / Non-Goals

**Goals:**
- Implement full CRUD UI in `UsersPage.vue` following `RolesPage.vue` pattern
- Create/edit form with role checkboxes (multi-select) and direct permission checkboxes (multi-select)
- Backend support for syncing direct permissions via `PUT /api/users/{id}`
- Pest tests for permission assignment scenarios
- Playwright E2E: CRUD flow (superadmin), restricted access (admin), responsive (mobile/tablet)

**Non-Goals:**
- Avatar upload UI (endpoint exists, UI is separate scope)
- Bulk user operations
- User impersonation
- Export/import users

## Decisions

### 1. Single Vue file vs separate components
**Decision**: Single monolithic `UsersPage.vue` file, following `RolesPage.vue` pattern.
**Rationale**: Consistency with existing pattern. RolesPage succeeds with this approach. Splitting into sub-components only adds complexity without tangible benefit for this scope.

### 2. Direct permissions in edit form
**Decision**: Show permission checkboxes in edit form (not create).
**Rationale**: Direct permissions are fine-grained overrides on top of roles. On create, users only need role assignment first. Permissions can be adjusted after user is created. This is also consistent with roles UX — permissions are assigned after entity exists.

### 3. `syncPermissions` vs `givePermissionTo`
**Decision**: Use `$user->syncPermissions($permissions)` in `UserService::update()`.
**Rationale**: Sync is idempotent — sending empty array will revoke all direct permissions. This is more predictable than `givePermissionTo` which is additive. Consistent with `syncRoles` already in use.

### 4. `permissions` field in `UpdateUserRequest` — optional
**Decision**: Field `permissions` is nullable/optional array of strings.
**Rationale**: Not all updates need to touch permissions. If field is not sent, skip sync. If sent as empty array, revoke all direct permissions.

### 5. `UserResource` — add `permissions` field
**Decision**: Add `direct_permissions` (array of permission names) to `UserResource`.
**Rationale**: Frontend needs to know which permissions are already assigned to pre-populate checkboxes in edit form. Use `getDirectPermissions()` not `getAllPermissions()` to avoid mixing with permissions via roles.

### 6. Responsive E2E — pattern from `role-management-responsive.spec.ts`
**Decision**: Create `user-management-responsive.spec.ts` in `tests/e2e/tests/superadmin/` following existing file pattern.
**Rationale**: Consistency. Separate responsive file from CRUD tests for easier independent execution.

## Risks / Trade-offs

- **[Risk] Direct permissions bypass role hierarchy** → Mitigation: UI displays label "Direct Permissions (override)" so admins are aware this is an override, not a replacement for roles.
- **[Risk] Sync permissions on every update could be unintentional** → Mitigation: Field `permissions` is optional — if not sent in payload, `UserService` skips sync.
- **[Risk] N+1 on list users with permissions** → Mitigation: `UserResource` only loads `direct_permissions` on show endpoint (`/api/users/{id}`), not on index list.

## File Paths

**Backend (modified):**
- `app/Services/UserService.php` — add `syncPermissions` in `update()`
- `app/Http/Requests/UpdateUserRequest.php` — add validation for `permissions`
- `app/Http/Resources/UserResource.php` — add `direct_permissions` field

**Frontend (modified):**
- `resources/app/views/pages/admin/UsersPage.vue` — complete rewrite

**Tests (new/modified):**
- `tests/Feature/Api/UserApiTest.php` — add test cases for permission sync
- `tests/e2e/tests/superadmin/user-management.spec.ts` — new
- `tests/e2e/tests/superadmin/user-management-responsive.spec.ts` — new
- `tests/e2e/tests/admin/user-management-restricted.spec.ts` — new
