'use client'

import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'
import { homeAboutPreview, homeArea, homePreviewVideoSrc, homeWorksPreview } from '@/content/home-page'
import {
  HomeAboutPreviewSection,
  HomeHeroSection,
  HomeMarqueeSection,
} from '@/components/pages/home/home-sections'

const HomeDeferredSections = dynamic(
  () => import('@/components/pages/home/home-deferred-sections').then((mod) => mod.HomeDeferredSections),
  {
    ssr: false,
    loading: () => <div className="min-h-[60vh]" aria-hidden="true" />,
  }
)

export default function HomePageClient() {
  const deferredTriggerRef = useRef<HTMLDivElement>(null)
  const [shouldRenderDeferred, setShouldRenderDeferred] = useState(false)

  useEffect(() => {
    const trigger = deferredTriggerRef.current
    if (!trigger || shouldRenderDeferred) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        setShouldRenderDeferred(true)
        observer.disconnect()
      },
      { rootMargin: '900px 0px' }
    )

    observer.observe(trigger)
    return () => observer.disconnect()
  }, [shouldRenderDeferred])

  return (
    <>
      <HomeHeroSection />
      <HomeMarqueeSection />
      <HomeAboutPreviewSection
        aboutPreview={homeAboutPreview}
        videoSrc={homePreviewVideoSrc}
      />
      <div ref={deferredTriggerRef} aria-hidden={!shouldRenderDeferred}>
        {shouldRenderDeferred ? (
          <HomeDeferredSections
            worksPreview={homeWorksPreview}
            area={homeArea}
          />
        ) : (
          <div className="min-h-[60vh]" />
        )}
      </div>
    </>
  )
}
