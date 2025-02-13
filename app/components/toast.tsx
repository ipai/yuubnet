'use client'

import { useEffect, useState } from 'react'

interface ToastProps {
  message: string
  duration?: number
  onDismiss: () => void
}

export function Toast({ message, duration = 2000, onDismiss }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onDismiss])

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 transform">
      <div className="rounded-md bg-gray-900 px-4 py-2 text-sm text-white shadow-lg dark:bg-white dark:text-gray-900">
        {message}
      </div>
    </div>
  )
}
