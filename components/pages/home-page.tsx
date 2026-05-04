'use client'

import { useLayoutEffect, useState } from 'react'
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
  const [layoutMode, setLayoutMode] = useState<'desktop-inverted' | 'mobile-normal'>('mobile-normal')
  const isDesktopInverted = layoutMode === 'desktop-inverted'

  useLayoutEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 768px)')
    const syncMode = () => {
      const shouldInvert = mediaQuery.matches
      setLayoutMode(shouldInvert ? 'desktop-inverted' : 'mobile-normal')
    }

    syncMode()
    mediaQuery.addEventListener('change', syncMode)
    return () => mediaQuery.removeEventListener('change', syncMode)
  }, [])

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
      <div className="home-ascent-deferred">
        <HomeDeferredSections
          worksPreview={homeWorksPreview}
          area={homeArea}
        />
      </div>
    </div>
  )
}
