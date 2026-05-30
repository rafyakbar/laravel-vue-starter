## Why

The Roles & Permissions page (`/admin/roles`) currently renders a "Coming Soon" placeholder. While the RBAC system (Spatie Laravel Permission) is fully functional with seeded roles and permissions, there is no UI or API for administrators to manage roles and their permission assignments at runtime. This forces developers to use seeders or tinker for every role change, which is impractical for production use.

## What Changes

- **Backend API for Role CRUD**: Add RESTful endpoints (`GET/POST/PUT/DELETE /api/roles`) with authorization (`view-roles`, `create-roles`, `update-roles`, `delete-roles`), Form Request validation, and a service layer following the existing `UserController`/`UserService` pattern.
- **Backend API for Permission listing**: Add `GET /api/permissions` endpoint returning all available permissions for the role form's permission selector.
- **Enhanced RoleResource**: Include `permissions` (array of permission names), `users_count`, and timestamps in role API responses.
- **Frontend RolesPage**: Replace the "Coming Soon" placeholder with a full CRUD interface — paginated table with search, create/edit dialog with permission checkboxes, and delete confirmation dialog.
- **Shared components**: Create reusable `DataTable` (table with search, pagination, loading skeleton, row actions slot) and `ConfirmDialog` (reusable delete confirmation) in `resources/app/components/shared/`.
- **shadcn-vue components**: Install `dialog`, `checkbox`, and `table` primitives.
- **i18n**: Add `common.*` keys (search, actions, save, cancel, delete, pagination) and `pages.roles.*` keys to both `en.ts` and `id.ts`.
- **TypeScript types**: Add `Role`, `Permission`, and `RolePayload` interfaces in `resources/app/types/role.ts`.
- **Pest tests**: Cover all role CRUD endpoints for authorization (superadmin/admin/user), validation (required fields, unique name, valid permissions), and CRUD operations.
- **Playwright E2E tests**: Cover role page access, table rendering, create/edit/delete dialog interactions, and search.

## Capabilities

### New Capabilities
- `role-permission-api`: REST API endpoints for role CRUD operations and permission listing, with authorization, validation, and service layer
- `role-permission-ui`: Frontend Vue page for managing roles and their permission assignments, including shared DataTable and ConfirmDialog components

### Modified Capabilities
- `e2e-testing`: New E2E test specs for role management page interactions across superadmin and admin roles

## Impact

- `app/Http/Controllers/RoleController.php` — Extended from search-only to full CRUD
- `app/Http/Controllers/PermissionController.php` — New controller
- `app/Http/Requests/StoreRoleRequest.php` — New form request
- `app/Http/Requests/UpdateRoleRequest.php` — New form request
- `app/Http/Resources/RoleResource.php` — Enhanced with permissions, users_count, timestamps
- `app/Http/Resources/PermissionResource.php` — New resource
- `app/Services/Role/RoleService.php` — Extended with CRUD methods
- `app/Services/Permission/PermissionService.php` — New service
- `routes/api.php` — New routes for role resource and permissions
- `resources/app/views/pages/admin/RolesPage.vue` — Full implementation
- `resources/app/components/shared/DataTable.vue` — New shared component
- `resources/app/components/shared/ConfirmDialog.vue` — New shared component
- `resources/app/components/ui/dialog/` — shadcn-vue dialog
- `resources/app/components/ui/checkbox/` — shadcn-vue checkbox
- `resources/app/components/ui/table/` — shadcn-vue table
- `resources/app/types/role.ts` — New TypeScript types
- `resources/app/locales/en.ts` — New translation keys
- `resources/app/locales/id.ts` — New translation keys
- `tests/Feature/Api/RoleApiTest.php` — Extended Pest tests
- `tests/Feature/Api/PermissionApiTest.php` — New Pest tests
- `tests/e2e/tests/superadmin/role-management.spec.ts` — New Playwright tests
