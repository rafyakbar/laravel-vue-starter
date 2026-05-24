import { test, expect } from '@playwright/test'

test.describe('Sidebar Collapse/Expand - Admin', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 })
  })

  test('sidebar starts expanded by default', async ({ page }) => {
    await page.goto('/admin')
    const sidebar = page.locator('[data-slot="sidebar"]')
    await expect(sidebar).toHaveAttribute('data-state', 'expanded')
  })

  test('clicking sidebar rail collapses sidebar', async ({ page }) => {
    await page.goto('/admin')
    const sidebar = page.locator('[data-slot="sidebar"]')
    await page.locator('[data-sidebar="rail"]').click()
    await expect(sidebar).toHaveAttribute('data-state', 'collapsed')
  })

  test('collapsed sidebar shows tooltip on Dashboard hover', async ({ page }) => {
    await page.goto('/admin')
    await page.locator('[data-sidebar="rail"]').click()
    await page.waitForTimeout(300)

    const dashboardLink = page.locator('[data-slot="sidebar-content"] [data-sidebar="menu-button"]').filter({ hasText: 'Dashboard' })
    await dashboardLink.hover({ force: true })

    const tooltip = page.locator('[role="tooltip"]').filter({ hasText: 'Dashboard' })
    await expect(tooltip).toBeVisible({ timeout: 3000 })
  })

  test('collapsed sidebar Dashboard click stays on admin', async ({ page }) => {
    await page.goto('/admin')
    await page.locator('[data-sidebar="rail"]').click()
    await page.waitForTimeout(300)

    await page.locator('[data-slot="sidebar-content"] [data-sidebar="menu-button"]').filter({ hasText: 'Dashboard' }).click({ force: true })
    await expect(page.locator('[data-slot="sidebar"]')).toHaveAttribute('data-state', 'collapsed')
  })

  test('collapsed sidebar Site link navigates to home', async ({ page }) => {
    await page.goto('/admin')
    await page.locator('[data-sidebar="rail"]').click()
    await page.waitForTimeout(300)

    await page.locator('[data-slot="sidebar-content"] [data-sidebar="menu-button"]').filter({ hasText: 'Site' }).click({ force: true })
    await expect(page).toHaveURL(/\/$/)
  })

  test('clicking rail expands sidebar', async ({ page }) => {
    await page.goto('/admin')
    const sidebar = page.locator('[data-slot="sidebar"]')
    const rail = page.locator('[data-sidebar="rail"]')

    await rail.click()
    await expect(sidebar).toHaveAttribute('data-state', 'collapsed')
    await rail.click()
    await expect(sidebar).toHaveAttribute('data-state', 'expanded')
  })

  test('sidebar state persists after reload', async ({ page }) => {
    await page.goto('/admin')
    const sidebar = page.locator('[data-slot="sidebar"]')

    await page.locator('[data-sidebar="rail"]').click()
    await expect(sidebar).toHaveAttribute('data-state', 'collapsed')
    await page.reload()
    await expect(sidebar).toHaveAttribute('data-state', 'collapsed')
  })
})
