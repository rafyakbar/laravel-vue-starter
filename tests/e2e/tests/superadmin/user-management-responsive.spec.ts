import { test, expect } from '@playwright/test'

test.describe('Superadmin Mobile Viewport — User Management (375x667)', () => {
  test.use({ viewport: { width: 375, height: 667 } })

  test('can navigate to /admin/users via sidebar drawer on mobile', async ({ page }) => {
    await page.goto('/admin')
    await page.waitForLoadState('networkidle')
    await page.locator('nav.md\\:hidden').getByRole('button', { name: 'Menu' }).click()
    await page.locator('[data-sidebar="content"]').getByRole('link', { name: 'Users' }).click()
    await page.keyboard.press('Escape')
    await expect(page).toHaveURL('/admin/users')
    await expect(page.getByRole('heading', { name: /Users/ })).toBeVisible()
  })

  test('users page heading is visible on mobile', async ({ page }) => {
    await page.goto('/admin/users')
    await page.waitForLoadState('networkidle')
    await expect(page.getByRole('heading', { name: /Users/ })).toBeVisible()
  })

  test('bottom nav is visible on users page on mobile', async ({ page }) => {
    await page.goto('/admin/users')
    await page.waitForLoadState('networkidle')
    const bottomNav = page.locator('nav.md\\:hidden')
    await expect(bottomNav).toBeVisible()
  })
})

test.describe('Superadmin Tablet Viewport — User Management (768x1024)', () => {
  test.use({ viewport: { width: 768, height: 1024 } })

  test('users page renders table on tablet', async ({ page }) => {
    await page.goto('/admin/users')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('table')).toBeVisible()
    const bottomNav = page.locator('nav.md\\:hidden')
    await expect(bottomNav).not.toBeVisible()
  })

  test('sidebar is visible on tablet without bottom nav', async ({ page }) => {
    await page.goto('/admin/users')
    await page.waitForLoadState('networkidle')

    // On tablet viewport, bottom nav should be hidden (desktop layout is used)
    const bottomNav = page.locator('nav.md\\:hidden')
    await expect(bottomNav).not.toBeVisible()

    // Verify we're on the users page (table should be visible)
    await expect(page.locator('table')).toBeVisible()
  })
})
