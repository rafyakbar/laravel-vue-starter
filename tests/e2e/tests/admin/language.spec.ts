import { test, expect } from '@playwright/test'

/**
 * Admin role — language switching tests.
 *
 * Language menu: Languages icon button (sr-only "Language")
 * Options: "English" (en) / "Indonesia" (id)
 *
 * EN labels: Dashboard, Settings, Site, Sign Out
 * ID labels: Dasbor, Pengaturan, Situs, Keluar
 *
 * Home EN: "Go to Admin", "Profile", "Sign Out"
 * Home ID: "Buka Admin", "Profil", "Keluar"
 */
test.describe('Admin Role — Language Switching', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage to reset locale to default (en)
    await page.goto('/admin')
    await page.waitForLoadState('networkidle')
    await page.evaluate(() => localStorage.removeItem('locale'))
    await page.reload()
    await page.waitForLoadState('networkidle')
  })

  test('admin panel defaults to English', async ({ page }) => {
    await expect(page.locator('[data-sidebar="content"]').getByRole('link', { name: 'Dashboard' })).toBeVisible()
  })

  test('switching to Indonesian changes sidebar nav labels', async ({ page }) => {
    // Open language dropdown — button has sr-only text "Language"
    await page.getByRole('button', { name: 'Language' }).click()
    await page.getByText('Indonesia').click()
    await page.waitForLoadState('networkidle')
    // Sidebar should now show Indonesian labels
    await expect(page.locator('[data-sidebar="content"]').getByRole('link', { name: 'Dasbor' })).toBeVisible()
  })

  test('switching to Indonesian changes page content', async ({ page }) => {
    await page.getByRole('button', { name: 'Language' }).click()
    await page.getByText('Indonesia').click()
    await page.waitForLoadState('networkidle')
    // Dashboard description: "Selamat datang di panel admin Anda"
    await expect(page.getByText(/Selamat datang/)).toBeVisible()
  })

  test('switching back to English restores labels', async ({ page }) => {
    // Switch to Indonesian first
    await page.getByRole('button', { name: 'Language' }).click()
    await page.getByText('Indonesia').click()
    await page.waitForLoadState('networkidle')
    await expect(page.locator('[data-sidebar="content"]').getByRole('link', { name: 'Dasbor' })).toBeVisible()

    // Switch back to English — in ID locale, the Language button sr-only text is "Bahasa"
    await page.getByRole('button', { name: 'Bahasa' }).click()
    await page.getByText('Inggris').click()
    await page.waitForLoadState('networkidle')
    await expect(page.locator('[data-sidebar="content"]').getByRole('link', { name: 'Dashboard' })).toBeVisible()
  })

  test('language preference persists after page reload', async ({ page }) => {
    await page.getByRole('button', { name: 'Language' }).click()
    await page.getByText('Indonesia').click()
    await page.waitForLoadState('networkidle')
    await expect(page.locator('[data-sidebar="content"]').getByRole('link', { name: 'Dasbor' })).toBeVisible()

    await page.reload()
    await page.waitForLoadState('networkidle')
    await expect(page.locator('[data-sidebar="content"]').getByRole('link', { name: 'Dasbor' })).toBeVisible()
  })
})
