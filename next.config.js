/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: process.env.NEXT_PUBLIC_ASSET_FETCH_WORKER_URL?.replace(/^https?:\/\//, '') || 'yuubnet-asset-fetch.ipai-mc.workers.dev',
        pathname: '/resume/**',
      },
    ],
  },
}

module.exports = nextConfig
