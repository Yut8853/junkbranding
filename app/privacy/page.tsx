import { Metadata } from 'next'
import { generatePrivacyPageSchema, generateBreadcrumbSchema } from '@/lib/structured-data'
import PrivacyPageClient from '@/components/pages/privacy-page'

export const metadata: Metadata = {
  title: 'プライバシーポリシー',
  description: 'JunkBrandingのプライバシーポリシー。個人情報の取り扱い、Cookieの使用、お客様の権利についてご説明します。',
  alternates: {
    canonical: 'https://junkbranding.com/privacy',
  },
  openGraph: {
    title: 'プライバシーポリシー | JunkBranding',
    description: 'JunkBrandingのプライバシーポリシー。個人情報の取り扱いについてご説明します。',
    url: 'https://junkbranding.com/privacy',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
}

// Structured data for privacy page
const privacyJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    generatePrivacyPageSchema(),
    generateBreadcrumbSchema([
      { name: 'ホーム', url: 'https://junkbranding.com' },
      { name: 'プライバシーポリシー', url: 'https://junkbranding.com/privacy' },
    ]),
  ],
}

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
