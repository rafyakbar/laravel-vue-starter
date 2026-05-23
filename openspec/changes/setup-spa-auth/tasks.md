## 1. Dependencies & shadcn-vue Components

- [x] 1.1 Install `vee-validate` — `npm install vee-validate@^4.15`
- [x] 1.2 Add shadcn-vue components via CLI — `npx shadcn-vue@latest add button input label card form`
- [x] 1.3 Verify components generated at `resources/app/components/ui/` and imports work
- [x] 1.4 Run `npm run build` — confirm zero type errors after component generation

## 2. TypeScript Types

- [x] 2.1 Create `resources/app/types/auth.ts` — define `User`, `LoginPayload`, `RegisterPayload`, `ForgotPasswordPayload`, `ResetPasswordPayload`, `ApiValidationError` interfaces
- [x] 2.2 Ensure `User` interface matches database schema and `UserResource` output (name, username, email, email_verified_at, avatar_url, avatar_thumb_url, is_admin, is_owner, roles, permissions, timestamps)

## 3. API Service Layer

- [x] 3.1 Create `resources/app/services/api.ts` — implement `api()` fetch wrapper with `credentials: 'include'`, JSON headers, and error handling
- [x] 3.2 Implement `getCsrfCookie()` function that fetches `/sanctum/csrf-cookie`
- [x] 3.3 Implement `getXsrfToken()` helper that reads `XSRF-TOKEN` cookie and sends it as `X-XSRF-TOKEN` header on every request (required by Laravel CSRF verification)
- [x] 3.4 Run `npm run build` — confirm no type errors

## 4. Auth Store

- [x] 4.1 Create `resources/app/stores/auth.ts` — implement `useAuthStore` with `user`, `isAuthenticated`, `loading` state
- [x] 4.2 Implement `login()` action — getCsrfCookie → POST /login → fetchUser
- [x] 4.3 Implement `register()` action — getCsrfCookie → POST /register → fetchUser
- [x] 4.4 Implement `logout()` action — POST /logout → clear user → redirect to home
- [x] 4.5 Implement `fetchUser()` action — GET /api/users/auth → set user.data or set null on 401
- [x] 4.6 Use direct `import router from '@/router'` instead of `useRouter()` (store instantiated outside component context in main.ts)
- [x] 4.7 Run `npm run build` — confirm no type errors

## 5. Router & Guards

- [x] 5.1 Create `resources/app/router/guards.ts` — implement `beforeEach` guard that checks `meta.requiresAuth` and `meta.guest` against auth store
- [x] 5.2 Guard redirects: unauthenticated → `/login` (with `redirect` query), authenticated on guest pages → `/admin`
- [x] 5.3 Update `resources/app/router/index.ts` — add routes:
  - `/` (home) — public, no meta
  - `/admin` — `meta: { requiresAuth: true }`
  - `/login`, `/register`, `/forgot-password`, `/reset-password` — `meta: { guest: true }`
- [x] 5.4 Register guard in router setup
- [x] 5.5 Run `npm run build` — confirm no type errors

## 6. App Initialization

- [x] 6.1 Update `resources/app/main.ts` — install Pinia first, then call `authStore.fetchUser()`, then install router (`app.use(router)`) and mount AFTER fetchUser resolves (prevents guard race condition)
- [x] 6.2 Run `npm run build` — confirm no type errors

## 7. Pages

- [x] 7.1 Create `resources/app/views/pages/auth/LoginPage.vue` — email + password form with vee-validate, server error display, links to register, forgot-password, and home
- [x] 7.2 Create `resources/app/views/pages/auth/RegisterPage.vue` — name, username, email, password, password_confirmation form with vee-validate, links to login and home
- [x] 7.3 Create `resources/app/views/pages/auth/ForgotPasswordPage.vue` — email form, success message display, link to login
- [x] 7.4 Create `resources/app/views/pages/auth/ResetPasswordPage.vue` — read token from URL query, new password + confirmation form, redirect to login on success
- [x] 7.5 Update `resources/app/views/pages/HomePage.vue` — show Sign In / Sign Up buttons for guests, "Go to Admin" button for authenticated users
- [x] 7.6 Create `resources/app/views/pages/admin/AdminPage.vue` — welcome message with user name, Home button, Sign Out button
- [x] 7.7 Login redirects to `/admin` after success (or `redirect` query param)
- [x] 7.8 Register redirects to `/admin` after success
- [x] 7.9 Add client-side validation rules (vee-validate inline function validators) as UX hints:
  - LoginPage: required email/username, required password
  - RegisterPage: required name/username, email format, password min 8 chars, required confirmation
  - ForgotPasswordPage: required email with format check
  - ResetPasswordPage: required email with format, password min 8, required confirmation
- [x] 7.10 Run `npm run build` — confirm no type errors

## 8. Verification

- [x] 8.1 Run `npm run build` — full build passes with zero errors
- [x] 8.2 Run `php artisan test --compact` — existing backend tests still pass (no regressions)
- [x] 8.3 Manual verification — navigate to `/login`, confirm page renders, submit with invalid credentials, confirm 422 errors display
- [x] 8.4 Manual verification — login with valid credentials, confirm redirect to `/admin`, confirm `fetchUser()` populates store
- [x] 8.5 Manual verification — refresh page while authenticated, confirm session is restored without redirect flash
- [x] 8.6 Manual verification — authenticated user cannot access `/login` (redirects to `/admin`)
- [x] 8.7 Manual verification — sign out from `/admin`, confirm redirect to `/` (home)
- [x] 8.8 Manual verification — home page shows correct buttons based on auth state
