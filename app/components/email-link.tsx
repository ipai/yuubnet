'use client'

import { useState } from 'react'
import { Toast } from './toast'

interface EmailLinkProps {
  email: string
  className?: string
  children?: React.ReactNode
}

function encodeEmail(email: string): string {
  // Convert email to ASCII codes and add random offset to each character
  const offset = Math.floor(Math.random() * 10) + 1
  const encoded = email
    .split('')
    .map(char => char.charCodeAt(0) + offset)
    .join(',')
  return `${offset}:${encoded}`
}

function decodeEmail(encoded: string): string {
  const [offset, chars] = encoded.split(':')
  return chars
    .split(',')
    .map(code => String.fromCharCode(parseInt(code) - parseInt(offset)))
    .join('')
}

export function EmailLink({ email, className, children }: EmailLinkProps) {
  const [showToast, setShowToast] = useState(false)
  // Encode the email with a random offset
  const encodedEmail = encodeEmail(email)

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    const decodedEmail = decodeEmail(encodedEmail)
    
    try {
      await navigator.clipboard.writeText(decodedEmail)
      setShowToast(true)
    } catch (err) {
      console.error('Failed to copy email:', err)
    }
  }

  return (
    <>
      <a
        href="#"
        className={className}
        onClick={handleClick}
        aria-label="Copy email address"
      >
        {children || 'Contact via email'}
      </a>
      {showToast && (
        <Toast
          message="Email address copied to clipboard"
          onDismiss={() => setShowToast(false)}
        />
      )}
    </>
  )
}
