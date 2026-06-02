## ADDED Requirements

### Requirement: Profile page shows 2FA management section
The system SHALL render a `TwoFactorForm` component on the Profile page alongside existing `ProfileInfoForm` and `PasswordForm` components.

#### Scenario: 2FA section is visible on profile page
- **WHEN** an authenticated user navigates to `/profile`
- **THEN** a 2FA management card is visible showing the current 2FA status

#### Scenario: 2FA status shown as disabled when not configured
- **WHEN** the user has not enabled 2FA
- **THEN** the card shows a "Disabled" status and an "Enable Two-Factor Authentication" button

#### Scenario: 2FA status shown as enabled when configured
- **WHEN** the user has enabled and confirmed 2FA
- **THEN** the card shows an "Enabled" status with options to regenerate recovery codes and disable 2FA

### Requirement: Password confirmation required before 2FA management
The system SHALL prompt the user for their current password before any 2FA management action (enable, disable, view/regenerate recovery codes). Once confirmed within the session, subsequent actions in the same 3-hour window skip re-confirmation.

#### Scenario: Password confirmation step shown before enable
- **WHEN** the user clicks "Enable Two-Factor Authentication"
- **THEN** the form transitions to a password confirmation step before initiating 2FA setup

#### Scenario: Correct password advances to setup step
- **WHEN** the user submits their correct password in the confirmation step
- **THEN** the form advances to the QR code setup step

#### Scenario: Incorrect password shows error
- **WHEN** the user submits an incorrect password in the confirmation step
- **THEN** an inline error is displayed and the user stays on the confirmation step

### Requirement: Enable 2FA setup flow with QR code and confirmation
The system SHALL present a step-by-step inline setup flow: password confirm → QR code display → TOTP confirmation → recovery codes display.

#### Scenario: QR code and manual secret are shown after password confirm
- **WHEN** password confirmation succeeds during the enable flow
- **THEN** a QR code SVG and the plaintext secret key are displayed for the user to add to their authenticator app

#### Scenario: User confirms 2FA setup with a valid TOTP code
- **WHEN** the user enters a valid code from their authenticator app and submits
- **THEN** `POST /user/confirmed-two-factor-authentication` succeeds and recovery codes are displayed

#### Scenario: Recovery codes displayed after successful confirmation
- **WHEN** 2FA setup is confirmed
- **THEN** all recovery codes are shown in a copyable list with a prompt to save them

#### Scenario: Done button returns to enabled state
- **WHEN** the user clicks "Done" after saving recovery codes
- **THEN** the form shows the 2FA enabled state (status badge + Regenerate Codes + Disable buttons)

### Requirement: Regenerate recovery codes
The system SHALL allow an authenticated user with 2FA enabled to regenerate recovery codes from the profile page.

#### Scenario: Regenerate codes requires password confirmation
- **WHEN** the user clicks "Regenerate Recovery Codes"
- **THEN** if no recent confirmation exists, a password confirmation prompt appears first

#### Scenario: New recovery codes are displayed after regeneration
- **WHEN** `POST /user/two-factor-recovery-codes` succeeds
- **THEN** the new set of recovery codes is displayed with a prompt to save them

### Requirement: Disable 2FA from profile page
The system SHALL allow an authenticated user with 2FA enabled to disable it from the profile page.

#### Scenario: Disable 2FA requires password confirmation
- **WHEN** the user clicks "Disable Two-Factor Authentication"
- **THEN** if no recent confirmation exists, a password confirmation prompt appears

#### Scenario: Disabling 2FA returns to disabled state
- **WHEN** `DELETE /user/two-factor-authentication` succeeds
- **THEN** the form returns to the "Disabled" state with the "Enable" button visible
