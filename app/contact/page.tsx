import { Metadata } from 'next'
import { generateContactPageSchema, generateBreadcrumbSchema, generateJsonLdGraph } from '@/lib/structured-data'
import { createPageMetadata } from '@/lib/seo'
import ContactPageClient from '@/components/pages/contact-page'

export const metadata: Metadata = createPageMetadata({
  title: 'お問い合わせ',
  description:
    'JunkBrandingへのお問い合わせページ。茨城・東京・神奈川でのWebサイト制作、ブランディング、ロゴデザイン、動画制作、マーケティングのご相談・お見積もりはこちらからお気軽にご連絡ください。',
  path: '/contact',
  keywords: ['茨城 Web制作相談', '東京 ブランディング相談', '神奈川 ホームページ制作相談', 'お問い合わせ', '見積もり相談', '無料相談'],
})

const contactJsonLd = generateJsonLdGraph([
  generateContactPageSchema(),
  generateBreadcrumbSchema([
    { name: 'ホーム', url: 'https://junkbranding.com' },
    { name: 'お問い合わせ', url: 'https://junkbranding.com/contact' },
  ]),
])

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactJsonLd) }}
      />
      <ContactPageClient />
    </>
  )
}