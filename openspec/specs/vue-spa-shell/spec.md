## ADDED Requirements

### Requirement: SPA entry point serves Vue application
The system SHALL serve a single Blade view (`spa.blade.php`) that bootstraps the Vue 3 application for all non-API web routes.

#### Scenario: Browser navigates to root URL
- **WHEN** a user navigates to `/`
- **THEN** the server responds with the `spa.blade.php` view containing the Vite-compiled assets and a `<div id="app">` mount point

#### Scenario: Browser navigates to any non-API path
- **WHEN** a user navigates to any path that does not start with `/api`
- **THEN** the server responds with the same `spa.blade.php` view (catch-all route)

#### Scenario: API routes are not intercepted by catch-all
- **WHEN** a request is made to a path starting with `/api`
- **THEN** the catch-all route SHALL NOT handle the request; Laravel's API routing takes precedence

### Requirement: Vue app mounts and renders router view
The Vue application SHALL mount on `#app` and render a `<router-view>` inside the root `App.vue` component.

#### Scenario: App initialization
- **WHEN** the SPA JavaScript loads in the browser
- **THEN** Vue 3 creates the app instance with Pinia and Vue Router installed, and mounts to `#app`

#### Scenario: Router view renders current route
- **WHEN** the app is mounted and the URL is `/`
- **THEN** the `<router-view>` renders the `HomePage` component inside `DefaultLayout`

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

### Requirement: Pinia store is initialized
The application SHALL initialize Pinia as the state management layer, available to all components.

#### Scenario: Pinia is available in components
- **WHEN** any Vue component uses `useStore()` from a Pinia store module
- **THEN** the store instance is returned without errors

### Requirement: Default layout wraps page content
The system SHALL provide a `DefaultLayout.vue` component that wraps page content rendered by the router.

#### Scenario: Page renders inside layout
- **WHEN** the `HomePage` route is active
- **THEN** the page content is rendered inside the `DefaultLayout` component's slot

### Requirement: Placeholder home page exists
The system SHALL include a `HomePage.vue` as the default route (`/`) to verify the SPA shell works.

#### Scenario: Home page displays confirmation text
- **WHEN** a user visits `/`
- **THEN** the page displays text confirming the Vue SPA is running (e.g., heading with app name)

### Requirement: Router initializes with auth state check
The system SHALL ensure the auth store's `fetchUser()` is called before the router resolves its first navigation, so guards have access to current auth state.

#### Scenario: Auth state is available before first route resolves
- **WHEN** the SPA loads for the first time
- **THEN** `fetchUser()` completes before `router.isReady()` resolves, ensuring guards have accurate auth state
