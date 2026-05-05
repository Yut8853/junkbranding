'use client'

import { useMemo, useState } from 'react'
import { Footer } from '@/components/layout/footer'
import { works } from '@/content/works-page'
import { useDeferredRender } from '@/hooks/use-deferred-render'
import { ImmersiveWorkCard } from '@/components/pages/works/immersive-work-card'
import {
  WorksApproachSection,
  WorksCtaSection,
  WorksFilterSection,
  WorksHeroSection,
  WorksSummarySection,
} from '@/components/pages/works/works-sections'

export default function WorksPageClient() {
  const [selectedCategory, setSelectedCategory] = useState('すべて')
  const shouldRenderSections = useDeferredRender()

  const filteredWorks = useMemo(() => {
    if (selectedCategory === 'すべて') return works
    return works.filter((work) => work.category === selectedCategory)
  }, [selectedCategory])

  return (
    <>
      <WorksHeroSection />
      {shouldRenderSections && (
        <>
          <WorksSummarySection />

          <section className="relative glass-light">
            <WorksFilterSection
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />

            {filteredWorks.map((work, index) => (
              <ImmersiveWorkCard
                key={`${selectedCategory}-${work.id}`}
                work={work}
                index={index}
              />
            ))}

            {filteredWorks.length === 0 && (
              <div className="py-32 text-center">
                <p className="text-xl text-muted-foreground">
                  該当する実績がありません
                </p>
              </div>
            )}
          </section>

          <WorksApproachSection />
          <WorksCtaSection />
          <Footer />
        </>
      )}
    </>
  )
}
