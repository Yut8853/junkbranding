'use client'

import { useRef, useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Phone, Mail } from 'lucide-react'
import { HeroTitle } from '@/components/hero-title'
import { RevealSection } from '@/components/reveal-section'
import { MagneticButton } from '@/components/magnetic-button'
import { CircleButton } from '@/components/circle-button'
import { Footer } from '@/components/footer'

// Service data
const services = [
  {
    num: '01',
    title: 'Web Design',
    titleJa: 'Webデザイン',
    description: 'ユーザー体験を最優先に、ブランドの世界観を表現するWebサイトをデザインします。',
  },
  {
    num: '02',
    title: 'Branding',
    titleJa: 'ブランディング',
    description: 'ロゴ、カラー、トーン&マナーなど、ブランドの核となるアイデンティティを構築します。',
  },
  {
    num: '03',
    title: 'Development',
    titleJa: '開発・実装',
    description: '高速で安全、そして保守性の高いWebサイトを、最新技術で実装します。',
  },
  {
    num: '04',
    title: 'Consulting',
    titleJa: 'コンサルティング',
    description: 'Web戦略の立案から運用まで、ビジネス成長に貢献する提案を行います。',
  },
]

// Marquee texts
const marqueeTexts = ['Brand Strategy', 'Web Design', 'Development', 'UI/UX', 'Logo Design', 'Creative Direction']

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 md:px-12 py-20 md:py-32">
          <div className="max-w-5xl">
            <RevealSection delay={0.2} direction="blur" duration={1.8}>
              <p className="text-xs sm:text-sm uppercase tracking-[0.2em] sm:tracking-[0.3em] text-muted-foreground mb-6 sm:mb-8">
                Branding & Web Production
              </p>
            </RevealSection>

            <HeroTitle />

            <RevealSection delay={0.8} direction="blur" duration={1.5}>
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mt-8 sm:mt-10 leading-relaxed text-balance">
                茨城・東京・千葉を中心に活動する、2人だけの小さなブランディング&Web制作スタジオ。大手にはできない、丁寧なものづくりを。
              </p>
            </RevealSection>

            <RevealSection delay={1.1} direction="scale" duration={1.2} className="flex flex-wrap items-center gap-4 sm:gap-6 mt-10 sm:mt-12">
              <MagneticButton
                href="/contact"
                className="group px-6 sm:px-8 py-3.5 sm:py-4 bg-foreground text-background rounded-full font-medium hover:bg-accent transition-all duration-300"
                data-cursor="Contact"
              >
                <span className="flex items-center gap-3">
                  まずは相談する
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </MagneticButton>
              
              <MagneticButton
                href="/about"
                className="group px-6 sm:px-8 py-3.5 sm:py-4 bg-foreground text-background rounded-full font-medium hover:bg-accent transition-all duration-300"
                data-cursor="About"
              >
                <span className="flex items-center gap-3">
                  私たちについて
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </MagneticButton>
            </RevealSection>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-4">
          <span className="text-xs uppercase tracking-widest text-muted-foreground rotate-90 origin-center translate-y-8">
            Scroll
          </span>
          <div className="w-[1px] h-16 bg-gradient-to-b from-border to-transparent" />
        </div>
      </section>

      {/* Marquee Section */}
      <section className="py-10 sm:py-12 md:py-16 border-y border-border/30 glass-light overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee">
          {[...marqueeTexts, ...marqueeTexts, ...marqueeTexts, ...marqueeTexts].map((text, i) => (
            <span
              key={i}
              className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold mx-4 sm:mx-6 md:mx-8 text-foreground/10"
            >
              {text}
            </span>
          ))}
        </div>
      </section>

      {/* About Preview Section */}
      <section className="py-24 sm:py-32 md:py-48 glass-light">
        <div className="container mx-auto px-4 sm:px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-24 items-center">
            <RevealSection>
              <p className="text-xs sm:text-sm uppercase tracking-[0.2em] sm:tracking-[0.3em] text-primary mb-4 sm:mb-6">
                About Us
              </p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 sm:mb-8 leading-tight">
                一人ひとりと
                <br />
                向き合うものづくり
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-8 sm:mb-10 text-balance">
                私たちは大きな組織ではありません。だからこそ、一つひとつのプロジェクトに全力で向き合い、クライアントと同じ目線で、一緒に考え、一緒に創ります。
              </p>
              <MagneticButton
                href="/about"
                className="group inline-flex items-center gap-3 px-6 py-3 bg-foreground text-background rounded-full hover:bg-accent transition-all duration-300"
                data-cursor="Learn"
              >
                <span className="text-sm uppercase tracking-wider">もっと詳しく</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </MagneticButton>
            </RevealSection>

            <RevealSection delay={0.2}>
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-card border border-border">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-7xl sm:text-8xl md:text-9xl font-bold text-foreground/5">02</p>
                    <p className="text-sm sm:text-base text-muted-foreground mt-4">Team Members</p>
                  </div>
                </div>
                <div className="absolute bottom-6 sm:bottom-8 right-6 sm:right-8 w-20 sm:w-24 h-[1px] bg-primary" />
              </div>
            </RevealSection>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 sm:py-32 md:py-48 glass-card">
        <div className="container mx-auto px-4 sm:px-6 md:px-12">
          <RevealSection className="mb-16 sm:mb-20 md:mb-32">
            <p className="text-xs sm:text-sm uppercase tracking-[0.2em] sm:tracking-[0.3em] text-primary mb-4 sm:mb-6">
              Services
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              私たちにできること
            </h2>
          </RevealSection>

          <div className="space-y-0">
            {services.map((service, index) => (
              <RevealSection key={service.num} delay={index * 0.1}>
                <div className="group py-8 sm:py-10 md:py-12 border-t border-border hover:bg-card/30 transition-colors duration-500">
                  <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
                    <span className="text-xs sm:text-sm text-muted-foreground font-mono shrink-0 w-8">{service.num}</span>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2 group-hover:text-primary transition-colors duration-300 whitespace-nowrap">
                        {service.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-primary whitespace-nowrap">{service.titleJa}</p>
                    </div>
                    <p className="text-sm sm:text-base text-muted-foreground max-w-md leading-relaxed text-pretty shrink-0 md:w-96">
                      {service.description}
                    </p>
                  </div>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* Works Section */}
      <section className="py-24 sm:py-32 md:py-48 glass-light">
        <div className="container mx-auto px-4 sm:px-6 md:px-12">
          <RevealSection className="text-center mb-12 sm:mb-16 md:mb-20">
            <p className="text-xs sm:text-sm uppercase tracking-[0.2em] sm:tracking-[0.3em] text-primary mb-4 sm:mb-6">
              Works
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 sm:mb-8">
              制作実績
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
              クライアントと共に創り上げたプロジェクトの一部をご紹介します。
            </p>
          </RevealSection>

          <RevealSection delay={0.2}>
            <div className="relative p-8 sm:p-12 md:p-16 rounded-2xl glass-card border border-border/30 text-center">
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-8">
                実績ページで詳しくご覧いただけます
              </p>
              <MagneticButton
                href="/works"
                className="group px-6 sm:px-8 py-3.5 sm:py-4 bg-foreground text-background rounded-full font-medium hover:bg-accent transition-all duration-300"
                data-cursor="Works"
              >
                <span className="flex items-center gap-3">
                  実績を見る
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </MagneticButton>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* Area Section */}
      <section className="py-24 sm:py-32 md:py-40 border-y border-border/30 glass-card">
        <div className="container mx-auto px-4 sm:px-6 md:px-12 text-center">
          <RevealSection>
            <p className="text-xs sm:text-sm uppercase tracking-[0.2em] sm:tracking-[0.3em] text-primary mb-4 sm:mb-6">
              Area
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 sm:mb-8">
              対応エリア
            </h2>
            <p className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 sm:mb-8">
              茨城・東京・神奈川・千葉
            </p>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed text-balance">
              上記エリアを中心に活動していますが、オンラインでのお打ち合わせも可能です。全国どこからでもお気軽にご相談ください。
            </p>
          </RevealSection>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 sm:py-32 md:py-48 overflow-hidden glass-light">
        <div className="container mx-auto px-4 sm:px-6 md:px-12 text-center">
          <RevealSection direction="blur" duration={1.6}>
            <p className="text-xs sm:text-sm uppercase tracking-[0.2em] sm:tracking-[0.3em] text-primary mb-4 sm:mb-6">
              Contact
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight mb-6 sm:mb-8">
              まずは、
              <span className="gradient-text">お話しませんか？</span>
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto mb-10 sm:mb-12 text-balance">
              「こんなこと頼めるのかな？」という段階でも大丈夫。お気軽にご連絡ください。
            </p>
          </RevealSection>
          
          <RevealSection delay={0.3} direction="scale" duration={1.4}>
            <CircleButton href="/contact" size="lg">
              080-9155-0426
            </CircleButton>
          </RevealSection>
        </div>
      </section>

      <Footer />
    </>
  )
}
