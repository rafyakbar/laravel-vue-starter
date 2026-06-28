## ADDED Requirements

### Requirement: Fortify 2FA feature enabled in headless mode
The system SHALL enable `Features::twoFactorAuthentication` with `confirm: true` and `confirmPassword: true` in `config/fortify.php`. With `views: false` already set, all 2FA endpoints return JSON responses.

#### Scenario: Login with 2FA enabled returns JSON signal
- **WHEN** a user with confirmed 2FA sends `POST /login` via XHR with valid credentials
- **THEN** the server responds with `200 OK` and body `{ two_factor: true }` (not a redirect)

#### Scenario: Challenge endpoint returns JSON on error
- **WHEN** `POST /two-factor-challenge` is sent with an invalid code via XHR
- **THEN** the server responds with `422 Unprocessable Entity` and a JSON validation error body (not a redirect)

### Requirement: Password confirmation endpoint
The system SHALL expose Fortify's `POST /user/confirm-password` endpoint for clients to confirm the current password before sensitive operations.

#### Scenario: Valid password confirmation returns 201
- **WHEN** an authenticated user sends `POST /user/confirm-password` with their correct current password
- **THEN** the server responds with `201 Created` and starts a 3-hour confirmation window in the session

#### Scenario: Invalid password confirmation returns 422
- **WHEN** an authenticated user sends `POST /user/confirm-password` with an incorrect password
- **THEN** the server responds with `422 Unprocessable Entity`

#### Scenario: Password confirmation status endpoint
- **WHEN** an authenticated user sends `GET /user/confirmed-password-status`
- **THEN** the server responds with `{ confirmed: true|false }` indicating whether confirmation is still valid
