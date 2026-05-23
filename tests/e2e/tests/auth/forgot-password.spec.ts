import { test, expect } from '@playwright/test'

/**
 * Forgot Password page E2E tests.
 *
 * Labels from ForgotPasswordPage.vue:
 *   - Heading: "Forgot Password"
 *   - Label: "Email"
 *   - Button: "Send Reset Link"
 *   - Success message: "We have emailed your password reset link." (or similar)
 *   - Link: "Back to sign in"
 */
test.describe('Forgot Password Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/forgot-password')
  })

  test('shows correct form elements', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Forgot Password' })).toBeVisible()
    await expect(page.getByLabel('Email')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Send Reset Link' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Back to sign in' })).toBeVisible()
  })

  test('submitting registered email shows success message', async ({ page }) => {
    await page.getByLabel('Email').fill('superadmin@example.com')
    await page.getByRole('button', { name: 'Send Reset Link' }).click()
    // ForgotPasswordPage shows success div: "We have emailed your password reset link."
    await expect(page.getByText('We have emailed your password reset link.')).toBeVisible()
    // Form should be hidden after success
    await expect(page.getByRole('button', { name: 'Send Reset Link' })).not.toBeVisible()
  })

  test('submitting unregistered email shows validation error', async ({ page }) => {
    await page.getByLabel('Email').fill('nonexistent@example.com')
    await page.getByRole('button', { name: 'Send Reset Link' }).click()
    // Fortify returns: "We can't find a user with that email address."
    await expect(page.getByText("We can't find a user with that email address.")).toBeVisible()
  })

  test('submitting empty email shows client-side validation', async ({ page }) => {
    await page.getByRole('button', { name: 'Send Reset Link' }).click()
    await expect(page.getByText('Email is required')).toBeVisible()
  })

  test('back to sign in link navigates to /login', async ({ page }) => {
    await page.getByRole('link', { name: 'Back to sign in' }).click()
    await expect(page).toHaveURL('/login')
  })
})
