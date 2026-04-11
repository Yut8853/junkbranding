// Structured Data (JSON-LD) helpers for SEO

const BASE_URL = 'https://junkbranding.com'

// Organization schema - base for all pages
export const organizationSchema = {
  '@type': 'Organization',
  '@id': `${BASE_URL}/#organization`,
  name: 'JunkBranding',
  url: BASE_URL,
  logo: {
    '@type': 'ImageObject',
    url: `${BASE_URL}/logo.jpg`,
    width: 512,
    height: 512,
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+81-80-9155-0426',
    contactType: 'customer service',
    areaServed: ['JP'],
    availableLanguage: ['Japanese'],
  },
  address: {
    '@type': 'PostalAddress',
    postalCode: '300-0410',
    addressRegion: '茨城県',
    addressLocality: '稲敷郡美浦村',
    streetAddress: 'みどり台767-43',
    addressCountry: 'JP',
  },
  sameAs: [],
}

// WebPage schema generator
export function generateWebPageSchema({
  title,
  description,
  path = '',
}: {
  title: string
  description: string
  path?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${BASE_URL}${path}/#webpage`,
    url: `${BASE_URL}${path}`,
    name: title,
    description,
    isPartOf: {
      '@id': `${BASE_URL}/#website`,
    },
    about: {
      '@id': `${BASE_URL}/#organization`,
    },
    inLanguage: 'ja',
  }
}

// AboutPage schema
export function generateAboutPageSchema() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'AboutPage',
        '@id': `${BASE_URL}/about/#webpage`,
        url: `${BASE_URL}/about`,
        name: '私たちについて | JunkBranding',
        description: '茨城・東京・千葉を中心に活動する、2人だけのブランディング&Web制作スタジオ。大手にはできない、丁寧なものづくりを。',
        isPartOf: {
          '@id': `${BASE_URL}/#website`,
        },
        about: {
          '@id': `${BASE_URL}/#organization`,
        },
        inLanguage: 'ja',
      },
      {
        '@type': 'Organization',
        '@id': `${BASE_URL}/#organization`,
        name: 'JunkBranding',
        url: BASE_URL,
        logo: {
          '@type': 'ImageObject',
          url: `${BASE_URL}/logo.jpg`,
          width: 512,
          height: 512,
        },
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
  }
}

// ContactPage schema
export function generateContactPageSchema() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ContactPage',
        '@id': `${BASE_URL}/contact/#webpage`,
        url: `${BASE_URL}/contact`,
        name: 'お問い合わせ | JunkBranding',
        description: 'JunkBrandingへのお問い合わせページ。Webサイト制作、ロゴデザイン、ブランディングのご相談はこちらから。',
        isPartOf: {
          '@id': `${BASE_URL}/#website`,
        },
        about: {
          '@id': `${BASE_URL}/#organization`,
        },
        inLanguage: 'ja',
      },
      organizationSchema,
    ],
  }
}

// Works/Portfolio CollectionPage schema
export function generateWorksPageSchema() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${BASE_URL}/works/#webpage`,
        url: `${BASE_URL}/works`,
        name: '制作実績 | JunkBranding',
        description: 'JunkBrandingの制作実績。Webサイト制作、ブランディング、ロゴデザインのポートフォリオをご覧いただけます。',
        isPartOf: {
          '@id': `${BASE_URL}/#website`,
        },
        about: {
          '@id': `${BASE_URL}/#organization`,
        },
        inLanguage: 'ja',
      },
      {
        '@type': 'ItemList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            item: {
              '@type': 'CreativeWork',
              name: 'TO PLACE',
              description: '不動産会社のコーポレートサイト。信頼感と先進性を両立したデザイン。',
              url: 'https://to-place.co.jp/',
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
              name: 'LUZ REAL',
              description: '洗練されたビジュアルと使いやすさを追求したコーポレートサイト。',
              url: 'https://luz-real.com/',
              creator: {
                '@id': `${BASE_URL}/#organization`,
              },
            },
          },
        ],
      },
    ],
  }
}

// Privacy Policy page schema
export function generatePrivacyPageSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${BASE_URL}/privacy/#webpage`,
    url: `${BASE_URL}/privacy`,
    name: 'プライバシーポリシー | JunkBranding',
    description: 'JunkBrandingのプライバシーポリシー。個人情報の取り扱いについてご説明します。',
    isPartOf: {
      '@id': `${BASE_URL}/#website`,
    },
    about: {
      '@id': `${BASE_URL}/#organization`,
    },
    inLanguage: 'ja',
    lastReviewed: '2026-04-01',
  }
}

// Service schema for homepage
export function generateServiceSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        item: {
          '@type': 'Service',
          name: 'Webデザイン',
          description: 'ユーザー体験を最優先に、ブランドの世界観を表現するWebサイトをデザインします。',
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
          name: 'ブランディング',
          description: 'ロゴ、カラー、トーン&マナーなど、ブランドの核となるアイデンティティを構築します。',
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
          name: '開発・実装',
          description: '高速で安全、そして保守性の高いWebサイトを、最新技術で実装します。',
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
          name: 'コンサルティング',
          description: 'Web戦略の立案から運用まで、ビジネス成長に貢献する提案を行います。',
          provider: {
            '@id': `${BASE_URL}/#organization`,
          },
        },
      },
    ],
  }
}

// BreadcrumbList schema generator
export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}
