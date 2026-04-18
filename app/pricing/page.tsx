import type { Metadata } from 'next'
import { generatePricingPageSchema, generateBreadcrumbSchema } from '@/lib/structured-data'
import PricingPageClient from '@/components/pages/pricing-page'

export const metadata: Metadata = {
  title: '制作料金 | JunkBranding - Webサイト・デザイン・動画・マーケティング',
  description: 'JunkBrandingの制作料金のご案内。Webサイト制作15万円〜、CMS構築10万円〜、デザイン1万円〜、動画制作10万円〜。修正無制限・ご予算に合わせた柔軟なご提案が可能です。',
  keywords: ['制作料金', 'Webサイト制作費用', 'デザイン料金', '動画制作費用', 'マーケティング費用', '茨城', '東京', '千葉', '修正無制限'],
  alternates: {
    canonical: 'https://junkbranding.com/pricing',
  },
  openGraph: {
    title: '制作料金 | JunkBranding',
    description: 'Webサイト制作、デザイン、動画制作、マーケティングまで幅広く対応。修正無制限・ご予算に合わせた柔軟なご提案が可能です。',
    url: 'https://junkbranding.com/pricing',
    type: 'website',
    locale: 'ja_JP',
  },
  twitter: {
    card: 'summary_large_image',
    title: '制作料金 | JunkBranding',
    description: 'Webサイト制作、デザイン、動画制作、マーケティングまで幅広く対応。修正無制限。',
  },
}

// Structured data for pricing page
const pricingJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    generatePricingPageSchema(),
    generateBreadcrumbSchema([
      { name: 'ホーム', url: 'https://junkbranding.com' },
      { name: '制作料金', url: 'https://junkbranding.com/pricing' },
    ]),
  ],
}

export default function PricingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingJsonLd) }}
      />
      <PricingPageClient />
    </>
  )
}
