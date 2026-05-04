import type { Metadata } from 'next'
import {
  generateAboutPageSchema,
  generateBreadcrumbSchema,
  generateJsonLdGraph,
} from '@/lib/structured-data'
import { createPageMetadata } from '@/lib/seo'
import AboutPageClient from '@/components/pages/about-page'

export const metadata: Metadata = createPageMetadata({
  title: '私たちについて | 茨城発のWeb制作スタジオ',
  description:
    'JunkBrandingは、茨城発のブランディング&Web制作スタジオです。東京・神奈川にも対応し、戦略設計・デザイン・実装まで一貫して支援します。',
  path: '/about',
  keywords: [
    '茨城 ブランディング',
    '茨城 Web制作',
    '東京 ブランディング',
    '神奈川 Web制作',
    'アートディレクション',
  ],
})

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