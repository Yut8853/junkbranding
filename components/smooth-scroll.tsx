'use client'

import { ReactNode, useEffect, useRef, useState } from 'react'

interface SmoothScrollProps {
  children: ReactNode
}

export function SmoothScroll({ children }: SmoothScrollProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)

    // Smooth scroll for anchor links with custom easing
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const anchor = target.closest('a[href^="#"]')
      
      if (anchor) {
        const href = anchor.getAttribute('href')
        if (href && href.startsWith('#')) {
          e.preventDefault()
          const element = document.querySelector(href)
          if (element) {
            smoothScrollTo(element as HTMLElement)
          }
        }
      }
    }

    // Custom smooth scroll with easing
    const smoothScrollTo = (target: HTMLElement) => {
      const targetPosition = target.getBoundingClientRect().top + window.scrollY
      const startPosition = window.scrollY
      const distance = targetPosition - startPosition
      const duration = Math.min(1500, Math.max(800, Math.abs(distance) * 0.5))
      let start: number | null = null

      const easeOutQuint = (t: number) => 1 - Math.pow(1 - t, 5)

      const animation = (currentTime: number) => {
        if (start === null) start = currentTime
        const elapsed = currentTime - start
        const progress = Math.min(elapsed / duration, 1)
        const easedProgress = easeOutQuint(progress)
        
        window.scrollTo(0, startPosition + distance * easedProgress)

        if (progress < 1) {
          requestAnimationFrame(animation)
        }
      }

      requestAnimationFrame(animation)
    }

    document.addEventListener('click', handleAnchorClick)

    // Add scroll-based parallax effect to elements with data-scroll-speed
    const parallaxElements = document.querySelectorAll('[data-scroll-speed]')
    let rafId: number

    const handleParallax = () => {
      parallaxElements.forEach((el) => {
        const speed = parseFloat(el.getAttribute('data-scroll-speed') || '0')
        const rect = el.getBoundingClientRect()
        const scrolled = window.scrollY
        const yPos = -(scrolled * speed)
        
        ;(el as HTMLElement).style.transform = `translate3d(0, ${yPos}px, 0)`
      })
    }

    const scrollHandler = () => {
      if (rafId) cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(handleParallax)
    }

    window.addEventListener('scroll', scrollHandler, { passive: true })
    handleParallax()

    return () => {
      document.removeEventListener('click', handleAnchorClick)
      window.removeEventListener('scroll', scrollHandler)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [])

  if (!isMounted) {
    return <>{children}</>
  }

  return <>{children}</>
}

// Hook for scroll-based animations
export function useScrollProgress() {
  const [progress, setProgress] = useState(0)
  const rafRef = useRef<number>()

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollProgress = docHeight > 0 ? scrollTop / docHeight : 0
      setProgress(Math.min(1, Math.max(0, scrollProgress)))
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

  return progress
}

// Hook for element visibility
export function useInView(threshold = 0.1) {
  const ref = useRef<HTMLElement>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting)
      },
      { threshold }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [threshold])

  return { ref, isInView }
}
