'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScatterText } from '@/components/motion/scatter-text'
import { useIsMobile } from '@/hooks/use-mobile'
import type { WorkCardProps } from '@/types/works-page'

gsap.registerPlugin(ScrollTrigger)

export function WorkCard({
  work,
  index,
  onHover,
  isHovered
}: WorkCardProps) {
  const cardRef = useRef<HTMLAnchorElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const formattedIndex = String(index + 1).padStart(2, '0')
  const isMobile = useIsMobile()
  const effectiveHovered = !isMobile && isHovered

  const handleMouseEnter = () => {
    if (isMobile) return
    onHover(index)
  }

  const handleMouseLeave = () => {
    if (isMobile) return
    onHover(null)
  }

  // Scroll animation using gsap.context for clean scoping
  useEffect(() => {
    if (isMobile) return

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
  }, [isMobile, work.id]) // Re-run when the item itself changes via filter

  // 3D tilt effect on hover
  useEffect(() => {
    if (isMobile) return

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
  }, [isMobile])

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
      <div className={`grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-12 items-center py-8 sm:py-12 lg:py-16 px-4 sm:px-6 md:px-8 rounded-3xl rainbow-border transition-all duration-500 ${effectiveHovered ? 'glass-card shadow-[0_24px_80px_rgba(0,0,0,0.06)]' : 'bg-card/35'}`}>
        <div className="hidden lg:flex lg:col-span-1 items-center justify-center">
          <ScatterText
            as="span"
            className={`type-readable-number inline-flex min-w-[1.4em] whitespace-nowrap text-4xl lg:text-5xl xl:text-6xl tabular-nums transition-all duration-500 ${effectiveHovered ? 'gradient-text' : 'text-foreground/10'}`}
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
            className={`relative aspect-[16/10] rounded-2xl overflow-hidden rainbow-border transition-all duration-500 ${effectiveHovered ? 'glass-card' : 'bg-card/55'}`}
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div className={`absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/10 to-primary/5 transition-opacity duration-700 ${effectiveHovered ? 'opacity-100' : 'opacity-60'}`} />

            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`type-display text-[6rem] sm:text-[8rem] md:text-[10rem] transition-all duration-700 ${effectiveHovered ? 'gradient-text scale-110' : 'text-foreground/[0.03] scale-100'}`}>
                {work.title.charAt(0)}
              </span>
            </div>

            <div className="absolute top-4 left-4 z-10">
              <ScatterText
                as="span"
                className="type-label px-3 py-1.5 text-xs bg-foreground text-background rounded-full"
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
                className="type-label px-3 py-1.5 text-xs bg-background/80 backdrop-blur-sm rounded-full rainbow-border"
                scrollStart={50}
                scrollEnd={350}
                distance={160}
              >
                {work.year}
              </ScatterText>
            </div>

            <div className={`absolute inset-0 rounded-2xl flex items-center justify-center transition-opacity duration-500 ${effectiveHovered ? 'opacity-100' : 'opacity-0'}`} style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.86), rgba(255,255,255,0.62))' }}>
              <span className="type-cta text-foreground flex items-center gap-3 text-xl sm:text-2xl">
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
                className="type-readable-number inline-flex whitespace-nowrap text-4xl"
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
            className="type-section-title text-2xl sm:text-3xl lg:text-4xl mb-3 sm:mb-4"
            scrollStart={50}
            scrollEnd={350}
            distance={300}
            gradient
          >
            {work.title}
          </ScatterText>

          <ScatterText
            as="p"
            className="type-body text-base sm:text-lg text-muted-foreground mb-6 text-balance"
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
                className={`type-body-compact text-xs px-3 py-1.5 rounded-full border transition-all duration-500 ${
                  effectiveHovered
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
                className="type-body-compact text-xs px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-primary"
                scrollStart={50}
                scrollEnd={350}
                distance={160}
              >
                {tech}
              </ScatterText>
            ))}
          </div>

          <div className={`type-cta flex items-center gap-2 text-sm transition-all duration-500 ${effectiveHovered ? 'text-primary translate-x-2' : 'text-muted-foreground'}`}>
            <ScatterText
              as="span"
              className="inline-block"
              scrollStart={50}
              scrollEnd={350}
              distance={180}
            >
              詳しく見る
            </ScatterText>
            <ArrowRight className={`w-4 h-4 transition-transform duration-300 ${effectiveHovered ? 'translate-x-1' : ''}`} />
          </div>
        </div>
      </div>
    </Link>
  )
}
