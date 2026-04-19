'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight, Phone, MessageCircle } from 'lucide-react'
import { TextReveal, SectionReveal, LineReveal } from '@/components/text-reveal'
import { MagneticButton } from '@/components/magnetic-button'
import { CircleButton } from '@/components/circle-button'
import { Footer } from '@/components/footer'
import { WorksWebGLScene } from '@/components/works-webgl-scene'
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
      gsap.set(card, { opacity: 0, y: 80 })

      gsap.to(card, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
          invalidateOnRefresh: true,
        },
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
      <div className={`grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center py-12 sm:py-16 lg:py-20 px-4 sm:px-6 -mx-4 sm:-mx-6 border-b border-border/30 rounded-2xl transition-all duration-500 ${isHovered ? 'bg-card/50' : ''}`}>
        <div className="hidden lg:flex lg:col-span-1 items-center justify-center">
          <span className={`text-6xl xl:text-7xl font-bold transition-all duration-500 ${isHovered ? 'gradient-text' : 'text-foreground/10'}`}>
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
              <span className={`text-[10rem] sm:text-[14rem] font-bold transition-all duration-700 ${isHovered ? 'gradient-text scale-110' : 'text-foreground/[0.03] scale-100'}`}>
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
              <span className="text-background flex items-center gap-3 text-lg font-medium">
                View Project
                <ArrowUpRight className="w-5 h-5" />
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
          <h3 className={`text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4 transition-all duration-500 ${isHovered ? 'gradient-text' : ''}`}>
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

  const filteredWorks = selectedCategory === 'すべて' 
    ? works 
    : works.filter((work) => work.category === selectedCategory)

  // Force ScrollTrigger to refresh when the list changes
  useEffect(() => {
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
        <div className="container mx-auto px-4 sm:px-6 md:px-12 py-24 sm:py-32 text-center">
          <LineReveal delay={0}>
            <p className="text-xs sm:text-sm uppercase tracking-[0.2em] sm:tracking-[0.3em] text-primary mb-4 sm:mb-6">
              Works
            </p>
          </LineReveal>
          
          <TextReveal
            text="制作実績"
            as="h1"
            className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold tracking-tight mb-6 sm:mb-8"
            delay={0.2}
            gradient
          />
          
          <LineReveal delay={0.6}>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed text-balance">
              クライアントと共に創り上げた、<span className="gradient-highlight">想いが詰まったプロジェクト</span>をご紹介します。
            </p>
          </LineReveal>

          <SectionReveal delay={1} className="mt-16 sm:mt-20">
            <div className="flex flex-col items-center gap-2">
              <span className="text-xs text-muted-foreground uppercase tracking-widest">Scroll</span>
              <div className="w-px h-8 sm:h-12 bg-gradient-to-b from-primary to-transparent" />
            </div>
          </SectionReveal>
        </div>
      </section>

      <section className="py-6 sm:py-8 border-y border-border/30 glass-light sticky top-[72px] z-30">
        <div className="container mx-auto px-4 sm:px-6 md:px-12">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Filter</span>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`relative px-4 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm rounded-full transition-all duration-500 overflow-hidden ${
                    selectedCategory === category
                      ? 'bg-foreground text-background'
                      : 'bg-card border border-border hover:border-primary/50'
                  }`}
                >
                  {selectedCategory !== category && (
                    <span className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 opacity-0 hover:opacity-100 transition-opacity duration-300" />
                  )}
                  <span className="relative z-10">{category}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 sm:py-12 glass-light">
        <div className="container mx-auto px-4 sm:px-6 md:px-12">
          {filteredWorks.map((work, index) => (
            <WorkCard 
              key={work.id} 
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

      <section className="py-24 sm:py-32 md:py-40 glass-card">
        <div className="container mx-auto px-4 sm:px-6 md:px-12">
          <div className="max-w-3xl mx-auto text-center">
            <SectionReveal>
              <p className="text-xs sm:text-sm uppercase tracking-[0.2em] sm:tracking-[0.3em] text-primary mb-4 sm:mb-6">
                More Works
              </p>
            </SectionReveal>
            
            <TextReveal
              text="もっと詳しく見たい方へ"
              as="h2"
              className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-6 sm:mb-8"
              delay={0.1}
              gradient
            />
            
            <SectionReveal delay={0.3}>
              <p className="text-base sm:text-lg text-muted-foreground mb-10 sm:mb-12 text-balance">
                ポートフォリオの詳細や、掲載していない実績についてもお気軽にお問い合わせください。
              </p>
            </SectionReveal>

            <SectionReveal delay={0.5} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <MagneticButton
                href="/contact"
                className="group w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-foreground text-background rounded-full font-medium btn-gradient-hover transition-all duration-300"
                data-cursor="Contact"
              >
                <span className="flex items-center justify-center gap-3">
                  <MessageCircle size={18} />
                  もっと実績を見せてもらう
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </MagneticButton>
              
              <a 
                href="tel:08091550426"
                className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-card text-foreground rounded-full font-medium border border-border hover:border-primary/50 transition-all duration-300"
              >
                <Phone size={18} />
                <span>電話で相談する</span>
              </a>
            </SectionReveal>
          </div>
        </div>
      </section>

      <section className="py-24 sm:py-32 md:py-48 overflow-hidden glass-light">
        <div className="container mx-auto px-4 sm:px-6 md:px-12 text-center">
          <SectionReveal duration={1}>
            <p className="text-xs sm:text-sm uppercase tracking-[0.2em] sm:tracking-[0.3em] text-primary mb-4 sm:mb-6">
              Contact
            </p>
          </SectionReveal>
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