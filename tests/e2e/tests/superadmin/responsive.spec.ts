import { test, expect } from '@playwright/test'

test.describe('Superadmin Mobile Viewport — Admin Layout (375x667)', () => {
  test.use({ viewport: { width: 375, height: 667 } })

  test('superadmin bottom nav is visible with Site, Dashboard, Menu, Profile on mobile', async ({ page }) => {
    await page.goto('/admin')
    await page.waitForLoadState('networkidle')
    const bottomNav = page.locator('nav.md\\:hidden')
    await expect(bottomNav).toBeVisible()
    await expect(bottomNav.getByRole('link', { name: 'Site' })).toBeVisible()
    await expect(bottomNav.getByRole('link', { name: 'Dashboard' })).toBeVisible()
    await expect(bottomNav.getByRole('button', { name: 'Menu' })).toBeVisible()
    await expect(bottomNav.getByRole('button', { name: 'Profile' })).toBeVisible()
  })

  test('Menu button opens sidebar drawer showing Settings group with Users and Roles on mobile', async ({ page }) => {
    await page.goto('/admin')
    await page.waitForLoadState('networkidle')
    await page.locator('nav.md\\:hidden').getByRole('button', { name: 'Menu' }).click()
    const sidebar = page.locator('[data-sidebar="content"]')
    await expect(sidebar.getByRole('link', { name: 'Dashboard' })).toBeVisible()
    await expect(sidebar.getByRole('link', { name: 'Site' })).toBeVisible()
    await expect(sidebar.getByText('Settings')).toBeVisible()
    await expect(sidebar.getByRole('link', { name: 'Users' })).toBeVisible()
    await expect(sidebar.getByRole('link', { name: 'Roles & Permissions' })).toBeVisible()
  })

  test('Profile dropdown shows Profile and Sign Out on mobile', async ({ page }) => {
    await page.goto('/admin')
    await page.waitForLoadState('networkidle')
    await page.locator('nav.md\\:hidden').getByRole('button', { name: 'Profile' }).click()
    await expect(page.getByRole('menuitem', { name: 'Profile' })).toBeVisible()
    await expect(page.getByRole('menuitem', { name: 'Sign Out' })).toBeVisible()
  })

  test('can navigate to /admin/users on mobile viewport', async ({ page }) => {
    await page.goto('/admin')
    await page.waitForLoadState('networkidle')
    await page.locator('nav.md\\:hidden').getByRole('button', { name: 'Menu' }).click()
    await page.locator('[data-sidebar="content"]').getByRole('link', { name: 'Users' }).click()
    await page.keyboard.press('Escape')
    await expect(page).toHaveURL('/admin/users')
    await expect(page.getByRole('heading', { name: /Users/ })).toBeVisible()
  })

  test('can navigate to /admin/roles on mobile viewport', async ({ page }) => {
    await page.goto('/admin')
    await page.waitForLoadState('networkidle')
    await page.locator('nav.md\\:hidden').getByRole('button', { name: 'Menu' }).click()
    await page.locator('[data-sidebar="content"]').getByRole('link', { name: 'Roles & Permissions' }).click()
    await page.keyboard.press('Escape')
    await expect(page).toHaveURL('/admin/roles')
    await expect(page.getByRole('heading', { name: /Roles & Permissions/ })).toBeVisible()
  })

  test('theme switching works on mobile — toggles dark class', async ({ page }) => {
    await page.goto('/admin')
    await page.waitForLoadState('networkidle')
    await page.evaluate(() => localStorage.removeItem('theme'))
    await page.reload()
    await page.waitForLoadState('networkidle')
    await page.getByRole('button', { name: 'Theme' }).click()
    await page.getByText('Dark').click()
    await expect(page.locator('html')).toHaveClass(/dark/)
  })

  test('language switching works on mobile — Indonesian labels in sidebar', async ({ page }) => {
    await page.goto('/admin')
    await page.waitForLoadState('networkidle')
    await page.evaluate(() => localStorage.removeItem('locale'))
    await page.reload()
    await page.waitForLoadState('networkidle')
    await page.getByRole('button', { name: 'Language' }).click()
    await page.getByText('Indonesia').click()
    await page.waitForLoadState('networkidle')
    await page.locator('nav.md\\:hidden').getByRole('button', { name: 'Menu' }).click()
    const sidebar = page.locator('[data-sidebar="content"]')
    await expect(sidebar.getByRole('link', { name: 'Dasbor' })).toBeVisible()
    await expect(sidebar.getByText('Pengaturan')).toBeVisible()
    await expect(sidebar.getByRole('link', { name: 'Pengguna' })).toBeVisible()
    await expect(sidebar.getByRole('link', { name: 'Peran & Izin' })).toBeVisible()
  })
})

test.describe('Superadmin Mobile Viewport — Landing Page (375x667)', () => {
  test.use({ viewport: { width: 375, height: 667 } })

  test('superadmin sees authenticated bottom nav on landing page mobile', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    const bottomNav = page.locator('nav.md\\:hidden')
    await expect(bottomNav).toBeVisible()
    await expect(bottomNav.getByRole('button', { name: /Super Admin/ })).toBeVisible()
  })

  test('Admin button is NOT visible on mobile landing page for superadmin', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('[data-slot="public-navbar"]').getByRole('button', { name: 'Admin', exact: true })).not.toBeVisible()
  })

  test('superadmin can navigate directly to /admin on mobile', async ({ page }) => {
    await page.goto('/admin')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveURL(/\/admin/)
    await expect(page.locator('nav.md\\:hidden')).toBeVisible()
  })
})

test.describe('Superadmin Tablet Viewport — Admin Layout (769x1024)', () => {
  test.use({ viewport: { width: 769, height: 1024 } })

  test('sidebar shows Settings group with Users and Roles on tablet, bottom nav hidden', async ({ page }) => {
    await page.goto('/admin')
    await page.waitForLoadState('networkidle')
    const sidebar = page.locator('[data-sidebar="content"]')
    await expect(sidebar.getByText('Settings')).toBeVisible()
    await expect(sidebar.getByRole('link', { name: 'Users' })).toBeVisible()
    await expect(sidebar.getByRole('link', { name: 'Roles & Permissions' })).toBeVisible()
    await expect(page.locator('nav.md\\:hidden')).not.toBeVisible()
  })

  test('can navigate to Users page on tablet', async ({ page }) => {
    await page.goto('/admin')
    await page.waitForLoadState('networkidle')
    await page.locator('[data-sidebar="content"]').getByRole('link', { name: 'Users' }).click()
    await expect(page).toHaveURL('/admin/users')
    await page.waitForLoadState('networkidle')
    await expect(page.getByRole('heading', { name: 'Users' })).toBeVisible()
  })

  test('can navigate to Roles & Permissions page on tablet', async ({ page }) => {
    await page.goto('/admin')
    await page.waitForLoadState('networkidle')
    await page.locator('[data-sidebar="content"]').getByRole('link', { name: 'Roles & Permissions' }).click()
    await expect(page).toHaveURL('/admin/roles')
    await page.waitForLoadState('networkidle')
    await expect(page.getByRole('heading', { name: /Roles & Permissions/ })).toBeVisible()
  })
})

test.describe('Superadmin Tablet Viewport — Landing Page (769x1024)', () => {
  test.use({ viewport: { width: 769, height: 1024 } })

  test('superadmin sees Admin button and Sign Out in desktop navbar on tablet', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    const navbar = page.locator('[data-slot="public-navbar"]')
    await expect(navbar.getByRole('button', { name: 'Admin', exact: true })).toBeVisible()
    await expect(navbar.getByRole('button', { name: 'Sign Out' })).toBeVisible()
    await expect(page.locator('nav.md\\:hidden')).not.toBeVisible()
  })

  test('language switch to Indonesian shows Keluar on landing page tablet', async ({ page }) => {
    await page.goto('/admin')
    await page.waitForLoadState('networkidle')
    await page.evaluate(() => localStorage.removeItem('locale'))
    await page.reload()
    await page.waitForLoadState('networkidle')
    await page.getByRole('button', { name: 'Language' }).click()
    await page.getByText('Indonesia').click()
    await page.waitForLoadState('networkidle')
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    const navbar = page.locator('[data-slot="public-navbar"]')
    await expect(navbar.getByRole('button', { name: 'Admin', exact: true })).toBeVisible()
    await expect(navbar.getByRole('button', { name: 'Keluar' })).toBeVisible()
  })
})
