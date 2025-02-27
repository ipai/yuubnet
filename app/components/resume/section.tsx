'use client'

import { useState, lazy, Suspense } from 'react'
import Image from 'next/image'
import { getAssetUrl } from '@/app/lib/asset-url'

// Lazy load components that aren't immediately visible
const ResumeDescription = lazy(() => import('./description').then(mod => ({ default: mod.ResumeDescription })))
const DownloadLink = lazy(() => import('./download-link').then(mod => ({ default: mod.DownloadLink })))

// Get asset URLs based on environment
const RESUME_IMG_URL = getAssetUrl('resume/resume.webp')
const RESUME_PDF_URL = getAssetUrl('resume/resume.pdf')

function InfoIcon() {
  return (
    <svg
      className="info-icon"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      width="24"
      height="24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  )
}

export function ResumeSection() {
  const [isHovered, setIsHovered] = useState(false)
  const [isPinned, setIsPinned] = useState(false)

  return (
    <section id="resume" className="scroll-mt-24">
      <div className="flex items-center gap-2 mb-8">
        <h2 className="font-semibold text-2xl tracking-tighter">Resume</h2>
        <div className="relative">
          <button
            className="group relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => setIsPinned(!isPinned)}
            aria-label="Resume information"
            aria-expanded={isHovered || isPinned}
            aria-controls="resume-description"
          >
            <InfoIcon />
          </button>
          <Suspense fallback={null}>
            {(isHovered || isPinned) && (
              <ResumeDescription
                isPinned={isPinned}
                onClose={() => setIsPinned(false)}
                isVisible={true}
                id="resume-description"
              />
            )}
          </Suspense>
        </div>
      </div>
      <div className="relative">
        <div className="max-w-[700px] mx-auto">
          <a href={RESUME_PDF_URL} target="_blank" rel="noopener noreferrer">
            <Image
              src={RESUME_IMG_URL}
              alt="Resume"
              width={700}
              height={906}
              className="rounded-lg border border-neutral-200 dark:border-neutral-800"
              priority={true}
              unoptimized={true}
            />
          </a>
          <div className="mt-4 text-center">
            <Suspense fallback={null}>
              <DownloadLink
                url={RESUME_PDF_URL}
                className="text-button"
              />
            </Suspense>
          </div>
        </div>
      </div>
    </section>
  )
}
