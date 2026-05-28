import { Page, Locator, expect } from '@playwright/test'
import { BasePage } from './BasePage'

export class CartPage extends BasePage {
  private readonly cartItems: Locator
  private readonly itemName: Locator
  private readonly continueShoppingBtn: Locator
  private readonly checkoutBtn: Locator

  constructor(page: Page) {
    super(page)
    this.cartItems = page.locator('.cart_item')
    this.itemName = page.locator('.inventory_item_name')
    this.continueShoppingBtn = page.getByTestId('continue-shopping')
    this.checkoutBtn = page.getByTestId('checkout')
  }

  async assertLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/cart\.html/)
  }

  getCartItems(): Locator {
    return this.cartItems
  }

  async assertItemPresent(name: string): Promise<void> {
    await expect(this.itemName).toContainText(name)
  }

  async continueShopping(): Promise<void> {
    await this.continueShoppingBtn.click()
  }

  async checkout(): Promise<void> {
    await this.checkoutBtn.click()
  }
}
