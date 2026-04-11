'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight, Phone, MessageCircle, Filter } from 'lucide-react'
import { TextReveal, SectionReveal, LineReveal } from '@/components/text-reveal'
import { MagneticButton } from '@/components/magnetic-button'
import { Footer } from '@/components/footer'

// Works data
const works = [
  {
    id: 1,
    title: 'TO PLACE',
    category: 'コーポレートサイト',
    description: '不動産会社のコーポレートサイト。信頼感と先進性を両立したデザイン。',
    tags: ['Web Design', 'Development', 'Branding'],
    url: 'https://to-place.co.jp/',
    image: '/works/to-place.jpg',
    year: '2024',
  },
  {
    id: 2,
    title: 'LUZ REAL',
    category: 'コーポレートサイト',
    description: '洗練されたビジュアルと使いやすさを追求したコーポレートサイト。',
    tags: ['Web Design', 'Development'],
    url: 'https://luz-real.com/',
    image: '/works/luz-real.jpg',
    year: '2024',
  },
]

// Categories for filter
const categories = ['すべて', 'コーポレートサイト', 'ランディングページ', 'ECサイト', 'ブランディング']

export default function WorksPageClient() {
  const [selectedCategory, setSelectedCategory] = useState('すべて')
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const filteredWorks = selectedCategory === 'すべて'
    ? works
    : works.filter(work => work.category === selectedCategory)

  return (
    <>
      {/* Hero Section */}
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
              クライアントと共に創り上げたプロジェクトをご紹介します。
            </p>
          </LineReveal>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-6 sm:py-8 border-y border-border/30 glass-light sticky top-[72px] z-30">
        <div className="container mx-auto px-4 sm:px-6 md:px-12">
          {/* Mobile Filter Button */}
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="md:hidden flex items-center gap-2 text-sm font-medium"
          >
            <Filter size={16} />
            <span>フィルター: {selectedCategory}</span>
          </button>

          {/* Mobile Filter Dropdown */}
          {isFilterOpen && (
            <div className="md:hidden absolute top-full left-0 right-0 bg-background border-b border-border p-4 shadow-lg z-40">
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      setSelectedCategory(category)
                      setIsFilterOpen(false)
                    }}
                    className={`px-3 py-1.5 text-xs rounded-full transition-all duration-300 ${
                      selectedCategory === category
                        ? 'bg-foreground text-background'
                        : 'bg-card border border-border hover:border-foreground'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Desktop Filter */}
          <div className="hidden md:flex items-center gap-4 flex-wrap">
            <span className="text-sm text-muted-foreground">絞り込み:</span>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 text-sm rounded-full transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-foreground text-background'
                    : 'bg-card border border-border hover:border-foreground'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Works Grid */}
      <section className="py-16 sm:py-24 md:py-32 glass-light">
        <div className="container mx-auto px-4 sm:px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-12">
            {filteredWorks.map((work, index) => (
              <SectionReveal key={work.id} delay={index * 0.1}>
                <Link 
                  href={work.url}
                  target={work.url.startsWith('http') ? '_blank' : undefined}
                  className="group block"
                >
                  <div className="relative aspect-[4/3] mb-4 sm:mb-6 rounded-xl sm:rounded-2xl overflow-hidden bg-card border border-border">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground/5">
                        {work.title.charAt(0)}
                      </span>
                    </div>
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-foreground/90 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                      <span className="text-background flex items-center gap-2">
                        View Project <ArrowUpRight size={20} />
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs sm:text-sm text-primary mb-1 sm:mb-2">{work.category}</p>
                      <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 group-hover:text-primary transition-colors duration-300">
                        {work.title}
                      </h3>
                      <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4 line-clamp-2">
                        {work.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {work.tags.map((tag) => (
                          <span key={tag} className="text-xs px-2 py-1 bg-card rounded-full border border-border">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground shrink-0">{work.year}</span>
                  </div>
                </Link>
              </SectionReveal>
            ))}
          </div>

          {filteredWorks.length === 0 && (
            <div className="text-center py-16 sm:py-24">
              <p className="text-lg sm:text-xl text-muted-foreground">
                該当する実績がありません
              </p>
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
