'use client'

import { ArrowRight, Phone, Clock, CheckCircle } from 'lucide-react'
import { ScatterBlock } from '@/components/motion/scatter-block'
import { ScatterText } from '@/components/motion/scatter-text'
import { SectionReveal } from '@/components/motion/text-reveal'
import type { AboutProcessSectionProps } from '@/types/about-page'

export function AboutProcessSection({ process }: AboutProcessSectionProps) {
  return (
    <section className="relative py-28 md:py-40 lg:py-52 glass-card overflow-hidden">
      <div className="fixed top-[20vh] left-[5vw] w-72 h-72 rounded-full bg-gradient-to-br from-primary/5 to-transparent blur-3xl pointer-events-none opacity-50" />
      <div className="fixed bottom-[15vh] right-[5vw] w-96 h-96 rounded-full bg-gradient-to-tl from-accent/5 to-transparent blur-3xl pointer-events-none opacity-50" />

      <div className="fixed top-[30vh] left-[10%] w-px h-32 bg-gradient-to-b from-transparent via-foreground/5 to-transparent pointer-events-none" />
      <div className="fixed bottom-[25vh] right-[12%] w-px h-24 bg-gradient-to-b from-transparent via-primary/10 to-transparent pointer-events-none" />

      <div className="container relative z-10 mx-auto px-6 md:px-12 lg:px-16">
        <div className="text-center mb-16 lg:mb-28">
          <div className="overflow-visible">
            <ScatterText
              as="h2"
              className="type-display text-[10vw] md:text-[8vw] lg:text-[6.5vw] leading-[0.9]"
              scrollStart={50}
              scrollEnd={400}
              distance={700}
              gradient
            >
              PROCESS
            </ScatterText>
          </div>
          <ScatterText
            as="p"
            className="type-body text-base md:text-lg text-muted-foreground mt-6 max-w-2xl mx-auto"
            scrollStart={50}
            scrollEnd={400}
            distance={300}
          >
            お問い合わせから公開、そしてその後まで。私たちがどのようにプロジェクトを進めていくのか、6つのステップでご紹介します。
          </ScatterText>
        </div>

        <div className="max-w-5xl mx-auto py-8">
          {process.map((item, index) => (
            <ProcessStep key={item.step} item={item} index={index} isLast={index === process.length - 1} />
          ))}
        </div>

        <div className="text-center mt-20 lg:mt-32">
          <ScatterText
            as="p"
            className="type-body text-lg md:text-xl text-muted-foreground mb-10"
            scrollStart={50}
            scrollEnd={400}
            distance={300}
          >
            ご不明点があれば、お気軽にお問い合わせください
          </ScatterText>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <ScatterBlock
              className="cta-primary type-cta group w-full rounded-full px-8 py-4 text-sm transition-all duration-300 sm:w-auto"
              scrollEnd={350}
              distance={400}
              seed={10}
              href="/contact"
            >
              <span className="flex items-center justify-center gap-4">
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
              seed={11}
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
      </div>
    </section>
  )
}

function ProcessStep({
  item,
  index,
  isLast,
}: {
  item: AboutProcessSectionProps['process'][0]
  index: number
  isLast: boolean
}) {
  const isEven = index % 2 === 0

  return (
    <SectionReveal delay={index * 0.1} duration={0.8} y={20}>
      <div className={`relative ${index > 0 ? 'pt-24 lg:pt-40' : ''} last:pb-0`}>
        <div className={`pointer-events-none absolute bottom-0 left-[calc(50%-50vw)] right-[calc(50%-50vw)] ${index > 0 ? 'top-24 lg:top-40' : 'top-0'} flex select-none items-center overflow-hidden`}>
          <div
            className={`flex min-w-max whitespace-nowrap opacity-[0.04] ${isEven ? 'animate-marquee-slow' : 'animate-marquee-slow-reverse'}`}
          >
            {Array.from({ length: 12 }).map((_, i) => (
              <span
                key={i}
                className="type-display text-[25vw] md:text-[22vw] lg:text-[18vw] leading-none uppercase tracking-tighter mx-8"
              >
                {item.titleEn.split(' ')[0]}
              </span>
            ))}
          </div>
        </div>

        {!isLast && (
          <div className="absolute left-7 md:left-10 top-24 bottom-0 w-px bg-gradient-to-b from-primary/30 via-foreground/10 to-transparent" />
        )}

        <div className="border-hue-card flex flex-col md:flex-row md:items-start gap-8 md:gap-12">
          <div className="relative shrink-0">
            <div className="absolute inset-0 w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary/20 blur-xl" />
            <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full glass-card rainbow-border flex items-center justify-center">
              <ScatterText
                as="span"
                className="type-readable-number text-3xl md:text-4xl gradient-text"
                scrollStart={50}
                scrollEnd={350}
                distance={180}
              >
                {String(item.step)}
              </ScatterText>
            </div>
          </div>

          <div className="flex-1 pt-2">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
              <div>
                <ScatterText
                  as="h3"
                  className="type-section-title text-3xl md:text-4xl gradient-text mb-2"
                  scrollStart={50}
                  scrollEnd={350}
                  distance={320}
                  gradient
                >
                  {item.title}
                </ScatterText>
                <ScatterText
                  as="span"
                  className="type-label text-base text-muted-foreground tracking-widest uppercase"
                  scrollStart={50}
                  scrollEnd={350}
                  distance={220}
                >
                  {item.titleEn}
                </ScatterText>
              </div>
              <div className="flex items-center gap-3 px-5 py-2.5 bg-foreground/5 rounded-full shrink-0 rainbow-border">
                <Clock size={16} className="text-primary" />
                <ScatterText
                  as="span"
                  className="type-readable-number text-sm text-foreground"
                  scrollStart={50}
                  scrollEnd={350}
                  distance={160}
                >
                  {item.duration}
                </ScatterText>
              </div>
            </div>

            <div className="relative p-8 md:p-12 rounded-3xl glass-card rainbow-border overflow-hidden mt-4">
              <div className={`absolute ${isEven ? '-top-16 -right-16' : '-bottom-16 -left-16'} w-48 h-48 rounded-full bg-gradient-to-br from-primary/8 to-transparent blur-3xl pointer-events-none`} />

              <ScatterText
                as="p"
                className="type-card-title text-xl md:text-2xl text-foreground mb-4 relative z-10"
                scrollStart={50}
                scrollEnd={350}
                distance={260}
              >
                {item.description}
              </ScatterText>
              <ScatterText
                as="p"
                className="type-body text-base md:text-lg text-muted-foreground mb-10 relative z-10"
                scrollStart={50}
                scrollEnd={350}
                distance={220}
              >
                {item.fullDescription}
              </ScatterText>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8 relative z-10">
                {item.details.map((detail, detailIndex) => (
                  <div
                    key={detail.title}
                    className="group flex items-start gap-4 p-5 rounded-2xl bg-background/50 rainbow-border transition-all duration-300 hover:bg-background/70"
                    style={{ animationDelay: `${detailIndex * 100}ms` }}
                  >
                    <div className="shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center transition-colors duration-300 group-hover:bg-primary/20">
                      <CheckCircle size={16} className="text-primary" />
                    </div>
                    <div>
                      <ScatterText
                        as="span"
                        className="type-card-title text-sm text-foreground block mb-1.5"
                        scrollStart={50}
                        scrollEnd={350}
                        distance={160}
                      >
                        {detail.title}
                      </ScatterText>
                      <ScatterText
                        as="span"
                        className="type-body-compact text-sm text-muted-foreground leading-relaxed"
                        scrollStart={50}
                        scrollEnd={350}
                        distance={160}
                      >
                        {detail.desc}
                      </ScatterText>
                    </div>
                  </div>
                ))}
              </div>

              {item.note && (
                <div className="flex items-center gap-3 text-sm text-muted-foreground italic p-4 rounded-xl bg-foreground/5 relative z-10">
                  <span className="text-primary text-lg">*</span>
                  <ScatterText
                    as="span"
                    className="type-body-compact"
                    scrollStart={50}
                    scrollEnd={350}
                    distance={160}
                  >
                    {item.note}
                  </ScatterText>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </SectionReveal>
  )
}
