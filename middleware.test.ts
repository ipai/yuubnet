import { describe, it, expect, beforeEach, beforeAll, afterAll, vi } from 'vitest'
import { NextRequest, NextResponse } from 'next/server'
import { middleware } from './middleware'
import { BLOCKED_USER_AGENTS, ALLOWED_REFERRERS } from './app/lib/env'

vi.mock('next/server', async () => {
  const actual = await vi.importActual('next/server') as typeof import('next/server')
  
  class NextResponseMock extends Response {
    static next() {
      return new NextResponseMock(null, { headers: new Headers() })
    }
    
    static json(data: any, init?: ResponseInit) {
      return new NextResponseMock(JSON.stringify(data), init)
    }
  }

  class NextRequestMock {
    nextUrl: URL
    headers: Headers
    method: string
    
    constructor(input: string | URL, init?: RequestInit) {
      this.nextUrl = new URL(input)
      this.headers = new Headers(init?.headers)
      this.method = init?.method || 'GET'
    }
  }
  
  return {
    ...actual,
    NextResponse: NextResponseMock,
    NextRequest: NextRequestMock
  }
})

describe('Middleware', () => {
  const originalFetch = global.fetch
  
  beforeAll(() => {
    // Mock console.error to avoid noise in test output
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })
  
  afterAll(() => {
    global.fetch = originalFetch
    vi.restoreAllMocks()
  })
  beforeEach(() => {
    // Reset fetch mock before each test
    vi.resetAllMocks()
    global.fetch = vi.fn()
  })

  it('should allow normal requests and log visit', async () => {
    const request = new NextRequest('http://localhost/test', {
      headers: {
        'user-agent': 'normal-user-agent',
        'x-forwarded-for': '1.2.3.4',
        'referer': 'https://google.com'
      }
    })

    const response = await middleware(request)
    
    // Verify that fetch was called to log the visit
    expect(global.fetch).toHaveBeenCalled()
    expect(response).toBeInstanceOf(NextResponse)
  })

  it('should block requests from blocked user agents', async () => {
    const request = new NextRequest('http://localhost/test', {
      headers: {
        'user-agent': BLOCKED_USER_AGENTS[0],
        'x-forwarded-for': '1.2.3.4'
      }
    })

    const response = await middleware(request)
    
    // Verify that the request was blocked
    expect(response.status).toBe(403)
    // Verify that no analytics request was made
    expect(global.fetch).not.toHaveBeenCalled()
  })

  it('should handle missing headers gracefully', async () => {
    const request = new NextRequest('http://localhost/test', {
      headers: {} // No headers provided
    })

    const response = await middleware(request)
    
    // Verify that fetch was called with default values
    expect(global.fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        body: expect.stringMatching(/"ip":"unknown"/) && 
             expect.stringMatching(/"userAgent":"unknown"/) && 
             expect.stringMatching(/"referer":"direct"/),
      })
    )
  })

  it('should set security headers correctly', async () => {
    const request = new NextRequest('http://localhost/test')
    const response = await middleware(request)
    
    expect(response.headers.get('X-Frame-Options')).toBe('DENY')
    expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff')
    expect(response.headers.get('Referrer-Policy')).toBe('strict-origin-when-cross-origin')
    expect(response.headers.get('Permissions-Policy')).toBe('camera=(), microphone=(), geolocation=()')
  })

  it('should set rate limit headers', async () => {
    const request = new NextRequest('http://localhost/test')
    const response = await middleware(request)
    
    expect(response.headers.get('X-RateLimit-Limit')).toBe('60')
  })

  it('should block non-GET requests with invalid referrer', async () => {
    const request = new NextRequest('http://localhost/test', {
      method: 'POST',
      headers: {
        'referer': 'https://malicious-site.com'
      }
    })

    const response = await middleware(request)
    expect(response.status).toBe(403)
    expect(await response.text()).toBe('Invalid referrer')
  })

  it('should allow non-GET requests with valid referrer', async () => {
    const request = new NextRequest('http://localhost/test', {
      method: 'POST',
      headers: {
        'referer': 'http://localhost:3000'
      }
    })

    const response = await middleware(request)
    expect(response.status).toBe(200)
  })

  it('should handle different IP header combinations', async () => {
    // Test x-forwarded-for
    const request1 = new NextRequest('http://localhost/test', {
      headers: {
        'x-forwarded-for': '1.2.3.4, 5.6.7.8'
      }
    })
    await middleware(request1)
    expect(global.fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        body: expect.stringMatching(/"ip":"1\.2\.3\.4"/)
      })
    )

    vi.clearAllMocks()

    // Test x-real-ip
    const request2 = new NextRequest('http://localhost/test', {
      headers: {
        'x-real-ip': '9.10.11.12'
      }
    })
    await middleware(request2)
    expect(global.fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        body: expect.stringMatching(/"ip":"9\.10\.11\.12"/)
      })
    )
  })

  it('should handle analytics logging errors gracefully', async () => {
    // Make fetch throw an error
    global.fetch = vi.fn().mockRejectedValueOnce(new Error('Network error'))
    
    const request = new NextRequest('http://localhost/test')
    const response = await middleware(request)
    
    // Should not throw and should return normal response
    expect(response.status).toBe(200)
    expect(console.error).toHaveBeenCalledWith(
      'Failed to log visit:',
      expect.any(Error)
    )
  })

  it('should not log visits to excluded paths', async () => {
    const excludedPaths = [
      '/_next/static/chunks/pages',
      '/_next/image/test.jpg',
      '/favicon.ico',
      '/test.png',
      '/images/test.jpg'
    ]

    for (const path of excludedPaths) {
      // Reset fetch mock before each path test
      vi.clearAllMocks()
      
      const request = new NextRequest(`http://localhost${path}`, {
        headers: {
          'user-agent': 'normal-user-agent',
          'x-forwarded-for': '1.2.3.4'
        }
      })

      const response = await middleware(request)
      
      // Verify that no analytics request was made for excluded paths
      expect(global.fetch).not.toHaveBeenCalled()
      expect(response).toBeInstanceOf(Response)
      expect(response.headers.get('X-Frame-Options')).toBe('DENY')
    }
  })
})
