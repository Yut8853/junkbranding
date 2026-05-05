'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import { useIsMobile } from '@/hooks/use-mobile'
import type { ParallaxSectionProps, RevealSectionProps } from '@/types/component-props'

export function RevealSection({
  children,
  className = '',
  delay = 0,
  threshold = 0.15,
  once = true,
  duration = 1.2,
}: RevealSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [hasAnimated, setHasAnimated] = useState(false)
  const isMobile = useIsMobile()

  useEffect(() => {
    if (typeof window === 'undefined' || !sectionRef.current) return

    if (isMobile) {
      setIsVisible(true)
      setHasAnimated(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && (!hasAnimated || !once)) {
            setIsVisible(true)
            if (once) {
              setHasAnimated(true)
              observer.unobserve(entry.target)
            }
          } else if (!once && !entry.isIntersecting) {
            setIsVisible(false)
          }
        })
      },
      { threshold, rootMargin: '0px 0px -50px 0px' }
    )

    observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [threshold, once, hasAnimated, isMobile])

  return (
    <div
      ref={sectionRef}
      className={className}
      style={{
        opacity: isMobile || isVisible ? 1 : 0,
        transform: isMobile || isVisible ? 'translate3d(0, 0, 0)' : 'translate3d(0, 60px, 0)',
        filter: isMobile || isVisible ? 'none' : 'blur(8px)',
        transitionProperty: 'opacity, transform, filter',
        transitionDuration: isMobile ? '0s' : `${duration}s`,
        transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
        transitionDelay: isMobile ? '0s' : isVisible ? `${delay}s` : '0s',
        willChange: isMobile ? 'auto' : 'transform, opacity, filter',
      }}
    >
      {children}
    </div>
  )
}

export function ParallaxSection({
  children,
  className = '',
  speed = 0.3,
}: ParallaxSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [offset, setOffset] = useState(0)
  const rafRef = useRef<number>(0)
  const isMobile = useIsMobile()

  useEffect(() => {
    if (typeof window === 'undefined' || isMobile) return

    const handleScroll = () => {
      if (!sectionRef.current) return
      const rect = sectionRef.current.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const elementCenter = rect.top + rect.height / 2
      const windowCenter = windowHeight / 2
      const distance = elementCenter - windowCenter
      setOffset(distance * speed * -1)
    }

    const scrollHandler = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(handleScroll)
    }

    window.addEventListener('scroll', scrollHandler, { passive: true })
    handleScroll()

    return () => {
      window.removeEventListener('scroll', scrollHandler)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [speed, isMobile])

  return (
    <div
      ref={sectionRef}
      className={className}
      style={{
        transform: isMobile ? 'none' : `translate3d(0, ${offset}px, 0)`,
        willChange: isMobile ? 'auto' : 'transform',
        transition: isMobile ? 'none' : 'transform 0.1s linear',
      }}
    >
      {children}
    </div>
  )
}
