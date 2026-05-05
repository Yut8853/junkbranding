'use client'

import { ArrowRight, Phone, MessageCircle } from 'lucide-react'
import { ScatterBlock } from '@/components/motion/scatter-block'
import { ScatterText } from '@/components/motion/scatter-text'
import { SectionReveal } from '@/components/motion/text-reveal'
import { categories, works } from '@/content/works-page'
import type { WorksFilterSectionProps } from '@/types/works-page'

const worksSummary = [
  { label: 'Projects', value: `${works.length}+` },
  { label: 'Period', value: '2024-2026' },
  { label: 'Scope', value: 'Design / Dev / Branding' },
  { label: 'Style', value: 'Corporate / Portfolio' },
]

const worksApproach = [
  {
    title: 'Context',
    description: '事業内容、ターゲット、競合、既存課題を整理し、サイトで伝えるべき優先順位を決めます。',
  },
  {
    title: 'Experience',
    description: 'ファーストビュー、導線、余白、モーションを含めて、ブランドらしい体験として設計します。',
  },
  {
    title: 'Delivery',
    description: 'スマートフォン表示、速度、SEO、問い合わせ導線まで確認し、公開後に活きる形で仕上げます。',
  },
]

export function WorksHeroSection() {
  return (
    <section className="relative min-h-[100svh] flex items-center justify-center overflow-x-clip overflow-y-visible">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.03]">
        <span className="type-display text-[42vw] whitespace-nowrap">
          WORKS
        </span>
      </div>

      <div className="pointer-events-none absolute inset-y-0 left-[calc(50%-50vw)] right-[calc(50%-50vw)] flex select-none flex-col justify-center overflow-hidden opacity-[0.04]">
        <div className="flex min-w-max whitespace-nowrap animate-marquee-slow">
          {Array.from({ length: 12 }).map((_, i) => (
            <span key={`marquee-1-${i}`} className="type-display mx-8 text-[6vw] marquee-stroke">
              WORKS
            </span>
          ))}
        </div>
        <div className="mt-4 flex min-w-max whitespace-nowrap animate-marquee-slow-reverse">
          {Array.from({ length: 12 }).map((_, i) => (
            <span key={`marquee-2-${i}`} className="type-display mx-8 text-[6vw] marquee-stroke">
              PORTFOLIO
            </span>
          ))}
        </div>
      </div>

      <div className="container relative z-10 mx-auto px-6 md:px-12 lg:px-16 text-center">
        <div className="overflow-visible">
          <ScatterText
            as="h1"
            className="type-display text-[10vw] md:text-[8vw] lg:text-[6.5vw] leading-[0.9] tracking-[-0.04em]"
            distance={900}
            gradient
          >
            WORKS
          </ScatterText>
        </div>

        <div className="overflow-visible mt-8">
          <ScatterText
            as="p"
            className="type-body text-base md:text-lg text-muted-foreground max-w-lg mx-auto"
            distance={400}
          >
            クライアントと共に創り上げた、想いが詰まったプロジェクト
          </ScatterText>
        </div>
      </div>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4">
        <span className="type-label text-muted-foreground text-xs">Scroll to explore</span>
        <div className="w-px h-16 bg-gradient-to-b from-foreground/40 to-transparent animate-pulse" />
      </div>
    </section>
  )
}

export function WorksSummarySection() {
  return (
    <section className="relative glass-light border-y border-border/20 py-16 md:py-20">
      <div className="container mx-auto px-6 md:px-12 lg:px-16">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {worksSummary.map((item, index) => (
            <SectionReveal key={item.label} delay={index * 0.08}>
              <div className="rainbow-border rounded-3xl bg-card/45 p-5 md:p-6">
                <p className="type-label mb-3 text-xs text-muted-foreground">
                  {item.label}
                </p>
                <p className="type-body-compact text-lg md:text-xl text-foreground">
                  {item.value}
                </p>
              </div>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export function WorksFilterSection({
  selectedCategory,
  setSelectedCategory,
}: WorksFilterSectionProps) {
  return (
    <section className="sticky top-20 z-30 py-4 glass-light border-y border-border/20">
      <div className="container mx-auto px-6 md:px-12 lg:px-16">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
          <span className="type-label text-muted-foreground">Filter</span>
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                aria-pressed={selectedCategory === category}
                className={`type-label px-5 py-2.5 text-xs rounded-full transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-foreground text-background'
                    : 'bg-card rainbow-border hover:bg-card/80'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export function WorksApproachSection() {
  return (
    <section className="relative py-20 md:py-28">
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 type-display text-[18vw] text-foreground/[0.02] whitespace-nowrap">
          PROCESS
        </span>
      </div>

      <div className="container relative z-10 mx-auto px-6 md:px-12 lg:px-16">
        <div className="mb-12 max-w-3xl">
          <SectionReveal>
            <p className="type-label mb-4 text-muted-foreground">
              How We Build
            </p>
          </SectionReveal>
          <div className="overflow-visible">
            <ScatterText
              as="h2"
              className="type-section-title text-3xl md:text-5xl"
              scrollStart={50}
              scrollEnd={350}
              distance={360}
              gradient
            >
              見た目だけで終わらない、事業に残る制作を。
            </ScatterText>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {worksApproach.map((item, index) => (
            <SectionReveal key={item.title} delay={index * 0.1}>
              <div className="h-full rounded-3xl border border-border/50 bg-card/35 p-6 md:p-8 rainbow-border">
                <ScatterText
                  as="p"
                  className="type-display mb-6 text-5xl text-foreground/10"
                  scrollStart={50}
                  scrollEnd={350}
                  distance={180}
                >
                  {String(index + 1).padStart(2, '0')}
                </ScatterText>
                <ScatterText
                  as="h3"
                  className="type-section-title mb-4 text-2xl"
                  scrollStart={50}
                  scrollEnd={350}
                  distance={220}
                >
                  {item.title}
                </ScatterText>
                <ScatterText
                  as="p"
                  className="type-body-compact leading-relaxed text-muted-foreground"
                  scrollStart={50}
                  scrollEnd={350}
                  distance={180}
                >
                  {item.description}
                </ScatterText>
              </div>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export function WorksCtaSection() {
  return (
    <section className="relative min-h-[60svh] flex items-center justify-center py-24 md:py-32 lg:py-40 overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <span className="type-display text-[24vw] text-foreground/[0.02] whitespace-nowrap">
          CONTACT
        </span>
      </div>

      <div className="container relative z-10 mx-auto px-6 md:px-12 lg:px-16 text-center">
        <div className="overflow-visible mb-8">
          <ScatterText
            as="h2"
            className="type-section-title text-3xl sm:text-4xl md:text-5xl lg:text-6xl"
            distance={600}
            gradient
          >
            まずは、お話しませんか？
          </ScatterText>
        </div>

        <ScatterText
          as="p"
          className="type-body text-base md:text-lg text-muted-foreground max-w-xl mx-auto mb-10"
          scrollStart={50}
          scrollEnd={350}
          distance={300}
        >
          「こんなこと頼めるのかな？」という段階でも大丈夫。お気軽にご連絡ください。
        </ScatterText>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <ScatterBlock
            className="cta-primary type-cta group w-full rounded-full px-8 py-4 text-sm transition-all duration-300 sm:w-auto"
            scrollEnd={350}
            distance={400}
            seed={20}
            href="/contact"
          >
            <span className="flex items-center justify-center gap-4">
              <MessageCircle size={18} />
              <ScatterText
                as="span"
                className="inline-block"
                scrollStart={50}
                scrollEnd={350}
                distance={180}
              >
                もっと実績を見せてもらう
              </ScatterText>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </ScatterBlock>

          <ScatterBlock
            className="cta-secondary type-cta flex w-full items-center justify-center gap-3 rounded-full px-8 py-4 text-sm transition-all duration-300 sm:w-auto"
            scrollEnd={350}
            distance={400}
            seed={21}
            href="tel:08091550426"
          >
            <Phone size={18} />
            <ScatterText
              as="span"
              className="type-readable-number inline-block"
              scrollStart={50}
              scrollEnd={350}
              distance={180}
            >
              電話で相談する
            </ScatterText>
          </ScatterBlock>
        </div>
      </div>
    </section>
  )
}
