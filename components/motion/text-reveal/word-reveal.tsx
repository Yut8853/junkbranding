'use client'

import { useRef, useEffect, createElement } from 'react'
import { useIsMobile } from '@/hooks/use-mobile'
import { gsap, ScrollTrigger } from './register-scroll-trigger'
import type { WordRevealProps } from '@/types/component-props'

export function WordReveal({
  children,
  className = '',
  delay = 0,
  stagger = 0.08,
  duration = 0.9,
  as: Tag = 'div',
  once = true,
}: WordRevealProps) {
  const containerRef = useRef<HTMLElement>(null)
  const hasAnimated = useRef(false)
  const isMobile = useIsMobile()

  useEffect(() => {
    if (!containerRef.current || isMobile) return

    const words = containerRef.current.querySelectorAll('.word')
    
    if (words.length === 0) return
    
    gsap.set(words, {
      opacity: 0,
      y: 30,
      filter: 'blur(6px)',
    })

    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top bottom-=50',
      onEnter: () => {
        if (once && hasAnimated.current) return
        hasAnimated.current = true
        
        gsap.to(words, {
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
          gsap.set(words, {
            opacity: 0,
            y: 30,
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

  // 単語に分割
  const text = children || ''
  const splitWords = text.split(' ').map((word, i) => (
    <span
      key={i}
      className="word inline-block mr-[0.25em]"
      style={{ willChange: isMobile ? 'auto' : 'transform, opacity, filter' }}
    >
      {word}
    </span>
  ))

  return createElement(Tag, { ref: containerRef, className }, splitWords)
}
