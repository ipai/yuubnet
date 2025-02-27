'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { type Project } from './project-section'

interface ProjectDetailsProps {
  project: Project
  onClose: () => void
  isVisible: boolean
}

export function ProjectDetails({ project, onClose, isVisible }: ProjectDetailsProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  
  // Handle clicking outside the modal
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose()
      }
    }
    
    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside)
      // Prevent scrolling when modal is open
      document.body.style.overflow = 'hidden'
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = 'auto'
    }
  }, [isVisible, onClose])
  
  // Handle escape key press
  useEffect(() => {
    function handleEscapeKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose()
      }
    }
    
    if (isVisible) {
      document.addEventListener('keydown', handleEscapeKey)
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscapeKey)
    }
  }, [isVisible, onClose])
  
  if (!isVisible) return null
  
  return (
    <div className="modal-overlay">
      <div 
        ref={modalRef}
        className="modal-content panel max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 relative"
      >
        {/* Background image */}
        {project.imageUrl && (
          <div 
            className="absolute inset-0 opacity-10 -z-10 bg-center"
            style={{
              backgroundImage: `url(${project.imageUrl})`,
              backgroundSize: project.imageRepeat ? 'auto' : 'cover',
              backgroundRepeat: project.imageRepeat || 'no-repeat',
            }}
          />
        )}
        
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{project.title}</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
            aria-label="Close details"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="text-gray-600 dark:text-gray-400"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2 text-gray-800 dark:text-gray-200">Description</h3>
          <p className="text-gray-600 dark:text-gray-400">{project.description}</p>
          {project.longDescription && (
            <p className="mt-3 text-gray-600 dark:text-gray-400">{project.longDescription}</p>
          )}
        </div>
        
        {project.features && (
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2 text-gray-800 dark:text-gray-200">Key Features</h3>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1">
              {project.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2 text-gray-800 dark:text-gray-200">Technologies</h3>
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 text-sm rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
        
        <div className="flex flex-wrap gap-3 justify-end">
          {project.liveUrl && (
            <Link 
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
            >
              <svg 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="mr-2"
              >
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
              Visit Website
            </Link>
          )}
          
          <Link 
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gray-800 dark:bg-gray-200 hover:bg-black dark:hover:bg-white text-white dark:text-gray-900 px-4 py-2 rounded-lg transition-colors flex items-center"
          >
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="mr-2"
            >
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
            </svg>
            View on GitHub
          </Link>
        </div>
      </div>
    </div>
  )
}