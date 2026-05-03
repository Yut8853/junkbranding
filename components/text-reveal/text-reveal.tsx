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

    const chars = containerRef.current.querySelectorAll('.char')
    
    if (chars.length === 0) return
    
    gsap.set(chars, {
      opacity: 0,
      y: 40,
      filter: 'blur(8px)',
    })

    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top bottom-=50',
      onEnter: () => {
        if (once && hasAnimated.current) return
        hasAnimated.current = true
        
        gsap.to(chars, {
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
          gsap.set(chars, {
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

  // 文字を1文字ずつspan要素に分割（改行も保持）
  const displayText = text || children || ''
  const splitText = displayText.split('').map((char, i) => {
    if (char === '\n') {
      return <br key={i} />
    }
    return (
      <span
        key={i}
        className={`char inline-block ${gradient ? 'gradient-text-char animate-gradient-flow' : ''}`}
        style={{ 
          willChange: isMobile ? 'auto' : 'transform, opacity, filter',
          whiteSpace: char === ' ' ? 'pre' : 'normal',
          ['--char-delay' as string]: gradient ? `${i * 0.08}s` : undefined,
        }}
      >
        {char === ' ' ? '\u00A0' : char}
      </span>
    )
  })

  return createElement(Tag, { ref: containerRef, className }, splitText)
}
