'use client'

import { useEffect, useRef, useMemo, useState } from 'react'
import { clamp01, createScatterValue } from '@/lib/scatter'

interface ScatterTextProps {
  children: string
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div'
  className?: string
  scrollStart?: number
  scrollEnd?: number
  distance?: number
  style?: React.CSSProperties
  gradient?: boolean
}

export function ScatterText({
  children,
  as: Component = 'div',
  className = '',
  scrollStart = 50,
  scrollEnd = 300,
  distance = 600,
  style,
  gradient = false,
}: ScatterTextProps) {
  const containerRef = useRef<HTMLElement>(null)
  const charsRef = useRef<(HTMLSpanElement | null)[]>([])
  const [isVisible, setIsVisible] = useState(false)
  const [scatterProgress, setScatterProgress] = useState(0)
  
  const chars = useMemo(() => children.split(''), [children])
  
  // Pre-generate scatter values
  const scatterValues = useMemo(() => {
    return chars.map((_, i) => {
      const seed = i * 7 + 13
      return createScatterValue({
        seed,
        minDistance: distance * 0.5,
        distanceRange: distance,
        rotationRange: 720,
      })
    })
  }, [chars, distance])

  // Combined scroll handler for fade-in and scatter
  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    let hasScrolledPast = false
    let initialRect: DOMRect | null = null

    const handleScroll = () => {
      const rect = container.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      
      // Store initial position on first call
      if (!initialRect) {
        initialRect = rect
      }
      
      // Fade-in: trigger when bottom of element is 50px above viewport bottom
      const fadeInTrigger = viewportHeight - scrollStart
      if (rect.top < fadeInTrigger && !isVisible) {
        setIsVisible(true)
      }
      
      // Only start scattering after user has scrolled at least 100px
      const scrollY = window.scrollY
      if (scrollY < 100) {
        setScatterProgress(0)
        return
      }
      
      // Scatter: trigger when element is above 30% of viewport (scrolled up past trigger)
      const scatterTriggerPoint = viewportHeight * 0.30
      const elementCenter = rect.top + rect.height / 2
      
      if (elementCenter < scatterTriggerPoint) {
        hasScrolledPast = true
        const distancePastTrigger = scatterTriggerPoint - elementCenter
        const progress = clamp01(distancePastTrigger / scrollEnd)
        setScatterProgress(progress)
      } else if (hasScrolledPast) {
        // Only reset if we've scrolled past before (prevent initial state scatter)
        setScatterProgress(0)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    // Delay initial check to prevent flash
    requestAnimationFrame(() => handleScroll())

    return () => window.removeEventListener('scroll', handleScroll)
  }, [isVisible, scrollEnd, scrollStart])

  // Apply scatter transforms directly to DOM
  useEffect(() => {
    const validChars = charsRef.current.filter(Boolean) as HTMLSpanElement[]
    
    validChars.forEach((char, index) => {
      const values = scatterValues[index]
      if (scatterProgress > 0) {
        char.style.transform = `translate(${values.x * scatterProgress}px, ${values.y * scatterProgress}px) rotate(${values.rotation * scatterProgress}deg) scale(${1 - 0.5 * scatterProgress})`
        char.style.opacity = String(1 - scatterProgress)
      }
    })
  }, [scatterProgress, scatterValues])

  return (
    <Component
      ref={containerRef as React.RefObject<HTMLDivElement>}
      className={className}
      style={style}
    >
      {chars.map((char, index) => {
        const delay = index * 0.025
        
        // Only apply fade-in styles when not scattering
        const fadeInStyle = scatterProgress === 0 ? {
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
          filter: isVisible ? 'blur(0px)' : 'blur(6px)',
          transition: `opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, filter 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
        } : {}
        
        return (
          <span
            key={index}
            ref={(el) => { charsRef.current[index] = el }}
            className={`inline-block will-change-transform ${gradient ? 'gradient-text-soft' : ''}`}
            style={fadeInStyle}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        )
      })}
    </Component>
  )
}
