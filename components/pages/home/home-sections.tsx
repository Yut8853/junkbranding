'use client'

import { SectionReveal } from '@/components/motion/text-reveal'
import { ScatterBlock } from '@/components/motion/scatter-block'
import { ScatterText } from '@/components/motion/scatter-text'
import { HeroSectionV2 } from '@/components/sections/hero-section-v2'
import { MarqueeSectionV2 } from '@/components/sections/marquee-section-v2'
import { useLazyVideo } from '@/components/pages/home/use-lazy-video'
import type { HomeAboutPreviewSectionProps } from '@/types/home-page'

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
                className="type-eyebrow text-[clamp(3rem,10vw,7rem)] text-foreground/45 block"
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
                className="type-section-title text-2xl sm:text-3xl md:text-4xl lg:text-5xl"
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
              className="type-body text-base md:text-lg text-muted-foreground mb-10 lg:mb-12 max-w-lg"
              scrollStart={50}
              scrollEnd={350}
              distance={300}
            >
              {aboutPreview.description}
            </ScatterText>
            <ScatterBlock
              className="cta-primary type-cta inline-flex items-center gap-4 rounded-full px-8 py-4 text-sm transition-all duration-300"
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
