import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// List of blocked user agents
const BLOCKED_USER_AGENTS = [
  'ahrefsbot',
  'semrushbot',
  'mj12bot',
  'rogerbot',
  'dotbot',
  'baiduspider',
  'yandexbot',
]

// List of allowed referrers (add your known sources)
const ALLOWED_REFERRERS = [
  'https://yuubnet.com',
  'https://www.yuubnet.com',
  'http://localhost:3000',
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

interface IpApiResponse {
  country_name: string | null;
  city: string | null;
  error?: boolean;
  [key: string]: any; // for other properties we might not use
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
    let geoData: Pick<IpApiResponse, 'country_name' | 'city'> = { country_name: null, city: null }
    
    // Only attempt geolocation if IP is not 'unknown'
    if (ip !== 'unknown') {
      try {
        const geoResponse = await fetch(`https://ipapi.co/${ip}/json/`)
        if (geoResponse.ok) {
          const data: IpApiResponse = await geoResponse.json()
          // Check if we got a rate limit or error response
          if (!data.error) {
            geoData = data
          }
        }
      } catch (geoError) {
        console.error('Geolocation failed:', geoError)
        // Continue without geolocation data
      }
    }

    const visitor: Visitor = {
      timestamp,
      ip,
      userAgent,
      path,
      referer,
      country: geoData.country_name || undefined,
      city: geoData.city || undefined
    }

    // Send to your analytics endpoint
    await fetch('https://yuubnet-analytics.ipai-mc.workers.dev', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(visitor),
    })
  } catch (error) {
    console.error('Failed to log visit:', error)
  }
}

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Add security headers
  const headers = response.headers
  headers.set('X-Frame-Options', 'DENY')
  headers.set('X-Content-Type-Options', 'nosniff')
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')

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
    if (!ALLOWED_REFERRERS.some(allowed => referrer.startsWith(allowed))) {
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
