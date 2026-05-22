'use client'

import { useCallback, useMemo, useRef, useState } from 'react'
import { Footer } from '@/components/layout/footer'
import { currentProjects, works } from '@/content/works-page'
import { useDeferredRender } from '@/hooks/use-deferred-render'
import { ImmersiveWorkCard } from '@/components/pages/works/immersive-work-card'
import {
  WorksApproachSection,
  WorksCtaSection,
  WorksFilterSection,
  WorksCurrentProjectsSection,
  WorksOwnedShowcaseSection,
  WorksHeroSection,
  WorksSummarySection,
} from '@/components/pages/works/works-sections'

export default function WorksPageClient() {
  const [selectedCategory, setSelectedCategory] = useState('すべて')
  const shouldRenderSections = useDeferredRender()
  const sectionTopAnchorRef = useRef<HTMLDivElement>(null)
  const ownedWorks = useMemo(
    () => works.filter((work) => work.ownerType === 'owned'),
    []
  )
  const shouldShowOwnedShowcase = selectedCategory === 'すべて'

  const filteredWorks = useMemo(() => {
    const baseWorks = shouldShowOwnedShowcase
      ? works.filter((work) => work.ownerType === 'client')
      : works

    if (selectedCategory === 'すべて') return baseWorks
    return works.filter((work) => work.category === selectedCategory)
  }, [selectedCategory, shouldShowOwnedShowcase])

  const scrollToSectionTop = useCallback(() => {
    const anchorTop = sectionTopAnchorRef.current?.getBoundingClientRect().top

    if (typeof anchorTop !== 'number') return

    window.scrollTo({
      top: window.scrollY + anchorTop,
      behavior: 'auto',
    })
  }, [])

  const handleCategorySelect = useCallback((category: string) => {
    setSelectedCategory(category)

    requestAnimationFrame(() => {
      scrollToSectionTop()

      requestAnimationFrame(() => {
        scrollToSectionTop()
      })
    })
  }, [scrollToSectionTop])

  return (
    <>
      <WorksHeroSection />
      {shouldRenderSections && (
        <>
          <WorksSummarySection />

          <section className="relative glass-light">
            <div ref={sectionTopAnchorRef} aria-hidden="true" className="absolute inset-x-0 top-0 h-px" />

            <div className="container mx-auto px-6 pt-10 md:px-12 md:pt-14 lg:px-16 lg:pt-16">
              <WorksCurrentProjectsSection projects={currentProjects} />
            </div>

            <WorksFilterSection
              selectedCategory={selectedCategory}
              onSelectCategory={handleCategorySelect}
            />

            <div className="container mx-auto px-6 py-10 md:px-12 md:py-14 lg:px-16 lg:py-16">
              {shouldShowOwnedShowcase && <WorksOwnedShowcaseSection works={ownedWorks} />}

              {filteredWorks.length > 0 && (
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10 xl:gap-12">
                  {filteredWorks.map((work, index) => (
                    <ImmersiveWorkCard
                      key={`${selectedCategory}-${work.id}`}
                      work={work}
                      index={index}
                    />
                  ))}
                </div>
              )}

              {filteredWorks.length === 0 && (
                <div className="py-32 text-center">
                  <p className="text-xl text-muted-foreground">
                    該当する実績がありません
                  </p>
                </div>
              )}
            </div>
          </section>

          <WorksApproachSection />
          <WorksCtaSection />
          <Footer />
        </>
      )}
    </>
  )
}
