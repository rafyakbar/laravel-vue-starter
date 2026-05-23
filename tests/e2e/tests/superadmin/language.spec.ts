import { test, expect } from '@playwright/test'

/**
 * Superadmin role — language switching tests.
 *
 * Superadmin has Settings group visible — verify it also translates.
 *
 * EN: "Settings", "Users", "Roles & Permissions"
 * ID: "Pengaturan", "Pengguna", "Peran & Izin"
 *
 * Home EN: "Go to Admin", "Profile", "Sign Out"
 * Home ID: "Buka Admin", "Profil", "Keluar"
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
    // Settings group is open by default — Users link should be visible without clicking
    await expect(sidebarContent.getByRole('link', { name: 'Users' })).toBeVisible()

    // Switch to Indonesian
    await page.getByRole('button', { name: 'Language' }).click()
    await page.getByText('Indonesia').click()
    await page.waitForLoadState('networkidle')

    // Settings group should now show Indonesian labels (still open by default)
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
    // Home buttons in Indonesian
    await expect(page.getByRole('link', { name: 'Buka Admin' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Profil' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Keluar' })).toBeVisible()
  })
})
