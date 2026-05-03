'use client'

import { useRef, useEffect } from 'react'
import { useIsMobile } from '@/hooks/use-mobile'
import { gsap, ScrollTrigger } from './register-scroll-trigger'
import type { LineRevealProps } from '@/types/component-props'

export function LineReveal({
  children,
  className = '',
  delay = 0,
  stagger = 0.15,
  duration = 0.9,
  once = true,
}: LineRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const hasAnimated = useRef(false)
  const isMobile = useIsMobile()

  useEffect(() => {
    if (!containerRef.current || isMobile) return

    const lines = containerRef.current.querySelectorAll('.line')
    
    if (lines.length === 0) return
    
    gsap.set(lines, {
      opacity: 0,
      y: 40,
      filter: 'blur(6px)',
    })

    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top bottom-=50',
      onEnter: () => {
        if (once && hasAnimated.current) return
        hasAnimated.current = true
        
        gsap.to(lines, {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: duration,
          stagger: stagger,
          delay: delay,
          ease: 'power3.out',
        })
      },
      onLeaveBack: () => {
        if (!once) {
          gsap.set(lines, {
            opacity: 0,
            y: 40,
            filter: 'blur(6px)',
          })
          hasAnimated.current = false
        }
      },
    })

    return () => {
      trigger.kill()
    }
  }, [delay, stagger, duration, once, isMobile])

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  )
}
