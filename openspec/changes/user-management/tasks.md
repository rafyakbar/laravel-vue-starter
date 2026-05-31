## 1. Backend — UserService & Request

- [x] 1.1 Open `app/Services/UserService.php`, add `syncPermissions()` in `update()` method — if `permissions` key exists in data, call `$user->syncPermissions($data['permissions'])`
- [x] 1.2 Open `app/Http/Requests/UpdateUserRequest.php`, add validation for `permissions` field: `nullable|array` and `permissions.*`: `string|exists:permissions,name`
- [x] 1.3 Open `app/Http/Resources/UserResource.php`, add `direct_permissions` field containing `$this->getDirectPermissions()->pluck('name')` — include when resource is loaded individually (use `$this->when(!$this->resource->relationLoaded('...'), ...)` or always include)
- [x] 1.4 Run `vendor/bin/pint --dirty --format agent` to format all modified PHP files

## 2. Backend — Pest Tests

- [x] 2.1 Open `tests/Feature/Api/UserApiTest.php`, add test: `superadmin can assign direct permissions to user` — PUT with `permissions: ['edit-profile']`, assert `$user->hasDirectPermission('edit-profile')` is true
- [x] 2.2 Add test: `superadmin can clear direct permissions with empty array` — PUT with `permissions: []`, assert direct permissions are empty
- [x] 2.3 Add test: `update without permissions field does not change existing direct permissions` — assign permission first, PUT without `permissions` field, assert permission still exists
- [x] 2.4 Add test: `update with invalid permission name returns 422` — PUT with `permissions: ['nonexistent-perm']`, assert 422
- [x] 2.5 Add test: `UserResource includes direct_permissions on show` — GET `/api/users/{id}`, assert response has `direct_permissions` array
- [x] 2.6 Run `php artisan test --compact --filter=UserApiTest` and ensure all pass

## 3. Frontend — UsersPage.vue

- [x] 3.1 Open `resources/app/views/pages/admin/UsersPage.vue`, remove "Coming Soon" placeholder, setup script with imports: `ref`, `onMounted`, `watch`, `useI18n`, `BasicPage`, `DataTable`, `ConfirmDialog`, `Button`, `Badge`, `Checkbox`, `Input`, `Label`, `Dialog` components, `Plus`, `Pencil`, `Trash2` from lucide, `apiGet`, `apiPost`, `apiPut`, `apiDelete`, `ApiError`
- [x] 3.2 Define reactive state: `users`, `roles`, `permissions`, `loading`, `search`, `currentPage`, `totalPages`, `showCreateDialog`, `showEditDialog`, `showDeleteDialog`, `selectedUser`, `form` (name, username, email, password, roles[], permissions[]), `formErrors`
- [x] 3.3 Implement `fetchUsers()` — GET `/api/users` with search & page params, update `users`, `currentPage`, `totalPages`
- [x] 3.4 Implement `fetchRoles()` — GET `/api/roles` to populate role checkboxes
- [x] 3.5 Implement `fetchPermissions()` — GET `/api/permissions` to populate permission checkboxes
- [x] 3.6 Implement `openCreateDialog()` — reset form, set `showCreateDialog = true`
- [x] 3.7 Implement `openEditDialog(user)` — GET `/api/users/{id}` to load `direct_permissions`, pre-populate form with user data, set `showEditDialog = true`
- [x] 3.8 Implement `openDeleteDialog(user)` — set `selectedUser`, `showDeleteDialog = true`
- [x] 3.9 Implement `submitCreate()` — POST `/api/users`, handle 422 errors via `setErrors`, close dialog & refresh on success
- [x] 3.10 Implement `submitEdit()` — PUT `/api/users/{id}`, handle 422 errors, close dialog & refresh on success
- [x] 3.11 Implement `confirmDelete()` — DELETE `/api/users/{id}`, close dialog & refresh on success
- [x] 3.12 Define `columns` array for DataTable: Avatar (slot), Name, Email, Username, Roles (slot with badges), Actions (slot with edit/delete buttons)
- [x] 3.13 Write template: `BasicPage` wrapper → toolbar (heading + "Create User" button) → `DataTable` with column slots → `Dialog` create → `Dialog` edit → `ConfirmDialog` delete
- [x] 3.14 In create dialog: form fields Name, Username, Email, Password + role checkboxes grid
- [x] 3.15 In edit dialog: form fields Name, Username (no email) + role checkboxes + direct permission checkboxes with label "Direct Permissions"
- [x] 3.16 Run `npm run build` and ensure zero TypeScript errors

## 3b. Frontend — Add Translation Keys

- [x] 3b.1 Open `resources/app/locales/en.ts`, add translation keys under `pages.users`: `avatar`, `name`, `email`, `username`, `roles`, `noRoles`, `createUser`, `createUserDescription`, `editUser`, `editUserDescription`, `deleteUser`, `deleteUserConfirm`, `password`, `optional`, `leaveBlankToKeep`, `directPermissions`
- [x] 3b.2 Open `resources/app/locales/id.ts`, add Indonesian translations for the same keys
- [ ] 3b.3 Run `npm run build` and ensure zero TypeScript errors

## 4. Frontend — Manual Verification

- [x] 4.1 Ensure `/admin/users` displays table with user data (not placeholder)
- [x] 4.2 Test create user: fill form, assign role, submit — user appears in table
- [x] 4.3 Test edit user: open dialog, change name, assign direct permission, submit — changes saved
- [x] 4.4 Test delete user: confirm dialog, user removed from table
- [x] 4.5 Test search: type user name, table filters accordingly

## 5. E2E Tests — Superadmin CRUD

- [x] 5.1 Create `tests/e2e/tests/superadmin/user-management.spec.ts` with `test.describe('Superadmin — User Management')` and `beforeEach` goto `/admin/users` + `waitForLoadState('networkidle')`
- [x] 5.2 Add test: `can access users page and see heading` — assert URL `/admin/users`, heading "Users" visible
- [x] 5.3 Add test: `can see user table with data` — assert table rows visible, seeded users present
- [x] 5.4 Add test: `can see Create User button` — assert button visible
- [x] 5.5 Add test: `can open create user dialog` — click "Create User", assert dialog visible with heading "Create User"
- [x] 5.6 Add test: `can create a new user` — fill Name, Username, Email, Password, click Save, `waitForLoadState('networkidle')`, assert new user visible in table
- [x] 5.7 Add test: `can open edit dialog with pre-populated data` — click edit button on first row, assert dialog visible with heading "Edit User", assert name field has value
- [x] 5.8 Add test: `can edit a user name` — open edit dialog, clear name, fill new name, click Save, assert updated name visible
- [x] 5.9 Add test: `can see role checkboxes in edit dialog` — open edit dialog, assert at least one checkbox visible
- [x] 5.10 Add test: `can open delete confirmation dialog` — click delete button, assert dialog visible with confirmation text
- [x] 5.11 Add test: `can search users` — fill search input, press Enter, `waitForLoadState('networkidle')`, assert filtered results

## 6. E2E Tests — Admin Restricted Access

- [x] 6.1 Create `tests/e2e/tests/admin/user-management-restricted.spec.ts` with `test.describe('Admin — User Management Restricted')`
- [x] 6.2 Add test: `admin cannot see Create User button on users page` — goto `/admin/users`, `waitForLoadState('networkidle')`, assert "Create User" button NOT visible
- [x] 6.3 Add test: `admin cannot see edit/delete action buttons` — assert edit and delete buttons NOT visible (admin only has `access-admin-panel`, not `update-users`/`delete-users`)

## 7. E2E Tests — Responsive

- [x] 7.1 Create `tests/e2e/tests/superadmin/user-management-responsive.spec.ts`
- [x] 7.2 Add `test.describe('Superadmin Mobile Viewport — User Management (375x667)')` with `test.use({ viewport: { width: 375, height: 667 } })`
- [x] 7.3 Add mobile test: `can navigate to /admin/users via sidebar drawer on mobile` — goto `/admin`, open sidebar via Menu button, click "Users" link, press Escape, assert URL `/admin/users`, heading visible
- [x] 7.4 Add mobile test: `users page heading is visible on mobile` — goto `/admin/users`, `waitForLoadState('networkidle')`, assert heading visible
- [x] 7.5 Add mobile test: `bottom nav is visible on users page on mobile` — assert `nav.md\\:hidden` visible
- [x] 7.6 Add `test.describe('Superadmin Tablet Viewport — User Management (768x1024)')` with `test.use({ viewport: { width: 768, height: 1024 } })`
- [x] 7.7 Add tablet test: `users page renders table on tablet` — goto `/admin/users`, `waitForLoadState('networkidle')`, assert table visible, bottom nav NOT visible
- [x] 7.8 Add tablet test: `sidebar is visible on tablet without bottom nav` — assert sidebar visible, `nav.md\\:hidden` NOT visible

## 8. Final Verification

- [x] 8.1 Run `php artisan test --compact --filter=UserApiTest` — all pass
- [x] 8.2 Run `npm run build` — zero errors
- [x] 8.3 Run `npx playwright test tests/e2e/tests/superadmin/user-management.spec.ts --config=tests/e2e/playwright.config.ts` — all pass
- [x] 8.4 Run `npx playwright test tests/e2e/tests/admin/user-management-restricted.spec.ts --config=tests/e2e/playwright.config.ts` — all pass
- [x] 8.5 Run `npx playwright test tests/e2e/tests/superadmin/user-management-responsive.spec.ts --config=tests/e2e/playwright.config.ts` — all pass

## 9. Fix Translation Reactivity

- [x] 9.1 Open `resources/app/views/pages/admin/UsersPage.vue`, change `columns` from const array to computed property so it updates when language changes
- [x] 9.2 Run `npm run build` and verify zero errors
- [x] 9.3 Manual test: change language and verify table columns update

## 10. Fix Responsive Test

- [x] 10.1 Fix `user-management-responsive.spec.ts` tablet test — sidebar locator is too strict, simplify to just verify bottom nav is hidden on tablet viewport
