import { Page, Locator, expect } from '@playwright/test'
import { BasePage } from './BasePage'

export class CheckoutPage extends BasePage {
  private readonly firstNameInput: Locator
  private readonly lastNameInput: Locator
  private readonly postalCodeInput: Locator
  private readonly continueBtn: Locator
  private readonly finishBtn: Locator
  private readonly errorMessage: Locator
  private readonly completeHeader: Locator
  private readonly summarySubtotalLabel: Locator

  constructor(page: Page) {
    super(page)
    this.firstNameInput = page.getByTestId('firstName')
    this.lastNameInput = page.getByTestId('lastName')
    this.postalCodeInput = page.getByTestId('postalCode')
    this.continueBtn = page.getByTestId('continue')
    this.finishBtn = page.getByTestId('finish')
    this.errorMessage = page.getByTestId('error')
    this.completeHeader = page.locator('.complete-header')
    this.summarySubtotalLabel = page.locator('.summary_subtotal_label')
  }

  async fillInfo(firstName: string, lastName: string, postalCode: string): Promise<void> {
    await this.firstNameInput.fill(firstName)
    await this.lastNameInput.fill(lastName)
    await this.postalCodeInput.fill(postalCode)
  }

  async continue(): Promise<void> {
    await this.continueBtn.click()
  }

  async finish(): Promise<void> {
    await this.finishBtn.click()
  }

  async assertOrderComplete(): Promise<void> {
    await expect(this.page).toHaveURL(/checkout-complete\.html/)
    await expect(this.completeHeader).toContainText('Thank you for your order!')
  }

  async assertSummaryTotal(expected: string): Promise<void> {
    await expect(this.summarySubtotalLabel).toContainText(expected)
  }

  async assertErrorVisible(message: string): Promise<void> {
    await expect(this.errorMessage).toContainText(message)
  }
}
