import { test, expect } from '@playwright/test'

/**
 * Superadmin role — Role management CRUD tests.
 *
 * Superadmin has all permissions including view-roles, create-roles, update-roles, delete-roles.
 * Tests cover: list, create, edit, delete roles with permission management.
 */
test.describe('Superadmin Role — Role Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/admin/roles')
    await page.waitForLoadState('networkidle')
  })

  test('can access roles page and see heading', async ({ page }) => {
    await expect(page).toHaveURL('/admin/roles')
    await expect(page.getByRole('heading', { name: 'Roles & Permissions' })).toBeVisible()
  })

  test('can see seeded roles in table', async ({ page }) => {
    await expect(page.getByText('superadmin', { exact: true })).toBeVisible()
    await expect(page.getByText('admin', { exact: true })).toBeVisible()
    await expect(page.getByText('user', { exact: true })).toBeVisible()
  })

  test('can see Create Role button', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Create Role' })).toBeVisible()
  })

  test('can open create role dialog', async ({ page }) => {
    await page.getByRole('button', { name: 'Create Role' }).click()
    await expect(page.getByRole('dialog')).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Create Role' })).toBeVisible()
  })

  test('can create a new role', async ({ page }) => {
    await page.getByRole('button', { name: 'Create Role' }).click()
    await page.getByPlaceholder('Role Name').fill('test-editor')
    await page.getByRole('button', { name: 'Save' }).click()
    await page.waitForLoadState('networkidle')
    await expect(page.getByText('test-editor')).toBeVisible()
  })

  test('can edit an existing role', async ({ page }) => {
    const editButtons = page.locator('button').filter({ has: page.locator('svg.lucide-pencil') })
    await editButtons.first().click()
    await expect(page.getByRole('dialog')).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Edit Role' })).toBeVisible()
    
    // Verify that permissions checkboxes are checked for superadmin role
    // Superadmin should have all permissions, so check if at least one is checked
    const firstCheckbox = page.getByRole('checkbox').first()
    await expect(firstCheckbox).toBeChecked()
  })

  test('can open delete confirmation dialog', async ({ page }) => {
    const deleteButtons = page.locator('button').filter({ has: page.locator('svg.lucide-trash-2') })
    await deleteButtons.first().click()
    await expect(page.getByRole('dialog')).toBeVisible()
    await expect(page.getByText('Are you sure you want to delete this role?')).toBeVisible()
  })

  test('can search roles', async ({ page }) => {
    await page.getByPlaceholder('Search...').fill('super')
    await page.getByPlaceholder('Search...').press('Enter')
    await page.waitForLoadState('networkidle')
    await expect(page.getByText('superadmin', { exact: true })).toBeVisible()
  })

  test('can see permissions badges for superadmin role', async ({ page }) => {
    await expect(page.getByText('access-admin-panel')).toBeVisible()
  })
})
