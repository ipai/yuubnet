import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ProjectDetails } from './project-details'

// Mock the project data
const mockProject = {
  title: 'Test Project',
  description: 'This is a test project',
  longDescription: 'This is a longer description of the test project with more details.',
  githubUrl: 'https://github.com/ipai/test-project',
  liveUrl: 'https://test-project.com',
  imageUrl: '/projects/test-bg.jpg',
  technologies: ['Tech1', 'Tech2', 'Tech3'],
  features: ['Feature 1', 'Feature 2', 'Feature 3']
}

describe('ProjectDetails', () => {
  // Mock document.addEventListener
  const addEventListenerSpy = vi.spyOn(document, 'addEventListener')
  const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener')
  
  // Mock onClose function
  const mockOnClose = vi.fn()
  
  beforeEach(() => {
    // Clear mocks before each test
    vi.clearAllMocks()
  })
  
  it('renders nothing when isVisible is false', () => {
    const { container } = render(
      <ProjectDetails 
        project={mockProject} 
        onClose={mockOnClose} 
        isVisible={false} 
      />
    )
    
    expect(container).toBeEmptyDOMElement()
  })
  
  it('renders project details when isVisible is true', () => {
    render(
      <ProjectDetails 
        project={mockProject} 
        onClose={mockOnClose} 
        isVisible={true} 
      />
    )
    
    // Check basic content
    expect(screen.getByText('Test Project')).toBeInTheDocument()
    expect(screen.getByText('This is a test project')).toBeInTheDocument()
    expect(screen.getByText('This is a longer description of the test project with more details.')).toBeInTheDocument()
    
    // Check technology tags
    mockProject.technologies.forEach(tech => {
      expect(screen.getByText(tech)).toBeInTheDocument()
    })
    
    // Check features
    mockProject.features.forEach(feature => {
      expect(screen.getByText(feature)).toBeInTheDocument()
    })
    
    // Check links
    const githubLink = screen.getByText('View on GitHub')
    expect(githubLink.closest('a')).toHaveAttribute('href', mockProject.githubUrl)
    
    const liveLink = screen.getByText('Visit Website')
    expect(liveLink.closest('a')).toHaveAttribute('href', mockProject.liveUrl)
  })
  
  it('calls onClose when clicking close button', () => {
    render(
      <ProjectDetails 
        project={mockProject} 
        onClose={mockOnClose} 
        isVisible={true} 
      />
    )
    
    // Click close button
    const closeButton = screen.getByLabelText('Close details')
    fireEvent.click(closeButton)
    
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })
  
  it('adds event listeners when visible and removes them when unmounted', () => {
    const { unmount } = render(
      <ProjectDetails 
        project={mockProject} 
        onClose={mockOnClose} 
        isVisible={true} 
      />
    )
    
    // Check if event listeners were added
    expect(addEventListenerSpy).toHaveBeenCalledWith('mousedown', expect.any(Function))
    expect(addEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function))
    
    // Unmount the component
    unmount()
    
    // Check if event listeners were removed
    expect(removeEventListenerSpy).toHaveBeenCalledWith('mousedown', expect.any(Function))
    expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function))
  })
})