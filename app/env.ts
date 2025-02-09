import { config } from 'dotenv'

if (process.env.NODE_ENV !== 'production') {
  config()
}

export const env = {
  NODE_ENV: process.env.NODE_ENV,
  // Add other environment variables as needed
} as const

// Validate required environment variables
Object.entries(env).forEach(([key, value]) => {
  if (value === undefined) {
    throw new Error(`Environment variable ${key} is not set`)
  }
})
