import { test, expect } from '@playwright/test'

/**
 * Guest navigation guard E2E tests.
 * All tests run as unauthenticated (storageState: empty).
 *
 * Home page labels (en.ts):
 *   - home.signIn: "Sign In"
 *   - home.signUp: "Sign Up"
 */
test.describe('Guest Navigation Guards', () => {
  test('home page shows Sign In and Sign Up for guests', async ({ page }) => {
    await page.goto('/')
    const navbar = page.locator('[data-slot="public-navbar"]')
    await expect(navbar.getByRole('button', { name: 'Sign In' })).toBeVisible()
    await expect(navbar.getByRole('button', { name: 'Sign Up' })).toBeVisible()
  })

  test('visiting /admin redirects to login with redirect param', async ({ page }) => {
    await page.goto('/admin')
    await expect(page).toHaveURL(/\/login/)
    expect(page.url()).toContain('redirect')
  })

  test('visiting /profile redirects to login with redirect param', async ({ page }) => {
    await page.goto('/profile')
    await expect(page).toHaveURL(/\/login/)
    expect(page.url()).toContain('redirect')
  })

  test('visiting /admin/users redirects to login', async ({ page }) => {
    await page.goto('/admin/users')
    await expect(page).toHaveURL(/\/login/)
  })

  test('visiting /admin/roles redirects to login', async ({ page }) => {
    await page.goto('/admin/roles')
    await expect(page).toHaveURL(/\/login/)
  })

  test('visiting /login shows login form', async ({ page }) => {
    await page.goto('/login')
    await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible()
  })

  test('visiting /register shows register form', async ({ page }) => {
    await page.goto('/register')
    await expect(page.getByRole('heading', { name: 'Create Account' })).toBeVisible()
  })

  test('visiting /forgot-password shows forgot password form', async ({ page }) => {
    await page.goto('/forgot-password')
    await expect(page.getByRole('heading', { name: 'Forgot Password' })).toBeVisible()
  })

  test('visiting /reset-password shows reset password form', async ({ page }) => {
    await page.goto('/reset-password')
    await expect(page.getByRole('heading', { name: 'Reset Password' })).toBeVisible()
  })
})
