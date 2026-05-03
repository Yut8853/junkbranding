'use client'

import { ReactNode, useEffect, useRef, useState } from 'react'
import { ReactLenis, useLenis } from 'lenis/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface SmoothScrollProps {
  children: ReactNode
}

export function SmoothScroll({ children }: SmoothScrollProps) {
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

// Hook for scroll-based animations
export function useScrollProgress() {
  const [progress, setProgress] = useState(0)

  useLenis(({ progress: lenisProgress }) => {
    setProgress(lenisProgress)
  })

  return progress
}

// Hook for element visibility
export function useInView(threshold = 0.1) {
  const ref = useRef<HTMLElement>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting)
      },
      { threshold }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [threshold])

  return { ref, isInView }
}

// Export useLenis for direct access in components
export { useLenis }
