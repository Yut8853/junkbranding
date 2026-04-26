import { Metadata } from 'next'
import { generateWorksPageSchema, generateBreadcrumbSchema, generateJsonLdGraph } from '@/lib/structured-data'
import { createPageMetadata } from '@/lib/seo'
import WorksPageClient from '@/components/pages/works-page'

export const metadata: Metadata = createPageMetadata({
  title: '制作実績',
  description:
    'JunkBrandingの制作実績。コーポレートサイト、ランディングページ、ECサイト、ブランディングなど、ブランド体験と成果を意識して制作したプロジェクトをご紹介します。',
  path: '/works',
  keywords: ['制作実績', 'ポートフォリオ', 'コーポレートサイト制作', 'LP制作', 'Webデザイン実績'],
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
