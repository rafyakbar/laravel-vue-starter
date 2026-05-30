## Why

Six UI patterns are duplicated across 7 components in `resources/app/components/`, bloating the codebase with ~200 lines of near-identical Vue template and script code. Auth dropdowns (guest Sign In/Sign Up / authenticated Profile/Sign Out), user profile with initials avatar, and the `userInitials()` utility appear in 4+ places each. Every visual or behavioral tweak to these requires changing multiple files, increasing maintenance burden and risk of inconsistency. Extracting them into `shared/` components eliminates this duplication and provides a single source of truth.

## What Changes

- Create **`UserProfileDropdown`** (`shared/UserProfileDropdown.vue`) — reusable dropdown with Profile link + Sign Out, user avatar, and name/email display. Used by `AdminBottomNav`, `AdminSidebar`, `AdminUserMenu`, and `PublicBottomNav` (authenticated).
- Create **`GuestAuthDropdown`** (`shared/GuestAuthDropdown.vue`) — reusable dropdown with Sign In / Sign Up links. Used by `PublicBottomNav` (guest) and `PublicNavbar` mobile.
- Create **`AuthNavDropdown`** (`shared/AuthNavDropdown.vue`) — smart wrapper that auto-detects auth state and renders `UserProfileDropdown` or `GuestAuthDropdown`. Used by `PublicBottomNav`.
- Create **`UserInitials`** (`shared/UserInitials.vue`) — avatar with computed initials, props for `name`, `email`, `size`. Used by `AdminSidebar`, `AdminUserMenu`, `ProfilePage`.
- Create **`LandingSection`** (`shared/LandingSection.vue`) — reusable section wrapper with `data-animate`, padding, and max-width container. Used by all 10 `Landing*.vue` components.
- Extract **`useNavActive`** composable — replaces duplicated `isActive(routeName)` in `AdminBottomNav` and `PublicBottomNav`.
- Replace inline implementations in `AdminBottomNav.vue`, `AdminSidebar.vue`, `AdminUserMenu.vue`, `AdminHeader.vue`, `PublicBottomNav.vue`, `PublicNavbar.vue`, `ProfilePage.vue`.
- Remove `AdminThemeMenu.vue` and `AdminLanguageMenu.vue` (replaced by `AdminUserMenu.vue` usage patterns — no shared extraction needed since these are already thin components).
- Update **16 E2E tests** across `user/responsive.spec.ts`, `admin/responsive.spec.ts`, `superadmin/responsive.spec.ts`, `admin/dashboard.spec.ts`, `superadmin/dashboard.spec.ts`, `user/home.spec.ts`, and `user/signout.spec.ts` — new component structure changes DOM locators.

## Capabilities

### New Capabilities
- `shared-auth-components`: Reusable auth-aware UI components that provide consistent Profile/Sign Out and Sign In/Sign Up dropdowns for all public and admin layouts
- `shared-layout-components`: Reusable layout utility components (section wrappers, avatar displays) that eliminate duplicate markup

### Modified Capabilities
- `e2e-testing`: Test locators updated to match the new shared component DOM structure without changing test behavior

## Impact

- `resources/app/components/shared/` — 5 new files: `UserProfileDropdown.vue`, `GuestAuthDropdown.vue`, `AuthNavDropdown.vue`, `UserInitials.vue`, `LandingSection.vue`
- `resources/app/composables/` — 1 new file: `useNavActive.ts`
- `resources/app/components/admin/AdminBottomNav.vue` — replace inline Profile dropdown with `UserProfileDropdown`
- `resources/app/components/admin/AdminSidebar.vue` — replace inline user footer dropdown with `UserProfileDropdown` and `UserInitials`
- `resources/app/components/admin/AdminUserMenu.vue` — replace inline avatar/logout with `UserInitials` + `UserProfileDropdown`
- `resources/app/components/admin/AdminHeader.vue` — update `AdminUserMenu` prop forwarding
- `resources/app/components/public/PublicBottomNav.vue` — replace inline auth dropdown with `AuthNavDropdown`
- `resources/app/components/public/PublicNavbar.vue` — replace inline auth actions with shared components (desktop)
- `resources/app/views/pages/ProfilePage.vue` — replace inline avatar with `UserInitials`
- `resources/app/components/public/landing/Landing*.vue` — replace outer section wrapper with `LandingSection`
- `tests/e2e/tests/` — 7 E2E test files with locator adjustments