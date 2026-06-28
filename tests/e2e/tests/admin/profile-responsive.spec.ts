import { test, expect } from '@playwright/test'

test.describe('Admin Profile — Mobile (375x667)', () => {
  test.use({ viewport: { width: 375, height: 667 } })

  test.beforeEach(async ({ page }) => {
    await page.goto('/my-profile')
    await page.waitForLoadState('networkidle')
    await page.getByRole('heading', { name: 'My Profile', exact: true }).waitFor({ state: 'visible' })
  })

  test('admin bottom nav is visible on profile page mobile', async ({ page }) => {
    await expect(page.locator('nav.md\\:hidden')).toBeVisible()
  })

  test('all four section headings are visible on mobile', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Personal Information' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Password' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Two-Factor Authentication', exact: true })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Browser Sessions' })).toBeVisible()
  })

  test('description column stacks above form column on mobile', async ({ page }) => {
    const descBox = await page.locator('[data-testid="section-description"]').first().boundingBox()
    const formBox = await page.locator('[data-testid="section-form"]').first().boundingBox()
    expect(descBox).not.toBeNull()
    expect(formBox).not.toBeNull()
    expect(descBox!.y + descBox!.height).toBeLessThanOrEqual(formBox!.y + 10)
  })

  test('no horizontal overflow on mobile for admin', async ({ page }) => {
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
    expect(scrollWidth).toBeLessThanOrEqual(380)
  })

  test('Browser Sessions and 2FA sections visible on mobile for admin', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Browser Sessions' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Log Out Other Browser Sessions' })).toBeVisible()
  })
})

test.describe('Admin Profile — Tablet (769x1024)', () => {
  test.use({ viewport: { width: 769, height: 1024 } })

  test.beforeEach(async ({ page }) => {
    await page.goto('/my-profile')
    await page.waitForLoadState('networkidle')
    await page.getByRole('heading', { name: 'My Profile', exact: true }).waitFor({ state: 'visible' })
  })

  test('sidebar is visible on tablet for admin profile', async ({ page }) => {
    await expect(page.locator('[data-sidebar="content"]')).toBeVisible()
  })

  test('bottom nav is hidden on tablet for admin profile', async ({ page }) => {
    await expect(page.locator('nav.md\\:hidden')).not.toBeVisible()
  })

  test('two-column layout is active on tablet for admin', async ({ page }) => {
    const descBox = await page.locator('[data-testid="section-description"]').first().boundingBox()
    const formBox = await page.locator('[data-testid="section-form"]').first().boundingBox()
    expect(descBox).not.toBeNull()
    expect(formBox).not.toBeNull()
    expect(descBox!.x + descBox!.width).toBeLessThan(formBox!.x + 10)
  })
})

test.describe('Admin Profile — Desktop (1280x800)', () => {
  test.use({ viewport: { width: 1280, height: 800 } })

  test.beforeEach(async ({ page }) => {
    await page.goto('/my-profile')
    await page.waitForLoadState('networkidle')
    await page.getByRole('heading', { name: 'My Profile', exact: true }).waitFor({ state: 'visible' })
  })

  test('two-column layout on desktop for admin', async ({ page }) => {
    const descBox = await page.locator('[data-testid="section-description"]').first().boundingBox()
    const formBox = await page.locator('[data-testid="section-form"]').first().boundingBox()
    expect(descBox).not.toBeNull()
    expect(formBox).not.toBeNull()
    expect(descBox!.x + descBox!.width).toBeLessThan(formBox!.x + 10)
  })

  test('My Profile heading visible on desktop for admin', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'My Profile', exact: true })).toBeVisible()
  })
})
