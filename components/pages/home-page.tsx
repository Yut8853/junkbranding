'use client'

import { ArrowRight } from 'lucide-react'
import { HeroTitle } from '@/components/hero-title'
import { TextReveal, SectionReveal, LineReveal } from '@/components/text-reveal'
import { MagneticButton } from '@/components/magnetic-button'
import { CircleButton } from '@/components/circle-button'
import { Footer } from '@/components/footer'
import { EnglishLabel, EnglishHeading, EnglishMarqueeText } from '@/components/english-text'

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
const marqueeTexts = ['Branding', 'Web Design', 'Graphic Design', 'Print Media', 'Logo Design', 'Art Direction']

export default function HomePageClient() {
  return (
    <>
      {/* Hero Section - 左寄せ */}
      <section className="relative min-h-[80vh] flex items-start overflow-hidden pb-16 sm:pb-20 md:pb-28">
        <div className="container mx-auto px-6 sm:px-6 md:px-12 pt-32 pb-3 md:pt-40 md:pb-32">
          <div className="max-w-6xl">
            <SectionReveal delay={0.2} duration={1.2} className="-mx-1 sm:mx-0 md:mx-2">
              <div className="mb-0 sm:mb-1 md:mb-2">
                <EnglishLabel
                  delay={0.3}
                  align="left"
                  textClassName="text-[clamp(3.35rem,16vw,8rem)] sm:text-[clamp(5rem,15vw,10rem)] md:text-[clamp(6.5rem,12vw,12rem)] lg:text-[clamp(8rem,10vw,14rem)] xl:text-[clamp(10rem,12vw,18rem)] leading-[0.74]"
                >
                  Beyond Good Design
                </EnglishLabel>
                <EnglishLabel
                  className="-mt-[clamp(1.35rem,6vw,6.5rem)]"
                  delay={0.36}
                  align="left"
                  textClassName="text-[clamp(2.55rem,12vw,6.25rem)] sm:text-[clamp(3.75rem,11vw,8rem)] md:text-[clamp(4.75rem,9vw,9.5rem)] lg:text-[clamp(6rem,8vw,11rem)] xl:text-[clamp(7rem,9vw,14rem)] leading-[0.74] text-foreground/85"
                >
                  by JUNK BLANDING
                </EnglishLabel>
              </div>
            </SectionReveal>

            <div className="-mt-1 sm:-mt-2 md:mt-0">
              <HeroTitle />
            </div>

            <SectionReveal delay={0.8} duration={1.2}>
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mt-6 sm:mt-8 leading-relaxed">
                小さくても、本気のブランディングを。<br />
                茨城発、2人だけのクリエイティブスタジオ。
              </p>
            </SectionReveal>

            <SectionReveal delay={1.1} duration={1} className="flex flex-wrap items-center gap-4 sm:gap-6 mt-10 sm:mt-12">
              <MagneticButton
                href="/contact"
                className="group px-6 sm:px-8 py-3.5 sm:py-4 bg-foreground text-background rounded-full font-medium btn-gradient-hover transition-all duration-300"
                data-cursor="Contact"
              >
                <span className="flex items-center gap-3">
                  まずは相談する
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </MagneticButton>
              
              <MagneticButton
                href="/about"
                className="group px-6 sm:px-8 py-3.5 sm:py-4 bg-foreground text-background rounded-full font-medium btn-gradient-hover transition-all duration-300"
                data-cursor="About"
              >
                <span className="flex items-center gap-3">
                  私たちについて
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </MagneticButton>
            </SectionReveal>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-4">
          <span className="text-xs uppercase tracking-widest text-muted-foreground rotate-90 origin-center translate-y-8 font-display">
            Scroll
          </span>
          <div className="w-[1px] h-16 bg-gradient-to-b from-border to-transparent" />
        </div>
      </section>

      {/* Marquee Section */}
      <section className="py-8 sm:py-12 md:py-16 border-y border-border/30 glass-light overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee">
          {[...marqueeTexts, ...marqueeTexts, ...marqueeTexts, ...marqueeTexts].map((text, i) => (
            <EnglishMarqueeText key={i} className="mx-4 sm:mx-8 md:mx-12">
              {text}
            </EnglishMarqueeText>
          ))}
        </div>
      </section>

      {/* About Preview Section - 左寄せ */}
      <section className="py-24 sm:py-32 md:py-48 glass-light">
        <div className="container mx-auto px-4 sm:px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-24 items-center">
            <LineReveal stagger={0.12}>
              <div className="line mb-[-1rem] sm:mb-[-2rem] md:mb-[-3rem]">
                <EnglishLabel delay={0.1} align="left">
                  About Us
                </EnglishLabel>
              </div>
              <div className="line">
                <TextReveal 
                  as="h2" 
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 sm:mb-8 leading-tight"
                  stagger={0.025}
                  delay={0.1}
                  gradient
                >
                  一人ひとりと向き合うものづくり
                </TextReveal>
              </div>
              <div className="line">
                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-8 sm:mb-10 text-balance">
                  私たちは大きな組織ではありません。だからこそ、一つひとつのプロジェクトに全力で向き合い、クライアントと同じ目線で、一緒に考え、一緒に創ります。
                </p>
              </div>
              <div className="line">
                <MagneticButton
                  href="/about"
                  className="group inline-flex items-center gap-3 px-6 py-3 bg-foreground text-background rounded-full btn-gradient-hover transition-all duration-300"
                  data-cursor="Learn"
                >
                  <span className="text-sm uppercase tracking-wider">もっと詳しく</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </MagneticButton>
              </div>
            </LineReveal>

            <SectionReveal delay={0.3} duration={1.2}>
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-card border border-border">
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                >
                  <source
                    src="https://videos.pexels.com/video-files/3209211/3209211-uhd_2560_1440_25fps.mp4"
                    type="video/mp4"
                  />
                </video>
                <div className="absolute inset-0 bg-gradient-to-br from-foreground/10 via-transparent to-foreground/5" />
                <div className="absolute bottom-6 sm:bottom-8 right-6 sm:right-8 w-20 sm:w-24 h-[1px] bg-primary" />
              </div>
            </SectionReveal>
          </div>
        </div>
      </section>

      {/* Services Section - 左寄せ */}
      <section className="py-24 sm:py-32 md:py-48 glass-card">
        <div className="container mx-auto px-4 sm:px-6 md:px-12">
          <div className="mb-16 sm:mb-20 md:mb-32">
            <div className="mb-[-1rem] sm:mb-[-2rem] md:mb-[-3rem]">
              <EnglishLabel delay={0} align="left">
                Services
              </EnglishLabel>
            </div>
            <TextReveal 
              as="h2" 
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight"
              delay={0.1}
              stagger={0.03}
              gradient
            >
              私たちにできること
            </TextReveal>
          </div>

          <div className="space-y-0">
            {services.map((service, index) => (
              <SectionReveal 
                key={service.num} 
                delay={index * 0.1}
                duration={1}
              >
                <div className="group py-8 sm:py-10 md:py-12 border-t border-border hover:bg-card/30 transition-colors duration-500">
                  <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-8">
                    <span className="text-xs sm:text-sm text-muted-foreground font-mono shrink-0 w-8 pt-2 md:pt-4">{service.num}</span>
                    <div className="flex-1 min-w-0">
                      <EnglishHeading delay={0.1 + index * 0.05} outline align="left">
                        {service.title}
                      </EnglishHeading>
                      <p className="text-sm sm:text-base text-primary mt-3 font-medium">{service.titleJa}</p>
                    </div>
                    <p className="text-sm sm:text-base text-muted-foreground max-w-md leading-relaxed text-pretty shrink-0 md:w-80 lg:w-96 md:pt-4">
                      {service.description}
                    </p>
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Works Section - 中央寄せ */}
      <section className="py-24 sm:py-32 md:py-48 glass-light">
        <div className="container mx-auto px-4 sm:px-6 md:px-12">
          <div className="text-center mb-12 sm:mb-16 md:mb-20">
            <div className="mb-[-1rem] sm:mb-[-2rem] md:mb-[-3rem]">
              <EnglishLabel delay={0} align="center">
                Works
              </EnglishLabel>
            </div>
            <TextReveal 
              as="h2" 
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 sm:mb-8"
              delay={0.1}
              stagger={0.03}
              gradient
            >
              制作実績
            </TextReveal>
            <SectionReveal delay={0.3} duration={1}>
              <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
                クライアントと共に創り上げたプロジェクトの一部をご紹介します。
              </p>
            </SectionReveal>
          </div>

          <SectionReveal delay={0.4} duration={1.2}>
            <div className="relative p-8 sm:p-12 md:p-16 rounded-2xl glass-card border border-border/30 text-center">
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-8">
                実績ページで詳しくご覧いただけます
              </p>
              <MagneticButton
                href="/works"
                className="group px-6 sm:px-8 py-3.5 sm:py-4 bg-foreground text-background rounded-full font-medium btn-gradient-hover transition-all duration-300"
                data-cursor="Works"
              >
                <span className="flex items-center gap-3">
                  実績を見る
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </MagneticButton>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* Area Section - 中央寄せ */}
      <section className="py-24 sm:py-32 md:py-40 border-y border-border/30 glass-card overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 md:px-12 text-center">
          <div className="mb-[-1rem] sm:mb-[-2rem] md:mb-[-3rem]">
            <EnglishLabel delay={0} align="center">
              Area
            </EnglishLabel>
          </div>
          <TextReveal 
            as="h2" 
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 sm:mb-8"
            delay={0.1}
            stagger={0.03}
          >
            対応エリア
          </TextReveal>
          <TextReveal 
            as="p" 
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 sm:mb-8"
            delay={0.25}
            stagger={0.02}
            duration={0.7}
            gradient
          >
            茨城・東京・神奈川
          </TextReveal>
          <SectionReveal delay={0.5} duration={1}>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed text-balance">
              上記エリアを中心に活動していますが、オンラインでのお打ち合わせも可能です。全国どこからでもお気軽にご相談ください。
            </p>
          </SectionReveal>
        </div>
      </section>

      {/* CTA Section - 中央寄せ */}
      <section className="py-24 sm:py-32 md:py-48 overflow-hidden glass-light">
        <div className="container mx-auto px-4 sm:px-6 md:px-12 text-center">
          <div className="mb-[-1rem] sm:mb-[-2rem] md:mb-[-3rem]">
            <EnglishLabel delay={0} align="center">
              Contact
            </EnglishLabel>
          </div>
          <TextReveal 
            as="h2" 
            className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight mb-6 sm:mb-8"
            delay={0.1}
            stagger={0.025}
            gradient
          >
            まずは、お話しませんか？
          </TextReveal>
          <SectionReveal delay={0.4} duration={1}>
            <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto mb-10 sm:mb-12 text-balance">
              「こんなこと頼めるのかな？」という段階でも大丈夫。お気軽にご連絡ください。
            </p>
          </SectionReveal>
          
          <SectionReveal delay={0.5} duration={1.2}>
            <CircleButton href="/contact" size="lg">
              080-9155-0426
            </CircleButton>
          </SectionReveal>
        </div>
      </section>

      <Footer />
    </>
  )
}
