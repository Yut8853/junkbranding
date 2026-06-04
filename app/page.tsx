import type { Metadata } from 'next';
import {
  generateServiceSchema,
  generateBreadcrumbSchema,
  generateJsonLdGraph,
} from '@/lib/structured-data';
import { createPageMetadata } from '@/lib/seo';
import { ModeRouter } from '@/components/mode/mode-router';

export const metadata: Metadata = createPageMetadata({
  title: '茨城のHP制作・Web制作スタジオ',
  description:
    'JunkBrandingは、茨城県を拠点にホームページ制作・Web制作を行う小さなクリエイティブスタジオです。コーポレートサイト制作、LP制作、Webサイト改善、ロゴ制作まで丁寧に対応します。',
  keywords: [
    '茨城 HP制作',
    '茨城 ホームページ制作',
    '茨城 Web制作',
    'ホームページ制作 茨城',
    'Web制作 茨城',
    '茨城 Webサイト制作',
    '東京 Web制作',
    '神奈川 Web制作',
    '茨城 ブランディング',
    'LP制作',
    'コーポレートサイト制作',
    'ロゴ制作',
    'ブランド設計',
  ],
});

const homeJsonLd = generateJsonLdGraph([
  {
    '@type': 'WebPage',
    '@id': 'https://junkbranding.com/#webpage',
    url: 'https://junkbranding.com',
    name: 'JunkBranding | 茨城のHP制作・Web制作スタジオ',
    description:
      'JunkBrandingは、茨城県を拠点にホームページ制作・Web制作を行う小さなクリエイティブスタジオです。',
    isPartOf: {
      '@id': 'https://junkbranding.com/#website',
    },
    about: {
      '@id': 'https://junkbranding.com/#organization',
    },
    inLanguage: 'ja',
  },
  generateServiceSchema(),
  generateBreadcrumbSchema([
    { name: 'ホーム', url: 'https://junkbranding.com' },
  ]),
]);

export default function HomePage() {
  return (
    <>
      {/* TOPページ固有の構造化データを追加し、共通JSON-LDと合わせて検索エンジンへ文脈を渡す。 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd) }}
      />
      <ModeRouter />
    </>
  );
}
