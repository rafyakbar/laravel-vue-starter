## Why

The current profile page is a simple stacked list of cards with a narrow `max-w-lg` layout that doesn't make good use of screen space and lacks a clear visual hierarchy. Browser session management is missing entirely, and the URL `/profile` is less personal than it could be for an account settings page.

## What Changes

- **BREAKING** — Route URL changes from `/profile` to `/my-profile` (router, all links, E2E tests updated)
- Page heading changes to "My Profile" (h1) with new description text
- Layout redesigned to a two-column pattern (35% label column / 65% form column) for all four sections, applied consistently to both `DefaultLayout` (regular user) and `AdminLayout` (admin/superadmin)
- **Personal Information** section: Avatar moves into the form area as a left sub-column (35%), alongside name, username, and read-only email display; single "Update" button
- **Password** section: Unchanged fields (current / new / confirm), styled in new layout
- **Two-Factor Authentication** section: Disabled state redesigned — alert icon + explanation paragraph + "Enable" button; other states (setup, recovery codes, enabled) retain same logic, wrapped in new layout
- **Browser Sessions** section added — lists active sessions with device info and last activity, plus "Log Out Other Browser Sessions" button (requires password confirmation modal)
- `AvatarUpload` component refactored — outer card wrapper removed, usable as an embedded sub-column
- Full i18n coverage (EN + ID) for all new strings
- Playwright E2E tests updated across all three role suites; Pest tests added for browser sessions API

## Capabilities

### New Capabilities
- `browser-sessions`: Backend API and frontend component to list the current user's active browser sessions and log out all sessions except the current one (with password confirmation)

### Modified Capabilities
- `profile-management`: URL changes from `/profile` to `/my-profile`; layout redesigned to two-column; Personal Information section gains read-only email display and embedded avatar; Two-Factor Authentication disabled state redesigned; full i18n for new strings added; E2E tests updated

## Impact

- **Router**: `path` and `name` for the profile route change — any internal `router-link` or `{ name: 'profile' }` reference must be updated
- **ProfileDropdown**: Uses `{ name: 'profile' }` — must be updated to `{ name: 'my-profile' }`
- **ProfilePage.vue**: Full rewrite of template structure
- **AvatarUpload.vue**: Remove outer card; accept optional `compact` prop for embedded use
- **ProfileInfoForm.vue**: Add read-only email field; merge avatar into form layout
- **TwoFactorForm.vue**: Redesign disabled state block; fit all states into new layout container
- **New file**: `resources/app/components/profile/BrowserSessionsForm.vue`
- **New backend**: `GET /api/profile/sessions`, `DELETE /api/profile/sessions/others` (with password confirm via `POST /user/confirm-password`)
- **New Pest tests**: `tests/Feature/BrowserSessionsTest.php`
- **E2E tests**: All three `profile.spec.ts` files updated (URL + heading assertions + new section tests)
- **i18n**: ~15 new keys in both `en.ts` and `id.ts`
- **Sessions table**: Read-only queries on existing `sessions` table — no migration needed
