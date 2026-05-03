'use client'

import dynamic from 'next/dynamic'
import { Footer } from '@/components/footer'
import { ScatterBlock } from '@/components/scatter-block'
import { ScatterText } from '@/components/scatter-text'
import type {
  HomeAreaSectionProps,
  HomeWorksPreviewSectionProps,
} from '@/types/home-page'

const ServicesSectionV2 = dynamic(
  () => import('@/components/services-section-v2').then((mod) => mod.ServicesSectionV2),
  { ssr: false }
)

const CTASectionV2 = dynamic(
  () => import('@/components/cta-section-v2').then((mod) => mod.CTASectionV2),
  { ssr: false }
)

type HomeDeferredSectionsProps = HomeWorksPreviewSectionProps & HomeAreaSectionProps

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

function HomeAreaSection({ area }: HomeAreaSectionProps) {
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

export function HomeDeferredSections({
  worksPreview,
  area,
}: HomeDeferredSectionsProps) {
  return (
    <>
      <ServicesSectionV2 />
      <HomeWorksPreviewSection worksPreview={worksPreview} />
      <HomeAreaSection area={area} />
      <CTASectionV2 />
      <Footer />
    </>
  )
}
