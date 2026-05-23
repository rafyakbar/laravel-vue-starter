## MODIFIED Requirements

### Requirement: Vue Router uses HTML5 history mode
The Vue Router SHALL use `createWebHistory()` for clean URLs without hash fragments. Routes SHALL be organized into public (guest) and protected (auth-required) groups with appropriate meta fields. The `/admin` route SHALL use nested children with a shared layout component.

#### Scenario: Navigation produces clean URLs
- **WHEN** a user navigates between routes in the SPA
- **THEN** the browser URL reflects the route path without `#` (e.g., `/admin/users` not `/#/admin/users`)

#### Scenario: Auth routes are defined with guest meta
- **WHEN** the router is initialized
- **THEN** routes `/login`, `/register`, `/forgot-password`, `/reset-password` exist with `meta: { guest: true }`

#### Scenario: Protected routes are defined with requiresAuth meta
- **WHEN** the router is initialized
- **THEN** the `/admin` parent route and all its children have `meta: { requiresAuth: true }`

#### Scenario: Admin routes use nested layout pattern
- **WHEN** the router is initialized
- **THEN** `/admin` is a parent route with `AdminLayout` as its component, and child routes render inside the layout's `<router-view>`
