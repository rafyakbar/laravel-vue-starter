import { test, expect } from '@playwright/test'

/**
 * Admin role — User management restricted access tests.
 *
 * Admin has access-admin-panel permission but NOT view-users, create-users, update-users, or delete-users.
 * Tests verify that admin users cannot see user management UI elements.
 */
test.describe('Admin — User Management Restricted', () => {
  test('admin cannot see Create User button on users page', async ({ page }) => {
    await page.goto('/admin/users')
    await page.waitForLoadState('networkidle')

    await expect(page.getByRole('button', { name: 'Create User' })).not.toBeVisible()
  })

  test('admin cannot see edit/delete action buttons', async ({ page }) => {
    await page.goto('/admin/users')
    await page.waitForLoadState('networkidle')

    const editButtons = page.locator('button').filter({ has: page.locator('svg.lucide-pencil') })
    const deleteButtons = page.locator('button').filter({ has: page.locator('svg.lucide-trash-2') })

    await expect(editButtons.first()).not.toBeVisible()
    await expect(deleteButtons.first()).not.toBeVisible()
  })
})
