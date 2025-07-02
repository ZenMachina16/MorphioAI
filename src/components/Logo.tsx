import Link from "next/link"

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export default function Logo({ size = 'md', className = '' }: LogoProps) {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  }

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  }

  return (
    <Link href="/" className={`flex items-center space-x-3 hover:opacity-80 transition-opacity ${className}`}>
      <div className={`${sizes[size]} relative`}>
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Background circle with gradient */}
          <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#e11d48" />
            </linearGradient>
          </defs>
          
          {/* Main circle */}
          <circle cx="20" cy="20" r="18" fill="url(#logoGradient)" />
          
          {/* AI Brain/Node network design */}
          <g fill="white" opacity="0.9">
            {/* Central node */}
            <circle cx="20" cy="20" r="2.5" />
            
            {/* Surrounding nodes */}
            <circle cx="12" cy="14" r="1.5" />
            <circle cx="28" cy="14" r="1.5" />
            <circle cx="14" cy="26" r="1.5" />
            <circle cx="26" cy="26" r="1.5" />
            <circle cx="20" cy="10" r="1" />
            <circle cx="30" cy="20" r="1" />
            <circle cx="10" cy="20" r="1" />
            <circle cx="20" cy="30" r="1" />
            
            {/* Connection lines */}
            <line x1="20" y1="20" x2="12" y2="14" stroke="white" strokeWidth="1" opacity="0.7" />
            <line x1="20" y1="20" x2="28" y2="14" stroke="white" strokeWidth="1" opacity="0.7" />
            <line x1="20" y1="20" x2="14" y2="26" stroke="white" strokeWidth="1" opacity="0.7" />
            <line x1="20" y1="20" x2="26" y2="26" stroke="white" strokeWidth="1" opacity="0.7" />
            <line x1="20" y1="20" x2="20" y2="10" stroke="white" strokeWidth="1" opacity="0.5" />
            <line x1="20" y1="20" x2="30" y2="20" stroke="white" strokeWidth="1" opacity="0.5" />
            <line x1="20" y1="20" x2="10" y2="20" stroke="white" strokeWidth="1" opacity="0.5" />
            <line x1="20" y1="20" x2="20" y2="30" stroke="white" strokeWidth="1" opacity="0.5" />
          </g>
          
          {/* Outer glow effect */}
          <circle cx="20" cy="20" r="18" fill="none" stroke="url(#logoGradient)" strokeWidth="1" opacity="0.3" />
        </svg>
      </div>
      <span className={`font-bold text-gray-200 ${textSizes[size]}`}>
        MorphioAI
      </span>
    </Link>
  )
} 