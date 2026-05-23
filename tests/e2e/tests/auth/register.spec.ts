import { test, expect } from '@playwright/test'

/**
 * Register page E2E tests.
 *
 * Labels from RegisterPage.vue:
 *   - Heading: "Create Account"
 *   - Label: "Name" (exact: true — "Username" also contains "name")
 *   - Label: "Username"
 *   - Label: "Email"
 *   - Label: "Password" (exact: true)
 *   - Label: "Confirm Password"
 *   - Button: "Create Account"
 *   - Link: "Sign in"
 *   - Link: "← Back to home"
 */
test.describe('Register Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/register')
  })

  test('shows correct form elements', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Create Account' })).toBeVisible()
    await expect(page.getByLabel('Name', { exact: true })).toBeVisible()
    await expect(page.getByLabel('Username')).toBeVisible()
    await expect(page.getByLabel('Email')).toBeVisible()
    await expect(page.getByLabel('Password', { exact: true })).toBeVisible()
    await expect(page.getByLabel('Confirm Password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Create Account' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Sign in' })).toBeVisible()
    await expect(page.getByRole('link', { name: '← Back to home' })).toBeVisible()
  })

  test('registration with valid data redirects to home', async ({ page }) => {
    await page.getByLabel('Name', { exact: true }).fill('Test Register')
    await page.getByLabel('Username').fill('test_register_e2e')
    await page.getByLabel('Email').fill('test_register_e2e@example.com')
    await page.getByLabel('Password', { exact: true }).fill('password123')
    await page.getByLabel('Confirm Password').fill('password123')
    await page.getByRole('button', { name: 'Create Account' }).click()
    await expect(page).toHaveURL('/')
  })

  test('registration with duplicate email shows error', async ({ page }) => {
    // superadmin@example.com already exists in seed
    await page.getByLabel('Name', { exact: true }).fill('Duplicate Test')
    await page.getByLabel('Username').fill('duplicate_test_e2e')
    await page.getByLabel('Email').fill('superadmin@example.com')
    await page.getByLabel('Password', { exact: true }).fill('password123')
    await page.getByLabel('Confirm Password').fill('password123')
    await page.getByRole('button', { name: 'Create Account' }).click()
    await expect(page.getByText(/email.*taken|already.*exists|email.*already/i)).toBeVisible()
  })

  test('registration with empty fields shows client-side validation', async ({ page }) => {
    await page.getByRole('button', { name: 'Create Account' }).click()
    // Use exact: true to avoid matching "Username is required" as well
    await expect(page.getByText('Name is required', { exact: true })).toBeVisible()
  })

  test('registration with short password shows validation', async ({ page }) => {
    await page.getByLabel('Name', { exact: true }).fill('Test User')
    await page.getByLabel('Username').fill('testuser_short')
    await page.getByLabel('Email').fill('testuser_short@example.com')
    await page.getByLabel('Password', { exact: true }).fill('short')
    await page.getByLabel('Confirm Password').fill('short')
    await page.getByRole('button', { name: 'Create Account' }).click()
    await expect(page.getByText('Password must be at least 8 characters')).toBeVisible()
  })

  test('register page has link to login', async ({ page }) => {
    const link = page.getByRole('link', { name: 'Sign in' })
    await expect(link).toBeVisible()
    await link.click()
    await expect(page).toHaveURL('/login')
  })
})
