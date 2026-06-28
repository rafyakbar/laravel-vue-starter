# UI Guide

> A visual & code reference for building admin UIs in the **TailAdmin** style.
> Use this guide whenever you need to build UI that looks like TailAdmin.
>
> All examples use **HTML + Tailwind CSS v4** utility classes. The visual language is framework-agnostic — apply the same patterns in React, Vue, Svelte, or any other framework by mapping the class names to your components.

---

## How to Use This Guide

1. **Read §2 (Quick Reference Card)** first for an overview of the design language.
2. **§3 (Design Tokens)** has every color, shadow, font size, and spacing value you'll need.
3. **§5 (Layout Patterns)** shows the 3 main page structures.
4. **§6 (Component Patterns)** is the largest section — copy-paste these for buttons, forms, cards, tables, modals, alerts, badges, avatars, etc.
5. **§9 (Recipe Library)** has ready-to-use composite blocks (page header, metric card row, profile card, etc.).

**For AI agents**: When asked to build a page in TailAdmin style, use this guide as the source of truth. Match the color palette (§3.1), spacing scale (§3.5), typography (§3.3), and follow the component patterns in §6. Default to `rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]` for all card surfaces.

---

## Table of Contents

1. [Overview](#1-overview)
2. [Quick Reference Card](#2-quick-reference-card)
3. [Design Tokens](#3-design-tokens)
   - [3.1 Colors](#31-colors)
   - [3.2 Gray Scale](#32-gray-scale)
   - [3.3 Typography](#33-typography)
   - [3.4 Shadows](#34-shadows)
   - [3.5 Border Radius](#35-border-radius)
   - [3.6 Spacing](#36-spacing)
   - [3.7 Breakpoints](#37-breakpoints)
4. [Dark Mode](#4-dark-mode)
5. [Layout Patterns](#5-layout-patterns)
   - [5.1 Main App (Sidebar + Header + Content)](#51-main-app-sidebar--header--content)
   - [5.2 Auth (Split form + Brand panel)](#52-auth-split-form--brand-panel)
   - [5.3 Centered Error](#53-centered-error)
6. [Component Patterns](#6-component-patterns)
   - [6.1 Buttons](#61-buttons)
   - [6.2 Form Inputs](#62-form-inputs)
   - [6.3 Select & Textarea](#63-select--textarea)
   - [6.4 Checkboxes, Radios, Toggles](#64-checkboxes-radios-toggles)
   - [6.5 File Input](#65-file-input)
   - [6.6 Cards](#66-cards)
   - [6.7 Tables](#67-tables)
   - [6.8 Alerts](#68-alerts)
   - [6.9 Badges](#69-badges)
   - [6.10 Avatars](#610-avatars)
   - [6.11 Modals](#611-modals)
   - [6.12 Dropdowns (3-dot menus)](#612-dropdowns-3-dot-menus)
   - [6.13 Breadcrumb](#613-breadcrumb)
   - [6.14 Preloader & Overlay](#614-preloader--overlay)
7. [Composite Components](#7-composite-components)
   - [7.1 Page Header (Title + Breadcrumb)](#71-page-header-title--breadcrumb)
   - [7.2 Topbar with Search & User Menu](#72-topbar-with-search--user-menu)
   - [7.3 Sidebar with Collapsible Groups](#73-sidebar-with-collapsible-groups)
   - [7.4 Metric Card](#74-metric-card)
   - [7.5 Metric Card Row](#75-metric-card-row)
   - [7.6 Chart Card](#76-chart-card)
   - [7.7 Profile Card](#77-profile-card)
   - [7.8 Table Card](#78-table-card)
   - [7.9 Map Card with Progress Bars](#79-map-card-with-progress-bars)
   - [7.10 Media Storage Card](#710-media-storage-card)
   - [7.11 Watchlist Card](#711-watchlist-card)
8. [Iconography](#8-iconography)
9. [Recipe Library](#9-recipe-library)
10. [Anti-Patterns](#10-anti-patterns)

---

## 1. Overview

**TailAdmin Free** is an open-source admin dashboard template built on Tailwind CSS v4. Its visual language is defined by:

- **Brand color** `#465fff` (a confident indigo-blue)
- **Outfit** as the primary typeface
- **Soft, low-contrast shadows** (not boxy, not flat)
- **12px+ border radius** for cards (friendly, not sharp)
- **Two-surface** depth: white cards on `bg-gray-50` pages
- **Subtle dark mode** that mirrors light mode 1:1
- **No skeuomorphism**, no neon, no gradients (except chart fills)

The aesthetic reads as **modern SaaS admin** — think Linear, Vercel, Stripe Dashboard. It's clean but not sterile, dense but not cluttered.

---

## 2. Quick Reference Card

```
BRAND:        #465fff
FONT:         Outfit (100–900)
PAGE BG:      bg-gray-50 (light) / bg-gray-900 (dark)
CARD BG:      bg-white (light) / bg-white/[0.03] (dark)
CARD:         rounded-2xl border border-gray-200 dark:border-gray-800
TEXT BODY:    text-gray-800 / dark:text-white/90
TEXT MUTED:   text-gray-500 / dark:text-gray-400
TEXT XS:      text-theme-xs (12px) for badges, microcopy
TEXT SM:      text-theme-sm (14px) for body, labels
INPUT HEIGHT: h-11 (44px)
BUTTON:       rounded-lg px-4 py-3 text-sm font-medium
RADIUS:       lg=8 (buttons), 2xl=16 (cards), 3xl=24 (modals)
GRID:         grid grid-cols-12 gap-4 md:gap-6
CONTAINER:    max-w-(--breakpoint-2xl) mx-auto p-4 md:p-6
```

---

## 3. Design Tokens

All tokens are exposed as Tailwind v4 utility classes via `@theme {}` in CSS. To use them in your project, define them in your CSS entry:

```css
@theme {
  --color-brand-500: #465fff;
  --color-success-500: #12b76a;
  --color-error-500: #f04438;
  --color-warning-500: #f79009;
  --color-blue-light-500: #0ba5ec;
  /* ... etc */
  --shadow-theme-xs: 0px 1px 2px 0px rgba(16, 24, 40, 0.05);
  --font-outfit: "Outfit", sans-serif;
  --text-theme-sm: 14px;
  --text-theme-sm--line-height: 20px;
  /* ... etc */
}
```

### 3.1 Colors

#### Brand (Primary Action)

| Token | Hex | Use |
|---|---|---|
| `brand-25` | `#f2f7ff` | Hover bg on light brand surface |
| `brand-50` | `#ecf3ff` | Light brand bg (alert light, badge light) |
| `brand-100` | `#dde9ff` | Subtle brand fill |
| `brand-200` | `#c2d6ff` | Border tint |
| `brand-300` | `#9cb9ff` | Focus border, secondary brand fill |
| `brand-400` | `#7592ff` | Hover on light brand |
| **`brand-500`** | **`#465fff`** | **PRIMARY — buttons, links, active states, charts** |
| `brand-600` | `#3641f5` | Hover on primary button |
| `brand-700` | `#2a31d8` | Pressed |
| `brand-800` | `#252dae` | Deep brand |
| `brand-900` | `#262e89` | Darkest brand |
| `brand-950` | `#161950` | Near-black brand |

#### Semantic Colors

| Color | 50 | 100 | 200 | 300 | 400 | **500** | 600 | 700 | 800 | 900 | 950 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **Success** | `#ecfdf3` | `#d1fadf` | `#a6f4c5` | `#6ce9a6` | `#32d583` | **`#12b76a`** | `#039855` | `#027a48` | `#05603a` | `#054f31` | `#053321` |
| **Error** | `#fef3f2` | `#fee4e2` | `#fecdca` | `#fda29b` | `#f97066` | **`#f04438`** | `#d92d20` | `#b42318` | `#912018` | `#7a271a` | `#55160c` |
| **Warning** | `#fffaeb` | `#fef0c7` | `#fedf89` | `#fec84b` | `#fdb022` | **`#f79009`** | `#dc6803` | `#b54708` | `#93370d` | `#7a2e0e` | `#4e1d09` |
| **Info (Blue Light)** | `#f0f9ff` | `#e0f2fe` | `#b9e6fe` | `#7cd4fd` | `#36bffa` | **`#0ba5ec`** | `#0086c9` | `#026aa2` | `#065986` | `#0b4a6f` | — |
| **Orange (alt warn)** | `#fff6ed` | `#ffead5` | `#fddcab` | `#feb273` | `#fd853a` | **`#fb6514`** | `#ec4a0a` | `#c4320a` | `#9c2a10` | `#7e2410` | — |

#### Theme Extras

```
--color-theme-pink-500:    #ee46bc
--color-theme-purple-500:  #7a5af8
--color-white:             #ffffff
--color-black:             #101828
```

**Use brand-500 for**: primary buttons, primary links, active nav items, chart strokes, focus rings, map highlights.

**Use semantic colors for**: status pills, alerts, form validation, badge variants, chart series 2+.

### 3.2 Gray Scale

| Token | Hex | Use |
|---|---|---|
| `gray-25` | `#fcfcfd` | Lightest bg |
| `gray-50` | `#f9fafb` | **Page bg (light mode)** |
| `gray-100` | `#f2f4f7` | Hover bg, table dividers, soft fills |
| `gray-200` | `#e4e7ec` | **Default borders (cards, dividers)** |
| `gray-300` | `#d0d5dd` | **Input borders** |
| `gray-400` | `#98a2b3` | Disabled text, muted icons |
| `gray-500` | `#667085` | **Body text muted** |
| `gray-600` | `#475467` | Body text secondary |
| `gray-700` | `#344054` | Heading text, dark borders |
| `gray-800` | `#1d2939` | Strong text, dark mode borders |
| `gray-900` | `#101828` | **Page bg (dark mode)** |
| `gray-950` | `#0c111d` | Darkest |
| `gray-dark` | `#1a2231` | Custom dark surface |

### 3.3 Typography

**Font family**: `Outfit` (Google Fonts, weights 100–900)

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap" rel="stylesheet">

<style>
  body { font-family: "Outfit", sans-serif; }
</style>
```

**Text size scale**:

| Token | Size | Line-height | Use |
|---|---|---|---|
| `text-title-2xl` | 72px | 90px | Display headers |
| `text-title-xl` | 60px | 72px | Hero text |
| `text-title-lg` | 48px | 60px | Page heroes |
| `text-title-md` | 36px | 44px | h1 mobile |
| `text-title-sm` | 30px | 38px | **h1 default** |
| `text-theme-xl` | 20px | 30px | Section headers |
| `text-theme-sm` | **14px** | 20px | **Most used — body, labels, table cells** |
| `text-theme-xs` | **12px** | 18px | **Microcopy, badges, captions** |

**Default body**:
```html
<body class="font-outfit bg-gray-50 text-base font-normal text-gray-800
             dark:bg-gray-900 dark:text-white/90">
```

### 3.4 Shadows

| Token | Value | Use |
|---|---|---|
| `shadow-theme-xs` | `0px 1px 2px 0px rgba(16,24,40,0.05)` | Buttons, subtle elevation |
| `shadow-theme-sm` | `0px 1px 3px 0px, 1px 2px 0px rgba(16,24,40,0.10/0.06)` | Cards, inputs |
| `shadow-theme-md` | `0px 4px 8px -2px, 2px 4px -2px rgba(16,24,40,0.10/0.06)` | Dropdowns, popovers |
| `shadow-theme-lg` | `0px 12px 16px -4px, 4px 6px -2px rgba(16,24,40,0.08/0.03)` | Modals, large floating elements |
| `shadow-theme-xl` | `0px 20px 24px -4px, 8px 8px -8px rgba(16,24,40,0.08/0.03)` | Hero modals |
| `shadow-focus-ring` | `0px 0px 0px 4px rgba(70,95,255,0.12)` | Brand focus halo (use with `focus:ring-3 focus:ring-brand-500/10`) |
| `shadow-tooltip` | `0px 4px 6px -2px, -8px 0px 20px 0px rgba(16,24,40,0.05)` | Tooltips |

### 3.5 Border Radius

| Class | Pixels | Use |
|---|---|---|
| `rounded-md` | 6px | Table image containers, small chips |
| `rounded-lg` | 8px | **Buttons, inputs, dropdowns** |
| `rounded-xl` | 12px | **Alerts, date pickers** |
| `rounded-2xl` | 16px | **Cards, modals** |
| `rounded-3xl` | 24px | **Modal dialogs** |
| `rounded-full` | 9999px | **Avatars, badges, pills, toggles, icon buttons** |

### 3.6 Spacing

| Context | Value |
|---|---|
| Page container padding | `p-4 md:p-6` |
| Max content width | `max-w-(--breakpoint-2xl)` (1536px) |
| Grid gap | `gap-4 md:gap-6` |
| Card padding | `p-5` or `p-6` or `p-4 sm:p-6` |
| Table cell padding | `px-5 py-4 sm:px-6` |
| Form field spacing | `space-y-5` or `space-y-6` |
| Input height | `h-11` (44px) |
| Button padding | `px-4 py-3` (default) / `px-5 py-3.5` (large) |

### 3.7 Breakpoints

| Token | Value |
|---|---|
| `2xsm` | 375px |
| `xsm` | 425px |
| `sm` | 640px |
| `md` | 768px |
| `lg` | 1024px |
| `xl` | 1280px |
| `2xl` | 1536px |
| `3xl` | 2000px |

---

## 4. Dark Mode

**Activation**:
- Tailwind v4 custom variant: `@custom-variant dark (&:is(.dark *));`
- Add `class="dark"` to `<html>` (or `<body>`) when dark mode is on
- All components use dual `light dark:` classes throughout

**Class naming convention** (every component must follow):

| Light | Dark |
|---|---|
| `bg-white` | `dark:bg-white/[0.03]` (card) or `dark:bg-gray-900` (page) |
| `bg-gray-50` | `dark:bg-gray-900` (page bg) |
| `border-gray-200` | `dark:border-gray-800` |
| `text-gray-500` | `dark:text-gray-400` (muted) |
| `text-gray-800` | `dark:text-white/90` (body) |
| `bg-{color}-50` | `dark:bg-{color}-500/15` (alert light) |
| `bg-white` | `dark:bg-gray-800` (input) |
| `bg-gray-100` | `dark:bg-white/5` (hover) |
| `border-white` | `dark:border-gray-900` (avatar ring) |
| `text-gray-300` | `dark:text-white/30` (placeholder) |
| `divide-gray-100` | `dark:divide-gray-800` (table dividers) |

**Toggle pattern** (any framework):
```javascript
// On click
const isDark = document.documentElement.classList.toggle('dark');
localStorage.setItem('app.theme', isDark ? 'dark' : 'light');

// On page load (FOUC prevention — run synchronously in <head>)
const theme = localStorage.getItem('app.theme');
if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
  document.documentElement.classList.add('dark');
}
```

---

## 5. Layout Patterns

### 5.1 Main App (Sidebar + Header + Content)

The standard dashboard layout. Used for all inner pages.

```html
<body class="font-outfit bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-white/90">

  <!-- Optional: page loader (hides after 500ms) -->
  <div id="preloader" class="fixed inset-0 z-[999999] flex items-center justify-center
                              bg-white dark:bg-black">
    <div class="h-16 w-16 animate-spin rounded-full border-4 border-solid
                border-brand-500 border-t-transparent"></div>
  </div>
  <script>setTimeout(() => document.getElementById('preloader')?.remove(), 500);</script>

  <div class="flex h-screen overflow-hidden">

    <!-- Sidebar (290px, collapsible on mobile) -->
    <aside class="fixed inset-y-0 left-0 z-50 w-[290px] -translate-x-full bg-white
                  transition-transform lg:static lg:translate-x-0 dark:bg-black">
      <!-- Sidebar content -->
    </aside>

    <!-- Mobile backdrop -->
    <div id="sidebar-overlay" class="fixed inset-0 z-40 hidden bg-gray-900/50 lg:hidden"></div>

    <!-- Main column -->
    <div class="relative flex flex-1 flex-col overflow-x-hidden overflow-y-auto">

      <!-- Sticky header -->
      <header class="sticky top-0 z-[9999] flex h-16 items-center justify-between
                     border-b border-gray-200 bg-white px-6 dark:border-gray-800
                     dark:bg-gray-900">
        <!-- Hamburger (mobile), search, dark mode toggle, notifications, user menu -->
      </header>

      <!-- Page content -->
      <main>
        <div class="mx-auto max-w-[1536px] p-4 md:p-6">
          <!-- Page header (breadcrumb) -->
          <div class="mb-6 flex flex-wrap items-center justify-between gap-3">
            <h2 class="text-xl font-semibold text-gray-800 dark:text-white/90">Page Title</h2>
            <nav>
              <ol class="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                <li><a href="/">Home</a></li>
                <li class="flex items-center gap-1.5">
                  <svg class="size-4 stroke-current" viewBox="0 0 20 20" fill="none">
                    <path d="M7 5l5 5-5 5" stroke-width="1.5" stroke-linecap="round" />
                  </svg>
                  <span>Page Title</span>
                </li>
              </ol>
            </nav>
          </div>

          <!-- 12-column grid -->
          <div class="grid grid-cols-12 gap-4 md:gap-6">
            <div class="col-span-12 md:col-span-7">Left content</div>
            <div class="col-span-12 md:col-span-5">Right content</div>
          </div>
        </div>
      </main>
    </div>
  </div>
</body>
```

**Common column splits**:

| Layout | Classes |
|---|---|
| Full width | `col-span-12` |
| 50/50 | `col-span-12 md:col-span-6 md:col-span-6` |
| 7/5 | `col-span-12 lg:col-span-7` + `col-span-12 lg:col-span-5` |
| 8/4 | `col-span-12 lg:col-span-8` + `col-span-12 lg:col-span-4` |
| 2 metric cards | `col-span-6 sm:col-span-6` (both) |

### 5.2 Auth (Split form + Brand panel)

```html
<body class="font-outfit bg-white dark:bg-gray-900">
  <div class="relative flex min-h-screen flex-col lg:flex-row">

    <!-- Left: form column -->
    <div class="flex w-full flex-col px-6 py-10 lg:w-1/2 lg:px-16">
      <a href="/"
         class="inline-flex items-center gap-2 text-sm text-gray-500 transition-colors
                hover:text-gray-800 dark:text-gray-400 dark:hover:text-white/90">
        <svg class="size-4" viewBox="0 0 20 20" fill="none" stroke="currentColor">
          <path d="M12 5l-5 5 5 5" stroke-width="1.5" stroke-linecap="round" />
        </svg>
        Back to dashboard
      </a>

      <div class="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-12">
        <h1 class="text-[30px] font-bold text-gray-800 sm:text-[36px] dark:text-white/90">
          Sign In
        </h1>
        <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Enter your email and password to sign in
        </p>

        <form class="mt-8 space-y-5">
          <!-- inputs here -->
          <button type="submit" class="...">Sign In</button>
        </form>

        <p class="mt-6 text-sm text-gray-500 dark:text-gray-400">
          Don't have an account? <a href="/register" class="text-brand-500">Sign Up</a>
        </p>
      </div>
    </div>

    <!-- Right: brand panel (hidden on mobile) -->
    <div class="relative hidden flex-col items-center justify-center bg-brand-50 p-16
                lg:flex lg:w-1/2 dark:bg-brand-500/10">
      <!-- Decorative grid pattern -->
      <div class="absolute inset-0 opacity-10"
           style="background-image: radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0);
                  background-size: 32px 32px;"></div>

      <div class="relative flex flex-col items-center text-center text-brand-700
                  dark:text-white/90">
        <div class="mb-6 flex size-16 items-center justify-center rounded-2xl
                    bg-white shadow-theme-md dark:bg-white/5">
          <svg class="size-8 text-brand-500">...</svg>
        </div>
        <p class="text-2xl font-semibold tracking-tight">Your Brand</p>
        <p class="mt-3 max-w-xs text-sm opacity-75">A tagline goes here</p>
      </div>
    </div>
  </div>

  <!-- Floating dark mode toggle -->
  <button class="fixed bottom-6 right-6 z-50 hidden h-11 w-11 items-center justify-center
                 rounded-full bg-white shadow-theme-md sm:flex dark:bg-gray-800">
    <!-- sun/moon icon -->
  </button>
</body>
```

### 5.3 Centered Error

```html
<body class="font-outfit bg-white dark:bg-gray-900">
  <div class="relative flex min-h-screen flex-col items-center justify-center p-6
              overflow-hidden">
    <div class="mx-auto w-full max-w-[242px] text-center sm:max-w-[472px]">
      <h1 class="text-[36px] font-bold text-gray-800 dark:text-white/90">ERROR</h1>
      <img class="mx-auto dark:hidden" src="404-light.svg" alt="404 light">
      <img class="mx-auto hidden dark:block" src="404-dark.svg" alt="404 dark">
      <p class="mt-8 text-base text-gray-500 dark:text-gray-400">
        We can't seem to find the page you're looking for.
      </p>
      <a href="/"
         class="mt-8 inline-flex items-center gap-2 rounded-lg bg-brand-500 px-5 py-3
                text-sm font-medium text-white shadow-theme-xs transition hover:bg-brand-600">
        Back to Home Page
      </a>
    </div>
  </div>
</body>
```

---

## 6. Component Patterns

### 6.1 Buttons

**Base classes (apply to all buttons)**:
```
inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium
transition shadow-theme-xs
```

#### Primary Button

```html
<button class="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-500
               px-4 py-3 text-sm font-medium text-white shadow-theme-xs transition
               hover:bg-brand-600">
  Button Text
</button>
```

**Large** (use `px-5 py-3.5`):
```html
<button class="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-500
               px-5 py-3.5 text-sm font-medium text-white shadow-theme-xs transition
               hover:bg-brand-600">
  Large Button
</button>
```

**With left icon**:
```html
<button class="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-500
               px-4 py-3 text-sm font-medium text-white shadow-theme-xs transition
               hover:bg-brand-600">
  <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       stroke-width="1.5"><path d="..." /></svg>
  With Icon
</button>
```

**Disabled**:
```html
<button disabled class="inline-flex items-center justify-center gap-2 rounded-lg
                       bg-brand-500 px-4 py-3 text-sm font-medium text-white
                       opacity-50 shadow-theme-xs cursor-not-allowed">
  Disabled
</button>
```

#### Secondary Button

```html
<button class="inline-flex items-center justify-center gap-2 rounded-lg bg-white
               px-4 py-3 text-sm font-medium text-gray-700 ring-1 ring-inset
               ring-gray-300 transition hover:bg-gray-50 dark:bg-gray-800
               dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03]">
  Secondary
</button>
```

#### Icon-only Button

```html
<button class="inline-flex h-11 w-11 items-center justify-center rounded-lg
               bg-white text-gray-700 ring-1 ring-inset ring-gray-300 transition
               hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700">
  <svg class="size-5">...</svg>
</button>
```

#### Floating Action Button (circular)

```html
<button class="inline-flex h-11 w-11 items-center justify-center rounded-full
               bg-brand-500 text-white shadow-theme-md transition hover:bg-brand-600">
  <svg class="size-5">...</svg>
</button>
```

### 6.2 Form Inputs

**Base input** (applies to text, email, password, number, url, tel, search):
```html
<input type="text"
       placeholder="Enter value"
       class="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5
              text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400
              focus:border-brand-300 focus:outline-hidden focus:ring-3
              focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900
              dark:text-white/90 dark:placeholder:text-white/30
              dark:focus:border-brand-800">
```

**Input with label**:
```html
<div>
  <label for="email" class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
    Email
  </label>
  <input id="email" type="email" class="...">
</div>
```

**Input with hint text**:
```html
<div>
  <input type="text" class="...">
  <p class="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
    We'll never share your email with anyone else.
  </p>
</div>
```

**Password with show/hide toggle** (any framework — toggle input type):
```html
<div class="relative">
  <input :type="show ? 'text' : 'password'" class="...">
  <button type="button" @click="show = !show"
          class="absolute right-0 top-0 flex h-full w-11 items-center justify-center
                 text-gray-500 dark:text-gray-400">
    <!-- eye / eye-off icon -->
  </button>
</div>
```

**Validation states**:

| State | Class additions |
|---|---|
| **Error** | `border-error-300 focus:border-error-300 focus:ring-error-500/10` + red icon + `<p class="mt-1.5 text-xs text-error-500">Message</p>` |
| **Success** | `border-success-300 focus:border-success-300 focus:ring-success-500/10` + green icon + `<p class="mt-1.5 text-xs text-success-500">Message</p>` |
| **Disabled** | `disabled:border-gray-100 disabled:bg-gray-50 disabled:placeholder:text-gray-300 disabled:cursor-not-allowed` |

**Input with left icon**:
```html
<div class="relative">
  <span class="absolute left-0 top-0 flex h-11 w-11 items-center justify-center
               text-gray-500 dark:text-gray-400">
    <svg class="size-5">...</svg>
  </span>
  <input class="... pl-11">
</div>
```

**Input with right icon (copy button)**:
```html
<div class="relative">
  <input id="copyInput" readonly value="https://example.com" class="...">
  <button id="copyButton" type="button"
          class="absolute right-0 top-0 flex h-11 items-center justify-center
                 rounded-r-lg border-l border-gray-200 bg-gray-50 px-4 text-sm
                 font-medium text-gray-700 transition hover:bg-gray-100
                 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400
                 dark:hover:bg-white/5">
    Copy
  </button>
</div>
```

**Input with prefix** (e.g., URL `http://`):
```html
<div class="relative">
  <span class="absolute left-0 top-0 flex h-11 items-center border-r border-gray-200
               bg-transparent px-3.5 text-sm text-gray-500 dark:border-gray-700
               dark:text-gray-400">
    http://
  </span>
  <input class="... pl-[90px]">
</div>
```

**Phone with country selector**:
```html
<div class="relative flex">
  <select class="h-11 w-[80px] appearance-none rounded-l-lg border border-r-0
                 border-gray-300 bg-transparent pl-3.5 text-sm text-gray-700
                 focus:outline-hidden dark:border-gray-700 dark:text-gray-400">
    <option>US</option>
    <option>UK</option>
  </select>
  <input class="h-11 w-full rounded-r-lg border border-gray-300 bg-transparent
                px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs
                placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden
                focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700
                dark:bg-gray-900 dark:text-white/90">
</div>
```

### 6.3 Select & Textarea

**Native select** (with custom chevron):
```html
<div class="relative">
  <select class="h-11 w-full appearance-none rounded-lg border border-gray-300
                 bg-transparent bg-none px-4 py-2.5 pr-11 text-sm text-gray-800
                 shadow-theme-xs focus:border-brand-300 focus:outline-hidden
                 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700
                 dark:bg-gray-900 dark:text-white/90">
    <option>Option 1</option>
    <option>Option 2</option>
  </select>
  <span class="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2
               text-gray-500 dark:text-gray-400">
    <svg class="size-4" viewBox="0 0 20 20" fill="none" stroke="currentColor">
      <path d="M5 8l5 5 5-5" stroke-width="1.5" stroke-linecap="round" />
    </svg>
  </span>
</div>
```

**Textarea**:
```html
<textarea rows="6"
          class="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5
                 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400
                 focus:border-brand-300 focus:outline-hidden focus:ring-3
                 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900
                 dark:text-white/90 dark:placeholder:text-white/30"></textarea>
```

### 6.4 Checkboxes, Radios, Toggles

**Checkbox** (custom-styled, `sr-only` real input):
```html
<label class="flex cursor-pointer select-none items-center gap-2 text-sm
              text-gray-700 dark:text-gray-400">
  <span class="relative">
    <input type="checkbox" class="peer sr-only">
    <span class="block h-5 w-5 rounded-md border-[1.25px] border-gray-300
                  transition peer-checked:border-brand-500 peer-checked:bg-brand-500
                  dark:border-gray-700"></span>
    <span class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                  text-white opacity-0 transition peer-checked:opacity-100">
      <svg class="h-3.5 w-3.5" viewBox="0 0 14 14" fill="none">
        <path d="M3 7l3 3 5-5" stroke="currentColor" stroke-width="2"
              stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </span>
  </span>
  Checkbox label
</label>
```

**Radio** (same pattern, with dot):
```html
<label class="flex cursor-pointer select-none items-center gap-2 text-sm
              text-gray-700 dark:text-gray-400">
  <span class="relative">
    <input type="radio" name="r" class="peer sr-only">
    <span class="block h-5 w-5 rounded-full border-[1.25px] border-gray-300
                  transition peer-checked:border-brand-500 dark:border-gray-700"></span>
    <span class="absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2
                  rounded-full bg-brand-500 opacity-0 transition peer-checked:opacity-100"></span>
  </span>
  Radio label
</label>
```

**Toggle switch**:
```html
<label class="relative">
  <input type="checkbox" class="peer sr-only">
  <span class="block h-6 w-11 rounded-full bg-gray-200 transition
               peer-checked:bg-brand-500 dark:bg-white/10"></span>
  <span class="absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white
                shadow-theme-xs transition-transform duration-300 ease-linear
                peer-checked:translate-x-[22px]"></span>
</label>
```

**Disabled state** (apply to label):
```html
<label class="opacity-50 cursor-not-allowed">...</label>
```

### 6.5 File Input

```html
<input type="file"
       class="w-full overflow-hidden rounded-lg border border-gray-300 bg-transparent
              text-sm text-gray-500 shadow-theme-xs transition
              file:mr-5 file:cursor-pointer file:rounded-l-lg file:border-0
              file:border-r file:border-solid file:border-gray-200 file:bg-gray-50
              file:px-4 file:py-3 file:text-sm file:text-gray-700
              focus:outline-hidden dark:border-gray-700 dark:text-gray-400
              dark:file:border-gray-700 dark:file:bg-gray-800
              dark:file:text-gray-400">
```

### 6.6 Cards

**Base card** (the single most important pattern):
```html
<div class="rounded-2xl border border-gray-200 bg-white dark:border-gray-800
            dark:bg-white/[0.03]">
  <div class="p-5 md:p-6">
    Card body
  </div>
</div>
```

**Card with header + body** (separated by border):
```html
<div class="rounded-2xl border border-gray-200 bg-white dark:border-gray-800
            dark:bg-white/[0.03]">
  <div class="px-6 py-5">
    <h3 class="text-base font-medium text-gray-800 dark:text-white/90">Card Title</h3>
  </div>
  <div class="border-t border-gray-100 p-4 sm:p-6 dark:border-gray-800">
    Card body
  </div>
</div>
```

**Card with header + 3-dot menu**:
```html
<div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800
            dark:bg-white/[0.03] sm:p-6">
  <div class="flex items-start justify-between">
    <div>
      <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90">Title</h3>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Subtitle</p>
    </div>
    <!-- 3-dot dropdown trigger -->
    <button class="text-gray-500 dark:text-gray-400">
      <svg class="size-5" viewBox="0 0 24 24" fill="currentColor">
        <circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/>
      </svg>
    </button>
  </div>
  <div class="mt-4">Body</div>
</div>
```

**Hoverable card** (with subtle lift):
```html
<div class="rounded-2xl border border-gray-200 bg-white transition
            hover:border-brand-300 hover:shadow-theme-md dark:border-gray-800
            dark:bg-white/[0.03]">
  ...
</div>
```

### 6.7 Tables

**Full table card**:
```html
<div class="overflow-hidden rounded-2xl border border-gray-200 bg-white
            dark:border-gray-800 dark:bg-white/[0.03]">
  <div class="max-w-full overflow-x-auto">
    <table class="w-full">
      <thead>
        <tr class="border-b border-gray-100 dark:border-gray-800">
          <th class="px-5 py-3 text-left text-xs font-medium text-gray-500 sm:px-6
                     dark:text-gray-400">Header</th>
          <th class="px-5 py-3 text-left text-xs font-medium text-gray-500 sm:px-6
                     dark:text-gray-400">Header</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
        <tr>
          <td class="px-5 py-4 sm:px-6">
            <div class="flex items-center gap-3">
              <div class="h-10 w-10 overflow-hidden rounded-full">
                <img src="user.jpg" alt="" class="h-full w-full object-cover">
              </div>
              <div>
                <span class="block text-sm font-medium text-gray-800 dark:text-white/90">
                  Lindsey Curtis
                </span>
                <span class="block text-xs text-gray-500 dark:text-gray-400">
                  Team Manager
                </span>
              </div>
            </div>
          </td>
          <td class="px-5 py-4 sm:px-6">
            <span class="inline-flex items-center justify-center gap-1 rounded-full
                         bg-success-50 px-2.5 py-0.5 text-sm font-medium
                         text-success-600 dark:bg-success-500/15
                         dark:text-success-500">
              Active
            </span>
          </td>
        </tr>
        <!-- more rows -->
      </tbody>
    </table>
  </div>
</div>
```

**Avatar group (overlapping)**:
```html
<div class="flex -space-x-2">
  <div class="h-9 w-9 overflow-hidden rounded-full border-2 border-white
              dark:border-gray-900">
    <img src="user1.jpg" class="h-full w-full object-cover">
  </div>
  <div class="h-9 w-9 overflow-hidden rounded-full border-2 border-white
              dark:border-gray-900">
    <img src="user2.jpg" class="h-full w-full object-cover">
  </div>
  <div class="h-9 w-9 overflow-hidden rounded-full border-2 border-white
              dark:border-gray-900">
    <img src="user3.jpg" class="h-full w-full object-cover">
  </div>
  <div class="flex h-9 w-9 items-center justify-center rounded-full border-2
              border-white bg-gray-100 text-xs font-medium text-gray-700
              dark:border-gray-900 dark:bg-gray-800 dark:text-gray-400">
    +5
  </div>
</div>
```

**Status pill (for any state)**:
```html
<!-- Success -->
<span class="inline-flex items-center justify-center gap-1 rounded-full bg-success-50
             px-2 py-0.5 text-xs font-medium text-success-600
             dark:bg-success-500/15 dark:text-success-500">Active</span>

<!-- Warning -->
<span class="inline-flex items-center justify-center gap-1 rounded-full bg-warning-50
             px-2 py-0.5 text-xs font-medium text-warning-600
             dark:bg-warning-500/15 dark:text-orange-400">Pending</span>

<!-- Error -->
<span class="inline-flex items-center justify-center gap-1 rounded-full bg-error-50
             px-2 py-0.5 text-xs font-medium text-error-600
             dark:bg-error-500/15 dark:text-error-500">Cancelled</span>

<!-- Info -->
<span class="inline-flex items-center justify-center gap-1 rounded-full bg-blue-light-50
             px-2 py-0.5 text-xs font-medium text-blue-light-600
             dark:bg-blue-light-500/15 dark:text-blue-light-500">Draft</span>

<!-- Neutral -->
<span class="inline-flex items-center justify-center gap-1 rounded-full bg-gray-100
             px-2 py-0.5 text-xs font-medium text-gray-700
             dark:bg-white/5 dark:text-white/80">Inactive</span>
```

### 6.8 Alerts

**4 variants** — same structure, swap the color:

```html
<!-- Success -->
<div class="rounded-xl border border-success-500 bg-success-50 p-4
            dark:border-success-500/30 dark:bg-success-500/15">
  <div class="flex items-start gap-3">
    <span class="text-success-500">
      <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M9 12l2 2 4-4M12 22a10 10 0 100-20 10 10 0 000 20z" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </span>
    <div>
      <h4 class="text-base font-semibold text-gray-800 dark:text-white/90">Success</h4>
      <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
        Your changes have been saved successfully. <a class="text-success-500 underline">Learn more</a>
      </p>
    </div>
  </div>
</div>
```

**Color mapping for all 4 variants**:

| Variant | Border | Light bg | Icon | Dark border | Dark bg |
|---|---|---|---|---|---|
| Success | `border-success-500` | `bg-success-50` | `text-success-500` | `dark:border-success-500/30` | `dark:bg-success-500/15` |
| Warning | `border-warning-500` | `bg-warning-50` | `text-warning-500` | `dark:border-warning-500/30` | `dark:bg-warning-500/15` |
| Error | `border-error-500` | `bg-error-50` | `text-error-500` | `dark:border-error-500/30` | `dark:bg-error-500/15` |
| Info | `border-blue-light-500` | `bg-blue-light-50` | `text-blue-light-500` | `dark:border-blue-light-500/30` | `dark:bg-blue-light-500/15` |

**Dismissible alert** (add a close button):
```html
<div class="relative rounded-xl border ... p-4">
  <button class="absolute right-3 top-3 text-gray-500 hover:text-gray-700
                 dark:text-gray-400">
    <svg class="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor">
      <path d="M5 5l10 10M15 5L5 15" stroke-width="1.5" stroke-linecap="round" />
    </svg>
  </button>
  <!-- alert content -->
</div>
```

### 6.9 Badges

**Base classes (all variants)**:
```
inline-flex items-center justify-center gap-1 rounded-full px-2.5 py-0.5
text-sm font-medium
```

**Light background variants** (7 colors):

```html
<!-- Primary -->
<span class="inline-flex items-center justify-center gap-1 rounded-full bg-brand-50
             px-2.5 py-0.5 text-sm font-medium text-brand-600
             dark:bg-brand-500/15 dark:text-brand-500">Primary</span>

<!-- Success -->
<span class="inline-flex items-center justify-center gap-1 rounded-full bg-success-50
             px-2.5 py-0.5 text-sm font-medium text-success-600
             dark:bg-success-500/15 dark:text-success-500">Success</span>

<!-- Error -->
<span class="inline-flex items-center justify-center gap-1 rounded-full bg-error-50
             px-2.5 py-0.5 text-sm font-medium text-error-600
             dark:bg-error-500/15 dark:text-error-500">Error</span>

<!-- Warning (note: dark text is orange-400) -->
<span class="inline-flex items-center justify-center gap-1 rounded-full bg-warning-50
             px-2.5 py-0.5 text-sm font-medium text-warning-600
             dark:bg-warning-500/15 dark:text-orange-400">Warning</span>

<!-- Info -->
<span class="inline-flex items-center justify-center gap-1 rounded-full bg-blue-light-50
             px-2.5 py-0.5 text-sm font-medium text-blue-light-600
             dark:bg-blue-light-500/15 dark:text-blue-light-500">Info</span>

<!-- Light (neutral) -->
<span class="inline-flex items-center justify-center gap-1 rounded-full bg-gray-100
             px-2.5 py-0.5 text-sm font-medium text-gray-700
             dark:bg-white/5 dark:text-white/80">Light</span>

<!-- Dark -->
<span class="inline-flex items-center justify-center gap-1 rounded-full bg-gray-700
             px-2.5 py-0.5 text-sm font-medium text-white
             dark:bg-white/5 dark:text-white/80">Dark</span>
```

**Solid background variants**: replace `bg-{color}-50 ... text-{color}-600` with `bg-{color}-500 text-white`.

**With icon** (left): add `<svg class="h-3 w-3">...</svg>` as first child.

### 6.10 Avatars

**4 status types × 6 sizes** (h/w = 6, 8, 10, 12, 14, 16).

**Default avatar** (size 10):
```html
<div class="relative h-10 w-10 overflow-hidden rounded-full">
  <img src="user.jpg" alt="user" class="h-full w-full object-cover">
</div>
```

**With status indicator** (online):
```html
<div class="relative h-10 w-10">
  <div class="h-full w-full overflow-hidden rounded-full">
    <img src="user.jpg" alt="user" class="h-full w-full object-cover">
  </div>
  <span class="absolute right-0 bottom-0 block h-2.5 w-2.5 rounded-full
               bg-success-500 ring-2 ring-white dark:ring-gray-900"></span>
</div>
```

**Status colors**:
- Online: `bg-success-500`
- Offline: `bg-error-500`
- Busy/Away: `bg-warning-500`
- No indicator: omit the dot span

**Avatar with initials** (no image):
```html
<div class="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50
            text-sm font-medium text-brand-600 dark:bg-brand-500/15
            dark:text-brand-500">
  AB
</div>
```

### 6.11 Modals

**Structure** (any framework — toggle `isOpen` state):

```html
<div x-data="{ isOpen: false }" @keydown.escape.window="isOpen = false">

  <!-- Trigger -->
  <button @click="isOpen = true" class="...">Open Modal</button>

  <!-- Modal wrapper -->
  <div x-show="isOpen"
       class="fixed inset-0 z-[99999] flex items-center justify-center overflow-y-auto p-5"
       style="display: none">

    <!-- Backdrop -->
    <div @click="isOpen = false"
         class="fixed inset-0 h-full w-full bg-gray-400/50 backdrop-blur-[32px]"></div>

    <!-- Dialog -->
    <div @click.stop
         class="relative w-full max-w-[700px] rounded-3xl bg-white p-6 shadow-theme-xl
                dark:bg-gray-900 lg:p-11">
      <!-- Close button -->
      <button @click="isOpen = false"
              class="absolute right-5 top-5 z-[999] flex h-11 w-11 items-center
                     justify-center rounded-full bg-gray-100 text-gray-400 transition
                     hover:bg-gray-200 hover:text-gray-600 dark:bg-white/5
                     dark:text-gray-400 dark:hover:bg-white/10">
        <svg class="size-5" viewBox="0 0 20 20" fill="none" stroke="currentColor">
          <path d="M5 5l10 10M15 5L5 15" stroke-width="1.5" stroke-linecap="round" />
        </svg>
      </button>

      <!-- Header -->
      <h3 class="text-[30px] font-semibold text-gray-800 dark:text-white/90">
        Modal Title
      </h3>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Brief description
      </p>

      <!-- Body -->
      <div class="mt-8">
        <!-- form or content -->
      </div>

      <!-- Footer -->
      <div class="mt-8 flex flex-wrap items-center justify-end gap-3">
        <button @click="isOpen = false" class="...">Close</button>
        <button class="...">Save Changes</button>
      </div>
    </div>
  </div>
</div>
```

**Small modal** (`max-w-sm`), **large modal** (`max-w-4xl`).

### 6.12 Dropdowns (3-dot menus)

**Pattern** (any framework — manage `open` state):

```html
<div @click.outside="open = false" class="relative">
  <button @click="open = !open"
          class="text-gray-500 transition hover:text-gray-700 dark:text-gray-400
                 dark:hover:text-gray-300">
    <svg class="size-5" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="5" cy="12" r="1.5"/>
      <circle cx="12" cy="12" r="1.5"/>
      <circle cx="19" cy="12" r="1.5"/>
    </svg>
  </button>

  <div x-show="open"
       class="absolute right-0 top-full z-40 mt-1 w-40 space-y-1 rounded-2xl border
              border-gray-200 bg-white p-2 shadow-theme-lg dark:border-gray-800
              dark:bg-gray-900"
       style="display: none">
    <button class="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left
                   text-xs font-medium text-gray-500 transition hover:bg-gray-100
                   hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5
                   dark:hover:text-gray-300">
      <svg class="size-4">...</svg> Edit
    </button>
    <button class="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left
                   text-xs font-medium text-gray-500 transition hover:bg-gray-100
                   hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5
                   dark:hover:text-gray-300">
      <svg class="size-4">...</svg> Delete
    </button>
  </div>
</div>
```

### 6.13 Breadcrumb

```html
<div class="mb-6 flex flex-wrap items-center justify-between gap-3">
  <h2 class="text-xl font-semibold text-gray-800 dark:text-white/90">
    Page Title
  </h2>
  <nav>
    <ol class="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
      <li>
        <a href="/" class="hover:text-gray-700 dark:hover:text-white/90">Home</a>
      </li>
      <li class="flex items-center gap-1.5">
        <svg class="size-4 stroke-current" viewBox="0 0 20 20" fill="none">
          <path d="M7 5l5 5-5 5" stroke-width="1.5" stroke-linecap="round" />
        </svg>
        <a href="/section" class="hover:text-gray-700 dark:hover:text-white/90">Section</a>
      </li>
      <li class="flex items-center gap-1.5">
        <svg class="size-4 stroke-current" viewBox="0 0 20 20" fill="none">
          <path d="M7 5l5 5-5 5" stroke-width="1.5" stroke-linecap="round" />
        </svg>
        <span class="text-gray-800 dark:text-white/90">Current</span>
      </li>
    </ol>
  </nav>
</div>
```

### 6.14 Preloader & Overlay

**Preloader** (auto-hides after 500ms):
```html
<div id="preloader"
     class="fixed inset-0 z-[999999] flex items-center justify-center bg-white
            dark:bg-black">
  <div class="h-16 w-16 animate-spin rounded-full border-4 border-solid
              border-brand-500 border-t-transparent"></div>
</div>
<script>setTimeout(() => document.getElementById('preloader')?.remove(), 500);</script>
```

**Mobile sidebar overlay**:
```html
<div id="sidebar-overlay"
     onclick="document.querySelector('aside')?.classList.add('-translate-x-full');
              this.classList.add('hidden');"
     class="fixed inset-0 z-40 hidden bg-gray-900/50 lg:hidden"></div>
```

---

## 7. Composite Components

### 7.1 Page Header (Title + Breadcrumb)

See [§6.13](#613-breadcrumb).

### 7.2 Topbar with Search & User Menu

```html
<header class="sticky top-0 z-[9999] flex h-16 items-center justify-between
               border-b border-gray-200 bg-white px-6 dark:border-gray-800
               dark:bg-gray-900">

  <!-- Left: hamburger (mobile) + search -->
  <div class="flex flex-1 items-center gap-4">
    <button class="lg:hidden" onclick="document.querySelector('aside')?.classList.toggle('-translate-x-full');
                                          document.getElementById('sidebar-overlay')?.classList.toggle('hidden');">
      <svg class="size-6">...</svg>
    </button>

    <div class="relative max-w-md flex-1">
      <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
        <svg class="size-5">...</svg>
      </span>
      <input id="searchInput" type="search" placeholder="Search or type command..."
             class="h-10 w-full rounded-lg border border-gray-200 bg-gray-50 pl-11 pr-20
                    text-sm placeholder:text-gray-400 focus:border-brand-300
                    focus:outline-hidden focus:ring-3 focus:ring-brand-500/10
                    dark:border-gray-800 dark:bg-white/[0.03] dark:text-white/90">
      <kbd class="absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-md
                  border border-gray-200 bg-white px-2 py-0.5 text-xs text-gray-500
                  sm:inline-block dark:border-gray-700 dark:bg-gray-800
                  dark:text-gray-400">⌘K</kbd>
    </div>
  </div>

  <!-- Right: dark mode + notifications + user -->
  <div class="flex items-center gap-3">
    <!-- Dark mode toggle -->
    <button onclick="document.documentElement.classList.toggle('dark');
                       localStorage.setItem('app.theme',
                         document.documentElement.classList.contains('dark') ? 'dark' : 'light');"
            class="flex h-10 w-10 items-center justify-center rounded-lg
                   text-gray-500 hover:bg-gray-100 dark:text-gray-400
                   dark:hover:bg-white/5">
      <!-- sun or moon icon -->
    </button>

    <!-- Notifications -->
    <button class="relative flex h-10 w-10 items-center justify-center rounded-lg
                   text-gray-500 hover:bg-gray-100 dark:text-gray-400
                   dark:hover:bg-white/5">
      <svg class="size-5">...</svg>
      <span class="absolute right-2 top-2 block h-2 w-2 rounded-full bg-orange-400
                   animate-ping"></span>
      <span class="absolute right-2 top-2 block h-2 w-2 rounded-full bg-orange-400"></span>
    </button>

    <!-- User avatar -->
    <div class="relative h-10 w-10 cursor-pointer overflow-hidden rounded-full">
      <img src="user.jpg" class="h-full w-full object-cover">
    </div>
  </div>
</header>
```

### 7.3 Sidebar with Collapsible Groups

```html
<aside class="fixed inset-y-0 left-0 z-50 w-[290px] -translate-x-full overflow-y-auto
              bg-white transition-transform lg:static lg:translate-x-0 dark:bg-black">

  <!-- Logo -->
  <div class="flex h-16 items-center gap-2 border-b border-gray-200 px-6
              dark:border-gray-800">
    <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500">
      <svg class="size-5 text-white">...</svg>
    </div>
    <span class="text-lg font-semibold text-gray-800 dark:text-white/90">TailAdmin</span>
  </div>

  <nav class="p-4">

    <!-- Section heading -->
    <p class="mb-2 px-3 text-xs font-medium uppercase tracking-wider text-gray-400">
      Menu
    </p>

    <!-- Active nav item -->
    <a href="/"
       class="menu-item-active flex items-center gap-3 rounded-lg bg-brand-50 px-3 py-2.5
              text-sm font-medium text-brand-600 dark:bg-brand-500/15 dark:text-brand-500">
      <svg class="size-5">...</svg>
      Dashboard
    </a>

    <!-- Inactive nav item -->
    <a href="/calendar"
       class="menu-item-inactive flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm
              font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-400
              dark:hover:bg-white/5 dark:hover:text-white/90">
      <svg class="size-5">...</svg>
      Calendar
    </a>

    <!-- Collapsible group -->
    <div x-data="{ open: true }">
      <button @click="open = !open"
              class="menu-item-inactive flex w-full items-center justify-between
                     rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700
                     hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5">
        <span class="flex items-center gap-3">
          <svg class="size-5">...</svg> Forms
        </span>
        <svg :class="open ? 'rotate-180' : ''" class="size-4 transition-transform">...</svg>
      </button>
      <div x-show="open" class="ml-9 mt-1 space-y-1">
        <a href="/form-elements" class="menu-dropdown-item ...">Form Elements</a>
        <a href="/validation" class="menu-dropdown-item ...">Validation</a>
      </div>
    </div>
  </nav>
</aside>
```

**Helper utility classes** (define in your CSS):
```css
@layer utilities {
  .menu-item-active {
    @apply flex items-center gap-3 rounded-lg bg-brand-50 px-3 py-2.5 text-sm font-medium text-brand-600 dark:bg-brand-500/15 dark:text-brand-500;
  }
  .menu-item-inactive {
    @apply flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white/90;
  }
  .menu-dropdown-item {
    @apply block rounded-lg px-3 py-2 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white/90;
  }
}
```

### 7.4 Metric Card

```html
<div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800
            dark:bg-white/[0.03] sm:p-6">
  <div class="flex items-center justify-between">
    <div>
      <p class="text-sm text-gray-500 dark:text-gray-400">Customers</p>
      <h3 class="mt-1 text-2xl font-semibold text-gray-800 dark:text-white/90">
        3,782
      </h3>
    </div>
    <span class="inline-flex h-11 w-11 items-center justify-center rounded-xl
                 bg-brand-50 text-brand-500 dark:bg-brand-500/15">
      <svg class="size-6">...</svg>
    </span>
  </div>
  <div class="mt-4 flex items-center gap-2">
    <span class="inline-flex items-center gap-1 rounded-full bg-success-50 px-2 py-0.5
                 text-xs font-medium text-success-600 dark:bg-success-500/15
                 dark:text-success-500">
      <svg class="size-3"><path d="M5 15l7-7 7 7" stroke="currentColor" stroke-width="2" fill="none"/></svg>
      11.01%
    </span>
    <span class="text-xs text-gray-500 dark:text-gray-400">vs last week</span>
  </div>
</div>
```

**Variants** (change icon bg + arrow color):
- Positive: `bg-success-50 text-success-600` + green up arrow
- Negative: `bg-error-50 text-error-600` + red down arrow

### 7.5 Metric Card Row

```html
<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
  <!-- 2 metric cards side by side -->
</div>
```

### 7.6 Chart Card

```html
<div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800
            dark:bg-white/[0.03] sm:p-6">
  <div class="flex items-start justify-between">
    <div>
      <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90">Monthly Sales</h3>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Net profit</p>
    </div>
    <!-- 3-dot dropdown trigger -->
  </div>
  <div class="mt-6">
    <div id="chartOne" class="overflow-x-auto">
      <div class="min-w-[1000px] h-[180px]"></div>
    </div>
  </div>
</div>
```

**Suggested chart config (ApexCharts bar)**:
```javascript
new ApexCharts(document.querySelector('#chartOne'), {
  chart: { type: 'bar', height: 180, toolbar: { show: false } },
  series: [{ name: 'Sales', data: [180, 230, 280, 220, 300, 250, 280, 240, 200, 260, 220, 240] }],
  colors: ['#465fff'],
  plotOptions: { bar: { columnWidth: '39%', borderRadius: 5 } },
  xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] },
  legend: { position: 'top', horizontalAlign: 'left' }
}).render();
```

### 7.7 Profile Card

```html
<div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800
            dark:bg-white/[0.03] sm:p-6">
  <div class="flex flex-col items-center text-center sm:flex-row sm:items-center
              sm:gap-5 sm:text-left">
    <div class="h-20 w-20 overflow-hidden rounded-full">
      <img src="owner.jpg" alt="user" class="h-full w-full object-cover">
    </div>
    <div class="mt-4 flex-1 sm:mt-0">
      <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90">
        Musharof Chowdhury
      </h3>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Team Manager</p>
      <div class="mt-3 flex items-center justify-center gap-2 sm:justify-start">
        <!-- Social icon buttons -->
        <a href="#" class="flex h-9 w-9 items-center justify-center rounded-full
                           bg-gray-100 text-gray-700 transition hover:bg-brand-50
                           hover:text-brand-500 dark:bg-white/5 dark:text-gray-400
                           dark:hover:bg-brand-500/15 dark:hover:text-brand-500">
          <svg class="size-4">...</svg>
        </a>
        <!-- repeat for each social -->
      </div>
    </div>
    <button class="...">Edit</button>
  </div>
</div>
```

### 7.8 Table Card

See [§6.7](#67-tables) for the full pattern.

### 7.9 Map Card with Progress Bars

```html
<div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800
            dark:bg-white/[0.03] sm:p-6">
  <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90">
    Customers Demographic
  </h3>
  <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
    Number of customers per country
  </p>

  <div class="my-6 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800">
    <div id="mapOne" class="h-[300px] bg-gray-50 dark:bg-gray-900"></div>
  </div>

  <div class="space-y-5">
    <!-- Country row -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <span class="block h-10 w-1.5 rounded-sm bg-brand-500"></span>
        <p class="text-sm text-gray-500 dark:text-gray-400">USA</p>
      </div>
      <div class="flex w-full max-w-[140px] items-center gap-3">
        <div class="relative h-1.5 w-full max-w-[100px] overflow-hidden rounded-sm
                    bg-gray-200 dark:bg-gray-800">
          <div class="absolute inset-y-0 left-0 bg-brand-500" style="width: 79%"></div>
        </div>
        <p class="text-sm font-medium text-gray-700 dark:text-gray-400">79%</p>
      </div>
    </div>
    <!-- repeat per country -->
  </div>
</div>
```

### 7.10 Media Storage Card

```html
<div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800
            dark:bg-white/[0.03] sm:p-6">
  <div class="flex items-center justify-between">
    <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90">All Media</h3>
    <button class="...">Upload File</button>
  </div>

  <div class="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
    <!-- Media type card -->
    <div class="rounded-xl border border-gray-200 p-4 transition hover:border-brand-300
                dark:border-gray-800">
      <div class="flex items-center gap-3">
        <span class="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50
                     text-brand-500 dark:bg-brand-500/15">
          <svg class="size-5">...</svg>
        </span>
        <p class="text-sm font-medium text-gray-800 dark:text-white/90">Image</p>
      </div>
      <div class="mt-3 flex items-center justify-between text-xs text-gray-500
                  dark:text-gray-400">
        <span>1,245 files</span>
        <span>17%</span>
      </div>
      <div class="mt-2 h-1 w-full overflow-hidden rounded-full bg-gray-200
                  dark:bg-gray-800">
        <div class="h-full bg-brand-500" style="width: 17%"></div>
      </div>
    </div>
    <!-- repeat for Video, Audio, Apps, Docs, Downloads -->
  </div>
</div>
```

### 7.11 Watchlist Card

```html
<div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800
            dark:bg-white/[0.03] sm:p-6">
  <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90">My Watchlist</h3>

  <div class="mt-6 space-y-4">
    <!-- Stock row -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="h-10 w-10 overflow-hidden rounded-full">
          <img src="logo-aapl.png" class="h-full w-full object-cover">
        </div>
        <div>
          <p class="text-sm font-medium text-gray-800 dark:text-white/90">Apple Inc.</p>
          <p class="text-xs text-gray-500 dark:text-gray-400">AAPL</p>
        </div>
      </div>
      <div class="text-right">
        <p class="text-sm font-medium text-gray-800 dark:text-white/90">$182.30</p>
        <p class="inline-flex items-center gap-1 text-xs font-medium text-success-500">
          <svg class="size-3"><path d="M5 15l7-7 7 7" stroke="currentColor" stroke-width="2" fill="none"/></svg>
          1.45%
        </p>
      </div>
    </div>
    <!-- repeat for SPOT, ABNB, etc. -->
  </div>
</div>
```

**Price change colors**:
- Up: `text-success-500` + up arrow
- Down: `text-error-500` + down arrow

---

## 8. Iconography

TailAdmin uses **Lucide** icons (clean, 1.5px stroke, 24px default). Recommended: `lucide` package or any equivalent (Heroicons, Phosphor).

**Standard icon sizes**:
- `size-3` (12px) — inline with text-xs (badges)
- `size-4` (16px) — inline with text-sm (buttons, dropdown items)
- `size-5` (20px) — default in nav, list items
- `size-6` (24px) — empty state, large buttons

**Always use `stroke-width="1.5"`** for the modern feel. Default stroke 2px looks too bold against Outfit.

**Lucide icon examples** (always `fill="none" stroke="currentColor"`):
```html
<!-- Calendar -->
<svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
  <rect x="3" y="4" width="18" height="18" rx="2" />
  <line x1="16" y1="2" x2="16" y2="6" />
  <line x1="8" y1="2" x2="8" y2="6" />
  <line x1="3" y1="10" x2="21" y2="10" />
</svg>

<!-- Chevron Right (for breadcrumbs) -->
<svg class="size-4 stroke-current" viewBox="0 0 20 20" fill="none">
  <path d="M7 5l5 5-5 5" stroke-width="1.5" stroke-linecap="round" />
</svg>

<!-- More Vertical (3-dot menu) -->
<svg class="size-5" viewBox="0 0 24 24" fill="currentColor">
  <circle cx="5" cy="12" r="1.5"/>
  <circle cx="12" cy="12" r="1.5"/>
  <circle cx="19" cy="12" r="1.5"/>
</svg>

<!-- Check Circle (success alert) -->
<svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
  <path d="M9 12l2 2 4-4M12 22a10 10 0 100-20 10 10 0 000 20z" stroke-linecap="round" stroke-linejoin="round" />
</svg>
```

---

## 9. Recipe Library

Quick copy-paste blocks for common pages.

### Login Page

```html
<body class="font-outfit bg-white dark:bg-gray-900">
  <div class="relative flex min-h-screen flex-col lg:flex-row">

    <div class="flex w-full flex-col px-6 py-10 lg:w-1/2 lg:px-16">
      <a href="/" class="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800
                         dark:text-gray-400 dark:hover:text-white/90">
        <svg class="size-4" viewBox="0 0 20 20" fill="none" stroke="currentColor">
          <path d="M12 5l-5 5 5 5" stroke-width="1.5" stroke-linecap="round" />
        </svg>
        Back to dashboard
      </a>

      <div class="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-12">
        <h1 class="text-[30px] font-bold text-gray-800 sm:text-[36px] dark:text-white/90">Sign In</h1>
        <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">Enter your email and password to sign in</p>

        <form class="mt-8 space-y-5">
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Email</label>
            <input type="email" placeholder="info@gmail.com" class="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90">
          </div>
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Password</label>
            <input type="password" placeholder="Enter your password" class="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90">
          </div>
          <div class="flex items-center justify-between">
            <label class="flex cursor-pointer select-none items-center gap-2 text-sm text-gray-700 dark:text-gray-400">
              <span class="relative">
                <input type="checkbox" class="peer sr-only">
                <span class="block h-5 w-5 rounded-md border-[1.25px] border-gray-300 transition peer-checked:border-brand-500 peer-checked:bg-brand-500 dark:border-gray-700"></span>
                <span class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 transition peer-checked:opacity-100">
                  <svg class="h-3.5 w-3.5" viewBox="0 0 14 14" fill="none"><path d="M3 7l3 3 5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </span>
              </span>
              Keep me logged in
            </label>
            <a href="/forgot-password" class="text-sm text-brand-500 hover:text-brand-600">Forgot password?</a>
          </div>
          <button type="submit" class="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand-500 px-4 py-3 text-sm font-medium text-white shadow-theme-xs transition hover:bg-brand-600">Sign In</button>
        </form>

        <p class="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          Don't have an account? <a href="/register" class="text-brand-500">Sign Up</a>
        </p>
      </div>
    </div>

    <div class="relative hidden flex-col items-center justify-center bg-brand-50 p-16 lg:flex lg:w-1/2 dark:bg-brand-500/10">
      <div class="absolute inset-0 opacity-10" style="background-image: radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0); background-size: 32px 32px;"></div>
      <div class="relative text-center text-brand-700 dark:text-white/90">
        <div class="mb-6 mx-auto flex size-16 items-center justify-center rounded-2xl bg-white shadow-theme-md dark:bg-white/5">
          <svg class="size-8 text-brand-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3"/></svg>
        </div>
        <p class="text-2xl font-semibold tracking-tight">Your Brand</p>
        <p class="mt-3 max-w-xs text-sm opacity-75">A tagline that explains what your product does</p>
      </div>
    </div>
  </div>
</body>
```

### Dashboard Page (grid layout)

```html
<div class="grid grid-cols-12 gap-4 md:gap-6">
  <!-- Row 1: 2 metric cards -->
  <div class="col-span-12 sm:col-span-6">
    <!-- Metric card 1 -->
  </div>
  <div class="col-span-12 sm:col-span-6">
    <!-- Metric card 2 -->
  </div>

  <!-- Row 2: Bar chart (7) + Radial (5) -->
  <div class="col-span-12 lg:col-span-7">
    <!-- Chart card (bar) -->
  </div>
  <div class="col-span-12 lg:col-span-5">
    <!-- Chart card (radial) -->
  </div>

  <!-- Row 3: Area chart (full width) -->
  <div class="col-span-12">
    <!-- Chart card (area) -->
  </div>

  <!-- Row 4: Map (5) + Table (7) -->
  <div class="col-span-12 lg:col-span-5">
    <!-- Map card -->
  </div>
  <div class="col-span-12 lg:col-span-7">
    <!-- Table card -->
  </div>
</div>
```

### Settings Page (form with sections)

```html
<div class="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
  <!-- Left: settings nav -->
  <aside class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
    <nav class="space-y-1">
      <a href="#" class="menu-item-active ...">Personal Info</a>
      <a href="#" class="menu-item-inactive ...">Account</a>
      <a href="#" class="menu-item-inactive ...">Password</a>
      <a href="#" class="menu-item-inactive ...">Notifications</a>
    </nav>
  </aside>

  <!-- Right: form -->
  <div class="md:col-span-2 space-y-4">
    <div class="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div class="px-6 py-5 border-b border-gray-100 dark:border-gray-800">
        <h3 class="text-base font-medium text-gray-800 dark:text-white/90">Personal Information</h3>
      </div>
      <div class="p-5 space-y-5">
        <!-- form fields -->
      </div>
    </div>
    <div class="flex justify-end gap-3">
      <button class="...">Cancel</button>
      <button class="...">Save Changes</button>
    </div>
  </div>
</div>
```

### Empty State

```html
<div class="flex flex-col items-center justify-center py-12 text-center">
  <div class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100
              dark:bg-white/5">
    <svg class="size-8 text-gray-400">...</svg>
  </div>
  <h3 class="text-base font-medium text-gray-800 dark:text-white/90">No data yet</h3>
  <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
    Get started by creating your first item.
  </p>
  <button class="mt-4 ...">Create Item</button>
</div>
```

### Loading Skeleton

```html
<div class="animate-pulse space-y-4">
  <div class="h-4 w-1/3 rounded bg-gray-200 dark:bg-gray-700"></div>
  <div class="h-4 w-1/2 rounded bg-gray-200 dark:bg-gray-700"></div>
  <div class="h-4 w-2/3 rounded bg-gray-200 dark:bg-gray-700"></div>
</div>
```

---

## 10. Anti-Patterns

❌ **Don't** use sharp corners — always `rounded-lg` (8px) minimum, `rounded-2xl` (16px) for cards.

❌ **Don't** use hard shadows like `shadow-md`/`shadow-lg` — use the soft `shadow-theme-*` scale.

❌ **Don't** use pure black `#000` — use `gray-900` (`#101828`) for text and bg.

❌ **Don't** use gradients on UI elements (except chart fills) — TailAdmin is flat.

❌ **Don't** use bright/neon colors — stick to the muted semantic palette (success-500 not lime-500).

❌ **Don't** mix light and dark tokens (e.g., `text-gray-800` in dark mode without `dark:text-white/90`).

❌ **Don't** use border-only on the inside of cards — use `border-t` on the body when there's a header.

❌ **Don't** use uppercase labels — except for the 12px tiny meta text (e.g., section headings `uppercase tracking-wider`).

❌ **Don't** center text in tables — left-align all columns.

❌ **Don't** use opacity for disabled buttons — combine `opacity-50 cursor-not-allowed` OR keep them visually distinct.

❌ **Don't** use red for "delete" buttons by default — use secondary style for destructive actions, reserve `error-500` for form errors and critical alerts.

❌ **Don't** apply hover styles to non-interactive elements — only buttons, links, cards-with-onClick.

---

## Quick Token Cheatsheet (copy-paste this block into AI prompts)

```
TailAdmin design tokens — use exactly these:

Colors:
- Brand: #465fff (primary), 50: #ecf3ff, 100: #dde9ff, 600: #3641f5, 700: #2a31d8
- Success: #12b76a (500), 50: #ecfdf3, dark/bg15: #12b76a26
- Error: #f04438 (500), 50: #fef3f2
- Warning: #f79009 (500), 50: #fffaeb
- Info: #0ba5ec (500), 50: #f0f9ff
- Gray 50: #f9fafb (page bg light), 100: #f2f4f7, 200: #e4e7ec (borders), 300: #d0d5dd (input borders), 500: #667085 (muted text), 700: #344054 (headings), 800: #1d2939, 900: #101828 (page bg dark)

Sizing:
- Inputs: h-11 (44px)
- Buttons: h-auto px-4 py-3 (default) or px-5 py-3.5 (large)
- Cards: rounded-2xl (16px)
- Modals: rounded-3xl (24px)
- Buttons/inputs: rounded-lg (8px)

Shadows:
- Buttons: shadow-theme-xs
- Cards: shadow-theme-sm (rarely visible) or no shadow with border
- Dropdowns: shadow-theme-lg
- Modals: shadow-theme-xl
- Focus ring: focus:ring-3 focus:ring-brand-500/10 (12% brand halo)

Typography:
- Font: Outfit (100-900 weights)
- Body: text-sm (14px)
- Micro: text-xs (12px)
- Titles: text-xl to text-3xl

Layout:
- Page max-width: max-w-[1536px] mx-auto
- Page padding: p-4 md:p-6
- Grid: grid grid-cols-12 gap-4 md:gap-6
- Card padding: p-5 md:p-6
- Section heading: mb-6

Patterns:
- Card: rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]
- Primary button: inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-3 text-sm font-medium text-white shadow-theme-xs transition hover:bg-brand-600
- Input: h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10
- Status pill: inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium
```
