'use client'

import Link from 'next/link'
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

// 制作実績からピックアップ（自社以外）
const featuredWorks = [
  {
    id: 2,
    title: 'TO PLACE',
    category: 'コーポレートサイト',
    description: '不動産会社のコーポレートサイト。信頼感と先進性を両立したデザインで、企業姿勢やサービスの強みが伝わるように設計。',
    tags: ['Web Design', 'Corporate'],
    url: 'https://to-place.co.jp/',
    year: '2024',
  },
  {
    id: 3,
    title: 'LUZ REAL',
    category: 'コーポレートサイト',
    description: '洗練されたビジュアルと使いやすさを追求したコーポレートサイト。ブランドの上質さを保ちながら、導線を設計。',
    tags: ['Web Design', 'UI/UX'],
    url: 'https://luz-real.com/',
    year: '2025',
  },
]

function HomeWorksPreviewSection({
  worksPreview,
}: HomeWorksPreviewSectionProps) {
  return (
    <section className="py-32 md:py-40 lg:py-56 glass-light relative overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 lg:px-16 relative z-10">
        {/* ヘッダー */}
        <div className="text-center mb-16 lg:mb-20">
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

        {/* 実績カード */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 mb-16 lg:mb-20">
          {featuredWorks.map((work, index) => (
            <Link
              key={work.id}
              href={work.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block"
            >
              <article className="relative p-8 md:p-10 lg:p-12 rounded-3xl border border-foreground/10 bg-background/50 backdrop-blur-sm transition-all duration-500 hover:border-foreground/20">
                {/* 年度バッジ */}
                <div className="absolute top-6 right-6 md:top-8 md:right-8">
                  <span className="type-mono text-xs text-muted-foreground/60">{work.year}</span>
                </div>

                {/* カテゴリ */}
                <ScatterText
                  as="span"
                  className="type-label text-xs text-primary/80 block mb-4"
                  scrollStart={50}
                  scrollEnd={350}
                  distance={160}
                >
                  {work.category}
                </ScatterText>

                {/* タイトル */}
                <ScatterText
                  as="h3"
                  className="type-eyebrow text-3xl md:text-4xl lg:text-5xl mb-4 transition-colors duration-300 group-hover:text-primary"
                  scrollStart={50}
                  scrollEnd={350}
                  distance={200 + index * 30}
                >
                  {work.title}
                </ScatterText>

                {/* 説明 */}
                <ScatterText
                  as="p"
                  className="type-body-compact text-sm md:text-base text-muted-foreground mb-6 line-clamp-2"
                  scrollStart={50}
                  scrollEnd={350}
                  distance={180}
                >
                  {work.description}
                </ScatterText>

                {/* タグ */}
                <div className="flex flex-wrap gap-2">
                  {work.tags.map((tag) => (
                    <span
                      key={tag}
                      className="type-body-compact text-xs px-3 py-1.5 rounded-full border border-foreground/10 text-muted-foreground transition-colors duration-300 group-hover:border-primary/30 group-hover:text-primary/80"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* ホバー時の矢印 */}
                <div className="absolute bottom-6 right-6 md:bottom-8 md:right-8 w-10 h-10 flex items-center justify-center rounded-full border border-foreground/10 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                  <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {/* CTAボタン */}
        <div className="text-center">
          <ScatterBlock
            className="cta-primary type-cta inline-flex items-center gap-3 rounded-full px-8 py-4 text-sm transition-all duration-300"
            scrollEnd={350}
            distance={400}
            seed={2}
            href={worksPreview.href}
          >
            {worksPreview.cta}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </ScatterBlock>
        </div>
      </div>
    </section>
  )
}

function HomeAreaSection({ area }: HomeAreaSectionProps) {
  return (
    <section className="py-32 md:py-40 lg:py-48 border-y border-border/20 glass-card overflow-hidden relative">
      {/* 背景マーキー */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <div className="flex whitespace-nowrap">
          <div
            className="flex"
            style={{
              animation: 'marquee-left 25s linear infinite',
            }}
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <span
                key={i}
                className="type-display font-bold text-[12rem] md:text-[18rem] lg:text-[24rem] mx-8 md:mx-12 select-none"
                style={{
                  WebkitTextStroke: '1px oklch(0.75 0.12 300 / 0.15)',
                  WebkitTextFillColor: 'transparent',
                  lineHeight: 1,
                }}
              >
                NATIONWIDE
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 md:px-12 lg:px-16 text-center relative z-10">
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
