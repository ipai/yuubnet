'use client'

import { useState } from 'react'
import { FadeInSection } from './fade-in-section'

export function ResumeDescription() {
  const [showDescription, setShowDescription] = useState(true)

  if (!showDescription) return null

  return (
    <FadeInSection observeId="top-tracker" invert={true}>
      <div className="relative p-6 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 backdrop-blur-sm">
        <button
          onClick={() => setShowDescription(false)}
          className="absolute top-2 right-2 p-1 text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300 transition-colors"
          aria-label="Close description"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          This resume is maintained in a LaTeX source file, ensuring consistent formatting and professional typesetting.
          When changes are made to the source, a GitHub Actions workflow automatically rebuilds both PDF and PNG versions
          and deploys them to a CDN, keeping all versions synchronized and readily available.
        </p>
      </div>
    </FadeInSection>
  )
}
