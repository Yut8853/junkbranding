'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'

interface CircleButtonProps {
  href: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function CircleButton({ href, children, size = 'md', className }: CircleButtonProps) {
  const sizeClasses = {
    sm: 'w-24 h-24 text-xs',
    md: 'w-32 h-32 sm:w-36 sm:h-36 text-sm',
    lg: 'w-36 h-36 sm:w-40 sm:h-40 md:w-48 md:h-48 text-sm sm:text-base',
  }

  return (
    <Link
      href={href}
      className={cn(
        'group relative inline-flex items-center justify-center rounded-full bg-foreground text-background font-medium overflow-hidden transition-all duration-500 hover:scale-105',
        sizeClasses[size],
        className
      )}
      data-cursor="Start"
    >
      {/* Background hover effect - gradient animation like "カタチに。" */}
      <span 
        className="absolute inset-0 scale-0 rounded-full transition-transform duration-500 ease-out group-hover:scale-100"
        style={{
          background: 'linear-gradient(135deg, oklch(0.55 0.22 280), oklch(0.6 0.2 320), oklch(0.65 0.18 360), oklch(0.7 0.2 40), oklch(0.55 0.22 280))',
          backgroundSize: '400% 100%',
          animation: 'btnGradientFlow 3s ease-in-out infinite',
        }}
      />
      
      {/* Text */}
      <span className="relative z-10 uppercase tracking-wider">
        {children}
      </span>
    </Link>
  )
}
