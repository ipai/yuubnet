import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Page from './page'

describe('Page', () => {
  it('renders the home section with correct scroll margin', () => {
    const { container } = render(<Page />)
    const homeSection = container.querySelector('#home')
    expect(homeSection).toHaveClass('scroll-mt-24')
  })

  it('renders the resume section with correct scroll margin', () => {
    const { container } = render(<Page />)
    const resumeSection = container.querySelector('#resume')
    expect(resumeSection).toHaveClass('scroll-mt-24')
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

  it('renders the resume image viewer', () => {
    const { container } = render(<Page />)
    const imageViewer = container.querySelector('img')
    expect(imageViewer).toBeInTheDocument()
    expect(imageViewer).toHaveAttribute('src', expect.stringContaining('resume.png'))
    expect(imageViewer).toHaveAttribute('alt', 'Resume')
  })

  it('renders the PDF download link', () => {
    render(<Page />)
    const downloadLink = screen.getByText('Download PDF')
    expect(downloadLink).toHaveAttribute('download')
    expect(downloadLink).toHaveAttribute('href', expect.stringContaining('resume.pdf'))
  })
})
