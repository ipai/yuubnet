'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'dark' | 'light'

type ThemeContextType = {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light')

  useEffect(() => {
    // Get initial theme from localStorage or system preference
    const storedTheme = localStorage.getItem('theme') as Theme
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    const initialTheme = storedTheme || systemTheme
    console.log('Initial theme:', initialTheme)
    console.log('Stored theme:', storedTheme)
    console.log('System theme:', systemTheme)
    setTheme(initialTheme)
    if (initialTheme === 'dark') {
      console.log('Adding dark class on init')
      document.documentElement.classList.add('dark')
    } else {
      console.log('Removing dark class on init')
      document.documentElement.classList.remove('dark')
    }
    console.log('Dark class present after init:', document.documentElement.classList.contains('dark'))
  }, [])

  const toggleTheme = () => {
    console.log('Toggling theme from:', theme)
    const newTheme = theme === 'light' ? 'dark' : 'light'
    console.log('New theme will be:', newTheme)
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    if (newTheme === 'dark') {
      console.log('Adding dark class')
      document.documentElement.classList.add('dark')
    } else {
      console.log('Removing dark class')
      document.documentElement.classList.remove('dark')
    }
    console.log('Dark class present after toggle:', document.documentElement.classList.contains('dark'))
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
