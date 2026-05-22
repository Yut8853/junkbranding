'use client'

import { useRef } from 'react'
import { ArrowRight, CheckCircle } from 'lucide-react'
import { MagneticButton } from '@/components/ui/magnetic-button'
import { ScatterText } from '@/components/motion/scatter-text'
import { SectionReveal } from '@/components/motion/text-reveal'
import { ContactForm } from '@/components/pages/contact/contact-form'
import { ContactInfoSection } from '@/components/pages/contact/contact-info-section'
import { useScrollScatterProgress } from '@/hooks/use-scroll-scatter-progress'
import type { ContactFormProps } from '@/types/contact-page'

export function ContactSuccessSection() {
  return (
    <section className="min-h-[100svh] flex items-center justify-center pt-20 sm:pt-24">
      <div className="container mx-auto px-5 sm:px-7 md:px-14 py-16 sm:py-24 text-center">
        <SectionReveal>
          <div className="max-w-lg mx-auto">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-6 sm:mb-8 rounded-full bg-primary/10 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
            </div>
            <h1 className="type-hero-title text-3xl sm:text-4xl md:text-5xl mb-4 sm:mb-6">
              送信完了しました。
            </h1>
            <p className="type-body text-base sm:text-lg text-muted-foreground mb-8 sm:mb-10 text-balance">
              お問い合わせいただきありがとうございます。内容を確認の上、1営業日以内にご連絡いたします。
            </p>
            <MagneticButton
              href="/"
              className="cta-primary type-cta group rounded-full px-6 py-3.5 transition-all duration-300 sm:px-8 sm:py-4"
            >
              <span className="flex items-center gap-3">
                トップに戻る
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </MagneticButton>
          </div>
        </SectionReveal>
      </div>
    </section>
  )
}

export function ContactHeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const heroScatterProgress = useScrollScatterProgress(containerRef)

  return (
    <section
      ref={containerRef}
      className="relative min-h-[100svh] flex items-center justify-center overflow-hidden"
    >
      {/* 背景の巨大テキスト */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.03]">
        <span className="type-display text-[50vw] whitespace-nowrap">
          CONTACT
        </span>
      </div>

      {/* マーキー装飾 */}
      <div className="absolute inset-0 flex flex-col justify-center pointer-events-none select-none overflow-hidden opacity-[0.04]">
        <div className="flex whitespace-nowrap animate-marquee-slow">
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={`marquee-1-${i}`} className="type-display text-[8vw] mx-8 marquee-stroke">
              CONTACT
            </span>
          ))}
        </div>
        <div className="flex whitespace-nowrap animate-marquee-slow-reverse mt-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={`marquee-2-${i}`} className="type-display text-[8vw] mx-8 marquee-stroke">
              GET IN TOUCH
            </span>
          ))}
        </div>
      </div>

      <div className="container relative z-10 mx-auto px-6 md:px-14 lg:px-20 text-center">
        <div className="overflow-visible">
          <ScatterText
            as="h1"
            className="type-display text-[12vw] md:text-[10vw] lg:text-[8vw] leading-[0.9] tracking-[-0.04em]"
            distance={900}
            gradient
            scatterProgress={heroScatterProgress}
            deferUntilActive
          >
            CONTACT
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
            プロジェクトのご相談、お見積りなど、お気軽にお問い合わせください。
          </ScatterText>
        </div>
      </div>

      {/* スクロール案内 */}
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

export function ContactInfoAndFormSection(props: ContactFormProps) {
  return (
    <section className="py-32 md:py-40 lg:py-56 glass-light">
      <div className="container mx-auto px-6 md:px-14 lg:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 lg:gap-20">
          <ContactInfoSection />
          <ContactForm {...props} />
        </div>
      </div>
    </section>
  )
}

