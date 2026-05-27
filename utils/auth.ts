import { Page, BrowserContext } from '@playwright/test'
import { ApiClient } from './api-client'

export async function loginViaApi(
  context: BrowserContext,
  email: string,
  password: string,
): Promise<void> {
  const request = await context.request
  const client = new ApiClient(request)
  const { token, sessionId } = await client.login(email, password)

  await context.addCookies([{ name: 'session', value: sessionId, url: process.env.BASE_URL! }])
  await context.addInitScript((t) => localStorage.setItem('auth_token', t), token)
}

export async function saveStorageState(page: Page, path: string): Promise<void> {
  await page.context().storageState({ path })
}
