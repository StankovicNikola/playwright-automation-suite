import { APIRequestContext, APIResponse } from '@playwright/test'

export class ApiClient {
  constructor(private readonly request: APIRequestContext) {}

  async login(email: string, password: string): Promise<{ token: string; sessionId: string }> {
    const res = await this.post('/auth/login', { email, password })
    await this.assertOk(res)
    return res.json()
  }

  async get(path: string, params?: Record<string, string>): Promise<APIResponse> {
    return this.request.get(path, { params })
  }

  async post(path: string, body: unknown): Promise<APIResponse> {
    return this.request.post(path, { data: body })
  }

  async patch(path: string, body: unknown): Promise<APIResponse> {
    return this.request.patch(path, { data: body })
  }

  async delete(path: string): Promise<APIResponse> {
    return this.request.delete(path)
  }

  private async assertOk(res: APIResponse): Promise<void> {
    if (!res.ok()) {
      const body = await res.text()
      throw new Error(`Request failed ${res.status()}: ${body}`)
    }
  }
}
