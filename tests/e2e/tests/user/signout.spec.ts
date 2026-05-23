import { test, expect } from '@playwright/test'

/**
 * User role — sign out test.
 *
 * IMPORTANT: This test invalidates the session. It MUST run last (filename 'signout'
 * sorts after 'home', 'profile', 'restricted' alphabetically).
 */
test.describe('User Role — Sign Out', () => {
  test('can sign out from home page', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Sign Out' }).click()
    // After logout, guest buttons appear
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Sign Up' })).toBeVisible()
  })
})
