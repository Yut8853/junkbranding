'use client'

import dynamic from 'next/dynamic'
import { SectionReveal } from '@/components/text-reveal'
import { ScatterBlock } from '@/components/scatter-block'
import { ScatterText } from '@/components/scatter-text'
import { HeroSectionV2 } from '@/components/hero-section-v2'
import { MarqueeSectionV2 } from '@/components/marquee-section-v2'
import { useLazyVideo } from '@/components/pages/home/use-lazy-video'
import type {
  HomeAboutPreviewSectionProps,
  HomeAreaSectionProps,
  HomeWorksPreviewSectionProps,
} from '@/types/home-page'

export const ServicesSectionV2 = dynamic(
  () => import('@/components/services-section-v2').then((mod) => mod.ServicesSectionV2),
  { ssr: false }
)

export const CTASectionV2 = dynamic(
  () => import('@/components/cta-section-v2').then((mod) => mod.CTASectionV2),
  { ssr: false }
)

export function HomeHeroSection() {
  return <HeroSectionV2 />
}

export function HomeMarqueeSection() {
  return <MarqueeSectionV2 />
}

export function HomeAboutPreviewSection({
  aboutPreview,
  videoSrc,
}: HomeAboutPreviewSectionProps) {
  const { shouldLoadVideo, videoWrapperRef } = useLazyVideo()

  return (
    <section className="py-32 md:py-40 lg:py-56 glass-light">
      <div className="container mx-auto px-6 md:px-12 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div className="lg:pr-8">
            <div className="mb-6 lg:mb-8">
              <ScatterText
                as="span"
                className="font-display text-[clamp(3rem,10vw,7rem)] leading-none tracking-tight text-foreground/50 block"
                scrollStart={50}
                scrollEnd={350}
                distance={500}
                style={{
                  WebkitTextStroke: '1px currentColor',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {aboutPreview.eyebrow}
              </ScatterText>
            </div>
            <div className="mb-8 lg:mb-10">
              <ScatterText
                as="h2"
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.2]"
                scrollStart={50}
                scrollEnd={350}
                distance={400}
                gradient
              >
                {aboutPreview.title}
              </ScatterText>
            </div>
            <ScatterText
              as="p"
              className="text-base md:text-lg text-muted-foreground leading-[1.8] tracking-wide mb-10 lg:mb-12 max-w-lg"
              scrollStart={50}
              scrollEnd={350}
              distance={300}
            >
              {aboutPreview.description}
            </ScatterText>
            <ScatterBlock
              className="cta-primary inline-flex items-center gap-4 rounded-full px-8 py-4 text-sm font-bold tracking-widest uppercase transition-all duration-300"
              scrollEnd={350}
              distance={400}
              seed={1}
              href={aboutPreview.href}
            >
              {aboutPreview.cta}
            </ScatterBlock>
          </div>

          <SectionReveal delay={0.3} duration={1.2}>
            <div
              ref={videoWrapperRef}
              className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-card border border-border"
            >
              {shouldLoadVideo && (
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  className="absolute inset-0 w-full h-full object-cover"
                >
                  <source
                    src={videoSrc}
                    type="video/mp4"
                  />
                </video>
              )}
              <div className="absolute inset-0 bg-gradient-to-br from-foreground/10 via-transparent to-foreground/5" />
              <div className="absolute bottom-6 sm:bottom-8 right-6 sm:right-8 w-20 sm:w-24 h-[1px] bg-primary" />
            </div>
          </SectionReveal>
        </div>
      </div>
    </section>
  )
}

export function HomeWorksPreviewSection({
  worksPreview,
}: HomeWorksPreviewSectionProps) {
  return (
    <section className="py-32 md:py-40 lg:py-56 glass-light">
      <div className="container mx-auto px-6 md:px-12 lg:px-16">
        <div className="text-center mb-16 lg:mb-24">
          <div className="mb-6 lg:mb-8">
            <ScatterText
              as="span"
              className="font-display text-[clamp(3rem,10vw,7rem)] leading-none tracking-tight text-foreground/50 block"
              scrollStart={50}
              scrollEnd={350}
              distance={500}
              style={{
                WebkitTextStroke: '1px currentColor',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {worksPreview.eyebrow}
            </ScatterText>
          </div>
          <ScatterText
            as="h2"
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6 lg:mb-8"
            scrollStart={50}
            scrollEnd={350}
            distance={400}
            gradient
          >
            {worksPreview.title}
          </ScatterText>
          <ScatterText
            as="p"
            className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto leading-[1.8] tracking-wide"
            scrollStart={50}
            scrollEnd={350}
            distance={300}
          >
            {worksPreview.description}
          </ScatterText>
        </div>

        <div className="relative p-10 md:p-14 lg:p-20 rounded-3xl glass-card border border-border/20 text-center max-w-3xl mx-auto">
          <ScatterText
            as="p"
            className="text-base md:text-lg text-muted-foreground mb-8 lg:mb-10 leading-[1.8]"
            scrollStart={50}
            scrollEnd={350}
            distance={300}
          >
            {worksPreview.note}
          </ScatterText>
          <ScatterBlock
            className="cta-primary inline-flex items-center gap-4 rounded-full px-8 py-4 text-sm font-bold tracking-widest uppercase transition-all duration-300"
            scrollEnd={350}
            distance={400}
            seed={2}
            href={worksPreview.href}
          >
            {worksPreview.cta}
          </ScatterBlock>
        </div>
      </div>
    </section>
  )
}

export function HomeAreaSection({ area }: HomeAreaSectionProps) {
  return (
    <section className="py-32 md:py-40 lg:py-48 border-y border-border/20 glass-card overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 lg:px-16 text-center">
        <div className="mb-6 lg:mb-8">
          <ScatterText
            as="span"
            className="font-display text-[clamp(3rem,10vw,7rem)] leading-none tracking-tight text-foreground/50 block"
            scrollStart={50}
            scrollEnd={350}
            distance={500}
            style={{
              WebkitTextStroke: '1px currentColor',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {area.eyebrow}
          </ScatterText>
        </div>
        <ScatterText
          as="h2"
          className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-8 lg:mb-10"
          scrollStart={50}
          scrollEnd={350}
          distance={400}
        >
          {area.title}
        </ScatterText>
        <ScatterText
          as="p"
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-8 lg:mb-10 tracking-tight"
          scrollStart={50}
          scrollEnd={350}
          distance={500}
          gradient
        >
          {area.area}
        </ScatterText>
        <ScatterText
          as="p"
          className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto leading-[1.8] tracking-wide"
          scrollStart={50}
          scrollEnd={350}
          distance={300}
        >
          {area.description}
        </ScatterText>
      </div>
    </section>
  )
}
