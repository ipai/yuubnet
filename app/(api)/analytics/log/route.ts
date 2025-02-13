import { NextResponse } from 'next/server'
import { logAnalytics } from '@/app/lib/analytics'

export const runtime = 'edge'
export const preferredRegion = 'auto'

export async function POST(request: Request) {
  try {
    const body = await request.text()
    const data = JSON.parse(body)
    
    const response = await logAnalytics(data)
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
