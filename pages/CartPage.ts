import { Page, Locator, expect } from '@playwright/test'
import { BasePage } from './BasePage'

export class CartPage extends BasePage {
  constructor(page: Page) {
    super(page)
  }

  async assertLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/cart\.html/)
  }

  getCartItems(): Locator {
    return this.page.locator('.cart_item')
  }

  async assertItemPresent(name: string): Promise<void> {
    await expect(this.page.locator('.inventory_item_name')).toContainText(name)
  }

  async continueShopping(): Promise<void> {
    await this.page.getByTestId('continue-shopping').click()
  }

  async checkout(): Promise<void> {
    await this.page.getByTestId('checkout').click()
  }
}
