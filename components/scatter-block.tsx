'use client'

import { useEffect, useRef, useState, useMemo, ReactNode } from 'react'
import { useTransition } from '@/contexts/transition-context'
import { clamp01, createScatterValue } from '@/lib/scatter'

interface ScatterBlockProps {
  children: ReactNode
  className?: string
  scrollEnd?: number
  distance?: number
  seed?: number
  href?: string
  onClick?: () => void
}

export function ScatterBlock({
  children,
  className = '',
  scrollEnd = 300,
  distance = 400,
  seed = 1,
  href,
  onClick,
}: ScatterBlockProps) {
  const { navigateWithTransition } = useTransition()
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [scatterProgress, setScatterProgress] = useState(0)

  // Pre-generate scatter value with seeded randomness
  const scatterValue = useMemo(() => {
    const s = seed * 17 + 31
    return createScatterValue({
      seed: s,
      minDistance: distance * 0.6,
      distanceRange: distance * 0.8,
      rotationRange: 360,
    })
  }, [distance, seed])

  // Combined scroll handler for fade-in and scatter
  useEffect(() => {
    const element = ref.current
    if (!element) return

    const handleScroll = () => {
      const rect = element.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      
      // Fade-in: trigger when element is 50px above viewport bottom
      const fadeInTrigger = viewportHeight - 50
      if (rect.top < fadeInTrigger && !isVisible) {
        setIsVisible(true)
      }
      
      // Scatter: trigger when element reaches 45% from top (55% down)
      const scatterTriggerPoint = viewportHeight * 0.45
      const elementCenter = rect.top + rect.height / 2
      
      if (elementCenter < scatterTriggerPoint) {
        const distancePastTrigger = scatterTriggerPoint - elementCenter
        const progress = clamp01(distancePastTrigger / scrollEnd)
        setScatterProgress(progress)
      } else {
        setScatterProgress(0)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [isVisible, scrollEnd])

  // Calculate styles
  const getStyles = () => {
    if (scatterProgress > 0) {
      // Scatter mode - no transition for instant response
      return {
        transform: `translate(${scatterValue.x * scatterProgress}px, ${scatterValue.y * scatterProgress}px) rotate(${scatterValue.rotation * scatterProgress}deg) scale(${1 - 0.3 * scatterProgress})`,
        opacity: 1 - scatterProgress,
        filter: 'blur(0px)',
        transition: 'none',
      }
    } else {
      // Fade-in mode
      return {
        transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.95)',
        opacity: isVisible ? 1 : 0,
        filter: isVisible ? 'blur(0px)' : 'blur(6px)',
        transition: 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), filter 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
      }
    }
  }

  const handleClick = (e: React.MouseEvent) => {
    if (href) {
      e.preventDefault()
      navigateWithTransition(href)
    }
    onClick?.()
  }

  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...getStyles(),
        willChange: 'transform, opacity, filter',
        cursor: href ? 'pointer' : undefined,
      }}
      onClick={handleClick}
      role={href ? 'link' : undefined}
    >
      {children}
    </div>
  )
}
