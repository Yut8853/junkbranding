'use client'

import { useEffect, type RefObject } from 'react'
import { useIsMobile } from '@/hooks/use-mobile'
import type { UsePointerTiltOptions } from '@/types/hooks'

export function usePointerTilt<TElement extends HTMLElement>(
  elementRef: RefObject<TElement | null>,
  {
    disabled = false,
    perspective = 1000,
    scale = 1.02,
    strength = 20,
  }: UsePointerTiltOptions = {},
) {
  const isMobile = useIsMobile()

  useEffect(() => {
    const element = elementRef.current
    if (!element || isMobile || disabled) return

    // カード専用の軽い3D傾き。CSS transformだけを直接更新してReact再描画を起こさない。
    const resetTransform = () => {
      element.style.transform = `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale(1)`
    }

    const handleMouseMove = (event: MouseEvent) => {
      const rect = element.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
      const centerX = rect.width / 2
      const centerY = rect.height / 2
      const rotateX = (y - centerY) / strength
      const rotateY = (centerX - x) / strength

      element.style.transform = `perspective(${perspective}px) rotateX(${-rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`
    }

    element.addEventListener('mousemove', handleMouseMove)
    element.addEventListener('mouseleave', resetTransform)

    return () => {
      element.removeEventListener('mousemove', handleMouseMove)
      element.removeEventListener('mouseleave', resetTransform)
    }
  }, [disabled, elementRef, isMobile, perspective, scale, strength])
}
