'use client'

import { ReactNode, useEffect, useState } from 'react'
import { useTransition } from '@/contexts/transition-context'

interface PageTransitionProps {
  children: ReactNode
}

export function PageTransition({ children }: PageTransitionProps) {
  const { isTransitioning } = useTransition()
  const [isOverlayActive, setIsOverlayActive] = useState(false)

  useEffect(() => {
    if (isTransitioning) {
      setIsOverlayActive(true)
      return
    }

    const timeout = window.setTimeout(() => {
      setIsOverlayActive(false)
    }, 460)

    return () => window.clearTimeout(timeout)
  }, [isTransitioning])

  return (
    <>
      {/* White background overlay during transition - below canvas (99999) */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'white',
          zIndex: isOverlayActive ? 99998 : -1,
          opacity: isTransitioning ? 0.96 : 0,
          transition: 'opacity 0.42s cubic-bezier(0.16, 1, 0.3, 1)',
          pointerEvents: 'none',
        }}
        aria-hidden="true"
      />
      <div 
        style={{
          opacity: isTransitioning ? 0 : 1,
          transform: isTransitioning ? 'translate3d(0, 10px, 0) scale(0.985)' : 'translate3d(0, 0, 0) scale(1)',
          filter: isTransitioning ? 'blur(2px)' : 'blur(0px)',
          transition: 'opacity 0.42s cubic-bezier(0.16, 1, 0.3, 1), transform 0.42s cubic-bezier(0.16, 1, 0.3, 1), filter 0.42s cubic-bezier(0.16, 1, 0.3, 1)',
          position: 'relative',
          zIndex: 10,
          willChange: isTransitioning ? 'opacity, transform, filter' : 'auto',
        }}
      >
        {children}
      </div>
    </>
  )
}
