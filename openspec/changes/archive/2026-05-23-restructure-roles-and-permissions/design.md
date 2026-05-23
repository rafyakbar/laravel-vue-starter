## Context

The original authorization system used `admin` (super-user via `Gate::before`) and `regular` (only `edit-profile`). This created several problems:

1. **`Gate::before` bypass returns true for permission checks but doesn't populate `getAllPermissions()`** — superadmin's `permissions` array is empty in API responses, breaking frontend checks like `permissions.includes('view-users')`.
2. **No clear separation between system-owner and content-manager** — `admin` was effectively superadmin.
3. **Frontend would need special-case logic for superadmin** — checking `is_superadmin` separately from permission arrays everywhere is messy and error-prone.

Spatie best practice: **roles group permissions; code checks permissions**. The cleanest implementation is to grant superadmin all permissions explicitly. `Gate::before` is an optimization shortcut, not a requirement — and in our case it causes more pain than benefit.

## Goals / Non-Goals

**Goals:**
- 3-role hierarchy: `superadmin`, `admin`, `user`
- Permission-based authorization (controllers, frontend, everywhere)
- Superadmin holds ALL permissions explicitly (no `Gate::before` bypass)
- Single source of truth: `user.permissions` array drives all access decisions
- Admin-panel gate via dedicated `access-admin-panel` permission
- Default public registration assigns `user` role
- Single `/profile` route shared by all roles, with layout-aware rendering
- All tests updated and passing

**Non-Goals:**
- Database migration for role hierarchy (Spatie tables already support it)
- Custom role-management UI (separate change)
- Backwards-compat alias for `regular` role (clean break)
- Per-team or scoped permissions (Spatie supports it but out of scope for this starter)

## Decisions

### 1. Role hierarchy: superadmin / admin / user

| Role | Description | Permissions |
|------|-------------|-------------|
| `superadmin` | System owner | **All permissions explicitly granted** |
| `admin` | Content manager | `access-admin-panel`, `edit-profile` |
| `user` | Default public registration | `edit-profile` |

**Rationale:** Three tiers cover typical SaaS/blog/tool starter patterns. Adding more roles later requires no code changes — just new rows in `roles` table with appropriate permission grants.

### 2. Permission groupings

```
User Management:    view-users, create-users, update-users, delete-users
Role Management:    view-roles, create-roles, update-roles, delete-roles, assign-roles
Profile:            edit-profile
Admin Panel:        access-admin-panel
```

**Permission-to-role grants:**

| Permission | superadmin | admin | user |
|------------|------------|-------|------|
| `access-admin-panel` | ✓ | ✓ | ✗ |
| `edit-profile` | ✓ | ✓ | ✓ |
| `view-users`, `create-users`, `update-users`, `delete-users` | ✓ | ✗ | ✗ |
| `view-roles`, `create-roles`, `update-roles`, `delete-roles`, `assign-roles` | ✓ | ✗ | ✗ |

### 3. NO `Gate::before` bypass — explicit permissions for superadmin

**Choice:** Remove `Gate::before` registration entirely. Superadmin role receives all permissions via `Role::syncPermissions(Permission::all())` in the seeder.

```php
// AppServiceProvider — no Gate::before for role bypass
// Superadmin uses standard permission checks like every other role.

// RolesAndPermissionsSeeder
$superadmin = Role::create(['name' => 'superadmin']);
$superadmin->syncPermissions(Permission::all());
```

**Rationale:**
- `getAllPermissions()` returns the full permission list for superadmin
- Frontend `user.permissions` array is consistent across all roles
- No special-case logic needed anywhere
- Permission cache works naturally
- Easy to audit — superadmin's permissions are visible in DB
- New permissions added later must be granted to superadmin explicitly (a feature, not a bug — forces conscious decision)

**Trade-off:** When adding new permissions, the seeder or migration must assign them to superadmin. This is intentional friction that prevents accidental over-permissioning.

**Helper for new permissions:** Whenever we add a permission, we either:
- Re-run `RolesAndPermissionsSeeder` (in dev), OR
- Use a one-off migration to grant it to superadmin (in production)

### 4. `is_superadmin`, `is_admin`, `is_user` accessors

```php
public function getIsSuperadminAttribute(): bool { return $this->hasRole('superadmin'); }
public function getIsAdminAttribute(): bool      { return $this->hasRole('admin'); }
public function getIsUserAttribute(): bool       { return $this->hasRole('user'); }
```

**Purpose:** Convenience flags for UI logic that's truly role-specific (e.g., showing different welcome message). Permission checks remain primary for access control.

### 5. `UserResource.permissions` is uniform

With explicit grants, `getAllPermissions()` returns the actual permissions list for all roles including superadmin. No special case needed.

```php
$data['permissions'] = $this->getAllPermissions()->pluck('name');
```

Superadmin gets all 11 permissions. Admin gets 2. User gets 1. Consistent.

### 6. `app/helpers.php` with `default_route_for_user()`

```php
function default_route_for_user(?User $user): string
{
    if ($user && $user->can('access-admin-panel')) {
        return '/admin';
    }
    return '/';
}
```

Used by login flow and frontend to determine post-login redirect.

### 7. Default registration role: `user`

`CreateNewUser::create()` calls `$user->assignRole('user')`.

### 8. Single `/profile` route, layout-aware

**Choice:** One route `/profile` (root-level, not nested under `/admin`). The `ProfilePage` component conditionally wraps content in `AdminLayout` (for users with `access-admin-panel`) or `DefaultLayout` (for regular users).

```vue
<template>
  <AdminLayout v-if="useAdminLayout()">
    <BasicPage ...>profile content</BasicPage>
  </AdminLayout>
  <DefaultLayout v-else>
    <!-- standalone profile UI -->
  </DefaultLayout>
</template>
```

`AdminLayout` is updated to support a default slot fallback to `<router-view />`, allowing it to wrap arbitrary content OR render nested routes:

```vue
<main>
  <slot>
    <router-view />
  </slot>
</main>
```

**Rationale:**
- Single source of truth for profile UI
- Admin/superadmin keep their familiar admin shell
- Regular users get a clean standalone page
- No duplication of profile content

### 9. Frontend permission-based router guard

Routes declare `meta: { requiresPermission: 'access-admin-panel' }`. Guard checks `authStore.user?.permissions?.includes(permission)`. Unauthorized → redirect to home.

### 10. Frontend permission-based redirect after login

```typescript
const hasAdminAccess = authStore.user?.permissions?.includes('access-admin-panel')
router.push(hasAdminAccess ? '/admin' : '/')
```

Mirrors `default_route_for_user()` backend helper.

### 11. Frontend permission-based sidebar nav filtering

`NavItem` interface gets `requiredPermission?: string` field. `AdminSidebar` filters items by checking `authStore.user.permissions`.

### 12. Test helpers and factory states

- `actingAsSuperadmin()`, `actingAsAdmin()`, `actingAsUser()`
- `UserFactory::superadmin()`, `admin()`, `user()`
- `regular` and `actingAsRegular()` removed (no aliases)

## Risks / Trade-offs

- **[Trade-off] Superadmin permissions assigned at seed time only** — If a new permission is created later and the seeder isn't re-run, superadmin won't have it. → Mitigation: Document in seeder comments. Future migrations that add permissions should also grant them to superadmin.
- **[Risk] Permission cache** — Spatie caches permissions. Seeder must call `forgetCachedPermissions()` after creating permissions, before assigning to roles. Already handled.
- **[Trade-off] No backward-compat for `regular` role** — Clean break. Documented as breaking change.
- **[Trade-off] Single profile route serves two layouts** — Component has a v-if branch. Marginal duplication of content but acceptable for MVP.

## Migration Plan

1. Implement changes per tasks.md (in order).
2. Run `php artisan migrate:fresh --seed` to rebuild DB with new structure.
3. Run `php artisan test --compact` — full suite passes.
4. Run `npm run build` — frontend compiles.
5. Manual verification: login as each role, verify expected behavior.
