import { test, expect } from '@playwright/test'

/**
 * Guest landing page and navigation E2E tests.
 * All tests run as unauthenticated (storageState: empty).
 *
 * Landing page labels (en.ts → landing.nav.*):
 *   - "Home", "Features", "About" — nav links
 *   - "Sign In", "Sign Up" — auth buttons (guest)
 *   - Brand: "Laravel Vue Starter"
 */
test.describe('Guest Landing Page', () => {
  test('home page shows landing navbar with Sign In and Sign Up for guests', async ({ page }) => {
    await page.goto('/')
    const navbar = page.locator('[data-slot="public-navbar"]')
    await expect(navbar.getByRole('button', { name: 'Sign In' })).toBeVisible()
    await expect(navbar.getByRole('button', { name: 'Sign Up' })).toBeVisible()
  })

  test('home page shows navigation links in desktop navbar', async ({ page }) => {
    await page.goto('/')
    const navbar = page.locator('[data-slot="public-navbar"]')
    await expect(navbar.getByRole('link', { name: 'Home' })).toBeVisible()
    await expect(navbar.getByRole('link', { name: 'Features' })).toBeVisible()
    await expect(navbar.getByRole('link', { name: 'About' })).toBeVisible()
  })

  test('home page shows branding in navbar', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('[data-slot="public-navbar"]').getByText('Laravel Vue Starter')).toBeVisible()
  })

  test('home page shows hero section', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { name: /Laravel Vue Starter/ })).toBeVisible()
  })

  test('Sign In button navigates to login page', async ({ page }) => {
    await page.goto('/')
    await page.locator('[data-slot="public-navbar"]').getByRole('button', { name: 'Sign In' }).click()
    await expect(page).toHaveURL('/login')
  })

  test('Sign Up button navigates to register page', async ({ page }) => {
    await page.goto('/')
    await page.locator('[data-slot="public-navbar"]').getByRole('button', { name: 'Sign Up' }).click()
    await expect(page).toHaveURL('/register')
  })

  test('Features link navigates to /features', async ({ page }) => {
    await page.goto('/')
    await page.locator('[data-slot="public-navbar"]').getByRole('link', { name: 'Features' }).click()
    await expect(page).toHaveURL('/features')
  })

  test('About link navigates to /about', async ({ page }) => {
    await page.goto('/')
    await page.locator('[data-slot="public-navbar"]').getByRole('link', { name: 'About' }).click()
    await expect(page).toHaveURL('/about')
  })

  test('/features page shows Features heading', async ({ page }) => {
    await page.goto('/features')
    await expect(page.getByRole('heading', { name: 'Features' })).toBeVisible()
  })

  test('/about page shows About heading', async ({ page }) => {
    await page.goto('/about')
    await expect(page.getByRole('heading', { name: 'About' })).toBeVisible()
  })

  test('visiting /admin redirects to login', async ({ page }) => {
    await page.goto('/admin')
    await expect(page).toHaveURL(/\/login/)
  })

  test('visiting /profile redirects to login', async ({ page }) => {
    await page.goto('/profile')
    await expect(page).toHaveURL(/\/login/)
  })
})

test.describe('Guest Mobile Bottom Navigation', () => {
  test.use({ viewport: { width: 375, height: 667 } })

  test('bottom nav is visible on mobile', async ({ page }) => {
    await page.goto('/')
    const bottomNav = page.locator('nav.md\\:hidden')
    await expect(bottomNav.getByRole('link', { name: 'Home' })).toBeVisible()
    await expect(bottomNav.getByRole('link', { name: 'Features' })).toBeVisible()
    await expect(bottomNav.getByRole('link', { name: 'About' })).toBeVisible()
  })

  test('bottom nav shows Sign In button for guests', async ({ page }) => {
    await page.goto('/')
    // The auth dropdown trigger in bottom nav shows "Sign In" text for guests
    const bottomNav = page.locator('nav.md\\:hidden')
    await expect(bottomNav.getByRole('button', { name: 'Sign In' })).toBeVisible()
  })

  test('navbar is solid on mobile (not transparent)', async ({ page }) => {
    await page.goto('/')
    const navbar = page.locator('[data-slot="public-navbar"]')
    await expect(navbar).toHaveClass(/bg-background/)
  })

  test('bottom nav stays visible after scroll on mobile', async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => window.scrollTo(0, 500))
    const bottomNav = page.locator('nav.md\\:hidden')
    await expect(bottomNav).toBeVisible()
  })
})

test.describe('Guest Desktop Navigation', () => {
  test.use({ viewport: { width: 1280, height: 720 } })

  test('desktop navbar shows nav links and auth buttons', async ({ page }) => {
    await page.goto('/')
    const navbar = page.locator('[data-slot="public-navbar"]')
    await expect(navbar.getByRole('link', { name: 'Home' })).toBeVisible()
    await expect(navbar.getByRole('link', { name: 'Features' })).toBeVisible()
    await expect(navbar.getByRole('link', { name: 'About' })).toBeVisible()
    await expect(navbar.getByRole('button', { name: 'Sign In' })).toBeVisible()
    await expect(navbar.getByRole('button', { name: 'Sign Up' })).toBeVisible()
  })

  test('bottom nav is hidden on desktop', async ({ page }) => {
    await page.goto('/')
    const bottomNav = page.locator('nav.md\\:hidden')
    await expect(bottomNav).not.toBeVisible()
  })
})