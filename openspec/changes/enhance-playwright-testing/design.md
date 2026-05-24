## Context

The E2E test suite covers 110 tests across 5 role-based projects (guest, auth, user, admin, superadmin), but 96 of those tests run only at desktop viewport (1280x720). The landing page uses a `md` (768px) breakpoint to switch between desktop navbar (`hidden md:flex`) and mobile bottom nav (`md:hidden`). The admin layout similarly switches at `md` between expanded sidebar and mobile drawer + `AdminBottomNav`. These responsive behaviors are critical but untested for authenticated roles.

Current viewport coverage:
- Mobile (375x667): 4 guest tests only (in `landing.spec.ts`)
- Tablet (768x1024): 0 tests
- Desktop (1280x720): ~106 tests (including 2 explicit desktop tests in `landing.spec.ts`)
- Large desktop (1920x1080): 11 sidebar-collapse tests

Key components and their responsive breakpoints:
- `PublicNavbar.vue`: `hidden md:flex` for desktop nav/actions, `md:bg-background/80 md:backdrop-blur-md`
- `PublicBottomNav.vue`: `md:hidden` — shown on mobile only, has auth dropdown (guest: Sign In/Sign Up, authenticated: Profile/Sign Out)
- `AdminBottomNav.vue`: `md:hidden` — shown on mobile only, has Site/Dashboard/Menu/Profile items, Menu button calls `setOpenMobile(true)` to open sidebar Sheet
- `AdminSidebar.vue`: shadcn Sidebar with `collapsible="icon"` — on mobile renders as Sheet/drawer via `useSidebar()` `isMobile` state
- `AdminHeader.vue`: `sticky top-0 z-10` with SidebarTrigger, AdminThemeMenu, AdminLanguageMenu, AdminUserMenu — visible on all viewports
- `LandingLayout.vue`: `h-dvh flex-col md:h-auto md:min-h-screen` — mobile layout is flex column with in-flow navbar and bottom nav
- `AdminLayout.vue`: `SidebarProvider > [AdminSidebar + SidebarInset(AdminHeader + main) + AdminBottomNav]`

## Goals / Non-Goals

**Goals:**
- Create responsive test specs that verify layout switching at the md breakpoint for all roles
- Test `AdminBottomNav` navigation and interactions on mobile
- Test `PublicBottomNav` authenticated user dropdown on mobile
- Test mobile sidebar drawer opening via Menu button
- Test that desktop-only elements are hidden on mobile and vice versa
- Test theme and language switching on mobile admin
- Update README test count after all new tests are added

**Non-Goals:**
- Adding new Playwright viewport projects to the config
- Adding new application features or fixing bugs
- Changing component behavior or CSS
- Adding unit or integration tests (Pest)
- Testing at extreme viewports (very small phones, 4K monitors)
- Visual regression / screenshot comparison testing
- Performance or accessibility testing

## Decisions

### Decision 1: Use `test.use({ viewport })` in describe blocks instead of separate Playwright projects

The existing `landing.spec.ts` already uses `test.use({ viewport: { width: 375, height: 667 } })` inside `test.describe` blocks. This pattern works well and doesn't require config changes. Each responsive spec file contains Mobile (375x667) and Tablet (768x1024) describe blocks with viewport overrides. Desktop (1280x720) is already the default viewport and covered by existing tests.

**Rationale**: Adding separate viewport projects would cause ALL tests in a role's `testDir` to run at the mobile/tablet viewport, breaking existing desktop-only tests. Using `test.use()` within describe blocks avoids this problem entirely. It also follows the established convention in `landing.spec.ts`.

**What this means**: No changes to `playwright.config.ts`. No new projects. All responsive specs live alongside existing specs in the same role `testDir` and run under the same project. The viewport override is scoped to each `test.describe` block.

### Decision 2: Three viewport sizes, but only Mobile and Tablet need new tests

- Mobile: 375x667 (iPhone SE) — tests `md:hidden` items visible, `hidden md:flex` items hidden
- Tablet: 768x1024 (iPad Mini portrait) — tests the exact `md` breakpoint where layout switches
- Desktop: 1280x720 (existing default) — already covered by existing spec files

No desktop-only `test.describe` block is needed in responsive specs because all existing tests already run at desktop viewport.

### Decision 3: Use `data-slot` and CSS class selectors for scoping

Following the pattern established in the existing test suite:
- Desktop navbar: `page.locator('[data-slot="public-navbar"]')` — scopes to PublicNavbar
- Bottom nav: `page.locator('nav.md\\:hidden')` — scopes to both PublicBottomNav and AdminBottomNav (mutually exclusive per page)
- Admin sidebar: `page.locator('[data-sidebar="content"]')` — scopes to AdminSidebar content area
- Admin header: direct Playwright locators on `page` (header is always the single visible `<header>` on admin pages)

`nav.md\\:hidden` is context-dependent: on `/` it matches PublicBottomNav, on `/admin` it matches AdminBottomNav.

### Decision 4: Auth flow tests don't need responsive variants

Auth tests (login, register, forgot-password) use `DefaultLayout` which is a simple centered layout with no responsive nav switch. These don't benefit from mobile/tablet viewport testing because the form layout is consistently centered.

### Decision 5: File organization — one `responsive.spec.ts` per role

Each role gets its own `responsive.spec.ts` in its existing test directory:
- `tests/e2e/tests/guest/responsive.spec.ts`
- `tests/e2e/tests/user/responsive.spec.ts`
- `tests/e2e/tests/admin/responsive.spec.ts`
- `tests/e2e/tests/superadmin/responsive.spec.ts`

This keeps responsive tests separate from functional tests, making it easy to find and maintain. It follows the existing convention where `landing.spec.ts` already contains both desktop and mobile tests in the same file.

### Decision 6: Mobile sidebar interaction pattern

On mobile, the admin sidebar is a closed Sheet by default. Tests must:
1. Click the Menu button in `AdminBottomNav` to open the sidebar Sheet
2. Wait for `[data-sidebar="content"]` to become visible
3. Assert on sidebar content
4. Close the sidebar by pressing Escape or navigating away before the next test

The `setOpenMobile(true)` call in `AdminBottomNav.vue` opens the sidebar Sheet. The Sheet overlay has a backdrop that can be clicked to close, or Escape can be pressed.

### Decision 7: Admin landing page mobile tests

On the landing page (`/`), admin/superadmin users see:
- `PublicNavbar` (desktop): hidden on mobile (`hidden md:flex`)
- `PublicBottomNav` (mobile): visible on mobile, shows user name dropdown with Profile/Sign Out
- Admin button: in desktop-only section (`hidden md:flex`), NOT visible on mobile

On the admin page (`/admin`), admin/superadmin users see:
- `AdminBottomNav` (mobile): visible on mobile, has Site/Dashboard/Menu/Profile
- `AdminHeader`: visible at all viewports
- `AdminSidebar`: Sheet/drawer on mobile, collapsed sidebar on desktop

Both pages need mobile/tablet testing for each role.

## Risks / Trade-offs

- **Sheet/drawer animation timing**: The mobile sidebar Sheet may have an opening animation. Use `waitForLoadState('networkidle')` after opening and `expect(locator).toBeVisible()` with default timeout. Mitigation: follow the same pattern as existing sidebar tests which use `waitForLoadState('networkidle')`.
- **Dropdown menu interaction**: Both `PublicBottomNav` and `AdminBottomNav` use `DropdownMenu` components that require click-to-open before asserting content. Tests must click the dropdown trigger first, then assert dropdown items. Mitigation: use explicit `click()` then `expect()` pattern, matching existing language/theme test patterns.
- **Bottom nav `fixed` positioning vs in-flow**: `AdminBottomNav` uses `fixed bottom-0 inset-x-0` while `PublicBottomNav` uses `shrink-0` (in-flow). Tests should rely on visibility assertions (`toBeVisible()`) rather than position-specific assertions.
- **768px breakpoint flakiness**: Testing at exactly 768px can be flaky if browser scrollbar width varies. Use 768x1024 viewport which provides enough room. If issues arise, shift to 769x1024.
- **localStorage for language/theme**: Admin language and theme tests must clear localStorage between tests (`localStorage.removeItem('locale')`, `localStorage.removeItem('theme')`) to avoid cross-test contamination. Follow the pattern in existing `language.spec.ts`.