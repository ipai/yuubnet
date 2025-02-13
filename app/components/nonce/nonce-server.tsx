import { headers } from 'next/headers'
import { NonceProvider } from './nonce-provider'

export function NonceServer({ children }: { children: React.ReactNode }) {
  const nonce = headers().get('x-nonce') ?? ''
  return <NonceProvider nonce={nonce}>{children}</NonceProvider>
}
