## 1. Inject Sidebar State into AdminSidebar

- [x] 1.1 Import `useSidebar` from `@/components/ui/sidebar/utils` in `AdminSidebar.vue` script setup
- [x] 1.2 Destructure `state` and `isMobile` from `useSidebar()`: `const { state, isMobile } = useSidebar()`
- [x] 1.3 Verify `state` is a computed ref that returns `'expanded'` or `'collapsed'` by logging temporarily or checking in Vue DevTools
- [x] 1.4 Import `DropdownMenu`, `DropdownMenuContent`, `DropdownMenuItem`, `DropdownMenuTrigger` from `@/components/ui/dropdown-menu` (add to existing dropdown-menu imports)

## 2. Add Tooltip to Leaf Menu Items

- [x] 2.1 Add `:tooltip="t('nav.dashboard')"` to the Dashboard `SidebarMenuButton` at line 135:
- [x] 2.2 Verify the Site link already has `:tooltip="t('nav.site')"` at line 153 (it does — confirm it's present)
- [x] 2.3 Verify the Admin Panel header button (line 82) does NOT need a tooltip (it's `size="lg"` and shows "Admin Panel" text even in collapsed mode due to the `lg` size variant)
- [x] 2.4 Build check: `npm run build` — no TypeScript or template errors ✓

## 3. Implement DropdownMenu for Collapsed Group Items

- [x] 3.1 In `AdminSidebar.vue`, locate the Settings group item block (lines 106-131) — the `SidebarMenuItem v-if="item.children"` with `Collapsible`
- [x] 3.2 Wrap the existing `Collapsible` in a `v-if="state === 'expanded'"` condition so it only renders when sidebar is expanded:
- [x] 3.3 Ensure the `DropdownMenuContent` uses `side="right"` so it appears to the right of the collapsed sidebar (not overlapping the sidebar itself)
- [x] 3.4 Ensure `:side-offset="8"` positions the dropdown with a small gap from the sidebar edge
- [x] 3.5 Include the child item's `badge` (e.g., "Coming Soon") in the dropdown menu item, aligned to the right with `ml-auto`
- [x] 3.6 The `router-link` inside `DropdownMenuItem` should use `class="flex items-center gap-2"` for proper icon+text layout
- [x] 3.7 Build check: `npm run build` — no TypeScript or template errors ✓

## 4. Preserve Expanded Sidebar Behavior

- [x] 4.1 Verify the existing `Collapsible` block (lines 107-130) is unchanged except for the `v-if="state === 'expanded'"` wrapper
- [x] 4.2 Confirm `CollapsibleTrigger`, `SidebarMenuButton`, `CollapsibleContent`, `SidebarMenuSub`, and child items are all present and functional in expanded mode
- [x] 4.3 Confirm `openGroups` ref still controls the collapsible state: `v-model:open="openGroups[item.routeName]"`
- [x] 4.4 Confirm `isGroupActive(item.children)` still controls the active state of the group button
- [x] 4.5 Confirm `ChevronRight` rotation animation still works: `group-data-[state=open]/collapsible:rotate-90`

## 5. Handle Footer Dropdown in Collapsed Mode

- [x] 5.1 Review the sidebar footer user dropdown (lines 166-199) — it already uses `DropdownMenu`, which works in collapsed mode
- [x] 5.2 Verify the footer `SidebarMenuButton` (line 171, `size="lg"`) does NOT need a tooltip — in collapsed mode with `size="lg"`, the avatar is still visible and the dropdown trigger works
- [x] 5.3 Confirm no changes needed to footer — it already functions correctly in collapsed mode

## 6. Manual Verification — Expanded Sidebar

- [x] 6.1 Start dev server: `composer run dev` (or `npm run dev` + `php artisan serve` separately)
- [x] 6.2 Login as superadmin (`superadmin@example.com` / `123123`)
- [x] 6.3 Navigate to `/admin` — verify sidebar is expanded by default
- [x] 6.4 Click "Settings" group heading — verify it expands inline to show "Users" and "Roles & Permissions"
- [x] 6.5 Click "Settings" again — verify it collapses
- [x] 6.6 Click "Dashboard" — verify navigation to `/admin`
- [x] 6.7 Click "Site" — verify navigation to `/`
- [x] 6.8 Click sidebar rail or toggle to collapse sidebar — verify it collapses to icon-only mode

## 7. Manual Verification — Collapsed Sidebar

- [x] 7.1 With sidebar collapsed, hover over Dashboard icon — verify tooltip "Dashboard" appears
- [x] 7.2 Click Dashboard icon — verify navigation to `/admin`
- [x] 7.3 Hover over Settings icon — verify tooltip "Settings" appears
- [x] 7.4 Click Settings icon — verify a floating dropdown menu appears to the right with "Users" and "Roles & Permissions" items, each showing their icon and label
- [x] 7.5 In the Settings dropdown, hover over "Users" — verify hover highlight
- [x] 7.6 Click "Users" in dropdown — verify navigation to `/admin/users` and dropdown closes
- [x] 7.7 Click Settings icon again — verify dropdown closes (toggle behavior)
- [x] 7.8 Click outside the dropdown — verify it closes
- [x] 7.9 Hover over Site (Globe) icon — verify tooltip "Site" appears
- [x] 7.10 Click Site icon — verify navigation to `/`
- [x] 7.11 Click sidebar rail or toggle to expand sidebar — verify it expands back to full width
- [x] 7.12 In expanded mode, click "Settings" — verify inline collapsible works (not dropdown)

## 8. Manual Verification — Admin Role

- [x] 8.1 Login as admin (`admin@example.com` / `123123`)
- [x] 8.2 Navigate to `/admin` — verify sidebar shows only Dashboard (no Settings group, since admin lacks `view-users` permission)
- [x] 8.3 Collapse sidebar — verify Dashboard icon is visible with tooltip
- [x] 8.4 Click Dashboard icon — verify navigation works

## 9. Manual Verification — Mobile

- [x] 9.1 Resize browser to mobile width (< 768px) — verify sidebar is hidden and bottom nav is visible
- [x] 9.2 Tap "Menu" button — verify off-canvas drawer opens with full navigation
- [x] 9.3 In drawer, tap "Settings" — verify it expands inline (mobile uses expanded mode, not collapsed icon mode)
- [x] 9.4 Verify `isMobile` check prevents DropdownMenu from rendering on mobile (the `v-if="state === 'collapsed' && !isMobile"` condition)

## 10. Automated E2E Tests — Sidebar Collapse/Expand

**Important**: These tests were added to `setup-e2e-testing` change and verify the collapsed sidebar functionality implemented in this change.

- [x] 10.1 Run admin sidebar collapse tests:
  ```bash
  npx playwright test --config=tests/e2e/playwright.config.ts --project=admin tests/e2e/tests/admin/sidebar-collapse.spec.ts
  ```
  - All 7 tests pass:
    - ✅ sidebar starts expanded by default
    - ✅ clicking sidebar rail collapses sidebar
    - ✅ collapsed sidebar shows tooltip on Dashboard hover
    - ✅ collapsed sidebar Dashboard click stays on admin
    - ✅ collapsed sidebar Site link navigates to home
    - ✅ clicking rail expands sidebar
    - ✅ sidebar state persists after reload

- [x] 10.2 Run superadmin sidebar collapse tests:
  ```bash
  npx playwright test --config=tests/e2e/playwright.config.ts --project=superadmin tests/e2e/tests/superadmin/sidebar-collapse.spec.ts
  ```
  - All 4 tests pass:
    - ✅ superadmin collapsed sidebar shows nav tooltips (Dashboard tooltip + Settings dropdown opens)
    - ✅ superadmin collapsed Settings dropdown shows Users and Roles
    - ✅ superadmin can navigate to Users from collapsed dropdown
    - ✅ superadmin can navigate to Roles from collapsed dropdown

- [ ] 10.3 Run complete E2E suite to verify no regressions:
  ```bash
  npm run test:e2e
  ```
  - Expected: All 75+ tests pass (60 original + 15 new sidebar tests)

## 11. Code Quality & Final Checks

- [x] 11.1 Run Pint: `vendor/bin/pint --format agent` — fix any PHP formatting (none expected, but verify)
- [x] 11.2 Run TypeScript check: `npx vue-tsc --noEmit` — no type errors ✓
- [x] 11.3 Run build: `npm run build` — successful production build ✓
- [ ] 11.4 Verify no console errors in browser DevTools during manual testing
- [x] 11.5 Run existing Pest tests: `composer run test` — all tests pass (no backend changes, but verify)
