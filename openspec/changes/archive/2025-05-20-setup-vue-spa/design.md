## Context

The project is a fresh Laravel 13 skeleton with Tailwind CSS 4 and Vite 8 pre-installed. The current entry point is `resources/js/app.js` with basic CSS at `resources/css/app.css`. No frontend framework, router, or state management exists yet.

The target architecture is a single-page application where Laravel serves one Blade view via a catch-all route, and Vue Router handles all client-side navigation. All data flows through JSON API endpoints.

## Goals / Non-Goals

**Goals:**
- Bootstrap a fully working Vue 3 SPA with TypeScript
- Establish the directory structure and conventions that all future features will follow
- Install and configure shadcn-vue so UI components can be added incrementally
- Ensure `npm run dev` and `npm run build` produce a working application
- Set up the catch-all route pattern for SPA routing

**Non-Goals:**
- Authentication (Fortify/Sanctum setup is a separate change)
- Adding specific shadcn-vue components beyond the base `cn` utility
- Creating real pages or features — only a placeholder home page
- Dark mode toggle UI (infrastructure only via class strategy)
- API endpoints or backend logic

## Decisions

### 1. Entry point location: `resources/app/main.ts`

**Choice**: Move from `resources/js/app.js` to `resources/app/main.ts`

**Rationale**: The project convention specifies `resources/app/` as the frontend root. Using TypeScript from the start prevents a later migration. The Vite alias `@` maps here.

**Alternatives considered**:
- `resources/js/app.ts` — Standard Laravel default but conflicts with project convention
- `resources/ts/app.ts` — Non-standard, adds confusion

### 2. Vite config: Rename to `vite.config.ts`

**Choice**: Convert `vite.config.js` to `vite.config.ts` for type safety and IDE completion.

**Rationale**: With TypeScript in the project, the config file benefits from type checking. Vite natively supports `.ts` config files.

### 3. Vue Router mode: HTML5 History

**Choice**: Use `createWebHistory()` with the catch-all route handling 404s server-side.

**Rationale**: Clean URLs (no hash), standard for SPAs behind a web server. The catch-all route ensures Laravel always serves the SPA shell for non-API routes.

### 4. shadcn-vue initialization: Manual setup (no CLI)

**Choice**: Manually install dependencies and create the `components.json` + `cn` utility rather than using `npx shadcn-vue@latest init`.

**Rationale**: The CLI makes assumptions about directory structure (uses `src/` by default). Manual setup gives full control over paths matching our `resources/app/` convention and avoids interactive prompts in CI.

### 5. Tailwind CSS 4 integration with shadcn-vue

**Choice**: Use CSS-first configuration (`@theme` in CSS) rather than `tailwind.config.js`.

**Rationale**: Tailwind CSS 4 is already installed and uses the new CSS-based config approach. shadcn-vue works with Tailwind 4 using CSS variables for theming.

### 6. SpaController as a dedicated controller

**Choice**: Create `App\Http\Controllers\SpaController` with a single `__invoke` method.

**Rationale**: Clean separation. The catch-all route points to a named controller rather than an inline closure, making it testable and refactorable.

## File Structure

```
resources/app/
├── main.ts                          # App entry point
├── App.vue                          # Root component with <router-view>
├── router/
│   └── index.ts                     # Vue Router setup
├── stores/
│   └── index.ts                     # Pinia initialization (empty for now)
├── services/                        # API services (empty for now)
├── components/
│   └── ui/                          # shadcn-vue components (added later)
├── views/
│   ├── layouts/
│   │   └── DefaultLayout.vue        # Base layout wrapper
│   └── pages/
│       └── HomePage.vue             # Placeholder page
├── assets/
│   └── css/
│       └── app.css                  # Tailwind imports + shadcn-vue CSS variables
└── lib/
    └── utils.ts                     # cn() utility for class merging

app/Http/Controllers/
└── SpaController.php                # Catch-all controller

resources/views/
└── spa.blade.php                    # Single Blade entry point

tsconfig.json                        # Root TypeScript config
tsconfig.app.json                    # App-specific TypeScript config
components.json                      # shadcn-vue configuration
vite.config.ts                       # Updated Vite config (renamed from .js)
```

## Key Configuration Snippets

### vite.config.ts
```typescript
import { defineConfig } from 'vite'
import laravel from 'laravel-vite-plugin'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    laravel({
      input: ['resources/app/assets/css/app.css', 'resources/app/main.ts'],
      refresh: true,
    }),
    vue(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'resources/app'),
    },
  },
})
```

### spa.blade.php
```html
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ config('app.name') }}</title>
    @vite(['resources/app/assets/css/app.css', 'resources/app/main.ts'])
</head>
<body>
    <div id="app"></div>
</body>
</html>
```

### Catch-all route (routes/web.php)
```php
Route::get('/{any?}', SpaController::class)
    ->where('any', '.*')
    ->name('spa');
```

### components.json (shadcn-vue config)
```json
{
  "$schema": "https://shadcn-vue.com/schema.json",
  "style": "default",
  "typescript": true,
  "tailwind": {
    "config": "",
    "css": "resources/app/assets/css/app.css",
    "baseColor": "neutral",
    "cssVariables": true
  },
  "framework": "vite",
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
```

## Risks / Trade-offs

- **[Risk] shadcn-vue + Tailwind 4 compatibility** → Mitigation: shadcn-vue has official Tailwind 4 support since v0.12. Use latest stable versions.
- **[Risk] Catch-all route conflicts with API routes** → Mitigation: API routes are registered in `routes/api.php` with `/api` prefix, loaded before web routes. The catch-all has a `where` constraint and is registered last.
- **[Risk] Manual shadcn-vue setup may drift from upstream** → Mitigation: Keep `components.json` standard so the CLI can add individual components later.
- **[Trade-off] No SSR** → Acceptable for an admin panel. SEO is not a concern for authenticated admin views.
