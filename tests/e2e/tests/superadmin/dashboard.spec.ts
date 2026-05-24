import { test, expect } from '@playwright/test'

/**
 * Superadmin role — dashboard and sidebar tests.
 *
 * Superadmin has ALL 11 permissions.
 *
 * Sidebar labels (en.ts):
 *   - nav.dashboard: "Dashboard"
 *   - nav.settings: "Settings" (visible — superadmin has view-users)
 *   - nav.users: "Users"
 *   - nav.roles: "Roles & Permissions"
 *   - nav.site: "Site"
 *
 * Landing page navbar (en.ts → landing.nav.*):
 *   - "Admin" button
 *   - User name button (link to profile)
 *   - "Sign Out" button
 */
test.describe('Superadmin Role — Dashboard', () => {
  test('can access /admin dashboard', async ({ page }) => {
    await page.goto('/admin')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveURL(/\/admin/)
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible()
  })

  test('dashboard shows welcome message with superadmin name', async ({ page }) => {
    await page.goto('/admin')
    await page.waitForLoadState('networkidle')
    await expect(page.getByText(/Hello, Super Admin!/)).toBeVisible()
  })

  test('sidebar shows Settings group with Users and Roles & Permissions', async ({ page }) => {
    await page.goto('/admin')
    await page.waitForLoadState('networkidle')
    const sidebarContent = page.locator('[data-sidebar="content"]')
    await expect(sidebarContent.getByText('Settings')).toBeVisible()
    await expect(sidebarContent.getByRole('link', { name: 'Users' })).toBeVisible()
    await expect(sidebarContent.getByRole('link', { name: 'Roles & Permissions' })).toBeVisible()
  })

  test('sidebar shows Site link', async ({ page }) => {
    await page.goto('/admin')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('[data-sidebar="content"]').getByRole('link', { name: 'Site' })).toBeVisible()
  })

  test('home page shows Admin button and Sign Out for superadmin', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    const navbar = page.locator('[data-slot="public-navbar"]')
    await expect(navbar.getByRole('button', { name: 'Admin', exact: true })).toBeVisible()
    await expect(navbar.getByRole('button', { name: 'Sign Out' })).toBeVisible()
  })
})