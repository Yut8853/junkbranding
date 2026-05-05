'use client'

import { useInvertedScrollAnimation } from '@/components/pages/home/use-inverted-scroll-animation'
import type { HomeInvertedScrollProps } from '@/types/home-page'

export function HomeInvertedScroll({ children }: HomeInvertedScrollProps) {
  const {
    contentRef,
    heroOffset,
    sceneRef,
    translateY,
  } = useInvertedScrollAnimation(children)

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
