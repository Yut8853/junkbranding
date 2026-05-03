'use client'

import { useEffect } from 'react'
import { ReactLenis, useLenis } from 'lenis/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useIsMobile } from '@/hooks/use-mobile'
import { useElementInView } from '@/hooks/use-element-in-view'
import { useScrollProgress } from '@/hooks/use-scroll-progress'
import type { SmoothScrollProps } from '@/types/component-props'

gsap.registerPlugin(ScrollTrigger)

export function SmoothScroll({ children }: SmoothScrollProps) {
  const isMobile = useIsMobile()

  if (isMobile) {
    return <>{children}</>
  }

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.055,
        smoothWheel: true,
        syncTouch: false,
        wheelMultiplier: 0.72,
        touchMultiplier: 1,
        infinite: false,
      }}
    >
      <LenisScrollTriggerSync />
      {children}
    </ReactLenis>
  )
}

function LenisScrollTriggerSync() {
  useLenis(() => {
    ScrollTrigger.update()
  })

  useEffect(() => {
    const updateScrollTrigger = () => ScrollTrigger.update()
    window.addEventListener('resize', updateScrollTrigger, { passive: true })

    return () => {
      window.removeEventListener('resize', updateScrollTrigger)
    }
  }, [])

  return null
}

export { useElementInView as useInView, useScrollProgress }

// Export useLenis for direct access in components
export { useLenis }
