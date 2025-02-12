import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ResumeSection } from './section'

describe('ResumeSection', () => {
  it('renders the resume section with correct scroll margin', () => {
    const { container } = render(<ResumeSection />)
    const resumeSection = container.querySelector('#resume')
    expect(resumeSection).toHaveClass('scroll-mt-24')
  })

  it('renders the resume heading', () => {
    render(<ResumeSection />)
    const heading = screen.getByText('Resume')
    expect(heading).toHaveClass('font-semibold')
    expect(heading).toHaveClass('text-2xl')
    expect(heading).toHaveClass('tracking-tighter')
  })

  it('renders the PDF download button', () => {
    render(<ResumeSection />)
    const downloadButton = screen.getByText('Download PDF')
    expect(downloadButton).toBeInTheDocument()
    expect(downloadButton.tagName.toLowerCase()).toBe('button')
    expect(downloadButton.className).toContain('textButton')
  })
})
