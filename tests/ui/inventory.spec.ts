import { test, expect } from '@playwright/test'
import { InventoryPage } from '../../pages/InventoryPage'
import { CartPage } from '../../pages/CartPage'
import { loginViaUi } from '../../utils/auth'
import { users } from '../../utils/users'
import { products } from '../../utils/products'

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
      await expect(inventoryPage.getItemName(item)).not.toBeEmpty()
      await expect(inventoryPage.getItemPrice(item)).not.toBeEmpty()
      await expect(inventoryPage.getItemButton(item)).toContainText('Add to cart')
    }
  })

  test.describe('Sorting', () => {
    test('default order is A→Z', async () => {
      await expect(inventoryPage.getItemNames().first()).toContainText(products.firstAZ)
    })

    test('sorts Z→A', async () => {
      await inventoryPage.sortBy('za')
      await expect(inventoryPage.getItemNames().first()).toContainText(products.firstZA)
    })

    test('sorts price low→high', async () => {
      await inventoryPage.sortBy('lohi')
      await expect(inventoryPage.getItemPrices().first()).toContainText(products.lowestPrice)
    })

    test('sorts price high→low', async () => {
      await inventoryPage.sortBy('hilo')
      await expect(inventoryPage.getItemPrices().first()).toContainText(products.highestPrice)
    })
  })

  test.describe('Cart', () => {
    test('adds product and updates cart badge', async () => {
      await inventoryPage.addToCartByName(products.backpack)
      await expect(inventoryPage.getCartBadge()).toHaveText('1')
    })

    test('adds multiple products and reflects correct count', async () => {
      await inventoryPage.addToCartByName(products.backpack)
      await inventoryPage.addToCartByName(products.bikeLight)
      await expect(inventoryPage.getCartBadge()).toHaveText('2')
    })

    test('removes product from inventory page', async () => {
      await inventoryPage.addToCartByName(products.backpack)
      await inventoryPage.removeFromCartByName(products.backpack)
      await inventoryPage.assertCartBadgeNotVisible()
    })

    test('navigates to cart with correct item', async () => {
      await inventoryPage.addToCartByName(products.backpack)
      await inventoryPage.goToCart()
      await cartPage.assertLoaded()
      await cartPage.assertItemPresent(products.backpack)
    })
  })
})
