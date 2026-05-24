import { test, expect } from '@playwright/test'

/**
 * Superadmin role — language switching tests.
 *
 * Superadmin has Settings group visible — verify it also translates.
 *
 * EN: "Settings", "Users", "Roles & Permissions"
 * ID: "Pengaturan", "Pengguna", "Peran & Izin"
 *
 * Landing page navbar (en/id):
 *   EN: "Admin" button, user name, "Sign Out"
 *   ID: "Admin" button, user name, "Keluar"
 */
test.describe('Superadmin Role — Language Switching', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/admin')
    await page.waitForLoadState('networkidle')
    await page.evaluate(() => localStorage.removeItem('locale'))
    await page.reload()
    await page.waitForLoadState('networkidle')
  })

  test('sidebar Settings group shows Indonesian labels after switch', async ({ page }) => {
    const sidebarContent = page.locator('[data-sidebar="content"]')
    await expect(sidebarContent.getByRole('link', { name: 'Users' })).toBeVisible()

    // Switch to Indonesian
    await page.getByRole('button', { name: 'Language' }).click()
    await page.getByText('Indonesia').click()
    await page.waitForLoadState('networkidle')

    // Settings group should show Indonesian labels
    await expect(sidebarContent.getByText('Pengaturan')).toBeVisible()
    await expect(sidebarContent.getByRole('link', { name: 'Pengguna' })).toBeVisible()
    await expect(sidebarContent.getByRole('link', { name: 'Peran & Izin' })).toBeVisible()
  })

  test('home page shows Indonesian buttons after switch', async ({ page }) => {
    // Switch to Indonesian
    await page.getByRole('button', { name: 'Language' }).click()
    await page.getByText('Indonesia').click()
    await page.waitForLoadState('networkidle')

    // Navigate to home
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    // Landing navbar shows "Admin" (same in both languages) and "Keluar" (Sign Out in ID)
    const navbar = page.locator('[data-slot="public-navbar"]')
    await expect(navbar.getByRole('button', { name: 'Admin', exact: true })).toBeVisible()
    await expect(navbar.getByRole('button', { name: 'Keluar' })).toBeVisible()
  })
})