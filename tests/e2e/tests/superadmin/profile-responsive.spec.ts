import { test, expect } from '@playwright/test'

test.describe('Superadmin Profile — Mobile (375x667)', () => {
  test.use({ viewport: { width: 375, height: 667 } })

  test.beforeEach(async ({ page }) => {
    await page.goto('/my-profile')
    await page.waitForLoadState('networkidle')
    // Wait for page heading to confirm full render before assertions
    await page.getByRole('heading', { name: 'My Profile', exact: true }).waitFor({ state: 'visible' })
  })

  test('superadmin bottom nav is visible on profile page mobile', async ({ page }) => {
    await expect(page.locator('nav.md\\:hidden')).toBeVisible()
  })

  test('all four section headings are visible on mobile for superadmin', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Personal Information' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Password' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Two-Factor Authentication', exact: true })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Browser Sessions' })).toBeVisible()
  })

  test('description stacks above form on mobile for superadmin', async ({ page }) => {
    const descBox = await page.locator('[data-testid="section-description"]').first().boundingBox()
    const formBox = await page.locator('[data-testid="section-form"]').first().boundingBox()
    expect(descBox).not.toBeNull()
    expect(formBox).not.toBeNull()
    expect(descBox!.y + descBox!.height).toBeLessThanOrEqual(formBox!.y + 10)
  })

  test('no horizontal overflow on mobile for superadmin', async ({ page }) => {
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
    expect(scrollWidth).toBeLessThanOrEqual(380)
  })

  test('2FA section shows controls on mobile (Enable or manage buttons)', async ({ page }) => {
    const enableBtn = page.getByRole('button', { name: 'Enable' })
    const disableBtn = page.getByRole('button', { name: 'Disable Two-Factor Authentication' })
    const regenerateBtn = page.getByRole('button', { name: 'Regenerate Recovery Codes' })
    const isEnabled = await disableBtn.isVisible().catch(() => false)
    if (isEnabled) {
      await expect(disableBtn.or(regenerateBtn)).toBeVisible()
    } else {
      await expect(enableBtn).toBeVisible()
    }
  })
})

test.describe('Superadmin Profile — Tablet (769x1024)', () => {
  test.use({ viewport: { width: 769, height: 1024 } })

  test.beforeEach(async ({ page }) => {
    await page.goto('/my-profile')
    await page.waitForLoadState('networkidle')
    // Wait for page heading to confirm full render before assertions
    await page.getByRole('heading', { name: 'My Profile', exact: true }).waitFor({ state: 'visible' })
  })

  test('sidebar with Settings group visible on tablet for superadmin profile', async ({ page }) => {
    const sidebar = page.locator('[data-sidebar="content"]')
    await expect(sidebar).toBeVisible()
    await expect(sidebar.getByText('Settings')).toBeVisible()
  })

  test('bottom nav hidden on tablet for superadmin profile', async ({ page }) => {
    await expect(page.locator('nav.md\\:hidden')).not.toBeVisible()
  })

  test('two-column layout on tablet for superadmin', async ({ page }) => {
    const descBox = await page.locator('[data-testid="section-description"]').first().boundingBox()
    const formBox = await page.locator('[data-testid="section-form"]').first().boundingBox()
    expect(descBox).not.toBeNull()
    expect(formBox).not.toBeNull()
    expect(descBox!.x + descBox!.width).toBeLessThan(formBox!.x + 10)
  })
})

test.describe('Superadmin Profile — Desktop (1280x800)', () => {
  test.use({ viewport: { width: 1280, height: 800 } })

  test.beforeEach(async ({ page }) => {
    await page.goto('/my-profile')
    await page.waitForLoadState('networkidle')
    // Wait for page heading to confirm full render before assertions
    await page.getByRole('heading', { name: 'My Profile', exact: true }).waitFor({ state: 'visible' })
  })

  test('two-column layout on desktop for superadmin', async ({ page }) => {
    const descBox = await page.locator('[data-testid="section-description"]').first().boundingBox()
    const formBox = await page.locator('[data-testid="section-form"]').first().boundingBox()
    expect(descBox).not.toBeNull()
    expect(formBox).not.toBeNull()
    expect(descBox!.x + descBox!.width).toBeLessThan(formBox!.x + 10)
  })

  test('My Profile h1 heading visible on desktop for superadmin', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'My Profile', level: 1 })).toBeVisible()
  })
})
