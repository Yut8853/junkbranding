import type { Metadata } from 'next'

const SITE_URL = 'https://junkbranding.com'
const SITE_NAME = 'JunkBranding'
const DEFAULT_OG_IMAGE = '/opengraph-image'

const defaultKeywords = [
  'Web制作',
  'ホームページ制作',
  'ブランディング',
  'Webデザイン',
  'ロゴ制作',
  '茨城',
  '東京',
  '神奈川',
]

type PageMetadataOptions = {
  title: string
  description: string
  path?: string
  keywords?: string[]
  imageAlt?: string
  index?: boolean
  category?: string
}

export function createPageMetadata({
  title,
  description,
  path = '',
  keywords = [],
  imageAlt = `${SITE_NAME} - ブランディング & Web制作スタジオ`,
  index = true,
  category = 'Web制作・ブランディング',
}: PageMetadataOptions): Metadata {
  const url = `${SITE_URL}${path}`
  const mergedKeywords = [...defaultKeywords, ...keywords]

  return {
    title,
    description,
    keywords: Array.from(new Set(mergedKeywords)),
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
      title: `${title} | ${SITE_NAME}`,
      description,
      url,
      siteName: SITE_NAME,
      type: 'website',
      locale: 'ja_JP',
      images: [
        {
          url: DEFAULT_OG_IMAGE,
          width: 1200,
          height: 630,
          alt: imageAlt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${SITE_NAME}`,
      description,
      images: [DEFAULT_OG_IMAGE],
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
  }
}

