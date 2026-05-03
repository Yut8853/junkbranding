'use client'

import { Footer } from '@/components/footer'
import { homeAboutPreview, homeArea, homePreviewVideoSrc, homeWorksPreview } from '@/content/home-page'
import {
  CTASectionV2,
  HomeAboutPreviewSection,
  HomeAreaSection,
  HomeHeroSection,
  HomeMarqueeSection,
  HomeWorksPreviewSection,
  ServicesSectionV2,
} from '@/components/pages/home/home-sections'

export default function HomePageClient() {
  return (
    <>
      <HomeHeroSection />
      <HomeMarqueeSection />
      <HomeAboutPreviewSection
        aboutPreview={homeAboutPreview}
        videoSrc={homePreviewVideoSrc}
      />
      <ServicesSectionV2 />
      <HomeWorksPreviewSection worksPreview={homeWorksPreview} />
      <HomeAreaSection area={homeArea} />
      <CTASectionV2 />
      <Footer />
    </>
  )
}
