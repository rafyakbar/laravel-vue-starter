import { test, expect } from '@playwright/test'

test.describe('User Mobile Viewport (375x667)', () => {
  test.use({ viewport: { width: 375, height: 667 } })

  test('bottom nav is visible on mobile for authenticated user', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    const bottomNav = page.locator('nav.md\\:hidden')
    await expect(bottomNav).toBeVisible()
    await expect(bottomNav.getByRole('button', { name: /E2E User/ })).toBeVisible()
    await expect(bottomNav.getByRole('link', { name: 'Home' })).toBeVisible()
  })

  test('desktop navbar auth buttons are hidden on mobile for user', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    const navbar = page.locator('[data-slot="public-navbar"]')
    await expect(navbar.getByRole('button', { name: /E2E User/ })).not.toBeVisible()
    await expect(navbar.getByRole('button', { name: 'Sign Out' })).not.toBeVisible()
    await expect(navbar.getByRole('button', { name: 'Admin' })).not.toBeVisible()
  })

  test('bottom nav auth dropdown shows user name, Profile, and Sign Out on mobile', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    const bottomNav = page.locator('nav.md\\:hidden')
    await bottomNav.getByRole('button', { name: /E2E User/ }).click()
    await expect(page.getByRole('menuitem', { name: 'Profile' })).toBeVisible()
    await expect(page.getByRole('menuitem', { name: 'Sign Out' })).toBeVisible()
  })

  test('Profile link in bottom nav dropdown navigates to /profile on mobile', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    const bottomNav = page.locator('nav.md\\:hidden')
    await bottomNav.getByRole('button', { name: /E2E User/ }).click()
    await page.getByRole('menuitem', { name: 'Profile' }).click()
    await expect(page).toHaveURL('/profile')
  })

  test('Admin button is NOT visible anywhere on mobile for user role', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await expect(page.getByRole('button', { name: 'Admin', exact: true })).not.toBeVisible()
  })

  test('visiting /admin redirects to home on mobile', async ({ page }) => {
    await page.goto('/admin')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveURL('/')
  })

  test('visiting /login redirects to home on mobile for authenticated user', async ({ page }) => {
    await page.goto('/login')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveURL('/')
  })
})

test.describe('User Tablet Viewport (769x1024)', () => {
  test.use({ viewport: { width: 769, height: 1024 } })

  test('desktop navbar shows user name and Sign Out on tablet', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    const navbar = page.locator('[data-slot="public-navbar"]')
    await expect(navbar.getByRole('button', { name: /E2E User/ })).toBeVisible()
    await expect(navbar.getByRole('button', { name: 'Sign Out' })).toBeVisible()
  })

  test('bottom nav is hidden on tablet for user', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    const bottomNav = page.locator('nav.md\\:hidden')
    await expect(bottomNav).not.toBeVisible()
  })

  test('Admin button is NOT visible on tablet for user role', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    const navbar = page.locator('[data-slot="public-navbar"]')
    await expect(navbar.getByRole('button', { name: 'Admin', exact: true })).not.toBeVisible()
  })

  test('user name button navigates to /profile on tablet', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    const navbar = page.locator('[data-slot="public-navbar"]')
    await navbar.getByRole('button', { name: /E2E User/ }).click()
    await expect(page).toHaveURL('/profile')
  })
})

