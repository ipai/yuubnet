'use client'

export const runtime = 'edge'

import { ResumeSection } from '../components/resume/section'

export default function Page() {
  return (
    <div className="space-y-24">
      {/* Invisible section to track top of page */}
      <div id="top-tracker" className="absolute top-0 h-24 w-full pointer-events-none"></div>
      <section id="home" className="scroll-mt-24 text-center">
        <h1 className="mb-6 text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-black to-gray-500 dark:from-white dark:to-gray-500">
          Ita Pai
        </h1>
        <p className="mb-4 text-lg text-gray-600 dark:text-gray-400">
          {`Distributed Systems, Data, and AI.`}
        </p>
      </section>

      <ResumeSection />
    </div>
  )
}
