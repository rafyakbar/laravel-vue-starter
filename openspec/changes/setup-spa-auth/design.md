## Context

The backend auth system is complete: Fortify handles login/register/password-reset/email-verification, Sanctum provides cookie-based stateful auth for SPAs, and Spatie Permission manages RBAC. All endpoints are tested via Pest 4.

The frontend currently has a minimal SPA shell (App.vue → router-view → HomePage). No auth store, no API service layer, no auth pages, no route guards exist. The frontend needs to implement the full auth lifecycle to become usable.

Key backend endpoints the frontend will consume:
- `GET /sanctum/csrf-cookie` — CSRF token initialization
- `POST /login` — Login (email or username + password)
- `POST /register` — Registration (name, username, email, password, password_confirmation)
- `POST /forgot-password` — Request reset link
- `POST /reset-password` — Reset with token
- `POST /logout` — Logout
- `GET /api/users/auth` — Get authenticated user with roles/permissions

## Goals / Non-Goals

**Goals:**
- Implement a reusable API service layer for all future API calls
- Create auth store (Pinia) managing user state and auth lifecycle
- Build auth pages with proper form validation and server error display
- Add router guards for route protection
- Session restoration on page refresh (check if user is already logged in)
- Clean, extensible structure that future features (dashboard, user management) can build upon

**Non-Goals:**
- Admin layout / sidebar (separate change: `setup-admin-layout`)
- Dashboard page content
- User management UI
- Two-factor authentication UI (2FA disabled in backend config)
- Email verification page (user receives email link, clicks it — no SPA page needed)
- "Remember me" toggle (session persistence is handled by Sanctum session lifetime)
- Social login / OAuth

## Decisions

### 1. API service layer using native `fetch` wrapper

**Choice:** Custom `fetch` wrapper at `resources/app/services/api.ts` instead of axios or ofetch.

**Rationale:** Zero additional dependencies. Native `fetch` with `credentials: 'include'` works perfectly for Sanctum cookie-based auth. The wrapper provides typed responses, consistent error handling, and CSRF cookie logic.

**Alternative considered:** `ofetch` (used in shadcn-vue-admin) — adds a dependency for marginal benefit in this context. `axios` — heavier, unnecessary given fetch's built-in cookie handling.

**File:** `resources/app/services/api.ts`

```typescript
// Core API wrapper
export async function api<T>(url: string, options?: RequestInit): Promise<T>
export async function getCsrfCookie(): Promise<void>
```

### 2. Auth store with Pinia setup syntax

**Choice:** Single `useAuthStore` using Pinia's setup store pattern (`defineStore('auth', () => {...})`).

**Rationale:** Consistent with project conventions. Setup stores have better TypeScript inference and composability. Store handles: user state, isAuthenticated computed, login/logout/register/fetchUser actions.

**File:** `resources/app/stores/auth.ts`

```typescript
export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isAuthenticated = computed(() => !!user.value)
  
  async function login(credentials: LoginPayload): Promise<void>
  async function register(data: RegisterPayload): Promise<void>
  async function logout(): Promise<void>
  async function fetchUser(): Promise<void>
  
  return { user, isAuthenticated, login, register, logout, fetchUser }
})
```

### 3. Router guards via `beforeEach` hook

**Choice:** Global `router.beforeEach` guard that checks `authStore.isAuthenticated` and route meta.

**Rationale:** Centralized, easy to reason about. Routes declare `meta: { requiresAuth: true }` or `meta: { guest: true }`. Guard redirects unauthenticated users to `/login` and authenticated users away from guest-only pages.

**Session restoration:** On app init, call `fetchUser()` BEFORE installing the router (`app.use(router)`). This ensures the initial navigation guard already has the correct auth state. If it returns 401, user is not authenticated — proceed to login. If it returns user data, populate store. The router is only installed after the auth state is resolved, preventing race conditions where guards run before `isAuthenticated` is populated.

**File:** `resources/app/router/index.ts` (updated), `resources/app/router/guards.ts` (new), `resources/app/main.ts` (router installed after fetchUser)

### 4. Route structure with lazy-loaded auth pages

**Choice:** Auth pages grouped under `/login`, `/register`, `/forgot-password`, `/reset-password`. Protected area under `/` uses a different layout.

```typescript
// Public auth routes (guest-only)
{ path: '/login', component: () => import('@/views/pages/auth/LoginPage.vue'), meta: { guest: true } }
{ path: '/register', component: () => import('@/views/pages/auth/RegisterPage.vue'), meta: { guest: true } }
{ path: '/forgot-password', component: () => import('@/views/pages/auth/ForgotPasswordPage.vue'), meta: { guest: true } }
{ path: '/reset-password', component: () => import('@/views/pages/auth/ResetPasswordPage.vue'), meta: { guest: true } }

// Public route (no auth requirement)
{ path: '/', component: HomePage }  // Shows login/signup for guests, admin link for authenticated

// Protected routes (requiresAuth)
{ path: '/admin', component: () => import('@/views/pages/admin/AdminPage.vue'), meta: { requiresAuth: true } }
```

### 5. Form handling with vee-validate (no Zod)

**Choice:** Use `vee-validate` `useForm()` + `handleSubmit()` + `setErrors()` for auth forms. No schema library (Zod/Yup). TypeScript interfaces define form shapes.

**Rationale:** As decided in frontend guidelines — Laravel Form Requests are the source of truth for validation. Client-side validation is limited to required-field UX hints. Server 422 errors are mapped to fields via `setErrors()`.

**File pattern:** Each auth page contains its own form logic inline (forms are simple, no need for separate validator files).

### 6. Auth page UI with shadcn-vue Card layout

**Choice:** Auth pages use a centered card layout (similar to shadcn-vue-admin's `sign-in.vue`): full-screen centered container with a Card component holding the form.

**File structure:**
```
resources/app/views/pages/auth/
├── LoginPage.vue
├── RegisterPage.vue
├── ForgotPasswordPage.vue
└── ResetPasswordPage.vue
```

### 7. TypeScript types in a shared location

**Choice:** Auth-related types in `resources/app/types/auth.ts`.

**File:** `resources/app/types/auth.ts`

```typescript
export interface User {
  id: number
  name: string
  username: string
  email: string
  email_verified_at: string | null
  avatar_url: string | null
  avatar_thumb_url: string | null
  is_admin: boolean
  is_owner: boolean
  roles: string[]
  permissions: string[]
  created_at: string | null
  updated_at: string | null
}

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  name: string
  username: string
  email: string
  password: string
  password_confirmation: string
}
```

## New File Map

```
resources/app/
├── services/
│   └── api.ts                         # Fetch wrapper with Sanctum support + X-XSRF-TOKEN header
├── stores/
│   ├── index.ts                       # (existing, re-export createPinia)
│   └── auth.ts                        # Auth store (uses direct router import, not useRouter)
├── types/
│   └── auth.ts                        # Auth-related TypeScript interfaces
├── router/
│   ├── index.ts                       # (modified — add routes + guard setup)
│   └── guards.ts                      # Navigation guard logic
├── views/pages/
│   ├── HomePage.vue                   # Public landing — login/signup or admin link
│   ├── admin/
│   │   └── AdminPage.vue              # Protected — welcome + sign out + home link
│   └── auth/
│       ├── LoginPage.vue              # Login form
│       ├── RegisterPage.vue           # Registration form
│       ├── ForgotPasswordPage.vue     # Request reset link form
│       └── ResetPasswordPage.vue      # Reset password form (with token from URL)
└── components/ui/                     # shadcn-vue components (generated via CLI)
    ├── button/
    ├── card/
    ├── form/
    ├── input/
    └── label/
```

## Risks / Trade-offs

- **[Risk] CSRF cookie timing** — If the CSRF cookie expires or is missing, API calls fail silently. → Mitigation: `getCsrfCookie()` is called before login/register. The `api()` wrapper reads the `XSRF-TOKEN` cookie and sends it as the `X-XSRF-TOKEN` header on every request.
- **[Risk] Race condition on page refresh** — If the router guard fires before `fetchUser()` completes, user gets redirected to login even though they're authenticated. → Mitigation: Install the router (`app.use(router)`) AFTER `fetchUser()` resolves in `main.ts`. This guarantees the first navigation guard execution has the correct `isAuthenticated` state.
- **[Risk] shadcn-vue CLI may not generate components cleanly with reka-ui** — Mitigation: Verify CLI output after generation. If issues arise, manually adjust imports.
- **[Trade-off] No "loading skeleton" for auth check** — User sees a blank screen briefly on page refresh while `fetchUser()` runs. Acceptable for starter kit; can add loading indicator later.
- **[Trade-off] No persistent "remember me"** — Sanctum session lifetime (120 min default) controls this. No UI toggle needed for MVP.
