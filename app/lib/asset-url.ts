export function getAssetUrl(path: string): string {
  if (process.env.NODE_ENV === 'development') {
    // In development, use local public directory
    return `/${path}`
  }

  // In production, use asset-fetch worker
  const ASSET_FETCH_BASE = process.env.NEXT_PUBLIC_ASSET_FETCH_WORKER_URL
  return `${ASSET_FETCH_BASE}/${path}`
}
