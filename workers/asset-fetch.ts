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
    const origin = request.headers.get('origin')
    
    // Add CORS headers to all responses
    const corsHeaders = {
      'Access-Control-Allow-Origin': origin || '*',
      'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    }
    
    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: corsHeaders,
      })
    }
    
    const key = url.pathname.slice(1) // Remove leading slash
    if (!key) {
      return new Response('Not Found', { 
        status: 404,
        headers: corsHeaders
      })
    }

    const extension = key.split('.').pop()?.toLowerCase()
    const mimeType = extension ? MIME_TYPES[extension] : 'application/octet-stream'

    const object = await env.BUCKET.get(key)
    if (!object) {
      return new Response('Not Found', { 
        status: 404,
        headers: corsHeaders
      })
    }

    const headers = new Headers(corsHeaders)
    headers.set('content-type', mimeType)
    headers.set('cache-control', 'public, max-age=31536000') // Cache for 1 year
    
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
