## Why

The E2E test suite currently covers 110 tests but almost exclusively at desktop viewport (1280x720). Out of 110 tests, only 4 guest tests use mobile viewport (375x667) and 11 sidebar-collapse tests use large desktop (1920x1080). There are zero tablet viewport tests, zero mobile tests for authenticated roles (user, admin, superadmin), and zero mobile tests for the admin layout (bottom nav, sidebar drawer, header). The landing page navbar and bottom nav both respond at the md (768px) breakpoint with entirely different UI, but only the guest mobile bottom nav is tested. The admin layout has a fully different mobile experience (bottom nav + sidebar drawer) that is completely untested. The README states "79 tests" which is outdated and should reflect the actual count.

## What Changes

- Add tablet viewport (768x1024 — iPad Mini) test projects to `playwright.config.ts` for guest, user, admin, and superadmin roles
- Add mobile viewport (375x667 — iPhone SE) test projects for user, admin, and superadmin roles
- Create new responsive test spec files organized by role, each testing all three viewport modes (mobile, tablet, desktop):
  - `guest/responsive.spec.ts` — landing navbar/bottom nav behavior across all viewports
  - `user/responsive.spec.ts` — authenticated home page, navbar, bottom nav, profile, sign-out across all viewports
  - `admin/responsive.spec.ts` — admin dashboard, sidebar drawer, bottom nav, header, language, theme across all viewports
  - `superadmin/responsive.spec.ts` — full admin access, settings group, profile across all viewports
- Add mobile-specific tests for admin layout: `AdminBottomNav` navigation, mobile sidebar drawer (Sheet), `AdminHeader` hamburger menu
- Add mobile-specific tests for authenticated landing: `PublicBottomNav` user dropdown (profile link, sign out), admin button for admin/superadmin
- Add tablet-specific tests for md breakpoint boundary behavior
- Update README.md test count from "79 tests" to the actual count after all changes

## Capabilities

### New Capabilities
- `responsive-e2e-testing`: Multi-viewport (mobile, tablet, desktop) E2E tests covering all roles and responsive layout behavior

### Modified Capabilities
- `e2e-testing`: Updated test count and viewport coverage requirements to include three viewport modes

## Impact

- `tests/e2e/playwright.config.ts` — Add new projects for mobile and tablet viewports per role
- `tests/e2e/tests/guest/responsive.spec.ts` — New file: multi-viewport guest tests
- `tests/e2e/tests/user/responsive.spec.ts` — New file: multi-viewport user tests
- `tests/e2e/tests/admin/responsive.spec.ts` — New file: multi-viewport admin tests
- `tests/e2e/tests/superadmin/responsive.spec.ts` — New file: multi-viewport superadmin tests
- `README.md` — Updated test count