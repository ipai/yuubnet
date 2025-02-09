const CLOUDFLARE_R2_URL = 'https://pub-1adfebbdc0354931942140af358273a6.r2.dev'
const RESUME_PDF_URL = `${CLOUDFLARE_R2_URL}/resume/resume.pdf`

export default function Page() {
  return (
    <div className="space-y-24">
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
        <div className="mb-4">
          <p>
            This resume is maintained in a LaTeX source file, ensuring consistent formatting and professional typesetting.
            When changes are made to the source, a GitHub Actions workflow automatically rebuilds both PDF and PNG versions
            and deploys them to a CDN, keeping all versions synchronized and readily available.
          </p>
        </div>
        <div className="max-w-[800px] mx-auto">
          <div className="aspect-[8.5/11.56]">
            <object
              data={RESUME_PDF_URL}
              type="application/pdf"
              className="w-full h-full"
            >
            </object>
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
      </section>
    </div>
  )
}
