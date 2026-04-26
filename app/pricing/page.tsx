import type { Metadata } from 'next'
import { generatePricingPageSchema, generateBreadcrumbSchema, generateJsonLdGraph } from '@/lib/structured-data'
import { createPageMetadata } from '@/lib/seo'
import PricingPageClient from '@/components/pages/pricing-page'

export const metadata: Metadata = createPageMetadata({
  title: '制作料金',
  description:
    'JunkBrandingの制作料金。Webサイト制作15万円〜、CMS構築10万円〜、デザイン1万円〜、動画制作10万円〜。修正無制限で、ご予算や目的に合わせた柔軟なご提案が可能です。',
  path: '/pricing',
  keywords: ['茨城 制作料金', '東京 制作料金', '神奈川 制作料金', 'Webサイト制作費用', 'デザイン料金', '動画制作費用', 'マーケティング費用', '修正無制限'],
  category: '制作料金',
})

// Structured data for pricing page
const pricingJsonLd = generateJsonLdGraph([
  generatePricingPageSchema(),
  generateBreadcrumbSchema([
    { name: 'ホーム', url: 'https://junkbranding.com' },
    { name: '制作料金', url: 'https://junkbranding.com/pricing' },
  ]),
])

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
