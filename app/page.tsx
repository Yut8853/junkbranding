import { Metadata } from 'next'
import { generateServiceSchema, generateBreadcrumbSchema } from '@/lib/structured-data'
import HomePageClient from '@/components/pages/home-page'

export const metadata: Metadata = {
  title: 'JunkBranding | 茨城・東京・千葉のブランディング & Web制作',
  description: '茨城・東京・千葉を中心に活動する、2人だけの小さなブランディング&Web制作スタジオ。大手にはできない、丁寧なものづくりを。Webサイト制作、ロゴ制作、ブランディングならJunkBrandingへ。',
  alternates: {
    canonical: 'https://junkbranding.com',
  },
  openGraph: {
    title: 'JunkBranding | 茨城・東京・千葉のブランディング & Web制作',
    description: '茨城・東京・千葉を中心に活動する、2人だけの小さなブランディング&Web制作スタジオ。大手にはできない、丁寧なものづくりを。',
    url: 'https://junkbranding.com',
    type: 'website',
  },
}

// Structured data for homepage
const homeJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': 'https://junkbranding.com/#webpage',
      url: 'https://junkbranding.com',
      name: 'JunkBranding | 茨城・東京・千葉のブランディング & Web制作',
      description: '茨城・東京・千葉を中心に活動する、2人だけの小さなブランディング&Web制作スタジオ。',
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
  ],
}

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
