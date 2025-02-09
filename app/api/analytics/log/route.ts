import { NextResponse } from 'next/server'
import { ANALYTICS_WORKER_URL } from '@/lib/constants'

export const runtime = 'edge'
export const preferredRegion = 'auto'

export async function POST(request: Request) {
  try {
    // Forward the request to the Cloudflare Worker
    const response = await fetch(ANALYTICS_WORKER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: request.body
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Failed to log visit:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: 'Failed to log visit', details: errorMessage },
      { status: 500 }
    )
  }
}
