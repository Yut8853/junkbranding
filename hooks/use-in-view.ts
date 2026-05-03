'use client'

import { useEffect, useState } from 'react'
import type { UseInViewOptions, UseInViewRef } from '@/types/hooks'

export function useInView(
  ref: UseInViewRef,
  { once = false, margin = '0px', threshold = 0.1 }: UseInViewOptions = {}
) {
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          if (once) {
            observer.unobserve(element)
          }
          return
        }

        if (!once) {
          setIsInView(false)
        }
      },
      {
        rootMargin: margin,
        threshold,
      }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [ref, once, margin, threshold])

  return isInView
}
