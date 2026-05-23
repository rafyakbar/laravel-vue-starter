## 1. Locale Files

- [x] 1.1 Create `resources/app/locales/en.ts` — nested object using `as const`, with structure:
  - `nav`: `site, dashboard, settings, users, roles, profile, signOut, menu`
  - `preferences`: `title`, `theme: { label, light, dark, system }`, `language: { label, en, id }`
  - Export `Messages` type via `typeof import('./en').default`
- [x] 1.2 Create `resources/app/locales/id.ts` — same shape as `en.ts`, Indonesian values:
  - `nav.site` = "Situs", `dashboard` = "Dasbor", `settings` = "Pengaturan", `users` = "Pengguna", `roles` = "Peran & Izin", `profile` = "Profil", `signOut` = "Keluar", `menu` = "Menu"
  - `preferences.title` = "Preferensi", `theme.label` = "Tema", `light` = "Terang", `dark` = "Gelap", `system` = "Sistem"
  - `language.label` = "Bahasa", `en` = "Inggris", `id` = "Indonesia"
- [x] 1.3 Type-check `id.ts` against `Messages` type — `import type { Messages } from './en'` then `const messages: Messages = {...}` to ensure shape match
- [x] 1.4 Run `npm run build` — confirm no type errors

## 2. Preferences Store

- [x] 2.1 Create `resources/app/stores/preferences.ts` — define types `Theme = 'light' | 'dark' | 'system'` and `Locale = 'en' | 'id'` (export both)
- [x] 2.2 Implement `applyTheme(theme: Theme)` function (module-level, outside store):
  - Maintain `mediaQueryListener` reference outside the function
  - Always remove existing listener before applying new theme
  - If theme is `system`: read `matchMedia('(prefers-color-scheme: dark)').matches`, toggle `dark` class, attach `change` listener
  - If theme is `light` or `dark`: directly toggle `dark` class
- [x] 2.3 Implement `usePreferencesStore` (Pinia setup store):
  - `theme` ref initialized from `localStorage.getItem('theme')` (cast to `Theme`, fallback `'system'`)
  - `locale` ref initialized from `localStorage.getItem('locale')` (cast to `Locale`, fallback `'en'`)
  - `watch(theme)`: persist to localStorage + call `applyTheme(val)`
  - `watch(locale)`: persist to localStorage
  - Return `{ theme, locale }`
- [x] 2.4 Run `npm run build` — confirm no type errors

## 3. i18n Composable

- [x] 3.1 Create `resources/app/composables/useI18n.ts` — implement type-safe `t()` function:
  - Import `en` and `id` locales, build `messages = { en, id }` const
  - Define recursive `Path<T>` type that produces dot-notation keys (e.g., `'nav.site' | 'preferences.theme.label'`)
  - Export `LocaleKey = Path<typeof en>` type
  - `useI18n()` returns `{ t }` where `t(key: LocaleKey): string` resolves dot-notation against the active locale
  - Fallback: if key not found, return the key string itself
- [x] 3.2 Verify reactivity: `t()` reads `prefs.locale` on each call — components using `t()` in templates re-render when locale changes (Vue's reactivity system handles this since `prefs.locale` is reactive)
- [x] 3.3 Run `npm run build` — confirm no type errors

## 4. Apply Theme on App Load

- [x] 4.1 Update `resources/app/main.ts` — BEFORE `app.use(pinia)`:
  - Read theme from `localStorage.getItem('theme')` directly (Pinia not yet active)
  - Apply initial `dark` class to `document.documentElement` based on theme value (or system preference if theme is `'system'` or null)
- [x] 4.2 After `app.use(pinia)` and before `app.mount()`, instantiate the preferences store (`usePreferencesStore()`) so its `watch` handlers register and listeners attach for system mode
- [x] 4.3 Run `npm run build` — confirm no type errors

## 5. Preferences Menu Component

- [x] 5.1 Create `resources/app/components/admin/AdminPreferencesMenu.vue`:
  - Imports: `DropdownMenu`, `DropdownMenuTrigger`, `DropdownMenuContent`, `DropdownMenuLabel`, `DropdownMenuRadioGroup`, `DropdownMenuRadioItem`, `DropdownMenuSeparator`
  - Imports icons: `SunMoon`, `Sun`, `Moon`, `Monitor`
  - Imports `usePreferencesStore`, `useI18n`
  - Trigger: ghost-style button with `SunMoon` icon
- [x] 5.2 Build dropdown content:
  - `DropdownMenuLabel` with `{{ t('preferences.theme.label') }}`
  - `DropdownMenuRadioGroup v-model="prefs.theme"`:
    - `DropdownMenuRadioItem value="light"`: Sun icon + `{{ t('preferences.theme.light') }}`
    - `DropdownMenuRadioItem value="dark"`: Moon icon + `{{ t('preferences.theme.dark') }}`
    - `DropdownMenuRadioItem value="system"`: Monitor icon + `{{ t('preferences.theme.system') }}`
  - `DropdownMenuSeparator`
  - `DropdownMenuLabel` with `{{ t('preferences.language.label') }}`
  - `DropdownMenuRadioGroup v-model="prefs.locale"`:
    - `DropdownMenuRadioItem value="en"`: `{{ t('preferences.language.en') }}`
    - `DropdownMenuRadioItem value="id"`: `{{ t('preferences.language.id') }}`
- [x] 5.3 Update `resources/app/components/admin/AdminHeader.vue` — import and add `<AdminPreferencesMenu />` between `Breadcrumb` and `AdminUserMenu`
- [x] 5.4 Run `npm run build` — confirm no type errors

## 6. Sidebar Updates

- [x] 6.1 Update `resources/app/components/admin/AdminSidebar.vue` — add `useI18n` import and replace hardcoded labels:
  - `SidebarGroupLabel`: `{{ t('nav.menu') }}` (or keep "Navigation" if preferred)
  - Dashboard label → `{{ t('nav.dashboard') }}`
  - Settings group label → `{{ t('nav.settings') }}`
  - Users sub-item label → `{{ t('nav.users') }}`
  - Roles sub-item label → `{{ t('nav.roles') }}`
  - Profile item in user dropdown → `{{ t('nav.profile') }}`
  - Sign Out item in user dropdown → `{{ t('nav.signOut') }}`
- [x] 6.2 Add second `SidebarGroup` (no label) below the main nav group, before `SidebarFooter`:
  - Single `SidebarMenuItem` with `SidebarMenuButton :tooltip="t('nav.site')"` as-child router-link to `{ name: 'home' }`, Globe icon + `{{ t('nav.site') }}`
- [x] 6.3 Add `LogOut` icon import and add it to the Sign Out `DropdownMenuItem` (icon before label, like the Profile item with User icon)
- [x] 6.4 Run `npm run build` — confirm no type errors

## 7. Header User Menu Update

- [x] 7.1 Update `resources/app/components/admin/AdminUserMenu.vue`:
  - Add `useI18n` import, replace "Profile" with `{{ t('nav.profile') }}`, "Sign Out" with `{{ t('nav.signOut') }}`
  - Import `LogOut` icon, add it to the Sign Out `DropdownMenuItem` (mirror the Profile item which already has User icon)
- [x] 7.2 Run `npm run build` — confirm no type errors

## 8. Bottom Nav Restructure

- [x] 8.1 Update `resources/app/components/admin/AdminBottomNav.vue` — replace icons import: remove `Home, Settings`, add `Globe, User, LogOut`
- [x] 8.2 Replace router-link items with new structure (4 items total, equal `flex-1`):
  - **Site**: router-link to `{ name: 'home' }`, Globe icon, `{{ t('nav.site') }}`, active when `route.name === 'home'`
  - **Dashboard**: router-link to `{ name: 'admin.dashboard' }`, LayoutDashboard icon, `{{ t('nav.dashboard') }}`, active when `route.name === 'admin.dashboard'`
  - **Menu**: button calling `setOpenMobile(true)`, Menu icon, `{{ t('nav.menu') }}`, no active state (always inactive style)
  - **Profile**: `DropdownMenu` triggered by button with User icon + `{{ t('nav.profile') }}`, active when `route.name === 'admin.profile'`
- [x] 8.3 Implement Profile DropdownMenu content:
  - Set `<DropdownMenuContent side="top" align="end">` so popup opens upward from the bottom nav
  - `DropdownMenuItem as-child`: router-link to `{ name: 'admin.profile' }` with User icon + `{{ t('nav.profile') }}`
  - `DropdownMenuSeparator`
  - `DropdownMenuItem` with click handler calling `authStore.logout()`, LogOut icon + `{{ t('nav.signOut') }}`
- [x] 8.4 Run `npm run build` — confirm no type errors

## 9. Verification

- [x] 9.1 Run `npm run build` — full build passes with zero errors
- [x] 9.2 Run `npx vue-tsc --noEmit` — TypeScript checks pass (especially for type-safe `t()` keys)
- [x] 9.3 Run `php artisan test --compact` — backend tests still pass (no regressions)
- [x] 9.4 Manual: open preferences menu in header → select Dark → UI switches to dark mode
- [x] 9.5 Manual: select Light → UI switches to light mode
- [x] 9.6 Manual: select System → UI follows OS preference (verify by changing OS theme, UI updates without page reload)
- [x] 9.7 Manual: refresh page after selecting dark → no flash of light mode (theme applied before mount)
- [ ] 9.8 ~~Manual: switch to Indonesia → all nav labels (sidebar, bottom nav, dropdowns) change to Indonesian immediately~~ **(superseded by section 10 — translation scope expanded)**
- [x] 9.9 Manual: refresh page → locale is restored from localStorage
- [x] 9.10 Manual: desktop sidebar shows "Site" item below main nav group, above user footer
- [x] 9.11 Manual: collapse sidebar → "Site" Globe icon visible with tooltip "Site"
- [x] 9.12 Manual: mobile bottom nav shows Site, Dashboard, Menu, Profile (in that order)
- [x] 9.13 Manual: tap Profile in bottom nav → popup opens upward with Profile link and Sign Out (LogOut icon)
- [x] 9.14 Manual: Sign Out in sidebar footer dropdown shows LogOut icon
- [x] 9.15 Manual: Sign Out in header user menu shows LogOut icon
- [x] 9.16 Manual: navigate to admin.profile → "Profile" item in bottom nav shows active highlight

## 10. Expand Translation Scope (correction)

Initial implementation only translated nav labels and preferences menu. All page content remained English. Expand i18n to cover all admin pages and the public home page.

- [x] 10.1 Extend `resources/app/locales/en.ts` with new sections:
  - `home`: `title`, `subtitle`, `signIn`, `signUp`, `goToAdmin`
  - `pages`: `dashboard: { title, description, welcome (with {name} placeholder), loggedInAs (with {email} placeholder) }`, `users: { title, description, comingSoon, comingSoonText }`, `roles: { title, description, comingSoon, comingSoonText }`, `profile: { title, description, comingSoon, comingSoonText }`
  - `breadcrumb`: keys for each route title (dashboard, users, roles, profile)
- [x] 10.2 Mirror new keys in `resources/app/locales/id.ts` with Indonesian translations
- [x] 10.3 Update `t()` function to support simple `{placeholder}` interpolation: accept optional second argument `params: Record<string, string | number>`
- [x] 10.4 Update `resources/app/views/pages/HomePage.vue` — use `t()` for title, subtitle, button labels
- [x] 10.5 Update `resources/app/views/pages/admin/DashboardPage.vue` — use `t()` for BasicPage title/description, welcome text with name and email interpolation
- [x] 10.6 Update `resources/app/views/pages/admin/UsersPage.vue` — use `t()` for title, description, "Coming Soon" badge, descriptive text
- [x] 10.7 Update `resources/app/views/pages/admin/RolesPage.vue` — use `t()` for title, description, "Coming Soon" badge, descriptive text
- [x] 10.8 Update `resources/app/views/pages/admin/ProfilePage.vue` — use `t()` for title, description, "Coming Soon" badge, descriptive text
- [x] 10.9 Update `resources/app/components/admin/AdminHeader.vue` — breadcrumb reads from `route.meta.titleKey` (i18n key) instead of `route.meta.title`
- [x] 10.10 Update `resources/app/router/index.ts` — replace `meta.title` with `meta.titleKey` for admin routes (e.g., `'breadcrumb.dashboard'`)
- [x] 10.11 Run `npm run build` — confirm no type errors
- [x] 10.12 Manual: switch to Indonesia → all page content (titles, descriptions, button labels, breadcrumb) changes to Indonesian

## 11. Site Item Position Fix

Currently the "Site" SidebarGroup renders directly below the main nav group. It should be pinned to the bottom of `SidebarContent`, just above the footer.

- [x] 11.1 Update `resources/app/components/admin/AdminSidebar.vue` — add `mt-auto` class to the Site `SidebarGroup` so it pushes to the bottom of the flex container (`SidebarContent` is flex column)
- [x] 11.2 Run `npm run build` — confirm no type errors
- [x] 11.3 Manual: desktop sidebar — "Site" item is at the bottom of the content area, just above the user footer (separated by available space, not directly below Settings)

## 12. Split Theme and Language Menus

The combined `AdminPreferencesMenu` mixes theme and language. Per UX feedback, split into two separate dropdown buttons in the header.

- [x] 12.1 Create `resources/app/components/admin/AdminThemeMenu.vue` — DropdownMenu triggered by `SunMoon` icon button, contains only theme RadioGroup (Light/Dark/System with Sun/Moon/Monitor icons)
- [x] 12.2 Create `resources/app/components/admin/AdminLanguageMenu.vue` — DropdownMenu triggered by `Languages` icon (lucide-vue-next) button, contains only language RadioGroup (English/Indonesia)
- [x] 12.3 Delete `resources/app/components/admin/AdminPreferencesMenu.vue`
- [x] 12.4 Update `resources/app/components/admin/AdminHeader.vue` — replace `<AdminPreferencesMenu />` with `<AdminThemeMenu />` and `<AdminLanguageMenu />` side by side (theme first, then language, before `AdminUserMenu`)
- [x] 12.5 Run `npm run build` — confirm no type errors
- [x] 12.6 Manual: header shows two separate icon buttons — SunMoon (theme) and Languages (language) — each with their own dropdown
- [x] 12.7 Manual: theme dropdown shows only theme options; language dropdown shows only language options
