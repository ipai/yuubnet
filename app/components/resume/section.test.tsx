import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ResumeSection } from './section'

// Mock getAssetUrl
vi.mock('@/app/lib/asset-url', () => ({
  getAssetUrl: (path: string) => `/${path}`
}))

// Mock the lazy-loaded components
vi.mock('./download-link', () => ({
  DownloadLink: ({ className }: { className?: string }) => (
    <button className={className}>Download PDF</button>
  )
}))

vi.mock('./description', () => ({
  ResumeDescription: ({ isPinned, onClose, isVisible, id }: any) => {
    return <div id={id} role="dialog" aria-modal="true">Resume Description</div>
  }
}))

describe('ResumeSection', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the resume section with correct scroll margin', async () => {
    const { container } = render(<ResumeSection />)
    await waitFor(() => {
      const resumeSection = container.querySelector('#resume')
      expect(resumeSection).toHaveClass('scroll-mt-24')
    })
  })

  it('renders the resume heading', async () => {
    render(<ResumeSection />)
    await waitFor(() => {
      const heading = screen.getByText('Resume')
      expect(heading).toHaveClass('font-semibold')
      expect(heading).toHaveClass('text-2xl')
      expect(heading).toHaveClass('tracking-tighter')
    })
  })

  it('renders the PDF download button', async () => {
    render(<ResumeSection />)
    await waitFor(() => {
      const downloadButton = screen.getByText('Download PDF')
      expect(downloadButton).toBeInTheDocument()
      expect(downloadButton.tagName.toLowerCase()).toBe('button')
      expect(downloadButton.className).toContain('textButton')
    })
  })

  it('shows and hides ResumeDescription on info button hover', async () => {
    const user = userEvent.setup()
    render(<ResumeSection />)
    
    const infoButton = screen.getByLabelText('Resume information')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    
    // Show on hover
    await user.hover(infoButton)
    
    // Wait for lazy-loaded component to appear
    await waitFor(() => {
      const dialog = screen.getByRole('dialog')
      expect(dialog).toBeInTheDocument()
      expect(dialog).toHaveTextContent('Resume Description')
    })
    
    // Hide on mouse leave
    await user.unhover(infoButton)
    
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })

  it('keeps ResumeDescription visible when pinned', async () => {
    const user = userEvent.setup()
    render(<ResumeSection />)
    const infoButton = screen.getByLabelText('Resume information')
    
    // Click to pin
    await user.click(infoButton)
    
    // Wait for lazy-loaded component to appear
    await waitFor(() => {
      const dialog = screen.getByRole('dialog')
      expect(dialog).toBeInTheDocument()
      expect(dialog).toHaveTextContent('Resume Description')
    })
    
    // Should stay visible even after mouse leave
    await user.unhover(infoButton)
    
    await waitFor(() => {
      const dialog = screen.getByRole('dialog')
      expect(dialog).toBeInTheDocument()
      expect(dialog).toHaveTextContent('Resume Description')
    })
    
    // Click again to unpin and move mouse away
    await user.click(infoButton)
    await user.unhover(infoButton)
    
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })

  it('renders resume image with correct attributes', async () => {
    render(<ResumeSection />)
    const image = screen.getByAltText('Resume')
    expect(image).toHaveAttribute('width', '700')
    expect(image).toHaveAttribute('height', '906')
    // Next.js Image component transforms the src, so we'll check if the URL contains our image path
    expect(image.getAttribute('src')).toContain('resume%2Fresume.webp')
    expect(image.closest('a')).toHaveAttribute('href', '/resume/resume.pdf')
    expect(image.closest('a')).toHaveAttribute('target', '_blank')
  })
})
