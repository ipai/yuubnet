import { ASSET_FETCH_WORKER_URL } from '@/lib/constants'
import { FadeInSection } from './components/fade-in-section'

const RESUME_PDF_URL = `${ASSET_FETCH_WORKER_URL}/resume/resume.pdf`
const RESUME_PNG_URL = `${ASSET_FETCH_WORKER_URL}/resume/resume.png`

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

      <section id="resume" className="scroll-mt-24">
        <h2 className="font-semibold text-2xl mb-8 tracking-tighter">Resume</h2>
        <div className="relative">
          <div className="max-w-[700px] mx-auto">
            <div className="aspect-[8.5/11]">
              <img
                src={RESUME_PNG_URL}
                alt="Resume"
                className="w-full h-full object-contain bg-white dark:bg-neutral-900"
              />
            </div>
            <div className="mt-4 text-center">
              <a
                href={RESUME_PDF_URL}
                download
                className="text-sm text-neutral-600 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200 transition-colors"
              >
                Download PDF
              </a>
            </div>
          </div>
          <div className="mt-8 lg:mt-0 lg:fixed lg:right-8 lg:w-[300px] lg:top-1/2 lg:-translate-y-1/2">
            <FadeInSection observeId="top-tracker" invert={true}>
              <div className="p-6 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 backdrop-blur-sm">
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  This resume is maintained in a LaTeX source file, ensuring consistent formatting and professional typesetting.
                  When changes are made to the source, a GitHub Actions workflow automatically rebuilds both PDF and PNG versions
                  and deploys them to a CDN, keeping all versions synchronized and readily available.
                </p>
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>
    </div>
  )
}
