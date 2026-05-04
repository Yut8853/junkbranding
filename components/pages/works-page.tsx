'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
import { ArrowRight, Phone, MessageCircle } from 'lucide-react'
import { SectionReveal } from '@/components/text-reveal'
import { Footer } from '@/components/footer'
import { ScatterText } from '@/components/scatter-text'
import { ScatterBlock } from '@/components/scatter-block'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { categories, works } from '@/content/works-page'
import { WorkCard } from '@/components/pages/works/work-card'

gsap.registerPlugin(ScrollTrigger)

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
              className="type-eyebrow text-[clamp(3rem,10vw,7rem)] text-foreground/45 block"
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
            className="type-hero-title text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-6 lg:mb-8"
            scrollStart={50}
            scrollEnd={350}
            distance={400}
            gradient
          >
            制作実績
          </ScatterText>
          
          <ScatterText
            as="p"
            className="type-body text-base md:text-lg text-muted-foreground max-w-lg mx-auto"
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
              className="type-label text-muted-foreground"
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
                  className={`type-label px-5 py-2.5 text-xs rounded-full transition-all duration-300 ${
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
                className="type-eyebrow text-[clamp(2.5rem,8vw,5rem)] text-foreground/45 block"
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
              className="type-section-title text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-6 lg:mb-8"
              scrollStart={50}
              scrollEnd={350}
              distance={400}
              gradient
            >
              もっと詳しく見たい方へ
            </ScatterText>
            
            <ScatterText
              as="p"
              className="type-body text-base md:text-lg text-muted-foreground mb-10 lg:mb-12"
              scrollStart={50}
              scrollEnd={350}
              distance={300}
            >
              ポートフォリオの詳細や、掲載していない実績についてもお気軽にお問い合わせください。
            </ScatterText>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <ScatterBlock
                className="cta-primary type-cta group w-full rounded-full px-8 py-4 text-sm transition-all duration-300 sm:w-auto"
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
                className="cta-secondary type-cta flex w-full items-center justify-center gap-3 rounded-full px-8 py-4 text-sm transition-all duration-300 sm:w-auto"
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
              className="type-eyebrow text-[clamp(3rem,10vw,7rem)] text-foreground/45 block"
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
            className="type-section-title text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-6 lg:mb-8"
            scrollStart={50}
            scrollEnd={350}
            distance={400}
            gradient
          >
            まずは、お話しませんか？
          </ScatterText>
          <ScatterText
            as="p"
            className="type-body text-base md:text-lg text-muted-foreground max-w-lg mx-auto mb-10 lg:mb-12"
            scrollStart={50}
            scrollEnd={350}
            distance={300}
          >
            「こんなこと頼めるのかな？」という段階でも大丈夫。お気軽にご連絡ください。
          </ScatterText>
          
          <ScatterBlock
            className="cta-secondary type-cta inline-flex items-center gap-4 rounded-full px-8 py-4 text-sm transition-all duration-300"
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
