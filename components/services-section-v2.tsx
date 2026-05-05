'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScatterText } from './scatter-text'
import { useIsMobile } from '@/hooks/use-mobile'

gsap.registerPlugin(ScrollTrigger)

const services = [
  {
    num: '01',
    title: 'Web Design',
    titleJa: 'Webデザイン',
    description: 'ユーザー体験を最優先に、ブランドの世界観を表現するWebサイトをデザインします。直感的なナビゲーション、美しいビジュアル、そしてコンバージョンを意識した設計で、訪問者の心を掴みます。',
    features: ['UI/UXデザイン', 'レスポンシブ対応', 'プロトタイピング', 'ユーザビリティ設計'],
    color: 'oklch(0.7 0.22 330)',
  },
  {
    num: '02',
    title: 'Branding',
    titleJa: 'ブランディング',
    description: 'ロゴ、カラー、トーン&マナーなど、ブランドの核となるアイデンティティを構築します。一貫性のあるブランド体験を通じて、顧客との深い信頼関係を築き上げます。',
    features: ['ロゴデザイン', 'カラーシステム', 'ブランドガイドライン', 'ビジュアルアイデンティティ'],
    color: 'oklch(0.7 0.2 25)',
  },
  {
    num: '03',
    title: 'Development',
    titleJa: '開発・実装',
    description: '高速で安全、そして保守性の高いWebサイトを、最新技術で実装します。Next.js、React、TypeScriptなどのモダンな技術スタックで、スケーラブルなソリューションを提供。',
    features: ['フロントエンド開発', 'CMS構築', 'パフォーマンス最適化', 'SEO対策'],
    color: 'oklch(0.7 0.18 80)',
  },
  {
    num: '04',
    title: 'Consulting',
    titleJa: 'コンサルティング',
    description: 'Web戦略の立案から運用まで、ビジネス成長に貢献する提案を行います。データ分析に基づく改善提案と、長期的なパートナーシップで、持続的な成果を実現します。',
    features: ['戦略立案', 'データ分析', '改善提案', '運用サポート'],
    color: 'oklch(0.65 0.2 220)',
  },
]

export function ServicesSectionV2() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const itemsRef = useRef<(HTMLDivElement | null)[]>([])
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [countedNumbers, setCountedNumbers] = useState<string[]>(['00', '00', '00', '00'])
  const isMobile = useIsMobile()

  // Counter animation
  const animateCounter = useCallback((index: number) => {
    const targetNum = parseInt(services[index].num)
    let current = 0
    const duration = 600
    const startTime = performance.now()

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      current = Math.floor(eased * targetNum)
      
      setCountedNumbers(prev => {
        const newNumbers = [...prev]
        newNumbers[index] = current.toString().padStart(2, '0')
        return newNumbers
      })

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [])

  // GSAP animations
  useEffect(() => {
    if (!sectionRef.current) return

    const isInvertedHome = sectionRef.current.closest('.home-ascent-page--inverted') !== null

    if (isMobile || isInvertedHome) {
      setCountedNumbers(services.map((service) => service.num))
      if (headerRef.current) {
        gsap.set(headerRef.current, { clearProps: 'all' })
      }
      itemsRef.current.forEach((item) => {
        if (item) gsap.set(item, { clearProps: 'all' })
      })
      return
    }

    const ctx = gsap.context(() => {
      // Header reveal
      gsap.from(headerRef.current, {
        y: 48,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom-=50',
        },
      })

      // Items staggered reveal
      itemsRef.current.forEach((item, index) => {
        if (!item) return

        gsap.from(item, {
          y: 48,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: item,
            start: 'top bottom-=50',
            onEnter: () => animateCounter(index),
          },
        })
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [animateCounter, isMobile])

  return (
    <section 
      ref={sectionRef}
      className="py-32 md:py-40 lg:py-56 relative overflow-hidden"
    >
      {/* Background gradient accent */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          background: !isMobile && activeIndex !== null
            ? `radial-gradient(ellipse 80% 50% at 50% 50%, ${services[activeIndex].color}, transparent 70%)`
            : 'transparent',
          transition: isMobile ? 'none' : 'background 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      />

      <div className="container mx-auto px-6 md:px-12 lg:px-16 relative z-10">
        {/* Header */}
        <div ref={headerRef} className="mb-16 lg:mb-24 text-center">
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
              Services
            </ScatterText>
          </div>
          <ScatterText 
            as="h2" 
            className="type-section-title text-2xl sm:text-3xl md:text-4xl lg:text-5xl"
            scrollStart={50}
            scrollEnd={350}
            distance={400}
            gradient
          >
            私たちにできること
          </ScatterText>
        </div>

        {/* Service items - Card style */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {services.map((service, index) => (
            <div
              key={service.num}
              ref={el => { itemsRef.current[index] = el }}
              className="group relative p-8 md:p-10 lg:p-12 rounded-3xl border border-foreground/10 bg-background/50 backdrop-blur-sm"
              onMouseEnter={() => !isMobile && setActiveIndex(index)}
              onMouseLeave={() => !isMobile && setActiveIndex(null)}
              style={{
                transition: isMobile ? 'none' : 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                transform: !isMobile && activeIndex === index ? 'translateY(-4px)' : 'translateY(0)',
                boxShadow: !isMobile && activeIndex === index
                  ? `0 20px 40px -20px ${service.color}40`
                  : 'none',
              }}
            >
              {/* Hover background */}
              <div 
                className="absolute inset-0 rounded-2xl -z-10"
                style={{
                  background: !isMobile && activeIndex === index
                    ? `linear-gradient(135deg, ${service.color}08, ${service.color}03)`
                    : 'transparent',
                  transition: isMobile ? 'none' : 'background 0.5s ease',
                }}
              />

              {/* Number */}
              <div className="flex items-start justify-between mb-6">
                <ScatterText
                  as="span"
                  className="type-display font-mono text-5xl md:text-6xl lg:text-7xl tabular-nums"
                  scrollStart={50}
                  scrollEnd={350}
                  distance={180}
                  style={{
                    color: !isMobile && activeIndex === index ? service.color : 'var(--foreground)',
                    opacity: !isMobile && activeIndex === index ? 1 : 0.15,
                    transition: isMobile ? 'none' : 'all 0.5s ease',
                  }}
                >
                  {countedNumbers[index]}
                </ScatterText>
                
                {/* Color indicator */}
                <div 
                  className="w-3 h-3 rounded-full mt-2"
                  style={{
                    background: service.color,
                    opacity: !isMobile && activeIndex === index ? 1 : 0.4,
                    transform: !isMobile && activeIndex === index ? 'scale(1.5)' : 'scale(1)',
                    transition: isMobile ? 'none' : 'all 0.5s ease',
                  }}
                />
              </div>

              {/* Content */}
              <div className="space-y-4">
                {/* English title */}
                <ScatterText
                  as="h3"
                  className="type-eyebrow text-3xl md:text-4xl lg:text-5xl"
                  scrollStart={50}
                  scrollEnd={350}
                  distance={300}
                  style={{
                    color: !isMobile && activeIndex === index ? service.color : 'var(--foreground)',
                    transition: isMobile ? 'none' : 'color 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                >
                  {service.title}
                </ScatterText>
                
                {/* Japanese title */}
                <ScatterText
                  as="p"
                  className="type-card-title text-base md:text-lg"
                  scrollStart={50}
                  scrollEnd={350}
                  distance={240}
                  style={{
                    color: !isMobile && activeIndex === index ? service.color : 'var(--primary)',
                    transition: isMobile ? 'none' : 'color 0.3s ease',
                  }}
                >
                  {service.titleJa}
                </ScatterText>

                {/* Description */}
                <ScatterText
                  as="p"
                  className="type-body-compact text-sm md:text-base text-muted-foreground"
                  scrollStart={50}
                  scrollEnd={350}
                  distance={260}
                >
                  {service.description}
                </ScatterText>

                {/* Features */}
                <div className="pt-4 border-t border-foreground/5">
                  <div className="flex flex-wrap gap-2">
                    {service.features.map((feature, i) => (
                      <span 
                        key={i}
                        className="type-body-compact text-xs md:text-sm px-3 py-1.5 rounded-full border"
                        style={{
                          borderColor: !isMobile && activeIndex === index ? `${service.color}40` : 'var(--border)',
                          background: !isMobile && activeIndex === index ? `${service.color}10` : 'transparent',
                          color: !isMobile && activeIndex === index ? service.color : 'var(--muted-foreground)',
                          transition: isMobile
                            ? 'none'
                            : [
                                `border-color 0.3s ease ${i * 0.05}s`,
                                `background 0.3s ease ${i * 0.05}s`,
                                `color 0.3s ease ${i * 0.05}s`,
                              ].join(', '),
                        }}
                      >
                        <ScatterText
                          as="span"
                          className="inline-block"
                          scrollStart={50}
                          scrollEnd={350}
                          distance={160}
                        >
                          {feature}
                        </ScatterText>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Corner accent */}
              <div 
                className="absolute top-0 right-0 w-16 h-16 overflow-hidden rounded-tr-2xl"
                style={{
                  opacity: !isMobile && activeIndex === index ? 1 : 0,
                  transition: isMobile ? 'none' : 'opacity 0.5s ease',
                }}
              >
                <div 
                  className="absolute -top-8 -right-8 w-16 h-16 rounded-full"
                  style={{
                    background: `radial-gradient(circle, ${service.color}30, transparent 70%)`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
