## Context

The Roles & Permissions page at `/admin/roles` currently shows a "Coming Soon" placeholder. The backend has a minimal `RoleController` with only a `search()` method, and the `RoleResource` returns only `id` and `name`. The Spatie Laravel Permission package is fully configured with three seeded roles (`superadmin`, `admin`, `user`) and 12 permissions. The existing `UserController`/`UserService` pattern establishes the project's conventions: controller authorizes → delegates to service → returns via API Resource.

The existing `RoleController::search()` endpoint is used by user management dropdowns. It must remain available alongside the new CRUD routes.

## Goals / Non-Goals

**Goals:**
- Full CRUD API for roles with permission assignment, following existing controller/service/resource patterns
- Read-only permission listing endpoint for the role form's permission selector
- Frontend page with paginated table, search, create/edit dialog with permission checkboxes, and delete confirmation
- Reusable `DataTable` and `ConfirmDialog` shared components for future pages (Users, etc.)
- Complete Pest test coverage for authorization, validation, and CRUD operations
- Playwright E2E tests for role management interactions

**Non-Goals:**
- Creating or editing permissions via UI (permissions are developer-controlled, managed via seeders)
- Drag-and-drop permission grouping or advanced permission UI
- Role hierarchy management (parent/child roles)
- Bulk role operations (assign role to multiple users at once)
- Modifying the existing `RolesAndPermissionsSeeder` or permission definitions
- Adding a dedicated Pinia store for roles (local component state is sufficient for this page's scope)

## Decisions

### Decision 1: Role API uses `Route::resource()` with `except(['create', 'edit'])`

The existing `UserController` uses `Route::resource('users', UserController::class)`. Following the same convention for roles keeps the API consistent. The `create` and `edit` actions are excluded since this is an API-only backend (SPA handles forms).

The existing `search()` route (`GET /api/roles/search`) is kept as a separate route registered BEFORE the resource route to avoid route conflicts.

**Alternative considered**: Separate named routes for each action. Rejected — `Route::resource()` is the project convention and provides consistent URL structure.

### Decision 2: RoleResource conditionally includes permissions via `whenLoaded`

The `RoleResource` uses `$this->whenLoaded('permissions')` so that the lightweight `search()` endpoint (used in dropdowns) does not eager-load permissions, while the `index()` and `show()` endpoints include them. The `users_count` is set manually in the service because Spatie's `users()` relationship uses `morphedByMany` which requires a guard-aware model class resolution — `withCount('users')` fails when the guard config is not available in the query builder context.

**Alternative considered**: Always include permissions. Rejected — the search endpoint is used for role selection dropdowns where permissions are unnecessary overhead.

### Decision 3: Permissions are read-only via API

Permissions represent developer-controlled actions (per Spatie best practices from `docs/spatie-permission_v7.x/references/022_roles_vs_permissions.md`). The API only provides `GET /api/permissions` for listing. No create/update/delete endpoints. New permissions are added via seeders or migrations.

### Decision 4: DataTable as a generic shared component with slots

`DataTable.vue` uses a generic type parameter (`generic="T"`) and provides named slots for cell customization (`#cell-{key}`) and row actions (`#rowActions`). This makes it reusable for the Users page and any future admin table.

Props: `columns`, `data`, `loading`, `search`, `pagination`, `emptyText`.
Events: `update:search`, `page-change`.

**Alternative considered**: Using a third-party table library (e.g., TanStack Table). Rejected — adds a dependency for a use case that only needs basic table rendering with shadcn-vue primitives.

### Decision 5: ConfirmDialog as a thin wrapper over shadcn-vue Dialog

`ConfirmDialog.vue` wraps the shadcn-vue `Dialog` with standardized props (`title`, `description`, `variant`, `loading`) and events (`confirm`, `update:open`). This avoids duplicating the confirm/cancel button pattern across pages.

### Decision 6: Role form uses local component state, not a Pinia store

The RolesPage manages its own `ref<Role[]>` and form state. A Pinia store would add complexity without benefit since:
- Role data is only used on this one page
- No other component needs to react to role changes
- The auth store already holds the current user's permissions for authorization checks

### Decision 7: Permission checkboxes in a scrollable grid

The create/edit dialog renders permissions as a 2-column grid of checkboxes inside a scrollable container (`max-h-48`). This handles the current 12 permissions and scales to ~30+ without layout issues.

**Alternative considered**: Multi-select dropdown. Rejected — checkboxes provide better visibility of all available permissions at a glance, which is important for security-sensitive role configuration.

## Risks / Trade-offs

- **`users_count` manual query**: Setting `users_count` manually via `$role->users()->count()` in the service is less efficient than `withCount()`. → Mitigation: Acceptable for the small number of roles in a typical application (< 20). Can be optimized later if needed.
- **No optimistic UI updates**: The page refetches the full role list after every mutation. → Mitigation: The role list is small and the API is fast. Optimistic updates add complexity without meaningful UX benefit here.
- **Permission deletion risk**: If a permission is deleted from the database (via seeder rollback) while a role references it, `syncPermissions` will silently drop it. → Mitigation: Permissions are developer-controlled and should never be deleted without updating seeders and role assignments.
- **DataTable generic type inference**: Vue's `generic="T"` support may have edge cases with complex slot types. → Mitigation: The component uses `Record<string, unknown>` casting internally, keeping the generic simple.
