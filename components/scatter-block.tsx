'use client'

import { useEffect, useRef, useState, useMemo, type MouseEvent } from 'react'
import Link from 'next/link'
import { useTransition } from '@/contexts/transition-context'
import { clamp01, createScatterValue } from '@/lib/scatter'
import { subscribeToScrollUpdates } from '@/lib/scroll-manager'
import { useIsMobile } from '@/hooks/use-mobile'
import type { ScatterBlockProps } from '@/types/component-props'

export function ScatterBlock({
  children,
  className = '',
  scrollEnd = 300,
  distance = 400,
  seed = 1,
  href,
  onClick,
}: ScatterBlockProps) {
  const { navigateWithTransition, isTransitioning, prefetchRoute } = useTransition()
  const ref = useRef<HTMLElement>(null)
  const progressRef = useRef(0)
  const isVisibleRef = useRef(false)
  const [isVisible, setIsVisible] = useState(false)
  const isMobile = useIsMobile()

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

  const applyScatter = (progress: number) => {
    const element = ref.current
    if (!element) return

    if (progress > 0) {
      element.style.transform = `translate3d(${scatterValue.x * progress}px, ${scatterValue.y * progress}px, 0) rotate(${scatterValue.rotation * progress}deg) scale(${1 - 0.3 * progress})`
      element.style.opacity = String(1 - progress)
      element.style.transition = 'none'
      element.style.willChange = 'transform, opacity'
      return
    }

    element.style.transform = ''
    element.style.opacity = ''
    element.style.transition = ''
    element.style.willChange = ''
  }

  // Combined scroll handler for fade-in and scatter
  useEffect(() => {
    const element = ref.current
    if (!element) return

    if (isMobile) {
      isVisibleRef.current = true
      setIsVisible(true)
      applyScatter(0)
      return
    }

    return subscribeToScrollUpdates(element, ({ rect, viewportHeight }) => {
      // Fade-in: trigger when element is 50px above viewport bottom
      const fadeInTrigger = viewportHeight - 50
      if (rect.top < fadeInTrigger && !isVisibleRef.current) {
        isVisibleRef.current = true
        setIsVisible(true)
      }

      // Scatter: trigger when element reaches 45% from top (55% down)
      const scatterTriggerPoint = viewportHeight * 0.45
      const elementCenter = rect.top + rect.height / 2

      if (elementCenter < scatterTriggerPoint) {
        const distancePastTrigger = scatterTriggerPoint - elementCenter
        const progress = clamp01(distancePastTrigger / scrollEnd)
        if (Math.abs(progress - progressRef.current) > 0.01 || progress === 0 || progress === 1) {
          progressRef.current = progress
          applyScatter(progress)
        }
      } else {
        if (progressRef.current !== 0) {
          progressRef.current = 0
          applyScatter(0)
        }
      }
    })
  }, [isMobile, scrollEnd, scatterValue])

  // Calculate styles
  const getStyles = () => {
    return {
      transform: isMobile || isVisible ? 'translate3d(0,0,0) scale(1)' : 'translate3d(0,24px,0) scale(0.98)',
      opacity: isMobile || isVisible ? 1 : 0,
      transition: isMobile ? 'none' : 'transform 0.55s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.55s cubic-bezier(0.16, 1, 0.3, 1)',
    }
  }

  const blockStyle = {
    ...getStyles(),
    cursor: href ? 'pointer' : undefined,
  }

  const handleClick = (e: MouseEvent<HTMLElement>) => {
    onClick?.()

    if (!href) return

    if (
      e.defaultPrevented ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey ||
      e.button !== 0 ||
      !href.startsWith('/') ||
      isTransitioning
    ) {
      return
    }

    e.preventDefault()
    navigateWithTransition(href)
  }

  if (href && href.startsWith('/')) {
    return (
      <Link
        ref={ref as React.RefObject<HTMLAnchorElement>}
        href={href}
        className={className}
        style={blockStyle}
        onClick={handleClick}
        onMouseEnter={() => href.startsWith('/') && prefetchRoute(href)}
        onFocus={() => href.startsWith('/') && prefetchRoute(href)}
      >
        {children}
      </Link>
    )
  }

  if (href) {
    return (
      <a
        ref={ref as React.RefObject<HTMLAnchorElement>}
        href={href}
        className={className}
        style={blockStyle}
        onClick={handleClick}
      >
        {children}
      </a>
    )
  }

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={className}
      style={blockStyle}
      onClick={handleClick}
    >
      {children}
    </div>
  )
}
