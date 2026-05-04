import type { Metadata } from 'next'
import {
  generateContactPageSchema,
  generateBreadcrumbSchema,
  generateJsonLdGraph,
} from '@/lib/structured-data'
import { createPageMetadata } from '@/lib/seo'
import ContactPageClient from '@/components/pages/contact-page'

export const metadata: Metadata = createPageMetadata({
  title: 'お問い合わせ | Web制作・ブランディングのご相談',
  description:
    'JunkBrandingへのお問い合わせページです。茨城・東京・神奈川でのWebサイト制作、LP制作、ブランディング、ロゴデザインのご相談・お見積もりはこちらからお気軽にご連絡ください。',
  path: '/contact',
  keywords: [
    '茨城 Web制作相談',
    '東京 ブランディング相談',
    '神奈川 ホームページ制作相談',
    'Web制作 お問い合わせ',
    'LP制作 相談',
    'ブランディング 相談',
    '見積もり相談',
  ],
})

const contactJsonLd = generateJsonLdGraph([
  generateContactPageSchema(),
  generateBreadcrumbSchema([
    { name: 'ホーム', url: 'https://junkbranding.com' },
    {
      name: 'お問い合わせ',
      url: 'https://junkbranding.com/contact',
    },
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