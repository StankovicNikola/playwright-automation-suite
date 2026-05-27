import { test } from '@playwright/test'
import { InventoryPage } from '../../pages/InventoryPage'
import { CartPage } from '../../pages/CartPage'
import { CheckoutPage } from '../../pages/CheckoutPage'
import { loginViaUi } from '../../utils/auth'
import { users } from '../../utils/users'
import { products } from '../../utils/products'
import { checkoutData } from '../../utils/checkoutData'

test.describe('Checkout', () => {
  let inventoryPage: InventoryPage
  let cartPage: CartPage
  let checkoutPage: CheckoutPage

  test.beforeEach(async ({ page }) => {
    inventoryPage = new InventoryPage(page)
    cartPage = new CartPage(page)
    checkoutPage = new CheckoutPage(page)

    await loginViaUi(page, users.standard.username, users.standard.password)
    await inventoryPage.addToCartByName(products.backpack)
    await inventoryPage.addToCartByName(products.bikeLight)
    await inventoryPage.goToCart()
  })

  test('completes the full checkout flow', async () => {
    await cartPage.checkout()
    await checkoutPage.fillInfo(checkoutData.validInfo.firstName, checkoutData.validInfo.lastName, checkoutData.validInfo.postalCode)
    await checkoutPage.continue()
    await checkoutPage.assertSummaryTotal(checkoutData.validInfo.expectedTotal)
    await checkoutPage.finish()
    await checkoutPage.assertOrderComplete()
  })

  test('shows error when first name is missing', async () => {
    await cartPage.checkout()
    await checkoutPage.fillInfo('', checkoutData.validInfo.lastName, checkoutData.validInfo.postalCode)
    await checkoutPage.continue()
    await checkoutPage.assertErrorVisible('First Name is required')
  })

  test('shows error when last name is missing', async () => {
    await cartPage.checkout()
    await checkoutPage.fillInfo(checkoutData.validInfo.firstName, '', checkoutData.validInfo.postalCode)
    await checkoutPage.continue()
    await checkoutPage.assertErrorVisible('Last Name is required')
  })

  test('shows error when postal code is missing', async () => {
    await cartPage.checkout()
    await checkoutPage.fillInfo(checkoutData.validInfo.firstName, checkoutData.validInfo.lastName, '')
    await checkoutPage.continue()
    await checkoutPage.assertErrorVisible('Postal Code is required')
  })

  test('cancel from cart returns to inventory', async () => {
    await cartPage.continueShopping()
    await inventoryPage.assertLoaded()
  })
})
