'use client'

import { useEffect, useState } from 'react'

export function Copyright() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const checkScroll = () => {
      const scrolledToBottom = 
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 10
      setIsVisible(scrolledToBottom)
    }

    window.addEventListener('scroll', checkScroll)
    checkScroll() // Check initial state

    return () => window.removeEventListener('scroll', checkScroll)
  }, [])

  return (
    <div 
      className={`fixed bottom-4 left-4 text-sm text-gray-500 dark:text-gray-400 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
    >
      © {new Date().getFullYear()} Ita Pai. All rights reserved.
    </div>
  )
}
