'use client'

import { Footer } from '@/components/footer'
import { budgetOptions, serviceOptions } from '@/content/contact-page'
import { useDeferredRender } from '@/hooks/use-deferred-render'
import {
  ContactHeroSection,
  ContactInfoAndFormSection,
  ContactSuccessSection,
} from '@/components/pages/contact/contact-sections'
import { useContactForm } from '@/components/pages/contact/use-contact-form'

export default function ContactPageClient() {
  const contactForm = useContactForm()
  const shouldRenderSections = useDeferredRender(4200, 2400)

  if (contactForm.isSubmitted) {
    return (
      <>
        <ContactSuccessSection />
        <Footer />
      </>
    )
  }

  return (
    <>
      <ContactHeroSection />
      {shouldRenderSections && (
        <>
          <ContactInfoAndFormSection
            budgetOptions={budgetOptions}
            serviceOptions={serviceOptions}
            {...contactForm}
          />
          <Footer />
        </>
      )}
    </>
  )
}
