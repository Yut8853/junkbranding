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
      {/* Background hover effect */}
      <span className="absolute inset-0 bg-accent scale-0 rounded-full transition-transform duration-500 ease-out group-hover:scale-100" />
      
      {/* Text */}
      <span className="relative z-10 uppercase tracking-wider">
        {children}
      </span>
    </Link>
  )
}
