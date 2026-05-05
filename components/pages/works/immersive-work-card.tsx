'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { ScatterBlock } from '@/components/motion/scatter-block'
import { ScatterText } from '@/components/motion/scatter-text'
import { SectionReveal } from '@/components/motion/text-reveal'
import type { ImmersiveWorkCardProps } from '@/types/works-page'

export function ImmersiveWorkCard({ work, index }: ImmersiveWorkCardProps) {
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

      <div className="absolute inset-0 flex items-center justify-center">
        <span className="type-display text-[14rem] md:text-[18rem] text-foreground/[0.03] group-hover:text-foreground/[0.08] transition-colors duration-700">
          {work.title.charAt(0)}
        </span>
      </div>

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
      <SectionReveal delay={0.1} duration={0.8}>
        <span
          className="absolute left-0 md:left-8 lg:left-16 top-1/2 -translate-y-1/2 type-display text-[32vw] md:text-[24vw] text-foreground/[0.03] pointer-events-none select-none leading-none"
        >
          {formattedIndex}
        </span>
      </SectionReveal>

      <div className="container relative z-10 mx-auto px-6 md:px-12 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
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
