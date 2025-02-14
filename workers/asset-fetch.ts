export interface Env {
  BUCKET: R2Bucket
}

const MIME_TYPES: { [key: string]: string } = {
  'pdf': 'application/pdf',
  'png': 'image/png',
  'jpg': 'image/jpeg',
  'jpeg': 'image/jpeg',
  'gif': 'image/gif',
  'svg': 'image/svg+xml',
  'webp': 'image/webp',
  'mp4': 'video/mp4',
  'webm': 'video/webm',
  'mp3': 'audio/mpeg',
  'wav': 'audio/wav',
  'json': 'application/json',
  'txt': 'text/plain',
  'css': 'text/css',
  'js': 'text/javascript',
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)
    const key = url.pathname.slice(1) // Remove leading slash

    if (!key) {
      return new Response('Not Found', { status: 404 })
    }

    const extension = key.split('.').pop()?.toLowerCase()
    const mimeType = extension ? MIME_TYPES[extension] : 'application/octet-stream'

    const object = await env.BUCKET.get(key)

    if (!object) {
      return new Response('Not Found', { status: 404 })
    }

    const headers = new Headers()
    headers.set('content-type', mimeType)
    headers.set('cache-control', 'public, max-age=31536000') // Cache for 1 year
    
    // Add CORS headers
    const origin = request.headers.get('origin')
    
    // Check if origin is allowed
    const isAllowedOrigin = origin && (
      // Production URLs
      ['https://yuub.net', 'https://www.yuub.net'].includes(origin) ||
      // Preview deployments
      origin === 'https://yuubnet.pages.dev' ||
      origin.endsWith('-yuubnet.pages.dev') ||
      // Local development
      origin === 'http://localhost:3000'
    )
    
    if (isAllowedOrigin) {
      headers.set('access-control-allow-origin', origin)
    }
    headers.set('access-control-allow-methods', 'GET, HEAD, OPTIONS')
    headers.set('access-control-allow-headers', 'content-type')
    
    // Set content-disposition to inline for PDFs and images
    if (extension && ['pdf', 'png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].includes(extension)) {
      headers.set('content-disposition', 'inline')
    }
    
    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers })
    }
    
    return new Response(object.body, { headers })
  }
}
