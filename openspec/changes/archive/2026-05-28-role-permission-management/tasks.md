## 1. Backend — API Resources

### 1.1 Update RoleResource

File: `app/Http/Resources/RoleResource.php`

Update `toArray()` to include permissions (conditionally via `whenLoaded`), `users_count` (from manually set attribute), and human-readable timestamps:

```php
public function toArray($request): array
{
    return [
        'id' => $this->id,
        'name' => $this->name,
        'permissions' => $this->whenLoaded('permissions', fn () => $this->permissions->pluck('name')),
        'users_count' => $this->users_count ?? null,
        'created_at' => $this->created_at?->diffForHumans(),
        'updated_at' => $this->updated_at?->diffForHumans(),
    ];
}
```

- [x] 1.1 Update `app/Http/Resources/RoleResource.php` — add `permissions` (via `whenLoaded`), `users_count` (nullable, manually set), `created_at`, `updated_at` (diffForHumans)

---

### 1.2 Create PermissionResource

File: `app/Http/Resources/PermissionResource.php`

```php
<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PermissionResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
        ];
    }
}
```

- [x] 1.2 Create `app/Http/Resources/PermissionResource.php` returning `id` and `name`

---

## 2. Backend — Form Requests

### 2.1 StoreRoleRequest

File: `app/Http/Requests/StoreRoleRequest.php`

Extends `BaseRequest` (which extends `FormRequest`). Validation rules:

```php
public function rules(): array
{
    return [
        'name' => ['required', 'string', 'max:255', Rule::unique('roles', 'name')->where('guard_name', 'web')],
        'permissions' => ['nullable', 'array'],
        'permissions.*' => ['string', 'exists:permissions,name'],
    ];
}
```

- `name`: required, unique within `guard_name=web` scope
- `permissions`: optional array, each item must exist in `permissions` table

- [x] 2.1 Create `app/Http/Requests/StoreRoleRequest.php` extending `BaseRequest` with rules: `name` (required, string, max:255, unique scoped to guard_name=web), `permissions` (nullable array, each exists in permissions table)

---

### 2.2 UpdateRoleRequest

File: `app/Http/Requests/UpdateRoleRequest.php`

Same rules as StoreRoleRequest but `name` uniqueness ignores the current role:

```php
public function rules(): array
{
    /** @var Role $role */
    $role = $this->route('role');

    return [
        'name' => ['required', 'string', 'max:255', Rule::unique('roles', 'name')->where('guard_name', 'web')->ignore($role->id)],
        'permissions' => ['nullable', 'array'],
        'permissions.*' => ['string', 'exists:permissions,name'],
    ];
}
```

- [x] 2.2 Create `app/Http/Requests/UpdateRoleRequest.php` extending `BaseRequest` with same rules as StoreRoleRequest but `name` uniqueness ignores the current role's ID via `->ignore($role->id)`

---

## 3. Backend — Service Layer

### 3.1 Extend RoleService

File: `app/Services/Role/RoleService.php`

Add four methods to the existing `RoleService`:

**`get(Role $role): RoleResource`**
- Loads `permissions` relationship
- Sets `users_count` manually via `$role->users()->count()` (because `withCount('users')` fails with Spatie's `morphedByMany` guard resolution)
- Returns `new RoleResource($role)`

**`create(array $data): ?Role`**
- Extracts `permissions` via `Data::take($data, 'permissions')`
- Creates role with `Role::create(['name' => $data['name'], 'guard_name' => 'web'])`
- If permissions provided, calls `$role->syncPermissions($permissions)`
- Returns `$role->fresh()`

**`update(Role $role, array $data): bool`**
- Extracts `permissions` via `Data::take($data, 'permissions')`
- Updates role name: `$role->update(['name' => $data['name']])`
- If permissions provided (even empty array), calls `$role->syncPermissions($permissions)`
- Returns boolean

**`delete(Role $role): bool`**
- Returns `$role->delete()`

Update existing `index()` method:
- Add `->with('permissions')` to query
- Add default sort: `$query->orderBy('id', 'asc')` when no sort params provided

- [x] 3.1 Extend `app/Services/Role/RoleService.php` — add `get(Role)` (loads permissions, sets users_count manually), `create(array)` (Data::take permissions, syncPermissions), `update(Role, array)` (syncPermissions), `delete(Role)`. Update `index()` to eager-load permissions and default sort by id asc

---

### 3.2 Create PermissionService

File: `app/Services/Permission/PermissionService.php`

```php
<?php

namespace App\Services\Permission;

use App\Http\Resources\PermissionResource;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Spatie\Permission\Models\Permission;

class PermissionService
{
    public function index(): AnonymousResourceCollection
    {
        return PermissionResource::collection(
            Permission::query()->orderBy('name')->get()
        );
    }
}
```

- [x] 3.2 Create `app/Services/Permission/PermissionService.php` with `index()` method returning all permissions ordered by name as `PermissionResource::collection`

---

## 4. Backend — Controllers

### 4.1 Extend RoleController

File: `app/Http/Controllers/RoleController.php`

Replace the existing minimal controller with full CRUD. Constructor injects `RoleService`. Each method:

**`index(Request $request): AnonymousResourceCollection`**
- `$this->authorize('view-roles')`
- Returns `$this->roleService->index($request->all())`

**`store(StoreRoleRequest $request): JsonResponse`**
- `$this->authorize('create-roles')`
- Calls `$this->roleService->create($request->validated())`
- Returns `$this->responseStoreSuccess(['record' => $this->roleService->get($record)])` or `$this->responseStoreFail()`

**`show(Role $role): JsonResponse`**
- `$this->authorize('view-roles')`
- Returns `$this->responseDataSuccess(['model' => $this->roleService->get($role)])`

**`update(UpdateRoleRequest $request, Role $role): JsonResponse`**
- `$this->authorize('update-roles')`
- Calls `$this->roleService->update($role, $request->validated())`
- Returns `$this->responseUpdateSuccess(['record' => $this->roleService->get($role->fresh())])` or `$this->responseUpdateFail()`

**`destroy(Role $role): JsonResponse`**
- `$this->authorize('delete-roles')`
- Returns `$this->responseDeleteSuccess(['record' => $role])` or `$this->responseDeleteFail()`

**`search(Request $request): AnonymousResourceCollection`** (keep existing)
- No authorization (used by dropdowns)
- Returns `$this->roleService->index($request->all())`

- [x] 4.1 Rewrite `app/Http/Controllers/RoleController.php` — add `index`, `store`, `show`, `update`, `destroy` methods with `$this->authorize()` calls. Keep existing `search()` method. Use `StoreRoleRequest`/`UpdateRoleRequest` for validation. Follow `UserController` response patterns (`responseStoreSuccess`, `responseUpdateSuccess`, etc.)

---

### 4.2 Create PermissionController

File: `app/Http/Controllers/PermissionController.php`

```php
<?php

namespace App\Http\Controllers;

use App\Services\Permission\PermissionService;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class PermissionController extends Controller
{
    public function __construct(private PermissionService $permissionService) {}

    public function index(): AnonymousResourceCollection
    {
        $this->authorize('view-roles');
        return $this->permissionService->index();
    }
}
```

- [x] 4.2 Create `app/Http/Controllers/PermissionController.php` with single `index()` method authorizing `view-roles` and delegating to `PermissionService::index()`

---

## 5. Backend — Routes

### 5.1 Update api.php

File: `routes/api.php`

Add inside the existing `auth:sanctum` middleware group:

```php
/**
 * Roles
 */
Route::get('/roles/search', [RoleController::class, 'search'])->middleware('throttle:400,1');
Route::resource('roles', RoleController::class)->except(['create', 'edit']);

/**
 * Permissions
 */
Route::get('/permissions', [PermissionController::class, 'index']);
```

**IMPORTANT**: The `roles/search` route MUST be registered BEFORE `Route::resource('roles')` to avoid the resource route's `roles/{role}` parameter catching "search" as a role ID.

Add `PermissionController` to the use statements at the top.

- [x] 5.1 Update `routes/api.php` — add `Route::resource('roles', RoleController::class)->except(['create', 'edit'])` and `Route::get('/permissions', [PermissionController::class, 'index'])` inside auth:sanctum group. Ensure `roles/search` route is registered BEFORE the resource route

---

## 6. Backend — Pest Tests

### 6.1 Rewrite RoleApiTest

File: `tests/Feature/Api/RoleApiTest.php`

Replace existing 2-test file with comprehensive coverage. Use existing helpers: `actingAsSuperadmin()`, `actingAsAdmin()`, `actingAsUser()`. Use `Spatie\Permission\Models\Role` and `Spatie\Permission\Models\Permission` for model references.

**Authorization tests (6):**
- `superadmin can list roles` — GET /api/roles → assertSuccessful, assertJsonStructure(['data', 'meta'])
- `admin cannot list roles` — GET /api/roles → assertForbidden
- `user cannot list roles` — GET /api/roles → assertForbidden
- `unauthenticated role list returns 401` — GET /api/roles → assertUnauthorized
- `superadmin can view a role` — GET /api/roles/{id} → assertSuccessful, assertJsonStructure(['model'])
- `role detail includes permissions and users count` — GET /api/roles/{id} → assertJsonStructure(['model' => ['id', 'name', 'permissions', 'users_count']])

**CRUD tests (7):**
- `superadmin can create a role` — POST /api/roles with name + permissions → assertSuccessful, verify role exists with permissions
- `superadmin can create a role without permissions` — POST /api/roles with name only → assertSuccessful
- `superadmin can update a role` — PUT /api/roles/{id} with new name + permissions → assertSuccessful, verify updated
- `superadmin can update role permissions only` — PUT /api/roles/{id} with same name + different permissions → verify old permission removed, new added
- `superadmin can delete a role` — DELETE /api/roles/{id} → assertSuccessful, verify Role::find returns null
- `admin cannot create a role` — POST /api/roles → assertForbidden
- `admin cannot update a role` — PUT /api/roles/{id} → assertForbidden
- `admin cannot delete a role` — DELETE /api/roles/{id} → assertForbidden
- `user cannot delete a role` — DELETE /api/roles/{id} → assertForbidden

**Validation tests (4):**
- `create role requires name` — POST /api/roles with empty body → assertUnprocessable, assertInvalid('name')
- `create role requires unique name` — POST /api/roles with name='admin' → assertUnprocessable, assertInvalid('name')
- `update role requires unique name excluding self` — PUT /api/roles/{adminId} with name='superadmin' → assertUnprocessable, assertInvalid('name')
- `create role validates permissions exist` — POST /api/roles with permissions=['non-existent'] → assertUnprocessable, assertInvalid('permissions.0')

**Search tests (2):**
- `search roles returns paginated results` — GET /api/roles/search?search=admin → assertSuccessful
- `search roles returns 401 for unauthenticated request` — GET /api/roles/search → assertUnauthorized

**Data shape tests (1):**
- `role list includes permissions` — GET /api/roles → verify superadmin's permissions array is non-empty

**NOTE**: Use `Role::findByName('admin', 'web')` (with explicit guard) to avoid guard resolution issues in test context.

- [x] 6.1 Rewrite `tests/Feature/Api/RoleApiTest.php` with 22 tests covering: authorization (superadmin/admin/user/unauthenticated for list, view, create, update, delete), CRUD operations (create with/without permissions, update name+permissions, update permissions only, delete), validation (required name, unique name, unique name excluding self, invalid permissions), search (paginated results, unauthenticated), data shape (permissions included, users_count included)

---

### 6.2 Create PermissionApiTest

File: `tests/Feature/Api/PermissionApiTest.php`

**Tests (5):**
- `superadmin can list permissions` — GET /api/permissions → assertSuccessful, assertJsonStructure(['data'])
- `admin cannot list permissions` — GET /api/permissions → assertForbidden
- `user cannot list permissions` — GET /api/permissions → assertForbidden
- `unauthenticated permission list returns 401` — GET /api/permissions → assertUnauthorized
- `permission list returns all seeded permissions` — GET /api/permissions → verify data contains 'view-users', 'create-roles', 'access-admin-panel', 'edit-profile'

- [x] 6.2 Create `tests/Feature/Api/PermissionApiTest.php` with 5 tests: authorization (superadmin/admin/user/unauthenticated), data completeness (all seeded permissions present)

---

### 6.3 Run and verify tests

- [x] 6.3 Run `php artisan test --compact` — verify ALL tests pass (existing + new)
- [x] 6.4 Run `vendor/bin/pint --dirty --format agent` — verify no PHP formatting issues

---

## 7. Frontend — shadcn-vue Components

### 7.1 Install components

```bash
npx shadcn-vue@latest add dialog checkbox table --yes
```

This creates:
- `resources/app/components/ui/dialog/` — Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose, DialogOverlay, DialogScrollContent, DialogTrigger
- `resources/app/components/ui/checkbox/` — Checkbox (reka-ui CheckboxRoot + CheckboxIndicator)
- `resources/app/components/ui/table/` — Table, TableBody, TableCaption, TableCell, TableEmpty, TableFooter, TableHead, TableHeader, TableRow

- [x] 7.1 Run `npx shadcn-vue@latest add dialog checkbox table --yes` to install shadcn-vue dialog, checkbox, and table components

---

## 8. Frontend — TypeScript Types

### 8.1 Create role types

File: `resources/app/types/role.ts`

```ts
export interface Role {
  id: number
  name: string
  permissions?: string[]
  users_count?: number | null
  created_at?: string | null
  updated_at?: string | null
}

export interface Permission {
  id: number
  name: string
}

export interface RolePayload {
  name: string
  permissions?: string[]
}
```

- [x] 8.1 Create `resources/app/types/role.ts` with `Role` (id, name, permissions?, users_count?, created_at?, updated_at?), `Permission` (id, name), and `RolePayload` (name, permissions?) interfaces

---

## 9. Frontend — Shared Components

### 9.1 DataTable component

File: `resources/app/components/shared/DataTable.vue`

Generic Vue component (`generic="T"`) with:

**Props:**
```ts
defineProps<{
  columns: Column[]        // { key: string, label: string, class?: string }
  data: T[]                // Table row data
  loading?: boolean        // Show skeleton when true (default false)
  search?: string          // v-model search value (default '')
  pagination?: PaginationMeta | null  // Laravel pagination meta (default null)
  emptyText?: string       // Empty state text (default 'No data found')
}>()
```

**Events:** `update:search`, `page-change`

**Slots:**
- `#actions` — Action buttons next to search (e.g., Create Role button)
- `#cell-{key}` — Custom cell rendering per column (receives `{ item, index }`)
- `#rowActions` — Row action buttons (receives `{ item, index }`), auto-adds Actions column header

**Template structure:**
1. Search bar with `Search` lucide icon + `#actions` slot
2. `<Table>` with `<TableHeader>` (columns + optional Actions column) and `<TableBody>`:
   - Loading state: 5 skeleton rows
   - Empty state: single row with `emptyText`
   - Data state: rows with `#cell-{key}` slots falling back to `item[key]`
3. Pagination footer (when `pagination.last_page > 1`): "Showing X to Y of Z entries" + prev/next buttons + page indicator

**Imports:** shadcn-vue `Table*`, `Button`, `Input`, `Skeleton`, lucide `ChevronLeft`, `ChevronRight`, `Search`

- [x] 9.1 Create `resources/app/components/shared/DataTable.vue` — generic table component with `columns`, `data`, `loading`, `search`, `pagination`, `emptyText` props. Features: search input with icon, `#actions` slot, loading skeleton (5 rows), empty state, `#cell-{key}` slots for custom rendering, `#rowActions` slot (auto-adds Actions column), pagination footer with prev/next and page info. Use shadcn-vue Table, Button, Input, Skeleton components

---

### 9.2 ConfirmDialog component

File: `resources/app/components/shared/ConfirmDialog.vue`

**Props:**
```ts
defineProps<{
  open: boolean
  title: string
  description: string
  confirmText?: string     // Default: t('common.confirm')
  cancelText?: string      // Default: t('common.cancel')
  variant?: 'default' | 'destructive'  // Default: 'destructive'
  loading?: boolean        // Default: false
}>()
```

**Events:** `update:open`, `confirm`

**Template:** shadcn-vue `Dialog` with `DialogContent` (max-w-md), `DialogHeader` (title + description), `DialogFooter` with Cancel (outline) and Confirm (variant) buttons. Both buttons disabled when `loading` is true.

- [x] 9.2 Create `resources/app/components/shared/ConfirmDialog.vue` — wraps shadcn-vue Dialog with props: `open`, `title`, `description`, `confirmText` (default t('common.confirm')), `cancelText` (default t('common.cancel')), `variant` (default 'destructive'), `loading`. Emits: `update:open`, `confirm`. Cancel/Confirm buttons disabled when loading

---

## 10. Frontend — i18n

### 10.1 Update English translations

File: `resources/app/locales/en.ts`

Add new `common` section at the top level:

```ts
common: {
  search: 'Search...',
  actions: 'Actions',
  cancel: 'Cancel',
  confirm: 'Confirm',
  save: 'Save',
  delete: 'Delete',
  edit: 'Edit',
  create: 'Create',
  previous: 'Previous',
  next: 'Next',
  paginationInfo: 'Showing {from} to {to} of {total} entries',
  loading: 'Loading...',
  saving: 'Saving...',
  noData: 'No data found',
},
```

Expand `pages.roles` section:

```ts
roles: {
  title: 'Roles & Permissions',
  description: 'Manage roles and their permissions',
  createRole: 'Create Role',
  editRole: 'Edit Role',
  deleteRole: 'Delete Role',
  deleteRoleConfirm: 'Are you sure you want to delete this role? This action cannot be undone.',
  roleName: 'Role Name',
  permissions: 'Permissions',
  usersCount: 'Users',
  selectPermissions: 'Select permissions for this role',
  noPermissions: 'No permissions assigned',
},
```

- [x] 10.1 Update `resources/app/locales/en.ts` — add `common` section (search, actions, cancel, confirm, save, delete, edit, create, previous, next, paginationInfo, loading, saving, noData) and expand `pages.roles` with createRole, editRole, deleteRole, deleteRoleConfirm, roleName, permissions, usersCount, selectPermissions, noPermissions

---

### 10.2 Update Indonesian translations

File: `resources/app/locales/id.ts`

Add matching Indonesian translations:

```ts
common: {
  search: 'Cari...',
  actions: 'Aksi',
  cancel: 'Batal',
  confirm: 'Konfirmasi',
  save: 'Simpan',
  delete: 'Hapus',
  edit: 'Edit',
  create: 'Buat',
  previous: 'Sebelumnya',
  next: 'Berikutnya',
  paginationInfo: 'Menampilkan {from} sampai {to} dari {total} entri',
  loading: 'Memuat...',
  saving: 'Menyimpan...',
  noData: 'Tidak ada data',
},
```

```ts
roles: {
  title: 'Peran & Izin',
  description: 'Kelola peran dan izinnya',
  createRole: 'Buat Peran',
  editRole: 'Edit Peran',
  deleteRole: 'Hapus Peran',
  deleteRoleConfirm: 'Apakah Anda yakin ingin menghapus peran ini? Tindakan ini tidak dapat dibatalkan.',
  roleName: 'Nama Peran',
  permissions: 'Izin',
  usersCount: 'Pengguna',
  selectPermissions: 'Pilih izin untuk peran ini',
  noPermissions: 'Tidak ada izin yang ditetapkan',
},
```

- [x] 10.2 Update `resources/app/locales/id.ts` — add matching Indonesian translations for all new `common.*` and `pages.roles.*` keys

---

## 11. Frontend — RolesPage Implementation

### 11.1 Page structure and data fetching

File: `resources/app/views/pages/admin/RolesPage.vue`

Replace the "Coming Soon" placeholder with full implementation.

**Script setup imports:**
- `useI18n` from `@/composables/useI18n`
- `BasicPage` from `@/components/shared/BasicPage.vue`
- `DataTable` from `@/components/shared/DataTable.vue` + `Column` type
- `ConfirmDialog` from `@/components/shared/ConfirmDialog.vue`
- `Button`, `Badge`, `Checkbox`, `Input`, `Label` from shadcn-vue
- `Dialog`, `DialogContent`, `DialogDescription`, `DialogFooter`, `DialogHeader`, `DialogTitle` from shadcn-vue
- `Plus`, `Pencil`, `Trash2` from lucide-vue-next
- `apiGet`, `apiPost`, `apiPut`, `apiDelete`, `ApiError` from `@/services/api`
- `Role`, `Permission`, `RolePayload` from `@/types/role`

**Reactive state:**
```ts
const roles = ref<Role[]>([])
const permissions = ref<Permission[]>([])
const loading = ref(false)
const search = ref('')
const pagination = ref<PaginationMeta | null>(null)

// Form state
const formOpen = ref(false)
const formLoading = ref(false)
const editingRole = ref<Role | null>(null)
const formName = ref('')
const formPermissions = ref<string[]>([])
const formErrors = ref<Record<string, string[]>>({})

// Delete state
const deleteOpen = ref(false)
const deleteLoading = ref(false)
const deletingRole = ref<Role | null>(null)
```

**Columns definition:**
```ts
const columns: Column[] = [
  { key: 'name', label: t('pages.roles.roleName') },
  { key: 'permissions', label: t('pages.roles.permissions') },
  { key: 'users_count', label: t('pages.roles.usersCount'), class: 'w-[100px] text-center' },
]
```

**`fetchRoles(page = 1)`** — GET `/api/roles?page=X&per_page=10&search=Y`, sets `roles`, `pagination`
**`fetchPermissions()`** — GET `/api/permissions`, sets `permissions`
**`onMounted`** — calls both `fetchRoles()` and `fetchPermissions()`
**`watch(search)`** — calls `fetchRoles(1)` on search change

- [x] 11.1 Rewrite `resources/app/views/pages/admin/RolesPage.vue` script setup — import all dependencies, define reactive state (roles, permissions, loading, search, pagination, form state, delete state), columns definition, `fetchRoles(page)` (GET /api/roles with pagination+search), `fetchPermissions()` (GET /api/permissions), `onMounted` calls both, `watch(search)` resets to page 1

---

### 11.2 Create/Edit dialog

**`openCreate()`** — resets form (editingRole=null, formName='', formPermissions=[], formErrors={}), opens dialog
**`openEdit(role)`** — sets editingRole, pre-fills formName and formPermissions from role, opens dialog
**`closeForm()`** — closes dialog, clears editingRole

**`saveRole()`** — sets formLoading, builds `RolePayload`, calls `apiPost('/api/roles', payload)` or `apiPut('/api/roles/{id}', payload)`. On success: closes dialog, refreshes table. On 422: extracts `error.data.errors` into `formErrors`

**`togglePermission(perm)`** — adds/removes permission name from `formPermissions` array

**Dialog template:**
- `Dialog` bound to `formOpen`
- `DialogContent` with `sm:max-w-lg max-h-[90vh] overflow-y-auto`
- `DialogHeader` — title (Create Role / Edit Role), description
- Role name `Input` with `Label`, error message below
- Permissions section: `Label` + scrollable `div` (grid-cols-2, max-h-48, overflow-y-auto) with `Checkbox` + `Label` for each permission
- `DialogFooter` — Cancel (outline) + Save buttons, disabled when formLoading

- [x] 11.2 Implement create/edit dialog in RolesPage — `openCreate()` (reset form, open dialog), `openEdit(role)` (pre-fill from role, open dialog), `saveRole()` (POST or PUT based on editingRole, handle 422 validation errors), `togglePermission(perm)` (add/remove from array). Dialog: role name Input with error display, 2-column scrollable checkbox grid for permissions, Cancel + Save footer buttons

---

### 11.3 Delete confirmation

**`openDelete(role)`** — sets deletingRole, opens ConfirmDialog
**`closeDelete()`** — closes dialog, clears deletingRole
**`confirmDelete()`** — sets deleteLoading, calls `apiDelete('/api/roles/{id}')`, on success: closes dialog, refreshes table

**ConfirmDialog usage:**
```vue
<ConfirmDialog
  :open="deleteOpen"
  :title="t('pages.roles.deleteRole')"
  :description="t('pages.roles.deleteRoleConfirm')"
  :loading="deleteLoading"
  @update:open="closeDelete"
  @confirm="confirmDelete"
/>
```

- [x] 11.3 Implement delete confirmation in RolesPage — `openDelete(role)` (set deletingRole, open dialog), `confirmDelete()` (DELETE /api/roles/{id}, refresh table on success). Wire `ConfirmDialog` with title, description, loading props and update:open/confirm events

---

### 11.4 Template structure

**Page layout:**
```vue
<BasicPage :title="t('pages.roles.title')" :description="t('pages.roles.description')">
  <template #actions>
    <Button @click="openCreate">
      <Plus class="h-4 w-4" />
      {{ t('pages.roles.createRole') }}
    </Button>
  </template>

  <DataTable :columns :data="roles" :loading :search :pagination
    :empty-text="t('common.noData')"
    @update:search="search = $event"
    @page-change="onPageChange">

    <template #cell-name="{ item }">
      <span class="font-medium">{{ item.name }}</span>
    </template>

    <template #cell-permissions="{ item }">
      <!-- Badge list: max 3 badges + "+N" overflow indicator -->
    </template>

    <template #cell-users_count="{ item }">
      <span class="text-center block">{{ item.users_count ?? 0 }}</span>
    </template>

    <template #rowActions="{ item }">
      <!-- Edit button (Pencil icon) + Delete button (Trash2 icon, text-destructive) -->
    </template>
  </DataTable>

  <!-- Create/Edit Dialog -->
  <!-- Delete ConfirmDialog -->
</BasicPage>
```

**Permissions cell rendering:**
- Show up to 3 permission names as `<Badge variant="secondary">`
- If more than 3, show `<Badge variant="outline">+N</Badge>`
- If no permissions, show muted text "No permissions assigned"

**Row actions:**
- Edit: `<Button variant="ghost" size="icon" class="h-8 w-8">` with `<Pencil>` icon
- Delete: `<Button variant="ghost" size="icon" class="h-8 w-8 text-destructive">` with `<Trash2>` icon

- [x] 11.4 Implement RolesPage template — BasicPage with #actions slot (Create Role button), DataTable with columns/data/search/pagination props, cell slots: #cell-name (font-medium), #cell-permissions (badge list max 3 + overflow), #cell-users_count (centered), #rowActions (edit Pencil + delete Trash2 ghost buttons). Include Create/Edit Dialog and Delete ConfirmDialog

---

## 12. Frontend — Build Verification

- [x] 12.1 Run `npm run build` — verify no TypeScript or Vite errors
- [x] 12.2 Run `vendor/bin/pint --dirty --format agent` — verify no PHP formatting issues

---

## 13. E2E — Playwright Desktop Tests

### 13.1 Create role-management.spec.ts

File: `tests/e2e/tests/superadmin/role-management.spec.ts`

**Test structure:**
```ts
import { test, expect } from '@playwright/test'

test.describe('Superadmin Role — Role Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/admin/roles')
    await page.waitForLoadState('networkidle')
  })

  // ... tests
})
```

**Tests (9):**
1. `can access roles page and see heading` — verify URL is /admin/roles, heading "Roles & Permissions" visible
2. `can see seeded roles in table` — verify "superadmin", "admin", "user" text visible
3. `can see Create Role button` — verify button with name "Create Role" visible
4. `can open create role dialog` — click "Create Role", verify dialog visible, heading "Create Role" visible
5. `can create a new role` — click "Create Role", fill "test-editor" in Role Name input, click "Save", wait for networkidle, verify "test-editor" visible in table
6. `can edit an existing role` — click first edit button (Pencil icon), verify dialog visible, heading "Edit Role" visible
7. `can open delete confirmation dialog` — click first delete button (Trash2 icon), verify dialog visible, text "Are you sure you want to delete this role?" visible
8. `can search roles` — fill "super" in Search input, wait for networkidle, verify "superadmin" visible
9. `can see permissions badges for superadmin role` — verify "access-admin-panel" badge text visible

**Locator patterns:**
- Edit buttons: `page.locator('button').filter({ has: page.locator('svg.lucide-pencil') })`
- Delete buttons: `page.locator('button').filter({ has: page.locator('svg.lucide-trash-2') })`
- Dialog: `page.getByRole('dialog')`
- Search input: `page.getByPlaceholder('Search...')`
- Role name input: `page.getByPlaceholder('Role Name')`

- [x] 13.1 Create `tests/e2e/tests/superadmin/role-management.spec.ts` with `beforeEach` navigating to /admin/roles. Tests: page access + heading, seeded roles visible, Create Role button, open create dialog, create new role flow, open edit dialog, open delete confirmation, search functionality, permission badges visible

---

## 14. E2E — Playwright Responsive Tests

### 14.1 Mobile viewport tests (375x667)

File: `tests/e2e/tests/superadmin/role-management-responsive.spec.ts`

**Mobile describe block:**
```ts
test.describe('Superadmin Mobile Viewport — Role Management (375x667)', () => {
  test.use({ viewport: { width: 375, height: 667 } })

  // ... tests
})
```

**Mobile tests (5):**

1. `roles page accessible with bottom nav on mobile`
   - Navigate to `/admin/roles`, wait for networkidle
   - Assert: bottom nav visible (`page.locator('nav.md\\:hidden')`)
   - Assert: "Roles & Permissions" heading visible
   - Assert: table visible (roles text "superadmin" visible)

2. `create role dialog works on mobile`
   - Navigate to `/admin/roles`, click "Create Role"
   - Assert: dialog visible
   - Assert: Role Name input visible
   - Assert: permission checkboxes visible (at least "edit-profile" checkbox)

3. `search input works on mobile`
   - Navigate to `/admin/roles`
   - Fill "super" in search input (`page.getByPlaceholder('Search...')`)
   - Wait for networkidle
   - Assert: "superadmin" visible

4. `bottom nav shows Site, Dashboard, Menu, Profile on roles page mobile`
   - Navigate to `/admin/roles`, wait for networkidle
   - Assert: bottom nav visible
   - Assert: Site link, Dashboard link, Menu button, Profile button all visible

5. `Menu button opens sidebar drawer with Roles link on mobile`
   - Navigate to `/admin/roles`, wait for networkidle
   - Click Menu button in bottom nav
   - Assert: sidebar visible (`page.locator('[data-sidebar="content"]')`)
   - Assert: "Roles & Permissions" link visible in sidebar

---

### 14.2 Tablet viewport tests (769x1024)

Same file, second describe block:

```ts
test.describe('Superadmin Tablet Viewport — Role Management (769x1024)', () => {
  test.use({ viewport: { width: 769, height: 1024 } })

  // ... tests
})
```

**Tablet tests (3):**

1. `roles page with sidebar visible on tablet, bottom nav hidden`
   - Navigate to `/admin/roles`, wait for networkidle
   - Assert: sidebar visible (`page.locator('[data-sidebar="content"]')`)
   - Assert: bottom nav NOT visible (`page.locator('nav.md\\:hidden')`)
   - Assert: "Roles & Permissions" heading visible

2. `create role dialog works on tablet`
   - Navigate to `/admin/roles`, click "Create Role"
   - Assert: dialog visible
   - Assert: Role Name input visible
   - Assert: permission checkboxes visible

3. `table displays all columns on tablet`
   - Navigate to `/admin/roles`, wait for networkidle
   - Assert: "Role Name" column header visible
   - Assert: "Permissions" column header visible
   - Assert: "Users" column header visible

---

### 14.3 Admin restricted access responsive tests

File: `tests/e2e/tests/admin/role-management-restricted.spec.ts`

**Mobile describe block:**
```ts
test.describe('Admin Mobile Viewport — Role Management Restricted (375x667)', () => {
  test.use({ viewport: { width: 375, height: 667 } })

  test('admin redirected from roles page to dashboard on mobile', async ({ page }) => {
    await page.goto('/admin/roles')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveURL(/\/admin$|\/admin\//)
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible()
  })
})
```

**Tablet describe block:**
```ts
test.describe('Admin Tablet Viewport — Role Management Restricted (769x1024)', () => {
  test.use({ viewport: { width: 769, height: 1024 } })

  test('admin redirected from roles page to dashboard on tablet', async ({ page }) => {
    await page.goto('/admin/roles')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveURL(/\/admin$|\/admin\//)
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible()
  })
})
```

- [x] 14.1 Create `tests/e2e/tests/superadmin/role-management-responsive.spec.ts` with two describe blocks:
  - **Mobile (375x667)**: 5 tests — roles page accessible with bottom nav, create dialog works on mobile, search works on mobile, bottom nav items visible, Menu opens sidebar drawer with Roles link
  - **Tablet (769x1024)**: 3 tests — sidebar visible + bottom nav hidden, create dialog works on tablet, all table columns visible
- [x] 14.2 Create `tests/e2e/tests/admin/role-management-restricted.spec.ts` with two describe blocks:
  - **Mobile (375x667)**: admin redirected from /admin/roles to dashboard
  - **Tablet (769x1024)**: admin redirected from /admin/roles to dashboard

---

## 15. Final Verification

- [x] 15.1 Run `php artisan test --compact` — verify ALL Pest tests pass
- [x] 15.2 Run `vendor/bin/pint --dirty --format agent` — verify no PHP formatting issues
- [x] 15.3 Run `npm run build` — verify no TypeScript or Vite errors
- [x] 15.4 Run `npm run test:e2e` — verify ALL Playwright tests pass (requires database not locked by dev server; stop dev server first if needed)
- [x] 15.5 Manual verification: open the app in a browser at desktop, tablet (769px), and mobile (375px) viewports. Verify:
  - Desktop: sidebar + roles table + create/edit/delete dialogs work
  - Tablet: sidebar visible alongside table, dialogs centered
  - Mobile: bottom nav visible, roles page accessible, dialogs functional, search works
