import { test, expect } from '@playwright/test'

test.describe('Admin Mobile Viewport — Role Management Restricted (375x667)', () => {
  test.use({ viewport: { width: 375, height: 667 } })

  test('admin redirected from roles page to dashboard on mobile', async ({ page }) => {
    await page.goto('/admin/roles')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveURL(/\/admin$|\/admin\//)
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible()
  })
})

test.describe('Admin Tablet Viewport — Role Management Restricted (769x1024)', () => {
  test.use({ viewport: { width: 769, height: 1024 } })

  test('admin redirected from roles page to dashboard on tablet', async ({ page }) => {
    await page.goto('/admin/roles')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveURL(/\/admin$|\/admin\//)
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible()
  })
})
