import { Page, Locator, expect } from '@playwright/test'
import { BasePage } from './BasePage'

export class LoginPage extends BasePage {
  private readonly usernameInput: Locator
  private readonly passwordInput: Locator
  private readonly loginButton: Locator
  private readonly errorMessage: Locator

  constructor(page: Page) {
    super(page)
    this.usernameInput = page.getByTestId('username')
    this.passwordInput = page.getByTestId('password')
    this.loginButton = page.getByTestId('login-button')
    this.errorMessage = page.getByTestId('error')
  }

  async goto(): Promise<void> {
    await this.navigate('/')
  }

  async fillUsername(username: string): Promise<void> {
    await this.usernameInput.fill(username)
  }

  async fillPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password)
  }

  async submit(): Promise<void> {
    await this.loginButton.click()
  }

  async login(username: string, password: string): Promise<void> {
    await this.fillUsername(username)
    await this.fillPassword(password)
    await this.submit()
  }

  async assertErrorVisible(message?: string): Promise<void> {
    await expect(this.errorMessage).toBeVisible()
    if (message) await expect(this.errorMessage).toContainText(message)
  }
}
