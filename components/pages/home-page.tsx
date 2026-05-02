'use client'

import { SectionReveal } from '@/components/text-reveal'
import { Footer } from '@/components/footer'
import { ScatterText } from '@/components/scatter-text'
import { ScatterBlock } from '@/components/scatter-block'
import { HeroSectionV2 } from '@/components/hero-section-v2'
import { ServicesSectionV2 } from '@/components/services-section-v2'
import { CTASectionV2 } from '@/components/cta-section-v2'
import { MarqueeSectionV2 } from '@/components/marquee-section-v2'

export default function HomePageClient() {
  return (
    <>
      {/* Hero Section v2 - 3D Perspective + Scroll Pin */}
      <HeroSectionV2 />

      {/* Marquee Section v2 - Bidirectional */}
      <MarqueeSectionV2 />

      {/* About Preview Section */}
      <section className="py-32 md:py-40 lg:py-56 glass-light">
        <div className="container mx-auto px-6 md:px-12 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div className="lg:pr-8">
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
              <div className="mb-8 lg:mb-10">
                <ScatterText
                  as="h2"
                  className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.2]"
                  scrollStart={50}
                  scrollEnd={350}
                  distance={400}
                  gradient
                >
                  一人ひとりと向き合うものづくり
                </ScatterText>
              </div>
              <ScatterText
                as="p"
                className="text-base md:text-lg text-muted-foreground leading-[1.8] tracking-wide mb-10 lg:mb-12 max-w-lg"
                scrollStart={50}
                scrollEnd={350}
                distance={300}
              >
                私たちは大きな組織ではありません。だからこそ、一つひとつのプロジェクトに全力で向き合い、クライアントと同じ目線で、一緒に考え、一緒に創ります。
              </ScatterText>
              <ScatterBlock
                className="inline-flex items-center gap-4 px-8 py-4 bg-foreground text-background rounded-full text-sm font-medium tracking-widest uppercase cursor-pointer hover:bg-foreground/90 transition-colors"
                scrollEnd={350}
                distance={400}
                seed={1}
                href="/about"
              >
                もっと詳しく →
              </ScatterBlock>
            </div>

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

      {/* Services Section v2 - Accordion Hover + Count-up */}
      <ServicesSectionV2 />

      {/* Works Section */}
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
                Works
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
              制作実績
            </ScatterText>
            <ScatterText
              as="p"
              className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto leading-[1.8] tracking-wide"
              scrollStart={50}
              scrollEnd={350}
              distance={300}
            >
              クライアントと共に創り上げたプロジェクトの一部をご紹介します。
            </ScatterText>
          </div>

          <div className="relative p-10 md:p-14 lg:p-20 rounded-3xl glass-card border border-border/20 text-center max-w-3xl mx-auto">
            <ScatterText
              as="p"
              className="text-base md:text-lg text-muted-foreground mb-8 lg:mb-10 leading-[1.8]"
              scrollStart={50}
              scrollEnd={350}
              distance={300}
            >
              実績ページで詳しくご覧いただけます
            </ScatterText>
            <ScatterBlock
              className="inline-flex items-center gap-4 px-8 py-4 bg-foreground text-background rounded-full text-sm font-medium tracking-widest uppercase cursor-pointer hover:bg-foreground/90 transition-colors"
              scrollEnd={350}
              distance={400}
              seed={2}
              href="/works"
            >
              実績を見る →
            </ScatterBlock>
          </div>
        </div>
      </section>

      {/* Area Section */}
      <section className="py-32 md:py-40 lg:py-48 border-y border-border/20 glass-card overflow-hidden">
        <div className="container mx-auto px-6 md:px-12 lg:px-16 text-center">
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
              Area
            </ScatterText>
          </div>
          <ScatterText
            as="h2"
            className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-8 lg:mb-10"
            scrollStart={50}
            scrollEnd={350}
            distance={400}
          >
            対応エ��ア
          </ScatterText>
          <ScatterText
            as="p"
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-8 lg:mb-10 tracking-tight"
            scrollStart={50}
            scrollEnd={350}
            distance={500}
            gradient
          >
            茨城・東京・神奈川
          </ScatterText>
          <ScatterText
            as="p"
            className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto leading-[1.8] tracking-wide"
            scrollStart={50}
            scrollEnd={350}
            distance={300}
          >
            上記エリアを中心に活動していますが、オンラインでのお打ち合わせも可能です。全国どこからでもお気軽にご相談ください。
          </ScatterText>
        </div>
      </section>

      {/* CTA Section v2 - Giant Magnet + Particles */}
      <CTASectionV2 />

      <Footer />
    </>
  )
}
