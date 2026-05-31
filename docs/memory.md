# Project Memory — Laravel Vue Starter

> Konsolidasi pengetahuan project hasil analisa dokumentasi `docs/project`, `docs/openspec_v1.3`, `docs/playwright_v1.60.x`, dan `docs/spatie-permission_v7.x`. Dipakai sebagai single-source quick reference.

---

## 1. Project Overview

Production-ready admin dashboard starter kit (Laravel 13 + Vue 3 SPA) yang menghilangkan setup repetitif: auth, user management, RBAC, file upload, arsitektur SPA.

### Personas
- **Starter Kit Developer** — clone repo untuk membangun app admin/backoffice baru
- **Admin User** — akses penuh: kelola user, assign role, konfigurasi app
- **Regular User** — akses terbatas: edit profil sendiri, aksi yang di-gate permission

### Success Criteria
- Semua endpoint API dilindungi auth + ability-based authorization
- Zero TypeScript error pada `npm run build`
- Semua test lulus via `php artisan test`
- PHP terformat Pint (`vendor/bin/pint --test` lulus)
- Response API < 200ms untuk CRUD standar

### Roadmap
| Phase | Scope | Status |
|-------|-------|--------|
| **MVP** | Auth, User CRUD, RBAC, Media, API, Tests, SPA shell | ✅ Complete |
| **v1.1** | Frontend auth pages, user management UI, dashboard | Planned |
| **v1.2** | Profile settings, avatar upload UI, toasts, data tables | Planned |
| **v2.0** | 2FA activation, activity logging, audit trail, notifications | Planned |

### Non-Goals
Multi-tenancy, OAuth/social login, real-time features, approval workflows, email template UI.

### Constraints
PHP 8.4+, Node.js 20+, SQLite default (swappable via `.env`), single `User` model, no external SaaS.

---

## 2. Architecture

### High-Level
```
Browser (Vue 3 SPA) ←→ HTTP/Cookie (Sanctum) ←→ Laravel 13 API
```

### Request Flow
- **SPA Page Load**: URL apa pun → catch-all `/{any?}` → Blade + Vite → Vue Router ambil alih → API calls `/api/*`
- **API Request**: frontend `/api/*` + session cookie → Sanctum auth → Controller authorize → Service → Resource

### Service Layer Pattern
```
Route → Controller → Service → Model → Database
              ↑                              ↓
         Form Request                   Eloquent
              ↓
         API Resource (response)
```
Controllers **thin**: authorize, call service, return response (max 5-10 baris/method).

### Backend Structure
```
app/
├── Actions/Fortify/    # CreateNewUser, UpdateProfile, ResetPassword, dll
├── Http/
│   ├── Controllers/    # Thin controllers
│   ├── Middleware/      # ApplyLocale, RedirectIfAuthenticated
│   ├── Requests/        # Form request validation
│   ├── Resources/       # API resource transformers
│   └── Responses/       # Custom Fortify response contracts
├── Models/              # Eloquent
├── Providers/           # AppServiceProvider, FortifyServiceProvider
├── Services/            # User/, Role/, Media/, Permission/
├── Traits/              # Filterable, Searchable
└── Utilities/           # Data helper
```

### Frontend Structure
```
resources/app/
├── assets/css/          # Tailwind entry
├── components/
│   ├── ui/              # shadcn-vue base
│   ├── prop-ui/         # Composed patterns (Modal, dll)
│   └── shared/          # App-wide shared
├── composables/         # useI18n, useSeoMeta, useScrollAnimation
├── lib/utils.ts         # cn() helper
├── router/              # index.ts + guards.ts
├── services/api.ts      # Fetch wrapper + CSRF
├── stores/              # auth.ts, preferences.ts
├── types/               # auth.ts, role.ts
├── views/
│   ├── layouts/         # AdminLayout, DefaultLayout, LandingLayout
│   └── pages/           # auth/, admin/, public/, HomePage, ProfilePage
├── locales/             # en.ts, id.ts
├── App.vue
└── main.ts
```

### Routing
| File | Scope | Middleware |
|------|-------|-----------|
| `routes/web.php` | SPA catch-all | web |
| `routes/api.php` | REST API | auth:sanctum, apply_locale |

### Tech Stack
- **Backend**: Laravel 13, PHP 8.4, Fortify v1, Sanctum v4, Spatie Permission v7, Spatie Media Library v11, SQLite, Pest v4, Pint v1
- **Frontend**: Vue 3.5, TypeScript 5.9, Vite 8, Tailwind 4, Pinia 3, Vue Router 5, reka-ui 2.9, shadcn-vue 2.7, @lucide/vue, vee-validate 4.15, vue-sonner, @vueuse/core

### Design Patterns
- **Repository-less**: Eloquent langsung di service
- **Trait-based models**: Filterable, Searchable, HasMedia, HasRoles
- **Responsive modals**: Dialog desktop (≥768px), Drawer mobile (<768px)
- **Admin layout**: SidebarProvider → Sidebar + SidebarInset

---

## 3. Database Schema

Engine: SQLite (default, swappable ke MySQL/PostgreSQL).

### Core Tables
- **users**: `id, first_name, last_name, middle_name?, email(unique), email_verified_at, password(bcrypt), remember_token, two_factor_secret, two_factor_recovery_codes, two_factor_confirmed_at, timestamps`
- **roles** (Spatie): `id, name(unique+scope), title, scope, timestamps`
- **permissions** (pivot): `id, ability_id(FK), entity_id, entity_type, forbidden, scope`
- **abilities**: `id, name, title, entity_id, entity_type, only_owned, options(JSON), scope, timestamps`
- **assigned_roles**: `id, role_id(FK cascade), entity_id, entity_type, restricted_to_*, scope`
- **media** (Spatie): `id, model_type, model_id, uuid(unique), collection_name, name, file_name, mime_type, disk, size, *(JSON), order_column`
- **sessions**: `id, user_id, ip_address, user_agent, payload, last_activity`
- **personal_access_tokens**: `id, tokenable_*, name, token(unique), abilities(JSON), last_used_at, expires_at`
- **password_reset_tokens**: `email(PK), token, created_at`
- **Infra**: jobs, failed_jobs, job_batches, cache, cache_locks

### User Relations
```php
User::class
├── HasApiTokens (Sanctum)  → personal_access_tokens
├── HasRoles (Spatie)       → assigned_roles → roles → abilities
├── InteractsWithMedia      → media (collection: 'avatars')
├── Filterable              → dynamic filters
└── Searchable              → fields: name, username, email
```

### Avatar Conversions
`small_thumb` 300x300 · `medium_thumb` 600x600 · `large_thumb` 1200x1200 (semua non-queued).

### Notes
- SQLite tidak enforce FK by default — relasi di-maintain app level
- 2FA columns nullable (fitur opsional)
- `scope` untuk multi-tenancy (default null)

---

## 4. API Specification

Base URL: `/api`. Auth: SPA (cookie/Sanctum stateful) atau Mobile (Bearer token).

### Response Format
- Success: `{ "message": "...", "record": {...} }`
- Paginated: `{ "data": [...], "links": {...}, "meta": {...} }`
- Validation 422: `{ "message": "...", "errors": { "field": ["msg"] } }`

### Fortify Auth (web middleware, no `/api` prefix)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/login` | Login (email ATAU username + password) |
| POST | `/logout` | Destroy session |
| POST | `/register` | Register |
| POST | `/forgot-password` | Send reset link |
| POST | `/reset-password` | Reset dengan token |
| POST | `/email/verification-notification` | Resend verify email |
| GET | `/email/verify/{id}/{hash}` | Verify email |
| POST | `/user/profile-information` | Update profil |
| PUT | `/user/password` | Update password |

### API Endpoints
| Method | Path | Permission | Description |
|--------|------|-----------|-------------|
| POST | `/api/sanctum/token` | None | Generate bearer token |
| GET | `/api/users/auth` | sanctum | Current user + roles + permissions |
| GET | `/api/users` | view-users | List (paginated, search, filter, sort) |
| POST | `/api/users` | create-users | Create (multipart) |
| GET | `/api/users/{user}` | view-users | Single user |
| PUT | `/api/users/{user}` | update-users | Update (email NOT changeable) |
| DELETE | `/api/users/{user}` | delete-users | Delete |
| PUT | `/api/users/{user}/avatar` | edit-profile | Replace avatar |
| GET | `/api/roles/search` | sanctum | Search roles (throttle 400/min) |
| GET/POST/PUT/DELETE | `/api/roles` | sanctum | Role CRUD |
| GET | `/api/permissions` | sanctum | List permissions |

**Index query params**: `search`, `sort_by`, `sort` (asc/desc), `filters[role]`, `filters[*]`, `page`

### Status Codes
`200` OK · `401` Unauthenticated · `403` Forbidden · `404` Not found · `422` Validation · `429` Rate limited · `500` Error

### Rate Limiting
Login 5/min per email+IP · Two-factor 5/min per session · Role search 400/min

---

## 5. Authentication & Authorization

### Stack
Fortify v1 (headless auth, no views) · Sanctum v4 (session SPA + token mobile) · Spatie Permission v7 (RBAC)

### SPA Auth Flow
```
1. GET  /sanctum/csrf-cookie   → Set XSRF-TOKEN
2. POST /login                  → Auth (email/username), create session
3. GET  /api/users/auth        → Fetch user + roles + permissions
4. POST /logout                 → Destroy session
```

### Custom Authenticator (email ATAU username)
```php
Fortify::authenticateUsing(function (Request $request) {
    $login = $request->input(Fortify::username());
    $field = str_contains($login, '@') ? 'email' : 'username';
    $user = User::where($field, $login)->first();
    return ($user && Hash::check($request->password, $user->password)) ? $user : null;
});
```

### Fortify Features
Registration, Reset Password, Email Verification, Profile Update, Password Update. **2FA ready tapi commented out** (DB columns sudah ada).

### Permissions (11)
`view-users, create-users, update-users, delete-users, view-roles, create-roles, update-roles, delete-roles, assign-roles, access-admin-panel, edit-profile`

### Roles
| Role | Permissions |
|------|------------|
| superadmin | Semua 11 (explicit) |
| admin | access-admin-panel, edit-profile |
| user | edit-profile |

### Super Admin Gate
```php
Gate::before(fn($user, $ability) => $user->hasRole('superadmin') ? true : null);
```

### Frontend Route Guard
```typescript
router.beforeEach(async (to, from) => {
  const authStore = useAuthStore()
  if (to.meta.requiresAuth && !authStore.isAuthenticated)
    return { name: 'login', query: { redirect: to.fullPath } }
  if (to.meta.guest && authStore.isAuthenticated)
    return { name: 'dashboard' }
})
```

### Security
CSRF via Sanctum stateful · bcrypt hashing · email verification · session regeneration setelah login · hidden fields (password, remember_token) · CORS `supports_credentials: true` · same_site: lax

---

## 6. Backend Guidelines

### Controller (Thin)
```php
public function store(StoreUserRequest $request): JsonResponse
{
    $this->authorize('create-users');
    $record = $this->userService->create($request->validated());
    return $record ? $this->responseStoreSuccess(['record' => $record]) : $this->responseStoreFail();
}
```

### Response Helpers (base Controller)
`responseDataSuccess` (200) · `responseStoreSuccess` (200) · `responseStoreFail` (422) · `responseUpdateSuccess/Fail` · `responseDeleteSuccess/Fail`

### Service Conventions
Satu service per domain · constructor injection · explicit return types · method: `index/get/create/update/delete`

### Model Conventions
```php
protected $guarded = ['id'];          // blacklist
protected $appends = ['avatar_url'];  // accessors
```

### PHP Style
PHP 8.4 (constructor promotion, match, named args) · PSR-12 via Pint · curly braces wajib · explicit return types & type hints · PHPDoc untuk method kompleks

### Pint (WAJIB setelah edit PHP)
```bash
vendor/bin/pint --dirty --format agent   # File yang berubah
vendor/bin/pint --format agent           # Semua file
```

### Artisan Make
```bash
php artisan make:controller UserController --no-interaction
php artisan make:model Product -mfs --no-interaction
php artisan make:request StoreUserRequest --no-interaction
php artisan make:test --pest UserTest --no-interaction
```

### 10 Rules
Thin controllers · logic di service · validasi di Form Request · response via Resource · `$this->authorize()` · no raw queries · constructor DI · response helpers · `$guarded`/`$fillable` · jalankan Pint

---

## 7. Frontend Guidelines

### Notes
- `@lucide/vue` ganti `lucide-vue-next`
- `reka-ui` successor `radix-vue` (shadcn-vue base)
- TypeScript stay 5.9 (vue-tsc belum support TS 6)
- vee-validate disebut di guideline tapi **belum terinstall** per pengecekan terakhir
- Path alias `@` → `resources/app/`

### Feature Page Convention
```
views/pages/<feature>/
├── index.vue
├── components/ (columns.ts, data-table.vue, data-table-toolbar.vue, <resource>-form/create/delete.vue)
├── data/schema.ts
└── types.ts
```

### Component Pattern
`<script setup lang="ts">` + Composition API only (never Options API). Selalu `defineProps<Props>()` & `defineEmits<{}>()`.

### Form (vee-validate)
```typescript
const { handleSubmit, setErrors, isSubmitting } = useForm<UserFormValues>({ initialValues: {...} })
const onSubmit = handleSubmit(async (values) => {
  try { await api.post(..., values) }
  catch (e) { if (e.response?.status === 422) setErrors(e.response.data.errors) }
})
```
Hierarchy: `FormField > FormItem > FormLabel + FormControl + FormMessage`. Import dari `@/components/ui/form`.

### API Service
```typescript
fetch(`/api${url}`, {
  credentials: 'include',  // WAJIB untuk Sanctum cookies
  headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' }
})
```

### Toast
```typescript
import { toast } from 'vue-sonner'
toast.success('Created!') | toast.error('Failed!')
```

### Pinia Store
```typescript
export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isAuthenticated = ref(false)
  function setUser(u: User) { user.value = u; isAuthenticated.value = true }
  return { user, isAuthenticated, setUser }
})
```

### Naming
Components PascalCase · Composables `use...` · Stores `use...Store` · Pages PascalCase · Layouts `...Layout` · Types PascalCase

### Key Rules
TypeScript strict · server-side validation is king · no duplicate validation · `credentials: 'include'` selalu · no inline styles (Tailwind only) · colocate page code, shared code naik level

---

## 8. Performance

### Targets
Local GET < 100ms · Session < 150ms · Auth < 350ms (bcrypt) · Prod GET < 50ms

### #1 OPcache (paling impactful)
```ini
zend_extension=opcache
opcache.enable=1
opcache.enable_cli=0
opcache.memory_consumption=256
opcache.max_accelerated_files=20000
opcache.revalidate_freq=0     ; dev: 0, prod: 60+
```
Impact: GET ~500ms → ~50ms. Verify: `php -r "var_dump(extension_loaded('Zend OPcache'));"`

### Drivers
- **Dev** (hindari `database` dengan SQLite — file locking berat di Windows): `SESSION_DRIVER=file`, `CACHE_STORE=file`, `QUEUE_CONNECTION=sync`
- **Prod**: redis untuk semua

### Bcrypt (Expected, bukan bug)
Login ~300ms, register ~450ms karena bcrypt cost 12 (~180ms). Dev speedup: `BCRYPT_ROUNDS=10`. **Never deploy < 12.**

### Laravel Optimize
- Dev: `php artisan optimize:clear` (jangan cache config/route di dev)
- Prod: `php artisan optimize`

### Windows
Exclude dari Defender: `C:\laragon\`, project dir, PHP temp, Composer cache. Disable Xdebug (adds 200-500ms).

### SQLite (dev)
```php
'journal_mode' => 'wal', 'synchronous' => 'normal', 'busy_timeout' => 5000
```

### N+1
```php
Model::preventLazyLoading(!app()->isProduction());
```

---

## 9. Deployment

### Quick Setup
```bash
composer run setup    # Install deps, key, migrate, build
composer run dev      # Concurrent: serve + queue + vite
```

### Key Env Vars
`APP_URL` · `DB_CONNECTION` · `SANCTUM_STATEFUL_DOMAINS` · `SESSION_DOMAIN` · `SESSION_DRIVER` · `CACHE_STORE` · `QUEUE_CONNECTION` · `MAIL_MAILER` · `MEDIA_DISK` · `BCRYPT_ROUNDS`

### Production Build
```bash
composer install --optimize-autoloader --no-dev
npm ci && npm run build
php artisan config:cache && php artisan route:cache && php artisan view:cache && php artisan event:cache
php artisan migrate --force
php artisan storage:link
```

### Server
PHP 8.3+ (BCMath, Ctype, Fileinfo, JSON, Mbstring, OpenSSL, PDO, Tokenizer, XML, GD/Imagick) · Nginx/Apache · Supervisor (queue) · HTTPS (Sanctum secure cookies)

### Troubleshooting
| Problem | Solution |
|---------|----------|
| Vite manifest not found | `npm run build` / `npm run dev` |
| 419 CSRF mismatch | Check `SANCTUM_STATEFUL_DOMAINS` + `SESSION_DOMAIN` |
| 401 Unauthenticated (SPA) | Include credentials/cookies |
| Permission denied (storage) | `chmod -R 775 storage bootstrap/cache` |
| Queue not processing | `php artisan queue:listen` |

---

## 10. OpenSpec v1.3 (Spec-Driven Workflow)

### Structure
```
openspec/
├── specs/           # Source of truth (current behavior)
├── changes/<name>/  # proposal.md, specs/ (delta), design.md, tasks.md
└── config.yaml
```

### Quick Path (core)
```
/opsx:propose → /opsx:apply → /opsx:sync → /opsx:archive
```

### Commands
- **Core**: `propose` (create + all artifacts), `explore` (think first), `apply` (implement), `sync` (merge specs), `archive`
- **Expanded**: `new`, `continue`, `ff` (fast-forward), `verify` (Completeness+Correctness+Coherence), `bulk-archive`, `onboard`

### Delta Specs
```markdown
## ADDED Requirements
### Requirement: Name
GIVEN ... WHEN ... THEN ...
## MODIFIED Requirements
## REMOVED Requirements
```

### Archive: ADDED appended · MODIFIED replace · REMOVED deleted · folder → `changes/archive/YYYY-MM-DD-<name>/`

### Best Practices
Satu logical unit per change · nama jelas (`add-dark-mode`, bukan `wip`) · explore dulu jika tidak jelas · verify sebelum archive

---

## 11. Playwright v1.60.x (E2E)

### Scripts (project)
```bash
npm run test:e2e          # Tests
npm run test:e2e:ui       # UI Mode
npm run test:e2e:headed   # Headed
```

### Test Structure
```typescript
import { test, expect } from '@playwright/test'
test.describe('group', () => {
  test.beforeEach(async ({ page }) => { await page.goto('/') })
  test('name', async ({ page }) => {
    await page.getByRole('button', { name: 'Sign in' }).click()
    await expect(page.getByText('Welcome')).toBeVisible()
  })
})
```

### Locators (priority)
`getByRole()` (BEST) · `getByLabel()` · `getByPlaceholder()` · `getByText()` · `getByTestId()`. Hindari CSS/XPath/class.

### Assertions (async, pakai `await`)
`toBeVisible, toBeEnabled, toHaveText, toHaveValue, toHaveCount, toBeChecked` · page: `toHaveURL, toHaveTitle`

### Auth (storageState)
```typescript
// auth.setup.ts
setup('authenticate', async ({ page }) => {
  await page.goto('/login')
  await page.getByLabel('Email').fill('admin@example.com')
  await page.getByLabel('Password').fill('password')
  await page.getByRole('button', { name: 'Sign in' }).click()
  await page.waitForURL('/dashboard')
  await page.context().storageState({ path: 'playwright/.auth/user.json' })
})
```
Config: setup project + `dependencies: ['setup']` + `storageState`. Multiple roles → file terpisah per role. `playwright/.auth` di `.gitignore`.

### Filtering
```typescript
page.getByRole('listitem').filter({ hasText: 'Product 2' }).getByRole('button').click()
```

### Best Practices
Test user-visible behavior · test isolated · role-based locators · web-first assertions · `beforeEach` setup · auth via storageState · `trace: 'on-first-retry'` di CI · sharding untuk speed

---

## 12. Spatie Permission v7 (RBAC)

### Setup
```php
use Spatie\Permission\Traits\HasRoles;
class User extends Authenticatable { use HasRoles; }
```

### Create & Link
```php
$role = Role::create(['name' => 'writer']);
$permission = Permission::create(['name' => 'edit articles']);
$role->givePermissionTo($permission);  // atau $permission->assignRole($role)
$role->syncPermissions($permissions);
$user->assignRole('writer');
```

### Retrieve
```php
$user->getPermissionNames();      // name strings
$user->getAllPermissions();       // merged (direct + via roles)
$user->getDirectPermissions();
$user->getPermissionsViaRoles();
```

### Query Scopes
```php
User::role('writer')->get();
User::permission('edit articles')->get();
```

### Super Admin
```php
Gate::before(fn($user, $ability) => $user->hasRole('Super Admin') ? true : null);
// CRITICAL: return null (bukan false) jika bukan super admin
// hasPermissionTo/hasAnyPermission bypass Gate — selalu pakai can()/canAny()
```

### Middleware
```php
Route::group(['middleware' => ['role:manager']], ...);
Route::group(['middleware' => ['permission:publish articles']], ...);
Route::group(['middleware' => ['role:manager|writer']], ...);  // OR
```

### Roles vs Permissions (Golden Rule)
Selalu pakai `@can`/`can()` (permission-based), **bukan** `hasRole()`. Permission names static & developer-controlled; role names bisa berubah bebas. Users inherit permissions via roles (direct assignment jarang).

### Cache
Auto-refresh saat pakai `givePermissionTo/assignRole/sync*`. Manual reset:
```php
app(\Spatie\Permission\PermissionRegistrar::class)->forgetCachedPermissions();
// atau: php artisan permission:cache-reset
```
Default expiry 24h. Disable: `CACHE_DRIVER=array`.

### Seeding Flow
1. Clear cache → 2. Create permissions → 3. Flush cache → 4. Create roles + assign permissions. Setelah raw insert, **wajib** `forgetCachedPermissions()`.

### Testing
Clear cache di `setUp()`. Set cache driver `array` di `phpunit.xml` untuk hindari interference. Pakai seeders (bukan factories) untuk fixed roles/permissions.

---

## Links
- Laravel: https://laravel.com/docs · Vue: https://vuejs.org · Sanctum/Fortify: https://laravel.com/docs
- Spatie Permission: https://spatie.be/docs/laravel-permission/v7 · Media Library: https://spatie.be/docs/laravel-medialibrary
- shadcn-vue: https://www.shadcn-vue.com · Playwright: https://playwright.dev · OpenSpec: https://openspec.dev
