import { NextResponse } from 'next/server'

export const runtime = 'edge'
export const preferredRegion = 'auto'

const ANALYTICS_URL = process.env.NEXT_PUBLIC_ANALYTICS_WORKER_URL

export async function POST(request: Request) {
  if (!ANALYTICS_URL) {
    return new Response(
      JSON.stringify({ error: 'Analytics worker URL not configured' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }

  try {
    const response = await fetch(ANALYTICS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: request.body
    })

    return response
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to log visit' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}
