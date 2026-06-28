import { test, expect } from '@playwright/test'

test.describe('User Profile — Mobile (375x667)', () => {
  test.use({ viewport: { width: 375, height: 667 } })

  test.beforeEach(async ({ page }) => {
    await page.goto('/my-profile')
    await page.waitForLoadState('networkidle')
  })

  test('all four section headings are visible on mobile', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Personal Information' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Password' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Two-Factor Authentication', exact: true })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Browser Sessions' })).toBeVisible()
  })

  test('form fields are accessible on mobile', async ({ page }) => {
    await expect(page.getByLabel('Name', { exact: true })).toBeVisible()
    await expect(page.getByLabel('Username', { exact: true })).toBeVisible()
    await expect(page.getByLabel('Email', { exact: true })).toBeVisible()
    await expect(page.getByLabel('Current Password')).toBeVisible()
    await expect(page.getByLabel('New Password')).toBeVisible()
    await expect(page.getByLabel('Confirm Password')).toBeVisible()
  })

  test('description column renders above form column on mobile (stacked layout)', async ({ page }) => {
    const descBox = await page.locator('[data-testid="section-description"]').first().boundingBox()
    const formBox = await page.locator('[data-testid="section-form"]').first().boundingBox()
    expect(descBox).not.toBeNull()
    expect(formBox).not.toBeNull()
    // On mobile (stacked), description must end before form begins vertically
    expect(descBox!.y + descBox!.height).toBeLessThanOrEqual(formBox!.y + 10)
  })

  test('no horizontal overflow on mobile', async ({ page }) => {
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
    expect(scrollWidth).toBeLessThanOrEqual(380)
  })

  test('2FA disabled state shows Enable button on mobile', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Enable' })).toBeVisible()
  })

  test('Browser Sessions Log Out button is visible on mobile', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Log Out Other Browser Sessions' })).toBeVisible()
  })
})

test.describe('User Profile — Tablet (769x1024)', () => {
  test.use({ viewport: { width: 769, height: 1024 } })

  test.beforeEach(async ({ page }) => {
    await page.goto('/my-profile')
    await page.waitForLoadState('networkidle')
  })

  test('two-column layout is active on tablet (description left of form)', async ({ page }) => {
    const descBox = await page.locator('[data-testid="section-description"]').first().boundingBox()
    const formBox = await page.locator('[data-testid="section-form"]').first().boundingBox()
    expect(descBox).not.toBeNull()
    expect(formBox).not.toBeNull()
    // On tablet (side-by-side), description x + width should be less than form x
    expect(descBox!.x + descBox!.width).toBeLessThan(formBox!.x + 10)
  })

  test('all section headings and form fields are visible on tablet', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Personal Information' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Password' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Two-Factor Authentication', exact: true })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Browser Sessions' })).toBeVisible()
    await expect(page.getByLabel('Name', { exact: true })).toBeVisible()
    await expect(page.getByLabel('Current Password')).toBeVisible()
  })

  test('avatar is visible in personal information section on tablet', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Upload Avatar|Change Avatar/i })).toBeVisible()
  })
})

test.describe('User Profile — Desktop (1280x800)', () => {
  test.use({ viewport: { width: 1280, height: 800 } })

  test.beforeEach(async ({ page }) => {
    await page.goto('/my-profile')
    await page.waitForLoadState('networkidle')
  })

  test('two-column layout is active on desktop', async ({ page }) => {
    const descBox = await page.locator('[data-testid="section-description"]').first().boundingBox()
    const formBox = await page.locator('[data-testid="section-form"]').first().boundingBox()
    expect(descBox).not.toBeNull()
    expect(formBox).not.toBeNull()
    expect(descBox!.x + descBox!.width).toBeLessThan(formBox!.x + 10)
  })

  test('personal information section shows avatar alongside form fields on desktop', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Upload Avatar|Change Avatar/i })).toBeVisible()
    await expect(page.getByLabel('Name', { exact: true })).toBeVisible()
  })

  test('page heading is My Profile on desktop', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'My Profile', level: 1 })).toBeVisible()
  })
})
