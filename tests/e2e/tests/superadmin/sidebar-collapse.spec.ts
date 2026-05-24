import { test, expect } from '@playwright/test'

test.describe('Sidebar Collapse/Expand - Superadmin', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 })
  })

  test('superadmin collapsed sidebar shows nav tooltips', async ({ page }) => {
    await page.goto('/admin')
    await page.locator('[data-sidebar="rail"]').click()
    await page.waitForTimeout(300)

    // Hover over Dashboard and verify tooltip (tooltip works - no DropdownMenu conflict)
    const dashboardLink = page.locator('[data-slot="sidebar-content"] [data-sidebar="menu-button"]').filter({ hasText: 'Dashboard' })
    await dashboardLink.hover({ force: true })
    const dashboardTooltip = page.locator('[role="tooltip"]').filter({ hasText: 'Dashboard' })
    await expect(dashboardTooltip).toBeVisible({ timeout: 3000 })

    // Settings uses DropdownMenu in collapsed mode (no tooltip - DropdownMenuTrigger intercepts hover)
    // Verify Settings opens dropdown instead
    const settingsButton = page.locator('[data-slot="sidebar-content"] button').filter({ hasText: 'Settings' })
    await settingsButton.click({ force: true })
    const menu = page.getByRole('menu')
    await expect(menu).toBeVisible()
  })

  test('superadmin collapsed Settings dropdown shows Users and Roles', async ({ page }) => {
    await page.goto('/admin')
    await page.locator('[data-sidebar="rail"]').click()
    await page.waitForTimeout(300)

    await page.locator('[data-slot="sidebar-content"] button').filter({ hasText: 'Settings' }).click({ force: true })

    const menu = page.getByRole('menu')
    await expect(menu).toBeVisible()

    const usersItem = page.getByRole('menuitem', { name: 'Users' })
    await expect(usersItem).toBeVisible()
    await expect(usersItem.locator('svg')).toBeVisible()

    const rolesItem = page.getByRole('menuitem', { name: 'Roles & Permissions' })
    await expect(rolesItem).toBeVisible()
    await expect(rolesItem.locator('svg')).toBeVisible()
  })

  test('superadmin can navigate to Users from collapsed dropdown', async ({ page }) => {
    await page.goto('/admin')
    await page.locator('[data-sidebar="rail"]').click()
    await page.waitForTimeout(300)

    await page.locator('[data-slot="sidebar-content"] button').filter({ hasText: 'Settings' }).click({ force: true })
    await page.getByRole('menuitem', { name: 'Users' }).click()

    await expect(page).toHaveURL(/\/admin\/users/)
    await expect(page.getByText('Users').first()).toBeVisible()
  })

  test('superadmin can navigate to Roles from collapsed dropdown', async ({ page }) => {
    await page.goto('/admin')
    await page.locator('[data-sidebar="rail"]').click()
    await page.waitForTimeout(300)

    await page.locator('[data-slot="sidebar-content"] button').filter({ hasText: 'Settings' }).click({ force: true })
    await page.getByRole('menuitem', { name: 'Roles & Permissions' }).click()

    await expect(page).toHaveURL(/\/admin\/roles/)
    await expect(page.getByText('Roles & Permissions').first()).toBeVisible()
  })
})
