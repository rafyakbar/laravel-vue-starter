import { test, expect } from '@playwright/test'

/**
 * Admin role — theme switching tests.
 *
 * Theme menu: SunMoon icon button (sr-only "Theme")
 * Options: "Light", "Dark", "System"
 *
 * Dark mode: adds class "dark" to <html>
 * Light mode: removes class "dark" from <html>
 */
test.describe('Admin Role — Theme Switching', () => {
  test.beforeEach(async ({ page }) => {
    // Reset theme to system default
    await page.goto('/admin')
    await page.waitForLoadState('networkidle')
    await page.evaluate(() => localStorage.removeItem('theme'))
    await page.reload()
    await page.waitForLoadState('networkidle')
  })

  test('switching to dark mode adds dark class to html', async ({ page }) => {
    await page.getByRole('button', { name: 'Theme' }).click()
    await page.getByText('Dark').click()
    const htmlClass = await page.locator('html').getAttribute('class')
    expect(htmlClass).toContain('dark')
  })

  test('switching to light mode removes dark class', async ({ page }) => {
    // First set dark
    await page.getByRole('button', { name: 'Theme' }).click()
    await page.getByText('Dark').click()
    let htmlClass = await page.locator('html').getAttribute('class')
    expect(htmlClass).toContain('dark')

    // Then switch to light
    await page.getByRole('button', { name: 'Theme' }).click()
    await page.getByText('Light').click()
    htmlClass = await page.locator('html').getAttribute('class')
    expect(htmlClass ?? '').not.toContain('dark')
  })

  test('theme persists after page reload', async ({ page }) => {
    await page.getByRole('button', { name: 'Theme' }).click()
    await page.getByText('Dark').click()
    let htmlClass = await page.locator('html').getAttribute('class')
    expect(htmlClass).toContain('dark')

    await page.reload()
    htmlClass = await page.locator('html').getAttribute('class')
    expect(htmlClass).toContain('dark')
  })
})
