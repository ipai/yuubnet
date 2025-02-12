'use client'

import Image from 'next/image'
import { useState } from 'react'
import { ResumeDescription } from './description'
import { DownloadLink } from './download-link'
import commonStyles from '../common.module.css'
// URLs will be constructed at runtime
function getAssetUrl(path: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_ASSET_FETCH_WORKER_URL || ''
  return baseUrl ? `${baseUrl}${path}` : path
}

const RESUME_PDF_URL = getAssetUrl('/resume/resume.pdf')
const RESUME_PNG_URL = getAssetUrl('/resume/resume.png')

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
          >
            <svg
              className={commonStyles.infoIcon}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>
          <ResumeDescription
            isPinned={isPinned}
            onClose={() => setIsPinned(false)}
            isVisible={isHovered || isPinned}
          />
        </div>
      </div>
      <div className="relative">
        <div className="max-w-[700px] mx-auto">
          <a href={RESUME_PDF_URL} target="_blank" rel="noopener noreferrer">
            <Image
              src={RESUME_PNG_URL}
              alt="Resume"
              width={1275}
              height={1650}
              priority
              className="rounded-lg border border-neutral-200 dark:border-neutral-800"
            />
          </a>
          <div className="mt-4 text-center">
            <DownloadLink
              url={RESUME_PDF_URL}
              className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors cursor-pointer bg-transparent border-none p-0 m-0 font-inherit"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
