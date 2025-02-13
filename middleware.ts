import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { logAnalytics } from '@/app/lib/analytics'

// Constants for request filtering
export const BLOCKED_USER_AGENTS = [
  'bot',
  'crawler',
  'spider',
  'scraper'
]

export const ALLOWED_REFERRERS = [
  'localhost',
  'yuubnet.pages.dev',
  'yuub.net'
]

interface Visitor {
  timestamp: Date
  ip: string
  userAgent: string
  path: string
  referer: string
  country?: string
  city?: string
}

async function logVisit(request: NextRequest): Promise<void> {
  const timestamp = new Date()
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
             request.headers.get('x-real-ip') ||
             'unknown'
  const userAgent = request.headers.get('user-agent') || 'unknown'
  const path = request.nextUrl.pathname
  const referer = request.headers.get('referer') || 'direct'

  try {
    const visitor: Visitor = {
      timestamp,
      ip,
      userAgent,
      path,
      referer
    }

    await logAnalytics(visitor)
  } catch (error) {
    console.error('Failed to log visit:', error)
  }
}

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Define CSP Header
  const isDev = process.env.NODE_ENV === 'development'

  // Add security headers
  const headers = response.headers

  const cspHeader = `
    default-src 'self';
    style-src 'self' 'unsafe-inline';
    script-src 'self' 'unsafe-inline' 'unsafe-eval' https://static.cloudflareinsights.com;
    img-src 'self' blob: data: ${process.env.NEXT_PUBLIC_ASSET_FETCH_WORKER_URL || ''};
    font-src 'self' data: https:;
    connect-src 'self' https:;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    block-all-mixed-content;
    upgrade-insecure-requests;
  `.replace(/\s{2,}/g, ' ').trim()

  // Add CSP header
  headers.set('Content-Security-Policy', cspHeader)

  // Add other security headers
  headers.set('X-Frame-Options', 'DENY')
  headers.set('X-Content-Type-Options', 'nosniff')
  headers.set('X-XSS-Protection', '1; mode=block')
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), interest-cohort=()')

  // Check if path should be excluded from logging
  const path = request.nextUrl.pathname
  if (path.startsWith('/_next/static') || 
      path.startsWith('/_next/image') || 
      path === '/favicon.ico' || 
      path.match(/\.(svg|png|jpg|jpeg|gif|webp)$/)) {
    return response
  }

  // Check user agent
  const userAgent = request.headers.get('user-agent')?.toLowerCase() || ''
  if (BLOCKED_USER_AGENTS.some(bot => userAgent.includes(bot))) {
    return new NextResponse('Access Denied', { status: 403 })
  }

  // Basic rate limiting using headers
  const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0] || 
                  request.headers.get('x-real-ip') ||
                  'unknown'
  const requestsPerMinute = 60
  
  // You might want to implement proper rate limiting here using Redis or similar
  // This is just a basic example using headers
  headers.set('X-RateLimit-Limit', requestsPerMinute.toString())

  // Check referrer for non-GET requests
  if (request.method !== 'GET') {
    const referrer = request.headers.get('referer') || ''
    console.log('Method:', request.method)
    console.log('Referrer:', referrer)
    console.log('Allowed referrers:', ALLOWED_REFERRERS)
    const isAllowed = ALLOWED_REFERRERS.some(allowed => referrer.startsWith(allowed))
    console.log('Is allowed:', isAllowed)
    if (!isAllowed) {
      return new NextResponse('Invalid referrer', { status: 403 })
    }
  }

  // Log the visit
  await logVisit(request)

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public directory)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
