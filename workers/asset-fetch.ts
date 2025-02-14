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

    // Set disposition based on file type
    const disposition = extension && ['pdf', 'png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].includes(extension)
      ? 'inline'
      : 'attachment'

    return new Response(object.body, {
      headers: {
        'content-type': mimeType,
        'content-disposition': disposition,
        'cache-control': 'public, max-age=31536000',
        'access-control-allow-origin': '*',
        'access-control-allow-methods': 'GET, HEAD, OPTIONS',
        'access-control-allow-headers': 'Content-Type, Range',
        'cross-origin-resource-policy': 'cross-origin',
        'cross-origin-embedder-policy': 'credentialless',
        'vary': 'Origin'
      }
    })
  }
}
