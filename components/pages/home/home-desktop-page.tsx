'use client'

import { homeAboutPreview, homeArea, homePreviewVideoSrc, homeWorksPreview } from '@/content/home-page'
import {
  HomeAboutPreviewSection,
  HomeHeroSection,
  HomeMarqueeSection,
} from '@/components/pages/home/home-sections'
import { HomeAscentSection } from '@/components/pages/home/home-ascent-section'
import { HomeDeferredSections } from '@/components/pages/home/home-deferred-sections'
import { HomeInvertedScroll } from '@/components/pages/home/home-inverted-scroll'

export function HomeDesktopPage() {
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
