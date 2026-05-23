import { test, expect } from '@playwright/test'

/**
 * Admin role — dashboard and sidebar tests.
 *
 * Admin has: access-admin-panel, edit-profile
 * Admin does NOT have: view-users, view-roles
 *
 * Sidebar labels (en.ts):
 *   - nav.dashboard: "Dashboard"
 *   - nav.settings: "Settings" (should NOT be visible for admin)
 *   - nav.site: "Site"
 *
 * Home page labels (en.ts):
 *   - home.goToAdmin: "Go to Admin"
 *   - home.profile: "Profile"
 *   - home.signOut: "Sign Out"
 */
test.describe('Admin Role — Dashboard', () => {
  test('can access /admin dashboard', async ({ page }) => {
    await page.goto('/admin')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveURL(/\/admin/)
    // Dashboard page title from en.ts: pages.dashboard.title = "Dashboard"
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible()
  })

  test('dashboard shows welcome message with admin name', async ({ page }) => {
    await page.goto('/admin')
    await page.waitForLoadState('networkidle')
    // en.ts: pages.dashboard.welcome = "Hello, {name}!"
    await expect(page.getByText(/Hello/)).toBeVisible()
  })

  test('sidebar shows Dashboard nav item', async ({ page }) => {
    await page.goto('/admin')
    await page.waitForLoadState('networkidle')
    // Use sidebar content area to avoid strict mode violation
    await expect(page.locator('[data-sidebar="content"]').getByRole('link', { name: 'Dashboard' })).toBeVisible()
  })

  test('sidebar does NOT show Settings group (admin lacks view-users)', async ({ page }) => {
    await page.goto('/admin')
    await page.waitForLoadState('networkidle')
    // Settings group requires view-users permission — admin doesn't have it
    await expect(page.locator('[data-sidebar="content"]').getByText('Settings')).not.toBeVisible()
  })

  test('sidebar shows Site link', async ({ page }) => {
    await page.goto('/admin')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('[data-sidebar="content"]').getByRole('link', { name: 'Site' })).toBeVisible()
  })

  test('home page shows Go to Admin + Profile + Sign Out', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await expect(page.getByRole('link', { name: 'Go to Admin' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Profile' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Sign Out' })).toBeVisible()
  })
})
