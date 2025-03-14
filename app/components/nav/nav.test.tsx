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
    expect(homeLink).toHaveAttribute('href', '/')
    
    // Check projects link
    const projectsLink = screen.getByText('projects')
    expect(projectsLink).toHaveAttribute('href', '/projects')
    
    // Check resume link
    const resumeLink = screen.getByText('resume')
    expect(resumeLink).toHaveAttribute('href', '/resume')
  })

  it('applies correct styling to navigation items', () => {
    render(<Navbar />)
    
    const links = screen.getAllByRole('link')
    links.forEach(link => {
      // Check if link has the nav-link class
      expect(link.className).toContain('nav-link')
    })
  })

  it('renders navigation in correct container structure', () => {
    const { container } = render(<Navbar />)
    
    // Check if the nav element exists with correct classes
    const nav = container.querySelector('nav')
    expect(nav?.className).toContain('nav')
    
    // Check flex container structure
    const flexContainer = nav?.querySelector('div')
    expect(flexContainer?.className).toContain('container')
  })

  it('scrolls to section and updates URL when clicking links', () => {
    // Create mock sections
    const resumeSection = document.createElement('div')
    resumeSection.id = 'resume'
    document.body.appendChild(resumeSection)

    const projectsSection = document.createElement('div')
    projectsSection.id = 'projects'
    document.body.appendChild(projectsSection)

    render(<Navbar />)

    // Click resume link
    const resumeLink = screen.getByText('resume')
    fireEvent.click(resumeLink)

    // Check if scrollIntoView was called with smooth behavior
    const scrollIntoViewMock = window.HTMLElement.prototype.scrollIntoView as any
    expect(scrollIntoViewMock).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'start'
    })

    // Check if URL was updated
    expect(pushStateSpy).toHaveBeenCalledWith({}, '', window.location.pathname)

    // Reset mocks
    vi.clearAllMocks()

    // Click projects link
    const projectsLink = screen.getByText('projects')
    fireEvent.click(projectsLink)

    // Check if scrollIntoView was called again
    expect(scrollIntoViewMock).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'start'
    })

    // Check if URL was updated again
    expect(pushStateSpy).toHaveBeenCalledWith({}, '', window.location.pathname)

    // Cleanup
    document.body.removeChild(resumeSection)
    document.body.removeChild(projectsSection)
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
