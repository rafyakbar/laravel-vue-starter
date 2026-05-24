## Context

The admin sidebar (`AdminSidebar.vue`) uses shadcn-vue's `Sidebar` component with `collapsible="icon"`. When collapsed, the sidebar narrows to `--sidebar-width-icon` (3rem/48px). The current implementation uses a single rendering strategy for all states:

- **Leaf items** (Dashboard, Site) → `SidebarMenuButton` wrapping `router-link`
- **Group items** (Settings) → `Collapsible` with `CollapsibleTrigger` + `CollapsibleContent`

The problem: shadcn-vue's sidebar CSS hides sub-menu items in collapsed mode (`group-data-[collapsible=icon]:hidden` on `SidebarMenuSub` and `SidebarMenuSubButton`). This means the `Collapsible` toggle has no visible effect when the sidebar is collapsed — child items are hidden regardless of the collapsible's open state.

Additionally, leaf items without a `tooltip` prop provide no visual feedback in collapsed mode. The `SidebarMenuButton` component only shows a tooltip when the `tooltip` prop is set and `state === 'collapsed'`.

## Goals / Non-Goals

**Goals:**
- All sidebar menu items remain fully functional in collapsed (icon-only) mode
- Leaf items show tooltips on hover when collapsed
- Group items (with children) open a floating `DropdownMenu` when collapsed, showing child items with icons and labels
- Expanded sidebar behavior remains unchanged
- No new npm dependencies — use existing shadcn-vue `DropdownMenu` and `Tooltip` components

**Non-Goals:**
- No changes to mobile bottom navigation (already works correctly)
- No changes to the sidebar collapse/expand toggle mechanism
- No visual redesign of the collapsed sidebar — icon-only mode stays the same
- No changes to other admin layout components (header, inset, etc.)

## Decisions

### 1. Conditional rendering based on `state` (not CSS-only)

Use Vue's `v-if`/`v-else` to render different component trees for collapsed vs expanded state, controlled by `state` from `useSidebar()`.

**Why:** CSS-only approaches can't replace `Collapsible` with `DropdownMenu` — they're fundamentally different interaction patterns. `Collapsible` expands inline (impossible in icon-width sidebar), while `DropdownMenu` renders a floating overlay.

**Alternatives considered:**
- CSS `:hover` to show sub-items as overlay — fragile, no keyboard support, conflicts with existing tooltip behavior
- Always use `DropdownMenu` for group items — loses the nice inline expand/collapse UX in expanded mode
- Use `SidebarMenuAction` with popover — overcomplicated, `DropdownMenu` is simpler and already available

### 2. `DropdownMenu` for collapsed group items

When `state === 'collapsed'`, render a `DropdownMenu` with `DropdownMenuTrigger` (the icon button) and `DropdownMenuContent` (child items as `DropdownMenuItem` with icons).

**Why:** Matches the shadcn-ui React sidebar pattern. `DropdownMenu` provides:
- Floating overlay that works regardless of sidebar width
- Keyboard navigation (arrow keys, Enter, Escape)
- Automatic positioning and collision detection
- Consistent styling with existing admin UI

### 3. Add `tooltip` prop to all leaf `SidebarMenuButton` items

Pass the translated label (`t('nav.dashboard')`, `t('nav.site')`) as the `tooltip` prop.

**Why:** `SidebarMenuButton.vue` already handles tooltip rendering — it wraps the button in `TooltipTrigger` and shows a tooltip only when `state === 'collapsed' || isMobile`. No custom tooltip logic needed.

### 4. Keep `Collapsible` for expanded state

When `state === 'expanded'`, render the existing `Collapsible` structure unchanged.

**Why:** The inline expand/collapse is the correct UX for a wide sidebar. Users expect Settings to expand and show children inline, not as a floating dropdown.

### 5. DropdownMenu items use `router-link` via `as-child`

Each `DropdownMenuItem` wraps a `router-link` with `as-child` to enable navigation on click.

**Why:** Consistent with how `SidebarMenuButton` handles navigation. The `router-link` becomes the clickable element, preserving Vue Router's navigation behavior.

## Implementation Structure

```vue
<!-- Group item (Settings) — collapsed state -->
<SidebarMenuItem v-if="item.children">
  <DropdownMenu v-if="state === 'collapsed'">
    <DropdownMenuTrigger as-child>
      <SidebarMenuButton :tooltip="t(`nav.${item.i18nKey}`)">
        <component :is="item.icon" />
        <span>{{ t(`nav.${item.i18nKey}`) }}</span>
      </SidebarMenuButton>
    </DropdownMenuTrigger>
    <DropdownMenuContent side="right" align="start" class="w-56">
      <DropdownMenuItem v-for="child in item.children" :key="child.routeName" as-child>
        <router-link :to="{ name: child.routeName }">
          <component :is="child.icon" />
          <span>{{ t(`nav.${child.i18nKey}`) }}</span>
        </router-link>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>

  <!-- Expanded state — existing Collapsible -->
  <Collapsible v-else ...>
    ...
  </Collapsible>
</SidebarMenuItem>

<!-- Leaf item (Dashboard) — always same, just add tooltip -->
<SidebarMenuButton :tooltip="t(`nav.${item.i18nKey}`)" as-child>
  <router-link :to="{ name: item.routeName }">
    ...
  </router-link>
</SidebarMenuButton>
```

## Risks / Trade-offs

- **[Trade-off] Two render paths for group items** — more code to maintain. → Mitigation: The two paths are clearly separated by `v-if="state === 'collapsed'"` and share the same `item.children` data source.
- **[Risk] DropdownMenu positioning near screen edge** — could be clipped. → Mitigation: Reka UI's `DropdownMenuContent` has built-in collision detection and auto-flip. Using `side="right"` positions it to the right of the collapsed sidebar.
- **[Trade-off] Tooltip + DropdownMenu on same button** — the `DropdownMenuTrigger` wraps the `SidebarMenuButton`, which has `tooltip`. The `SidebarMenuButton`'s tooltip wrapper (`TooltipTrigger`) may conflict with `DropdownMenuTrigger`. → Mitigation: In collapsed mode, the `DropdownMenuTrigger` should wrap the `SidebarMenuButtonChild` directly (not `SidebarMenuButton` with tooltip). Use `SidebarMenuButtonChild` inside `DropdownMenuTrigger` and handle tooltip separately, or let `DropdownMenu` serve as the hover feedback (showing child labels).
- **[Open] Should DropdownMenu show on hover or click?** → Click is the default for `DropdownMenu` and is more accessible. Hover could cause accidental opens. Stick with click.

## Verification

The implementation will be verified by **20 new E2E tests** added to `setup-e2e-testing`:

**Admin tests (12):** `tests/e2e/tests/admin/sidebar-collapse.spec.ts`
- Expanded/collapsed state detection via `data-state` attribute
- Sidebar rail toggle functionality
- Tooltip visibility on hover (Dashboard, Settings, Site)
- DropdownMenu opening and navigation
- Inline collapsible in expanded mode
- State persistence after reload

**Superadmin tests (4):** `tests/e2e/tests/superadmin/sidebar-collapse.spec.ts`
- All nav items visible with tooltips
- Dropdown shows Users and Roles with icons
- Navigation to Users and Roles pages from dropdown

These tests are part of the `setup-e2e-testing` change and will run automatically in the full E2E suite.
