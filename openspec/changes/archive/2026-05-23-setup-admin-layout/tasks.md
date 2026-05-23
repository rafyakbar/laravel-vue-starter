## 1. shadcn-vue Components

- [x] 1.1 Fix `components.json` — add `aliases.composables: "@/composables"` (required by shadcn-vue CLI v2.7)
- [x] 1.2 Fix `tsconfig.json` root — add `compilerOptions.paths` so CLI can resolve `@/*` alias
- [x] 1.3 Run `npx shadcn-vue@latest init -d` — regenerate `components.json` with `resolvedPaths`
- [x] 1.4 Add sidebar component — `npx shadcn-vue@latest add sidebar --overwrite`
- [x] 1.5 Add remaining components — `npx shadcn-vue@latest add collapsible sheet dropdown-menu separator breadcrumb avatar tooltip badge --overwrite`
- [x] 1.6 Verify all components generated at `resources/app/components/ui/` (sidebar/, collapsible/, sheet/, dropdown-menu/, separator/, breadcrumb/, avatar/, tooltip/, badge/)
- [x] 1.7 Run `npm run build` — confirm zero type errors

## 2. Navigation Config & Types

- [x] 2.1 Create `resources/app/components/admin/nav-items.ts` — define `NavItem` interface and export navigation config array:
  - Dashboard (LayoutDashboard icon, route `admin.dashboard`)
  - Settings group (Settings icon, collapsible, children:)
    - Users (Users icon, route `admin.users`, badge "Coming Soon")
    - Roles & Permissions (Shield icon, route `admin.roles`, badge "Coming Soon")
- [x] 2.2 Run `npm run build` — confirm no type errors

## 3. Admin Layout Shell

- [x] 3.1 Create `resources/app/views/layouts/AdminLayout.vue` — `SidebarProvider` (storage-key="admin-sidebar") wrapping `AdminSidebar` + `SidebarInset` (header + router-view + bottom padding) + `AdminBottomNav`
- [x] 3.2 Run `npm run build` — confirm no type errors

## 4. Sidebar Component

- [x] 4.1 Create `resources/app/components/admin/AdminSidebar.vue` — `Sidebar` with `collapsible="icon"`:
  - `SidebarHeader`: App logo/name with router-link to dashboard
  - `SidebarContent`: renders nav items from nav-items.ts
  - `SidebarFooter`: user avatar + name via `DropdownMenu` (Profile link → `admin.profile`, Sign Out)
  - `SidebarRail`: hover-to-expand on collapsed state
- [x] 4.2 Top-level nav items: `SidebarMenuButton` with `router-link`, `isActive` bound to `route.name`
- [x] 4.3 Collapsible Settings group: `Collapsible` + `CollapsibleTrigger` on group label, children via `SidebarMenuSub` / `SidebarMenuSubButton`
- [x] 4.4 Sidebar footer: avatar initials, user name/email, DropdownMenu with Profile (router-link to `admin.profile`) and Sign Out
- [x] 4.5 Run `npm run build` — confirm no type errors

## 5. Header Component

- [x] 5.1 Create `resources/app/components/admin/AdminHeader.vue` — sticky header (`sticky top-0 z-10`) with:
  - `SidebarTrigger` (toggles collapse on desktop, opens drawer on mobile)
  - `Separator` (vertical divider)
  - `Breadcrumb` reading `route.meta.title` as current page title
  - `AdminUserMenu` on the right
- [x] 5.2 Create `resources/app/components/admin/AdminUserMenu.vue` — `DropdownMenu` triggered by avatar + username, items: Profile (router-link to `admin.profile`), Sign Out (calls `authStore.logout()`)
- [x] 5.3 Run `npm run build` — confirm no type errors

## 6. Mobile Bottom Navigation

- [x] 6.1 Create `resources/app/components/admin/AdminBottomNav.vue` — `fixed bottom-0 inset-x-0 z-50 md:hidden` with 4 items:
  - Home (Home icon, router-link to `home` route `/`)
  - Dashboard (LayoutDashboard icon, router-link to `admin.dashboard`)
  - Settings (Settings icon, router-link to `admin.users`)
  - Menu (Menu icon, calls `useSidebar().setOpenMobile(true)`)
- [x] 6.2 Active state: current route item highlighted with `text-primary`
- [x] 6.3 `AdminBottomNav` added to `AdminLayout.vue` outside `SidebarInset`
- [x] 6.4 Main content area has `pb-20 md:pb-4` to prevent content hiding behind bottom nav
- [x] 6.5 Run `npm run build` — confirm no type errors

## 7. BasicPage Component

- [x] 7.1 Create `resources/app/components/shared/BasicPage.vue` — props: `title` (required), `description` (optional). Layout:
  - Header row: H1 title left, `#actions` slot right (flex justify-between)
  - Description paragraph (muted text)
  - Default slot for page content
- [x] 7.2 Run `npm run build` — confirm no type errors

## 8. Admin Pages

- [x] 8.1 Create `resources/app/views/pages/admin/DashboardPage.vue` — `BasicPage` title "Dashboard", welcome card with user name/email
- [x] 8.2 Create `resources/app/views/pages/admin/UsersPage.vue` — `BasicPage` title "Users", "Coming Soon" badge placeholder
- [x] 8.3 Create `resources/app/views/pages/admin/RolesPage.vue` — `BasicPage` title "Roles & Permissions", "Coming Soon" badge placeholder
- [x] 8.4 Create `resources/app/views/pages/admin/ProfilePage.vue` — `BasicPage` title "Profile", shows user avatar initials, name, email, roles badges, "Coming Soon" badge for edit
- [x] 8.5 Run `npm run build` — confirm no type errors

## 9. Router Update

- [x] 9.1 Update `resources/app/router/index.ts` — replace single `/admin` route with nested layout:
  - Parent: `path: '/admin'`, `component: AdminLayout`, `meta: { requiresAuth: true }`, `redirect: { name: 'admin.dashboard' }`
  - Children: `admin.dashboard` (path: ''), `admin.users` (path: 'users'), `admin.roles` (path: 'roles'), `admin.profile` (path: 'profile')
  - Each child has `meta: { requiresAuth: true, title: '<Page Title>' }`
- [x] 9.2 Update `resources/app/router/guards.ts` — guest redirect changed to `{ name: 'admin.dashboard' }`
- [x] 9.3 Update `resources/app/views/pages/auth/RegisterPage.vue` — redirect after register to `{ name: 'admin.dashboard' }`
- [x] 9.4 Update `resources/app/views/pages/HomePage.vue` — "Go to Admin" link to `{ name: 'admin.dashboard' }`
- [x] 9.5 Delete `resources/app/views/pages/admin/AdminPage.vue` (replaced by AdminLayout + DashboardPage)
- [x] 9.6 Fix `resources/app/stores/auth.ts` — logout redirect corrected to `{ name: 'home' }` (was incorrectly set to `admin.dashboard`)
- [x] 9.7 Run `npm run build` — confirm no type errors

## 10. Sidebar CSS Variables

- [x] 10.1 Sidebar CSS variables already added to `resources/app/assets/css/app.css` by the CLI during `init` — no manual action needed
- [x] 10.2 Run `npm run build` — confirm no type errors

## 11. Verification

- [x] 11.1 Run `npm run build` — full production build passes with zero errors
- [x] 11.2 Run `npx vue-tsc --noEmit` — TypeScript checks pass
- [x] 11.3 Run `php artisan test --compact` — backend tests 50/50 pass (no regressions)
- [x] 11.4 Manual: navigate to `/admin` → sidebar renders with Dashboard + Settings group
- [x] 11.5 Manual: click sidebar collapse toggle → sidebar collapses to icon-only mode
- [x] 11.6 Manual: click Settings group → expands to show Users and Roles sub-items
- [x] 11.7 Manual: navigate to Users → breadcrumb shows "Users", Badge "Coming Soon" visible
- [x] 11.8 Manual: resize to mobile (<768px) → sidebar disappears, bottom nav appears
- [x] 11.9 Manual: tap hamburger in bottom nav → off-canvas drawer opens with full sidebar content
- [x] 11.10 Manual: tap Home in bottom nav → navigates to `/`
- [x] 11.11 Manual: header is sticky on scroll
- [x] 11.12 Manual: click user menu in header → shows Profile and Sign Out options
- [x] 11.13 Manual: click Sign Out → redirects to home page
- [x] 11.14 Manual: click Profile in user menu → navigates to `/admin/profile`
