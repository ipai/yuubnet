'use client'

import { useEffect, useRef, useState } from 'react'

interface FadeInSectionProps {
  children: React.ReactNode
  className?: string
  observeId?: string
  invert?: boolean
}

export function FadeInSection({ children, className = '', observeId, invert = false }: FadeInSectionProps) {
  const [isVisible, setIsVisible] = useState(false)
  const domRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!observeId) {
      // Original behavior - observe self
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsVisible(true)
            if (domRef.current) {
              observer.unobserve(domRef.current)
            }
          }
        })
      })

      if (domRef.current) {
        observer.observe(domRef.current)
      }

      return () => {
        if (domRef.current) {
          observer.unobserve(domRef.current)
        }
      }
    } else {
      // Observe another element and stay visible while it's in view
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          setIsVisible(invert ? !entry.isIntersecting : entry.isIntersecting)
        })
      }, {
        threshold: 0.1
      })

      const targetElement = document.getElementById(observeId)
      if (targetElement) {
        observer.observe(targetElement)
      }

      return () => {
        if (targetElement) {
          observer.unobserve(targetElement)
        }
      }
    }
  }, [observeId])

  return (
    <div
      ref={domRef}
      className={`transition-opacity duration-500 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      } ${className}`}
    >
      {children}
    </div>
  )
}
