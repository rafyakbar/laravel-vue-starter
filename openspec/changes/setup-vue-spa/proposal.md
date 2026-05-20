## Why

The project is a fresh Laravel 13 skeleton with Tailwind CSS 4 and Vite 8 already installed, but no frontend framework or SPA infrastructure. We need to bootstrap the Vue 3 SPA foundation — Vue Router, Pinia, TypeScript, and the catch-all route pattern — so all subsequent features (auth, UI components, pages) can be built on a working SPA shell.

## What Changes

- Install Vue 3, Vue Router 5, Pinia 3, and TypeScript as frontend dependencies
- Install shadcn-vue with its peer dependencies (Radix Vue, class-variance-authority, clsx, tailwind-merge, Lucide Vue Next)
- Reconfigure Vite to use the Vue plugin, TypeScript, and resolve `@` → `resources/app/`
- Move frontend entry point from `resources/js/app.js` to `resources/app/main.ts`
- Create the SPA directory structure under `resources/app/` (views, components, stores, services, router, layouts)
- Create a minimal Vue app shell with router-view, a blank layout, and a placeholder home page
- Add a Laravel SpaController with a catch-all route serving a single Blade entry point
- Configure Vite's `app.css` import within the new entry point
- Add TypeScript config (`tsconfig.json`, `tsconfig.app.json`)
- Verify the app boots and renders the placeholder page

## Capabilities

### New Capabilities
- `vue-spa-shell`: Core Vue 3 SPA bootstrapping — app entry, router setup, Pinia initialization, base layout, and catch-all Laravel route
- `shadcn-vue-setup`: shadcn-vue installation, Tailwind CSS 4 integration, component resolver configuration, and base utility helpers (cn)
- `typescript-config`: TypeScript configuration for the Vue SPA, including path aliases and strict mode

### Modified Capabilities
<!-- None — no existing specs to modify -->

## Impact

- **Dependencies (npm)**: vue@^3.5, vue-router@^5.0, pinia@^3.0, typescript@^6.0, vue-tsc@^2, @vitejs/plugin-vue@^6, @vue/tsconfig@^0.7, radix-vue@^1, class-variance-authority@^0.7, clsx@^2, tailwind-merge@^3, lucide-vue-next@^0.500
- **Dependencies (composer)**: none added in this change
- **Files removed**: `resources/js/app.js` (replaced by `resources/app/main.ts`)
- **Files modified**: `vite.config.js` → `vite.config.ts`, `resources/views/` gains `spa.blade.php`
- **Routes**: New catch-all web route for SPA
- **Breaking**: None (greenfield project)
