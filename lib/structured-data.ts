// SEO用の構造化データ(JSON-LD)を生成するヘルパー。
// 各ページでは必要なschemaだけを組み合わせ、最終的に@graphへ正規化して出力する。

import type { JsonLdNode } from '@/types/seo';

const BASE_URL = 'https://junkbranding.com';
const LOGO_URL = `${BASE_URL}/icon.svg`;
const OG_IMAGE_URL = `${BASE_URL}/ogp.jpg`;

const areaServed = [
  { '@type': 'State', name: '茨城県' },
  { '@type': 'State', name: '東京都' },
  { '@type': 'State', name: '神奈川県' },
  { '@type': 'Country', name: '日本' },
];

const knowsAbout = [
  'HP制作',
  'Web制作',
  'ホームページ制作',
  'LP制作',
  'ランディングページ制作',
  'ブランディング',
  'ブランド設計',
  'Webデザイン',
  'ロゴ制作',
  'コーポレートサイト制作',
  'CMS構築',
  'WordPress',
  'SEO対策',
  'マーケティング支援',
];

const serviceCatalog = {
  '@type': 'OfferCatalog',
  name: 'JunkBrandingのサービス',
  itemListElement: [
    {
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        name: 'ホームページ制作・Webサイト制作',
        serviceType: 'Web Design and Development',
      },
    },
    {
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        name: 'LP制作',
        serviceType: 'Landing Page Design and Development',
      },
    },
    {
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        name: 'ブランディング',
        serviceType: 'Brand Strategy and Identity Design',
      },
    },
    {
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        name: 'ロゴデザイン',
        serviceType: 'Logo Design',
      },
    },
    {
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        name: 'CMS構築',
        serviceType: 'CMS Development',
      },
    },
    {
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        name: '保守・運用',
        serviceType: 'Website Maintenance',
      },
    },
  ],
};

function pageId(path = '') {
  return `${BASE_URL}${path}#webpage`;
}

function pageUrl(path = '') {
  return `${BASE_URL}${path}`;
}

export function generateJsonLdGraph(items: JsonLdNode[]) {
  return {
    '@context': 'https://schema.org',
    '@graph': items.flatMap(item => {
      if (Array.isArray(item['@graph'])) {
        return item['@graph'] as JsonLdNode[];
      }

      const node = { ...item };
      delete node['@context'];
      return [node];
    }),
  };
}

// 全ページ共通の事業者情報。WebSite / WebPage / 各サービスschemaから参照される土台。
export const organizationSchema = {
  '@type': 'Organization',
  '@id': `${BASE_URL}/#organization`,
  name: 'JunkBranding',
  legalName: 'JunkBranding',
  alternateName: ['ジャンクブランディング', 'JUNKBRANDING'],
  slogan: 'あなたの「らしさ」をカタチに。',
  description:
    '茨城県を拠点に、ホームページ制作・Web制作を中心に手がけるクリエイティブスタジオ。',
  url: BASE_URL,
  logo: {
    '@type': 'ImageObject',
    url: LOGO_URL,
    width: 32,
    height: 32,
  },
  image: {
    '@type': 'ImageObject',
    url: OG_IMAGE_URL,
    width: 1200,
    height: 630,
  },
  areaServed,
  knowsAbout,
  makesOffer: serviceCatalog,
};

export const localBusinessSchema = {
  '@type': 'LocalBusiness',
  '@id': `${BASE_URL}/#localbusiness`,
  name: 'JunkBranding',
  url: BASE_URL,
  image: OG_IMAGE_URL,
  logo: LOGO_URL,
  description:
    '茨城県を拠点に、全国オンライン対応でホームページ制作・Web制作・LP制作を行うクリエイティブスタジオ。',
  priceRange: '¥¥',
  areaServed,
  knowsAbout,
  makesOffer: serviceCatalog,
  parentOrganization: {
    '@id': `${BASE_URL}/#organization`,
  },
  address: {
    '@type': 'PostalAddress',
    addressRegion: '茨城県',
    addressCountry: 'JP',
  },
};

// サイト全体を表すschema。検索エンジンにサイト名・運営者・相談導線を伝える。
export function generateWebsiteSchema() {
  return {
    '@type': 'WebSite',
    '@id': `${BASE_URL}/#website`,
    url: BASE_URL,
    name: 'JunkBranding',
    alternateName: ['ジャンクブランディング', 'JUNKBRANDING'],
    description:
      '茨城県を拠点に、ホームページ制作・Web制作を中心に手がけるクリエイティブスタジオ。',
    inLanguage: 'ja',
    publisher: {
      '@id': `${BASE_URL}/#organization`,
    },
    about: {
      '@id': `${BASE_URL}/#organization`,
    },
    potentialAction: {
      '@type': 'CommunicateAction',
      name: 'Web制作・ブランディングについて相談する',
      target: `${BASE_URL}/contact`,
    },
  };
}

// 汎用WebPage schema。個別ページで特別な型が不要な場合のベースとして使う。
export function generateWebPageSchema({
  title,
  description,
  path = '',
  type = 'WebPage',
}: {
  title: string;
  description: string;
  path?: string;
  type?: string;
}) {
  return {
    '@type': type,
    '@id': pageId(path),
    url: pageUrl(path),
    name: title,
    description,
    primaryImageOfPage: {
      '@type': 'ImageObject',
      url: OG_IMAGE_URL,
      width: 1200,
      height: 630,
    },
    isPartOf: {
      '@id': `${BASE_URL}/#website`,
    },
    about: {
      '@id': `${BASE_URL}/#organization`,
    },
    provider: {
      '@id': `${BASE_URL}/#organization`,
    },
    inLanguage: 'ja',
  };
}

// Aboutページ用schema。スタジオ情報に加えて、メンバーや拠点の文脈を補う。
export function generateAboutPageSchema() {
  return {
    '@graph': [
      {
        '@type': 'AboutPage',
        '@id': pageId('/about'),
        url: pageUrl('/about'),
        name: '私たちについて | JunkBranding',
        description:
          'JunkBrandingは、茨城発のブランディング&Web制作スタジオです。東京・神奈川にも対応し、戦略設計・デザイン・実装まで一貫して支援します。',
        isPartOf: {
          '@id': `${BASE_URL}/#website`,
        },
        about: {
          '@id': `${BASE_URL}/#organization`,
        },
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: OG_IMAGE_URL,
          width: 1200,
          height: 630,
        },
        inLanguage: 'ja',
      },
      {
        ...organizationSchema,
        founder: [
          {
            '@type': 'Person',
            name: '木崎 有貴',
            jobTitle: 'Creative Director',
          },
          {
            '@type': 'Person',
            name: 'つかさ',
            jobTitle: 'Art Director & Designer',
          },
        ],
        numberOfEmployees: {
          '@type': 'QuantitativeValue',
          value: 2,
        },
        foundingLocation: {
          '@type': 'Place',
          address: {
            '@type': 'PostalAddress',
            addressRegion: '茨城県',
            addressCountry: 'JP',
          },
        },
      },
    ],
  };
}

// Contactページ用schema。問い合わせ導線が事業者情報と結びつくようにする。
export function generateContactPageSchema() {
  return {
    '@graph': [
      {
        '@type': 'ContactPage',
        '@id': pageId('/contact'),
        url: pageUrl('/contact'),
        name: 'お問い合わせ | Web制作・ブランディングのご相談 | JunkBranding',
        description:
          'JunkBrandingへのお問い合わせページです。Webサイト制作、LP制作、ブランディング、ロゴデザインのご相談・お見積もりはこちらからお気軽にご連絡ください。',
        isPartOf: {
          '@id': `${BASE_URL}/#website`,
        },
        about: {
          '@id': `${BASE_URL}/#organization`,
        },
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: OG_IMAGE_URL,
          width: 1200,
          height: 630,
        },
        inLanguage: 'ja',
      },
      organizationSchema,
    ],
  };
}

// Worksページ用schema。制作実績をCollectionPageとItemListで表現する。
export function generateWorksPageSchema() {
  return {
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': pageId('/works'),
        url: pageUrl('/works'),
        name: '制作実績 | Web制作・LP制作・ブランディング事例 | JunkBranding',
        description:
          'JunkBrandingの制作実績ページです。コーポレートサイト、LP制作、ブランディングなど、ブランド体験と成果を意識した制作事例をご紹介します。',
        isPartOf: {
          '@id': `${BASE_URL}/#website`,
        },
        about: {
          '@id': `${BASE_URL}/#organization`,
        },
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: OG_IMAGE_URL,
          width: 1200,
          height: 630,
        },
        inLanguage: 'ja',
      },
      {
        '@type': 'ItemList',
        name: '制作実績一覧',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            item: {
              '@type': 'CreativeWork',
              name: 'JunkBranding',
              description:
                '自身のクリエイティブと思想を表現するポートフォリオサイト。',
              url: BASE_URL,
              creator: {
                '@id': `${BASE_URL}/#organization`,
              },
            },
          },
          {
            '@type': 'ListItem',
            position: 2,
            item: {
              '@type': 'CreativeWork',
              name: 'TO PLACE',
              description:
                '不動産会社のコーポレートサイト。信頼感と先進性を両立したデザイン。',
              url: 'https://to-place.co.jp/',
              creator: {
                '@id': `${BASE_URL}/#organization`,
              },
            },
          },
          {
            '@type': 'ListItem',
            position: 3,
            item: {
              '@type': 'CreativeWork',
              name: 'LUZ REAL',
              description:
                '洗練されたビジュアルと使いやすさを追求したコーポレートサイト。',
              url: 'https://luz-real.com/',
              creator: {
                '@id': `${BASE_URL}/#organization`,
              },
            },
          },
        ],
      },
      organizationSchema,
    ],
  };
}

// プライバシーポリシー用schema。法務系ページとして最終確認日も含める。
export function generatePrivacyPageSchema() {
  return {
    '@type': 'WebPage',
    '@id': pageId('/privacy'),
    url: pageUrl('/privacy'),
    name: 'プライバシーポリシー | JunkBranding',
    description:
      'JunkBrandingのプライバシーポリシーです。個人情報の取り扱い、Cookieの使用、外部サービス利用時の情報管理についてご説明します。',
    isPartOf: {
      '@id': `${BASE_URL}/#website`,
    },
    about: {
      '@id': `${BASE_URL}/#organization`,
    },
    primaryImageOfPage: {
      '@type': 'ImageObject',
      url: OG_IMAGE_URL,
      width: 1200,
      height: 630,
    },
    inLanguage: 'ja',
    lastReviewed: '2026-04-01',
  };
}

// TOPページ用の主要サービスschema。サービス名と提供者の関係を明示する。
export function generateServiceSchema() {
  return {
    '@type': 'ItemList',
    name: 'JunkBrandingの主なサービス',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        item: {
          '@type': 'Service',
          name: 'ホームページ制作・Webサイト制作',
          description:
            '茨城県を拠点に、企業や店舗向けのホームページ制作・Webサイト制作を設計からデザイン、実装まで一貫して行います。',
          serviceType: 'Web Design and Development',
          areaServed,
          provider: {
            '@id': `${BASE_URL}/#organization`,
          },
        },
      },
      {
        '@type': 'ListItem',
        position: 2,
        item: {
          '@type': 'Service',
          name: 'LP制作',
          description:
            '商品やサービスの魅力を整理し、問い合わせや購入につながるランディングページを制作します。',
          serviceType: 'Landing Page Design and Development',
          areaServed,
          provider: {
            '@id': `${BASE_URL}/#organization`,
          },
        },
      },
      {
        '@type': 'ListItem',
        position: 3,
        item: {
          '@type': 'Service',
          name: 'ブランディング',
          description:
            'ブランドの方向性、言葉、ビジュアル表現を整理し、事業のらしさが伝わる形へ整えます。',
          serviceType: 'Branding',
          areaServed,
          provider: {
            '@id': `${BASE_URL}/#organization`,
          },
        },
      },
      {
        '@type': 'ListItem',
        position: 4,
        item: {
          '@type': 'Service',
          name: 'ロゴデザイン',
          description:
            'ブランドの価値や世界観を表すロゴ、カラー、トーン&マナーを設計します。',
          serviceType: 'Logo Design',
          areaServed,
          provider: {
            '@id': `${BASE_URL}/#organization`,
          },
        },
      },
      {
        '@type': 'ListItem',
        position: 5,
        item: {
          '@type': 'Service',
          name: 'CMS構築',
          description:
            'WordPressなどを活用し、更新しやすく運用しやすいWebサイトを構築します。',
          serviceType: 'CMS Development',
          areaServed,
          provider: {
            '@id': `${BASE_URL}/#organization`,
          },
        },
      },
      {
        '@type': 'ListItem',
        position: 6,
        item: {
          '@type': 'Service',
          name: '保守・運用',
          description:
            '公開後の更新、改善、保守を通じて、Webサイトを継続的に育てます。',
          serviceType: 'Website Maintenance',
          areaServed,
          provider: {
            '@id': `${BASE_URL}/#organization`,
          },
        },
      },
    ],
  };
}

// Pricingページ用schema。価格目安をOfferとして出し、料金ページの意味を補強する。
export function generatePricingPageSchema() {
  return {
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': pageId('/pricing'),
        url: pageUrl('/pricing'),
        name: '制作料金 | Web制作・LP制作・ブランディングの料金 | JunkBranding',
        description:
          'JunkBrandingの制作料金ページです。Webサイト制作、CMS構築、デザインなど、目的やご予算に合わせて柔軟にご提案します。',
        isPartOf: {
          '@id': `${BASE_URL}/#website`,
        },
        about: {
          '@id': `${BASE_URL}/#organization`,
        },
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: OG_IMAGE_URL,
          width: 1200,
          height: 630,
        },
        inLanguage: 'ja',
      },
      {
        '@type': 'ItemList',
        name: 'サービス料金一覧',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            item: {
              '@type': 'Service',
              name: 'Webサイト制作',
              description:
                'コーポレートサイト、サービスサイト、採用サイトなどのWebサイト制作。',
              serviceType: 'Web Design and Development',
              areaServed,
              offers: {
                '@type': 'Offer',
                priceCurrency: 'JPY',
                price: '150000',
                availability: 'https://schema.org/InStock',
                url: `${BASE_URL}/pricing`,
              },
              provider: {
                '@id': `${BASE_URL}/#organization`,
              },
            },
          },
          {
            '@type': 'ListItem',
            position: 2,
            item: {
              '@type': 'Service',
              name: 'LP制作',
              description:
                '商品・サービスの魅力を整理し、成果につながるランディングページを制作します。',
              serviceType: 'Landing Page Design and Development',
              areaServed,
              offers: {
                '@type': 'Offer',
                priceCurrency: 'JPY',
                price: '150000',
                availability: 'https://schema.org/InStock',
                url: `${BASE_URL}/pricing`,
              },
              provider: {
                '@id': `${BASE_URL}/#organization`,
              },
            },
          },
          {
            '@type': 'ListItem',
            position: 3,
            item: {
              '@type': 'Service',
              name: 'CMS構築',
              description:
                'WordPressなどを活用し、更新しやすく運用しやすいWebサイトを構築します。',
              serviceType: 'CMS Development',
              areaServed,
              offers: {
                '@type': 'Offer',
                priceCurrency: 'JPY',
                price: '100000',
                availability: 'https://schema.org/InStock',
                url: `${BASE_URL}/pricing`,
              },
              provider: {
                '@id': `${BASE_URL}/#organization`,
              },
            },
          },
          {
            '@type': 'ListItem',
            position: 4,
            item: {
              '@type': 'Service',
              name: 'ブランディング',
              description:
                'ブランド設計、トーン&マナー、ビジュアル方針などを整理します。',
              serviceType: 'Brand Strategy and Identity Design',
              areaServed,
              offers: {
                '@type': 'Offer',
                priceCurrency: 'JPY',
                price: '100000',
                availability: 'https://schema.org/InStock',
                url: `${BASE_URL}/pricing`,
              },
              provider: {
                '@id': `${BASE_URL}/#organization`,
              },
            },
          },
          {
            '@type': 'ListItem',
            position: 5,
            item: {
              '@type': 'Service',
              name: 'ロゴデザイン',
              description:
                'ブランドの価値や世界観を表すロゴデザインを制作します。',
              serviceType: 'Logo Design',
              areaServed,
              offers: {
                '@type': 'Offer',
                priceCurrency: 'JPY',
                price: '50000',
                availability: 'https://schema.org/InStock',
                url: `${BASE_URL}/pricing`,
              },
              provider: {
                '@id': `${BASE_URL}/#organization`,
              },
            },
          },
          {
            '@type': 'ListItem',
            position: 6,
            item: {
              '@type': 'Service',
              name: 'デザイン制作',
              description:
                'バナー、名刺、チラシなど、ブランドに合わせた各種デザインを制作します。',
              serviceType: 'Graphic Design',
              areaServed,
              offers: {
                '@type': 'Offer',
                priceCurrency: 'JPY',
                price: '10000',
                availability: 'https://schema.org/InStock',
                url: `${BASE_URL}/pricing`,
              },
              provider: {
                '@id': `${BASE_URL}/#organization`,
              },
            },
          },
          {
            '@type': 'ListItem',
            position: 7,
            item: {
              '@type': 'Service',
              name: '保守・運用',
              description:
                'サイト更新、改善提案、軽微な修正、保守運用に対応します。',
              serviceType: 'Website Maintenance',
              areaServed,
              offers: {
                '@type': 'Offer',
                priceCurrency: 'JPY',
                price: '5000',
                availability: 'https://schema.org/InStock',
                url: `${BASE_URL}/pricing`,
              },
              provider: {
                '@id': `${BASE_URL}/#organization`,
              },
            },
          },
        ],
      },
      organizationSchema,
    ],
  };
}

// FAQページ用schema。
// 注意: このFAQを使う場合は、同じ質問と回答をページ本文にも表示してください。
export function generateFaqSchema() {
  return {
    '@type': 'FAQPage',
    '@id': `${BASE_URL}/#faq`,
    mainEntity: [
      {
        '@type': 'Question',
        name: 'JunkBrandingはどの地域に対応していますか？',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '茨城県を拠点に、東京・神奈川を含む近隣エリアと、オンラインで全国からのホームページ制作・Web制作相談に対応しています。',
        },
      },
      {
        '@type': 'Question',
        name: 'どのようなサービスを依頼できますか？',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Webサイト制作、LP制作、ブランディング、ロゴデザイン、CMS構築、保守運用などに対応しています。',
        },
      },
      {
        '@type': 'Question',
        name: 'JunkBrandingの特徴は何ですか？',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '事業者一人ひとりのらしさに向き合い、ブランド体験と成果につながるWeb制作を丁寧に行うことです。',
        },
      },
    ],
  };
}

// パンくずリストschema。各ページの階層関係を検索エンジンへ渡す。
export function generateBreadcrumbSchema(
  items: { name: string; url: string }[]
) {
  return {
    '@type': 'BreadcrumbList',
    '@id': `${items[items.length - 1]?.url ?? BASE_URL}#breadcrumb`,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
