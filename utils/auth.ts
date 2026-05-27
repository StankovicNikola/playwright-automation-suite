import { Page } from '@playwright/test'

export async function loginViaUi(page: Page, username: string, password: string): Promise<void> {
  await page.goto('/')
  await page.getByTestId('username').fill(username)
  await page.getByTestId('password').fill(password)
  await page.getByTestId('login-button').click()
  await page.waitForURL(/inventory\.html/)
}
