'use client'

import Image from 'next/image'
import { ArrowRight, Phone, Clock } from 'lucide-react'
import { SectionReveal } from '@/components/text-reveal'
import { ScatterText } from '@/components/scatter-text'
import { ScatterBlock } from '@/components/scatter-block'
import type {
  AboutProcessSectionProps,
  AboutTeamSectionProps,
  AboutValuesSectionProps,
} from '@/types/about-page'

export function AboutHeroSection() {
  return (
    <section className="relative min-h-[70svh] sm:min-h-[80svh] flex items-center justify-center">
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
            About Us
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
          私たちについて
        </ScatterText>
        <ScatterText
          as="p"
          className="text-base md:text-lg text-muted-foreground max-w-lg mx-auto leading-[1.8] tracking-wide"
          scrollStart={50}
          scrollEnd={350}
          distance={300}
        >
          2人だけの小さなスタジオだからこそ、できることがあります。
        </ScatterText>
      </div>
    </section>
  )
}

export function AboutIntroSection() {
  return (
    <section className="py-32 md:py-40 lg:py-56 glass-light">
      <div className="container mx-auto px-6 md:px-12 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div className="lg:pr-8">
            <ScatterText
              as="h2"
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.2] mb-2"
              scrollStart={50}
              scrollEnd={350}
              distance={400}
              gradient
            >
              大手にはできない、
            </ScatterText>
            <ScatterText
              as="h2"
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.2] mb-8 lg:mb-10"
              scrollStart={50}
              scrollEnd={350}
              distance={400}
              gradient
            >
              丁寧なものづくり
            </ScatterText>
            <div className="space-y-6 text-base md:text-lg text-muted-foreground leading-[1.8] tracking-wide">
              <ScatterText
                as="p"
                className="text-base md:text-lg text-muted-foreground leading-[1.8] tracking-wide"
                scrollStart={50}
                scrollEnd={350}
                distance={300}
              >
                JunkBrandingは、茨城・東京・神奈川を中心に活動する、2人だけのブランディング&Web制作スタジオです。
              </ScatterText>
              <ScatterText
                as="p"
                className="text-base md:text-lg text-muted-foreground leading-[1.8] tracking-wide"
                scrollStart={50}
                scrollEnd={350}
                distance={300}
              >
                大きな組織では難しい「一人ひとりと向き合う」ことを大切に、クライアントと同じ目線で、一緒に考え、一緒に創ります。
              </ScatterText>
              <ScatterText
                as="p"
                className="text-base md:text-lg text-muted-foreground leading-[1.8] tracking-wide"
                scrollStart={50}
                scrollEnd={350}
                distance={300}
              >
                「ちょっとした相談」から「本格的なリブランディング」まで、まずはお気軽にお声がけください。
              </ScatterText>
            </div>
          </div>

          <SectionReveal delay={0.2}>
            <div className="relative aspect-square rounded-3xl overflow-hidden glass-card rainbow-border group">
              <Image
                src="/images/studio.jpg"
                alt="JunkBranding Studio - クリエイティブスタジオのワークスペース"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
                quality={72}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/75 via-background/15 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <ScatterText
                  as="p"
                  className="text-sm font-medium"
                  scrollStart={50}
                  scrollEnd={350}
                  distance={220}
                  gradient
                >
                  JunkBranding Studio
                </ScatterText>
              </div>
            </div>
          </SectionReveal>
        </div>
      </div>
    </section>
  )
}

export function AboutTeamSection({ team }: AboutTeamSectionProps) {
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
              Team
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
            チームメンバー
          </ScatterText>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 max-w-4xl mx-auto">
          {team.map((member, index) => (
            <SectionReveal key={member.name} delay={0.2 + index * 0.1}>
              <div className="group">
                <div className="relative aspect-[3/4] mb-8 lg:mb-10 rounded-3xl overflow-hidden glass-card rainbow-border">
                  <Image
                    src={member.image}
                    alt={`${member.name} - ${member.role}`}
                    fill
                    className="object-cover transition-all duration-700 group-hover:scale-105 filter grayscale-[30%] group-hover:grayscale-0"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    quality={72}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/85 via-background/25 to-transparent" />
                  {/* Animated gradient overlay on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-primary/20 via-transparent to-accent/20" />
                  {/* Name overlay with gradient animation */}
                  <div className="absolute bottom-6 left-6 right-6">
                    <ScatterText
                      as="p"
                      className="text-xs text-foreground/70 mb-2 font-medium tracking-widest uppercase"
                      scrollStart={50}
                      scrollEnd={350}
                      distance={220}
                    >
                      {member.role}
                    </ScatterText>
                    <ScatterText
                      as="h3"
                      className="text-xl sm:text-2xl font-bold"
                      scrollStart={50}
                      scrollEnd={350}
                      distance={300}
                      gradient
                    >
                      {member.name}
                    </ScatterText>
                    <ScatterText
                      as="p"
                      className="text-xs text-foreground/50 mt-1 tracking-wide"
                      scrollStart={50}
                      scrollEnd={350}
                      distance={220}
                    >
                      {member.nameEn}
                    </ScatterText>
                  </div>
                </div>
                <ScatterText
                  as="p"
                  className="text-sm md:text-base text-muted-foreground leading-[1.8] tracking-wide whitespace-pre-wrap"
                  scrollStart={50}
                  scrollEnd={350}
                  distance={260}
                >
                  {member.description}
                </ScatterText>
              </div>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export function AboutValuesSection({ values }: AboutValuesSectionProps) {
  return (
    <section className="py-32 md:py-40 lg:py-56 glass-light">
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
              Values
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
            大切にしていること
          </ScatterText>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {values.map((value, index) => (
            <SectionReveal key={value.title} delay={0.2 + index * 0.1}>
              <div className="group text-center p-8 md:p-10 lg:p-12 rounded-3xl glass-card rainbow-border transition-all duration-500">
                <div className="w-14 h-14 md:w-16 md:h-16 mx-auto mb-6 lg:mb-8 rounded-full bg-foreground/5 flex items-center justify-center group-hover:bg-foreground/10 transition-colors duration-300">
                  <value.icon className="w-6 h-6 md:w-7 md:h-7 text-foreground/60" />
                </div>
                <ScatterText
                  as="h3"
                  className="text-lg sm:text-xl md:text-2xl font-bold mb-2 tracking-tight"
                  scrollStart={50}
                  scrollEnd={350}
                  distance={300}
                  gradient
                >
                  {value.title}
                </ScatterText>
                <ScatterText
                  as="p"
                  className="text-xs text-muted-foreground mb-4 lg:mb-6 font-medium tracking-widest uppercase"
                  scrollStart={50}
                  scrollEnd={350}
                  distance={220}
                >
                  {value.titleEn}
                </ScatterText>
                <ScatterText
                  as="p"
                  className="text-sm md:text-base text-muted-foreground leading-[1.8] tracking-wide"
                  scrollStart={50}
                  scrollEnd={350}
                  distance={260}
                >
                  {value.description}
                </ScatterText>
              </div>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export function AboutProcessSection({ process }: AboutProcessSectionProps) {
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
              Process
            </ScatterText>
          </div>
          <ScatterText
            as="h2"
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6 lg:mb-8"
            scrollStart={50}
            scrollEnd={350}
            distance={400}
            gradient
          >
            制作の流れ
          </ScatterText>
          <ScatterText
            as="p"
            className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-[1.8] tracking-wide"
            scrollStart={50}
            scrollEnd={350}
            distance={300}
          >
            お問い合わせから公開、そしてその後まで。私たちがどのようにプロジェクトを進めていくのか、6つのステップでご紹介します。
          </ScatterText>
        </div>

        <div className="max-w-5xl mx-auto space-y-12 lg:space-y-20">
          {process.map((item, index) => (
            <SectionReveal key={item.step} delay={0.1 + index * 0.05}>
              <div className="group relative">
                {/* Step Header */}
                <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 mb-8 lg:mb-10">
                  <div className="flex items-center gap-4 md:gap-6">
                    <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-full glass-card rainbow-border flex items-center justify-center transition-all duration-500 shrink-0">
                      <ScatterText
                        as="span"
                        className="relative z-10 text-lg md:text-xl font-bold"
                        scrollStart={50}
                        scrollEnd={350}
                        distance={160}
                        gradient
                      >
                        {String(item.step)}
                      </ScatterText>
                    </div>
                    <div>
                      <ScatterText
                        as="h3"
                        className="text-xl sm:text-2xl md:text-3xl font-bold mb-1 tracking-tight"
                        scrollStart={50}
                        scrollEnd={350}
                        distance={300}
                        gradient
                      >
                        {item.title}
                      </ScatterText>
                      <ScatterText
                        as="p"
                        className="text-xs text-muted-foreground uppercase tracking-widest font-medium"
                        scrollStart={50}
                        scrollEnd={350}
                        distance={220}
                      >
                        {item.titleEn}
                      </ScatterText>
                    </div>
                  </div>
                  <div className="md:ml-auto flex items-center gap-2 px-4 py-2 bg-foreground/5 rounded-full w-fit">
                    <Clock size={14} className="text-muted-foreground" />
                    <ScatterText
                      as="span"
                      className="text-xs font-medium text-muted-foreground"
                      scrollStart={50}
                      scrollEnd={350}
                      distance={180}
                    >
                      {item.duration}
                    </ScatterText>
                  </div>
                </div>
                
                {/* Content Card */}
                <div className="ml-0 md:ml-24 p-8 md:p-10 lg:p-12 rounded-3xl glass-card rainbow-border transition-all duration-500">
                  {/* Short Description */}
                  <ScatterText
                    as="p"
                    className="text-base md:text-lg text-foreground leading-[1.6] mb-4 lg:mb-6 tracking-tight"
                    scrollStart={50}
                    scrollEnd={350}
                    distance={260}
                  >
                    {item.description}
                  </ScatterText>
                  
                  {/* Full Description */}
                  <ScatterText
                    as="p"
                    className="text-sm md:text-base text-muted-foreground leading-[1.8] tracking-wide mb-8 lg:mb-10"
                    scrollStart={50}
                    scrollEnd={350}
                    distance={260}
                  >
                    {item.fullDescription}
                  </ScatterText>
                  
                  {/* Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 mb-8 lg:mb-10">
                    {item.details.map((detail, i) => (
                      <div 
                        key={detail.title} 
                        className="flex items-start gap-4 p-4 lg:p-5 rounded-2xl bg-background/45 rainbow-border"
                      >
                        <div className="relative shrink-0 w-7 h-7 rounded-full bg-foreground/5 flex items-center justify-center mt-0.5">
                          <ScatterText
                            as="span"
                            className="relative z-10 text-xs font-bold text-foreground/70"
                            scrollStart={50}
                            scrollEnd={350}
                            distance={120}
                          >
                            {String(i + 1)}
                          </ScatterText>
                        </div>
                        <div className="flex-1 min-w-0">
                          <ScatterText
                            as="h4"
                            className="text-sm md:text-base font-bold mb-1 tracking-tight"
                            scrollStart={50}
                            scrollEnd={350}
                            distance={220}
                            gradient
                          >
                            {detail.title}
                          </ScatterText>
                          <ScatterText
                            as="p"
                            className="text-xs md:text-sm text-muted-foreground leading-[1.6]"
                            scrollStart={50}
                            scrollEnd={350}
                            distance={220}
                          >
                            {detail.desc}
                          </ScatterText>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Note */}
                  <ScatterText
                    as="p"
                    className="text-xs md:text-sm text-muted-foreground bg-foreground/5 px-4 py-3 rounded-xl rainbow-border"
                    scrollStart={50}
                    scrollEnd={350}
                    distance={220}
                  >
                    {item.note}
                  </ScatterText>
                </div>
              </div>
            </SectionReveal>
          ))}
        </div>
        
        {/* Process CTA */}
        <div className="text-center mt-16 lg:mt-24">
          <ScatterText
            as="p"
            className="text-base md:text-lg text-muted-foreground mb-8 lg:mb-10 leading-[1.8]"
            scrollStart={50}
            scrollEnd={350}
            distance={300}
          >
            ご不明点があれば、お気軽にお問い合わせください
          </ScatterText>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <ScatterBlock
              className="cta-primary group w-full rounded-full px-8 py-4 text-sm font-bold tracking-widest uppercase transition-all duration-300 sm:w-auto"
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
                  お問い合わせ
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
      </div>
    </section>
  )
}

export function AboutCtaSection() {
  return (
    <section className="py-32 md:py-40 lg:py-56 glass-light">
      <div className="container mx-auto px-6 md:px-12 lg:px-16 text-center">
        <ScatterText
          as="h2"
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight"
          scrollStart={50}
          scrollEnd={350}
          distance={400}
          gradient
        >
          一緒に、
        </ScatterText>
        <ScatterText
          as="span"
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6 lg:mb-8 block"
          scrollStart={50}
          scrollEnd={350}
          distance={400}
          gradient
        >
          つくりませんか？
        </ScatterText>
        <ScatterText
          as="p"
          className="text-base md:text-lg text-muted-foreground max-w-lg mx-auto mb-10 lg:mb-12 leading-[1.8] tracking-wide"
          scrollStart={50}
          scrollEnd={350}
          distance={300}
        >
          私たちは、あなたのビジネスの成長を本気で応援します。まずは気軽にお話しさせてください。
        </ScatterText>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <ScatterBlock
            className="cta-primary group w-full rounded-full px-8 py-4 text-sm font-bold tracking-widest uppercase transition-all duration-300 sm:w-auto"
            scrollEnd={350}
            distance={400}
            seed={20}
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
                お問い合わせフォーム
              </ScatterText>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </ScatterBlock>
          
          <ScatterBlock
            className="cta-secondary flex w-full items-center justify-center gap-3 rounded-full px-8 py-4 text-sm font-bold transition-all duration-300 sm:w-auto"
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
              080-9155-0426
            </ScatterText>
          </ScatterBlock>
        </div>
      </div>
    </section>
  )
}
