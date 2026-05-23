import { test, expect } from '@playwright/test'

/**
 * User role — profile page tests.
 *
 * Profile page labels (en.ts):
 *   - pages.profile.title: "Profile"
 *   - pages.profile.description: "Your account information"
 *   - pages.profile.comingSoon: "Coming Soon"
 *
 * User role uses DefaultLayout (no admin sidebar).
 */
test.describe('User Role — Profile Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/profile')
    await page.waitForLoadState('networkidle')
  })

  test('can access /profile page', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Profile' })).toBeVisible()
  })

  test('profile renders in DefaultLayout (no admin sidebar)', async ({ page }) => {
    // Admin sidebar has "Dashboard" nav link — should NOT be present for user role
    await expect(page.getByRole('link', { name: 'Dashboard' })).not.toBeVisible()
  })

  test('profile shows user name and email', async ({ page }) => {
    await expect(page.getByText('E2E User')).toBeVisible()
    await expect(page.getByText('e2e_user@example.com')).toBeVisible()
  })

  test('profile shows role badge', async ({ page }) => {
    // Role badge uses shadcn Badge component with text "user"
    // Use data-slot="badge" to be more specific
    await expect(page.locator('[data-slot="badge"]').filter({ hasText: 'user' })).toBeVisible()
  })

  test('profile shows Coming Soon badge', async ({ page }) => {
    await expect(page.getByText('Coming Soon')).toBeVisible()
  })
})
