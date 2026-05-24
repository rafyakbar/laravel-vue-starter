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
 * Landing page navbar (en.ts → landing.nav.*):
 *   - "Admin" button (visible for users with access-admin-panel)
 *   - User name button (link to profile)
 *   - "Sign Out" button
 */
test.describe('Admin Role — Dashboard', () => {
  test('can access /admin dashboard', async ({ page }) => {
    await page.goto('/admin')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveURL(/\/admin/)
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible()
  })

  test('dashboard shows welcome message with admin name', async ({ page }) => {
    await page.goto('/admin')
    await page.waitForLoadState('networkidle')
    await expect(page.getByText(/Hello, Admin User!/)).toBeVisible()
  })

  test('sidebar shows Dashboard nav item', async ({ page }) => {
    await page.goto('/admin')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('[data-sidebar="content"]').getByRole('link', { name: 'Dashboard' })).toBeVisible()
  })

  test('sidebar does NOT show Settings group (admin lacks view-users)', async ({ page }) => {
    await page.goto('/admin')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('[data-sidebar="content"]').getByText('Settings')).not.toBeVisible()
  })

  test('sidebar shows Site link', async ({ page }) => {
    await page.goto('/admin')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('[data-sidebar="content"]').getByRole('link', { name: 'Site' })).toBeVisible()
  })

  test('home page shows Admin button and Sign Out for admin', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    const navbar = page.locator('[data-slot="public-navbar"]')
    await expect(navbar.getByRole('button', { name: 'Admin', exact: true })).toBeVisible()
    await expect(navbar.getByRole('button', { name: 'Sign Out' })).toBeVisible()
  })
})