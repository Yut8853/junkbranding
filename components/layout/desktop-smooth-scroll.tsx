'use client'

import { useEffect, useState } from 'react'
import { ReactLenis, useLenis } from 'lenis/react'
import { scheduleIdleTask } from '@/lib/performance-mode'
import type { SmoothScrollProps } from '@/types/component-props'

export function DesktopSmoothScroll({ children }: SmoothScrollProps) {
  return (
    <ReactLenis
      root
      options={{
        autoRaf: true,
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
  const [scrollTrigger, setScrollTrigger] = useState<typeof import('gsap/ScrollTrigger').ScrollTrigger | null>(null)

  useEffect(() => {
    let active = true
    let idleTask: ReturnType<typeof scheduleIdleTask> | null = null

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

    // ScrollTrigger同期は初期描画に必須ではないため、GSAPの評価をload後のidleへ逃がす。
    idleTask = scheduleIdleTask(() => {
      void loadScrollTrigger()
    }, 6500, 4200)

    return () => {
      active = false
      idleTask?.cancel()
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
