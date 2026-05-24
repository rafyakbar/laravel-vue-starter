import { test, expect } from '@playwright/test'

test.describe('Admin Role — Sign Out from Mobile Bottom Nav', () => {
  test.use({ viewport: { width: 375, height: 667 } })

  test('Sign Out from bottom nav dropdown logs admin out on mobile', async ({ page }) => {
    await page.goto('/admin')
    await page.waitForLoadState('networkidle')
    await page.locator('nav.md\\:hidden').getByRole('button', { name: 'Profile' }).click()
    await page.getByRole('menuitem', { name: 'Sign Out' }).click()
    const bottomNav = page.locator('nav.md\\:hidden')
    await expect(bottomNav.getByRole('button', { name: 'Sign In' })).toBeVisible()
  })
})
