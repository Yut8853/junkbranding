'use client'

import { useRef, useEffect, useState, ReactNode, useCallback } from 'react'

// --- RevealSection (シンプルなフェードアニメーション) ---
interface RevealSectionProps {
  children: ReactNode
  className?: string
  delay?: number
  threshold?: number
  once?: boolean
  duration?: number
}

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

  useEffect(() => {
    if (typeof window === 'undefined' || !sectionRef.current) return

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
  }, [threshold, once, hasAnimated])

  return (
    <div
      ref={sectionRef}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translate3d(0, 0, 0)' : 'translate3d(0, 60px, 0)',
        filter: isVisible ? 'blur(0px)' : 'blur(8px)',
        transitionProperty: 'opacity, transform, filter',
        transitionDuration: `${duration}s`,
        transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
        transitionDelay: isVisible ? `${delay}s` : '0s',
        willChange: 'transform, opacity, filter',
      }}
    >
      {children}
    </div>
  )
}

// --- ParallaxSection ---
interface ParallaxSectionProps {
  children: ReactNode
  className?: string
  speed?: number
}

export function ParallaxSection({
  children,
  className = '',
  speed = 0.3,
}: ParallaxSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [offset, setOffset] = useState(0)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    if (typeof window === 'undefined') return

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
  }, [speed])

  return (
    <div
      ref={sectionRef}
      className={className}
      style={{
        transform: `translate3d(0, ${offset}px, 0)`,
        willChange: 'transform',
        transition: 'transform 0.1s linear',
      }}
    >
      {children}
    </div>
  )
}
