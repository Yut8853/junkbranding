'use client'

import { ReactNode, useEffect, useRef, useState } from 'react'
import { ReactLenis, useLenis } from 'lenis/react'

interface SmoothScrollProps {
  children: ReactNode
}

export function SmoothScroll({ children }: SmoothScrollProps) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1,
        duration: 1.2,
        smoothWheel: true,
        wheelMultiplier: 0.8,
        touchMultiplier: 1.5,
        infinite: false,
      }}
    >
      {children}
    </ReactLenis>
  )
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
