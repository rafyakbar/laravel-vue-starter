import { test as setup, expect } from '@playwright/test'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const authDir = path.join(__dirname, '.auth')

/**
 * Authenticate as superadmin and save storageState.
 * superadmin has all 11 permissions → redirects to /admin after login.
 */
setup('authenticate as superadmin', async ({ page }) => {
  await page.goto('/login')
  await page.getByLabel('Email or Username').fill('superadmin')
  await page.getByLabel('Password').fill('123123')
  await page.getByRole('button', { name: 'Sign In' }).click()
  await page.waitForURL('**/admin**')
  await expect(page).toHaveURL(/\/admin/)
  await page.context().storageState({ path: path.join(authDir, 'superadmin.json') })
  console.log('✅ Saved storageState: superadmin.json')
})

/**
 * Authenticate as admin and save storageState.
 * admin has access-admin-panel + edit-profile → redirects to /admin after login.
 */
setup('authenticate as admin', async ({ page }) => {
  await page.goto('/login')
  await page.getByLabel('Email or Username').fill('admin')
  await page.getByLabel('Password').fill('123123')
  await page.getByRole('button', { name: 'Sign In' }).click()
  await page.waitForURL('**/admin**')
  await expect(page).toHaveURL(/\/admin/)
  await page.context().storageState({ path: path.join(authDir, 'admin.json') })
  console.log('✅ Saved storageState: admin.json')
})

/**
 * Register a fresh user account and save storageState.
 * user role has only edit-profile → redirects to / after registration.
 */
setup('authenticate as user', async ({ page }) => {
  await page.goto('/register')
  await page.getByLabel('Name', { exact: true }).fill('E2E User')
  await page.getByLabel('Username').fill('e2e_user')
  await page.getByLabel('Email').fill('e2e_user@example.com')
  await page.getByLabel('Password', { exact: true }).fill('password123')
  await page.getByLabel('Confirm Password').fill('password123')
  await page.getByRole('button', { name: 'Create Account' }).click()
  await page.waitForURL('/')
  await expect(page).toHaveURL('/')
  await page.context().storageState({ path: path.join(authDir, 'user.json') })
  console.log('✅ Saved storageState: user.json')
})
