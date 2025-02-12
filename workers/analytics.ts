// No imports needed for raw SQL

const ALLOWED_ORIGINS = [
  'https://yuub.net',
  'https://www.yuub.net',
  // Add development URLs if needed
  ...(process.env.NODE_ENV === 'development' ? ['http://localhost:3000'] : [])
];

interface Env {
  DB: D1Database
  GEOLOCATION_CACHE: KVNamespace
}

interface GeoLocation {
  country?: string
  city?: string
}

interface VisitorData {
  timestamp: string
  ip: string
  userAgent: string
  path: string
  referer: string
  country?: string
  city?: string
}

function handleCors(request: Request): Record<string, string> {
  const origin = request.headers.get('Origin');
  
  // Only allow listed origins
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    return {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Vary': 'Origin' // Important when using dynamic CORS responses
    };
  }
  
  // Default to main domain for non-listed origins
  return {
    'Access-Control-Allow-Origin': ALLOWED_ORIGINS[0],
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Vary': 'Origin'
  };
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const corsHeaders = handleCors(request);

    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: corsHeaders
      });
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { 
        status: 405,
        headers: corsHeaders
      });
    }

    // Log the start of request processing
    console.log('Starting request processing...')

    try {
      const visitor = await request.json() as VisitorData

      // Try to get geolocation from cache first
      const cacheKey = `geo:${visitor.ip}`
      let geoData = await env.GEOLOCATION_CACHE.get(cacheKey, 'json') as GeoLocation | null

      if (!geoData) {
        // If not in cache, fetch from Cloudflare's request.cf object
        const cf = request.cf
        geoData = {
          country: cf?.country as string | undefined,
          city: cf?.city as string | undefined
        }

        // Cache the result for 24 hours
        await env.GEOLOCATION_CACHE.put(cacheKey, JSON.stringify(geoData), {
          expirationTtl: 86400 // 24 hours in seconds
        })
      }

      // Update visitor data with geolocation
      visitor.country = geoData.country
      visitor.city = geoData.city

      // Validate required fields
      const requiredFields = ['timestamp', 'path']
      for (const field of requiredFields) {
        if (!(field in visitor)) {
          return new Response(
            JSON.stringify({ error: `Missing required field: ${field}` }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
          )
        }
      }

      const sql = `
        INSERT INTO Visitor (timestamp, ip, userAgent, path, referer, country, city, createdAt, updatedAt)
        VALUES (datetime(?), ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
      `
      const params = [
        visitor.timestamp,
        visitor.ip,
        visitor.userAgent,
        visitor.path,
        visitor.referer,
        visitor.country || null,
        visitor.city || null
      ]

      console.log('SQL:', sql)
      console.log('Params:', params)

      const result = await env.DB.prepare(sql)
        .bind(...params)
        .run()
      
      // Assert the type to include lastRowId
      const typedResult = result as D1Result<Record<string, unknown>> & { lastRowId: number }
      console.log('Created visitor:', typedResult)

      return new Response(JSON.stringify({ success: true, id: typedResult.lastRowId }), {
        status: 200,
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        },
      })
    } catch (error) {
      console.error('Error processing analytics:', error)
      return new Response(
        JSON.stringify({ error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' }),
        { 
          status: 500, 
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders
          } 
        }
      )
    }
  },
}
