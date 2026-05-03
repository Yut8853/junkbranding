'use client'

import { useRef, useEffect, createElement } from 'react'
import { useIsMobile } from '@/hooks/use-mobile'
import { gsap, ScrollTrigger } from './register-scroll-trigger'
import type { TextRevealProps } from '@/types/component-props'

export function TextReveal({
  children,
  text,
  className = '',
  delay = 0,
  stagger = 0.03,
  duration = 0.8,
  as: Tag = 'div',
  once = true,
  gradient = false,
}: TextRevealProps) {
  const containerRef = useRef<HTMLElement>(null)
  const hasAnimated = useRef(false)
  const isMobile = useIsMobile()

  useEffect(() => {
    if (!containerRef.current || isMobile) return

    const element = containerRef.current
    
    gsap.set(element, {
      opacity: 0,
      y: 40,
      filter: 'blur(8px)',
    })

    const trigger = ScrollTrigger.create({
      trigger: element,
      start: 'top bottom-=50',
      onEnter: () => {
        if (once && hasAnimated.current) return
        hasAnimated.current = true
        
        gsap.to(element, {
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
          gsap.set(element, {
            opacity: 0,
            y: 40,
            filter: 'blur(8px)',
          })
          hasAnimated.current = false
        }
      },
    })

    return () => {
      trigger.kill()
    }
  }, [delay, stagger, duration, once, isMobile])

  const displayText = text || children || ''

  return createElement(
    Tag,
    {
      ref: containerRef,
      className: `${className} ${gradient ? 'gradient-text-char animate-gradient-flow' : ''}`,
      style: {
        whiteSpace: 'pre-line',
        willChange: isMobile ? 'auto' : 'transform, opacity, filter',
      },
    },
    displayText
  )
}
