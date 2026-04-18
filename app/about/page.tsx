import { Metadata } from 'next'
import { generateAboutPageSchema, generateBreadcrumbSchema } from '@/lib/structured-data'
import AboutPageClient from '@/components/pages/about-page'

export const metadata: Metadata = {
  title: '私たちについて',
description: 'JunkBrandingのチーム紹介。私たちが大切にしている価値観や、2人で制作する理由、ものづくりへの考え方をご紹介します。',  alternates: {
    canonical: 'https://junkbranding.com/about',
  },
  openGraph: {
    title: '私たちについて | JunkBranding',
    description: 'JunkBrandingのチーム紹介。私たちが大切にしている価値観や、2人で制作する理由、ものづくりへの考え方をご紹介します。',
    url: 'https://junkbranding.com/about',
    type: 'website',
  },
}

// Structured data for about page
const aboutJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    generateAboutPageSchema(),
    generateBreadcrumbSchema([
      { name: 'ホーム', url: 'https://junkbranding.com' },
      { name: '私たちについて', url: 'https://junkbranding.com/about' },
    ]),
  ],
}

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd) }}
      />
      <AboutPageClient />
    </>
  )
}
