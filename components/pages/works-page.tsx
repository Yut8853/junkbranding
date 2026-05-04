'use client'

import { useEffect, useRef, useState, useMemo } from 'react'
import { ArrowRight, ArrowUpRight, Phone, MessageCircle } from 'lucide-react'
import { Footer } from '@/components/footer'
import { ScatterText } from '@/components/scatter-text'
import { ScatterBlock } from '@/components/scatter-block'
import { SectionReveal } from '@/components/text-reveal'
import { categories, works } from '@/content/works-page'
import Link from 'next/link'
import { useIsMobile } from '@/hooks/use-mobile'

function WorksHeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [heroScatterProgress, setHeroScatterProgress] = useState(0)
  const isMobile = useIsMobile()

  useEffect(() => {
    if (!containerRef.current || isMobile) return

    let rafId: number | null = null
    let lastScrollProgress = -1

    const handleScroll = () => {
      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect) return

      const scrollProgress = Math.min(Math.max(-rect.top, 0) / 400, 1)
      if (Math.abs(scrollProgress - lastScrollProgress) < 0.01) return
      lastScrollProgress = scrollProgress
      setHeroScatterProgress(scrollProgress)
    }

    const handleScrollRaf = () => {
      if (rafId) return
      rafId = requestAnimationFrame(() => {
        rafId = null
        handleScroll()
      })
    }

    window.addEventListener('scroll', handleScrollRaf, { passive: true })
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScrollRaf)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [isMobile])

  return (
    <section
      ref={containerRef}
      className="relative min-h-[100svh] flex items-center justify-center overflow-hidden"
    >
      {/* Background giant text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.03]">
        <span className="type-display text-[50vw] whitespace-nowrap">
          WORKS
        </span>
      </div>

      {/* Marquee decoration */}
      <div className="absolute inset-0 flex flex-col justify-center pointer-events-none select-none overflow-hidden opacity-[0.04]">
        <div className="flex whitespace-nowrap animate-marquee-slow">
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={`marquee-1-${i}`} className="type-display text-[8vw] mx-8 marquee-stroke">
              WORKS
            </span>
          ))}
        </div>
        <div className="flex whitespace-nowrap animate-marquee-slow-reverse mt-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={`marquee-2-${i}`} className="type-display text-[8vw] mx-8 marquee-stroke">
              PORTFOLIO
            </span>
          ))}
        </div>
      </div>

      <div className="container relative z-10 mx-auto px-6 md:px-12 lg:px-16 text-center">
        <div className="overflow-visible">
          <ScatterText
            as="h1"
            className="type-display text-[12vw] md:text-[10vw] lg:text-[8vw] leading-[0.9] tracking-[-0.04em]"
            distance={900}
            gradient
            scatterProgress={heroScatterProgress}
            deferUntilActive
          >
            WORKS
          </ScatterText>
        </div>
        
        <div className="overflow-visible mt-12">
          <ScatterText
            as="p"
            className="type-body text-lg md:text-xl text-muted-foreground max-w-lg mx-auto"
            distance={400}
            scatterProgress={heroScatterProgress}
            deferUntilActive
          >
            クライアントと共に創り上げた、想いが詰まったプロジェクト
          </ScatterText>
        </div>
      </div>

      {/* Scroll indicator */}
      <div 
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
        style={{ opacity: 1 - heroScatterProgress }}
      >
        <span className="type-label text-muted-foreground text-xs">Scroll to explore</span>
        <div className="w-px h-16 bg-gradient-to-b from-foreground/40 to-transparent animate-pulse" />
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

  return (
    <div
      ref={cardRef}
      className="group relative min-h-[100svh] flex items-center py-20 md:py-32"
    >
      {/* Giant index number background */}
      <SectionReveal delay={0.1} duration={0.8}>
        <span
          className="absolute left-0 md:left-8 lg:left-16 top-1/2 -translate-y-1/2 type-display text-[40vw] md:text-[30vw] text-foreground/[0.03] pointer-events-none select-none leading-none"
        >
          {formattedIndex}
        </span>
      </SectionReveal>

      <div className="container relative z-10 mx-auto px-6 md:px-12 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Visual side */}
          <SectionReveal delay={0.2} duration={1}>
            <Link
              href={work.url}
              target="_blank"
              rel="noopener noreferrer"
              className="relative aspect-[4/3] rounded-3xl overflow-hidden glass-card rainbow-border cursor-pointer block"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-primary/5" />
              
              {/* Large initial letter */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="type-display text-[20rem] md:text-[25rem] text-foreground/[0.03] group-hover:text-foreground/[0.08] transition-colors duration-700">
                  {work.title.charAt(0)}
                </span>
              </div>

              {/* Category badge */}
              <div className="absolute top-6 left-6 z-10">
                <span className="type-label px-4 py-2 text-xs bg-foreground text-background rounded-full">
                  {work.category}
                </span>
              </div>

              {/* Year badge */}
              <div className="absolute top-6 right-6 z-10">
                <span className="type-label px-4 py-2 text-xs bg-background/80 backdrop-blur-sm rounded-full rainbow-border">
                  {work.year}
                </span>
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-background/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
                <span className="type-cta text-2xl md:text-3xl flex items-center gap-4 gradient-text">
                  View Project
                  <ArrowUpRight className="w-8 h-8" />
                </span>
              </div>
            </Link>
          </SectionReveal>

          {/* Content side */}
          <div className="lg:pl-8">
            <div className="mb-6 overflow-visible">
              <ScatterText
                as="span"
                className="type-display text-6xl md:text-8xl gradient-text-animated"
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
                className="type-section-title text-4xl md:text-5xl lg:text-6xl"
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
              className="type-body text-lg md:text-xl text-muted-foreground mb-8 max-w-xl"
              scrollStart={50}
              scrollEnd={400}
              distance={300}
            >
              {work.description}
            </ScatterText>

            {/* Tags */}
            <SectionReveal delay={0.3}>
              <div className="flex flex-wrap gap-3 mb-6">
                {work.tags.map((tag) => (
                  <span
                    key={tag}
                    className="type-body-compact text-sm px-4 py-2 rounded-full border border-border bg-card/50 text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </SectionReveal>

            {/* Stack */}
            <SectionReveal delay={0.4}>
              <div className="flex flex-wrap gap-3 mb-10">
                {work.stack?.map((tech) => (
                  <span
                    key={tech}
                    className="type-body-compact text-sm px-4 py-2 rounded-full border border-primary/30 bg-primary/5 text-primary"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </SectionReveal>

            <ScatterBlock
              className="cta-primary type-cta inline-flex items-center gap-4 rounded-full px-8 py-4 text-sm transition-all duration-300"
              scrollEnd={400}
              distance={400}
              seed={index * 10}
              href={work.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>View Project</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
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

function WorksCtaSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [ctaScatterProgress, setCtaScatterProgress] = useState(0)
  const isMobile = useIsMobile()

  useEffect(() => {
    if (!containerRef.current || isMobile) return

    let rafId: number | null = null

    const handleScroll = () => {
      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect) return

      const viewportHeight = window.innerHeight
      const elementCenter = rect.top + rect.height / 2
      const distanceFromCenter = elementCenter - viewportHeight / 2
      const normalizedDistance = distanceFromCenter / (viewportHeight / 2)
      
      // When element is below center, progress = 0 (assembled)
      // When element passes center and goes up, progress increases (scatters)
      const scrollProgress = Math.max(0, Math.min(1, -normalizedDistance * 0.5 + 0.5))
      setCtaScatterProgress(scrollProgress > 0.8 ? (scrollProgress - 0.8) * 5 : 0)
    }

    const handleScrollRaf = () => {
      if (rafId) return
      rafId = requestAnimationFrame(() => {
        rafId = null
        handleScroll()
      })
    }

    window.addEventListener('scroll', handleScrollRaf, { passive: true })
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScrollRaf)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [isMobile])

  return (
    <section
      ref={containerRef}
      className="relative min-h-[80svh] flex items-center justify-center py-32 md:py-40 lg:py-56 overflow-hidden"
    >
      {/* Background text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <span className="type-display text-[30vw] text-foreground/[0.02] whitespace-nowrap">
          CONTACT
        </span>
      </div>

      <div className="container relative z-10 mx-auto px-6 md:px-12 lg:px-16 text-center">
        <div className="overflow-visible mb-8">
          <ScatterText
            as="h2"
            className="type-section-title text-4xl sm:text-5xl md:text-6xl lg:text-7xl"
            distance={600}
            gradient
            scatterProgress={ctaScatterProgress}
            deferUntilActive
          >
            まずは、お話しませんか？
          </ScatterText>
        </div>

        <ScatterText
          as="p"
          className="type-body text-lg md:text-xl text-muted-foreground max-w-xl mx-auto mb-12"
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
              className="inline-block"
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

  const filteredWorks = useMemo(() => {
    if (selectedCategory === 'すべて') return works
    return works.filter((work) => work.category === selectedCategory)
  }, [selectedCategory])

  return (
    <>
      <WorksHeroSection />
      <WorksFilterSection
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      <section className="relative glass-light">
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

      <WorksCtaSection />
      <Footer />
    </>
  )
}
