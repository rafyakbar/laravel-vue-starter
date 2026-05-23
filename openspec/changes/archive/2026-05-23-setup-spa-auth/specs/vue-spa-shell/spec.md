## MODIFIED Requirements

### Requirement: Vue Router uses HTML5 history mode
The Vue Router SHALL use `createWebHistory()` for clean URLs without hash fragments. Routes SHALL be organized into public (guest) and protected (auth-required) groups with appropriate meta fields.

#### Scenario: Navigation produces clean URLs
- **WHEN** a user navigates between routes in the SPA
- **THEN** the browser URL reflects the route path without `#` (e.g., `/dashboard` not `/#/dashboard`)

#### Scenario: Auth routes are defined with guest meta
- **WHEN** the router is initialized
- **THEN** routes `/login`, `/register`, `/forgot-password`, `/reset-password` exist with `meta: { guest: true }`

#### Scenario: Protected routes are defined with requiresAuth meta
- **WHEN** the router is initialized
- **THEN** the home route `/` and future protected routes have `meta: { requiresAuth: true }`

## ADDED Requirements

### Requirement: Router initializes with auth state check
The system SHALL ensure the auth store's `fetchUser()` is called before the router resolves its first navigation, so guards have access to current auth state.

#### Scenario: Auth state is available before first route resolves
- **WHEN** the SPA loads for the first time
- **THEN** `fetchUser()` completes before `router.isReady()` resolves, ensuring guards have accurate auth state
