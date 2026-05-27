import { test, expect } from '@playwright/test'
import { LoginPage } from '../../pages/LoginPage'
import { DashboardPage } from '../../pages/DashboardPage'

test.describe('Authentication', () => {
  let loginPage: LoginPage
  let dashboardPage: DashboardPage

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page)
    dashboardPage = new DashboardPage(page)
    await loginPage.goto()
  })

  test.describe('Valid credentials', () => {
    test('logs in and lands on dashboard', async ({ page }) => {
      await loginPage.login('testuser@example.com', 'Test@1234')
      await dashboardPage.assertLoaded()
    })

    test('logs out successfully', async ({ page }) => {
      await loginPage.login('testuser@example.com', 'Test@1234')
      await dashboardPage.assertLoaded()
      await dashboardPage.logout()
      await expect(page).toHaveURL(/login/)
    })
  })

  test.describe('Invalid credentials', () => {
    test('shows error for wrong password', async () => {
      await loginPage.login('testuser@example.com', 'WrongPass')
      await loginPage.assertErrorVisible('Invalid email or password')
    })

    test('shows error for unknown email', async () => {
      await loginPage.login('ghost@example.com', 'Test@1234')
      await loginPage.assertErrorVisible('Invalid email or password')
    })
  })

  test.describe('Accessibility', () => {
    test('login form is keyboard-navigable', async ({ page }) => {
      await page.keyboard.press('Tab')
      await expect(loginPage.getByTestId('email-input')).toBeFocused()
      await page.keyboard.press('Tab')
      await expect(loginPage.getByTestId('password-input')).toBeFocused()
      await page.keyboard.press('Tab')
      await expect(loginPage.getByTestId('login-submit')).toBeFocused()
    })
  })
})
