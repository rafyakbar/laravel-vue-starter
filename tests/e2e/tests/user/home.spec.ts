import { test, expect } from '@playwright/test'

/**
 * User role — home page tests.
 *
 * Landing page navbar (desktop) shows for authenticated users:
 *   - User name button (link to profile)
 *   - "Sign Out" button
 *   - "Admin" button (only if user has access-admin-panel — NOT for user role)
 *
 * User role does NOT have access-admin-panel permission.
 */
test.describe('User Role — Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test('shows user name and Sign Out in navbar', async ({ page }) => {
    const navbar = page.locator('[data-slot="public-navbar"]')
    await expect(navbar.getByRole('button', { name: /E2E User/ })).toBeVisible()
    await expect(navbar.getByRole('button', { name: 'Sign Out' })).toBeVisible()
  })

  test('does NOT show Admin button for user role', async ({ page }) => {
    const navbar = page.locator('[data-slot="public-navbar"]')
    await expect(navbar.getByRole('button', { name: 'Admin' })).not.toBeVisible()
  })

  test('profile link navigates to /profile', async ({ page }) => {
    await page.locator('[data-slot="public-navbar"]').getByRole('button', { name: /E2E User/ }).click()
    await expect(page).toHaveURL('/profile')
  })

  test('shows landing page content', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Laravel Vue Starter/ })).toBeVisible()
  })
})