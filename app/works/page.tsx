import type { Metadata } from 'next'
import {
  generateWorksPageSchema,
  generateBreadcrumbSchema,
  generateJsonLdGraph,
} from '@/lib/structured-data'
import { createPageMetadata } from '@/lib/seo'
import WorksPageClient from '@/components/pages/works-page'

export const metadata: Metadata = createPageMetadata({
  title: '制作実績 | Web制作・LP制作・ブランディング事例',
  description:
    'JunkBrandingの制作実績ページです。茨城・東京・神奈川の企業や事業者に向けたコーポレートサイト、ランディングページ、ブランディングなど、ブランド体験と成果を意識した制作事例をご紹介します。',
  path: '/works',
  keywords: [
    'Web制作 実績',
    'LP制作 実績',
    'ブランディング 事例',
    '茨城 Web制作実績',
    '東京 Webデザイン実績',
    '神奈川 ホームページ制作',
    '制作実績',
    'ポートフォリオ',
    'コーポレートサイト制作',
  ],
})

const worksJsonLd = generateJsonLdGraph([
  generateWorksPageSchema(),
  generateBreadcrumbSchema([
    { name: 'ホーム', url: 'https://junkbranding.com' },
    {
      name: '制作実績',
      url: 'https://junkbranding.com/works',
    },
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