'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { homeAboutPreview, homeArea, homePreviewVideoSrc, homeWorksPreview } from '@/content/home-page'
import {
  HomeAboutPreviewSection,
  HomeHeroSection,
  HomeMarqueeSection,
} from '@/components/pages/home/home-sections'
import { HomeAscentSection } from '@/components/pages/home/home-ascent-section'
import { HomeDeferredSections } from '@/components/pages/home/home-deferred-sections'
import { HomeInvertedScroll } from '@/components/pages/home/home-inverted-scroll'

export default function HomePageClient() {
  const deferredTriggerRef = useRef<HTMLDivElement>(null)
  const [layoutMode, setLayoutMode] = useState<'pending' | 'desktop-inverted' | 'mobile-normal'>('pending')
  const [shouldRenderDeferred, setShouldRenderDeferred] = useState(false)
  const isDesktopInverted = layoutMode === 'desktop-inverted'

  useLayoutEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 768px)')
    const syncMode = () => {
      const shouldInvert = mediaQuery.matches
      setLayoutMode(shouldInvert ? 'desktop-inverted' : 'mobile-normal')
      if (shouldInvert) {
        setShouldRenderDeferred(true)
      }
    }

    syncMode()
    mediaQuery.addEventListener('change', syncMode)
    return () => mediaQuery.removeEventListener('change', syncMode)
  }, [])

  useEffect(() => {
    if (isDesktopInverted) return

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
  }, [isDesktopInverted, shouldRenderDeferred])

  if (layoutMode === 'pending') {
    return <div className="min-h-screen" aria-hidden="true" />
  }

  if (isDesktopInverted) {
    return (
      <div className="home-ascent-page home-ascent-page--inverted">
        <HomeInvertedScroll>
          <HomeDeferredSections
            worksPreview={homeWorksPreview}
            area={homeArea}
            inverted
          />
          <HomeAscentSection label="ABOUT US">
            <HomeAboutPreviewSection
              aboutPreview={homeAboutPreview}
              videoSrc={homePreviewVideoSrc}
            />
          </HomeAscentSection>
          <HomeAscentSection label="MARQUEE">
            <HomeMarqueeSection />
          </HomeAscentSection>
          <HomeAscentSection label="HERO">
            <HomeHeroSection />
          </HomeAscentSection>
        </HomeInvertedScroll>
      </div>
    )
  }

  return (
    <div className="home-ascent-page">
      <HomeAscentSection label="HERO">
        <HomeHeroSection />
      </HomeAscentSection>
      <HomeAscentSection label="MARQUEE">
        <HomeMarqueeSection />
      </HomeAscentSection>
      <HomeAscentSection label="ABOUT US">
        <HomeAboutPreviewSection
          aboutPreview={homeAboutPreview}
          videoSrc={homePreviewVideoSrc}
        />
      </HomeAscentSection>
      <div ref={deferredTriggerRef} aria-hidden={!shouldRenderDeferred} className="home-ascent-deferred">
        {shouldRenderDeferred ? (
          <HomeDeferredSections
            worksPreview={homeWorksPreview}
            area={homeArea}
          />
        ) : (
          <div className="min-h-[60vh]" />
        )}
      </div>
    </div>
  )
}
