import './global.css'
import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Navbar } from './components/nav'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import Footer from './components/footer'
import { baseUrl } from './sitemap'
import { ThemeProvider } from '@/components/theme-provider'
import { ThemeToggle } from '@/components/theme-toggle'
import { Copyright } from '@/components/copyright'

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'Next.js Portfolio Starter',
    template: '%s | Next.js Portfolio Starter',
  },
  description: 'This is my portfolio.',
  openGraph: {
    title: 'My Portfolio',
    description: 'This is my portfolio.',
    url: baseUrl,
    siteName: 'My Portfolio',
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

const cx = (...classes) => classes.filter(Boolean).join(' ')

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={cx(
        GeistSans.variable,
        GeistMono.variable,
        'h-full'
      )}
    >
      <body className="antialiased min-h-full bg-white dark:bg-[#111] text-black dark:text-white transition-colors duration-150 m-0">
        <ThemeProvider>
          <header className="fixed top-0 left-0 right-0 bg-white/80 dark:bg-[#111]/80 backdrop-blur-sm z-50 border-b border-gray-200 dark:border-gray-800">
            <div className="max-w-xl lg:max-w-4xl mx-auto px-8 md:px-12 py-4 flex justify-start">
              <Navbar />
            </div>
          </header>
          <main className="flex-auto min-w-0 mt-24 flex flex-col px-8 md:px-12 max-w-xl lg:max-w-4xl mx-auto">
            {children}
            <Footer />
            <Copyright />
            <Analytics />
            <SpeedInsights />
          </main>
          <ThemeToggle />
        </ThemeProvider>
      </body>
    </html>
  )
}
