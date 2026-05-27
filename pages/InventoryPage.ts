import { Page, Locator, expect } from '@playwright/test'
import { BasePage } from './BasePage'

export class InventoryPage extends BasePage {
  constructor(page: Page) {
    super(page)
  }

  async goto(): Promise<void> {
    await this.navigate('/inventory.html')
  }

  async assertLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/inventory\.html/)
    await expect(this.page.locator('.inventory_list')).toBeVisible()
  }

  getItems(): Locator {
    return this.page.locator('.inventory_item')
  }

  getItemNames(): Locator {
    return this.page.locator('.inventory_item_name')
  }

  getItemPrices(): Locator {
    return this.page.locator('.inventory_item_price')
  }

  async addToCartByName(name: string): Promise<void> {
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, '')
    await this.page.getByTestId(`add-to-cart-${slug}`).click()
  }

  async removeFromCartByName(name: string): Promise<void> {
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, '')
    await this.page.getByTestId(`remove-${slug}`).click()
  }

  async sortBy(option: 'az' | 'za' | 'lohi' | 'hilo'): Promise<void> {
    await this.page.getByTestId('product-sort-container').selectOption(option)
  }

  getItemName(item: Locator): Locator {
    return item.locator('.inventory_item_name')
  }

  getItemPrice(item: Locator): Locator {
    return item.locator('.inventory_item_price')
  }

  getItemButton(item: Locator): Locator {
    return item.locator('button')
  }

  getCartBadge(): Locator {
    return this.page.locator('.shopping_cart_badge')
  }

  async assertCartBadgeNotVisible(): Promise<void> {
    await expect(this.page.locator('.shopping_cart_badge')).not.toBeVisible()
  }

  async goToCart(): Promise<void> {
    await this.page.locator('.shopping_cart_link').click()
  }

  async logout(): Promise<void> {
    await this.page.locator('#react-burger-menu-btn').click()
    await this.page.locator('#logout_sidebar_link').click()
  }
}
