import { Metadata } from 'next'
import { generateContactPageSchema, generateBreadcrumbSchema, generateJsonLdGraph } from '@/lib/structured-data'
import { createPageMetadata } from '@/lib/seo'
import ContactPageClient from '@/components/pages/contact-page'

export const metadata: Metadata = createPageMetadata({
  title: 'お問い合わせ',
  description:
    'JunkBrandingへのお問い合わせページ。Webサイト制作、ブランディング、ロゴデザイン、動画制作、マーケティングのご相談はこちらからお気軽にご連絡ください。',
  path: '/contact',
  keywords: ['お問い合わせ', 'Web制作相談', 'ブランディング相談', '見積もり相談', '無料相談'],
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