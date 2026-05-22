'use client'

import { useState } from 'react'
import { ArrowRight, Check, HelpCircle, MessageCircle, Phone, Sparkles, Plus, Minus } from 'lucide-react'
import { SectionReveal } from '@/components/motion/text-reveal'
import { ScatterBlock } from '@/components/motion/scatter-block'
import { ScatterText } from '@/components/motion/scatter-text'
import { ServiceCard } from '@/components/pages/pricing/pricing-service-card'
import type { PricingFaqItemProps, PricingFaqSectionProps, PricingServiceCategoriesSectionProps } from '@/types/pricing-page'

export function PricingHeroSection() {
  return (
    <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden">
      {/* 背景の巨大テキスト */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.03]">
        <span className="type-display text-[42vw] whitespace-nowrap">PRICING</span>
      </div>

      {/* マーキー装飾 */}
      <div className="absolute inset-0 flex flex-col justify-center pointer-events-none select-none overflow-hidden opacity-[0.04]">
        <div className="flex whitespace-nowrap animate-marquee-slow">
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={`marquee-1-${i}`} className="type-display text-[6vw] mx-8 marquee-stroke">
              PRICING
            </span>
          ))}
        </div>
        <div className="flex whitespace-nowrap animate-marquee-slow-reverse mt-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={`marquee-2-${i}`} className="type-display text-[6vw] mx-8 marquee-stroke">
              SERVICES
            </span>
          ))}
        </div>
      </div>

      <div className="container relative z-10 mx-auto px-6 md:px-14 lg:px-20 text-center">
        <div className="overflow-visible">
          <ScatterText
            as="h1"
            className="type-display text-[10vw] md:text-[8vw] lg:text-[6.5vw] leading-[0.9] tracking-[-0.04em]"
            distance={900}
            gradient
          >
            PRICING
          </ScatterText>
        </div>

        <div className="overflow-visible mt-8">
          <ScatterText
            as="p"
            className="type-body text-base md:text-lg text-muted-foreground max-w-lg mx-auto"
            distance={400}
          >
            あらゆるクリエイティブに、柔軟に対応します。
          </ScatterText>
        </div>
      </div>

      {/* スクロール案内 */}
      <div 
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
      >
        <span className="type-label text-muted-foreground text-xs">Scroll to explore</span>
        <div className="w-px h-16 bg-gradient-to-b from-foreground/40 to-transparent animate-pulse" />
      </div>
    </section>
  )
}

export function PricingNoticeSection() {
  return (
    <SectionReveal delay={0.1} duration={0.8}>
      <section className="py-8 glass-card rainbow-border sticky top-20 z-30">
        <div className="container mx-auto px-6 md:px-14 lg:px-20">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-center sm:text-left">
            <div className="w-12 h-12 rounded-full bg-foreground/5 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-muted-foreground" />
            </div>
            <p className="type-body-compact text-sm md:text-base text-muted-foreground">
              下記料金は参考価格です。プロジェクトの内容・規模により変動いたします。
              <br className="hidden md:block" />
              正式なお見積りは無料ヒアリング後にご提示いたしますので、お気軽にご相談ください。
            </p>
          </div>
        </div>
      </section>
    </SectionReveal>
  )
}

export function PricingServiceCategoriesSection({
  serviceCategories,
}: PricingServiceCategoriesSectionProps) {
  return (
    <section className="relative py-24 md:py-32 lg:py-40 glass-light overflow-hidden">
      <div className="container relative z-10 mx-auto px-6 md:px-14 lg:px-20">
        <div className="space-y-20 lg:space-y-32">
          {serviceCategories.map((category, categoryIndex) => (
            <ServiceCategoryCard
              key={category.id}
              category={category}
              index={categoryIndex}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function ServiceCategoryCard({
  category,
  index,
}: {
  category: PricingServiceCategoriesSectionProps['serviceCategories'][0]
  index: number
}) {
  return (
    <div className="group">
      {/* 大きなカテゴリ番号 */}
      <SectionReveal delay={0.1} duration={0.8}>
        <div className="mb-8 lg:mb-12 overflow-hidden">
          <ScatterText
            as="span"
            className="type-display text-[16vw] md:text-[12vw] text-foreground/[0.03] leading-none block"
            scrollStart={50}
            scrollEnd={350}
            distance={260}
          >
            {String(index + 1).padStart(2, '0')}
          </ScatterText>
        </div>
      </SectionReveal>

      {/* カテゴリ見出し */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-12 lg:mb-16 pb-10 border-b border-border/20">
        <div className="flex items-start gap-6 md:gap-8">
          <SectionReveal delay={0.2} duration={0.8}>
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-3xl bg-foreground/5 flex items-center justify-center shrink-0 group-hover:bg-foreground/10 transition-colors duration-500">
              <category.icon className="w-7 h-7 md:w-8 md:h-8 text-foreground/60" />
            </div>
          </SectionReveal>
          <div>
            <div className="overflow-visible mb-2">
              <ScatterText
                as="h2"
                className="type-section-title text-3xl sm:text-4xl md:text-5xl"
                scrollStart={50}
                scrollEnd={400}
                distance={500}
                gradient
              >
                {category.title}
              </ScatterText>
            </div>
            <ScatterText
              as="span"
              className="type-label text-muted-foreground mb-4 block"
              scrollStart={50}
              scrollEnd={350}
              distance={200}
            >
              {category.titleEn}
            </ScatterText>
            <ScatterText
              as="p"
              className="type-body text-base md:text-lg text-muted-foreground max-w-xl"
              scrollStart={50}
              scrollEnd={400}
              distance={300}
            >
              {category.description}
            </ScatterText>
          </div>
        </div>

        <SectionReveal delay={0.3} duration={0.8}>
          <div className="lg:text-right shrink-0">
            <ScatterText
              as="span"
              className="type-label text-muted-foreground mb-2 block"
              scrollStart={50}
              scrollEnd={350}
              distance={180}
            >
              Starting from
            </ScatterText>
            <ScatterText
              as="span"
              className="type-readable-number text-4xl md:text-5xl lg:text-6xl gradient-text"
              scrollStart={50}
              scrollEnd={350}
              distance={260}
            >
              {category.priceRange}
            </ScatterText>
          </div>
        </SectionReveal>
      </div>

      {/* サービス一覧グリッド */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-10">
        {category.services.map((service, serviceIndex) => (
          <ServiceCard key={service.name} service={service} index={serviceIndex} />
        ))}
      </div>

      {/* 付帯する特徴タグ */}
      <SectionReveal delay={0.4} duration={0.8}>
        <div className="flex flex-wrap gap-3">
          {category.features.map((feature) => (
            <span
              key={feature}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-background/50 rounded-full rainbow-border"
            >
              <Check size={12} className="text-primary" />
              <ScatterText
                as="span"
                className="inline-block"
                scrollStart={50}
                scrollEnd={350}
                distance={140}
              >
              {feature}
              </ScatterText>
            </span>
          ))}
        </div>
      </SectionReveal>
    </div>
  )
}

export function PricingFaqSection({ faqs }: PricingFaqSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="relative py-24 md:py-32 lg:py-40 glass-card overflow-hidden">
      {/* 背景テキスト */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.03]">
        <span className="type-display text-[28vw] whitespace-nowrap">FAQ</span>
      </div>

      <div className="container relative z-10 mx-auto px-6 md:px-14 lg:px-20">
        <div className="text-center mb-16 lg:mb-24">
          <div className="overflow-visible">
            <ScatterText
              as="h2"
              className="type-display text-[10vw] md:text-[8vw] lg:text-[6.5vw] leading-[0.9]"
              scrollStart={50}
              scrollEnd={400}
              distance={700}
              gradient
            >
              FAQ
            </ScatterText>
          </div>
          <ScatterText
            as="p"
            className="type-body text-base md:text-lg text-muted-foreground mt-5"
            scrollStart={50}
            scrollEnd={400}
            distance={300}
          >
            よくあるご質問
          </ScatterText>
        </div>

        <div className="max-w-4xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <FaqItem
              key={faq.question}
              faq={faq}
              index={index}
              isOpen={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function FaqItem({
  faq,
  index,
  isOpen,
  onToggle,
}: PricingFaqItemProps) {
  return (
    <SectionReveal delay={index * 0.1} duration={0.6}>
      <div
        className={`rounded-3xl glass-card rainbow-border transition-all duration-500 overflow-hidden ${
          isOpen ? 'shadow-[0_20px_60px_rgba(0,0,0,0.06)]' : ''
        }`}
      >
        <button
          type="button"
          onClick={onToggle}
          className="w-full flex items-center justify-between gap-6 p-6 md:p-8 text-left"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center shrink-0">
              <HelpCircle size={18} className="text-muted-foreground" />
            </div>
            <ScatterText
              as="h3"
              className="type-card-title text-base md:text-lg gradient-text"
              scrollStart={50}
              scrollEnd={350}
              distance={220}
              gradient
            >
              {faq.question}
            </ScatterText>
          </div>
          <div
            className={`w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center shrink-0 transition-transform duration-300 ${
              isOpen ? 'rotate-180' : ''
            }`}
          >
            {isOpen ? (
              <Minus size={18} className="text-muted-foreground" />
            ) : (
              <Plus size={18} className="text-muted-foreground" />
            )}
          </div>
        </button>

        <div
          className={`grid transition-[grid-template-rows,opacity] duration-250 ease-out ${
            isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
          }`}
        >
          <div className="overflow-hidden">
            <p className="type-body text-base text-muted-foreground px-6 md:px-8 pb-6 md:pb-8 pl-20 md:pl-22">
              {faq.answer}
            </p>
          </div>
        </div>
      </div>
    </SectionReveal>
  )
}

export function PricingCtaSection() {
  return (
    <section className="relative min-h-[60svh] flex items-center justify-center py-24 md:py-32 lg:py-40 glass-light overflow-hidden">
      {/* 背景テキスト */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.02]">
        <span className="type-display text-[28vw] whitespace-nowrap">START</span>
      </div>

      <div className="container relative z-10 mx-auto px-6 md:px-14 lg:px-20 text-center">
        <div className="overflow-visible mb-8">
          <ScatterText
            as="h2"
            className="type-section-title text-3xl sm:text-4xl md:text-5xl lg:text-6xl"
            distance={600}
            gradient
          >
            まずは、お気軽にご相談ください
          </ScatterText>
        </div>

        <ScatterText
          as="p"
          className="type-body text-base md:text-lg text-muted-foreground max-w-xl mx-auto mb-10"
          scrollStart={50}
          scrollEnd={350}
          distance={300}
        >
          ご予算やご要望をお聞かせいただければ、最適なプランをご提案いたします。お見積りは無料です。
        </ScatterText>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <ScatterBlock
            className="cta-primary type-cta group w-full rounded-full px-8 py-4 text-sm transition-all duration-300 sm:w-auto"
            scrollEnd={350}
            distance={400}
            seed={40}
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
                無料で相談する
              </ScatterText>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </ScatterBlock>

          <ScatterBlock
            className="cta-secondary flex w-full items-center justify-center gap-3 rounded-full px-8 py-4 text-sm font-bold transition-all duration-300 sm:w-auto"
            scrollEnd={350}
            distance={400}
            seed={41}
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
              080-9155-0426
            </ScatterText>
          </ScatterBlock>
        </div>
      </div>
    </section>
  )
}
