import { test, expect } from '@playwright/test'

/**
 * User role — sign out test.
 *
 * IMPORTANT: This test invalidates the session. It MUST run last (filename 'signout'
 * sorts after 'home', 'profile', 'restricted' alphabetically).
 *
 * After sign out, guest buttons "Sign In" and "Sign Up" should appear.
 */
test.describe('User Role — Sign Out', () => {
  test('can sign out from home page navbar', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await page.locator('[data-slot="public-navbar"]').getByRole('button', { name: 'Sign Out' }).click()
    const navbar = page.locator('[data-slot="public-navbar"]')
    await expect(navbar.getByRole('button', { name: 'Sign In' })).toBeVisible()
    await expect(navbar.getByRole('button', { name: 'Sign Up' })).toBeVisible()
  })
})