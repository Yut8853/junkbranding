'use client'

import { ReactNode } from 'react'
import { useTransition } from '@/contexts/transition-context'

interface PageTransitionProps {
  children: ReactNode
}

export function PageTransition({ children }: PageTransitionProps) {
  const { isTransitioning } = useTransition()

  return (
    <>
      {/* White background overlay during transition - below canvas (99999) */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'white',
          zIndex: isTransitioning ? 99998 : -1,
          opacity: isTransitioning ? 1 : 0,
          transition: 'opacity 0.8s ease-in-out',
          pointerEvents: 'none',
        }}
        aria-hidden="true"
      />
      <div 
        style={{
          opacity: isTransitioning ? 0 : 1,
          transition: 'opacity 0.8s ease-in-out',
          position: 'relative',
          zIndex: 10,
        }}
      >
        {children}
      </div>
    </>
  )
}
