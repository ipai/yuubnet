import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import Page from './page'

// Mock getAssetUrl
vi.mock('@/app/lib/asset-url', () => ({
  getAssetUrl: (path: string) => `/${path}`
}))

// Mock lazy-loaded components
vi.mock('@/app/components/resume/download-link', () => ({
  DownloadLink: ({ className }: { className?: string }) => (
    <button className={className}>Download PDF</button>
  )
}))

vi.mock('@/app/components/resume/description', () => ({
  ResumeDescription: ({ id }: { id: string }) => (
    <div id={id}>Resume Description</div>
  )
}))

describe('Page', () => {
  it('renders the home section with correct scroll margin', () => {
    const { container } = render(<Page />)
    const homeSection = container.querySelector('#home')
    expect(homeSection).toHaveClass('scroll-mt-24')
  })

  it('renders the name with gradient text effect', () => {
    render(<Page />)
    const heading = screen.getByText('Ita Pai')
    expect(heading).toHaveClass('bg-clip-text')
    expect(heading).toHaveClass('text-transparent')
    expect(heading).toHaveClass('bg-gradient-to-r')
  })

  it('renders the subtitle with correct styling', () => {
    render(<Page />)
    const subtitle = screen.getByText('Distributed Systems, Data, and AI.')
    expect(subtitle).toHaveClass('text-lg')
    expect(subtitle).toHaveClass('text-gray-600')
    expect(subtitle).toHaveClass('dark:text-gray-400')
  })
})
