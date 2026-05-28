import { Page, Locator, expect } from '@playwright/test'
import { BasePage } from './BasePage'

export class InventoryPage extends BasePage {
  private readonly inventoryList: Locator
  private readonly inventoryItems: Locator
  private readonly itemNames: Locator
  private readonly itemPrices: Locator
  private readonly sortContainer: Locator
  private readonly cartBadge: Locator
  private readonly cartLink: Locator
  private readonly burgerMenuBtn: Locator
  private readonly logoutSidebarLink: Locator

  private readonly itemSelectors = {
    name: '.inventory_item_name',
    price: '.inventory_item_price',
    button: 'button',
  }

  constructor(page: Page) {
    super(page)
    this.inventoryList = page.locator('.inventory_list')
    this.inventoryItems = page.locator('.inventory_item')
    this.itemNames = page.locator('.inventory_item_name')
    this.itemPrices = page.locator('.inventory_item_price')
    this.sortContainer = page.getByTestId('product-sort-container')
    this.cartBadge = page.locator('.shopping_cart_badge')
    this.cartLink = page.locator('.shopping_cart_link')
    this.burgerMenuBtn = page.locator('#react-burger-menu-btn')
    this.logoutSidebarLink = page.locator('#logout_sidebar_link')
  }

  async goto(): Promise<void> {
    await this.navigate('/inventory.html')
  }

  async assertLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/inventory\.html/)
    await expect(this.inventoryList).toBeVisible()
  }

  getItems(): Locator {
    return this.inventoryItems
  }

  getItemNames(): Locator {
    return this.itemNames
  }

  getItemPrices(): Locator {
    return this.itemPrices
  }

  getItemName(item: Locator): Locator {
    return item.locator(this.itemSelectors.name)
  }

  getItemPrice(item: Locator): Locator {
    return item.locator(this.itemSelectors.price)
  }

  getItemButton(item: Locator): Locator {
    return item.locator(this.itemSelectors.button)
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
    await this.sortContainer.selectOption(option)
  }

  getCartBadge(): Locator {
    return this.cartBadge
  }

  async assertCartBadgeNotVisible(): Promise<void> {
    await expect(this.cartBadge).not.toBeVisible()
  }

  async goToCart(): Promise<void> {
    await this.cartLink.click()
  }

  async logout(): Promise<void> {
    await this.burgerMenuBtn.click()
    await this.logoutSidebarLink.click()
  }
}
