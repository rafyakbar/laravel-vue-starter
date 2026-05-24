import { test, expect } from '@playwright/test'

test.describe('Admin Mobile Viewport — Admin Layout (375x667)', () => {
  test.use({ viewport: { width: 375, height: 667 } })

  test('admin bottom nav is visible with Site, Dashboard, Menu, Profile on mobile', async ({ page }) => {
    await page.goto('/admin')
    await page.waitForLoadState('networkidle')
    const bottomNav = page.locator('nav.md\\:hidden')
    await expect(bottomNav).toBeVisible()
    await expect(bottomNav.getByRole('link', { name: 'Site' })).toBeVisible()
    await expect(bottomNav.getByRole('link', { name: 'Dashboard' })).toBeVisible()
    await expect(bottomNav.getByRole('button', { name: 'Menu' })).toBeVisible()
    await expect(bottomNav.getByRole('button', { name: 'Profile' })).toBeVisible()
  })

  test('Site link in bottom nav navigates to home page on mobile', async ({ page }) => {
    await page.goto('/admin')
    await page.waitForLoadState('networkidle')
    const bottomNav = page.locator('nav.md\\:hidden')
    await bottomNav.getByRole('link', { name: 'Site' }).click()
    await expect(page).toHaveURL('/')
  })

  test('Dashboard link in bottom nav navigates to admin dashboard on mobile', async ({ page }) => {
    await page.goto('/admin')
    await page.waitForLoadState('networkidle')
    await page.locator('nav.md\\:hidden').getByRole('link', { name: 'Dashboard' }).click()
    await expect(page).toHaveURL('/admin')
  })

  test('Menu button opens sidebar drawer on mobile', async ({ page }) => {
    await page.goto('/admin')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('[data-sidebar="content"]')).not.toBeVisible()
    await page.locator('nav.md\\:hidden').getByRole('button', { name: 'Menu' }).click()
    await expect(page.locator('[data-sidebar="content"]')).toBeVisible()
  })

  test('sidebar drawer shows Dashboard and Site, but NOT Settings group for admin on mobile', async ({ page }) => {
    await page.goto('/admin')
    await page.waitForLoadState('networkidle')
    await page.locator('nav.md\\:hidden').getByRole('button', { name: 'Menu' }).click()
    const sidebar = page.locator('[data-sidebar="content"]')
    await expect(sidebar.getByRole('link', { name: 'Dashboard' })).toBeVisible()
    await expect(sidebar.getByRole('link', { name: 'Site' })).toBeVisible()
    await expect(sidebar.getByText('Settings')).not.toBeVisible()
  })

  test('Profile dropdown in bottom nav shows Profile and Sign Out on mobile', async ({ page }) => {
    await page.goto('/admin')
    await page.waitForLoadState('networkidle')
    await page.locator('nav.md\\:hidden').getByRole('button', { name: 'Profile' }).click()
    await expect(page.getByRole('menuitem', { name: 'Profile' })).toBeVisible()
    await expect(page.getByRole('menuitem', { name: 'Sign Out' })).toBeVisible()
  })

  test('admin page shows Dashboard heading on mobile', async ({ page }) => {
    await page.goto('/admin')
    await page.waitForLoadState('networkidle')
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible()
  })

  test('theme switching works on mobile — toggles dark class on html', async ({ page }) => {
    await page.goto('/admin')
    await page.waitForLoadState('networkidle')
    await page.evaluate(() => localStorage.removeItem('theme'))
    await page.reload()
    await page.waitForLoadState('networkidle')
    await page.getByRole('button', { name: 'Theme' }).click()
    await page.getByText('Dark').click()
    await expect(page.locator('html')).toHaveClass(/dark/)
  })

  test('language switching works on mobile — Indonesian changes sidebar labels', async ({ page }) => {
    await page.goto('/admin')
    await page.waitForLoadState('networkidle')
    await page.evaluate(() => localStorage.removeItem('locale'))
    await page.reload()
    await page.waitForLoadState('networkidle')
    await page.getByRole('button', { name: 'Language' }).click()
    await page.getByText('Indonesia').click()
    await page.waitForLoadState('networkidle')
    await page.locator('nav.md\\:hidden').getByRole('button', { name: 'Menu' }).click()
    await expect(page.locator('[data-sidebar="content"]').getByRole('link', { name: 'Dasbor' })).toBeVisible()
  })
})

test.describe('Admin Mobile Viewport — Landing Page (375x667)', () => {
  test.use({ viewport: { width: 375, height: 667 } })

  test('admin sees authenticated bottom nav on landing page mobile', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    const bottomNav = page.locator('nav.md\\:hidden')
    await expect(bottomNav).toBeVisible()
    await expect(bottomNav.getByRole('button', { name: /Admin User/ })).toBeVisible()
  })

  test('Admin button is NOT visible on mobile landing page for admin', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('[data-slot="public-navbar"]').getByRole('button', { name: 'Admin', exact: true })).not.toBeVisible()
  })

  test('admin can navigate directly to /admin on mobile', async ({ page }) => {
    await page.goto('/admin')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveURL(/\/admin/)
    await expect(page.locator('nav.md\\:hidden')).toBeVisible()
  })
})

test.describe('Admin Tablet Viewport — Admin Layout (769x1024)', () => {
  test.use({ viewport: { width: 769, height: 1024 } })

  test('sidebar is visible and bottom nav is hidden on tablet', async ({ page }) => {
    await page.goto('/admin')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('[data-sidebar="content"]')).toBeVisible()
    await expect(page.locator('nav.md\\:hidden')).not.toBeVisible()
  })

  test('sidebar shows Dashboard and Site but NOT Settings group on tablet', async ({ page }) => {
    await page.goto('/admin')
    await page.waitForLoadState('networkidle')
    const sidebar = page.locator('[data-sidebar="content"]')
    await expect(sidebar.getByRole('link', { name: 'Dashboard' })).toBeVisible()
    await expect(sidebar.getByRole('link', { name: 'Site' })).toBeVisible()
    await expect(sidebar.getByText('Settings')).not.toBeVisible()
  })

  test('admin page shows Dashboard heading on tablet', async ({ page }) => {
    await page.goto('/admin')
    await page.waitForLoadState('networkidle')
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible()
  })

  test('admin sees Admin button and Sign Out in desktop navbar on tablet', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    const navbar = page.locator('[data-slot="public-navbar"]')
    await expect(navbar.getByRole('button', { name: 'Admin', exact: true })).toBeVisible()
    await expect(navbar.getByRole('button', { name: 'Sign Out' })).toBeVisible()
  })
})
