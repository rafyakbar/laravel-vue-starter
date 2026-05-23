import { test, expect } from '@playwright/test'

/**
 * Admin role — restricted pages and guest page guard tests.
 *
 * Admin visiting /admin/users or /admin/roles → redirected to /admin (dashboard)
 * because guard redirects to admin.dashboard when user has access-admin-panel.
 *
 * Admin visiting guest pages (/login, /register, /forgot-password) → redirected to /admin.
 */
test.describe('Admin Role — Restricted Pages', () => {
  test('visiting /admin/users redirects to /admin dashboard', async ({ page }) => {
    await page.goto('/admin/users')
    await page.waitForLoadState('networkidle')
    // Guard: has access-admin-panel → redirect to admin.dashboard
    await expect(page).toHaveURL(/\/admin$|\/admin\//)
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible()
  })

  test('visiting /admin/roles redirects to /admin dashboard', async ({ page }) => {
    await page.goto('/admin/roles')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveURL(/\/admin$|\/admin\//)
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible()
  })

  test('profile renders inside AdminLayout (sidebar visible)', async ({ page }) => {
    await page.goto('/profile')
    await page.waitForLoadState('networkidle')
    // AdminLayout has sidebar with Dashboard link — scope to sidebar content
    await expect(page.locator('[data-sidebar="content"]').getByRole('link', { name: 'Dashboard' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Profile' })).toBeVisible()
  })

  test('visiting /login redirects to admin dashboard (guest page guard)', async ({ page }) => {
    await page.goto('/login')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveURL(/\/admin/)
  })

  test('visiting /register redirects to admin dashboard', async ({ page }) => {
    await page.goto('/register')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveURL(/\/admin/)
  })

  test('visiting /forgot-password redirects to admin dashboard', async ({ page }) => {
    await page.goto('/forgot-password')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveURL(/\/admin/)
  })
})
