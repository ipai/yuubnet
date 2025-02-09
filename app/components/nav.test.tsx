import { describe, it, vi, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Navbar } from './nav'

// Mock scrollIntoView since it's not available in JSDOM
window.HTMLElement.prototype.scrollIntoView = vi.fn()

// Mock window.history.pushState
const pushStateSpy = vi.fn()
window.history.pushState = pushStateSpy

describe('Navbar', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders all navigation links', () => {
    render(<Navbar />)
    
    // Check home link
    const homeLink = screen.getByText('home')
    expect(homeLink).toHaveAttribute('href', '#')
    
    // Check resume link
    const resumeLink = screen.getByText('resume')
    expect(resumeLink).toHaveAttribute('href', '#resume')
  })

  it('applies correct styling to navigation items', () => {
    render(<Navbar />)
    
    const links = screen.getAllByRole('link')
    links.forEach(link => {
      expect(link).toHaveClass('transition-all')
      expect(link).toHaveClass('hover:text-neutral-800')
      expect(link).toHaveClass('flex')
      expect(link).toHaveClass('cursor-pointer')
    })
  })

  it('renders navigation in correct container structure', () => {
    const { container } = render(<Navbar />)
    
    // Check if the nav element exists with correct classes
    const nav = container.querySelector('nav')
    expect(nav).toHaveClass('tracking-tight')
    
    // Check flex container structure
    const flexContainer = nav?.querySelector('div')
    expect(flexContainer).toHaveClass('flex')
    expect(flexContainer).toHaveClass('flex-row')
    expect(flexContainer).toHaveClass('items-start')
  })

  it('scrolls to section and updates URL when clicking links', () => {
    // Create mock sections
    const homeSection = document.createElement('div')
    homeSection.id = 'home'
    const resumeSection = document.createElement('div')
    resumeSection.id = 'resume'
    document.body.appendChild(homeSection)
    document.body.appendChild(resumeSection)

    render(<Navbar />)

    // Click home link
    const homeLink = screen.getByText('home')
    fireEvent.click(homeLink)
    expect(homeSection.scrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'start'
    })
    expect(pushStateSpy).toHaveBeenCalledWith({}, '', '#home')

    // Click resume link
    const resumeLink = screen.getByText('resume')
    fireEvent.click(resumeLink)
    expect(resumeSection.scrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'start'
    })
    expect(pushStateSpy).toHaveBeenCalledWith({}, '', '#resume')

    // Cleanup
    document.body.removeChild(homeSection)
    document.body.removeChild(resumeSection)
  })

  it('prevents default event behavior when clicking links', async () => {
    const { container } = render(<Navbar />)
    
    // Mock getElementById since we're testing preventDefault
    document.getElementById = vi.fn().mockReturnValue(null)
    
    const links = screen.getAllByRole('link')
    for (const link of links) {
      const event = new MouseEvent('click', {
        bubbles: true,
        cancelable: true
      })
      
      // Spy on preventDefault
      vi.spyOn(event, 'preventDefault')
      
      // Dispatch the event
      link.dispatchEvent(event)
      
      // Verify preventDefault was called
      expect(event.preventDefault).toHaveBeenCalled()
    }
  })
})
