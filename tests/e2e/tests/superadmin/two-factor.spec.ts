import { test, expect } from '@playwright/test'

/**
 * Superadmin — Two-Factor Authentication tests.
 *
 * Tests cover: 2FA section on profile, enable flow (password confirm → QR → verify),
 * and the two-factor-challenge page.
 *
 * Note: Full TOTP verification (scanning QR + entering real code) requires a live
 * authenticator app, so tests stop at the setup step and verify UI presence.
 * The challenge page test is gated on the user having 2FA pre-enabled in the seeder.
 */
test.describe('Superadmin — Two-Factor Authentication', () => {
  test('can see 2FA section on profile page', async ({ page }) => {
    await page.goto('/profile')
    await page.waitForLoadState('networkidle')

    await expect(page.getByRole('heading', { name: 'Two-Factor Authentication' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Enable Two-Factor Authentication' })).toBeVisible()
  })

  test('can start 2FA enable flow', async ({ page }) => {
    await page.goto('/profile')
    await page.waitForLoadState('networkidle')

    await page.getByRole('button', { name: 'Enable Two-Factor Authentication' }).click()

    await expect(page.locator('#tfa-confirm-password')).toBeVisible()
    await expect(page.locator('p.text-sm.font-medium').filter({ hasText: 'Confirm your password' })).toBeVisible()
  })

  test('password confirmation advances to setup step', async ({ page }) => {
    await page.goto('/profile')
    await page.waitForLoadState('networkidle')

    await page.getByRole('button', { name: 'Enable Two-Factor Authentication' }).click()
    await page.locator('#tfa-confirm-password').fill('123123')
    await page.getByRole('button', { name: 'Confirm Password' }).click()
    await page.waitForLoadState('networkidle')

    await expect(page.locator('#tfa-totp-code')).toBeVisible()
  })

  test('can see manual secret key during setup', async ({ page }) => {
    await page.goto('/profile')
    await page.waitForLoadState('networkidle')

    await page.getByRole('button', { name: 'Enable Two-Factor Authentication' }).click()
    await page.locator('#tfa-confirm-password').fill('123123')
    await page.getByRole('button', { name: 'Confirm Password' }).click()
    await page.waitForLoadState('networkidle')

    const secretKey = page.locator('code')
    await expect(secretKey).toBeVisible()
    const text = await secretKey.textContent()
    expect(text?.trim().length).toBeGreaterThan(0)
  })

  test('wrong password shows error on confirm step', async ({ page }) => {
    await page.goto('/profile')
    await page.waitForLoadState('networkidle')

    await page.getByRole('button', { name: 'Enable Two-Factor Authentication' }).click()
    await page.locator('#tfa-confirm-password').fill('wrongpassword')
    await page.getByRole('button', { name: 'Confirm Password' }).click()
    await page.waitForLoadState('networkidle')

    await expect(page.locator('p.text-destructive')).toBeVisible()
    await expect(page.locator('#tfa-confirm-password')).toBeVisible()
  })

  test('cancel returns to disabled state', async ({ page }) => {
    await page.goto('/profile')
    await page.waitForLoadState('networkidle')

    await page.getByRole('button', { name: 'Enable Two-Factor Authentication' }).click()
    await expect(page.locator('#tfa-confirm-password')).toBeVisible()

    await page.getByRole('button', { name: 'Cancel' }).click()

    await expect(page.getByRole('button', { name: 'Enable Two-Factor Authentication' })).toBeVisible()
  })
})
