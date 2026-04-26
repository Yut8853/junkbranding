import { Metadata } from 'next'
import { generateServiceSchema, generateBreadcrumbSchema, generateJsonLdGraph } from '@/lib/structured-data'
import { createPageMetadata } from '@/lib/seo'
import HomePageClient from '@/components/pages/home-page'

export const metadata: Metadata = createPageMetadata({
  title: '茨城・東京・神奈川のブランディング & Web制作',
  description:
    '茨城・東京・神奈川を中心に活動する、2人だけの小さなブランディング&Web制作スタジオ。Webサイト制作、ロゴ制作、ブランディングを丁寧に設計し、ブランドらしさを成果につながる形へ整えます。',
  keywords: ['茨城 Web制作', '東京 Web制作', '神奈川 Web制作', 'コーポレートサイト制作', 'ランディングページ制作', 'ECサイト制作', 'ブランド戦略'],
})

// Structured data for homepage
const homeJsonLd = generateJsonLdGraph([
  {
    '@type': 'WebPage',
    '@id': 'https://junkbranding.com/#webpage',
    url: 'https://junkbranding.com',
    name: 'JunkBranding | 茨城・東京・神奈川のブランディング & Web制作',
    description: '茨城・東京・神奈川を中心に活動する、2人だけの小さなブランディング&Web制作スタジオ。',
    isPartOf: {
      '@id': 'https://junkbranding.com/#website',
    },
    about: {
      '@id': 'https://junkbranding.com/#organization',
    },
    inLanguage: 'ja',
  },
  generateServiceSchema(),
  generateBreadcrumbSchema([
    { name: 'ホーム', url: 'https://junkbranding.com' },
  ]),
])

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd) }}
      />
      <HomePageClient />
    </>
  )
}
