import { test, expect } from '@playwright/test'

test.describe('Guest Mobile Viewport (375x667)', () => {
  test.use({ viewport: { width: 375, height: 667 } })

  test('bottom nav shows Home, Features, About links on mobile', async ({ page }) => {
    await page.goto('/')
    const bottomNav = page.locator('nav.md\\:hidden')
    await expect(bottomNav.getByRole('link', { name: 'Home' })).toBeVisible()
    await expect(bottomNav.getByRole('link', { name: 'Features' })).toBeVisible()
    await expect(bottomNav.getByRole('link', { name: 'About' })).toBeVisible()
  })

  test('bottom nav shows Sign In auth dropdown for guests on mobile', async ({ page }) => {
    await page.goto('/')
    const bottomNav = page.locator('nav.md\\:hidden')
    await expect(bottomNav.getByRole('button', { name: 'Sign In' })).toBeVisible()
  })

  test('Sign In dropdown navigates to login on mobile', async ({ page }) => {
    await page.goto('/')
    const bottomNav = page.locator('nav.md\\:hidden')
    await bottomNav.getByRole('button', { name: 'Sign In' }).click()
    await page.getByRole('menuitem', { name: 'Sign In' }).click()
    await expect(page).toHaveURL('/login')
  })

  test('Sign Up in dropdown navigates to register on mobile', async ({ page }) => {
    await page.goto('/')
    const bottomNav = page.locator('nav.md\\:hidden')
    await bottomNav.getByRole('button', { name: 'Sign In' }).click()
    await page.getByRole('menuitem', { name: 'Sign Up' }).click()
    await expect(page).toHaveURL('/register')
  })

  test('desktop nav links are hidden on mobile', async ({ page }) => {
    await page.goto('/')
    const navbar = page.locator('[data-slot="public-navbar"]')
    await expect(navbar.getByRole('link', { name: 'Home' })).not.toBeVisible()
    await expect(navbar.getByRole('link', { name: 'Features' })).not.toBeVisible()
    await expect(navbar.getByRole('link', { name: 'About' })).not.toBeVisible()
  })

  test('desktop auth buttons are hidden on mobile', async ({ page }) => {
    await page.goto('/')
    const navbar = page.locator('[data-slot="public-navbar"]')
    await expect(navbar.getByRole('button', { name: 'Sign In' })).not.toBeVisible()
    await expect(navbar.getByRole('button', { name: 'Sign Up' })).not.toBeVisible()
    await expect(navbar.getByRole('button', { name: 'Sign Out' })).not.toBeVisible()
  })

  test('navbar is solid bg-background on mobile (no blur)', async ({ page }) => {
    await page.goto('/')
    const navbar = page.locator('[data-slot="public-navbar"]')
    await expect(navbar).toHaveClass(/bg-background/)
    const backdropFilter = await navbar.evaluate((el) => getComputedStyle(el).backdropFilter)
    expect(backdropFilter).toBe('none')
  })

  test('bottom nav stays visible after scroll on mobile', async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => window.scrollTo(0, 500))
    const bottomNav = page.locator('nav.md\\:hidden')
    await expect(bottomNav).toBeVisible()
  })

  test('Features link in bottom nav navigates to /features on mobile', async ({ page }) => {
    await page.goto('/')
    const bottomNav = page.locator('nav.md\\:hidden')
    await bottomNav.getByRole('link', { name: 'Features' }).click()
    await expect(page).toHaveURL('/features')
  })

  test('About link in bottom nav navigates to /about on mobile', async ({ page }) => {
    await page.goto('/')
    const bottomNav = page.locator('nav.md\\:hidden')
    await bottomNav.getByRole('link', { name: 'About' }).click()
    await expect(page).toHaveURL('/about')
  })
})

test.describe('Guest Tablet Viewport (768x1024)', () => {
  test.use({ viewport: { width: 768, height: 1024 } })

  test('desktop navbar shows nav links and auth buttons on tablet', async ({ page }) => {
    await page.goto('/')
    const navbar = page.locator('[data-slot="public-navbar"]')
    await expect(navbar.getByRole('link', { name: 'Home' })).toBeVisible()
    await expect(navbar.getByRole('link', { name: 'Features' })).toBeVisible()
    await expect(navbar.getByRole('link', { name: 'About' })).toBeVisible()
    await expect(navbar.getByRole('button', { name: 'Sign In' })).toBeVisible()
    await expect(navbar.getByRole('button', { name: 'Sign Up' })).toBeVisible()
  })

  test('bottom nav is hidden on tablet', async ({ page }) => {
    await page.goto('/')
    const bottomNav = page.locator('nav.md\\:hidden')
    await expect(bottomNav).not.toBeVisible()
  })

  test('Sign In button navigates to login on tablet', async ({ page }) => {
    await page.goto('/')
    const navbar = page.locator('[data-slot="public-navbar"]')
    await navbar.getByRole('button', { name: 'Sign In' }).click()
    await expect(page).toHaveURL('/login')
  })

  test('Sign Up button navigates to register on tablet', async ({ page }) => {
    await page.goto('/')
    const navbar = page.locator('[data-slot="public-navbar"]')
    await navbar.getByRole('button', { name: 'Sign Up' }).click()
    await expect(page).toHaveURL('/register')
  })

  test('navbar has backdrop blur on tablet', async ({ page }) => {
    await page.goto('/')
    const navbar = page.locator('[data-slot="public-navbar"]')
    await expect(navbar).toHaveClass(/bg-background/)
    await expect(navbar).toHaveClass(/backdrop-blur-md/)
  })
})
