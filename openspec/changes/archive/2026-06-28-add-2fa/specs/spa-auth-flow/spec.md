## MODIFIED Requirements

### Requirement: Auth store manages authentication state
The system SHALL provide a Pinia store `useAuthStore` at `resources/app/stores/auth.ts` that manages the current user state, authentication status, 2FA pending state, and auth lifecycle actions.

#### Scenario: Store exposes user and isAuthenticated
- **WHEN** a component accesses `useAuthStore()`
- **THEN** `user` (ref, nullable) and `isAuthenticated` (computed boolean) are available

#### Scenario: Store exposes requiresTwoFactor flag
- **WHEN** a component accesses `useAuthStore()`
- **THEN** `requiresTwoFactor` (ref, boolean, default false) is available

#### Scenario: Login action authenticates user without 2FA
- **WHEN** `authStore.login({ email, password })` is called and `/login` responds without `{ two_factor: true }`
- **THEN** the store fetches user data from `/api/users/auth`, sets `user` state, and `requiresTwoFactor` remains `false`

#### Scenario: Login action sets requiresTwoFactor when 2FA is pending
- **WHEN** `authStore.login({ email, password })` is called and `/login` responds with `{ two_factor: true }`
- **THEN** `requiresTwoFactor` is set to `true` and `fetchUser()` is NOT called

#### Scenario: Login action surfaces server errors
- **WHEN** `authStore.login()` is called with invalid credentials
- **THEN** the action throws an error containing the 422 response body so the form can call `setErrors()`

#### Scenario: Register action creates account and authenticates
- **WHEN** `authStore.register(data)` is called with valid data
- **THEN** the store fetches the CSRF cookie, posts to `/register`, fetches user data, and sets `user` state

#### Scenario: Logout action clears state and redirects
- **WHEN** `authStore.logout()` is called
- **THEN** a POST to `/logout` is made, `user` is set to `null`, `requiresTwoFactor` is set to `false`, and the router navigates to `/login`

### Requirement: Router guards protect routes based on auth state
The system SHALL implement Vue Router navigation guards that enforce authentication requirements, 2FA-pending state, and guest-only access declared via route meta fields.

#### Scenario: Unauthenticated user without 2FA pending is redirected to login
- **WHEN** an unauthenticated user (with `requiresTwoFactor = false`) navigates to a route with `meta: { requiresAuth: true }`
- **THEN** the router redirects to `/login`

#### Scenario: User with 2FA pending is redirected to challenge page
- **WHEN** a user with `requiresTwoFactor = true` navigates to a route with `meta: { requiresAuth: true }`
- **THEN** the router redirects to `/two-factor-challenge`

#### Scenario: Authenticated user is redirected from guest pages
- **WHEN** an authenticated user navigates to a route with `meta: { guest: true }`
- **THEN** the router redirects to the appropriate home based on permissions

#### Scenario: User with 2FA pending is redirected from guest pages to challenge
- **WHEN** a user with `requiresTwoFactor = true` navigates to a route with `meta: { guest: true }`
- **THEN** the router redirects to `/two-factor-challenge`

#### Scenario: Direct navigation to twoFactorOnly route without challenge state redirects to login
- **WHEN** a user navigates to a route with `meta: { twoFactorOnly: true }` and `requiresTwoFactor = false`
- **THEN** the router redirects to `/login`

#### Scenario: Unauthenticated user can access guest pages
- **WHEN** an unauthenticated user (without 2FA pending) navigates to a route with `meta: { guest: true }`
- **THEN** navigation proceeds normally

#### Scenario: Authenticated user can access protected pages
- **WHEN** an authenticated user navigates to a route with `meta: { requiresAuth: true }`
- **THEN** navigation proceeds normally
