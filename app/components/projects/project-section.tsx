'use client'

import { useState, lazy, Suspense, useRef, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import commonStyles from '../common.module.css'

// Lazy load the project details component
const ProjectDetails = lazy(() => import('./project-details').then(mod => ({ default: mod.ProjectDetails })))

export type Project = {
  title: string
  description: string
  longDescription?: string
  githubUrl: string
  liveUrl?: string
  imageUrl?: string
  technologies: string[]
  features?: string[]
}

const projects: Project[] = [
  {
    title: 'OTranscript',
    description: 'An AI tool to transcribe audio files into interactive transcripts in-sync with the audio player.',
    longDescription: 'OTranscript leverages AI technology to transform audio content into highly accurate text that synchronizes with the audio playback. This makes it perfect for interviews, podcasts, lectures, and more. It maintains speaker distinctions and offers features for navigating, editing, and exporting transcripts.',
    githubUrl: 'https://github.com/ipai/otranscript',
    liveUrl: 'https://www.otranscript.app/',
    imageUrl: '/projects/otranscript-bg.jpg',
    technologies: ['AI/LLM', 'Audio Processing', 'NPL', 'React', 'Next.js', 'Neon', 'Vercel Blob'],
    features: [
      'Real-time transcript synchronization with audio playback',
      'Speaker differentiation and labeling',
      'Interactive navigation through transcript segments',
      'Support for various audio file formats',
      'Customizable display options',
    ]
  },
  {
    title: 'Pingdom Come',
    description: 'A project that collects metrics from personal projects and sends daily/weekly reports.',
    longDescription: 'Pingdom Come is a comprehensive monitoring solution designed to aggregate metrics from various personal projects. It collects data on performance, usage, and errors, then compiles this information into easily digestible daily and weekly reports. This allows project owners to quickly identify issues and track usage patterns across their application portfolio.',
    githubUrl: 'https://github.com/ipai/pingdom-come',
    imageUrl: '/projects/pingdom-bg.webp',
    technologies: ['Temporal', 'Metrics Collection', 'Observability', 'Analytics', 'Reporting', 'Monitoring', 'Anomaly Detection'],
    features: [
      'Unified dashboard for multiple project metrics',
      'Automated daily and weekly report generation',
      'Email notification',
      'Performance tracking and anomaly detection',
      'Customizable monitoring thresholds',
      'Historical data visualization',
    ]
  },
  {
    title: 'Brotwurst',
    description: 'A Chrome extension for downloading media content from websites.',
    longDescription: 'Brotwurst is a powerful Chrome extension that enables users to download various media types including videos, images, and audio from websites. It detects media elements on web pages and provides a convenient way to save them locally. The extension respects website terms of service and is designed for saving content for legitimate personal use.',
    githubUrl: 'https://github.com/ipai/brotwurst',
    imageUrl: '/projects/brotwurst-bg.png',
    technologies: ['Chrome Extension', 'JavaScript', 'Media Processing', 'Network Interception'],
    features: [
      'Download videos and audio files',
      'One-click media detection on any website',
      'Preview media before downloading',
      'Dynamic Tokenized URLs handling',
      'Parsing HLS Manifests',
    ]
  },
  {
    title: 'Resume Pipeline',
    description: 'An automated pipeline for generating and publishing professional resumes in multiple formats.',
    longDescription: 'Resume Pipeline is a tool that automates the process of creating, formatting, and publishing professional resumes. It uses a single source of truth for your resume data and generates multiple output formats including PDF, HTML, and plain text. The pipeline ensures consistent formatting and styling across all formats and simplifies the resume updating process.',
    githubUrl: 'https://github.com/ipai/resume',
    imageUrl: '/projects/resume-bg.png',
    technologies: ['LaTeX', 'GitHub Actions', 'CI/CD', 'Docker', 'PDF Generation'],
    features: [
      'Single source of truth for resume data',
      'Multiple output formats (PDF, WebP, PNG)',
      'Automated build and publishing',
      'Version control for resume history',
      'Customizable templates and styling',
      'Mobile-friendly responsive designs',
    ]
  }
]

export function ProjectSection() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openProjectDetails = (project: Project) => {
    setSelectedProject(project)
    setIsModalOpen(true)
  }

  const closeProjectDetails = () => {
    setIsModalOpen(false)
  }

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);
  
  // Handle scroll with useCallback to prevent infinite re-renders
  const handleScroll = useCallback(() => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setScrollPosition(scrollLeft);
      setMaxScroll(scrollWidth - clientWidth);
    }
  }, []);
  
  // Initialize scroll position and add scroll event listener
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      setMaxScroll(scrollContainer.scrollWidth - scrollContainer.clientWidth);
      scrollContainer.addEventListener('scroll', handleScroll);
      
      // Initial positioning check
      handleScroll();
      
      return () => {
        scrollContainer.removeEventListener('scroll', handleScroll);
      };
    }
  }, [handleScroll]); // Add handleScroll to the dependency array
  
  // Scroll left/right by one card width
  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 260 + 24; // card width + gap
      const newPosition = direction === 'left' 
        ? Math.max(0, scrollPosition - scrollAmount)
        : Math.min(maxScroll, scrollPosition + scrollAmount);
      
      scrollContainerRef.current.scrollTo({
        left: newPosition,
        behavior: 'smooth'
      });
      
      // Force update scroll position after scrolling
      setTimeout(() => handleScroll(), 100);
    }
  };

  return (
    <section id="projects" className="scroll-mt-24">
      {/* Title */}
      <h2 className="font-semibold text-2xl tracking-tighter mb-6">Personal Projects</h2>
      
      {/* Horizontally scrollable project container with side navigation arrows */}
      <div className="relative mx-10 lg:mx-12">
        {/* Left scroll button */}
        <button 
          onClick={() => scroll('left')}
          disabled={scrollPosition <= 0}
          aria-label="Scroll left"
          className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-[calc(100%-4px)] z-10 bg-white dark:bg-black bg-opacity-80 dark:bg-opacity-80 rounded-full p-2 shadow-md border border-gray-200 dark:border-gray-800 hover:bg-opacity-100 dark:hover:bg-opacity-100 transition-all ${scrollPosition <= 0 ? 'opacity-30 cursor-not-allowed' : 'opacity-100 hover:scale-110'}`}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg"
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        
        {/* Right scroll button */}
        <button 
          onClick={() => scroll('right')}
          disabled={scrollPosition >= maxScroll}
          aria-label="Scroll right"
          className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-[calc(100%-4px)] z-10 bg-white dark:bg-black bg-opacity-80 dark:bg-opacity-80 rounded-full p-2 shadow-md border border-gray-200 dark:border-gray-800 hover:bg-opacity-100 dark:hover:bg-opacity-100 transition-all ${scrollPosition >= maxScroll ? 'opacity-30 cursor-not-allowed' : 'opacity-100 hover:scale-110'}`}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg"
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
        
        {/* No fade gradients as requested */}
        
        {/* Project cards container with padding to prevent hover cutoff */}
        <div 
          ref={scrollContainerRef}
          className="flex overflow-x-auto gap-6 pb-8 pt-4 snap-x snap-mandatory scrollbar-hide overscroll-x-contain"
          style={{ scrollBehavior: 'smooth', WebkitOverflowScrolling: 'touch' }}
        >
          {projects.map((project) => (
            <div 
              key={project.title} 
              className={`${commonStyles.panel} p-5 flex flex-col flex-shrink-0 w-[260px] h-[320px] transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-neutral-300 dark:hover:border-neutral-700 cursor-pointer snap-start`}
              onClick={() => openProjectDetails(project)}
            >
              <h3 className="text-xl font-medium mb-2">{project.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4 flex-grow text-sm">{project.description}</p>
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {project.technologies.slice(0, 3).map((tech) => (
                    <span 
                      key={tech} 
                      className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 3 && (
                    <span className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                      +{project.technologies.length - 3} more
                    </span>
                  )}
                </div>
              </div>
              <div 
                className="flex justify-center items-center"
                onClick={(e) => e.stopPropagation()} // Prevent card click when clicking the button
              >
                <button 
                  aria-label="View details" 
                  className={`${commonStyles.textButton} flex items-center hover:underline`}
                >
                  <span className="mr-1">View Details</span>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg"
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {/* Navigation dots removed as requested */}
      </div>

      {/* Modal for project details */}
      <Suspense fallback={null}>
        {selectedProject && (
          <ProjectDetails 
            project={selectedProject}
            onClose={closeProjectDetails}
            isVisible={isModalOpen}
          />
        )}
      </Suspense>
    </section>
  )
}