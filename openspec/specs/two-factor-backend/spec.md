# two-factor-backend Specification

## Purpose
TBD - created by archiving change add-2fa. Update Purpose after archive.
## Requirements
### Requirement: Fortify 2FA feature is enabled
The system SHALL enable `Features::twoFactorAuthentication` with `confirm: true` and `confirmPassword: true` in `config/fortify.php`, and the `User` model SHALL use the `TwoFactorAuthenticatable` trait.

#### Scenario: User model supports 2FA
- **WHEN** the `User` model is loaded
- **THEN** it uses `Laravel\Fortify\TwoFactorAuthenticatable` trait, exposing `two_factor_secret`, `two_factor_recovery_codes`, and `two_factor_confirmed_at` attributes

### Requirement: User can enable 2FA with TOTP
The system SHALL allow an authenticated user to initiate 2FA setup via `POST /user/two-factor-authentication` and confirm it via `POST /user/confirmed-two-factor-authentication`.

#### Scenario: Enable 2FA
- **WHEN** an authenticated user sends `POST /user/two-factor-authentication`
- **THEN** the server generates a TOTP secret, stores it on the user, and responds with `200 OK`
- **AND** `two_factor_confirmed_at` is still null (setup not yet confirmed)

#### Scenario: Retrieve QR code for setup
- **WHEN** an authenticated user sends `GET /user/two-factor-qr-code` after enabling
- **THEN** the server responds with `{ svg: '...' }` containing an SVG QR code for the authenticator app

#### Scenario: Retrieve secret key for manual entry
- **WHEN** an authenticated user sends `GET /user/two-factor-secret-key`
- **THEN** the server responds with `{ secretKey: '...' }` containing the plaintext TOTP secret

#### Scenario: Confirm 2FA setup with valid code
- **WHEN** an authenticated user sends `POST /user/confirmed-two-factor-authentication` with a valid TOTP code
- **THEN** the server sets `two_factor_confirmed_at` to the current timestamp and responds with `200 OK`

#### Scenario: Confirm 2FA setup with invalid code returns 422
- **WHEN** an authenticated user sends `POST /user/confirmed-two-factor-authentication` with an incorrect TOTP code
- **THEN** the server responds with `422 Unprocessable Entity`

### Requirement: User can view and regenerate recovery codes
The system SHALL allow an authenticated user to retrieve and regenerate recovery codes.

#### Scenario: Retrieve recovery codes
- **WHEN** an authenticated user sends `GET /user/two-factor-recovery-codes`
- **THEN** the server responds with a JSON array of recovery code strings

#### Scenario: Regenerate recovery codes
- **WHEN** an authenticated user sends `POST /user/two-factor-recovery-codes`
- **THEN** the server generates a new set of recovery codes, stores them, and responds with the new codes

### Requirement: User can disable 2FA
The system SHALL allow an authenticated user to disable 2FA via `DELETE /user/two-factor-authentication`.

#### Scenario: Disable 2FA clears secrets
- **WHEN** an authenticated user sends `DELETE /user/two-factor-authentication`
- **THEN** the server clears `two_factor_secret`, `two_factor_recovery_codes`, and `two_factor_confirmed_at` and responds with `200 OK`

### Requirement: Login with 2FA enabled triggers challenge
The system SHALL, when a user with confirmed 2FA logs in, respond with `{ two_factor: true }` instead of fully authenticating the session.

#### Scenario: Login response signals 2FA required
- **WHEN** a user with confirmed 2FA sends `POST /login` with valid credentials via XHR
- **THEN** the server responds with `200 OK` and body `{ two_factor: true }`
- **AND** `Auth::user()` is NOT yet set (session holds pending login state only)

#### Scenario: 2FA challenge with valid TOTP code completes login
- **WHEN** a user sends `POST /two-factor-challenge` with a valid `code` after a pending login
- **THEN** the server fully authenticates the user, sets the session, and responds with `200 OK`

#### Scenario: 2FA challenge with valid recovery code completes login
- **WHEN** a user sends `POST /two-factor-challenge` with a valid `recovery_code` after a pending login
- **THEN** the server fully authenticates the user and responds with `200 OK`

#### Scenario: 2FA challenge with invalid code returns 422
- **WHEN** a user sends `POST /two-factor-challenge` with an incorrect `code`
- **THEN** the server responds with `422 Unprocessable Entity`

### Requirement: Password confirmation required before sensitive 2FA actions
The system SHALL require password confirmation (via Fortify's `POST /user/confirm-password`) before enabling, disabling, viewing, or regenerating recovery codes. The confirmation is valid for 3 hours within the same session.

#### Scenario: 2FA management without confirmation returns 423
- **WHEN** an authenticated user calls a 2FA management endpoint without recent password confirmation
- **THEN** the server responds with `423 Locked`

#### Scenario: Password confirmation unlocks 2FA management
- **WHEN** an authenticated user sends `POST /user/confirm-password` with their correct password
- **THEN** the server responds with `201 Created` and subsequent 2FA management calls within 3 hours succeed

