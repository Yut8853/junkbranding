import type { Metadata } from 'next';
import type { PageMetadataOptions } from '@/types/seo';

const SITE_URL = 'https://junkbranding.com';
const SITE_NAME = 'JunkBranding';
const DEFAULT_OG_IMAGE = '/ogp.jpg';
const DEFAULT_DESCRIPTION =
  '茨城県を拠点に、ホームページ制作・Web制作を中心に手がける小さなクリエイティブスタジオ。Webサイト制作、LP制作、ロゴ制作、ブランド設計まで、事業のらしさを成果につながる形へ整えます。';

const defaultKeywords = [
  'HP制作',
  'Web制作',
  'ホームページ制作',
  'Webサイト制作',
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
  '茨城 HP制作',
  '茨城 ホームページ制作',
  '茨城 Web制作',
  '東京',
  '神奈川',
];

export function createPageMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  path = '',
  keywords = [],
  image = DEFAULT_OG_IMAGE,
  imageAlt = `${SITE_NAME} - 茨城のHP制作・Web制作スタジオ`,
  index = true,
  category = 'Web制作・ブランディング',
}: PageMetadataOptions): Metadata {
  const url = `${SITE_URL}${path}`;
  const fullTitle = title.includes(SITE_NAME)
    ? title
    : `${title} | ${SITE_NAME}`;
  const mergedKeywords = Array.from(new Set([...defaultKeywords, ...keywords]));

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
        'ホームページ制作, Web制作, Webサイト制作, LP制作, ロゴ制作, ブランディング, SEO対策',
      'accessibility-summary':
        'キーボード操作、スクリーンリーダー、WAI-ARIA属性、SPでのモーション削減に配慮しています。',
    },
  };
}
