## Requirements

### Requirement: SPA cookie-based authentication via Sanctum
The system SHALL authenticate SPA requests using Sanctum's stateful cookie-based mechanism (CSRF token + session cookie).

#### Scenario: SPA obtains CSRF cookie
- **WHEN** the frontend sends `GET /sanctum/csrf-cookie`
- **THEN** the server responds with a `XSRF-TOKEN` cookie and a `204 No Content` status

#### Scenario: Login with valid email
- **WHEN** a user sends `POST /login` with a valid email and password (after obtaining CSRF cookie)
- **THEN** the server responds with `200 OK`, sets a session cookie, and returns the authenticated user data as JSON

#### Scenario: Login with valid username
- **WHEN** a user sends `POST /login` with a valid username and password (after obtaining CSRF cookie)
- **THEN** the server responds with `200 OK`, sets a session cookie, and returns the authenticated user data as JSON

#### Scenario: Login with invalid credentials
- **WHEN** a user sends `POST /login` with invalid credentials
- **THEN** the server responds with `422 Unprocessable Entity` and a validation error message

#### Scenario: Login rate limiting
- **WHEN** more than 5 failed login attempts are made within 1 minute for the same identifier+IP
- **THEN** the server responds with `429 Too Many Requests`

### Requirement: User registration
The system SHALL allow new users to register via `POST /register` with name, username, email, and password fields.

#### Scenario: Successful registration
- **WHEN** a user sends `POST /register` with valid data (name, username, email, password, password_confirmation)
- **THEN** the server creates the user, assigns the "regular" role, and responds with `201 Created`

#### Scenario: Registration with duplicate email
- **WHEN** a user sends `POST /register` with an email that already exists
- **THEN** the server responds with `422 Unprocessable Entity` and an email validation error

#### Scenario: Registration with duplicate username
- **WHEN** a user sends `POST /register` with a username that already exists
- **THEN** the server responds with `422 Unprocessable Entity` and a username validation error

### Requirement: Password reset via email
The system SHALL allow users to request a password reset link and reset their password via token.

#### Scenario: Request password reset link
- **WHEN** a user sends `POST /forgot-password` with a valid registered email
- **THEN** the server sends a reset link email and responds with a success status

#### Scenario: Reset password with valid token
- **WHEN** a user sends `POST /reset-password` with a valid token, email, and new password
- **THEN** the server updates the password and responds with a success status

### Requirement: Email verification
The system SHALL support email verification for registered users.

#### Scenario: Send verification notification
- **WHEN** an authenticated unverified user sends `POST /email/verification-notification`
- **THEN** the server sends a verification email

### Requirement: Profile information update
The system SHALL allow authenticated users to update their profile information (name, email).

#### Scenario: Update profile information
- **WHEN** an authenticated user sends `PUT /user/profile-information` with updated fields
- **THEN** the server updates the user record and responds with success

### Requirement: Password update
The system SHALL allow authenticated users to change their password.

#### Scenario: Update password with correct current password
- **WHEN** an authenticated user sends `PUT /user/password` with valid current_password and new password
- **THEN** the server updates the password and responds with success

#### Scenario: Update password with incorrect current password
- **WHEN** an authenticated user sends `PUT /user/password` with incorrect current_password
- **THEN** the server responds with `422 Unprocessable Entity`

### Requirement: Logout
The system SHALL allow authenticated users to log out and invalidate their session.

#### Scenario: Successful logout
- **WHEN** an authenticated user sends `POST /logout`
- **THEN** the server invalidates the session and responds with `200 OK`

### Requirement: Get current authenticated user
The system SHALL provide an API endpoint to retrieve the currently authenticated user's data including roles and abilities.

#### Scenario: Authenticated user requests their data
- **WHEN** an authenticated user sends `GET /api/users/auth`
- **THEN** the server responds with the user's data including name, email, avatar URLs, and abilities

#### Scenario: Unauthenticated request
- **WHEN** an unauthenticated request is sent to `GET /api/users/auth`
- **THEN** the server responds with `401 Unauthorized`

### Requirement: CORS supports auth endpoints
The system SHALL configure CORS to allow credentials and expose auth-related paths for the SPA.

#### Scenario: CORS headers on login endpoint
- **WHEN** the SPA makes a cross-origin `POST /login` request with credentials
- **THEN** the server includes appropriate `Access-Control-Allow-Credentials: true` and origin headers

### Requirement: Login supports email or username
The system SHALL accept either email or username in the login field, automatically detecting which one was provided.

#### Scenario: User enters email to login
- **WHEN** the login field value contains `@`
- **THEN** the system authenticates using the `email` column

#### Scenario: User enters username to login
- **WHEN** the login field value does not contain `@`
- **THEN** the system authenticates using the `username` column

### Requirement: Fortify operates in headless mode
The system SHALL configure Fortify with `views: false` so all auth endpoints return JSON responses instead of redirecting to Blade views.

#### Scenario: Login returns JSON not redirect
- **WHEN** a successful login occurs via XHR
- **THEN** the response is JSON `{"user": {...}}` not a redirect to a Blade view
