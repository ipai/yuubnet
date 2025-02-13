'use client'

interface EmailLinkProps {
  email: string
  className?: string
  children?: React.ReactNode
  onCopyStart?: () => void
}

export function EmailLink({ email, className, children, onCopyStart }: EmailLinkProps) {
  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    try {
      await navigator.clipboard.writeText(email)
      onCopyStart?.()
    } catch (err) {
      console.error('Failed to copy email:', err)
    }
  }

  return (
    <button
      type="button"
      className={className}
      onClick={handleClick}
      aria-label="Copy email address"
    >
      {children || 'Contact via email'}
    </button>
  )
}
