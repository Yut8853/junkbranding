'use client'

import { useEffect, useRef, useMemo, useState } from 'react'
import { clamp01, createScatterValue } from '@/lib/scatter'
import { subscribeToScrollUpdates } from '@/lib/scroll-manager'

interface ScatterTextProps {
  children: string
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div'
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
  const isVisibleRef = useRef(false)
  const progressRef = useRef(0)
  const [isVisible, setIsVisible] = useState(false)

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

  function applyScatter(progress: number) {
    charsRef.current.forEach((char, index) => {
      if (!char) return

      const values = scatterValues[index]
      if (!values) return

      if (progress > 0) {
        char.style.transform = `translate3d(${values.x * progress}px, ${values.y * progress}px, 0) rotate(${values.rotation * progress}deg) scale(${1 - 0.5 * progress})`
        char.style.opacity = String(1 - progress)
        char.style.transition = 'none'
        return
      }

      char.style.transform = ''
      char.style.opacity = ''
      char.style.transition = ''
    })
  }

  // Combined scroll handler for fade-in and scatter
  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    let hasScrolledPast = false

    return subscribeToScrollUpdates(container, ({ rect, viewportHeight, scrollY }) => {
      // Fade-in: trigger when bottom of element is 50px above viewport bottom
      const fadeInTrigger = viewportHeight - scrollStart
      if (rect.top < fadeInTrigger && !isVisibleRef.current) {
        isVisibleRef.current = true
        setIsVisible(true)
      }

      // Only start scattering after user has scrolled at least 100px
      if (scrollY < 100) {
        if (progressRef.current !== 0) {
          progressRef.current = 0
          applyScatter(0)
        }
        return
      }

      // Scatter: trigger when element is above 30% of viewport (scrolled up past trigger)
      const scatterTriggerPoint = viewportHeight * 0.30
      const elementCenter = rect.top + rect.height / 2

      if (elementCenter < scatterTriggerPoint) {
        hasScrolledPast = true
        const distancePastTrigger = scatterTriggerPoint - elementCenter
        const progress = clamp01(distancePastTrigger / scrollEnd)
        if (Math.abs(progress - progressRef.current) > 0.01 || progress === 0 || progress === 1) {
          progressRef.current = progress
          applyScatter(progress)
        }
      } else if (hasScrolledPast) {
        // Only reset if we've scrolled past before (prevent initial state scatter)
        if (progressRef.current !== 0) {
          progressRef.current = 0
          applyScatter(0)
        }
      }
    })
  }, [scrollEnd, scrollStart])

  return (
    <Component
      ref={containerRef as React.RefObject<HTMLDivElement>}
      className={className}
      style={style}
    >
      {chars.map((char, index) => {
        const delay = Math.min(index * 0.012, 0.45)

        const fadeInStyle = {
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translate3d(0,0,0)' : 'translate3d(0,28px,0)',
          transition: `opacity 0.55s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, transform 0.55s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
        }

        return (
          <span
            key={index}
            ref={(el) => { charsRef.current[index] = el }}
            className={`inline-block ${gradient ? 'gradient-text-soft' : ''}`}
            style={fadeInStyle}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        )
      })}
    </Component>
  )
}
