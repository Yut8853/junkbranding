'use client'

import { useEffect, useState, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { useTransition } from '@/contexts/transition-context'
import { useIsMobile } from '@/hooks/use-mobile'
import type { PageTransitionProps } from '@/types/component-props'

export function PageTransition({ children }: PageTransitionProps) {
  const { isTransitioning } = useTransition()
  const [isOverlayActive, setIsOverlayActive] = useState(false)
  const isMobile = useIsMobile()
  const pathname = usePathname()
  const isHome = pathname === '/'

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
      {/* Soft rainbow gradient overlay during transition - below canvas (99999) */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: `
            linear-gradient(
              135deg,
              rgba(255, 230, 230, 0.85) 0%,
              rgba(255, 245, 220, 0.8) 16%,
              rgba(240, 255, 230, 0.8) 32%,
              rgba(220, 250, 255, 0.8) 48%,
              rgba(230, 230, 255, 0.85) 64%,
              rgba(250, 225, 255, 0.85) 80%,
              rgba(255, 235, 240, 0.85) 100%
            )
          `,
          zIndex: isOverlayActive ? 99998 : -1,
          opacity: isTransitioning ? 1 : 0,
          transition: 'opacity 0.42s cubic-bezier(0.16, 1, 0.3, 1)',
          pointerEvents: 'none',
        }}
        aria-hidden="true"
      />
      {/* Floating mist orbs */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: isOverlayActive ? 99998 : -1,
          opacity: isTransitioning ? 1 : 0,
          transition: 'opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
          pointerEvents: 'none',
          overflow: 'hidden',
        }}
        aria-hidden="true"
      >
        {/* Mist orb 1 - large, soft purple */}
        <div
          style={{
            position: 'absolute',
            width: '60vw',
            height: '60vw',
            maxWidth: '600px',
            maxHeight: '600px',
            left: '10%',
            top: '20%',
            background: 'radial-gradient(circle, rgba(200, 180, 220, 0.4) 0%, rgba(200, 180, 220, 0.1) 50%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(40px)',
            animation: isTransitioning ? 'mistFloat1 3s ease-in-out infinite' : 'none',
          }}
        />
        {/* Mist orb 2 - medium, soft pink */}
        <div
          style={{
            position: 'absolute',
            width: '45vw',
            height: '45vw',
            maxWidth: '450px',
            maxHeight: '450px',
            right: '5%',
            top: '40%',
            background: 'radial-gradient(circle, rgba(220, 190, 210, 0.35) 0%, rgba(220, 190, 210, 0.1) 50%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(35px)',
            animation: isTransitioning ? 'mistFloat2 4s ease-in-out infinite' : 'none',
          }}
        />
        {/* Mist orb 3 - small, soft blue */}
        <div
          style={{
            position: 'absolute',
            width: '35vw',
            height: '35vw',
            maxWidth: '350px',
            maxHeight: '350px',
            left: '30%',
            bottom: '15%',
            background: 'radial-gradient(circle, rgba(180, 200, 230, 0.3) 0%, rgba(180, 200, 230, 0.08) 50%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(30px)',
            animation: isTransitioning ? 'mistFloat3 3.5s ease-in-out infinite' : 'none',
          }}
        />
        {/* Heat haze shimmer effect at bottom with rainbow tint */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '30%',
            background: 'linear-gradient(to top, rgba(255, 240, 245, 0.5) 0%, rgba(240, 248, 255, 0.3) 50%, transparent 100%)',
            filter: 'blur(20px)',
          }}
        />
      </div>
      <style jsx>{`
        @keyframes mistFloat1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(15px, -20px) scale(1.05); }
        }
        @keyframes mistFloat2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-20px, 15px) scale(1.08); }
        }
        @keyframes mistFloat3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(10px, -15px) scale(1.03); }
        }
      `}</style>
      <div 
        style={{
          opacity: isTransitioning ? 0 : 1,
          transform: isMobile || !isTransitioning ? 'translate3d(0, 0, 0) scale(1)' : 'translate3d(0, 10px, 0) scale(0.985)',
          filter: isMobile || !isTransitioning ? 'none' : 'blur(2px)',
          transition: isMobile
            ? 'opacity 0.2s ease'
            : 'opacity 0.42s cubic-bezier(0.16, 1, 0.3, 1), transform 0.42s cubic-bezier(0.16, 1, 0.3, 1), filter 0.42s cubic-bezier(0.16, 1, 0.3, 1)',
          position: 'relative',
          zIndex: 10,
          willChange: isTransitioning && !isMobile ? 'opacity, transform, filter' : 'auto',
        }}
      >
        {children}
      </div>
    </>
  )
}
