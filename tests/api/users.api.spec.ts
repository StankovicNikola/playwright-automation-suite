import { test, expect } from '@playwright/test'
import { ApiClient } from '../../utils/api-client'

test.describe('Users API', () => {
  let client: ApiClient

  test.beforeEach(async ({ request }) => {
    client = new ApiClient(request)
  })

  test('GET /users returns a list', async () => {
    const res = await client.get('/users')
    expect(res.ok()).toBeTruthy()
    const body = await res.json()
    expect(Array.isArray(body.data)).toBe(true)
  })

  test('GET /users/:id returns a single user', async () => {
    const res = await client.get('/users/1')
    expect(res.ok()).toBeTruthy()
    const user = await res.json()
    expect(user).toMatchObject({ id: expect.any(Number), email: expect.any(String) })
  })

  test('POST /users creates a user', async () => {
    const payload = { name: 'Test User', email: `qa+${Date.now()}@example.com` }
    const res = await client.post('/users', payload)
    expect(res.status()).toBe(201)
    const created = await res.json()
    expect(created.email).toBe(payload.email)
  })

  test('DELETE /users/:id removes the user', async () => {
    const createRes = await client.post('/users', {
      name: 'Temp User',
      email: `temp+${Date.now()}@example.com`,
    })
    const { id } = await createRes.json()
    const deleteRes = await client.delete(`/users/${id}`)
    expect(deleteRes.status()).toBe(204)
  })

  test('GET /users/:id returns 404 for unknown id', async () => {
    const res = await client.get('/users/999999')
    expect(res.status()).toBe(404)
  })
})
