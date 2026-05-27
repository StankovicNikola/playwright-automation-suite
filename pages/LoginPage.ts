import { Page, expect } from '@playwright/test'
import { BasePage } from './BasePage'

export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page)
  }

  async goto(): Promise<void> {
    await this.navigate('/')
  }

  async fillUsername(username: string): Promise<void> {
    await this.page.getByTestId('username').fill(username)
  }

  async fillPassword(password: string): Promise<void> {
    await this.page.getByTestId('password').fill(password)
  }

  async submit(): Promise<void> {
    await this.page.getByTestId('login-button').click()
  }

  async login(username: string, password: string): Promise<void> {
    await this.fillUsername(username)
    await this.fillPassword(password)
    await this.submit()
  }

  async assertErrorVisible(message?: string): Promise<void> {
    const error = this.page.getByTestId('error')
    await expect(error).toBeVisible()
    if (message) await expect(error).toContainText(message)
  }
}
