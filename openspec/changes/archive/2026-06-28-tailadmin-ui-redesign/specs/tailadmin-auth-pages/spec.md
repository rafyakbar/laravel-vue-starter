## ADDED Requirements

### Requirement: Auth pages use TailAdmin split layout
All five auth pages (Login, Register, ForgotPassword, ResetPassword, TwoFactorChallenge) SHALL use a split two-column layout:
- **Left column** (`w-full lg:w-1/2`): Contains the auth form, centered vertically with `max-w-md mx-auto`
- **Right column** (`hidden lg:flex lg:w-1/2`): Brand panel with `bg-brand-50 dark:bg-brand-500/10` background, decorative dot grid pattern, app logo icon, app name, and a tagline. Hidden on mobile and tablet (below `lg`).

The layout wraps with `min-h-screen flex flex-col lg:flex-row` on a white/dark-gray-900 background. All existing form logic, validation, API calls, and router navigation SHALL remain unchanged.

#### Scenario: Split layout on desktop
- **WHEN** an unauthenticated user visits `/login` on a screen ≥1024px wide
- **THEN** the page shows the form on the left half and the brand panel on the right half

#### Scenario: Form-only on mobile
- **WHEN** an unauthenticated user visits `/login` on a screen <1024px wide
- **THEN** only the form column is visible; the brand panel is hidden

#### Scenario: Dark mode support on auth pages
- **WHEN** the application is in dark mode and the user visits `/login`
- **THEN** the page background is dark (`bg-gray-900`), the brand panel uses `bg-brand-500/10`, and form inputs use dark variants

---

### Requirement: Auth form uses TailAdmin form styling
The auth form container SHALL use `space-y-5` for field spacing and inputs SHALL have `h-11` height. The submit button SHALL be full-width (`w-full`) with `py-3` padding.

#### Scenario: Login form input height
- **WHEN** the Login page renders
- **THEN** email and password inputs are 44px tall (`h-11`)

#### Scenario: Submit button full width
- **WHEN** any auth page form renders
- **THEN** the submit button spans the full width of the form column

---

### Requirement: Auth page back navigation link
Each auth page form column SHALL include a "← Back to dashboard" (or "← Back to home") text link at the top of the left column, styled as `text-sm text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white/90`.

#### Scenario: Back link visible on Login
- **WHEN** the Login page renders
- **THEN** a back navigation link is visible at the top of the form column

---

### Requirement: Auth page form title uses TailAdmin heading style
Each auth page SHALL display the form title as `text-[30px] font-bold sm:text-[36px] text-gray-800 dark:text-white/90` and a subtitle as `text-sm text-gray-500 dark:text-gray-400 mt-2`.

#### Scenario: Login title styling
- **WHEN** the Login page renders
- **THEN** the "Sign In" heading has a bold weight and gray-800 color in light mode

---

### Requirement: Brand panel shows app identity
The right-column brand panel SHALL contain:
- A square icon container (`size-16 rounded-2xl bg-white shadow-theme-md dark:bg-white/5`) with the app's initial or icon
- App name as `text-2xl font-semibold tracking-tight`
- A short tagline as `text-sm opacity-75 mt-3 max-w-xs text-center`
- A subtle decorative radial dot grid as the panel background

#### Scenario: Brand panel content on Login page
- **WHEN** the Login page renders on a ≥1024px screen
- **THEN** the right panel shows the app logo icon, app name, and tagline
