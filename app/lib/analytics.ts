export function shouldLogAnalytics(): boolean {
  return process.env.NODE_ENV !== 'development'
}

export async function logAnalytics(data: any): Promise<Response> {
  if (!shouldLogAnalytics()) {
    console.log('Analytics disabled in development. Would have logged:', data)
    return new Response(JSON.stringify({ message: 'Analytics skipped in development' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  const ANALYTICS_URL = process.env.NEXT_PUBLIC_ANALYTICS_WORKER_URL
  if (!ANALYTICS_URL) {
    throw new Error('Analytics worker URL not configured')
  }

  const response = await fetch(ANALYTICS_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  })

  if (!response.ok) {
    throw new Error(`Analytics request failed: ${response.statusText}`)
  }

  return response
}
