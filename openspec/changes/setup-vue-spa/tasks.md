## 1. Install Frontend Dependencies

- [ ] 1.1 Install Vue 3, Vue Router, and Pinia: `npm install vue@^3.5 vue-router@^5.0 pinia@^3.0`
- [ ] 1.2 Install TypeScript tooling: `npm install -D typescript@^6.0 vue-tsc@^2 @vitejs/plugin-vue@^6 @vue/tsconfig@^0.7`
- [ ] 1.3 Install shadcn-vue dependencies: `npm install radix-vue@^1 class-variance-authority@^0.7 clsx@^2 tailwind-merge@^3 lucide-vue-next@^0.500`

## 2. TypeScript Configuration

- [ ] 2.1 Create `tsconfig.json` at project root with references to `tsconfig.app.json`
- [ ] 2.2 Create `tsconfig.app.json` with strict mode, ESNext target, path alias `@` → `resources/app/*`, and Vue-specific compiler options
- [ ] 2.3 Create `resources/app/env.d.ts` with Vue module shim (`declare module '*.vue'`)

## 3. Vite Configuration

- [ ] 3.1 Delete `vite.config.js` and create `vite.config.ts` with Vue plugin, updated entry points (`resources/app/assets/css/app.css`, `resources/app/main.ts`), and `@` resolve alias
- [ ] 3.2 Remove old `resources/js/app.js` and `resources/css/app.css` (content moves to new locations)

## 4. shadcn-vue Setup

- [ ] 4.1 Create `components.json` at project root with shadcn-vue configuration pointing to `resources/app/` paths
- [ ] 4.2 Create `resources/app/lib/utils.ts` with the `cn()` utility function (clsx + tailwind-merge)
- [ ] 4.3 Create `resources/app/assets/css/app.css` with Tailwind CSS 4 imports, `@theme` directive for shadcn-vue design tokens, and CSS variables for light/dark themes

## 5. Vue Application Shell

- [ ] 5.1 Create `resources/app/main.ts` — create Vue app, install Pinia and Router, mount to `#app`
- [ ] 5.2 Create `resources/app/App.vue` — root component with `<router-view>`
- [ ] 5.3 Create `resources/app/router/index.ts` — Vue Router with history mode, home route pointing to HomePage
- [ ] 5.4 Create `resources/app/stores/index.ts` — Pinia store initialization (exportable createPinia or empty placeholder)
- [ ] 5.5 Create `resources/app/views/layouts/DefaultLayout.vue` — base layout with `<slot>`
- [ ] 5.6 Create `resources/app/views/pages/HomePage.vue` — placeholder page with confirmation heading

## 6. Laravel Backend (SPA Catch-All)

- [ ] 6.1 Create `app/Http/Controllers/SpaController.php` — invokable controller returning `spa` view
- [ ] 6.2 Create `resources/views/spa.blade.php` — Blade entry point with `@vite` directive loading CSS and TS entry
- [ ] 6.3 Update `routes/web.php` — add catch-all route `/{any?}` pointing to `SpaController`, constrained with `->where('any', '.*')`

## 7. Verification

- [ ] 7.1 Run `npm run build` — confirm Vite compiles without errors
- [ ] 7.2 Run `npx vue-tsc --noEmit` — confirm TypeScript passes with no type errors
- [ ] 7.3 Run `php artisan test --compact` — confirm existing Laravel tests still pass
- [ ] 7.4 Verify app loads in browser at `/` and displays the placeholder home page
