## Requirements

### Requirement: Authenticated user can list their active browser sessions
The system SHALL expose `GET /api/profile/sessions` that returns all active sessions for the authenticated user, including device label (parsed from user_agent), IP address, last active timestamp, and a flag marking the current session. The response SHALL be ordered by `last_activity` descending (most recent first).

#### Scenario: User fetches their sessions
- **WHEN** an authenticated user sends `GET /api/profile/sessions`
- **THEN** the system responds with 200 and a JSON array of session objects
- **AND** each object contains `id`, `ip_address`, `device`, `is_current`, `last_active_at`
- **AND** the entry matching the current session has `is_current: true`

#### Scenario: Current session is always marked
- **WHEN** the user has multiple active sessions
- **THEN** exactly one session in the response has `is_current: true`
- **AND** that session matches the server-side `session()->getId()`

#### Scenario: Unauthenticated request is rejected
- **WHEN** a guest sends `GET /api/profile/sessions`
- **THEN** the system responds with 401

### Requirement: Authenticated user can log out all other browser sessions
The system SHALL expose `DELETE /api/profile/sessions/others` that deletes all sessions for the authenticated user except the current one. The request MUST first be validated via password confirmation — the caller SHALL have confirmed their password within the Fortify password-confirmation window (`POST /user/confirm-password`) before this endpoint will succeed.

#### Scenario: User successfully logs out other sessions after password confirmation
- **WHEN** an authenticated user has confirmed their password and sends `DELETE /api/profile/sessions/others`
- **THEN** the system responds with 200
- **AND** all sessions for that user except the current one are deleted from the sessions table
- **AND** the current session remains active

#### Scenario: Request without prior password confirmation is rejected
- **WHEN** an authenticated user sends `DELETE /api/profile/sessions/others` without a recent password confirmation
- **THEN** the system responds with 423 (or redirects to password confirmation)

#### Scenario: Request with wrong password is rejected at confirmation step
- **WHEN** a user sends `POST /user/confirm-password` with an incorrect password
- **THEN** the system responds with 422 and the delete is never attempted

#### Scenario: Unauthenticated request is rejected
- **WHEN** a guest sends `DELETE /api/profile/sessions/others`
- **THEN** the system responds with 401

### Requirement: Browser sessions are displayed on the profile page
The system SHALL render a `BrowserSessionsForm` component in the Profile page that lists the current user's active sessions and provides a "Log Out Other Browser Sessions" button.

#### Scenario: Sessions list renders on the profile page
- **WHEN** an authenticated user visits `/my-profile`
- **THEN** the page displays the "Browser Sessions" section with a list of sessions
- **AND** the current device is visually indicated (e.g., "This device" label)

#### Scenario: Log Out Other Browser Sessions button triggers password confirmation
- **WHEN** the user clicks "Log Out Other Browser Sessions"
- **THEN** a password confirmation prompt appears before the delete is performed

#### Scenario: Successful logout updates the sessions list
- **WHEN** the user confirms their password and the delete succeeds
- **THEN** the sessions list refreshes and shows only the current session
- **AND** a success message is displayed
