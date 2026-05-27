import { test, expect } from '@playwright/test'
import { InventoryPage } from '../../pages/InventoryPage'
import { CartPage } from '../../pages/CartPage'
import { loginViaUi } from '../../utils/auth'
import { users } from '../../utils/users'

test.describe('Inventory', () => {
  let inventoryPage: InventoryPage
  let cartPage: CartPage

  test.beforeEach(async ({ page }) => {
    inventoryPage = new InventoryPage(page)
    cartPage = new CartPage(page)
    await loginViaUi(page, users.standard.username, users.standard.password)
  })

  test('displays 6 products', async () => {
    await expect(inventoryPage.getItems()).toHaveCount(6)
  })

  test('each product has a name, price and button', async () => {
    const items = inventoryPage.getItems()
    const count = await items.count()
    for (let i = 0; i < count; i++) {
      const item = items.nth(i)
      await expect(item.locator('.inventory_item_name')).not.toBeEmpty()
      await expect(item.locator('.inventory_item_price')).not.toBeEmpty()
      await expect(item.locator('button')).toContainText('Add to cart')
    }
  })

  test.describe('Sorting', () => {
    test('default order is A→Z', async () => {
      await expect(inventoryPage.getItemNames().first()).toContainText('Sauce Labs Backpack')
    })

    test('sorts Z→A', async () => {
      await inventoryPage.sortBy('za')
      await expect(inventoryPage.getItemNames().first()).toContainText('Test.allTheThings()')
    })

    test('sorts price low→high', async () => {
      await inventoryPage.sortBy('lohi')
      await expect(inventoryPage.getItemPrices().first()).toContainText('$7.99')
    })

    test('sorts price high→low', async () => {
      await inventoryPage.sortBy('hilo')
      await expect(inventoryPage.getItemPrices().first()).toContainText('$49.99')
    })
  })

  test.describe('Cart', () => {
    test('adds product and updates cart badge', async () => {
      await inventoryPage.addToCartByName('Sauce Labs Backpack')
      await expect(inventoryPage.getCartBadge()).toHaveText('1')
    })

    test('adds multiple products and reflects correct count', async () => {
      await inventoryPage.addToCartByName('Sauce Labs Backpack')
      await inventoryPage.addToCartByName('Sauce Labs Bike Light')
      await expect(inventoryPage.getCartBadge()).toHaveText('2')
    })

    test('removes product from inventory page', async ({ page }) => {
      await inventoryPage.addToCartByName('Sauce Labs Backpack')
      await inventoryPage.removeFromCartByName('Sauce Labs Backpack')
      await expect(page.locator('.shopping_cart_badge')).not.toBeVisible()
    })

    test('navigates to cart with correct item', async () => {
      await inventoryPage.addToCartByName('Sauce Labs Backpack')
      await inventoryPage.goToCart()
      await cartPage.assertLoaded()
      await cartPage.assertItemPresent('Sauce Labs Backpack')
    })
  })
})
