import { test, expect } from '@playwright/test'

// Issue #726: keyboard users must be able to bypass the nav, and client-side
// route changes must move focus and announce the new page.
test.describe('a11y · skip link and route focus', () => {
  test('first Tab focuses the skip link and Enter moves focus to <main>', async ({ page }) => {
    await page.goto('/wallet')

    await page.keyboard.press('Tab')
    const skipLink = page.locator('a.skip-to-content')
    await expect(skipLink).toBeFocused()
    await expect(skipLink).toBeVisible()

    await page.keyboard.press('Enter')
    await expect(page.locator('#main-content')).toBeFocused()
  })

  test('route change focuses <main> and announces the new page', async ({ page }) => {
    await page.goto('/wallet')

    await page.locator('.sidebar-nav button').filter({ hasText: 'Agents' }).first().click()
    await expect(page).toHaveURL(/\/agents$/)

    await expect(page.locator('#main-content')).toBeFocused()
    await expect(page.getByTestId('route-announcer')).toHaveText('Navigated to Agent Registry')
  })
})
