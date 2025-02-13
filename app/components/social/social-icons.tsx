'use client'

import { useState, useEffect } from 'react'
import { GitHubIcon, LinkedInIcon, MailIcon } from './icons'
import { EmailLink } from '@/app/components/social/email-link'

const socialLinks = {
  github: 'https://github.com/ipai',
  linkedin: 'https://www.linkedin.com/in/ita-pai/',
  email: 'ita@yuub.net',
} as const

interface SocialLinkProps {
  href: string
  icon: React.ComponentType<{ className?: string }>
  label: string
}

function SocialLink({ href, icon: Icon, label }: SocialLinkProps) {
  return (
    <a
      href={href}
      className="group -m-1 p-1 transition duration-200"
      aria-label={label}
      target="_blank"
      rel="noopener noreferrer"
    >
      <Icon className="h-6 w-6 fill-gray-500 transition group-hover:fill-blue-500 dark:fill-gray-400 dark:group-hover:fill-blue-300" />
    </a>
  )
}

interface EmailIconLinkProps {
  onCopyStart?: () => void
}

function EmailIconLink({ onCopyStart }: EmailIconLinkProps) {
  return (
    <EmailLink
      email={socialLinks.email}
      className="group -m-1 p-1 transition duration-200"
      onCopyStart={onCopyStart}
    >
      <MailIcon className="h-6 w-6 fill-gray-500 transition group-hover:fill-blue-500 dark:fill-gray-400 dark:group-hover:fill-blue-300" />
    </EmailLink>
  )
}

export function SocialIcons() {
  const [showCopyMessage, setShowCopyMessage] = useState(false)

  useEffect(() => {
    if (showCopyMessage) {
      const timer = setTimeout(() => {
        setShowCopyMessage(false)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [showCopyMessage])

  return (
    <div className="flex items-center gap-6">
      {!showCopyMessage ? (
        <>
          <SocialLink
            href={socialLinks.github}
            icon={GitHubIcon}
            label="Follow on GitHub"
          />
          <SocialLink
            href={socialLinks.linkedin}
            icon={LinkedInIcon}
            label="Follow on LinkedIn"
          />
          <EmailIconLink onCopyStart={() => setShowCopyMessage(true)} />
        </>
      ) : (
        <div className="rounded-md bg-gray-100 px-3 py-2 text-sm text-gray-600 dark:bg-gray-800 dark:text-gray-300">
          Email copied to clipboard
        </div>
      )}
    </div>
  )
}
