import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { logAnalytics } from '@/app/lib/analytics'

// Constants for request filtering
export const BLOCKED_USER_AGENTS = [
  'googlebot',
  'bingbot',
  'yandexbot',
  'baiduspider',
  'facebookexternalhit',
  'twitterbot',
  'rogerbot',
  'linkedinbot',
  'embedly',
  'quora link preview',
  'showyoubot',
  'outbrain',
  'pinterest',
  'slackbot',
  'vkShare',
  'W3C_Validator'
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
    await logAnalytics({ timestamp, ip, userAgent, path, referer })
  } catch (error) {
    console.error('Failed to log visit:', error)
  }
}

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()
  const headers = response.headers
  const isDev = process.env.NODE_ENV === 'development'

  // Generate CSP nonce
  const nonce = crypto.randomUUID()
  headers.set('x-nonce', nonce)

  // Build CSP policies
  const policies = {
    'default-src': ["'self'"],
    'style-src': [`'self'`, `'nonce-${nonce}'`],
    'style-src-attr': [`'self'`, "'unsafe-hashes'", "'sha256-zlqnbDt84zf1iSefLU/ImC54isoprH/MRiVZGskwexk='"],
    'script-src': [`'self'`, `'nonce-${nonce}'`, "'unsafe-inline'", "'strict-dynamic'", 'http:', 'https:', ...(isDev ? ["'unsafe-eval'"] : [])],
    'img-src': [`'self'`, 'blob:', 'data:', process.env.NEXT_PUBLIC_ASSET_FETCH_WORKER_URL || ''],
    'font-src': [`'self'`, 'data:', 'https:'],
    'connect-src': [`'self'`, 'https:'],
    'object-src': ["'none'"],
    'base-uri': [`'self'`],
    'form-action': [`'self'`],
    'frame-ancestors': ["'none'"],
  }

  // Set security headers
  headers.set('Content-Security-Policy', 
    Object.entries(policies)
      .map(([key, values]) => `${key} ${values.join(' ')};`)
      .join(' ')
      .concat(' block-all-mixed-content; upgrade-insecure-requests;')
  )
  headers.set('X-Frame-Options', 'DENY')
  headers.set('X-Content-Type-Options', 'nosniff')
  headers.set('X-XSS-Protection', '1; mode=block')
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), interest-cohort=()')
  headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload')
  headers.set('Cross-Origin-Opener-Policy', 'same-origin')

  // Set CORS headers
  const origin = request.headers.get('origin')
  if (origin && (
    (isDev && origin === 'http://localhost:3000') ||
    origin === 'https://yuub.net' || 
    origin.endsWith('-yuubnet.pages.dev')
  )) {
    headers.set('Access-Control-Allow-Origin', origin)
    headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    headers.set('Access-Control-Allow-Headers', 'Content-Type')
  }

  // Skip logging for static assets
  const path = request.nextUrl.pathname
  if (path.startsWith('/_next/') || path === '/favicon.ico' || path.match(/\.(svg|png|jpg|jpeg|gif|webp)$/)) {
    return response
  }

  // Block known bots
  const userAgent = request.headers.get('user-agent')?.toLowerCase() || ''
  if (userAgent && BLOCKED_USER_AGENTS.some(bot => userAgent.includes(bot.toLowerCase()))) {
    return new NextResponse('Access Denied', { status: 403 })
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
