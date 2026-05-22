'use client'

import { useTransition } from '@/contexts/transition-context'
import { MouseEvent } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { TransitionLinkProps } from '@/types/component-props'

const scrollToPageTop = () => {
  window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  document.documentElement.scrollTop = 0
  document.body.scrollTop = 0

  const lenis = (window as Window & {
    lenis?: {
      scrollTo?: (target: number, options?: { force?: boolean; immediate?: boolean }) => void
    }
  }).lenis

  lenis?.scrollTo?.(0, {
    force: true,
    immediate: true,
  })
}

export function TransitionLink({ href, children, className, onClick, ...props }: TransitionLinkProps) {
  const { navigateWithTransition, isTransitioning, prefetchRoute } = useTransition()
  const pathname = usePathname()

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    const nextPath = href.split('#')[0].split('?')[0] || '/'

    if (href === pathname) {
      e.preventDefault()
      onClick?.()
      scrollToPageTop()
      return
    }

    if (
      e.defaultPrevented ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey ||
      e.button !== 0 ||
      !href.startsWith('/') ||
      nextPath === pathname
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
