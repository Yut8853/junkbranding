import type { Metadata } from 'next'
import {
  generatePrivacyPageSchema,
  generateBreadcrumbSchema,
  generateJsonLdGraph,
} from '@/lib/structured-data'
import { createPageMetadata } from '@/lib/seo'
import PrivacyPageClient from '@/components/pages/privacy-page'

export const metadata: Metadata = createPageMetadata({
  title: 'プライバシーポリシー',
  description:
    'JunkBrandingのプライバシーポリシーです。個人情報の取り扱い、Cookieの使用、外部サービス利用時の情報管理、お客様の権利についてご説明します。',
  path: '/privacy',
  keywords: [
    'プライバシーポリシー',
    '個人情報保護',
    'Cookie',
    '個人情報の取り扱い',
  ],
  category: 'ポリシー',
})

const privacyJsonLd = generateJsonLdGraph([
  generatePrivacyPageSchema(),
  generateBreadcrumbSchema([
    { name: 'ホーム', url: 'https://junkbranding.com' },
    {
      name: 'プライバシーポリシー',
      url: 'https://junkbranding.com/privacy',
    },
  ]),
])

export default function PrivacyPolicyPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(privacyJsonLd) }}
      />
      <PrivacyPageClient />
    </>
  )
}