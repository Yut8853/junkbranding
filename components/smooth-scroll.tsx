'use client'

import { useEffect, useState } from 'react'
import { ReactLenis, useLenis } from 'lenis/react'
import { useIsMobile } from '@/hooks/use-mobile'
import { useElementInView } from '@/hooks/use-element-in-view'
import { useScrollProgress } from '@/hooks/use-scroll-progress'
import type { SmoothScrollProps } from '@/types/component-props'

export function SmoothScroll({ children }: SmoothScrollProps) {
  const isMobile = useIsMobile()

  if (isMobile) {
    return <>{children}</>
  }

  return (
    <ReactLenis
      root
      options={{
        autoRaf: true,
        lerp: 0.08,
        smoothWheel: true,
        syncTouch: false,
        wheelMultiplier: 0.85,
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
  const [scrollTrigger, setScrollTrigger] = useState<typeof import('gsap/ScrollTrigger').ScrollTrigger | null>(null)

  useEffect(() => {
    let active = true

    const loadScrollTrigger = async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ])

      gsap.registerPlugin(ScrollTrigger)
      if (active) {
        setScrollTrigger(() => ScrollTrigger)
      }
    }

    void loadScrollTrigger()

    return () => {
      active = false
    }
  }, [])

  useLenis(() => {
    scrollTrigger?.update()
  })

  useEffect(() => {
    if (!scrollTrigger) return

    const updateScrollTrigger = () => scrollTrigger.update()
    window.addEventListener('resize', updateScrollTrigger, { passive: true })

    return () => {
      window.removeEventListener('resize', updateScrollTrigger)
    }
  }, [scrollTrigger])

  return null
}

export { useElementInView as useInView, useScrollProgress }

// Export useLenis for direct access in components
export { useLenis }
