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
    await expect(page.getByText(/Hello/)).toBeVisible()
    // Welcome message contains "Super Admin" — use first() in case name appears in sidebar too
    await expect(page.getByText(/Hello.*Super Admin/)).toBeVisible()
  })

  test('sidebar shows Settings group with Users and Roles & Permissions', async ({ page }) => {
    await page.goto('/admin')
    await page.waitForLoadState('networkidle')
    // Settings group is visible (superadmin has view-users)
    // Use the sidebar content area (not the collapsed icon sidebar)
    const sidebarContent = page.locator('[data-sidebar="content"]')
    await expect(sidebarContent.getByText('Settings')).toBeVisible()
    // Settings group is open by default (openGroups: { 'admin.users': true })
    // Users and Roles & Permissions links should already be visible
    await expect(sidebarContent.getByRole('link', { name: 'Users' })).toBeVisible()
    await expect(sidebarContent.getByRole('link', { name: 'Roles & Permissions' })).toBeVisible()
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
