## 1. Backend Foundation — Helpers File

- [x] 1.1 Create `app/helpers.php` with `default_route_for_user(?User $user): string` — returns `/admin` if user has `access-admin-panel`, else `/`
- [x] 1.2 Update `composer.json` — add `"files": ["app/helpers.php"]` to autoload
- [x] 1.3 Run `composer dump-autoload` to register
- [x] 1.4 Verify `php artisan tinker --execute='echo default_route_for_user(null);'` outputs `/`

## 2. Backend — Remove Gate::before, Use Explicit Permissions

- [x] 2.1 Update `app/Providers/AppServiceProvider.php` — REMOVE the `Gate::before` registration entirely from `bootAuth()`. Keep only the `ResetPassword::createUrlUsing()` call.
- [x] 2.2 Run `vendor/bin/pint --dirty --format agent`

## 3. Backend — RolesAndPermissionsSeeder

- [x] 3.1 Update `database/seeders/RolesAndPermissionsSeeder.php`:
  - Keep `app()[PermissionRegistrar::class]->forgetCachedPermissions()` at top
  - Define grouped permissions: User Management (4), Role Management (5), Profile (1), Admin Panel (1) — total 11
  - Create all permissions in a loop
  - Refresh permission cache after creation
  - Create `superadmin` role and call `$superadmin->syncPermissions(Permission::all())`
  - Create `admin` role with `access-admin-panel`, `edit-profile`
  - Create `user` role with `edit-profile`
- [x] 3.2 Add inline comments documenting each role's permission scope
- [x] 3.3 Run `vendor/bin/pint --dirty --format agent`

## 4. Backend — UsersTableSeeder

- [x] 4.1 Update `database/seeders/UsersTableSeeder.php`:
  - Create `superadmin` user (`username='superadmin'`, `email='superadmin@example.com'`)
  - Create `admin` user (`username='admin'`, `email='admin@example.com'`)
  - Create 20 users with `user` role
- [x] 4.2 Run `vendor/bin/pint --dirty --format agent`

## 5. Backend — User Model and UserResource

- [x] 5.1 Update `app/Models/User.php` — add `getIsSuperadminAttribute()`, `getIsUserAttribute()`. Keep existing `getIsAdminAttribute()`.
- [x] 5.2 Update `app/Http/Resources/UserResource.php`:
  - Add `is_superadmin`, `is_user` flags alongside existing `is_admin`
  - Use uniform `getAllPermissions()->pluck('name')` for ALL roles (no superadmin special case needed since they hold permissions explicitly)
- [x] 5.3 Run `vendor/bin/pint --dirty --format agent`

## 6. Backend — Fortify and Factories

- [x] 6.1 Update `app/Actions/Fortify/CreateNewUser.php` — assign `user` role on registration
- [x] 6.2 Update `database/factories/UserFactory.php`:
  - Rename `regular()` → `user()`
  - Add `superadmin()` state
  - Keep `admin()` state (semantics changed but name same)
- [x] 6.3 Run `vendor/bin/pint --dirty --format agent`

## 7. Backend — Test Helpers

- [x] 7.1 Update `tests/Pest.php`:
  - Add `actingAsSuperadmin()` (assigns `superadmin` role)
  - Keep `actingAsAdmin()` (assigns `admin` role — semantics changed)
  - Rename `actingAsRegular()` → `actingAsUser()` (assigns `user` role)
- [x] 7.2 Run `vendor/bin/pint --dirty --format agent`

## 8. Backend — Update Existing Tests for New Roles

- [x] 8.1 Update `tests/Feature/Authorization/RolesAndPermissionsSeederTest.php` — assert all three roles, all 11 permissions, correct grants per role (including ALL permissions for superadmin)
- [x] 8.2 Update `tests/Feature/Authorization/SuperAdminGateTest.php` — superadmin holds all permissions (via explicit grant, not Gate::before bypass). Add tests:
  - `superadmin can() returns true for all defined permissions`
  - `admin can('access-admin-panel') returns true`
  - `admin can('view-users') returns false`
  - `user can('edit-profile') returns true`
  - `user can('access-admin-panel') returns false`
- [x] 8.3 Update `tests/Feature/Authorization/PermissionTest.php` — update role names, assert new permissions
- [x] 8.4 Update `tests/Feature/Auth/RegistrationTest.php` — assert new user has `user` role
- [x] 8.5 Update `tests/Feature/Api/UserApiTest.php` — `actingAsSuperadmin()` for user-management tests, `actingAsUser()` for permission-denied tests
- [x] 8.6 Update `tests/Feature/Api/UserSearchFilterTest.php` — `actingAsSuperadmin()`, role names updated
- [x] 8.7 Update `tests/Feature/Api/UserAvatarTest.php` — `actingAsSuperadmin()`
- [x] 8.8 Update `tests/Feature/Api/AuthEndpointTest.php` — assert `is_superadmin`, `is_user` flags, assert `permissions` array contains expected keys per role

## 9. Backend — New Authorization Tests

- [x] 9.1 Add `tests/Feature/Authorization/RoleFlagsTest.php` — test `is_superadmin`, `is_admin`, `is_user` accessors
- [x] 9.2 Add `tests/Feature/Authorization/DefaultRouteForUserTest.php` — test helper with each role and null
- [x] 9.3 Run `php artisan test --compact tests/Feature/Authorization/` — all pass

## 10. Backend — Migration & Reseed

- [x] 10.1 Run `php artisan migrate:fresh --seed`
- [x] 10.2 Verify in tinker: `Role::pluck('name')` returns `['superadmin','admin','user']`
- [x] 10.3 Verify: `Role::findByName('superadmin')->permissions->count()` returns `11` (all permissions)

## 11. Backend — Final Verification

- [x] 11.1 Run `php artisan test --compact` — full suite passes (previously 50, now 72+ tests)
- [x] 11.2 Run `vendor/bin/pint --dirty --format agent`
- [x] 11.3 Verify `GET /api/users/auth` for superadmin returns `permissions` array with all 11 keys

## 12. Frontend — User Type & API Service

- [x] 12.1 Update `resources/app/types/auth.ts` — add `is_superadmin: boolean`, `is_user: boolean` to `User` interface
- [x] 12.2 Run `npm run build`

## 13. Frontend — Router with Permission-Based Guard

- [x] 13.1 Update `resources/app/router/guards.ts`:
  - Check `meta.requiresPermission` against `authStore.user?.permissions`
  - Authenticated user on guest page redirects based on `access-admin-panel` permission
- [x] 13.2 Update `resources/app/router/index.ts`:
  - Add `requiresPermission: 'access-admin-panel'` to all `/admin/*` routes
  - Add single `/profile` route with `meta: { requiresAuth: true, titleKey: 'breadcrumb.profile' }` (NO `requiresPermission` — all authenticated roles can access)
  - Remove old `admin.profile` nested route
- [x] 13.3 Run `npm run build`

## 14. Frontend — Login/Register Redirects

- [x] 14.1 Update `resources/app/views/pages/auth/LoginPage.vue` — redirect based on `access-admin-panel` permission (admin → `/admin`, others → `/`)
- [x] 14.2 Update `resources/app/views/pages/auth/RegisterPage.vue` — always redirect to `/` after register (new users get `user` role)
- [x] 14.3 Run `npm run build`

## 15. Frontend — Sidebar Permission Filtering

- [x] 15.1 Update `resources/app/components/admin/nav-items.ts`:
  - Add `requiredPermission?: string` field to `NavItem` interface
  - Add `requiredPermission: 'view-users'` to Settings group
- [x] 15.2 Update `resources/app/components/admin/AdminSidebar.vue`:
  - Add `computed` `visibleNavItems` filtering by permission
  - Use `visibleNavItems` instead of `navItems` in template
  - Update Profile link in footer dropdown from `admin.profile` to `profile`
  - Add `LogOut` icon support (already done previously, verify)
- [x] 15.3 Run `npm run build`

## 16. Frontend — Single /profile Route Setup

The profile page must be a single route used by all authenticated roles, but admin/superadmin
should still see the admin layout (sidebar + header). This requires AdminLayout to support
a default slot fallback so it can wrap arbitrary content.

- [x] 16.1 Update `resources/app/views/layouts/AdminLayout.vue` — wrap `<router-view />` in a default slot:
  ```vue
  <main>
    <slot>
      <router-view />
    </slot>
  </main>
  ```
- [x] 16.2 Create `resources/app/views/pages/ProfilePage.vue` (new root-level page) with conditional layout:
  - If user has `access-admin-panel`: wrap in `<AdminLayout>` with `BasicPage` content
  - Else: use `<DefaultLayout>` with standalone styling and a Sign Out button
  - Show user avatar initials, name, email, role badges in both variants
- [x] 16.3 Delete `resources/app/views/pages/admin/ProfilePage.vue` (replaced by single route)
- [x] 16.4 Run `npm run build`

## 17. Frontend — Update Profile Links Everywhere

All admin components reference `admin.profile`. Replace with `profile`.

- [x] 17.1 Update `resources/app/components/admin/AdminUserMenu.vue` — Profile dropdown item links to `{ name: 'profile' }`
- [x] 17.2 Update `resources/app/components/admin/AdminSidebar.vue` — footer dropdown Profile link to `{ name: 'profile' }`
- [x] 17.3 Update `resources/app/components/admin/AdminBottomNav.vue` — both `isActive('profile')` check and DropdownMenu Profile item route
- [x] 17.4 Run `npm run build`

## 18. Frontend — HomePage with Authenticated User UI

When `user` role lands on `/` after login, they need access to Profile and Sign Out.
When superadmin/admin land here (e.g. by clicking Site link), they need Go to Admin button.

- [x] 18.1 Add locale keys `home.profile` and `home.signOut` to `en.ts` and `id.ts`
- [x] 18.2 Update `resources/app/views/pages/HomePage.vue` for authenticated users:
  - Show avatar initials + name
  - Show "Go to Admin" button only when user has `access-admin-panel`
  - Show "Profile" link to `{ name: 'profile' }` for ALL authenticated users
  - Show "Sign Out" button for ALL authenticated users
- [x] 18.3 Run `npm run build`

## 19. Frontend — Verify All Build Outputs

- [x] 19.1 Run `npx vue-tsc --noEmit` — TypeScript checks pass
- [x] 19.2 Run `npm run build` — production build clean

## 20. Manual Verification Matrix

Run `php artisan migrate:fresh --seed` first to ensure clean DB.

- [ ] 20.1 **Unauthenticated** visit `/` → see Sign In + Sign Up buttons
- [ ] 20.2 **Unauthenticated** visit `/admin` → redirect to `/login?redirect=/admin`
- [ ] 20.3 **Unauthenticated** visit `/profile` → redirect to `/login?redirect=/profile`
- [ ] 20.4 **Unauthenticated** visit `/login` → see login form
- [ ] 20.5 **Login as user** (`username=user1`, password from seeder) → redirect to `/`, see avatar + Profile + Sign Out (NO Go to Admin)
- [ ] 20.6 **As user** click Profile → opens `/profile` with `DefaultLayout` (no sidebar)
- [ ] 20.7 **As user** visit `/admin` directly → redirect to `/`
- [ ] 20.8 **As user** click Sign Out from `/profile` → logged out, see Sign In/Sign Up
- [ ] 20.9 **Login as admin** (`username=admin`, password=`123123`) → redirect to `/admin`, sidebar Settings menu **NOT visible** (admin doesn't have view-users)
- [ ] 20.10 **As admin** visit `/` → see avatar + Go to Admin + Profile + Sign Out
- [ ] 20.11 **As admin** click Profile → opens `/profile` inside `AdminLayout` (sidebar visible)
- [ ] 20.12 **Login as superadmin** (`username=superadmin`, password=`123123`) → redirect to `/admin`, sidebar Settings menu **visible** (superadmin has all permissions)
- [ ] 20.13 **As superadmin** visit `/` → see avatar + Go to Admin + Profile + Sign Out
- [ ] 20.14 **As superadmin** click Profile → opens `/profile` inside `AdminLayout`
- [ ] 20.15 **As superadmin** click `/admin/users` → page renders (has view-users permission)
- [ ] 20.16 **Register a new account** publicly → redirect to `/`, role assigned is `user`, can access `/profile` but NOT `/admin`

## 21. Frontend — Granular Per-Page Permission Guards

Currently all `/admin/*` routes require only `access-admin-panel`. This means admin role
(which has only `access-admin-panel`) can navigate to `/admin/users` or `/admin/roles`
even though they lack `view-users` / `view-roles` permissions. Each admin sub-page must
declare its own required permission.

- [x] 21.1 Update `resources/app/router/index.ts` — change `requiresPermission` per route:
  - `/admin` parent: `access-admin-panel` (entry gate)
  - `/admin/dashboard`: `access-admin-panel` (everyone with admin access can see it)
  - `/admin/users`: `view-users` (only superadmin)
  - `/admin/roles`: `view-roles` (only superadmin)
- [x] 21.2 Run `npm run build` — confirm no type errors
- [ ] 21.3 Manual: login as admin → visit `/admin/users` directly → redirected to home (or `/admin/dashboard`)
- [ ] 21.4 Manual: login as admin → visit `/admin/roles` directly → redirected
- [ ] 21.5 Manual: login as superadmin → both pages accessible

## 22. Frontend — Improve Guard Redirect for Admin Sub-Page Denials

When an authenticated user (e.g. admin) hits `/admin/users` without `view-users`, redirecting
to `/` (home) is jarring — they're still in the admin context. Better: redirect to
`/admin/dashboard` if they have `access-admin-panel`, else to `/`.

- [x] 22.1 Update `resources/app/router/guards.ts` — when a `requiresPermission` check fails:
  - If user has `access-admin-panel` permission → redirect to `{ name: 'admin.dashboard' }`
  - Otherwise → redirect to `{ name: 'home' }`
- [x] 22.2 Run `npm run build`
- [ ] 22.3 Manual: login as admin → visit `/admin/users` → redirected to `/admin/dashboard`
- [ ] 22.4 Manual: login as user → visit `/admin/users` → redirected to `/` (home)
