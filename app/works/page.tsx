import { Metadata } from 'next'
import { generateWorksPageSchema, generateBreadcrumbSchema, generateJsonLdGraph } from '@/lib/structured-data'
import { createPageMetadata } from '@/lib/seo'
import WorksPageClient from '@/components/pages/works-page'

export const metadata: Metadata = createPageMetadata({
  title: '制作実績',
  description:
    'JunkBrandingの制作実績。茨城・東京・神奈川の企業や事業者に向けたコーポレートサイト、ランディングページ、ブランディングなど、ブランド体験と成果を意識して制作したプロジェクトをご紹介します。',
  path: '/works',
  keywords: ['茨城 Web制作実績', '東京 Webデザイン実績', '神奈川 ホームページ制作', '制作実績', 'ポートフォリオ', 'コーポレートサイト制作', 'LP制作'],
})

// Structured data for works page
const worksJsonLd = generateJsonLdGraph([
  generateWorksPageSchema(),
  generateBreadcrumbSchema([
    { name: 'ホーム', url: 'https://junkbranding.com' },
    { name: '制作実績', url: 'https://junkbranding.com/works' },
  ]),
])

export default function WorksPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(worksJsonLd) }}
      />
      <WorksPageClient />
    </>
  )
}
