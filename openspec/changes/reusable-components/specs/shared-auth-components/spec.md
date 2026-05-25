## ADDED Requirements

### Requirement: UserProfileDropdown reusable component
The system SHALL provide a reusable `UserProfileDropdown` component in `resources/app/components/shared/` that renders a shadcn-vue DropdownMenu with Profile navigation link and Sign Out action. The component MUST use `useAuthStore()` for user data, `useI18n()` for labels, and `authStore.logout()` for sign-out. The trigger button content SHALL be provided via a named `#trigger` slot. The dropdown content (Profile + Sign Out) MUST be rendered internally and MUST NOT require callers to duplicate the dropdown markup.

#### Scenario: UserProfileDropdown renders Profile and Sign Out menu items
- **WHEN** `UserProfileDropdown` is mounted with a `#trigger` slot provided
- **THEN** clicking the trigger opens a DropdownMenu containing `menuitem` with name "Profile" and `menuitem` with name "Sign Out"

#### Scenario: UserProfileDropdown Profile link navigates to /profile
- **WHEN** the "Profile" menuitem is clicked
- **THEN** the browser navigates to `/profile` via Vue Router

#### Scenario: UserProfileDropdown Sign Out calls authStore.logout()
- **WHEN** the "Sign Out" menuitem is clicked
- **THEN** `authStore.logout()` is called, clearing the user session and navigating away from the current page

#### Scenario: UserProfileDropdown accepts side, align, and showProfile props
- **WHEN** `UserProfileDropdown` is rendered with `side="top"` and `align="end"`
- **THEN** the DropdownMenu opens from the top and is aligned to the end of the trigger

### Requirement: GuestAuthDropdown reusable component
The system SHALL provide a reusable `GuestAuthDropdown` component in `resources/app/components/shared/` that renders a shadcn-vue DropdownMenu with Sign In and Sign Up navigation links. The component MUST use `useI18n()` for labels. The trigger button content SHALL be provided via a named `#trigger` slot.

#### Scenario: GuestAuthDropdown renders Sign In and Sign Up menu items
- **WHEN** `GuestAuthDropdown` is mounted with a `#trigger` slot provided
- **THEN** clicking the trigger opens a DropdownMenu containing `menuitem` with name "Sign In" and `menuitem` with name "Sign Up"

#### Scenario: GuestAuthDropdown Sign In navigates to /login
- **WHEN** the "Sign In" menuitem is clicked
- **THEN** the browser navigates to `/login` via Vue Router

#### Scenario: GuestAuthDropdown Sign Up navigates to /register
- **WHEN** the "Sign Up" menuitem is clicked
- **THEN** the browser navigates to `/register` via Vue Router

### Requirement: AuthNavDropdown auto-detects auth state
The system SHALL provide a reusable `AuthNavDropdown` component in `resources/app/components/shared/` that conditionally renders `UserProfileDropdown` (when authenticated) or `GuestAuthDropdown` (when unauthenticated) based on `authStore.isAuthenticated`. The `#trigger` slot MUST expose a `label` slot prop containing "Sign In" (guest) or the authenticated user's name.

#### Scenario: AuthNavDropdown renders GuestAuthDropdown when unauthenticated
- **WHEN** `AuthNavDropdown` is mounted while `authStore.isAuthenticated` is `false`
- **THEN** the trigger shows "Sign In" text and clicking it opens a guest dropdown with Sign In / Sign Up options

#### Scenario: AuthNavDropdown renders UserProfileDropdown when authenticated
- **WHEN** `AuthNavDropdown` is mounted while `authStore.isAuthenticated` is `true`
- **THEN** the trigger shows the authenticated user's name and clicking it opens a user dropdown with Profile / Sign Out options

#### Scenario: AuthNavDropdown label slot prop reflects current auth state
- **WHEN** the auth state changes (login or logout)
- **THEN** the `label` slot prop updates reactively — "Sign In" for guest, user name for authenticated