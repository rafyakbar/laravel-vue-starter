## 1. Dependencies & shadcn-vue Components

- [x] 1.1 Install `vee-validate` — `npm install vee-validate@^4.15`
- [x] 1.2 Add shadcn-vue components via CLI — `npx shadcn-vue@latest add button input label card form`
- [x] 1.3 Verify components generated at `resources/app/components/ui/` and imports work
- [x] 1.4 Run `npm run build` — confirm zero type errors after component generation

## 2. TypeScript Types

- [x] 2.1 Create `resources/app/types/auth.ts` — define `User`, `LoginPayload`, `RegisterPayload`, `ForgotPasswordPayload`, `ResetPasswordPayload` interfaces

## 3. API Service Layer

- [x] 3.1 Create `resources/app/services/api.ts` — implement `api()` fetch wrapper with `credentials: 'include'`, JSON headers, and error handling
- [x] 3.2 Implement `getCsrfCookie()` function that fetches `/sanctum/csrf-cookie`
- [x] 3.3 Run `npm run build` — confirm no type errors

## 4. Auth Store

- [x] 4.1 Create `resources/app/stores/auth.ts` — implement `useAuthStore` with `user`, `isAuthenticated`, `loading` state
- [x] 4.2 Implement `login()` action — getCsrfCookie → POST /login → fetchUser
- [x] 4.3 Implement `register()` action — getCsrfCookie → POST /register → fetchUser
- [x] 4.4 Implement `logout()` action — POST /logout → clear user → redirect to /login
- [x] 4.5 Implement `fetchUser()` action — GET /api/users/auth → set user or set null on 401
- [x] 4.6 Run `npm run build` — confirm no type errors

## 5. Router & Guards

- [x] 5.1 Create `resources/app/router/guards.ts` — implement `beforeEach` guard that checks `meta.requiresAuth` and `meta.guest` against auth store
- [x] 5.2 Update `resources/app/router/index.ts` — add auth routes (login, register, forgot-password, reset-password) with `meta: { guest: true }`
- [x] 5.3 Update `resources/app/router/index.ts` — mark home route with `meta: { requiresAuth: true }`
- [x] 5.4 Register guard in router setup
- [x] 5.5 Run `npm run build` — confirm no type errors

## 6. App Initialization

- [x] 6.1 Update `resources/app/main.ts` — call `authStore.fetchUser()` before `app.mount('#app')` to restore session on page refresh
- [x] 6.2 Run `npm run build` — confirm no type errors

## 7. Auth Pages

- [x] 7.1 Create `resources/app/views/pages/auth/LoginPage.vue` — email + password form with vee-validate, server error display, links to register and forgot-password
- [x] 7.2 Create `resources/app/views/pages/auth/RegisterPage.vue` — name, username, email, password, password_confirmation form with vee-validate, link to login
- [x] 7.3 Create `resources/app/views/pages/auth/ForgotPasswordPage.vue` — email form, success message display, link to login
- [x] 7.4 Create `resources/app/views/pages/auth/ResetPasswordPage.vue` — read token from URL query, new password + confirmation form, redirect to login on success
- [x] 7.5 Run `npm run build` — confirm no type errors

## 8. Verification

- [x] 8.1 Run `npm run build` — full build passes with zero errors
- [x] 8.2 Run `php artisan test --compact` — existing backend tests still pass (no regressions)
- [ ] 8.3 Manual verification — navigate to `/login`, confirm page renders, submit with invalid credentials, confirm 422 errors display
- [ ] 8.4 Manual verification — login with valid credentials, confirm redirect to `/`, confirm `fetchUser()` populates store
- [ ] 8.5 Manual verification — refresh page while authenticated, confirm session is restored without redirect flash
