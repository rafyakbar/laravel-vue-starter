import { test, expect } from '@playwright/test'

test.describe('User Role — Profile Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/my-profile')
    await page.waitForLoadState('networkidle')
  })

  test('can access /my-profile page', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'My Profile', exact: true })).toBeVisible()
  })

  test('profile renders in DefaultLayout (no admin sidebar)', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'Dashboard' })).not.toBeVisible()
  })

  test('profile info form shows name and username fields', async ({ page }) => {
    await expect(page.getByLabel('Name', { exact: true })).toBeVisible()
    await expect(page.getByLabel('Username', { exact: true })).toBeVisible()
  })

  test('profile info form is pre-filled with current user values', async ({ page }) => {
    await expect(page.getByLabel('Name', { exact: true })).not.toHaveValue('')
    await expect(page.getByLabel('Username', { exact: true })).not.toHaveValue('')
  })

  test('profile info form shows read-only email field', async ({ page }) => {
    await expect(page.getByLabel('Email', { exact: true })).toBeVisible()
    await expect(page.getByLabel('Email', { exact: true })).toBeDisabled()
  })

  test('password form shows three password fields', async ({ page }) => {
    await expect(page.getByLabel('Current Password')).toBeVisible()
    await expect(page.getByLabel('New Password')).toBeVisible()
    await expect(page.getByLabel('Confirm Password')).toBeVisible()
  })

  test('avatar upload section is visible', async ({ page }) => {
    const uploadBtn = page.getByRole('button', { name: /Upload Avatar|Change Avatar/i })
    await expect(uploadBtn).toBeVisible()
  })

  test('avatar file input accepts only images', async ({ page }) => {
    const fileInput = page.locator('input[type="file"][accept="image/*"]')
    await expect(fileInput).toBeAttached()
  })

  test('Personal Information and Password sections are visible on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    const infoSection = page.getByRole('heading', { name: 'Personal Information', exact: true })
    const passwordSection = page.getByRole('heading', { name: 'Password', exact: true })
    await expect(infoSection).toBeVisible()
    await expect(passwordSection).toBeVisible()
  })

  test('browser sessions section heading is visible', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Browser Sessions', exact: true })).toBeVisible()
  })

  test('log out other browser sessions button is visible', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Log Out Other Browser Sessions' })).toBeVisible()
  })

  test('2FA Enable button is visible when 2FA not enabled', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Enable' })).toBeVisible()
  })

  test('2FA explanation text is visible when 2FA not enabled', async ({ page }) => {
    await expect(page.getByText('You have not enabled two-factor authentication.')).toBeVisible()
  })
})
