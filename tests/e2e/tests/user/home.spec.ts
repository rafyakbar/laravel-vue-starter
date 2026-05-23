import { test, expect } from '@playwright/test'

/**
 * User role — home page tests.
 *
 * Home page labels (en.ts):
 *   - home.profile: "Profile"
 *   - home.signOut: "Sign Out"
 *   - home.goToAdmin: "Go to Admin" (should NOT be visible for user role)
 */
test.describe('User Role — Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test('shows Profile and Sign Out but NOT Go to Admin', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'Profile' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Sign Out' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Go to Admin' })).not.toBeVisible()
  })

  test('shows user avatar initials and name', async ({ page }) => {
    // Avatar initials span is visible
    await expect(page.locator('span.rounded-full')).toBeVisible()
    // User name is displayed (E2E User from auth setup)
    await expect(page.getByText('E2E User')).toBeVisible()
  })
})
