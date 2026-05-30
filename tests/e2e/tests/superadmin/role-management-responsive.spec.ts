import { test, expect } from '@playwright/test'

test.describe('Superadmin Mobile Viewport — Role Management (375x667)', () => {
  test.use({ viewport: { width: 375, height: 667 } })

  test('roles page accessible with bottom nav on mobile', async ({ page }) => {
    await page.goto('/admin/roles')
    await page.waitForLoadState('networkidle')
    const bottomNav = page.locator('nav.md\\:hidden')
    await expect(bottomNav).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Roles & Permissions' })).toBeVisible()
    await expect(page.getByText('superadmin')).toBeVisible()
  })

  test('create role dialog works on mobile', async ({ page }) => {
    await page.goto('/admin/roles')
    await page.waitForLoadState('networkidle')
    await page.getByRole('button', { name: 'Create Role' }).click()
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
    await expect(dialog.getByPlaceholder('Role Name')).toBeVisible()
    await expect(dialog.locator('#perm-edit-profile')).toBeVisible()
  })

  test('search input works on mobile', async ({ page }) => {
    await page.goto('/admin/roles')
    await page.waitForLoadState('networkidle')
    await page.getByPlaceholder('Search...').fill('super')
    await page.getByPlaceholder('Search...').press('Enter')
    await page.waitForLoadState('networkidle')
    await expect(page.getByText('superadmin', { exact: true })).toBeVisible()
  })

  test('bottom nav shows Site, Dashboard, Menu, Profile on roles page mobile', async ({ page }) => {
    await page.goto('/admin/roles')
    await page.waitForLoadState('networkidle')
    const bottomNav = page.locator('nav.md\\:hidden')
    await expect(bottomNav).toBeVisible()
    await expect(bottomNav.getByRole('link', { name: 'Site' })).toBeVisible()
    await expect(bottomNav.getByRole('link', { name: 'Dashboard' })).toBeVisible()
    await expect(bottomNav.getByRole('button', { name: 'Menu' })).toBeVisible()
    await expect(bottomNav.getByRole('button', { name: 'Profile' })).toBeVisible()
  })

  test('Menu button opens sidebar drawer with Roles link on mobile', async ({ page }) => {
    await page.goto('/admin/roles')
    await page.waitForLoadState('networkidle')
    await page.locator('nav.md\\:hidden').getByRole('button', { name: 'Menu' }).click()
    const sidebar = page.locator('[data-sidebar="content"]')
    await expect(sidebar).toBeVisible()
    await expect(sidebar.getByRole('link', { name: 'Roles & Permissions' })).toBeVisible()
  })
})

test.describe('Superadmin Tablet Viewport — Role Management (769x1024)', () => {
  test.use({ viewport: { width: 769, height: 1024 } })

  test('roles page with sidebar visible on tablet, bottom nav hidden', async ({ page }) => {
    await page.goto('/admin/roles')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('[data-sidebar="content"]')).toBeVisible()
    await expect(page.locator('nav.md\\:hidden')).not.toBeVisible()
    await expect(page.getByRole('heading', { name: 'Roles & Permissions' })).toBeVisible()
  })

  test('create role dialog works on tablet', async ({ page }) => {
    await page.goto('/admin/roles')
    await page.waitForLoadState('networkidle')
    await page.getByRole('button', { name: 'Create Role' }).click()
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
    await expect(dialog.getByPlaceholder('Role Name')).toBeVisible()
    await expect(dialog.locator('#perm-edit-profile')).toBeVisible()
  })

  test('table displays all columns on tablet', async ({ page }) => {
    await page.goto('/admin/roles')
    await page.waitForLoadState('networkidle')
    await expect(page.getByRole('columnheader', { name: 'Role Name' })).toBeVisible()
    await expect(page.getByRole('columnheader', { name: 'Permissions' })).toBeVisible()
    await expect(page.getByRole('columnheader', { name: 'Users' })).toBeVisible()
  })
})
