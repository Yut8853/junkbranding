import type { Metadata } from 'next'
import {
  generatePricingPageSchema,
  generateBreadcrumbSchema,
  generateJsonLdGraph,
} from '@/lib/structured-data'
import { createPageMetadata } from '@/lib/seo'
import PricingPageClient from '@/components/pages/pricing-page'

export const metadata: Metadata = createPageMetadata({
  title: '制作料金 | Web制作・LP制作・ブランディングの料金',
  description:
    'JunkBrandingの制作料金ページです。Webサイト制作15万円〜、CMS構築10万円〜、デザイン1万円〜。目的やご予算に合わせて、LP制作・Web制作・ブランディング・ロゴ制作を柔軟にご提案します。',
  path: '/pricing',
  keywords: [
    'Web制作 料金',
    'LP制作 料金',
    'ホームページ制作 費用',
    '茨城 Web制作 料金',
    '東京 Web制作 料金',
    '神奈川 Web制作 料金',
    'ブランディング 料金',
    'ロゴ制作 料金',
    'デザイン 料金',
  ],
  category: '制作料金',
})

const pricingJsonLd = generateJsonLdGraph([
  generatePricingPageSchema(),
  generateBreadcrumbSchema([
    { name: 'ホーム', url: 'https://junkbranding.com' },
    {
      name: '制作料金',
      url: 'https://junkbranding.com/pricing',
    },
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