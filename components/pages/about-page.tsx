'use client'

import { Footer } from '@/components/footer'
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
  return (
    <>
      <AboutHeroSection />
      <AboutIntroSection />
      <AboutTeamSection team={team} />
      <AboutValuesSection values={values} />
      <AboutProcessSection process={process} />
      <AboutContactSection />
      <Footer />
    </>
  )
}
