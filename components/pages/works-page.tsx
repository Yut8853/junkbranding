'use client'

import { useRef, useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight, Phone, MessageCircle } from 'lucide-react'
import { TextReveal, SectionReveal, LineReveal } from '@/components/text-reveal'
import { MagneticButton } from '@/components/magnetic-button'
import { Footer } from '@/components/footer'
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
    tags: ['Web Design', 'Frontend', 'WebGL', 'Branding'],
    url: 'https://junkbranding.com/',
    image: '/works/junkbranding.jpg',
    year: '2026',
    color: 'from-[oklch(0.7_0.22_280)] to-[oklch(0.6_0.2_320)]',
  },
  {
    id: 2,
    title: 'TO PLACE',
    category: 'コーポレートサイト',
    description: '不動産会社のコーポレートサイト。信頼感と先進性を両立したデザイン。',
    tags: ['Web Design', 'Development', 'Branding'],
    url: 'https://to-place.co.jp/',
    image: '/works/to-place.jpg',
    year: '2024',
    color: 'from-[oklch(0.7_0.2_25)] to-[oklch(0.75_0.18_60)]',
  },
  {
    id: 3,
    title: 'LUZ REAL',
    category: 'コーポレートサイト',
    description: '洗練されたビジュアルと使いやすさを追求したコーポレートサイト。',
    tags: ['Web Design', 'Development', 'Branding'],
    url: 'https://luz-real.com/',
    image: '/works/luz-real.jpg',
    year: '2025',
    color: 'from-[oklch(0.7_0.15_150)] to-[oklch(0.65_0.2_180)]',
  },
]

// Categories for filter
const categories = ['すべて', ...Array.from(new Set(works.map((work) => work.category)))]

// Interactive Work Card with 3D tilt effect
function WorkCard({ work, index }: { work: typeof works[0]; index: number }) {
  const cardRef = useRef<HTMLAnchorElement>(null)
  const numberRef = useRef<HTMLSpanElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const card = cardRef.current
    if (!card) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const centerX = rect.width / 2
      const centerY = rect.height / 2
      const rotateX = (y - centerY) / 20
      const rotateY = (centerX - x) / 20

      gsap.to(card, {
        rotateX: rotateX,
        rotateY: rotateY,
        duration: 0.3,
        ease: 'power2.out',
        transformPerspective: 1000,
      })

      // Parallax effect on number
      if (numberRef.current) {
        gsap.to(numberRef.current, {
          x: (x - centerX) / 10,
          y: (y - centerY) / 10,
          duration: 0.3,
        })
      }
    }

    const handleMouseLeave = () => {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.5,
        ease: 'power2.out',
      })
      if (numberRef.current) {
        gsap.to(numberRef.current, {
          x: 0,
          y: 0,
          duration: 0.5,
        })
      }
    }

    card.addEventListener('mousemove', handleMouseMove)
    card.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      card.removeEventListener('mousemove', handleMouseMove)
      card.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  // Scroll animation
  useEffect(() => {
    const card = cardRef.current
    const content = contentRef.current
    if (!card || !content) return

    gsap.set(card, { opacity: 0, y: 100, scale: 0.95 })
    gsap.set(content, { opacity: 0, x: index % 2 === 0 ? -50 : 50 })

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: card,
        start: 'top 85%',
        end: 'top 50%',
        toggleActions: 'play none none reverse',
      },
    })

    tl.to(card, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 1,
      ease: 'power3.out',
    }).to(
      content,
      {
        opacity: 1,
        x: 0,
        duration: 0.8,
        ease: 'power3.out',
      },
      '-=0.6'
    )

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill())
    }
  }, [index])

  const isReversed = index % 2 !== 0
  const formattedIndex = String(index + 1).padStart(2, '0')

  return (
    <div
      className={`flex flex-col ${isReversed ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-8 lg:gap-16 py-16 sm:py-24 lg:py-32`}
    >
      {/* Card with 3D effect */}
      <Link
        ref={cardRef}
        href={work.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative w-full lg:w-3/5 aspect-[16/10] rounded-2xl sm:rounded-3xl overflow-hidden bg-card border border-border/50 shadow-2xl"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Gradient background */}
        <div className={`absolute inset-0 bg-gradient-to-br ${work.color} opacity-20 group-hover:opacity-40 transition-opacity duration-700`} />
        
        {/* Large number decoration */}
        <span
          ref={numberRef}
          className="absolute -left-4 sm:-left-8 -top-8 sm:-top-12 text-[12rem] sm:text-[16rem] lg:text-[20rem] font-bold leading-none text-foreground/[0.03] select-none pointer-events-none"
          style={{ transform: 'translateZ(50px)' }}
        >
          {formattedIndex}
        </span>

        {/* Year badge */}
        <div className="absolute top-4 sm:top-6 right-4 sm:right-6 z-10">
          <span className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-mono bg-background/80 backdrop-blur-md rounded-full border border-border/50">
            {work.year}
          </span>
        </div>

        {/* Category badge */}
        <div className="absolute top-4 sm:top-6 left-4 sm:left-6 z-10">
          <span className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm bg-foreground text-background rounded-full">
            {work.category}
          </span>
        </div>

        {/* Center content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 group-hover:scale-105 transition-transform duration-500">
              <span className="gradient-text">{work.title}</span>
            </h3>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
              {work.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-3 py-1 bg-background/60 backdrop-blur-sm rounded-full border border-border/30"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Hover overlay with CTA */}
        <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/90 transition-all duration-500 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <span className="text-background flex items-center gap-3 text-lg sm:text-xl font-medium scale-75 group-hover:scale-100 transition-transform duration-500">
            View Project
            <ArrowUpRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </span>
        </div>

        {/* Decorative corner lines */}
        <div className="absolute top-0 left-0 w-16 sm:w-24 h-16 sm:h-24 border-l-2 border-t-2 border-primary/20 rounded-tl-2xl sm:rounded-tl-3xl" />
        <div className="absolute bottom-0 right-0 w-16 sm:w-24 h-16 sm:h-24 border-r-2 border-b-2 border-primary/20 rounded-br-2xl sm:rounded-br-3xl" />
      </Link>

      {/* Content side */}
      <div
        ref={contentRef}
        className={`w-full lg:w-2/5 ${isReversed ? 'lg:text-right' : 'lg:text-left'} text-center lg:text-inherit`}
      >
        <span className="inline-block text-7xl sm:text-8xl lg:text-9xl font-bold gradient-text opacity-20 mb-4 lg:mb-6">
          {formattedIndex}
        </span>
        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-6 sm:mb-8 max-w-md mx-auto lg:mx-0 lg:max-w-none text-balance">
          {work.description}
        </p>
        <MagneticButton
          href={work.url}
          className="group inline-flex items-center gap-3 px-5 sm:px-6 py-2.5 sm:py-3 bg-foreground text-background rounded-full btn-gradient-hover transition-all duration-300"
          data-cursor="View"
        >
          <span className="text-sm uppercase tracking-wider">詳しく見る</span>
          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
        </MagneticButton>
      </div>
    </div>
  )
}

export default function WorksPageClient() {
  const [selectedCategory, setSelectedCategory] = useState('すべて')

  const filteredWorks =
    selectedCategory === 'すべて' ? works : works.filter((work) => work.category === selectedCategory)

  return (
    <>
      {/* Hero Section - More dramatic */}
      <section className="relative min-h-[70svh] sm:min-h-[80svh] flex items-center justify-center overflow-hidden">
        {/* Animated background orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-gradient-to-br from-accent/20 to-primary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="container mx-auto px-4 sm:px-6 md:px-12 py-24 sm:py-32 text-center relative z-10">
          <LineReveal delay={0}>
            <p className="text-xs sm:text-sm uppercase tracking-[0.3em] sm:tracking-[0.4em] text-primary mb-6 sm:mb-8">
              Selected Works
            </p>
          </LineReveal>
          
          <div className="relative mb-8 sm:mb-12">
            <TextReveal
              text="制作実績"
              as="h1"
              className="text-5xl sm:text-6xl md:text-7xl lg:text-9xl font-bold tracking-tight"
              delay={0.2}
              gradient
            />
            {/* Decorative line */}
            <div className="absolute -bottom-2 sm:-bottom-4 left-1/2 -translate-x-1/2 w-24 sm:w-32 h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
          </div>

          <LineReveal delay={0.6}>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed text-balance">
              クライアントと共に創り上げた、<br className="sm:hidden" />
              <span className="gradient-highlight">想いが詰まったプロジェクト</span>をご紹介します。
            </p>
          </LineReveal>

          {/* Scroll indicator */}
          <SectionReveal delay={1} className="mt-16 sm:mt-20">
            <div className="flex flex-col items-center gap-2 animate-bounce">
              <span className="text-xs text-muted-foreground uppercase tracking-widest">Scroll</span>
              <div className="w-px h-8 sm:h-12 bg-gradient-to-b from-primary to-transparent" />
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* Filter Section - Stylized */}
      <section className="py-8 sm:py-12 glass-light border-y border-border/20">
        <div className="container mx-auto px-4 sm:px-6 md:px-12">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Filter by</span>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`relative px-4 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm rounded-full transition-all duration-500 overflow-hidden group ${
                    selectedCategory === category
                      ? 'bg-foreground text-background'
                      : 'bg-transparent border border-border/50 hover:border-foreground/50'
                  }`}
                >
                  {/* Hover gradient effect */}
                  <span
                    className={`absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                      selectedCategory === category ? 'hidden' : ''
                    }`}
                  />
                  <span className="relative z-10">{category}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Works Section - Full width alternating layout */}
      <section className="glass-light">
        <div className="container mx-auto px-4 sm:px-6 md:px-12">
          {filteredWorks.map((work, index) => (
            <WorkCard key={work.id} work={work} index={index} />
          ))}

          {filteredWorks.length === 0 && (
            <div className="py-24 sm:py-32 text-center">
              <p className="text-lg sm:text-xl text-muted-foreground">該当する実績がありません</p>
            </div>
          )}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 sm:py-24 md:py-32 glass-card">
        <div className="container mx-auto px-4 sm:px-6 md:px-12">
          <SectionReveal className="text-center">
            <div className="max-w-3xl mx-auto p-8 sm:p-12 md:p-16 rounded-2xl bg-background border border-border">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
                もっと詳しく見たい方へ
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground mb-8 sm:mb-10 text-balance">
                ポートフォリオの詳細や、掲載していない実績についてもお気軽にお問い合わせください。
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
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
                  className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-foreground text-background rounded-full font-medium btn-gradient-hover transition-all duration-300"
                >
                  <Phone size={18} />
                  <span>電話で相談する</span>
                </a>
              </div>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-24 sm:py-32 md:py-48 glass-light">
        <div className="container mx-auto px-4 sm:px-6 md:px-12 text-center">
          <TextReveal
            text="あなたのプロジェクトを"
            as="h2"
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight"
            delay={0}
          />
          <TextReveal
            text="形にしませんか？"
            as="span"
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 sm:mb-8 block"
            delay={0.3}
            gradient
          />
          <SectionReveal delay={0.6}>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 sm:mb-12 leading-relaxed text-balance">
              私たちは、あなたのビジネスの成長を本気で応援します。まずは気軽にお話しさせてください。
            </p>
          </SectionReveal>

          <SectionReveal delay={0.8}>
            <MagneticButton 
              href="/contact"
              className="group inline-flex items-center justify-center w-36 h-36 sm:w-40 sm:h-40 rounded-full bg-foreground text-background font-medium btn-gradient-hover transition-all duration-300"
              data-cursor="Start"
            >
              <span className="relative z-10 uppercase tracking-wider text-xs sm:text-sm">
                お問い合わせ
              </span>
            </MagneticButton>
          </SectionReveal>
        </div>
      </section>

      <Footer />
    </>
  )
}
