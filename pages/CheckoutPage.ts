import { Page, expect } from '@playwright/test'
import { BasePage } from './BasePage'

export class CheckoutPage extends BasePage {
  constructor(page: Page) {
    super(page)
  }

  async fillInfo(firstName: string, lastName: string, postalCode: string): Promise<void> {
    await this.page.getByTestId('firstName').fill(firstName)
    await this.page.getByTestId('lastName').fill(lastName)
    await this.page.getByTestId('postalCode').fill(postalCode)
  }

  async continue(): Promise<void> {
    await this.page.getByTestId('continue').click()
  }

  async finish(): Promise<void> {
    await this.page.getByTestId('finish').click()
  }

  async assertOrderComplete(): Promise<void> {
    await expect(this.page).toHaveURL(/checkout-complete\.html/)
    await expect(this.page.locator('.complete-header')).toContainText('Thank you for your order!')
  }

  async assertSummaryTotal(expected: string): Promise<void> {
    await expect(this.page.locator('.summary_subtotal_label')).toContainText(expected)
  }
}
