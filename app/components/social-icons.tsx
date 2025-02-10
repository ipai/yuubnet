import { GitHubIcon, LinkedInIcon, MailIcon } from './icons'

const socialLinks = {
  github: 'https://github.com/ipai',
  linkedin: 'https://www.linkedin.com/in/ita-pai/',
  email: 'ita@yuub.net',
} as const

interface SocialLinkProps {
  href: string
  icon: React.ComponentType<{ className?: string }>
  label: string
}

function SocialLink({ href, icon: Icon, label }: SocialLinkProps) {
  return (
    <a
      href={href}
      className="group -m-1 p-1 transition duration-200"
      aria-label={label}
      target="_blank"
      rel="noopener noreferrer"
    >
      <Icon className="h-6 w-6 fill-gray-500 transition group-hover:fill-blue-500 dark:fill-gray-400 dark:group-hover:fill-blue-300" />
    </a>
  )
}

export function SocialIcons() {
  return (
    <div className="flex gap-6">
      <SocialLink
        href={socialLinks.github}
        icon={GitHubIcon}
        label="Follow on GitHub"
      />
      <SocialLink
        href={socialLinks.linkedin}
        icon={LinkedInIcon}
        label="Follow on LinkedIn"
      />
      <SocialLink
        href={`mailto:${socialLinks.email}`}
        icon={MailIcon}
        label="Send email"
      />
    </div>
  )
}
