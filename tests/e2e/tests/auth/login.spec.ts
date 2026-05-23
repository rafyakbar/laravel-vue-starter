import { test, expect } from '@playwright/test'

/**
 * Login page E2E tests.
 *
 * Labels from LoginPage.vue:
 *   - Heading: "Sign In"
 *   - Label: "Email or Username"
 *   - Label: "Password"
 *   - Button: "Sign In"
 *   - Link: "Forgot your password?"
 *   - Link: "Sign up"
 *   - Link: "← Back to home"
 */
test.describe('Login Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
  })

  test('shows correct form elements', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible()
    await expect(page.getByLabel('Email or Username')).toBeVisible()
    await expect(page.getByLabel('Password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Forgot your password?' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Sign up' })).toBeVisible()
    await expect(page.getByRole('link', { name: '← Back to home' })).toBeVisible()
  })

  test('login with valid superadmin credentials redirects to /admin', async ({ page }) => {
    await page.getByLabel('Email or Username').fill('superadmin')
    await page.getByLabel('Password').fill('123123')
    await page.getByRole('button', { name: 'Sign In' }).click()
    await expect(page).toHaveURL(/\/admin/)
  })

  test('login with valid admin credentials redirects to /admin', async ({ page }) => {
    await page.getByLabel('Email or Username').fill('admin')
    await page.getByLabel('Password').fill('123123')
    await page.getByRole('button', { name: 'Sign In' }).click()
    await expect(page).toHaveURL(/\/admin/)
  })

  test('login with invalid credentials shows server validation error', async ({ page }) => {
    await page.getByLabel('Email or Username').fill('superadmin')
    await page.getByLabel('Password').fill('wrongpassword')
    await page.getByRole('button', { name: 'Sign In' }).click()
    // Server returns 422 — vee-validate setErrors shows the message under the email field
    // The FormMessage component renders the error in a <p> with class text-destructive
    await expect(page.locator('p.text-destructive').first()).toBeVisible()
  })

  test('login with empty fields shows client-side validation', async ({ page }) => {
    await page.getByRole('button', { name: 'Sign In' }).click()
    await expect(page.getByText('Email or username is required')).toBeVisible()
  })

  test('login page has link to register', async ({ page }) => {
    const link = page.getByRole('link', { name: 'Sign up' })
    await expect(link).toBeVisible()
    await link.click()
    await expect(page).toHaveURL('/register')
  })

  test('login page has link to forgot password', async ({ page }) => {
    const link = page.getByRole('link', { name: 'Forgot your password?' })
    await expect(link).toBeVisible()
    await link.click()
    await expect(page).toHaveURL('/forgot-password')
  })

  test('back to home link navigates to /', async ({ page }) => {
    await page.getByRole('link', { name: '← Back to home' }).click()
    await expect(page).toHaveURL('/')
  })
})
