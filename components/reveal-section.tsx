'use client'

import { useRef, useEffect, useState, ReactNode, useCallback, CSSProperties } from 'react'

// --- RevealSection ---
interface RevealSectionProps {
  children: ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'scale' | 'fade' | 'blur' | 'rotate'
  threshold?: number
  once?: boolean
  duration?: number
  easing?: string
}

export function RevealSection({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  threshold = 0.15,
  once = true,
  duration = 1.2,
  easing = 'cubic-bezier(0.16, 1, 0.3, 1)',
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

  const getTransform = useCallback(() => {
    if (isVisible) return 'translate3d(0, 0, 0) rotate(0deg) scale(1)'
    switch (direction) {
      case 'up': return 'translate3d(0, 80px, 0) rotate(0deg) scale(1)'
      case 'down': return 'translate3d(0, -80px, 0) rotate(0deg) scale(1)'
      case 'left': return 'translate3d(100px, 0, 0) rotate(0deg) scale(1)'
      case 'right': return 'translate3d(-100px, 0, 0) rotate(0deg) scale(1)'
      case 'scale': return 'translate3d(0, 40px, 0) rotate(0deg) scale(0.9)'
      case 'rotate': return 'translate3d(0, 60px, 0) rotate(3deg) scale(0.95)'
      case 'blur':
      case 'fade':
      default: return 'translate3d(0, 30px, 0) rotate(0deg) scale(1)'
    }
  }, [direction, isVisible])

  const getFilter = useCallback(() => {
    if (isVisible) return 'blur(0px)'
    return direction === 'blur' ? 'blur(20px)' : 'blur(0px)'
  }, [direction, isVisible])

  return (
    <div
      ref={sectionRef}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: getTransform(),
        filter: getFilter(),
        transitionProperty: 'opacity, transform, filter',
        transitionDuration: `${duration}s`,
        transitionTimingFunction: easing,
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
  direction?: 'vertical' | 'horizontal'
}

export function ParallaxSection({
  children,
  className = '',
  speed = 0.3,
  direction = 'vertical',
}: ParallaxSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
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
      const newOffset = distance * speed * -1

      if (direction === 'vertical') {
        setOffset({ x: 0, y: newOffset })
      } else {
        setOffset({ x: newOffset * 0.5, y: 0 })
      }
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
  }, [speed, direction])

  return (
    <div
      ref={sectionRef}
      className={className}
      style={{
        transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
        willChange: 'transform',
        transition: 'transform 0.1s linear',
      }}
    >
      {children}
    </div>
  )
}

// --- MorphingSection ---
export function MorphingSection({ children, className = '' }: { children: ReactNode, className?: string }) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const handleScroll = () => {
      if (!sectionRef.current) return
      const rect = sectionRef.current.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const progress = 1 - (rect.top / windowHeight)
      setScrollProgress(Math.max(0, Math.min(1, progress)))
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
  }, [])

  return (
    <div
      ref={sectionRef}
      className={className}
      style={{ '--scroll-progress': scrollProgress } as CSSProperties}
    >
      {children}
    </div>
  )
}

// --- StaggerContainer ---
export function StaggerContainer({ children, className = '', stagger = 0.08, delay = 0 }: { children: ReactNode, className?: string, stagger?: number, delay?: number }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
    )
    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        '--stagger-delay': `${stagger}s`,
        '--initial-delay': `${delay}s`,
      } as CSSProperties}
      data-visible={isVisible}
    >
      {children}
    </div>
  )
}