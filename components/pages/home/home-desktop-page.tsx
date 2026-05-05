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
import { useDeferredRender } from '@/hooks/use-deferred-render'

export function HomeDesktopPage() {
  const shouldRenderAscentSections = useDeferredRender(6500, 4800)

  return (
    <div className="home-ascent-page home-ascent-page--inverted">
      <HomeInvertedScroll>
        {shouldRenderAscentSections && (
          <>
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
          </>
        )}
        <HomeAscentSection label="HERO">
          <HomeHeroSection />
        </HomeAscentSection>
      </HomeInvertedScroll>
    </div>
  )
}
