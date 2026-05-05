'use client'

import { Footer } from '@/components/footer'
import { useDeferredRender } from '@/hooks/use-deferred-render'
import {
  AboutContactSection,
  AboutHeroSection,
  AboutIntroSection,
  AboutProcessSection,
  AboutTeamSection,
  AboutValuesSection,
} from '@/components/pages/about/about-sections'
import { process, team, values } from '@/content/about-page'

export default function AboutPageClient() {
  const shouldRenderSections = useDeferredRender()

  return (
    <>
      <AboutHeroSection />
      {shouldRenderSections && (
        <>
          <AboutIntroSection />
          <AboutTeamSection team={team} />
          <AboutValuesSection values={values} />
          <AboutProcessSection process={process} />
          <AboutContactSection />
          <Footer />
        </>
      )}
    </>
  )
}
