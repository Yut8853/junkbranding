'use client'

import { useMemo, useRef, useState } from 'react'
import { ArrowRight, ArrowUpRight, Phone, MessageCircle } from 'lucide-react'
import { Footer } from '@/components/footer'
import { ScatterText } from '@/components/scatter-text'
import { ScatterBlock } from '@/components/scatter-block'
import { SectionReveal } from '@/components/text-reveal'
import { categories, works } from '@/content/works-page'
import { useDeferredRender } from '@/hooks/use-deferred-render'
import Link from 'next/link'

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

function WorksHeroSection() {
  return (
    <section className="relative min-h-[100svh] flex items-center justify-center overflow-x-clip overflow-y-visible">
      {/* Background giant text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.03]">
        <span className="type-display text-[42vw] whitespace-nowrap">
          WORKS
        </span>
      </div>

      {/* Marquee decoration */}
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

      {/* Scroll indicator */}
      <div 
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
      >
        <span className="type-label text-muted-foreground text-xs">Scroll to explore</span>
        <div className="w-px h-16 bg-gradient-to-b from-foreground/40 to-transparent animate-pulse" />
      </div>
    </section>
  )
}

function WorksSummarySection() {
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

function ImmersiveWorkCard({
  work,
  index,
}: {
  work: (typeof works)[0]
  index: number
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const formattedIndex = String(index + 1).padStart(2, '0')
  const isCurrentProject = work.title === 'JunkBranding'
  const projectActionLabel = isCurrentProject ? 'You are viewing it' : 'View Project'
  const visualCardClassName = `relative aspect-[4/3] rounded-3xl overflow-hidden glass-card rainbow-border block ${
    isCurrentProject ? 'cursor-default' : 'cursor-pointer'
  }`
  const visualCardContent = (
    <>
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-primary/5" />
      
      {/* Large initial letter */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="type-display text-[14rem] md:text-[18rem] text-foreground/[0.03] group-hover:text-foreground/[0.08] transition-colors duration-700">
          {work.title.charAt(0)}
        </span>
      </div>

      {/* Category badge */}
      <div className="absolute top-6 left-6 z-10">
        <ScatterText
          as="span"
          className="type-label px-4 py-2 text-xs bg-foreground text-background rounded-full"
          scrollStart={50}
          scrollEnd={350}
          distance={140}
        >
          {work.category}
        </ScatterText>
      </div>

      {/* Year badge */}
      <div className="absolute top-6 right-6 z-10">
        <ScatterText
          as="span"
          className="type-label px-4 py-2 text-xs bg-background/80 backdrop-blur-sm rounded-full rainbow-border"
          scrollStart={50}
          scrollEnd={350}
          distance={140}
        >
          {work.year}
        </ScatterText>
      </div>

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-background/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
        <span className="type-cta text-2xl md:text-3xl flex items-center gap-4 gradient-text">
          <span>{projectActionLabel}</span>
          {!isCurrentProject && <ArrowUpRight className="w-8 h-8" />}
        </span>
      </div>
    </>
  )

  return (
    <div
      ref={cardRef}
      className="group relative min-h-[80svh] flex items-center py-16 md:py-24"
    >
      {/* Giant index number background */}
      <SectionReveal delay={0.1} duration={0.8}>
        <span
          className="absolute left-0 md:left-8 lg:left-16 top-1/2 -translate-y-1/2 type-display text-[32vw] md:text-[24vw] text-foreground/[0.03] pointer-events-none select-none leading-none"
        >
          {formattedIndex}
        </span>
      </SectionReveal>

      <div className="container relative z-10 mx-auto px-6 md:px-12 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Visual side */}
          <SectionReveal delay={0.2} duration={1}>
            {isCurrentProject ? (
              <div className={visualCardClassName} aria-label="現在表示中のサイト">
                {visualCardContent}
              </div>
            ) : (
              <Link
                href={work.url}
                target="_blank"
                rel="noopener noreferrer"
                className={visualCardClassName}
              >
                {visualCardContent}
              </Link>
            )}
          </SectionReveal>

          {/* Content side */}
          <div className="lg:pl-8">
            <div className="mb-6 overflow-visible">
              <ScatterText
                as="span"
                className="type-readable-number text-5xl md:text-7xl gradient-text-animated"
                scrollStart={50}
                scrollEnd={400}
                distance={300}
              >
                {formattedIndex}
              </ScatterText>
            </div>

            <div className="mb-6 overflow-visible">
              <ScatterText
                as="h2"
                className="type-section-title text-3xl md:text-4xl lg:text-5xl"
                scrollStart={50}
                scrollEnd={400}
                distance={500}
                gradient
              >
                {work.title}
              </ScatterText>
            </div>

            <ScatterText
              as="p"
              className="type-body text-base md:text-lg text-muted-foreground mb-8 max-w-xl"
              scrollStart={50}
              scrollEnd={400}
              distance={300}
            >
              {work.description}
            </ScatterText>

            <SectionReveal delay={0.25}>
              <div className="mb-8 grid gap-3">
                {[
                  ['Role', work.role],
                  ['Scope', work.scope],
                  ['Outcome', work.outcome],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="grid gap-1 rounded-2xl border border-border/50 bg-card/35 p-4 md:grid-cols-[5rem_1fr] md:gap-4"
                  >
                    <ScatterText
                      as="span"
                      className="type-label text-xs text-muted-foreground"
                      scrollStart={50}
                      scrollEnd={350}
                      distance={160}
                    >
                      {label}
                    </ScatterText>
                    <ScatterText
                      as="span"
                      className="type-body-compact text-sm leading-relaxed text-foreground/80"
                      scrollStart={50}
                      scrollEnd={350}
                      distance={180}
                    >
                      {value}
                    </ScatterText>
                  </div>
                ))}
              </div>
            </SectionReveal>

            <SectionReveal delay={0.3}>
              <div className="mb-8">
                <ScatterText
                  as="p"
                  className="type-label mb-3 text-xs text-muted-foreground"
                  scrollStart={50}
                  scrollEnd={350}
                  distance={160}
                >
                  Highlights
                </ScatterText>
                <ul className="grid gap-2">
                  {work.highlights.map((highlight) => (
                    <li
                      key={highlight}
                      className="type-body-compact flex gap-3 text-sm leading-relaxed text-muted-foreground"
                    >
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      <ScatterText
                        as="span"
                        className="inline-block"
                        scrollStart={50}
                        scrollEnd={350}
                        distance={180}
                      >
                        {highlight}
                      </ScatterText>
                    </li>
                  ))}
                </ul>
              </div>
            </SectionReveal>

            {/* Tags */}
            <SectionReveal delay={0.35}>
              <div className="flex flex-wrap gap-3 mb-6">
                {work.tags.map((tag) => (
                  <ScatterText
                    as="span"
                    key={tag}
                    className="type-body-compact text-sm px-4 py-2 rounded-full border border-border bg-card/50 text-muted-foreground"
                    scrollStart={50}
                    scrollEnd={350}
                    distance={140}
                  >
                    {tag}
                  </ScatterText>
                ))}
              </div>
            </SectionReveal>

            {/* Stack */}
            <SectionReveal delay={0.45}>
              <div className="flex flex-wrap gap-3 mb-10">
                {work.stack?.map((tech) => (
                  <ScatterText
                    as="span"
                    key={tech}
                    className="type-body-compact text-sm px-4 py-2 rounded-full border border-primary/30 bg-primary/5 text-primary"
                    scrollStart={50}
                    scrollEnd={350}
                    distance={140}
                  >
                    {tech}
                  </ScatterText>
                ))}
              </div>
            </SectionReveal>

            <ScatterBlock
              className="cta-primary type-cta inline-flex items-center gap-4 rounded-full px-8 py-4 text-sm transition-all duration-300"
              scrollEnd={400}
              distance={400}
              seed={index * 10}
              href={isCurrentProject ? undefined : work.url}
            >
              <ScatterText
                as="span"
                className="inline-block"
                scrollStart={50}
                scrollEnd={350}
                distance={160}
              >
                {projectActionLabel}
              </ScatterText>
              {!isCurrentProject && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
            </ScatterBlock>
          </div>
        </div>
      </div>
    </div>
  )
}

function WorksFilterSection({
  selectedCategory,
  setSelectedCategory,
}: {
  selectedCategory: string
  setSelectedCategory: (category: string) => void
}) {
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

function WorksApproachSection() {
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

function WorksCtaSection() {
  return (
    <section className="relative min-h-[60svh] flex items-center justify-center py-24 md:py-32 lg:py-40 overflow-hidden">
      {/* Background text */}
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

export default function WorksPageClient() {
  const [selectedCategory, setSelectedCategory] = useState('すべて')
  const shouldRenderSections = useDeferredRender()

  const filteredWorks = useMemo(() => {
    if (selectedCategory === 'すべて') return works
    return works.filter((work) => work.category === selectedCategory)
  }, [selectedCategory])

  return (
    <>
      <WorksHeroSection />
      {shouldRenderSections && (
        <>
          <WorksSummarySection />

          <section className="relative glass-light">
            <WorksFilterSection
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />

            {filteredWorks.map((work, index) => (
              <ImmersiveWorkCard
                key={`${selectedCategory}-${work.id}`}
                work={work}
                index={index}
              />
            ))}

            {filteredWorks.length === 0 && (
              <div className="py-32 text-center">
                <p className="text-xl text-muted-foreground">
                  該当する実績がありません
                </p>
              </div>
            )}
          </section>

          <WorksApproachSection />
          <WorksCtaSection />
          <Footer />
        </>
      )}
    </>
  )
}
