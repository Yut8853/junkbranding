'use client'

import { ArrowRight, Check, HelpCircle, MessageCircle, Phone, Sparkles } from 'lucide-react'
import { SectionReveal } from '@/components/text-reveal'
import { ScatterBlock } from '@/components/scatter-block'
import { ScatterText } from '@/components/scatter-text'
import type { PricingFaqSectionProps, PricingServiceCategoriesSectionProps } from '@/types/pricing-page'

export function PricingHeroSection() {
  return (
    <section className="relative min-h-[60svh] sm:min-h-[70svh] flex items-center justify-center">
      <div className="container mx-auto px-6 md:px-12 lg:px-16 py-32 md:py-40 text-center">
        <div className="mb-6 lg:mb-8">
          <ScatterText
            as="span"
            className="font-display text-[clamp(3rem,10vw,7rem)] leading-none tracking-tight text-foreground/50 block"
            scrollStart={50}
            scrollEnd={350}
            distance={500}
            style={{
              WebkitTextStroke: '1px currentColor',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Pricing
          </ScatterText>
        </div>
        <ScatterText
          as="h1"
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 lg:mb-8"
          scrollStart={50}
          scrollEnd={350}
          distance={400}
          gradient
        >
          制作料金
        </ScatterText>
        <ScatterText
          as="p"
          className="text-base md:text-lg text-muted-foreground max-w-lg mx-auto leading-[1.8] tracking-wide"
          scrollStart={50}
          scrollEnd={350}
          distance={300}
        >
          あらゆるクリエイティブに、柔軟に対応します。ご予算やご要望に合わせたご提案が可能です。
        </ScatterText>
      </div>
    </section>
  )
}

export function PricingNoticeSection() {
  return (
    <section className="py-8 glass-card rainbow-border">
      <div className="container mx-auto px-6 md:px-12 lg:px-16">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-center sm:text-left">
          <div className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 text-muted-foreground" />
          </div>
          <ScatterText
            as="p"
            className="text-sm text-muted-foreground leading-[1.8] tracking-wide"
            scrollStart={50}
            scrollEnd={350}
            distance={260}
          >
            下記料金は参考価格です。プロジェクトの内容・規模により変動いたします。正式なお見積りは無料ヒアリング後にご提示いたしますので、お気軽にご相談ください。
          </ScatterText>
        </div>
      </div>
    </section>
  )
}

export function PricingServiceCategoriesSection({
  serviceCategories,
}: PricingServiceCategoriesSectionProps) {
  return (
    <section className="py-32 md:py-40 lg:py-56 glass-light">
      <div className="container mx-auto px-6 md:px-12 lg:px-16">
        <div className="space-y-20 lg:space-y-32">
          {serviceCategories.map((category, categoryIndex) => (
            <SectionReveal key={category.id} delay={categoryIndex * 0.03}>
              <div className="group rounded-3xl glass-card rainbow-border p-6 md:p-8 lg:p-10">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 md:gap-8 mb-10 lg:mb-12 pb-8 border-b border-border/20">
                  <div className="flex items-start gap-5 md:gap-6">
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-foreground/5 flex items-center justify-center shrink-0 group-hover:bg-foreground/10 transition-colors duration-300">
                      <category.icon className="w-5 h-5 md:w-6 md:h-6 text-foreground/60" />
                    </div>
                    <div>
                      <ScatterText
                        as="h2"
                        className="text-xl sm:text-2xl md:text-3xl font-bold mb-1 tracking-tight"
                        scrollStart={50}
                        scrollEnd={350}
                        distance={300}
                        gradient
                      >
                        {category.title}
                      </ScatterText>
                      <ScatterText
                        as="p"
                        className="text-xs text-muted-foreground uppercase tracking-widest mb-3 font-medium"
                        scrollStart={50}
                        scrollEnd={350}
                        distance={220}
                      >
                        {category.titleEn}
                      </ScatterText>
                      <ScatterText
                        as="p"
                        className="text-sm md:text-base text-muted-foreground leading-[1.8] tracking-wide max-w-lg"
                        scrollStart={50}
                        scrollEnd={350}
                        distance={260}
                      >
                        {category.description}
                      </ScatterText>
                    </div>
                  </div>
                  <div className="md:text-right shrink-0">
                    <ScatterText
                      as="p"
                      className="text-xs text-muted-foreground mb-1 tracking-wide"
                      scrollStart={50}
                      scrollEnd={350}
                      distance={160}
                    >
                      参考価格
                    </ScatterText>
                    <ScatterText
                      as="p"
                      className="text-2xl sm:text-3xl font-bold"
                      scrollStart={50}
                      scrollEnd={350}
                      distance={200}
                      gradient
                    >
                      {category.priceRange}
                    </ScatterText>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-8 lg:mb-10">
                  {category.services.map((service) => (
                    <div
                      key={service.name}
                      className="p-6 lg:p-8 rounded-2xl bg-background/45 rainbow-border transition-all duration-300"
                    >
                      <ScatterText
                        as="h3"
                        className="text-sm md:text-base font-bold mb-2 tracking-tight"
                        scrollStart={50}
                        scrollEnd={350}
                        distance={220}
                        gradient
                      >
                        {service.name}
                      </ScatterText>
                      <ScatterText
                        as="p"
                        className="text-lg md:text-xl font-bold text-foreground mb-2"
                        scrollStart={50}
                        scrollEnd={350}
                        distance={200}
                      >
                        {service.price}
                      </ScatterText>
                      <ScatterText
                        as="p"
                        className="text-xs text-muted-foreground tracking-wide"
                        scrollStart={50}
                        scrollEnd={350}
                        distance={180}
                      >
                        {service.note}
                      </ScatterText>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2">
                  {category.features.map((feature) => (
                    <span
                      key={feature}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs bg-background/45 rounded-full rainbow-border"
                    >
                      <Check size={10} className="text-muted-foreground" />
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
              </div>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export function PricingFaqSection({ faqs }: PricingFaqSectionProps) {
  return (
    <section className="py-32 md:py-40 lg:py-56 glass-card">
      <div className="container mx-auto px-6 md:px-12 lg:px-16">
        <div className="text-center mb-16 lg:mb-24">
          <div className="mb-6 lg:mb-8">
            <ScatterText
              as="span"
              className="font-display text-[clamp(3rem,10vw,7rem)] leading-none tracking-tight text-foreground/50 block"
              scrollStart={50}
              scrollEnd={350}
              distance={500}
              style={{
                WebkitTextStroke: '1px currentColor',
                WebkitTextFillColor: 'transparent',
              }}
            >
              FAQ
            </ScatterText>
          </div>
          <ScatterText
            as="h2"
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight"
            scrollStart={50}
            scrollEnd={350}
            distance={400}
            gradient
          >
            よくあるご質問
          </ScatterText>
        </div>

        <div className="max-w-3xl mx-auto space-y-4 lg:space-y-6">
          {faqs.map((faq, index) => (
            <SectionReveal key={faq.question} delay={index * 0.03}>
              <div className="p-6 md:p-8 lg:p-10 rounded-3xl glass-card rainbow-border transition-all duration-300">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-8 h-8 rounded-full bg-foreground/5 flex items-center justify-center shrink-0">
                    <HelpCircle size={14} className="text-muted-foreground" />
                  </div>
                  <ScatterText
                    as="h3"
                    className="text-sm md:text-base font-bold leading-[1.6] tracking-tight"
                    scrollStart={50}
                    scrollEnd={350}
                    distance={240}
                    gradient
                  >
                    {faq.question}
                  </ScatterText>
                </div>
                <ScatterText
                  as="p"
                  className="text-sm text-muted-foreground leading-[1.8] tracking-wide pl-12"
                  scrollStart={50}
                  scrollEnd={350}
                  distance={260}
                >
                  {faq.answer}
                </ScatterText>
              </div>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export function PricingCtaSection() {
  return (
    <section className="py-32 md:py-40 lg:py-56 glass-light">
      <div className="container mx-auto px-6 md:px-12 lg:px-16 text-center">
        <ScatterText
          as="h2"
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-2"
          scrollStart={50}
          scrollEnd={350}
          distance={400}
          gradient
        >
          まずは、
        </ScatterText>
        <ScatterText
          as="span"
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6 lg:mb-8 block"
          scrollStart={50}
          scrollEnd={350}
          distance={400}
          gradient
        >
          お気軽にご相談ください
        </ScatterText>
        <ScatterText
          as="p"
          className="text-base md:text-lg text-muted-foreground max-w-lg mx-auto mb-10 lg:mb-12 leading-[1.8] tracking-wide"
          scrollStart={50}
          scrollEnd={350}
          distance={300}
        >
          ご予算やご要望をお聞かせいただければ、最適なプランをご提案いたします。お見積りは無料です。
        </ScatterText>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <ScatterBlock
            className="cta-primary group w-full rounded-full px-8 py-4 text-sm font-bold tracking-widest uppercase transition-all duration-300 sm:w-auto"
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
              className="inline-block"
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
