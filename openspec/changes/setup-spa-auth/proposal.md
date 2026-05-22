## Why

The backend auth system (Fortify + Sanctum + Spatie Permission) is fully implemented and tested, but the Vue SPA has no authentication UI or flow. Users cannot log in, register, or access protected areas. Without a working frontend auth layer, the entire SPA is non-functional beyond the public homepage.

## What Changes

- Add an API service layer (`resources/app/services/`) with a base HTTP client configured for Sanctum cookie-based auth (credentials included, CSRF cookie handling, JSON headers)
- Add `useAuthStore` Pinia store managing user state, login, logout, register, and session restoration
- Add Vue Router navigation guards that redirect unauthenticated users to `/login` and authenticated users away from auth pages
- Add auth pages: Login, Register, Forgot Password, Reset Password
- Add route definitions for auth (public) and protected (private) areas
- Install `vee-validate` for form state management on auth forms
- Add shadcn-vue form components (`FormField`, `FormItem`, `FormLabel`, `FormControl`, `FormMessage`, `Input`, `Button`, `Card`)

## Capabilities

### New Capabilities

- `spa-auth-flow`: The complete frontend authentication lifecycle — CSRF cookie acquisition, login/register/password-reset forms, Pinia auth store, router guards, session restoration on page refresh, and server error display via vee-validate `setErrors()`

### Modified Capabilities

- `vue-spa-shell`: Adding route definitions for auth and protected areas, updating router with navigation guards, and wrapping protected routes in an authenticated layout

## Impact

- **New dependencies (npm)**: `vee-validate ^4.15`
- **New files**: ~15 files (services, store, pages, router updates, shadcn-vue components)
- **Modified files**: `resources/app/router/index.ts` (add routes + guards), `resources/app/main.ts` (install router after fetchUser), `resources/app/views/pages/HomePage.vue` (conditional auth navigation)
- **Backend changes**: None — all Fortify/Sanctum endpoints already exist and are tested
- **shadcn-vue components needed**: Button, Input, Card, Form (FormField, FormItem, FormLabel, FormControl, FormMessage), Label
