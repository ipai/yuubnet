import { describe, it, expect, beforeEach } from 'vitest'
import { POST } from './route'
import { ANALYTICS_WORKER_URL } from '@/lib/constants'

vi.mock('next/server', () => ({
  NextResponse: {
    json: (data: any, init?: any) => new Response(JSON.stringify(data), init)
  }
}))

describe('Analytics Log API', () => {
  it('should forward request to worker and return response', async () => {
    const mockResponse = { success: true }
    const mockRequest = new Request('http://localhost/api/analytics/log', {
      method: 'POST',
      body: JSON.stringify({ path: '/test' }),
    })

    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    })

    const response = await POST(mockRequest)
    const data = await response.json()

    expect(global.fetch).toHaveBeenCalledWith(ANALYTICS_WORKER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: mockRequest.body,
    })
    expect(data).toEqual(mockResponse)
  })

  it('should handle worker errors', async () => {
    const mockError = { error: 'Worker error' }
    const mockRequest = new Request('http://localhost/api/analytics/log', {
      method: 'POST',
      body: JSON.stringify({ path: '/test' }),
    })

    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: () => Promise.resolve(mockError),
    })

    const response = await POST(mockRequest)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data).toEqual(mockError)
  })
})
