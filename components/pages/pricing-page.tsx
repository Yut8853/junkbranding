'use client'

import { Footer } from '@/components/footer'
import { pricingFaqs, serviceCategories } from '@/content/pricing-page'
import {
  PricingCtaSection,
  PricingFaqSection,
  PricingHeroSection,
  PricingNoticeSection,
  PricingServiceCategoriesSection,
} from '@/components/pages/pricing/pricing-sections'

export default function PricingPageClient() {
  return (
    <>
      <PricingHeroSection />
      <PricingNoticeSection />
      <PricingServiceCategoriesSection serviceCategories={serviceCategories} />
      <PricingFaqSection faqs={pricingFaqs} />
      <PricingCtaSection />
      <Footer />
    </>
  )
}
