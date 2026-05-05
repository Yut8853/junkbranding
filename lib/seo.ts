import type { Metadata } from 'next'
import type { PageMetadataOptions } from '@/types/seo'

const SITE_URL = 'https://junkbranding.com'
const SITE_NAME = 'JunkBranding'
const DEFAULT_OG_IMAGE = '/ogp.png'
const DEFAULT_DESCRIPTION =
  '茨城・東京・神奈川を中心に活動する、2人だけの小さなブランディング&Web制作スタジオ。Webサイト制作、ロゴ制作、ブランド設計、マーケティング支援まで、事業のらしさを成果につながる形へ整えます。'

const defaultKeywords = [
  'Web制作',
  'ホームページ制作',
  'ブランディング',
  'Webデザイン',
  'ロゴ制作',
  'ブランド設計',
  'コーポレートサイト制作',
  'ランディングページ制作',
  'SEO対策',
  'AI検索最適化',
  'LLMO',
  'AIO',
  '茨城',
  '東京',
  '神奈川',
]

export function createPageMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  path = '',
  keywords = [],
  image = DEFAULT_OG_IMAGE,
  imageAlt = `${SITE_NAME} - ブランディング&Web制作スタジオ`,
  index = true,
  category = 'Web制作・ブランディング',
}: PageMetadataOptions): Metadata {
  const url = `${SITE_URL}${path}`
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`
  const mergedKeywords = Array.from(new Set([...defaultKeywords, ...keywords]))

  return {
    metadataBase: new URL(SITE_URL),
    title: fullTitle,
    description,
    applicationName: SITE_NAME,
    referrer: 'origin-when-cross-origin',
    generator: 'Next.js',
    keywords: mergedKeywords,
    authors: [{ name: SITE_NAME, url: SITE_URL }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    category,
    alternates: {
      canonical: url,
      languages: {
        'ja-JP': url,
      },
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      type: 'website',
      locale: 'ja_JP',
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: imageAlt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [image],
    },
    robots: {
      index,
      follow: index,
      googleBot: {
        index,
        follow: index,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    other: {
      'llms-txt': `${SITE_URL}/llms.txt`,
      'ai-summary': description,
      'service-area': '茨城県, 東京都, 神奈川県, 全国オンライン対応',
      'primary-services':
        'ブランディング, Web制作, Webデザイン, ロゴ制作, SEO対策, マーケティング支援',
      'accessibility-summary':
        'キーボード操作、スクリーンリーダー、WAI-ARIA属性、SPでのモーション削減に配慮しています。',
    },
  }
}