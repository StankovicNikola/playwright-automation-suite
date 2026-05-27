import { Page, expect } from '@playwright/test'
import { BasePage } from './BasePage'

export class DashboardPage extends BasePage {
  constructor(page: Page) {
    super(page)
  }

  async assertLoaded(): Promise<void> {
    await expect(this.getByTestId('welcome-banner')).toBeVisible()
    await this.waitForUrl(/dashboard/)
  }

  async logout(): Promise<void> {
    await this.getByTestId('user-menu').click()
    await this.getByTestId('logout').click()
    await this.waitForUrl(/login/)
  }
}
