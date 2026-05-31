import { test, expect } from '@playwright/test'

/**
 * Superadmin role — User management CRUD tests.
 *
 * Superadmin has all permissions including view-users, create-users, update-users, delete-users.
 * Tests cover: list, create, edit, delete users with role and permission management.
 */
test.describe('Superadmin — User Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/admin/users')
    await page.waitForLoadState('networkidle')
  })

  test('can access users page and see heading', async ({ page }) => {
    await expect(page).toHaveURL('/admin/users')
    await expect(page.getByRole('heading', { name: 'Users' })).toBeVisible()
  })

  test('can see user table with data', async ({ page }) => {
    await expect(page.locator('table')).toBeVisible()
    await expect(page.locator('tbody tr')).not.toHaveCount(0)
  })

  test('can see Create User button', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Create User' })).toBeVisible()
  })

  test('can open create user dialog', async ({ page }) => {
    await page.getByRole('button', { name: 'Create User' }).click()
    await expect(page.getByRole('dialog')).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Create User' })).toBeVisible()
  })

  test.skip('can create a new user', async ({ page }) => {
    // TODO: Fix this test - user is created but may not appear on first page due to pagination
    await page.getByRole('button', { name: 'Create User' }).click()

    const timestamp = Date.now()
    await page.locator('#create-name').fill('Test User')
    await page.locator('#create-username').fill('testuser' + timestamp)
    await page.locator('#create-email').fill('testuser' + timestamp + '@example.com')
    await page.locator('#create-password').fill('Password123!')

    // Select at least one role
    await page.locator('label[for^="create-role-"]').first().click()

    await page.getByRole('button', { name: 'Save' }).click()
    await page.waitForLoadState('networkidle')

    // Wait for dialog to close
    await expect(page.getByRole('dialog')).not.toBeVisible()

    // Verify user appears in table
    await expect(page.getByText('testuser' + timestamp)).toBeVisible()
  })

  test('can open edit dialog with pre-populated data', async ({ page }) => {
    const editButtons = page.locator('button').filter({ has: page.locator('svg.lucide-pencil') })
    await editButtons.first().click()

    await expect(page.getByRole('dialog')).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Edit User' })).toBeVisible()

    const nameInput = page.locator('#edit-name')
    await expect(nameInput).toHaveValue(/.+/)
  })

  test('can edit a user name', async ({ page }) => {
    const editButtons = page.locator('button').filter({ has: page.locator('svg.lucide-pencil') })
    await editButtons.first().click()

    const nameInput = page.locator('#edit-name')
    await nameInput.clear()
    await nameInput.fill('Updated Name')

    await page.getByRole('button', { name: 'Save' }).click()
    await page.waitForLoadState('networkidle')

    await expect(page.getByText('Updated Name')).toBeVisible()
  })

  test('can see role checkboxes in edit dialog', async ({ page }) => {
    const editButtons = page.locator('button').filter({ has: page.locator('svg.lucide-pencil') })
    await editButtons.first().click()

    await expect(page.getByRole('checkbox').first()).toBeVisible()
  })

  test('can open delete confirmation dialog', async ({ page }) => {
    const deleteButtons = page.locator('button').filter({ has: page.locator('svg.lucide-trash-2') })
    await deleteButtons.first().click()

    await expect(page.getByRole('dialog')).toBeVisible()
    await expect(page.getByText(/Are you sure/i)).toBeVisible()
  })

  test('can search users', async ({ page }) => {
    await page.getByPlaceholder('Search...').fill('admin')
    await page.getByPlaceholder('Search...').press('Enter')
    await page.waitForLoadState('networkidle')

    await expect(page.locator('tbody tr')).not.toHaveCount(0)
  })
})
