## Context

The admin layout is complete with sidebar, header, and mobile bottom nav. The app uses TailwindCSS v4 with CSS variables for theming. The existing `DefaultLayout.vue` uses `bg-[var(--background)]` — dark mode needs to be applied at the `<html>` element level via the `dark` class (Tailwind's class strategy). No i18n library is installed; the project uses TypeScript throughout.

## Goals / Non-Goals

**Goals:**
- Theme switching: light / dark / system (OS preference via `prefers-color-scheme`)
- Language switching: English (en) / Indonesian (id)
- Preferences persisted to `localStorage`, restored on app load
- Header preferences dropdown (theme + language controls)
- Sidebar "Site" item (Globe icon, link to `/`, at bottom of nav before footer)
- Bottom nav restructured: Site | Dashboard | Menu | Profile
- Profile item in bottom nav opens a popup (DropdownMenu) with Profile link + Sign Out
- LogOut icon on all Sign Out actions

**Non-Goals:**
- Server-side locale (all translations client-side only)
- Full i18n library (vue-i18n, etc.) — overkill for two languages
- Per-user preferences stored in database
- RTL language support
- More than two languages

## Decisions

### 1. Theme: Tailwind CSS class strategy on `<html>`

**Choice:** Toggle `class="dark"` on `document.documentElement`. TailwindCSS v4 uses `@custom-variant dark (&:is(.dark *))` which is already configured in `app.css`.

**System mode listener:** Use `window.matchMedia('(prefers-color-scheme: dark)')` with `addEventListener('change', ...)`. The listener is attached only when theme is `system` and removed when switching to `light` or `dark` to prevent memory leaks.

**Persistence:** `localStorage.setItem('theme', 'light' | 'dark' | 'system')`.

**Apply on load:** In `main.ts`, before mounting the app, read `localStorage` and apply the class to prevent flash of wrong theme.

```typescript
// stores/preferences.ts — listener management
let mediaQueryListener: ((e: MediaQueryListEvent) => void) | null = null
const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

function applyTheme(theme: Theme) {
  // Remove existing listener
  if (mediaQueryListener) {
    mediaQuery.removeEventListener('change', mediaQueryListener)
    mediaQueryListener = null
  }

  if (theme === 'system') {
    const apply = (matches: boolean) => {
      document.documentElement.classList.toggle('dark', matches)
    }
    apply(mediaQuery.matches)
    mediaQueryListener = (e) => apply(e.matches)
    mediaQuery.addEventListener('change', mediaQueryListener)
  } else {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }
}
```

### 2. i18n: Composable with typed locale objects (no library)

**Choice:** A `useI18n()` composable that reads from `usePreferencesStore().locale` and returns a reactive `t()` function. Locale strings defined as nested TypeScript objects with dot-notation key resolution.

**Rationale:** Only two languages, limited strings (nav labels, UI text). A full i18n library adds ~50KB+ for marginal benefit. TypeScript objects give autocomplete and type safety.

**File structure:**
```
resources/app/locales/
├── types.ts # LocaleKey type, Locale messages shape
├── en.ts    # English strings (default — defines the schema)
└── id.ts    # Indonesian strings (must match en.ts shape)
```

**Locale shape (nested):**
```typescript
// locales/en.ts
export default {
  nav: {
    site: 'Site',
    dashboard: 'Dashboard',
    settings: 'Settings',
    users: 'Users',
    roles: 'Roles & Permissions',
    profile: 'Profile',
    signOut: 'Sign Out',
    menu: 'Menu',
  },
  preferences: {
    title: 'Preferences',
    theme: { label: 'Theme', light: 'Light', dark: 'Dark', system: 'System' },
    language: { label: 'Language', en: 'English', id: 'Indonesia' },
  },
} as const

export type Messages = typeof import('./en').default
```

**Composable signature:**
```typescript
// composables/useI18n.ts
import { computed, type ComputedRef } from 'vue'
import { usePreferencesStore } from '@/stores/preferences'
import en from '@/locales/en'
import id from '@/locales/id'

const messages = { en, id }

type Path<T> = T extends object
  ? { [K in keyof T]: K extends string ? K | `${K}.${Path<T[K]> & string}` : never }[keyof T]
  : never

type LocaleKey = Path<typeof en>

export function useI18n() {
  const prefs = usePreferencesStore()

  const t = (key: LocaleKey, params?: Record<string, string | number>): string => {
    const dict = messages[prefs.locale]
    let resolved = key.split('.').reduce<unknown>((obj, k) => (obj as Record<string, unknown>)?.[k], dict) as string ?? key
    // Simple {placeholder} interpolation
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        resolved = resolved.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v))
      }
    }
    return resolved
  }

  return { t }
}
```

The `t()` function reads `prefs.locale` reactively — when locale changes, components using `t()` in templates re-render automatically because the function call happens during the render. For computed scenarios, wrap in `computed(() => t('key'))`.

**Placeholder interpolation:** `t('pages.dashboard.welcome', { name: 'Alice' })` resolves `'Hello, {name}!'` → `'Hello, Alice!'`. Used for dynamic content like welcome messages with user data.

**Fallback strategy:** If a key is missing in the active locale, return the key itself as fallback (developer-visible signal). English (`en.ts`) is the source of truth — `id.ts` must match its shape.

**Translation scope:** Navigation labels, preferences menu labels, all admin page content (titles, descriptions, placeholders, "Coming Soon" text), public home page content, breadcrumb. Auth pages remain English for MVP (separate translation expansion).

### 3. Preferences store with localStorage persistence

**Choice:** Pinia setup store `usePreferencesStore` with `theme` and `locale` refs, persisted to `localStorage` via watchers.

```typescript
export const usePreferencesStore = defineStore('preferences', () => {
  const theme = ref<'light' | 'dark' | 'system'>(
    (localStorage.getItem('theme') as Theme) ?? 'system'
  )
  const locale = ref<'en' | 'id'>(
    (localStorage.getItem('locale') as Locale) ?? 'en'
  )

  watch(theme, (val) => {
    localStorage.setItem('theme', val)
    applyTheme(val)
  })

  watch(locale, (val) => {
    localStorage.setItem('locale', val)
  })

  return { theme, locale }
})
```

### 4. Theme and Language menus (separate dropdowns)

**Choice:** Two separate `DropdownMenu` components in the header — `AdminThemeMenu` and `AdminLanguageMenu` — each with their own icon trigger button. Reasoning: theme and language are independent concerns; mixing them in one menu makes the menu cluttered and adds an extra click for users who only want to change one.

**AdminThemeMenu:**
- Trigger: `SunMoon` icon button
- Content: `DropdownMenuRadioGroup` bound to `prefs.theme` with three options (Light/Dark/System) using Sun/Moon/Monitor icons

**AdminLanguageMenu:**
- Trigger: `Languages` icon (lucide-vue-next) button
- Content: `DropdownMenuRadioGroup` bound to `prefs.locale` with two options (English/Indonesia)

**Active state:** `DropdownMenuRadioItem` from shadcn-vue has built-in checkmark indicator when its value matches the radio group's `model-value`. No custom code needed.

Placed in `AdminHeader.vue` between the breadcrumb and `AdminUserMenu`, in order: theme → language → user menu.

### 5. Sidebar "Site" item

**Choice:** Render the "Site" item directly in `AdminSidebar.vue` as a separate `SidebarGroup` (no group label) with `mt-auto` class so it pushes to the BOTTOM of `SidebarContent`, just above `SidebarFooter` (user menu). It is NOT added to `nav-items.ts` because it has different semantics (external link, single item).

**Rationale:** Separating it from the main nav group + pinning to bottom makes it visually distinct — it's an "exit admin" action, positioned where users naturally look for "leave/back" actions (bottom of the sidebar, near user controls).

**Tooltip in icon-only mode:** shadcn-vue's `SidebarMenuButton` accepts a `tooltip` prop that auto-shows when sidebar is collapsed. Use `:tooltip="t('nav.site')"`.

```vue
<!-- AdminSidebar.vue structure -->
<SidebarContent>
  <SidebarGroup>
    <SidebarGroupLabel>{{ t('nav.menu') }}</SidebarGroupLabel>
    <!-- Dashboard, Settings group -->
  </SidebarGroup>

  <!-- Pushed to bottom via mt-auto -->
  <SidebarGroup class="mt-auto">
    <SidebarGroupContent>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton :tooltip="t('nav.site')" as-child>
            <router-link :to="{ name: 'home' }">
              <Globe />
              <span>{{ t('nav.site') }}</span>
            </router-link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroupContent>
  </SidebarGroup>
</SidebarContent>
```

### 6. Bottom nav restructure

**New layout:** `[Site | Dashboard | Menu | Profile]`

- **Site** (Globe icon) → `router-link` to `{ name: 'home' }`, active when route name is `home`
- **Dashboard** (LayoutDashboard icon) → `router-link` to `{ name: 'admin.dashboard' }`, active when route name is `admin.dashboard`
- **Menu** (Menu icon) → button calling `useSidebar().setOpenMobile(true)`. No active state (it's an action, not a route).
- **Profile** (User icon) → `DropdownMenu` with `side="top"` (popup opens upward from bottom nav), items: Profile (router-link to `admin.profile`, with User icon) + Sign Out (calls `authStore.logout()`, with LogOut icon). Active when route name is `admin.profile`.

**Visual structure:** Each item is a `flex-1 flex-col` button/link with icon (size-5) above label (text-xs). Active state uses `text-primary`, inactive uses `text-muted-foreground`.

The "Profile" item replaces the old "Settings" item and the separate hamburger button. The hamburger functionality moves to the "Menu" position.

### 7. LogOut icon on Sign Out

**Choice:** Add `LogOut` from `lucide-vue-next` to all Sign Out `DropdownMenuItem` elements:
- `AdminSidebar.vue` footer dropdown
- `AdminUserMenu.vue` header dropdown
- New bottom nav Profile popup

## New File Map

```
resources/app/
├── stores/
│   └── preferences.ts               # usePreferencesStore (theme + locale)
├── composables/
│   └── useI18n.ts                   # t() composable with placeholder interpolation
├── locales/
│   ├── en.ts                        # English locale strings (source of truth)
│   └── id.ts                        # Indonesian locale strings
└── components/admin/
    ├── AdminThemeMenu.vue           # Header dropdown for theme (SunMoon trigger)
    └── AdminLanguageMenu.vue        # Header dropdown for language (Languages trigger)
```

**Modified files:**
- `resources/app/main.ts` — apply saved theme before mount
- `resources/app/router/index.ts` — replace `meta.title` with `meta.titleKey` for breadcrumb i18n
- `resources/app/components/admin/AdminHeader.vue` — read breadcrumb from `meta.titleKey`, replace AdminPreferencesMenu with separate Theme + Language menus
- `resources/app/components/admin/AdminSidebar.vue` — Site item with `mt-auto`, i18n labels, LogOut icon
- `resources/app/components/admin/AdminUserMenu.vue` — i18n labels, LogOut icon
- `resources/app/components/admin/AdminBottomNav.vue` — restructure (Site/Dashboard/Menu/Profile)
- `resources/app/components/admin/nav-items.ts` — add `i18nKey` field
- `resources/app/views/pages/HomePage.vue` — i18n for all text
- `resources/app/views/pages/admin/DashboardPage.vue` — i18n for content
- `resources/app/views/pages/admin/UsersPage.vue` — i18n for content
- `resources/app/views/pages/admin/RolesPage.vue` — i18n for content
- `resources/app/views/pages/admin/ProfilePage.vue` — i18n for content

## Risks / Trade-offs

- **[Trade-off] Minimal i18n scope** — Only nav labels and preferences UI are translated. Other admin text (page titles, descriptions, badge text) remains English. This is intentional for MVP; expand locale files as needed.
- **[Trade-off] No server-side locale** — Language preference is client-only. If the backend sends localized content in the future, this needs to be extended.
- **[Risk] Theme flash on page load** — If theme is applied after Vue mounts, there's a brief flash. Mitigation: apply theme in `main.ts` before `app.use(router)` and `app.mount()`.
- **[Trade-off] DropdownMenu in bottom nav Profile** — On mobile, a DropdownMenu popup may feel slightly off compared to a Sheet. Acceptable for MVP; can upgrade to Sheet later.
