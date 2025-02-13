'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useNonce } from '../nonce/nonce-provider'

type Theme = 'dark' | 'light'

type ThemeContextType = {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

function debugTheme(action: string, params: Record<string, unknown>) {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Theme ${action}]`, {
      ...params,
      darkClassPresent: document.documentElement.classList.contains('dark'),
    })
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const nonce = useNonce()
  const [theme, setTheme] = useState<Theme>('light')

  useEffect(() => {
    // Get initial theme from localStorage or system preference
    const storedTheme = localStorage.getItem('theme') as Theme
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    const initialTheme = storedTheme || systemTheme

    debugTheme('init', { initialTheme, storedTheme, systemTheme })
    
    setTheme(initialTheme)
    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    debugTheme('toggle', { currentTheme: theme, newTheme })

    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
