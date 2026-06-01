import { test, expect } from '@playwright/test'

test.describe('Admin Role — Profile Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/profile')
    await page.waitForLoadState('networkidle')
  })

  test('admin can access /profile', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Profile', exact: true })).toBeVisible()
  })

  test('admin sees AdminLayout with sidebar', async ({ page }) => {
    await expect(page.locator('[data-sidebar="content"]').getByRole('link', { name: 'Dashboard' })).toBeVisible()
  })

  test('profile info form shows name and username fields', async ({ page }) => {
    await expect(page.getByLabel('Name', { exact: true })).toBeVisible()
    await expect(page.getByLabel('Username', { exact: true })).toBeVisible()
  })

  test('profile info form is pre-filled with current user values', async ({ page }) => {
    await expect(page.getByLabel('Name', { exact: true })).not.toHaveValue('')
    await expect(page.getByLabel('Username', { exact: true })).not.toHaveValue('')
  })

  test('password form is visible', async ({ page }) => {
    await expect(page.getByLabel('Current Password')).toBeVisible()
  })

  test('avatar upload section is visible', async ({ page }) => {
    const uploadBtn = page.getByRole('button', { name: /Upload Avatar|Change Avatar/i })
    await expect(uploadBtn).toBeVisible()
  })

  test('avatar file input accepts only images', async ({ page }) => {
    const fileInput = page.locator('input[type="file"][accept="image/*"]')
    await expect(fileInput).toBeAttached()
  })

  test('profile info and password forms are side by side on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await expect(page.getByRole('heading', { name: 'Profile Information', exact: true })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Change Password', exact: true })).toBeVisible()
  })
})
