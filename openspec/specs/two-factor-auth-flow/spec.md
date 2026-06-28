# two-factor-auth-flow Specification

## Purpose
TBD - created by archiving change add-2fa. Update Purpose after archive.
## Requirements
### Requirement: Auth store detects 2FA-pending state after login
The system SHALL update `authStore.login()` to inspect the `POST /login` response body. When `{ two_factor: true }` is returned, the store SHALL set a `requiresTwoFactor` flag and NOT call `fetchUser()`.

#### Scenario: Login with 2FA-enabled account sets requiresTwoFactor
- **WHEN** `authStore.login()` is called and `/login` responds with `{ two_factor: true }`
- **THEN** `authStore.requiresTwoFactor` is `true`
- **AND** `authStore.user` remains `null` (no fetchUser called)

#### Scenario: Normal login clears requiresTwoFactor
- **WHEN** `authStore.login()` is called and `/login` responds without `two_factor: true`
- **THEN** `authStore.requiresTwoFactor` is `false`
- **AND** `fetchUser()` is called and `authStore.user` is populated

#### Scenario: requiresTwoFactor is false by default
- **WHEN** a fresh authStore is initialized
- **THEN** `authStore.requiresTwoFactor` is `false`

### Requirement: Auth store exposes 2FA challenge action
The system SHALL provide `authStore.completeTwoFactorChallenge(payload)` that posts to `POST /two-factor-challenge` and on success calls `fetchUser()` and clears `requiresTwoFactor`.

#### Scenario: Valid TOTP code completes challenge
- **WHEN** `authStore.completeTwoFactorChallenge({ code: '123456' })` is called with a valid code
- **THEN** the store posts to `/two-factor-challenge`, calls `fetchUser()`, sets `requiresTwoFactor = false`, and `authStore.user` is populated

#### Scenario: Valid recovery code completes challenge
- **WHEN** `authStore.completeTwoFactorChallenge({ recovery_code: 'xxxx-xxxx' })` is called with a valid recovery code
- **THEN** the store completes authentication and `authStore.user` is populated

#### Scenario: Invalid code throws error
- **WHEN** `authStore.completeTwoFactorChallenge({ code: '000000' })` is called with an invalid code
- **THEN** the action throws an error with the 422 response body, allowing the form to display errors

### Requirement: TwoFactorChallengePage at /two-factor-challenge
The system SHALL provide a page at `/two-factor-challenge` with a form to enter either a TOTP code or a recovery code. The page SHALL only be accessible when `authStore.requiresTwoFactor` is `true`.

#### Scenario: Page shows TOTP code input by default
- **WHEN** the user navigates to `/two-factor-challenge` during the 2FA-pending state
- **THEN** a numeric code input is visible with a label distinguishing it from recovery code input

#### Scenario: User can toggle to recovery code input
- **WHEN** the user clicks "Use recovery code" on the challenge page
- **THEN** the TOTP input is replaced with a text input for the recovery code
- **AND** a "Use authentication code" link returns to TOTP mode

#### Scenario: Successful challenge navigates to intended destination
- **WHEN** the user submits a valid code on the challenge page
- **THEN** `authStore.completeTwoFactorChallenge()` succeeds and the router navigates to the appropriate destination (admin panel or home, based on permissions)

#### Scenario: Invalid code shows error inline
- **WHEN** the user submits an incorrect code on the challenge page
- **THEN** the 422 error is displayed below the input field without navigating away

### Requirement: Router guards enforce 2FA challenge route access
The system SHALL prevent direct navigation to `/two-factor-challenge` unless `requiresTwoFactor` is `true`, and SHALL redirect unauthenticated users with pending 2FA to the challenge page instead of the login page.

#### Scenario: Direct navigation to challenge page without 2FA state redirects to login
- **WHEN** a user navigates directly to `/two-factor-challenge` without having a pending 2FA challenge
- **THEN** the router redirects to `/login`

#### Scenario: requiresAuth guard redirects to challenge page during 2FA-pending
- **WHEN** a user with `requiresTwoFactor = true` tries to navigate to a `requiresAuth` route
- **THEN** the router redirects to `/two-factor-challenge` instead of `/login`

#### Scenario: Guest guard redirects 2FA-pending users to challenge page
- **WHEN** a user with `requiresTwoFactor = true` tries to navigate to a `meta.guest` route (e.g., `/login`)
- **THEN** the router redirects to `/two-factor-challenge`

