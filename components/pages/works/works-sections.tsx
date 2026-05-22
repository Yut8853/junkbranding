'use client'

import Link from 'next/link'
import { ArrowRight, Phone, MessageCircle } from 'lucide-react'
import { ScatterBlock } from '@/components/motion/scatter-block'
import { ScatterText } from '@/components/motion/scatter-text'
import { SectionReveal } from '@/components/motion/text-reveal'
import { categories, works } from '@/content/works-page'
import { cn } from '@/lib/utils'
import type { CurrentProject, PortfolioWork, WorksFilterSectionProps } from '@/types/works-page'

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

type WorksCurrentProjectsSectionProps = {
  projects: CurrentProject[]
}

export function WorksCurrentProjectsSection({ projects }: WorksCurrentProjectsSectionProps) {
  if (projects.length === 0) return null

  return (
    <section className="relative mb-10 md:mb-12 lg:mb-14">
      <div className="mb-8 max-w-3xl">
        <SectionReveal>
          <p className="type-label mb-4 text-muted-foreground">Now Running</p>
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
            今、並行して動いているプロジェクト。
          </ScatterText>
        </div>
        <ScatterText
          as="p"
          className="type-body mt-5 max-w-2xl text-sm leading-7 text-muted-foreground md:text-base"
          scrollStart={50}
          scrollEnd={350}
          distance={220}
        >
          公開済みの実績とは別に、現在進行形で設計と実装を詰めている案件も掲載しています。今どの領域に取り組んでいるかを、そのまま見える形で共有します。
        </ScatterText>
      </div>

      <div className="grid gap-6">
        {projects.map((project, index) => (
          <SectionReveal key={project.id} delay={0.08 * (index + 1)} duration={0.8}>
            <article className="relative overflow-hidden rounded-[2rem] border border-border/40 bg-card/60 p-5 shadow-[0_24px_80px_rgba(15,23,42,0.12)] backdrop-blur-md md:p-7 lg:p-8">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.16),transparent_32%),linear-gradient(135deg,rgba(255,188,95,0.12),rgba(255,255,255,0.02)_42%,rgba(83,208,255,0.1))]" />

              <div className="relative z-10">
                <div className="mb-8 flex flex-col gap-5 border-b border-border/40 pb-6 lg:flex-row lg:items-end lg:justify-between">
                  <div>
                    <ScatterText
                      as="p"
                      className="type-label mb-3 text-[11px] uppercase tracking-[0.24em] text-muted-foreground"
                      scrollStart={50}
                      scrollEnd={320}
                      distance={160}
                    >
                      {project.category}
                    </ScatterText>
                    <ScatterText
                      as="h3"
                      className="type-section-title text-3xl leading-tight md:text-[2.8rem]"
                      scrollStart={50}
                      scrollEnd={400}
                      distance={360}
                      gradient
                    >
                      {project.title}
                    </ScatterText>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <span className="type-label rounded-full border border-border/50 bg-background/60 px-4 py-2 text-[10px] uppercase tracking-[0.22em] text-muted-foreground backdrop-blur-md">
                      Current Project
                    </span>
                    <span className="type-label rounded-full bg-foreground px-4 py-2 text-[10px] uppercase tracking-[0.22em] text-background shadow-[0_8px_24px_rgba(0,0,0,0.14)]">
                      {project.status}
                    </span>
                  </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)] lg:gap-8 xl:gap-10">
                  <div className="space-y-6">
                    <div className="rounded-[1.7rem] border border-white/20 bg-background/45 p-6 md:p-7">
                      <ScatterText
                        as="p"
                        className="type-body text-sm leading-7 text-muted-foreground md:text-base"
                        scrollStart={50}
                        scrollEnd={360}
                        distance={240}
                      >
                        {project.description}
                      </ScatterText>
                    </div>

                    <div className="grid gap-3 md:grid-cols-2">
                      {[
                        ['Target User', project.targetUser],
                        ['Current Focus', project.focus],
                        ['Entry Flow', project.entryFlow],
                        ['Principle', project.principle],
                      ].map(([label, value]) => (
                        <div
                          key={label}
                          className="rounded-[1.35rem] border border-border/45 bg-background/45 p-4"
                        >
                          <ScatterText
                            as="span"
                            className="type-label mb-2 block text-[10px] uppercase tracking-[0.2em] text-muted-foreground"
                            scrollStart={50}
                            scrollEnd={320}
                            distance={140}
                          >
                            {label}
                          </ScatterText>
                          <ScatterText
                            as="span"
                            className="type-body-compact text-sm leading-6 text-foreground/80"
                            scrollStart={50}
                            scrollEnd={320}
                            distance={160}
                          >
                            {value}
                          </ScatterText>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="rounded-[1.7rem] border border-primary/20 bg-primary/6 p-5 md:p-6">
                      <ScatterText
                        as="p"
                        className="type-label mb-3 text-[10px] uppercase tracking-[0.2em] text-muted-foreground"
                        scrollStart={50}
                        scrollEnd={320}
                        distance={140}
                      >
                        Display Direction
                      </ScatterText>
                      <ScatterText
                        as="p"
                        className="type-body-compact text-sm leading-7 text-foreground/80"
                        scrollStart={50}
                        scrollEnd={320}
                        distance={160}
                      >
                        {project.displayPolicy}
                      </ScatterText>
                    </div>

                    <div className="rounded-[1.7rem] border border-border/45 bg-background/40 p-5 md:p-6">
                      <ScatterText
                        as="p"
                        className="type-label mb-3 text-[10px] uppercase tracking-[0.2em] text-muted-foreground"
                        scrollStart={50}
                        scrollEnd={320}
                        distance={140}
                      >
                        Updated
                      </ScatterText>
                      <ScatterText
                        as="p"
                        className="type-body-compact text-sm leading-7 text-foreground/80"
                        scrollStart={50}
                        scrollEnd={320}
                        distance={160}
                      >
                        {project.updatedAt}
                      </ScatterText>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </SectionReveal>
        ))}
      </div>
    </section>
  )
}

export function WorksFilterSection({
  selectedCategory,
  onSelectCategory,
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
                onClick={() => onSelectCategory(category)}
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

type WorksOwnedShowcaseSectionProps = {
  works: PortfolioWork[]
}

export function WorksOwnedShowcaseSection({ works }: WorksOwnedShowcaseSectionProps) {
  if (works.length === 0) return null

  return (
    <section className="relative mb-16 md:mb-20 lg:mb-24">
      <div className="mb-10 max-w-3xl">
        <SectionReveal>
          <p className="type-label mb-4 text-muted-foreground">Owned Projects</p>
        </SectionReveal>
        <div className="overflow-visible">
          <ScatterText
            as="h2"
            className="type-section-title whitespace-pre-line text-3xl md:text-5xl"
            scrollStart={50}
            scrollEnd={350}
            distance={360}
            gradient
          >
            {'クライアントワークとは別に、\n3つのプロジェクトを\n動かしています。'}
          </ScatterText>
        </div>
        <ScatterText
          as="p"
          className="type-body mt-5 max-w-2xl text-sm leading-7 text-muted-foreground md:text-base"
          scrollStart={50}
          scrollEnd={350}
          distance={220}
        >
          目的は、表現と実装の限界を常に超えておくこと。JunkBranding、LAB、PIZZA。表現・設計・実装を継続的にアップデートする、3つの完全自社検証プロジェクトです。
        </ScatterText>
      </div>

      <div className="relative">
        {works.map((work, index) => (
          <div
            key={work.id}
            className={cn(
              'sticky pb-8',
              index > 0 && '-mt-[10svh] md:-mt-[8svh] lg:-mt-[6svh]',
              index === 0 && 'top-24',
              index === 1 && 'top-48',
              index >= 2 && 'top-72'
            )}
            style={{ zIndex: index + 1 }}
          >
            <OwnedWorkShowcaseCard work={work} index={index} />
          </div>
        ))}
      </div>
    </section>
  )
}

type OwnedWorkShowcaseCardProps = {
  work: PortfolioWork
  index: number
}

function OwnedWorkShowcaseCard({ work, index }: OwnedWorkShowcaseCardProps) {
  const accentClassNames = [
    'from-primary/20 via-background/92 to-background/98',
    'from-amber-400/18 via-background/92 to-background/98',
    'from-cyan-400/18 via-background/92 to-background/98',
  ]

  return (
    <SectionReveal delay={0.08 * (index + 1)} duration={0.8}>
      <article
        className="relative overflow-hidden rounded-[2rem] border border-border/40 bg-card/70 p-5 shadow-[0_30px_120px_rgba(15,23,42,0.16)] backdrop-blur-md md:p-7 lg:p-8"
        style={{
          transform: `scale(${1 - index * 0.025})`,
          transformOrigin: 'top center',
        }}
      >
        <div
          className={cn(
            'absolute inset-0 bg-gradient-to-br opacity-90',
            accentClassNames[index] ?? accentClassNames[0]
          )}
        />
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-white/10 to-transparent" />

        <div className="relative z-10">
          <div className="mb-8 flex flex-col gap-5 border-b border-border/40 pb-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <ScatterText
                as="p"
                className="type-label mb-3 text-[11px] uppercase tracking-[0.24em] text-muted-foreground"
                scrollStart={50}
                scrollEnd={320}
                distance={160}
              >
                {work.category}
              </ScatterText>
              <ScatterText
                as="h3"
                className="type-section-title text-3xl leading-tight md:text-[2.8rem]"
                scrollStart={50}
                scrollEnd={400}
                distance={360}
                gradient
              >
                {work.title}
              </ScatterText>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span className="type-label rounded-full border border-border/50 bg-background/60 px-4 py-2 text-[10px] uppercase tracking-[0.22em] text-muted-foreground backdrop-blur-md">
                Owned Project
              </span>
              <span className="type-label rounded-full bg-foreground px-4 py-2 text-[10px] uppercase tracking-[0.22em] text-background shadow-[0_8px_24px_rgba(0,0,0,0.14)]">
                {work.year}
              </span>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)] lg:gap-8 xl:gap-10">
            <div className="space-y-6">
              <div className="relative overflow-hidden rounded-[1.7rem] border border-white/20 bg-background/45 p-6 md:p-7">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.2),transparent_40%)]" />
                <div className="relative z-10">
                  <ScatterText
                    as="p"
                    className="type-body text-sm leading-7 text-muted-foreground md:text-base"
                    scrollStart={50}
                    scrollEnd={360}
                    distance={240}
                  >
                    {work.description}
                  </ScatterText>

                  <div className="mt-6 flex flex-wrap gap-2.5">
                    {work.tags.map((tag) => (
                      <ScatterText
                        as="span"
                        key={tag}
                        className="type-body-compact rounded-full border border-border/60 bg-card/70 px-3.5 py-2 text-xs text-muted-foreground"
                        scrollStart={50}
                        scrollEnd={320}
                        distance={130}
                      >
                        {tag}
                      </ScatterText>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                {[
                  ['Role', work.role],
                  ['Scope', work.scope],
                  ['Outcome', work.outcome],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-[1.35rem] border border-border/45 bg-background/45 p-4"
                  >
                    <ScatterText
                      as="span"
                      className="type-label mb-2 block text-[10px] uppercase tracking-[0.2em] text-muted-foreground"
                      scrollStart={50}
                      scrollEnd={320}
                      distance={140}
                    >
                      {label}
                    </ScatterText>
                    <ScatterText
                      as="span"
                      className="type-body-compact text-sm leading-6 text-foreground/80"
                      scrollStart={50}
                      scrollEnd={320}
                      distance={160}
                    >
                      {value}
                    </ScatterText>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-[1.7rem] border border-border/45 bg-background/40 p-5 md:p-6">
                <ScatterText
                  as="p"
                  className="type-label mb-3 text-[10px] uppercase tracking-[0.2em] text-muted-foreground"
                  scrollStart={50}
                  scrollEnd={320}
                  distance={140}
                >
                  Highlights
                </ScatterText>
                <ul className="grid gap-3">
                  {work.highlights.map((highlight) => (
                    <li
                      key={highlight}
                      className="type-body-compact flex items-start gap-3 text-sm leading-6 text-muted-foreground"
                    >
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      <ScatterText
                        as="span"
                        className="inline-block"
                        scrollStart={50}
                        scrollEnd={320}
                        distance={160}
                      >
                        {highlight}
                      </ScatterText>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-[1.7rem] border border-primary/20 bg-primary/6 p-5 md:p-6">
                <ScatterText
                  as="p"
                  className="type-label mb-3 text-[10px] uppercase tracking-[0.2em] text-muted-foreground"
                  scrollStart={50}
                  scrollEnd={320}
                  distance={140}
                >
                  Stack
                </ScatterText>
                <div className="mb-6 flex flex-wrap gap-2.5">
                  {work.stack.map((tech) => (
                    <ScatterText
                      as="span"
                      key={tech}
                      className="type-body-compact rounded-full border border-primary/25 bg-background/70 px-3.5 py-2 text-xs text-primary"
                      scrollStart={50}
                      scrollEnd={320}
                      distance={130}
                    >
                      {tech}
                    </ScatterText>
                  ))}
                </div>

                <Link
                  href={work.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cta-primary type-cta inline-flex items-center gap-3 rounded-full px-6 py-3 text-sm transition-all duration-300"
                >
                  <span>View Project</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </article>
    </SectionReveal>
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
