import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { ResumeSection } from './section'

// Mock the lazy-loaded components
vi.mock('./download-link', () => ({
  DownloadLink: ({ className }: { className?: string }) => (
    <button className={className}>Download PDF</button>
  )
}))

vi.mock('./description', () => ({
  ResumeDescription: ({ isPinned, onClose, isVisible, id }: any) => (
    <div id={id}>Resume Description</div>
  )
}))

describe('ResumeSection', () => {
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
})
