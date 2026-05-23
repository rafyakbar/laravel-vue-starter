import { test, expect } from '@playwright/test'

/**
 * User role — restricted access tests.
 *
 * User role (edit-profile only) cannot access:
 *   - /admin → redirects to /
 *   - /admin/users → redirects to /
 *   - /admin/roles → redirects to /
 *
 * Guest pages are blocked for authenticated users:
 *   - /login → redirects to /
 *   - /register → redirects to /
 *   - /forgot-password → redirects to /
 */
test.describe('User Role — Restricted Access', () => {
  test('visiting /admin redirects to home', async ({ page }) => {
    await page.goto('/admin')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveURL('/')
  })

  test('visiting /admin/users redirects to home', async ({ page }) => {
    await page.goto('/admin/users')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveURL('/')
  })

  test('visiting /admin/roles redirects to home', async ({ page }) => {
    await page.goto('/admin/roles')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveURL('/')
  })

  test('visiting /login redirects to home (guest page guard)', async ({ page }) => {
    await page.goto('/login')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveURL('/')
  })

  test('visiting /register redirects to home', async ({ page }) => {
    await page.goto('/register')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveURL('/')
  })

  test('visiting /forgot-password redirects to home', async ({ page }) => {
    await page.goto('/forgot-password')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveURL('/')
  })
})
