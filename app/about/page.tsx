import { Metadata } from 'next'
import { generateAboutPageSchema, generateBreadcrumbSchema } from '@/lib/structured-data'
import AboutPageClient from '@/components/pages/about-page'

export const metadata: Metadata = {
  title: '私たちについて',
  description: '茨城・東京・千葉を中心に活動する、2人だけのブランディング&Web制作スタジオ。大手にはできない、丁寧なものづくりを。チームメンバー、大切にしていること、制作の流れをご紹介します。',
  alternates: {
    canonical: 'https://junkbranding.com/about',
  },
  openGraph: {
    title: '私たちについて | JunkBranding',
    description: '茨城・東京・千葉を中心に活動する、2人だけのブランディング&Web制作スタジオ。大手にはできない、丁寧なものづくりを。',
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
