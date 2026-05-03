'use client'

import { Footer } from '@/components/footer'
import { budgetOptions, serviceOptions } from '@/content/contact-page'
import {
  ContactHeroSection,
  ContactInfoAndFormSection,
  ContactSuccessSection,
} from '@/components/pages/contact/contact-sections'
import { useContactForm } from '@/components/pages/contact/use-contact-form'

export default function ContactPageClient() {
  const contactForm = useContactForm()

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
      <ContactInfoAndFormSection
        budgetOptions={budgetOptions}
        serviceOptions={serviceOptions}
        {...contactForm}
      />
      <Footer />
    </>
  )
}
