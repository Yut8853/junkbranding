'use client'

import { useRef, useEffect, useState, useCallback, useMemo } from 'react'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight, Phone, MessageCircle } from 'lucide-react'
import { SectionReveal } from '@/components/text-reveal'
import { Footer } from '@/components/footer'
import { WorksWebGLScene } from '@/components/works-webgl-scene'
import { ScatterText } from '@/components/scatter-text'
import { ScatterBlock } from '@/components/scatter-block'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

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
]

// Categories for filter
const categories = ['すべて', ...Array.from(new Set(works.map((work) => work.category)))]

// Work card component
function WorkCard({ 
  work, 
  index, 
  onHover,
  isHovered
}: { 
  work: typeof works[0]
  index: number
  onHover: (index: number | null, position?: { x: number; y: number }) => void
  isHovered: boolean
}) {
  const cardRef = useRef<HTMLAnchorElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const formattedIndex = String(index + 1).padStart(2, '0')

  const handleMouseEnter = (e: React.MouseEvent) => {
    const rect = cardRef.current?.getBoundingClientRect()
    if (rect) {
      const x = ((rect.left + rect.width / 2) / window.innerWidth) * 2 - 1
      const y = -((rect.top + rect.height / 2) / window.innerHeight) * 2 + 1
      onHover(index, { x, y })
    }
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
      <div className={`grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-12 items-center py-8 sm:py-12 lg:py-16 px-3 sm:px-4 md:px-6 -mx-3 sm:-mx-4 md:-mx-6 border-b border-border/30 rounded-xl sm:rounded-2xl transition-all duration-500 ${isHovered ? 'bg-card/50' : ''}`}>
        <div className="hidden lg:flex lg:col-span-1 items-center justify-center">
          <span className={`text-4xl lg:text-5xl xl:text-6xl font-bold transition-all duration-500 ${isHovered ? 'gradient-text' : 'text-foreground/10'}`}>
            {formattedIndex}
          </span>
        </div>

        <div className="lg:col-span-5">
          <div 
            ref={imageRef}
            className={`relative aspect-[16/10] rounded-2xl overflow-hidden border border-border/50 shadow-lg transition-all duration-500 ${isHovered ? 'bg-card/70' : 'bg-card/80'}`}
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div className={`absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/15 to-primary/10 transition-opacity duration-700 ${isHovered ? 'opacity-100' : 'opacity-60'}`} />
            
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-[6rem] sm:text-[8rem] md:text-[10rem] font-bold transition-all duration-700 ${isHovered ? 'gradient-text scale-110' : 'text-foreground/[0.03] scale-100'}`}>
                {work.title.charAt(0)}
              </span>
            </div>

            <div className="absolute top-4 left-4 z-10">
              <span className="px-3 py-1.5 text-xs bg-foreground text-background rounded-full">
                {work.category}
              </span>
            </div>

            <div className="absolute top-4 right-4 z-10">
              <span className="px-3 py-1.5 text-xs font-mono bg-background/80 backdrop-blur-sm rounded-full border border-border/50">
                {work.year}
              </span>
            </div>

            <div className={`absolute inset-0 bg-foreground/90 rounded-2xl flex items-center justify-center transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
              <span className="text-background flex items-center gap-3 text-xl sm:text-2xl font-bold uppercase tracking-[0.15em] font-display">
                View Project
                <ArrowUpRight className="w-6 h-6" />
              </span>
            </div>

            <div className="lg:hidden absolute bottom-4 left-4 z-10">
              <span className="text-4xl font-bold gradient-text">
                {formattedIndex}
              </span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6">
          <h3 className={`text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight mb-3 sm:mb-4 transition-all duration-500 ${isHovered ? 'gradient-text' : ''}`}>
            {work.title}
          </h3>
          
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-6 text-balance">
            {work.description}
          </p>

          <div className="flex flex-wrap gap-2 mb-6">
            {work.tags.map((tag) => (
              <span
                key={tag}
                className={`text-xs px-3 py-1.5 rounded-full border transition-all duration-500 ${
                  isHovered 
                    ? 'border-primary/50 bg-primary/5 text-primary' 
                    : 'border-border bg-card text-muted-foreground'
                }`}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* 技術スタック */}
          <div className="flex flex-wrap gap-2 mb-6">
            {work.stack?.map((tech) => (
              <span
                key={tech}
                className="text-xs px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-primary"
              >
                {tech}
              </span>
            ))}
          </div>

          <div className={`flex items-center gap-2 text-sm font-medium transition-all duration-500 ${isHovered ? 'text-primary translate-x-2' : 'text-muted-foreground'}`}>
            <span className="uppercase tracking-wider">詳しく見る</span>
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
  const [hoveredPosition, setHoveredPosition] = useState<{ x: number; y: number } | null>(null)

  const filteredWorks = useMemo(() => {
    if (selectedCategory === 'すべて') return works
    return works.filter((work) => work.category === selectedCategory)
  }, [selectedCategory])

  // Force ScrollTrigger to refresh when the list changes
  useEffect(() => {
    setHoveredIndex(null)
    setHoveredPosition(null)

    const timer = setTimeout(() => {
      ScrollTrigger.refresh()
    }, 100)
    return () => clearTimeout(timer)
  }, [selectedCategory])

  const handleHover = useCallback((index: number | null, position?: { x: number; y: number }) => {
    setHoveredIndex(index)
    setHoveredPosition(index !== null && position ? position : null)
  }, [])

  return (
    <>
      <WorksWebGLScene hoveredIndex={hoveredIndex} hoveredPosition={hoveredPosition} />

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
            <span className="text-xs uppercase tracking-widest text-muted-foreground font-medium">
              Filter
            </span>
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
                      : 'bg-card border border-border/20 hover:border-foreground/20'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 py-12 lg:py-16 glass-light">
        <div className="container mx-auto px-6 md:px-12 lg:px-16">
          {filteredWorks.map((work, index) => (
            <WorkCard 
              key={`${selectedCategory}-${work.id}`} 
              work={work} 
              index={index} 
              onHover={handleHover}
              isHovered={hoveredIndex === index}
            />
          ))}

          {filteredWorks.length === 0 && (
            <div className="py-24 sm:py-32 text-center">
              <p className="text-lg sm:text-xl text-muted-foreground">該当する実績がありません</p>
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
                className="group w-full sm:w-auto px-8 py-4 bg-foreground text-background rounded-full font-medium tracking-widest uppercase text-sm cursor-pointer hover:bg-foreground/90 transition-colors"
                scrollEnd={350}
                distance={400}
                seed={20}
                href="/contact"
              >
                <span className="flex items-center justify-center gap-4">
                  <MessageCircle size={18} />
                  もっと実績を見せてもらう
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </ScatterBlock>
              
              <ScatterBlock
                className="flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-4 bg-card text-foreground rounded-full font-medium text-sm border border-border/20 cursor-pointer hover:border-foreground/20 transition-colors"
                scrollEnd={350}
                distance={400}
                seed={21}
              >
                <Phone size={18} />
                <span>電話で相談する</span>
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
            className="inline-flex items-center gap-4 px-8 py-4 bg-foreground text-background rounded-full text-sm font-medium tracking-widest uppercase cursor-pointer hover:bg-foreground/90 transition-colors"
            scrollEnd={350}
            distance={400}
            seed={30}
          >
            080-9155-0426
          </ScatterBlock>
        </div>
      </section>

      <Footer />
    </>
  )
}
