import { Metadata } from 'next'
import { generateWorksPageSchema, generateBreadcrumbSchema } from '@/lib/structured-data'
import WorksPageClient from '@/components/pages/works-page'

export const metadata: Metadata = {
  title: '制作実績',
  description: 'JunkBrandingの制作実績。コーポレートサイト、ランディングページ、ECサイト、ブランディングなど、クライアントと共に創り上げたプロジェクトをご紹介します。',
  alternates: {
    canonical: 'https://junkbranding.com/works',
  },
  openGraph: {
    title: '制作実績 | JunkBranding',
    description: 'JunkBrandingの制作実績。Webサイト制作、ブランディング、ロゴデザインのポートフォリオをご覧いただけます。',
    url: 'https://junkbranding.com/works',
    type: 'website',
  },
}

// Structured data for works page
const worksJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    generateWorksPageSchema(),
    generateBreadcrumbSchema([
      { name: 'ホーム', url: 'https://junkbranding.com' },
      { name: '制作実績', url: 'https://junkbranding.com/works' },
    ]),
  ],
}

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
