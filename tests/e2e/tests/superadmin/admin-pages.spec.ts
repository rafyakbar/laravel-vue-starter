import { test, expect } from '@playwright/test'

/**
 * Superadmin role — full admin page access and guest page guard tests.
 *
 * Superadmin can access /admin/users and /admin/roles (has view-users, view-roles).
 * Guest pages redirect to /admin.
 *
 * Page labels (en.ts):
 *   - pages.users.title: "Users"
 *   - pages.roles.title: "Roles & Permissions"
 *   - pages.profile.title: "Profile"
 */
test.describe('Superadmin Role — Admin Pages', () => {
  test('can access /admin/users page', async ({ page }) => {
    await page.goto('/admin/users')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveURL('/admin/users')
    // UsersPage shows "Users" heading
    await expect(page.getByRole('heading', { name: 'Users' })).toBeVisible()
  })

  test('can access /admin/roles page', async ({ page }) => {
    await page.goto('/admin/roles')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveURL('/admin/roles')
    // RolesPage shows "Roles & Permissions" heading
    await expect(page.getByRole('heading', { name: 'Roles & Permissions' })).toBeVisible()
  })

  test('profile renders inside AdminLayout (sidebar visible)', async ({ page }) => {
    await page.goto('/my-profile')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('[data-sidebar="content"]').getByRole('link', { name: 'Dashboard' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'My Profile', exact: true })).toBeVisible()
  })

  test('visiting /login redirects to admin dashboard (guest page guard)', async ({ page }) => {
    await page.goto('/login')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveURL(/\/admin/)
  })

  test('visiting /register redirects to admin dashboard', async ({ page }) => {
    await page.goto('/register')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveURL(/\/admin/)
  })

  test('visiting /forgot-password redirects to admin dashboard', async ({ page }) => {
    await page.goto('/forgot-password')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveURL(/\/admin/)
  })
})
