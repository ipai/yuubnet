'use client'

import { useCallback } from 'react'

const navItems = {
  '/': {
    name: 'home',
    id: 'top-tracker'
  },
  '/projects': {
    name: 'projects',
    id: 'projects'
  },
  '/resume': {
    name: 'resume',
    id: 'resume'
  },
}

export function Navbar() {
  const scrollToSection = useCallback((e: React.MouseEvent<HTMLAnchorElement> | MouseEvent, id: string) => {
    e.preventDefault()
    const element = document.getElementById(id)
    if (element) {
      if (id === 'top-tracker') {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        })
        history.pushState({}, '', window.location.pathname)
      } else {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        })
        history.pushState({}, '', window.location.pathname)
      }
    }
  }, [])

  return (
    <nav className="nav">
      <div className="nav-container">
        <div className="link-container">
          {Object.entries(navItems).map(([path, { name, id }]) => {
            return (
              <a
                key={path}
                href={path}
                onClick={(e) => scrollToSection(e, id)}
                className="nav-link"
              >
                {name}
              </a>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
