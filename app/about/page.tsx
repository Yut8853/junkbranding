import { Metadata } from 'next'
import { generateAboutPageSchema, generateBreadcrumbSchema, generateJsonLdGraph } from '@/lib/structured-data'
import { createPageMetadata } from '@/lib/seo'
import AboutPageClient from '@/components/pages/about-page'

export const metadata: Metadata = createPageMetadata({
  title: '私たちについて',
  description:
    'JunkBrandingのチーム紹介。茨城発の2人だけのブランディング&Web制作スタジオとして大切にしている価値観、制作体制、ものづくりへの考え方をご紹介します。',
  path: '/about',
  keywords: ['チーム紹介', 'クリエイティブスタジオ', 'ブランド設計', 'アートディレクション'],
})

// Structured data for about page
const aboutJsonLd = generateJsonLdGraph([
  generateAboutPageSchema(),
  generateBreadcrumbSchema([
    { name: 'ホーム', url: 'https://junkbranding.com' },
    { name: '私たちについて', url: 'https://junkbranding.com/about' },
  ]),
])

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
