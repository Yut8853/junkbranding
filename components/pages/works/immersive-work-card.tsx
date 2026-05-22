'use client'

import Link from 'next/link'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { ScatterBlock } from '@/components/motion/scatter-block'
import { ScatterText } from '@/components/motion/scatter-text'
import { SectionReveal } from '@/components/motion/text-reveal'
import type { ImmersiveWorkCardProps } from '@/types/works-page'

export function ImmersiveWorkCard({ work, index }: ImmersiveWorkCardProps) {
  const formattedIndex = String(index + 1).padStart(2, '0')
  const isCurrentProject = work.title === 'JunkBranding'
  const projectActionLabel = isCurrentProject ? 'You are viewing it' : 'View Project'
  const visualCardClassName = `relative aspect-[4/3] overflow-hidden rounded-[2rem] border border-white/20 bg-card/55 block ${
    isCurrentProject ? 'cursor-default' : 'cursor-pointer'
  }`
  const visualCardContent = (
    <>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.22),transparent_38%),linear-gradient(135deg,oklch(0.7_0.18_300_/_0.28),rgba(255,255,255,0.03)_45%,oklch(0.75_0.12_330_/_0.28))]" />
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/15 to-transparent" />

      <div className="absolute inset-0 flex items-center justify-center">
        <span className="type-display text-[9rem] md:text-[11rem] text-foreground/[0.05] transition-all duration-700 group-hover:scale-110 group-hover:text-foreground/[0.09]">
          {work.title.charAt(0)}
        </span>
      </div>

      <div className="absolute left-5 top-5 z-10">
        <ScatterText
          as="span"
          className="type-label rounded-full bg-foreground px-4 py-2 text-[10px] text-background shadow-[0_8px_24px_rgba(0,0,0,0.14)]"
          scrollStart={50}
          scrollEnd={350}
          distance={140}
        >
          {work.category}
        </ScatterText>
      </div>

      <div className="absolute right-5 top-5 z-10">
        <ScatterText
          as="span"
          className="type-label rounded-full border border-white/25 bg-background/75 px-4 py-2 text-[10px] backdrop-blur-md"
          scrollStart={50}
          scrollEnd={350}
          distance={140}
        >
          {work.year}
        </ScatterText>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-background/90 via-background/35 to-transparent" />

      <div className="absolute inset-0 flex items-center justify-center bg-background/82 opacity-0 transition-all duration-500 group-hover:opacity-100">
        <span className="type-cta flex items-center gap-4 text-xl md:text-2xl gradient-text">
          <span>{projectActionLabel}</span>
          {!isCurrentProject && <ArrowUpRight className="w-8 h-8" />}
        </span>
      </div>
    </>
  )

  return (
    <SectionReveal delay={0.08 * (index + 1)} duration={0.8}>
      <article className="group relative flex h-full flex-col overflow-hidden rounded-[2rem] border border-border/40 bg-card/35 p-5 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 hover:border-primary/30 hover:bg-card/55 hover:shadow-[0_30px_100px_rgba(15,23,42,0.14)] md:p-6">
        <div className="pointer-events-none absolute right-5 top-4 text-right">
          <ScatterText
            as="span"
            className="type-readable-number text-5xl text-foreground/[0.08] md:text-6xl"
            scrollStart={50}
            scrollEnd={320}
            distance={220}
          >
            {formattedIndex}
          </ScatterText>
        </div>

        <SectionReveal delay={0.12} duration={1}>
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

        <div className="mt-6 flex h-full flex-col">
          <div className="mb-5 flex items-start justify-between gap-4 pr-14">
            <div>
              <ScatterText
                as="p"
                className="type-label mb-2 text-[11px] uppercase tracking-[0.24em] text-muted-foreground"
                scrollStart={50}
                scrollEnd={320}
                distance={160}
              >
                {work.category}
              </ScatterText>
              <ScatterText
                as="h2"
                className="type-section-title text-2xl md:text-[2rem] leading-tight"
                scrollStart={50}
                scrollEnd={400}
                distance={360}
                gradient
              >
                {work.title}
              </ScatterText>
            </div>
          </div>

          <ScatterText
            as="p"
            className="type-body mb-6 text-sm leading-7 text-muted-foreground md:text-base"
            scrollStart={50}
            scrollEnd={360}
            distance={240}
          >
            {work.description}
          </ScatterText>

          <SectionReveal delay={0.2}>
            <div className="mb-6 grid gap-3 sm:grid-cols-2">
              {[
                ['Role', work.role],
                ['Scope', work.scope],
                ['Outcome', work.outcome],
              ].map(([label, value], detailIndex) => (
                <div
                  key={label}
                  className={`rounded-[1.35rem] border border-border/45 bg-background/45 p-4 ${detailIndex === 2 ? 'sm:col-span-2' : ''}`}
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
          </SectionReveal>

          <SectionReveal delay={0.24}>
            <div className="mb-6 rounded-[1.35rem] border border-border/45 bg-background/35 p-4 md:p-5">
              <ScatterText
                as="p"
                className="type-label mb-3 text-[10px] uppercase tracking-[0.2em] text-muted-foreground"
                scrollStart={50}
                scrollEnd={320}
                distance={140}
              >
                Highlights
              </ScatterText>
              <ul className="grid gap-2.5">
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
          </SectionReveal>

          <SectionReveal delay={0.28}>
            <div className="mb-4 flex flex-wrap gap-2.5">
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
          </SectionReveal>

          <SectionReveal delay={0.32}>
            <div className="mb-8 flex flex-wrap gap-2.5">
              {work.stack?.map((tech) => (
                <ScatterText
                  as="span"
                  key={tech}
                  className="type-body-compact rounded-full border border-primary/25 bg-primary/8 px-3.5 py-2 text-xs text-primary"
                  scrollStart={50}
                  scrollEnd={320}
                  distance={130}
                >
                  {tech}
                </ScatterText>
              ))}
            </div>
          </SectionReveal>

          <div className="mt-auto flex items-center justify-between gap-4 border-t border-border/40 pt-5">
            <ScatterText
              as="span"
              className="type-label text-[10px] uppercase tracking-[0.24em] text-muted-foreground"
              scrollStart={50}
              scrollEnd={320}
              distance={140}
            >
              {isCurrentProject ? 'Current Project' : 'Open Case Study'}
            </ScatterText>

            <ScatterBlock
              className="cta-primary type-cta inline-flex items-center gap-3 rounded-full px-6 py-3 text-sm transition-all duration-300"
              scrollEnd={400}
              distance={400}
              seed={index * 10}
              href={isCurrentProject ? undefined : work.url}
            >
              <ScatterText
                as="span"
                className="inline-block"
                scrollStart={50}
                scrollEnd={320}
                distance={140}
              >
                {projectActionLabel}
              </ScatterText>
              {!isCurrentProject && (
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              )}
            </ScatterBlock>
          </div>
        </div>
      </article>
    </SectionReveal>
  )
}
