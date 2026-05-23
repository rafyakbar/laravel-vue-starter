## ADDED Requirements

### Requirement: API service layer with Sanctum cookie support
The system SHALL provide a TypeScript API service at `resources/app/services/api.ts` that wraps `fetch` with `credentials: 'include'`, JSON headers, and CSRF cookie handling for all API calls.

#### Scenario: API call includes credentials
- **WHEN** any API function is called
- **THEN** the request includes `credentials: 'include'`, `Accept: application/json`, `Content-Type: application/json`, and `X-Requested-With: XMLHttpRequest` headers

#### Scenario: CSRF cookie is fetched before auth mutations
- **WHEN** `getCsrfCookie()` is called
- **THEN** a `GET /sanctum/csrf-cookie` request is made with `credentials: 'include'` and the XSRF-TOKEN cookie is set by the browser

#### Scenario: API error returns structured response
- **WHEN** the server responds with a non-2xx status (e.g., 422)
- **THEN** the error thrown includes the response body (parsed JSON) and the HTTP status code

### Requirement: Auth store manages authentication state
The system SHALL provide a Pinia store `useAuthStore` at `resources/app/stores/auth.ts` that manages the current user state, authentication status, and auth lifecycle actions.

#### Scenario: Store exposes user and isAuthenticated
- **WHEN** a component accesses `useAuthStore()`
- **THEN** `user` (ref, nullable) and `isAuthenticated` (computed boolean) are available

#### Scenario: Login action authenticates user
- **WHEN** `authStore.login({ email, password })` is called with valid credentials
- **THEN** the store fetches the CSRF cookie, posts to `/login`, fetches user data from `/api/users/auth`, and sets `user` state

#### Scenario: Login action surfaces server errors
- **WHEN** `authStore.login()` is called with invalid credentials
- **THEN** the action throws an error containing the 422 response body so the form can call `setErrors()`

#### Scenario: Register action creates account and authenticates
- **WHEN** `authStore.register(data)` is called with valid data
- **THEN** the store fetches the CSRF cookie, posts to `/register`, fetches user data, and sets `user` state

#### Scenario: Logout action clears state and redirects
- **WHEN** `authStore.logout()` is called
- **THEN** a POST to `/logout` is made, `user` is set to `null`, and the router navigates to `/login`

#### Scenario: fetchUser restores session on page refresh
- **WHEN** `authStore.fetchUser()` is called on app initialization
- **THEN** if the session cookie is valid, user data is fetched from `/api/users/auth` and stored; if 401, user remains null

### Requirement: Router guards protect routes based on auth state
The system SHALL implement Vue Router navigation guards that enforce authentication requirements declared via route meta fields.

#### Scenario: Unauthenticated user is redirected to login
- **WHEN** an unauthenticated user navigates to a route with `meta: { requiresAuth: true }`
- **THEN** the router redirects to `/login`

#### Scenario: Authenticated user is redirected from guest pages
- **WHEN** an authenticated user navigates to a route with `meta: { guest: true }`
- **THEN** the router redirects to `/` (home)

#### Scenario: Unauthenticated user can access guest pages
- **WHEN** an unauthenticated user navigates to a route with `meta: { guest: true }`
- **THEN** navigation proceeds normally

#### Scenario: Authenticated user can access protected pages
- **WHEN** an authenticated user navigates to a route with `meta: { requiresAuth: true }`
- **THEN** navigation proceeds normally

### Requirement: Login page with email/password form
The system SHALL provide a login page at `/login` with an email and password form that submits to the auth store and displays server validation errors.

#### Scenario: Successful login navigates to home
- **WHEN** the user submits valid credentials on the login page
- **THEN** the auth store login action succeeds and the router navigates to `/`

#### Scenario: Invalid credentials show error messages
- **WHEN** the user submits invalid credentials on the login page
- **THEN** the server 422 response errors are displayed under the relevant form fields via vee-validate `setErrors()`

#### Scenario: Login page has link to register and forgot password
- **WHEN** the login page is rendered
- **THEN** links to `/register` and `/forgot-password` are visible

### Requirement: Registration page with name, username, email, and password
The system SHALL provide a registration page at `/register` with all required fields that submits to the auth store and displays server validation errors.

#### Scenario: Successful registration navigates to home
- **WHEN** the user submits valid registration data
- **THEN** the auth store register action succeeds and the router navigates to `/`

#### Scenario: Validation errors display per field
- **WHEN** the server responds with 422 (e.g., duplicate email)
- **THEN** field-level error messages are displayed under the relevant inputs

#### Scenario: Registration page has link to login
- **WHEN** the registration page is rendered
- **THEN** a link to `/login` is visible

### Requirement: Forgot password page requests reset link
The system SHALL provide a forgot password page at `/forgot-password` that submits the user's email to `POST /forgot-password` and displays a success message or validation errors.

#### Scenario: Successful reset request shows confirmation
- **WHEN** the user submits a valid registered email
- **THEN** a success message is displayed indicating the reset link was sent

#### Scenario: Invalid email shows error
- **WHEN** the user submits an unregistered email
- **THEN** the server 422 error is displayed

### Requirement: Reset password page with token from URL
The system SHALL provide a reset password page at `/reset-password` that reads the token from the URL query parameter and submits the new password to `POST /reset-password`.

#### Scenario: Successful password reset navigates to login
- **WHEN** the user submits a valid new password with the correct token
- **THEN** the password is reset and the user is redirected to `/login` with a success indicator

#### Scenario: Invalid or expired token shows error
- **WHEN** the token is invalid or expired
- **THEN** the server error is displayed to the user

#### Scenario: Token is read from URL query parameter
- **WHEN** the reset password page loads with URL `/reset-password?token=abc123`
- **THEN** the token value `abc123` is automatically included in the form submission

### Requirement: App initialization checks auth state before rendering
The system SHALL check authentication state (via `fetchUser()`) before the Vue app finishes mounting, preventing flash of wrong content.

#### Scenario: Authenticated user sees protected content immediately
- **WHEN** a user with a valid session cookie loads the SPA
- **THEN** the app calls `fetchUser()` before router navigation resolves, and the user sees their intended page without a redirect flash

#### Scenario: Unauthenticated user is redirected without delay
- **WHEN** a user without a session loads a protected URL
- **THEN** `fetchUser()` returns 401, and the router guard redirects to `/login` before any protected content renders
