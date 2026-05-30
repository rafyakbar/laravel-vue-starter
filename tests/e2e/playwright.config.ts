import { defineConfig, devices } from '@playwright/test'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const authDir = path.join(__dirname, '.auth')

/**
 * Playwright E2E configuration for laravel-vue-starter.
 *
 * Project dependency chain:
 *   global-setup → auth-setup → [guest, user, admin, superadmin]
 *
 * Run: npm run test:e2e
 * UI:  npm run test:e2e:ui
 */
export default defineConfig({
  testDir: '.',

  // Run tests in files in parallel
  fullyParallel: false,

  // Fail the build on CI if test.only is accidentally left in
  forbidOnly: !!process.env.CI,

  // Retry on CI only
  retries: process.env.CI ? 2 : 0,

  // Single worker to avoid session conflicts between role tests
  workers: 1,

  reporter: [['html', { outputFolder: '../../playwright-report', open: 'never' }], ['list']],

  use: {
    baseURL: 'http://laravel-vue-starter.test',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    // ─── 1. Global setup: migrate:fresh --seed + npm run build ───────────────
    {
      name: 'global-setup',
      testMatch: '**/global.setup.ts',
    },

    // ─── 2. Auth setup: login per role → save storageState ───────────────────
    {
      name: 'auth-setup',
      testMatch: '**/auth.setup.ts',
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['global-setup'],
    },

    // ─── 3. Guest tests (explicitly unauthenticated) ──────────────────────────
    {
      name: 'guest',
      testDir: './tests/guest',
      use: {
        ...devices['Desktop Chrome'],
        storageState: { cookies: [], origins: [] },
      },
      dependencies: ['global-setup'],
    },

    // ─── 4. Auth flow tests (login, register, forgot-password) ───────────────
    {
      name: 'auth',
      testDir: './tests/auth',
      use: {
        ...devices['Desktop Chrome'],
        storageState: { cookies: [], origins: [] },
      },
      dependencies: ['global-setup'],
    },

    // ─── 5. User role tests ───────────────────────────────────────────────────
    {
      name: 'user',
      testDir: './tests/user',
      use: {
        ...devices['Desktop Chrome'],
        storageState: path.join(authDir, 'user.json'),
      },
      dependencies: ['auth-setup'],
    },

    // ─── 6. Admin role tests ──────────────────────────────────────────────────
    {
      name: 'admin',
      testDir: './tests/admin',
      use: {
        ...devices['Desktop Chrome'],
        storageState: path.join(authDir, 'admin.json'),
      },
      dependencies: ['auth-setup'],
    },

    // ─── 7. Superadmin role tests ─────────────────────────────────────────────
    {
      name: 'superadmin',
      testDir: './tests/superadmin',
      use: {
        ...devices['Desktop Chrome'],
        storageState: path.join(authDir, 'superadmin.json'),
      },
      dependencies: ['auth-setup'],
    },
  ],

  // Auto-start Laravel dev server when not already running (local dev uses Laragon)
  webServer: {
    command: 'php artisan serve --host=127.0.0.1 --port=8765',
    cwd: path.resolve(__dirname, '../..'),
    url: 'http://laravel-vue-starter.test',
    reuseExistingServer: true, // always reuse — Laragon is running
    timeout: 30000,
  },
})
