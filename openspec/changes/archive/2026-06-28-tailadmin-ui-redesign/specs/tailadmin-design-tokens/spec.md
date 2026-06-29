## ADDED Requirements

### Requirement: Brand color palette available as Tailwind utilities
The system SHALL expose a full `brand-*` color scale (25, 50, 100–950) as Tailwind CSS v4 utilities via `@theme {}` in `app.css`, with `brand-500` set to `#465fff`.

#### Scenario: Brand utilities available in templates
- **WHEN** a developer writes `class="bg-brand-50 text-brand-600"` in a Vue template
- **THEN** the correct TailAdmin brand colors are applied without any additional import

---

### Requirement: Semantic color palettes available as Tailwind utilities
The system SHALL expose `success-*`, `error-*`, `warning-*`, `blue-light-*`, and `orange-*` color scales as Tailwind utilities matching the values in `010_ui_guide.md §3.1`.

#### Scenario: Semantic badge uses success color
- **WHEN** a developer writes `class="bg-success-50 text-success-600"` in a Vue template
- **THEN** the correct green success colors are applied

---

### Requirement: Shadow tokens available as Tailwind utilities
The system SHALL expose `shadow-theme-xs`, `shadow-theme-sm`, `shadow-theme-md`, `shadow-theme-lg`, `shadow-theme-xl`, `shadow-focus-ring`, and `shadow-tooltip` as Tailwind utilities matching the values in `010_ui_guide.md §3.4`.

#### Scenario: Card uses shadow token
- **WHEN** a developer writes `class="shadow-theme-sm"` in a Vue template
- **THEN** the correct TailAdmin soft shadow is applied

---

### Requirement: Custom text-size tokens available as Tailwind utilities
The system SHALL expose `text-theme-sm` (14px/20px) and `text-theme-xs` (12px/18px) as Tailwind text utilities.

#### Scenario: Badge uses micro text token
- **WHEN** a developer writes `class="text-theme-xs"` in a Vue template
- **THEN** 12px/18px line-height is applied

---

### Requirement: Outfit font loaded and applied as default body font
The system SHALL load Outfit (weights 100–900) from Google Fonts and apply it as the default `font-sans` throughout the application.

#### Scenario: Body uses Outfit
- **WHEN** any page is rendered in the browser
- **THEN** the computed font-family of `body` is "Outfit"

---

### Requirement: shadcn-vue CSS vars remapped to TailAdmin values
The system SHALL remap the following shadcn-vue CSS vars in both `:root` (light) and `.dark` scopes:

| Var | Light | Dark |
|---|---|---|
| `--primary` | `#465fff` | `#7592ff` (brand-400) |
| `--primary-foreground` | `#ffffff` | `#ffffff` |
| `--background` | `#f9fafb` (gray-50) | `#101828` (gray-900) |
| `--foreground` | `#1d2939` (gray-800) | `rgba(255,255,255,0.9)` |
| `--card` | `#ffffff` | `rgba(255,255,255,0.03)` |
| `--card-foreground` | `#1d2939` | `rgba(255,255,255,0.9)` |
| `--border` | `#e4e7ec` (gray-200) | `#1d2939` (gray-800) |
| `--input` | `#d0d5dd` (gray-300) | `rgba(255,255,255,0.15)` |
| `--muted` | `#f2f4f7` (gray-100) | `rgba(255,255,255,0.05)` |
| `--muted-foreground` | `#667085` (gray-500) | `#98a2b3` (gray-400) |
| `--radius` | `0.5rem` (8px, lg=buttons) | *(same)* |
| `--sidebar` | `#ffffff` | `#101828` (black/gray-900) |
| `--sidebar-foreground` | `#1d2939` | `rgba(255,255,255,0.9)` |
| `--sidebar-primary` | `#465fff` | `#465fff` |
| `--sidebar-primary-foreground` | `#ffffff` | `#ffffff` |
| `--sidebar-accent` | `#ecf3ff` (brand-50) | `rgba(70,95,255,0.15)` |
| `--sidebar-accent-foreground` | `#3641f5` (brand-600) | `#465fff` (brand-500) |
| `--sidebar-border` | `#e4e7ec` (gray-200) | `#1d2939` (gray-800) |

#### Scenario: Primary button uses brand color in light mode
- **WHEN** the application is in light mode
- **THEN** `Button` with `variant="default"` renders with background `#465fff`

#### Scenario: Page background is gray-50 in light mode
- **WHEN** the application is in light mode
- **THEN** `body` background is `#f9fafb`

#### Scenario: Dark mode applies correct token values
- **WHEN** the `dark` class is on `<html>`
- **THEN** `body` background is `#101828`, sidebar background is `#101828`, and primary buttons use `#7592ff`
