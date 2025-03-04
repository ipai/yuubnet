'use client'

interface ResumeDescriptionProps {
  onClose?: () => void
  isPinned?: boolean
  isVisible?: boolean
  className?: string
  id?: string
}

export function ResumeDescription({ onClose, isPinned = false, isVisible = false, className = '', id }: ResumeDescriptionProps) {
  return (
    <div
      id={id}
      role="dialog"
      aria-modal="true"
      className={`resume-description-container ${isVisible ? 'visible' : 'invisible'} ${className}`}
    >
      <div className="resume-description-panel">
        {isPinned && (
          <button
            onClick={onClose}
            className="close-button"
            aria-label="Close description"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
        <p className="text-description-dialog">
          This resume is maintained in a LaTeX source file, ensuring consistent formatting and professional typesetting.
          When changes are made to the source, a GitHub Actions workflow automatically rebuilds both PDF and PNG versions
          and deploys them to a CDN, keeping all versions synchronized and readily available.
        </p>
      </div>
    </div>
  )
}
