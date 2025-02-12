import { NextResponse } from 'next/server'

export const runtime = 'edge'
export const preferredRegion = 'auto'

const ANALYTICS_URL = process.env.ANALYTICS_WORKER_URL

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
    console.log('Request details:', {
      url: request.url,
      method: request.method,
      headers: Array.from(request.headers),
      body: await request.text()
    });
    const body = await request.text()
    console.log('Request body:', body);
    const response = await fetch(ANALYTICS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: body
    })
    console.log('Fetch call is being made');
    if (!response.ok) {
      const error = await response.json()
      return new Response(JSON.stringify(error), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' }
      })
    }
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
