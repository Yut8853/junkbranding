'use client'

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'

type HomeInvertedScrollProps = {
  children: ReactNode
}

const clamp01 = (value: number) => Math.min(1, Math.max(0, value))

export function HomeInvertedScroll({ children }: HomeInvertedScrollProps) {
  const sceneRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [heroOffset, setHeroOffset] = useState(0)
  const [translateY, setTranslateY] = useState(0)

  const measure = useCallback(() => {
    const content = contentRef.current
    if (!content) return

    const lastSection = content.lastElementChild as HTMLElement | null
    const nextHeroOffset = lastSection?.offsetTop ?? 0
    setHeroOffset(nextHeroOffset)
    setTranslateY(-nextHeroOffset)
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

  return (
    <div
      ref={sceneRef}
      className="home-inverted-scroll"
      style={{ height: `calc(${heroOffset}px + 100vh)` }}
    >
      <div className="home-inverted-scroll__viewport">
        <div
          ref={contentRef}
          className="home-inverted-scroll__content"
          style={{ transform: `translate3d(0, ${translateY}px, 0)` }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}
