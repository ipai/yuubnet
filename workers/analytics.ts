import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

interface Env {
  DATABASE_URL: string
}

interface VisitorData {
  timestamp: string | Date
  ip: string
  userAgent: string
  path: string
  referer: string
  country?: string
  city?: string
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 })
    }

    const prisma = new PrismaClient({
      datasourceUrl: env.DATABASE_URL,
    }).$extends(withAccelerate())

    try {
      const visitor = await request.json() as VisitorData

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

      const result = await prisma.visitor.create({
        data: visitor,
      })

      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    } catch (error) {
      console.error('Error processing analytics:', error)
      return new Response(
        JSON.stringify({ error: 'Internal server error' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }
  },
}
