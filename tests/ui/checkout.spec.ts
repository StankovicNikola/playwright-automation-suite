import { test, expect } from '@playwright/test'
import { InventoryPage } from '../../pages/InventoryPage'
import { CartPage } from '../../pages/CartPage'
import { CheckoutPage } from '../../pages/CheckoutPage'
import { loginViaUi } from '../../utils/auth'
import { users } from '../../utils/users'

test.describe('Checkout', () => {
  let inventoryPage: InventoryPage
  let cartPage: CartPage
  let checkoutPage: CheckoutPage

  test.beforeEach(async ({ page }) => {
    inventoryPage = new InventoryPage(page)
    cartPage = new CartPage(page)
    checkoutPage = new CheckoutPage(page)

    await loginViaUi(page, users.standard.username, users.standard.password)
    await inventoryPage.addToCartByName('Sauce Labs Backpack')
    await inventoryPage.addToCartByName('Sauce Labs Bike Light')
    await inventoryPage.goToCart()
  })

  test('completes the full checkout flow', async () => {
    await cartPage.checkout()
    await checkoutPage.fillInfo('Nikola', 'Stankovic', '11000')
    await checkoutPage.continue()
    await checkoutPage.assertSummaryTotal('$39.98')
    await checkoutPage.finish()
    await checkoutPage.assertOrderComplete()
  })

  test('shows error when first name is missing', async ({ page }) => {
    await cartPage.checkout()
    await checkoutPage.fillInfo('', 'Stankovic', '11000')
    await checkoutPage.continue()
    await expect(page.getByTestId('error')).toContainText('First Name is required')
  })

  test('shows error when last name is missing', async ({ page }) => {
    await cartPage.checkout()
    await checkoutPage.fillInfo('Nikola', '', '11000')
    await checkoutPage.continue()
    await expect(page.getByTestId('error')).toContainText('Last Name is required')
  })

  test('shows error when postal code is missing', async ({ page }) => {
    await cartPage.checkout()
    await checkoutPage.fillInfo('Nikola', 'Stankovic', '')
    await checkoutPage.continue()
    await expect(page.getByTestId('error')).toContainText('Postal Code is required')
  })

  test('cancel from cart returns to inventory', async () => {
    await cartPage.continueShopping()
    await inventoryPage.assertLoaded()
  })
})
