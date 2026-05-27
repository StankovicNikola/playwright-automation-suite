import { test, expect } from '@playwright/test'
import { LoginPage } from '../../pages/LoginPage'
import { InventoryPage } from '../../pages/InventoryPage'
import { users } from '../../utils/users'

test.describe('Login', () => {
  let loginPage: LoginPage
  let inventoryPage: InventoryPage

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page)
    inventoryPage = new InventoryPage(page)
    await loginPage.goto()
  })

  test.describe('Valid credentials', () => {
    test('standard_user logs in and lands on inventory', async () => {
      await loginPage.login(users.standard.username, users.standard.password)
      await inventoryPage.assertLoaded()
    })

    test('performance_glitch_user eventually logs in', async () => {
      await loginPage.login(users.glitch.username, users.glitch.password)
      await inventoryPage.assertLoaded()
    })
  })

  test.describe('Invalid credentials', () => {
    test('shows error for wrong password', async () => {
      await loginPage.login(users.standard.username, 'wrong_password')
      await loginPage.assertErrorVisible('Username and password do not match')
    })

    test('locked_out_user cannot log in', async () => {
      await loginPage.login(users.locked.username, users.locked.password)
      await loginPage.assertErrorVisible('Sorry, this user has been locked out')
    })

    test('shows error when username is missing', async () => {
      await loginPage.fillPassword(users.standard.password)
      await loginPage.submit()
      await loginPage.assertErrorVisible('Username is required')
    })

    test('shows error when password is missing', async () => {
      await loginPage.fillUsername(users.standard.username)
      await loginPage.submit()
      await loginPage.assertErrorVisible('Password is required')
    })
  })

  test.describe('Session', () => {
    test('logs out and redirects to login', async ({ page }) => {
      await loginPage.login(users.standard.username, users.standard.password)
      await inventoryPage.assertLoaded()
      await inventoryPage.logout()
      await expect(page).toHaveURL('/')
    })
  })
})
