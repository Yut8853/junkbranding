'use client'

import { useEffect, useState } from 'react'
import { ReactLenis, useLenis } from 'lenis/react'
import type { SmoothScrollProps } from '@/types/component-props'

export function DesktopSmoothScroll({ children }: SmoothScrollProps) {
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
