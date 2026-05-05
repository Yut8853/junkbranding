'use client'

import { Footer } from '@/components/layout/footer'
import { ScatterBlock } from '@/components/motion/scatter-block'
import { ScatterText } from '@/components/motion/scatter-text'
import { HomeAscentSection } from '@/components/pages/home/home-ascent-section'
import { ServicesSectionV2 } from '@/components/sections/services-section-v2'
import { CTASectionV2 } from '@/components/sections/cta-section-v2'
import type {
  HomeAreaSectionProps,
  HomeDeferredSectionsProps,
  HomeWorksPreviewSectionProps,
} from '@/types/home-page'

function HomeWorksPreviewSection({
  worksPreview,
}: HomeWorksPreviewSectionProps) {
  return (
    <section className="py-32 md:py-40 lg:py-56 glass-light">
      <div className="container mx-auto px-6 md:px-12 lg:px-16">
        <div className="text-center mb-16 lg:mb-24">
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
              {worksPreview.eyebrow}
            </ScatterText>
          </div>
          <ScatterText
            as="h2"
            className="type-section-title text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-6 lg:mb-8"
            scrollStart={50}
            scrollEnd={350}
            distance={400}
            gradient
          >
            {worksPreview.title}
          </ScatterText>
          <ScatterText
            as="p"
            className="type-body text-base md:text-lg text-muted-foreground max-w-xl mx-auto"
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
            className="type-body text-base md:text-lg text-muted-foreground mb-8 lg:mb-10"
            scrollStart={50}
            scrollEnd={350}
            distance={300}
          >
            {worksPreview.note}
          </ScatterText>
          <ScatterBlock
            className="cta-primary type-cta inline-flex items-center gap-4 rounded-full px-8 py-4 text-sm transition-all duration-300"
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

function HomeAreaSection({ area }: HomeAreaSectionProps) {
  return (
    <section className="py-32 md:py-40 lg:py-48 border-y border-border/20 glass-card overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 lg:px-16 text-center">
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
            {area.eyebrow}
          </ScatterText>
        </div>
        <ScatterText
          as="h2"
          className="type-section-title text-2xl sm:text-3xl md:text-4xl mb-8 lg:mb-10"
          scrollStart={50}
          scrollEnd={350}
          distance={400}
        >
          {area.title}
        </ScatterText>
        <ScatterText
          as="p"
          className="type-hero-title text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-8 lg:mb-10"
          scrollStart={50}
          scrollEnd={350}
          distance={500}
          gradient
        >
          {area.area}
        </ScatterText>
        <ScatterText
          as="p"
          className="type-body text-base md:text-lg text-muted-foreground max-w-xl mx-auto"
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

export function HomeDeferredSections({
  worksPreview,
  area,
  inverted = false,
}: HomeDeferredSectionsProps) {
  if (inverted) {
    return (
      <>
        <HomeAscentSection label="FOOTER">
          <Footer />
        </HomeAscentSection>
        <HomeAscentSection label="CONTACT">
          <CTASectionV2 />
        </HomeAscentSection>
        <HomeAscentSection label="AREA">
          <HomeAreaSection area={area} />
        </HomeAscentSection>
        <HomeAscentSection label="WORKS">
          <HomeWorksPreviewSection worksPreview={worksPreview} />
        </HomeAscentSection>
        <HomeAscentSection label="SERVICES">
          <ServicesSectionV2 />
        </HomeAscentSection>
      </>
    )
  }

  return (
    <>
      <HomeAscentSection label="SERVICES">
        <ServicesSectionV2 />
      </HomeAscentSection>
      <HomeAscentSection label="WORKS">
        <HomeWorksPreviewSection worksPreview={worksPreview} />
      </HomeAscentSection>
      <HomeAscentSection label="AREA">
        <HomeAreaSection area={area} />
      </HomeAscentSection>
      <HomeAscentSection label="CONTACT">
        <CTASectionV2 />
      </HomeAscentSection>
      <HomeAscentSection label="FOOTER">
        <Footer />
      </HomeAscentSection>
    </>
  )
}
