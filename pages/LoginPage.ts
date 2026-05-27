import { Page, expect } from '@playwright/test'
import { BasePage } from './BasePage'

export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page)
  }

  async goto(): Promise<void> {
    await this.navigate('/')
  }

  async login(username: string, password: string): Promise<void> {
    await this.page.getByTestId('username').fill(username)
    await this.page.getByTestId('password').fill(password)
    await this.page.getByTestId('login-button').click()
  }

  async assertErrorVisible(message?: string): Promise<void> {
    const error = this.page.getByTestId('error')
    await expect(error).toBeVisible()
    if (message) await expect(error).toContainText(message)
  }
}
