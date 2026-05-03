'use client'

import { useRef, useEffect, useState, useCallback, useMemo } from 'react'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight, Phone, MessageCircle } from 'lucide-react'
import { SectionReveal } from '@/components/text-reveal'
import { Footer } from '@/components/footer'
import { ScatterText } from '@/components/scatter-text'
import { ScatterBlock } from '@/components/scatter-block'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { PortfolioWork, WorkCardProps } from '@/types/works-page'

gsap.registerPlugin(ScrollTrigger)

// Works data
const works = [
  {
    id: 1,
    title: 'JunkBranding',
    category: 'ポートフォリオサイト',
    description: '自身のクリエイティブと思想を表現するポートフォリオサイト。WebGLやアニメーションを活用し、ブランド体験としてのサイト設計を行いました。',
    tags: ['Web Design', 'Development', 'Branding'],
    stack: ['Next.js', 'TypeScript', 'Three.js', 'GSAP'],
    url: 'https://junkbranding.com/',
    year: '2026',
  },
  {
    id: 2,
    title: 'TO PLACE',
    category: 'コーポレートサイト',
    description: '不動産会社のコーポレートサイト。信頼感と先進性を両立したデザイン。',
    tags: ['Web Design', 'Development', 'Branding'],
    stack: ['Three.js', 'GSAP'],
    url: 'https://to-place.co.jp/',
    year: '2024',
  },
  {
    id: 3,
    title: 'LUZ REAL',
    category: 'コーポレートサイト',
    description: '洗練されたビジュアルと使いやすさを追求したコーポレートサイト。',
    tags: ['Web Design', 'Development', 'Branding'],
    stack: ['Three.js', 'GSAP'],
    url: 'https://luz-real.com/',
    year: '2025',
  },
] satisfies PortfolioWork[]

// Categories for filter
const categories = ['すべて', ...Array.from(new Set(works.map((work) => work.category)))]

// Work card component
function WorkCard({ 
  work, 
  index, 
  onHover,
  isHovered
}: WorkCardProps) {
  const cardRef = useRef<HTMLAnchorElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const formattedIndex = String(index + 1).padStart(2, '0')

  const handleMouseEnter = () => {
    onHover(index)
  }

  const handleMouseLeave = () => {
    onHover(null)
  }

  // Scroll animation using gsap.context for clean scoping
  useEffect(() => {
    const card = cardRef.current
    if (!card) return

    const ctx = gsap.context(() => {
      let hasRevealed = false

      const revealCard = () => {
        if (hasRevealed) return
        hasRevealed = true

        gsap.to(card, {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
        })
      }

      gsap.set(card, { opacity: 0, y: 80 })

      const trigger = ScrollTrigger.create({
        trigger: card,
        start: 'top 85%',
        invalidateOnRefresh: true,
        onEnter: revealCard,
        onLeaveBack: () => {
          hasRevealed = false
          gsap.set(card, { opacity: 0, y: 80 })
        },
      })

      requestAnimationFrame(() => {
        if (card.getBoundingClientRect().top <= window.innerHeight * 0.85) {
          revealCard()
        } else {
          trigger.refresh()
        }
      })
    }, card)

    return () => ctx.revert() // Cleanup only this card's triggers
  }, [work.id]) // Re-run when the item itself changes via filter

  // 3D tilt effect on hover
  useEffect(() => {
    const card = cardRef.current
    const image = imageRef.current
    if (!card || !image) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const centerX = rect.width / 2
      const centerY = rect.height / 2
      const rotateX = (y - centerY) / 30
      const rotateY = (centerX - x) / 30

      gsap.to(image, {
        rotateX: -rotateX,
        rotateY: rotateY,
        duration: 0.4,
        ease: 'power2.out',
        transformPerspective: 1000,
      })
    }

    const handleMouseLeave = () => {
      gsap.to(image, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.6,
        ease: 'power2.out',
      })
    }

    card.addEventListener('mousemove', handleMouseMove)
    card.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      card.removeEventListener('mousemove', handleMouseMove)
      card.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  return (
    <Link
      ref={cardRef}
      href={work.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={`grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-12 items-center py-8 sm:py-12 lg:py-16 px-4 sm:px-6 md:px-8 rounded-3xl rainbow-border transition-all duration-500 ${isHovered ? 'glass-card shadow-[0_24px_80px_rgba(0,0,0,0.06)]' : 'bg-card/35'}`}>
        <div className="hidden lg:flex lg:col-span-1 items-center justify-center">
          <ScatterText
            as="span"
            className={`inline-flex min-w-[1.4em] whitespace-nowrap text-4xl lg:text-5xl xl:text-6xl font-bold tabular-nums transition-all duration-500 ${isHovered ? 'gradient-text' : 'text-foreground/10'}`}
            scrollStart={50}
            scrollEnd={350}
            distance={180}
          >
            {formattedIndex}
          </ScatterText>
        </div>

        <div className="lg:col-span-5">
          <div 
            ref={imageRef}
            className={`relative aspect-[16/10] rounded-2xl overflow-hidden rainbow-border transition-all duration-500 ${isHovered ? 'glass-card' : 'bg-card/55'}`}
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div className={`absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/10 to-primary/5 transition-opacity duration-700 ${isHovered ? 'opacity-100' : 'opacity-60'}`} />
            
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-[6rem] sm:text-[8rem] md:text-[10rem] font-bold transition-all duration-700 ${isHovered ? 'gradient-text scale-110' : 'text-foreground/[0.03] scale-100'}`}>
                {work.title.charAt(0)}
              </span>
            </div>

            <div className="absolute top-4 left-4 z-10">
              <ScatterText
                as="span"
                className="px-3 py-1.5 text-xs bg-foreground text-background rounded-full"
                scrollStart={50}
                scrollEnd={350}
                distance={160}
              >
                {work.category}
              </ScatterText>
            </div>

            <div className="absolute top-4 right-4 z-10">
              <ScatterText
                as="span"
                className="px-3 py-1.5 text-xs font-mono bg-background/80 backdrop-blur-sm rounded-full rainbow-border"
                scrollStart={50}
                scrollEnd={350}
                distance={160}
              >
                {work.year}
              </ScatterText>
            </div>

            <div className={`absolute inset-0 rounded-2xl flex items-center justify-center transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`} style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.86), rgba(255,255,255,0.62))' }}>
              <span className="text-foreground flex items-center gap-3 text-xl sm:text-2xl font-bold uppercase tracking-[0.15em] font-display">
                <ScatterText
                  as="span"
                  className="inline-block"
                  scrollStart={50}
                  scrollEnd={350}
                  distance={180}
                >
                  View Project
                </ScatterText>
                <ArrowUpRight className="w-6 h-6" />
              </span>
            </div>

            <div className="lg:hidden absolute bottom-4 left-4 z-10">
              <ScatterText
                as="span"
                className="inline-flex whitespace-nowrap text-4xl font-bold tabular-nums"
                scrollStart={50}
                scrollEnd={350}
                distance={180}
                gradient
              >
                {formattedIndex}
              </ScatterText>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6">
          <ScatterText
            as="h3"
            className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight mb-3 sm:mb-4"
            scrollStart={50}
            scrollEnd={350}
            distance={300}
            gradient
          >
            {work.title}
          </ScatterText>
          
          <ScatterText
            as="p"
            className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-6 text-balance"
            scrollStart={50}
            scrollEnd={350}
            distance={260}
          >
            {work.description}
          </ScatterText>

          <div className="flex flex-wrap gap-2 mb-6">
            {work.tags.map((tag) => (
              <ScatterText
                as="span"
                key={tag}
                className={`text-xs px-3 py-1.5 rounded-full border transition-all duration-500 ${
                  isHovered 
                    ? 'border-primary/50 bg-primary/5 text-primary' 
                    : 'border-border bg-card text-muted-foreground'
                }`}
                scrollStart={50}
                scrollEnd={350}
                distance={160}
              >
                {tag}
              </ScatterText>
            ))}
          </div>

          {/* 技術スタック */}
          <div className="flex flex-wrap gap-2 mb-6">
            {work.stack?.map((tech) => (
              <ScatterText
                as="span"
                key={tech}
                className="text-xs px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-primary"
                scrollStart={50}
                scrollEnd={350}
                distance={160}
              >
                {tech}
              </ScatterText>
            ))}
          </div>

          <div className={`flex items-center gap-2 text-sm font-medium transition-all duration-500 ${isHovered ? 'text-primary translate-x-2' : 'text-muted-foreground'}`}>
            <ScatterText
              as="span"
              className="uppercase tracking-wider"
              scrollStart={50}
              scrollEnd={350}
              distance={180}
            >
              詳しく見る
            </ScatterText>
            <ArrowRight className={`w-4 h-4 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} />
          </div>
        </div>
      </div>
    </Link>
  )
}

export default function WorksPageClient() {
  const [selectedCategory, setSelectedCategory] = useState('すべて')
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const filteredWorks = useMemo(() => {
    if (selectedCategory === 'すべて') return works
    return works.filter((work) => work.category === selectedCategory)
  }, [selectedCategory])

  // Force ScrollTrigger to refresh when the list changes
  useEffect(() => {
    setHoveredIndex(null)

    const timer = setTimeout(() => {
      ScrollTrigger.refresh()
    }, 100)
    return () => clearTimeout(timer)
  }, [selectedCategory])

  const handleHover = useCallback((index: number | null) => {
    setHoveredIndex(index)
  }, [])

  return (
    <>
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
              Works
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
            制作実績
          </ScatterText>
          
          <ScatterText
            as="p"
            className="text-base md:text-lg text-muted-foreground max-w-lg mx-auto leading-[1.8] tracking-wide"
            scrollStart={50}
            scrollEnd={350}
            distance={300}
          >
            クライアントと共に創り上げた、想いが詰まったプロジェクトをご紹介します。
          </ScatterText>
        </div>
      </section>

      <section className="relative z-10 py-6 border-y border-border/20 glass-light">
        <div className="container mx-auto px-6 md:px-12 lg:px-16">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
            <ScatterText
              as="span"
              className="text-xs uppercase tracking-widest text-muted-foreground font-medium"
              scrollStart={50}
              scrollEnd={350}
              distance={180}
            >
              Filter
            </ScatterText>
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={(event) => {
                    event.preventDefault()
                    event.stopPropagation()
                    setSelectedCategory(category)
                  }}
                  aria-pressed={selectedCategory === category}
                  className={`px-5 py-2.5 text-xs rounded-full transition-all duration-300 ${
                    selectedCategory === category
                      ? 'bg-foreground text-background'
                      : 'bg-card rainbow-border'
                  }`}
                >
                  <ScatterText
                    as="span"
                    className="inline-block"
                    scrollStart={50}
                    scrollEnd={350}
                    distance={160}
                  >
                    {category}
                  </ScatterText>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 py-12 lg:py-16 glass-light">
        <div className="container mx-auto px-6 md:px-12 lg:px-16">
          <div className="space-y-6 lg:space-y-8">
            {filteredWorks.map((work, index) => (
              <WorkCard
                key={`${selectedCategory}-${work.id}`}
                work={work}
                index={index}
                onHover={handleHover}
                isHovered={hoveredIndex === index}
              />
            ))}
          </div>

          {filteredWorks.length === 0 && (
            <div className="py-24 sm:py-32 text-center">
              <ScatterText
                as="p"
                className="text-lg sm:text-xl text-muted-foreground"
                scrollStart={50}
                scrollEnd={350}
                distance={220}
              >
                該当する実績がありません
              </ScatterText>
            </div>
          )}
        </div>
      </section>

      <section className="py-32 md:py-40 lg:py-56 glass-card">
        <div className="container mx-auto px-6 md:px-12 lg:px-16">
          <div className="max-w-3xl mx-auto text-center">
            <div className="mb-6 lg:mb-8">
              <ScatterText
                as="span"
                className="font-display text-[clamp(2.5rem,8vw,5rem)] leading-none tracking-tight text-foreground/50 block"
                scrollStart={50}
                scrollEnd={350}
                distance={500}
                style={{
                  WebkitTextStroke: '1px currentColor',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                More Works
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
              もっと詳しく見たい方へ
            </ScatterText>
            
            <ScatterText
              as="p"
              className="text-base md:text-lg text-muted-foreground mb-10 lg:mb-12 leading-[1.8] tracking-wide"
              scrollStart={50}
              scrollEnd={350}
              distance={300}
            >
              ポートフォリオの詳細や、掲載していない実績についてもお気軽にお問い合わせください。
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
                  <MessageCircle size={18} />
                  <ScatterText
                    as="span"
                    className="inline-block"
                    scrollStart={50}
                    scrollEnd={350}
                    distance={180}
                  >
                    もっと実績を見せてもらう
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
                  電話で相談する
                </ScatterText>
              </ScatterBlock>
            </div>
          </div>
        </div>
      </section>

      <section className="py-32 md:py-40 lg:py-56 overflow-hidden glass-light">
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
              Contact
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
            まずは、お話しませんか？
          </ScatterText>
          <ScatterText
            as="p"
            className="text-base md:text-lg text-muted-foreground max-w-lg mx-auto mb-10 lg:mb-12 leading-[1.8] tracking-wide"
            scrollStart={50}
            scrollEnd={350}
            distance={300}
          >
            「こんなこと頼めるのかな？」という段階でも大丈夫。お気軽にご連絡ください。
          </ScatterText>
          
          <ScatterBlock
            className="cta-secondary inline-flex items-center gap-4 rounded-full px-8 py-4 text-sm font-bold tracking-widest uppercase transition-all duration-300"
            scrollEnd={350}
            distance={400}
            seed={30}
            href="tel:08091550426"
          >
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
      </section>

      <Footer />
    </>
  )
}
