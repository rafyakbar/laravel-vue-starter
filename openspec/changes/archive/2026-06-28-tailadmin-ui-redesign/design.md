## Context

This project is a Laravel + Vue 3 SPA admin starter using shadcn-vue as its UI component system. The project has a UI guide (`docs/project/references/010_ui_guide.md`) specifying a **TailAdmin** visual aesthetic — indigo brand color (`#465fff`), Outfit font, gray-50 page background, white cards with gray-200 borders, and a white/black sidebar. The current implementation uses default shadcn-vue tokens (near-black primary, Geist font), which diverges significantly from the documented UI guide.

The strategy is **Opsi A**: retain shadcn-vue primitives and component logic entirely; change only the design token values and class overrides on specific components. This is the lowest-risk approach — no component rewrites, no structural changes, no new dependencies.

**Current state of affected files:**
- `app.css` — Uses shadcn-vue's default neutral/grayscale tokens, Geist Variable font
- `AdminSidebar.vue` — Full shadcn-vue Sidebar with permission-based nav, collapsible groups, dropdown on icon-collapse; needs nav item color overrides only
- `AdminHeader.vue` — `h-14`, `bg-background`; needs `h-16` and TailAdmin border style
- `AdminLayout.vue` — `gap-4 p-4 pb-20`; needs container max-width alignment
- `BasicPage.vue` — `text-2xl font-bold tracking-tight`; needs TailAdmin heading style
- Auth pages — All use `Card` centered on `DefaultLayout`; need split 50/50 layout

## Goals / Non-Goals

**Goals:**
- Remap shadcn-vue CSS vars to TailAdmin values (colors, radius, font)
- Introduce full brand/semantic/shadow token palette from `010_ui_guide.md §3`
- Sidebar visually matches TailAdmin: `bg-white dark:bg-black`, active items `brand-50/brand-600`, inactive items `gray-700/hover:gray-100`
- Auth pages use TailAdmin split layout (form left, brand panel right, hidden on mobile)
- Dark/Light/System theme switching remains fully functional — no logic changes
- All existing shadcn-vue component logic preserved (collapsible sidebar, permission nav, etc.)

**Non-Goals:**
- Replacing or rewriting shadcn-vue component primitives
- Changing auth logic, stores, API services, or routes
- Adding new npm/composer packages
- Changing backend code
- Changing any page that is not listed in the proposal's Impact section

## Decisions

### Decision 1: CSS Vars remapping over component class changes

**Choice:** Remap `--primary`, `--background`, `--card`, `--border`, etc. at the CSS var level in `app.css`.

**Why:** shadcn-vue components all reference these CSS vars internally. Changing the vars propagates the new visual across every shadcn-vue component simultaneously — Button, Input, Card, Dialog, Badge — without touching a single component file.

**Alternative considered:** Add TailAdmin classes directly to each component. Rejected: too many files, hard to maintain, and breaks the shadcn-vue theming contract.

---

### Decision 2: Sidebar nav item colors via CSS class overrides, not CSS vars

**Choice:** Override active/inactive nav item appearance by adding explicit Tailwind classes directly in `AdminSidebar.vue` (e.g., replacing `is-active` derived colors with `bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-500`).

**Why:** The `--sidebar-accent` CSS var controls the hover/active background for `SidebarMenuButton`, but TailAdmin uses distinct class combos for active state that include text color overrides. Relying solely on vars would require overly complex var layering. Direct class overrides on the active button are explicit and readable.

**Alternative considered:** Override `--sidebar-accent` and `--sidebar-accent-foreground` only. Rejected: doesn't cover the full TailAdmin active item pattern (bg + text both change, and dark mode values differ significantly).

---

### Decision 3: Auth split layout as inline template, not a new Layout component

**Choice:** Implement the TailAdmin split layout directly inside each auth page component, not as a new `AuthSplitLayout.vue`.

**Why:** Each auth page has minor differences in the brand panel copy (headline, tagline). A shared layout would need slot-heavy props. The auth pages are small (100–150 lines), so duplication is acceptable. A new layout file would also require router changes.

**Alternative considered:** Create `AuthSplitLayout.vue`. Rejected: adds complexity and router coupling for minimal gain.

---

### Decision 4: Outfit font loaded via Google Fonts, not local

**Choice:** Replace the Geist Google Fonts `<link>` in `app.blade.php` with Outfit's Google Fonts link. Keep `@import url(...)` in `app.css` removed (blade is the canonical font loader).

**Why:** Google Fonts is already the mechanism used (Geist is loaded the same way). Switching to Outfit requires only changing the URL.

**Alternative considered:** Self-host Outfit. Rejected: out of scope; the project already uses Google Fonts for Geist.

---

### Decision 5: `--primary` → `#465fff` (brand-500)

**Choice:** Map shadcn-vue's `--primary` CSS var to TailAdmin's `brand-500` (`#465fff`).

**Why:** shadcn-vue uses `--primary` for all primary buttons, focus rings, active states, and links. This single change propagates the TailAdmin brand color throughout all shadcn-vue components automatically.

## Risks / Trade-offs

- **Risk: shadcn-vue component contrast ratios** — Some shadcn-vue components assume a neutral primary. With `#465fff` as primary, ensure text on primary buttons (`--primary-foreground: #ffffff`) maintains WCAG AA contrast.
  → **Mitigation:** White on `#465fff` passes WCAG AA (contrast ratio ~4.6:1).

- **Risk: Sidebar CSS vars vs. direct class collision** — `SidebarMenuButton` applies `is-active` styles via `data-active` attribute tied to `--sidebar-accent`. Directly adding Tailwind classes for active state in the template may conflict.
  → **Mitigation:** Also remap `--sidebar-accent` and `--sidebar-accent-foreground` to brand values so both paths are consistent.

- **Risk: Auth page split layout on very small screens** — The right brand panel is hidden on mobile (`hidden lg:flex`), leaving only the form. On tablet breakpoints, the split may look cramped.
  → **Mitigation:** Follow TailAdmin's exact breakpoint (`lg:w-1/2`) and test at `md` breakpoint. The form column is full-width below `lg`.

- **Trade-off: No centralized AuthSplitLayout** — The split layout HTML is duplicated across 5 auth pages. If the brand panel copy needs a global change in the future, it must be updated in 5 places.
  → **Accepted:** Auth pages change infrequently. The duplication is isolated and explicit.

## Migration Plan

1. All changes are frontend-only — no database, API, or backend impact.
2. Changes can be deployed by running `npm run build` after all files are updated.
3. No data migration required.
4. **Rollback:** Git revert the frontend file changes. No backend state is affected.

## Open Questions

*(none — all decisions have been made during exploration)*
