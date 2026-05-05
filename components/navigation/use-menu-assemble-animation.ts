'use client'

import { useCallback, useEffect, useState } from 'react'
import type { UseMenuAssembleAnimationOptions } from '@/types/navigation'

export function useMenuAssembleAnimation({
  isOpen,
  setIsOpen,
  isMobile,
  onOpen,
}: UseMenuAssembleAnimationOptions) {
  const [isAnimating, setIsAnimating] = useState(false)
  const [assembleProgress, setAssembleProgress] = useState(0)

  // Animate assembly when menu opens
  useEffect(() => {
    if (!isOpen) {
      setAssembleProgress(0)
      return
    }

    if (isMobile) {
      setAssembleProgress(1)
      return
    }

    let startTime: number | null = null
    let lastFrameTime = 0
    const duration = 1200 // 1.2 seconds for full assembly

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      if (timestamp - lastFrameTime < 33 && timestamp - startTime < duration) {
        requestAnimationFrame(animate)
        return
      }
      lastFrameTime = timestamp

      const elapsed = timestamp - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Easing function for smooth assembly
      const eased = 1 - Math.pow(1 - progress, 3)
      setAssembleProgress(eased)

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    const timeoutId = setTimeout(() => {
      requestAnimationFrame(animate)
    }, 200)

    return () => clearTimeout(timeoutId)
  }, [isOpen, isMobile])

  const restoreScrollPosition = useCallback(() => {
    const scrollY = document.documentElement.style.top
    document.documentElement.style.overflow = ''
    document.body.style.overflow = ''
    document.documentElement.style.position = ''
    document.documentElement.style.width = ''
    document.documentElement.style.top = ''
    window.scrollTo(0, parseInt(scrollY || '0') * -1)
  }, [])

  const forceCloseMenu = useCallback(() => {
    restoreScrollPosition()
    setAssembleProgress(0)
    setIsOpen(false)
    setIsAnimating(false)
  }, [restoreScrollPosition, setIsOpen])

  const openMenu = useCallback(() => {
    if (isAnimating) return
    setIsAnimating(true)
    setIsOpen(true)
    if (isMobile) {
      setAssembleProgress(1)
    }
    onOpen?.()
    // Disable scroll on both html and body
    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'
    document.documentElement.style.position = 'fixed'
    document.documentElement.style.width = '100%'
    document.documentElement.style.top = `-${window.scrollY}px`
    setTimeout(() => setIsAnimating(false), isMobile ? 0 : 1500)
  }, [isAnimating, isMobile, onOpen, setIsOpen])

  const closeMenu = useCallback(() => {
    if (isAnimating) return
    setIsAnimating(true)

    if (isMobile) {
      restoreScrollPosition()
      setAssembleProgress(0)
      setIsOpen(false)
      setIsAnimating(false)
      return
    }

    // Reverse animation - scatter out
    let startTime: number | null = null
    let lastFrameTime = 0
    const duration = 600

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      if (timestamp - lastFrameTime < 33 && timestamp - startTime < duration) {
        requestAnimationFrame(animate)
        return
      }
      lastFrameTime = timestamp

      const elapsed = timestamp - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = Math.pow(progress, 2)

      setAssembleProgress(1 - eased)

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        // Restore scroll position
        restoreScrollPosition()

        setIsOpen(false)
        setIsAnimating(false)
      }
    }

    requestAnimationFrame(animate)
  }, [isAnimating, isMobile, restoreScrollPosition, setIsOpen])

  return {
    assembleProgress,
    closeMenu,
    forceCloseMenu,
    isAnimating,
    openMenu,
  }
}
