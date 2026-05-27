import { Page, expect } from '@playwright/test'
import { BasePage } from './BasePage'

export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page)
  }

  async goto(): Promise<void> {
    await this.navigate('/login')
  }

  async login(email: string, password: string): Promise<void> {
    await this.getByTestId('email-input').fill(email)
    await this.getByTestId('password-input').fill(password)
    await this.getByTestId('login-submit').click()
  }

  async assertErrorVisible(message?: string): Promise<void> {
    const error = this.getByTestId('login-error')
    await expect(error).toBeVisible()
    if (message) await expect(error).toContainText(message)
  }
}
