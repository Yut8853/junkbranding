'use client'

import Image from 'next/image'
import { ArrowRight, Phone } from 'lucide-react'
import { SectionReveal } from '@/components/motion/text-reveal'
import { ScatterText } from '@/components/motion/scatter-text'
import { ScatterBlock } from '@/components/motion/scatter-block'
import type {
  AboutTeamSectionProps,
  AboutValuesSectionProps,
} from '@/types/about-page'
export { AboutProcessSection } from '@/components/pages/about/about-process-section'

export function AboutHeroSection() {
  return (
    <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden">
      {/* Background giant text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.03]">
        <span className="type-display text-[42vw] whitespace-nowrap">
          ABOUT
        </span>
      </div>

      {/* Marquee decoration */}
      <div className="absolute inset-0 flex flex-col justify-center pointer-events-none select-none overflow-hidden opacity-[0.04]">
        <div className="flex whitespace-nowrap animate-marquee-slow">
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={`marquee-1-${i}`} className="type-display text-[6vw] mx-8 marquee-stroke">
              ABOUT US
            </span>
          ))}
        </div>
        <div className="flex whitespace-nowrap animate-marquee-slow-reverse mt-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={`marquee-2-${i}`} className="type-display text-[6vw] mx-8 marquee-stroke">
              JUNK BRANDING
            </span>
          ))}
        </div>
      </div>

      <div className="container relative z-10 mx-auto px-6 md:px-12 lg:px-16 text-center">
        <div className="overflow-visible">
          <ScatterText
            as="h1"
            className="type-display text-[10vw] md:text-[8vw] lg:text-[6.5vw] leading-[0.9] tracking-[-0.04em]"
            distance={900}
            gradient
          >
            ABOUT US
          </ScatterText>
        </div>

        <div className="overflow-visible mt-8">
          <ScatterText
            as="p"
            className="type-body text-base md:text-lg text-muted-foreground max-w-lg mx-auto"
            distance={400}
          >
            2人だけの小さなスタジオだからこそ、できることがあります。
          </ScatterText>
        </div>
      </div>

      {/* Scroll indicator */}
      <div 
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
      >
        <span className="type-label text-muted-foreground text-xs">Scroll to explore</span>
        <div className="w-px h-16 bg-gradient-to-b from-foreground/40 to-transparent animate-pulse" />
      </div>
    </section>
  )
}

export function AboutIntroSection() {
  return (
    <section className="relative py-24 md:py-32 lg:py-40 glass-light overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div className="lg:pr-8">
            <div className="mb-8 overflow-visible">
              <ScatterText
                as="h2"
                className="type-section-title text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[1.1]"
                scrollStart={50}
                scrollEnd={400}
                distance={600}
                gradient
              >
                大手にはできない、丁寧なものづくり
              </ScatterText>
            </div>

            <div className="space-y-5 text-base md:text-lg text-muted-foreground">
              <ScatterText
                as="p"
                className="type-body"
                scrollStart={50}
                scrollEnd={400}
                distance={300}
              >
                JunkBrandingは、茨城・東京・神奈川を中心に活動する、2人だけのブランディング&Web制作スタジオです。
              </ScatterText>
              <ScatterText
                as="p"
                className="type-body"
                scrollStart={50}
                scrollEnd={400}
                distance={300}
              >
                大きな組織では難しい「一人ひとりと向き合う」ことを大切に、クライアントと同じ目線で、一緒に考え、一緒に創ります。
              </ScatterText>
              <ScatterText
                as="p"
                className="type-body"
                scrollStart={50}
                scrollEnd={400}
                distance={300}
              >
                「ちょっとした相談」から「本格的なリブランディング」まで、まずはお気軽にお声がけください。
              </ScatterText>
            </div>
          </div>

          <SectionReveal delay={0.3} duration={1.2}>
            <div className="relative">
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden glass-card rainbow-border group">
                <Image
                  src="/images/home-office-two-person-rainbow.webp"
                  alt="JunkBranding Studio - クリエイティブスタジオのワークスペース"
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-110"
                  sizes="(max-width: 768px) calc(100vw - 48px), 50vw"
                  quality={64}
                />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,95,162,0.22),transparent_34%),radial-gradient(circle_at_80%_35%,rgba(75,180,255,0.18),transparent_32%),linear-gradient(135deg,rgba(255,215,95,0.12),transparent_35%,rgba(165,105,255,0.16))] mix-blend-screen" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/85 via-transparent to-transparent" />
                
                {/* Floating label */}
                <div className="absolute bottom-8 left-8 right-8">
                  <span className="type-label text-foreground/60 mb-2 block">Studio</span>
                  <span className="type-card-title text-2xl gradient-text">JunkBranding</span>
                </div>
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
    <section className="relative py-24 md:py-32 lg:py-40 glass-card overflow-hidden">
      {/* Background text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.02]">
        <span className="type-display text-[32vw] whitespace-nowrap">TEAM</span>
      </div>

      <div className="container relative z-10 mx-auto px-6 md:px-12 lg:px-16">
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
              TEAM
            </ScatterText>
          </div>
          <ScatterText
            as="p"
            className="type-body text-base md:text-lg text-muted-foreground mt-5"
            scrollStart={50}
            scrollEnd={400}
            distance={300}
          >
            2人だけの、小さなチーム
          </ScatterText>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 max-w-5xl mx-auto">
          {team.map((member, index) => (
            <TeamMemberCard key={member.name} member={member} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

function TeamMemberCard({
  member,
  index,
}: {
  member: AboutTeamSectionProps['team'][0]
  index: number
}) {
  return (
    <SectionReveal delay={index * 0.2} duration={1}>
      <div className="group">
        <div className="relative aspect-[3/4] mb-8 rounded-3xl overflow-hidden glass-card rainbow-border">
          <Image
            src={member.image}
            alt={`${member.name} - ${member.role}`}
            fill
            className="object-cover transition-all duration-1000 group-hover:scale-110 filter grayscale-[20%] group-hover:grayscale-0"
            sizes="(max-width: 768px) calc(100vw - 48px), (max-width: 1200px) 50vw, 33vw"
            quality={64}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />
          
          {/* Hover gradient overlay */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-br from-primary/20 via-transparent to-accent/20" />
          
          {/* Name overlay */}
          <div className="absolute bottom-8 left-8 right-8">
            <span className="type-label text-foreground/60 mb-2 block">{member.role}</span>
            <h3 className="type-section-title text-3xl md:text-4xl gradient-text mb-1">
              {member.name}
            </h3>
            <span className="type-body-compact text-sm text-foreground/50">{member.nameEn}</span>
          </div>
        </div>

        <ScatterText
          as="p"
          className="type-body text-base md:text-lg text-muted-foreground"
          scrollStart={50}
          scrollEnd={400}
          distance={250}
        >
          {member.description}
        </ScatterText>
      </div>
    </SectionReveal>
  )
}

export function AboutValuesSection({ values }: AboutValuesSectionProps) {
  return (
    <section className="relative py-24 md:py-32 lg:py-40 glass-light overflow-hidden">
      {/* Background text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.02]">
        <span className="type-display text-[30vw] whitespace-nowrap">VALUES</span>
      </div>

      <div className="container relative z-10 mx-auto px-6 md:px-12 lg:px-16">
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
              VALUES
            </ScatterText>
          </div>
          <ScatterText
            as="p"
            className="type-body text-base md:text-lg text-muted-foreground mt-5"
            scrollStart={50}
            scrollEnd={400}
            distance={300}
          >
            大切にしていること
          </ScatterText>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {values.map((value, index) => (
            <ValueCard key={value.title} value={value} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

function ValueCard({
  value,
  index,
}: {
  value: AboutValuesSectionProps['values'][0]
  index: number
}) {
  return (
    <SectionReveal delay={index * 0.15} duration={0.8}>
      <div
        className="group relative text-center p-10 md:p-12 lg:p-16 rounded-3xl glass-card rainbow-border transition-all duration-500 hover:scale-105"
      >
        <div className="relative z-10">
          <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-8 rounded-full bg-foreground/5 flex items-center justify-center group-hover:bg-foreground/10 transition-colors duration-500">
            <value.icon className="w-7 h-7 md:w-8 md:h-8 text-foreground/60 group-hover:text-foreground transition-colors duration-500" />
          </div>

          <ScatterText
            as="h3"
            className="type-section-title text-2xl md:text-3xl mb-2 gradient-text"
            scrollStart={50}
            scrollEnd={350}
            distance={260}
            gradient
          >
            {value.title}
          </ScatterText>
          <ScatterText
            as="span"
            className="type-label text-muted-foreground mb-6 block"
            scrollStart={50}
            scrollEnd={350}
            distance={180}
          >
            {value.titleEn}
          </ScatterText>
          <ScatterText
            as="p"
            className="type-body text-base md:text-lg text-muted-foreground"
            scrollStart={50}
            scrollEnd={350}
            distance={220}
          >
            {value.description}
          </ScatterText>
        </div>
      </div>
    </SectionReveal>
  )
}

export function AboutContactSection() {
  return (
    <section className="relative py-32 md:py-40 lg:py-56 glass-light overflow-hidden">
      {/* Background text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.02]">
        <span className="type-display text-[30vw] whitespace-nowrap">CONTACT</span>
      </div>

      <div className="container relative z-10 mx-auto px-6 md:px-12 lg:px-16 text-center">
        <div className="overflow-visible mb-8">
          <ScatterText
            as="h2"
            className="type-section-title text-4xl sm:text-5xl md:text-6xl lg:text-7xl"
            scrollStart={50}
            scrollEnd={400}
            distance={600}
            gradient
          >
            お気軽にご相談ください
          </ScatterText>
        </div>

        <ScatterText
          as="p"
          className="type-body text-lg md:text-xl text-muted-foreground max-w-xl mx-auto mb-12"
          scrollStart={50}
          scrollEnd={400}
          distance={300}
        >
          初回のご相談は無料です。まずはお話をお聞かせください。
        </ScatterText>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <ScatterBlock
            className="cta-primary type-cta group w-full rounded-full px-8 py-4 text-sm transition-all duration-300 sm:w-auto"
            scrollEnd={350}
            distance={400}
            seed={30}
            href="/contact"
          >
            <span className="flex items-center justify-center gap-4">
              <ScatterText
                as="span"
                className="type-readable-number inline-block"
                scrollStart={50}
                scrollEnd={350}
                distance={180}
              >
                無料相談を予約する
              </ScatterText>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </ScatterBlock>

          <ScatterBlock
            className="cta-secondary flex w-full items-center justify-center gap-3 rounded-full px-8 py-4 text-sm font-bold transition-all duration-300 sm:w-auto"
            scrollEnd={350}
            distance={400}
            seed={31}
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
