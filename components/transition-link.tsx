'use client'

import { useTransition } from '@/contexts/transition-context'
import { ReactNode, MouseEvent } from 'react'
import Link from 'next/link'

interface TransitionLinkProps {
  href: string
  children: ReactNode
  className?: string
  onClick?: () => void
  [key: string]: unknown
}

export function TransitionLink({ href, children, className, onClick, ...props }: TransitionLinkProps) {
  const { navigateWithTransition, isTransitioning, prefetchRoute } = useTransition()

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (
      e.defaultPrevented ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey ||
      e.button !== 0 ||
      !href.startsWith('/')
    ) {
      return
    }

    e.preventDefault()
    
    if (isTransitioning) return
    
    // Call any additional onClick handler
    onClick?.()
    
    // Start transition and navigate
    navigateWithTransition(href)
  }

  return (
    <Link 
      href={href} 
      className={className} 
      onClick={handleClick}
      onMouseEnter={() => prefetchRoute(href)}
      onFocus={() => prefetchRoute(href)}
      {...props}
    >
      {children}
    </Link>
  )
}
