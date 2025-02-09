'use client'

import { useCallback } from 'react'

const navItems = {
  '#': {
    name: 'home',
    id: 'home'
  },
  '#resume': {
    name: 'resume',
    id: 'resume'
  },
}

export function Navbar() {
  const scrollToSection = useCallback((e: React.MouseEvent<HTMLAnchorElement> | MouseEvent, id: string) => {
    e.preventDefault()
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
      // Update URL without causing a page jump
      window.history.pushState({}, '', `#${id}`)
    }
  }, [])

  return (
    <nav className="tracking-tight">
      <div className="flex flex-row items-start">
        <div className="flex flex-row space-x-2">
          {Object.entries(navItems).map(([path, { name, id }]) => {
            return (
              <a
                key={path}
                href={path}
                onClick={(e) => scrollToSection(e, id)}
                className="transition-all hover:text-neutral-800 dark:hover:text-neutral-200 flex align-middle relative py-1 px-2 m-1 cursor-pointer"
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
