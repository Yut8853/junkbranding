'use client'

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'

const clamp01 = (value: number) => Math.min(1, Math.max(0, value))

export function useInvertedScrollAnimation(children: ReactNode) {
  const sceneRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [heroOffset, setHeroOffset] = useState(0)
  const [translateY, setTranslateY] = useState(0)

  const measure = useCallback(() => {
    const content = contentRef.current
    const scene = sceneRef.current
    if (!content) return

    const lastSection = content.lastElementChild as HTMLElement | null
    const nextHeroOffset = lastSection?.offsetTop ?? 0
    const progress = scene && nextHeroOffset > 0
      ? clamp01(-scene.getBoundingClientRect().top / nextHeroOffset)
      : 0
    setHeroOffset(nextHeroOffset)
    setTranslateY(-nextHeroOffset + nextHeroOffset * progress)
  }, [])

  useEffect(() => {
    let rafId: number | null = null

    const update = () => {
      const scene = sceneRef.current
      if (!scene || heroOffset <= 0) return

      const progress = clamp01(-scene.getBoundingClientRect().top / heroOffset)
      setTranslateY(-heroOffset + heroOffset * progress)
    }

    const scheduleUpdate = () => {
      if (rafId !== null) return
      rafId = requestAnimationFrame(() => {
        rafId = null
        update()
      })
    }

    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', measure, { passive: true })
    update()

    return () => {
      window.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', measure)
      if (rafId !== null) cancelAnimationFrame(rafId)
    }
  }, [heroOffset, measure])

  useLayoutEffect(() => {
    measure()
    const firstFrame = requestAnimationFrame(measure)
    const secondFrame = requestAnimationFrame(() => requestAnimationFrame(measure))

    return () => {
      cancelAnimationFrame(firstFrame)
      cancelAnimationFrame(secondFrame)
    }
  }, [measure, children])

  useEffect(() => {
    const content = contentRef.current
    if (!content || typeof ResizeObserver === 'undefined') return

    // dynamic importされた下層セクションが後から入るため、DOMサイズ変化でHERO開始位置を測り直す。
    const observer = new ResizeObserver(() => {
      requestAnimationFrame(measure)
    })
    observer.observe(content)

    return () => observer.disconnect()
  }, [measure])

  return {
    contentRef,
    heroOffset,
    sceneRef,
    translateY,
  }
}
