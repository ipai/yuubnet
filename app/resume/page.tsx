import { Metadata } from 'next'

const CLOUDFLARE_R2_URL = 'https://pub-1adfebbdc0354931942140af358273a6.r2.dev'
const RESUME_PDF_URL = `${CLOUDFLARE_R2_URL}/resume/resume.pdf`

export const metadata: Metadata = {
  title: 'Resume',
  description: 'My professional experience and skills',
}

export default function ResumePage() {
  return (
    <section>
      <h1 className="font-semibold text-2xl mb-8 tracking-tighter">Resume</h1>
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
  );
}
