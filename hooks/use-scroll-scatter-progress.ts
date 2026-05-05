'use client'

import { useEffect, useRef, useState, type RefObject } from 'react'
import { useIsMobile } from '@/hooks/use-mobile'
import type { UseScrollScatterProgressOptions } from '@/types/hooks'

export function useScrollScatterProgress<TElement extends HTMLElement>(
  elementRef: RefObject<TElement | null>,
  {
    disabled = false,
    maxDistance = 400,
    threshold = 0.01,
  }: UseScrollScatterProgressOptions = {},
) {
  const [progress, setProgress] = useState(0)
  const lastProgressRef = useRef(-1)
  const isMobile = useIsMobile()

  useEffect(() => {
    if (!elementRef.current || isMobile || disabled) return

    // scrollイベントでは直接state更新せず、RAFにまとめてCanvas散らばりの進捗だけを返す。
    let rafId: number | null = null

    const updateProgress = () => {
      const rect = elementRef.current?.getBoundingClientRect()
      if (!rect) return

      const nextProgress = Math.min(Math.max(-rect.top, 0) / maxDistance, 1)
      if (Math.abs(nextProgress - lastProgressRef.current) < threshold) return

      lastProgressRef.current = nextProgress
      setProgress(nextProgress)
    }

    const scheduleUpdate = () => {
      if (rafId !== null) return
      rafId = requestAnimationFrame(() => {
        rafId = null
        updateProgress()
      })
    }

    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    updateProgress()

    return () => {
      window.removeEventListener('scroll', scheduleUpdate)
      if (rafId !== null) cancelAnimationFrame(rafId)
    }
  }, [disabled, elementRef, isMobile, maxDistance, threshold])

  return progress
}
