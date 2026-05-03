'use client'

import { useRef, useEffect, useState } from 'react'
import { useIsMobile } from '@/hooks/use-mobile'
import type { SectionRevealProps } from '@/types/component-props'

export function SectionReveal({
  children,
  className = '',
  delay = 0,
  duration = 1,
  y = 60,
  once = true,
}: SectionRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const hasAnimated = useRef(false)
  const [isVisible, setIsVisible] = useState(false)
  const isMobile = useIsMobile()

  useEffect(() => {
    const element = ref.current
    if (!element) return

    if (isMobile) {
      hasAnimated.current = true
      setIsVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (once && hasAnimated.current) return
          hasAnimated.current = true
          setIsVisible(true)

          if (once) {
            observer.disconnect()
          }
          return
        }

        if (!once) {
          hasAnimated.current = false
          setIsVisible(false)
        }
      },
      { rootMargin: '0px 0px -50px 0px' }
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [once, isMobile])

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isMobile || isVisible ? 1 : 0,
        transform: isMobile || isVisible ? 'translate3d(0,0,0)' : `translate3d(0,${y}px,0)`,
        transition: isMobile ? 'none' : `opacity ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, transform ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
      }}
    >
      {children}
    </div>
  )
}
