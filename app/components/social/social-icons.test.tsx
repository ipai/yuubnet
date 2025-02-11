/// <reference types="vitest" />
import '@testing-library/jest-dom'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SocialIcons } from './social-icons'

describe('SocialIcons', () => {
  it('renders all social links with correct attributes', () => {
    render(<SocialIcons />)
    
    // Check GitHub link
    const githubLink = screen.getByRole('link', { name: 'Follow on GitHub' })
    expect(githubLink).toHaveAttribute('href', 'https://github.com/ipai')
    expect(githubLink).toHaveAttribute('target', '_blank')
    expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer')

    // Check LinkedIn link
    const linkedinLink = screen.getByRole('link', { name: 'Follow on LinkedIn' })
    expect(linkedinLink).toHaveAttribute('href', 'https://www.linkedin.com/in/ita-pai/')
    expect(linkedinLink).toHaveAttribute('target', '_blank')
    expect(linkedinLink).toHaveAttribute('rel', 'noopener noreferrer')

    // Check Email link
    const emailLink = screen.getByRole('link', { name: 'Send email' })
    expect(emailLink).toHaveAttribute('href', 'mailto:ita@yuub.net')
    expect(emailLink).toHaveAttribute('target', '_blank')
    expect(emailLink).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('renders icons with correct styling', () => {
    render(<SocialIcons />)
    
    const icons = screen.getAllByRole('link')
    icons.forEach(icon => {
      // Check if each icon has the base styling classes
      const svg = icon.querySelector('svg')
      expect(svg?.className).toContain('h-6')
    expect(svg?.className).toContain('w-6')
    expect(svg?.className).toContain('fill-gray-500')
    })
  })
})
