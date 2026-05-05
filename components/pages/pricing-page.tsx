'use client'

import { Footer } from '@/components/layout/footer'
import { pricingFaqs, serviceCategories } from '@/content/pricing-page'
import { useDeferredRender } from '@/hooks/use-deferred-render'
import {
  PricingCtaSection,
  PricingFaqSection,
  PricingHeroSection,
  PricingNoticeSection,
  PricingServiceCategoriesSection,
} from '@/components/pages/pricing/pricing-sections'

export default function PricingPageClient() {
  const shouldRenderSections = useDeferredRender()

  return (
    <>
      <PricingHeroSection />
      {shouldRenderSections && (
        <>
          <PricingNoticeSection />
          <PricingServiceCategoriesSection serviceCategories={serviceCategories} />
          <PricingFaqSection faqs={pricingFaqs} />
          <PricingCtaSection />
          <Footer />
        </>
      )}
    </>
  )
}
