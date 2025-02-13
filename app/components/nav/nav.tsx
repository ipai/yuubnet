'use client'

import { useCallback } from 'react'
import commonStyles from '../common.module.css'
import styles from './nav.module.css'

const navItems = {
  '/': {
    name: 'home',
    id: 'top-tracker'
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
    <nav className={styles.nav}>
      <div className={styles.container}>
        <div className={styles.linkContainer}>
          {Object.entries(navItems).map(([path, { name, id }]) => {
            return (
              <a
                key={path}
                href={path}
                onClick={(e) => scrollToSection(e, id)}
                className={commonStyles.navLink}
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
