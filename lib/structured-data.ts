// Structured Data (JSON-LD) helpers for SEO

const BASE_URL = 'https://junkbranding.com'
const LOGO_URL = `${BASE_URL}/icon.svg`
const OG_IMAGE_URL = `${BASE_URL}/opengraph-image`

const areaServed = [
  { '@type': 'State', name: '茨城県' },
  { '@type': 'State', name: '東京都' },
  { '@type': 'State', name: '神奈川県' },
]

const knowsAbout = [
  'Web制作',
  'ホームページ制作',
  'ブランディング',
  'Webデザイン',
  'ロゴ制作',
  'コーポレートサイト制作',
  'ランディングページ制作',
  'SEO対策',
  'マーケティング',
]

const serviceCatalog = {
  '@type': 'OfferCatalog',
  name: 'JunkBrandingのサービス',
  itemListElement: [
    { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Webサイト制作', serviceType: 'Web Design and Development' } },
    { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'ブランディング', serviceType: 'Brand Strategy and Identity Design' } },
    { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'ロゴデザイン', serviceType: 'Logo Design' } },
    { '@type': 'Offer', itemOffered: { '@type': 'Service', name: '動画制作', serviceType: 'Video Production' } },
    { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'マーケティング支援', serviceType: 'Digital Marketing' } },
  ],
}

type JsonLdNode = Record<string, unknown>

export function generateJsonLdGraph(items: JsonLdNode[]) {
  return {
    '@context': 'https://schema.org',
    '@graph': items.flatMap((item) => {
      if (Array.isArray(item['@graph'])) {
        return item['@graph'] as JsonLdNode[]
      }

      const node = { ...item }
      delete node['@context']
      return [node]
    }),
  }
}

// Organization schema - base for all pages
export const organizationSchema = {
  '@type': 'Organization',
  '@id': `${BASE_URL}/#organization`,
  name: 'JunkBranding',
  legalName: 'JunkBranding',
  alternateName: ['ジャンクブランディング', 'JUNKBRANDING'],
  slogan: 'あなたの「らしさ」をカタチに。',
  description: '茨城・東京・神奈川を中心に活動するブランディング&Web制作スタジオ。',
  url: BASE_URL,
  logo: {
    '@type': 'ImageObject',
    url: LOGO_URL,
    width: 32,
    height: 32,
  },
  image: OG_IMAGE_URL,
  telephone: '+81-80-9155-0426',
  email: 'hello@junkbranding.com',
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+81-80-9155-0426',
    email: 'hello@junkbranding.com',
    contactType: 'sales',
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
  areaServed,
  knowsAbout,
  makesOffer: serviceCatalog,
  sameAs: [],
}

export const localBusinessSchema = {
  '@type': ['LocalBusiness', 'ProfessionalService'],
  '@id': `${BASE_URL}/#localbusiness`,
  name: 'JunkBranding',
  url: BASE_URL,
  image: OG_IMAGE_URL,
  description:
    '茨城県を拠点に、東京・神奈川・全国オンライン対応でWeb制作、ブランディング、ロゴ制作、マーケティング支援を行う小規模クリエイティブスタジオ。',
  telephone: '+81-80-9155-0426',
  email: 'hello@junkbranding.com',
  priceRange: '¥¥',
  address: organizationSchema.address,
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 35.9833,
    longitude: 140.3167,
  },
  areaServed,
  knowsAbout,
  makesOffer: serviceCatalog,
  parentOrganization: {
    '@id': `${BASE_URL}/#organization`,
  },
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    opens: '10:00',
    closes: '18:00',
  },
}

export function generateWebsiteSchema() {
  return {
    '@type': 'WebSite',
    '@id': `${BASE_URL}/#website`,
    url: BASE_URL,
    name: 'JunkBranding',
    alternateName: ['ジャンクブランディング', 'JUNKBRANDING'],
    description:
      '茨城・東京・神奈川を中心に活動する、ブランディングとWeb制作のクリエイティブスタジオ。',
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
  }
}

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
          text: '茨城・東京・神奈川を中心に、オンラインで全国からのWeb制作・ブランディング相談に対応しています。',
        },
      },
      {
        '@type': 'Question',
        name: 'どのようなサービスを依頼できますか？',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Webサイト制作、ブランディング、ロゴデザイン、CMS構築、動画制作、SEO対策、マーケティング支援、保守運用に対応しています。',
        },
      },
      {
        '@type': 'Question',
        name: 'JunkBrandingの特徴は何ですか？',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '2人だけの小さなチームとして、事業者一人ひとりのらしさに向き合い、ブランド体験と成果につながるWeb制作を丁寧に行うことです。',
        },
      },
    ],
  }
}

// WebPage schema generator
export function generateWebPageSchema({
  title,
  description,
  path = '',
  type = 'WebPage',
}: {
  title: string
  description: string
  path?: string
  type?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': type,
    '@id': `${BASE_URL}${path}/#webpage`,
    url: `${BASE_URL}${path}`,
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
        description: '茨城・東京・神奈川を中心に活動する、2人だけのブランディング&Web制作スタジオ。大手にはできない、丁寧なものづくりを。',
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
        '@type': 'Organization',
        '@id': `${BASE_URL}/#organization`,
        name: 'JunkBranding',
        url: BASE_URL,
        logo: {
          '@type': 'ImageObject',
          url: LOGO_URL,
          width: 32,
          height: 32,
        },
        description: '茨城・東京・神奈川を中心に活動する、2人だけのブランディング&Web制作スタジオ。',
        areaServed,
        knowsAbout,
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
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            item: {
              '@type': 'CreativeWork',
              name: 'JunkBranding',
              description: '自身のクリエイティブと思想を表現するポートフォリオサイト。',
              url: `${BASE_URL}/`,
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
              description: '不動産会社のコーポレートサイト。信頼感と先進性を両立したデザイン。',
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
    primaryImageOfPage: {
      '@type': 'ImageObject',
      url: OG_IMAGE_URL,
      width: 1200,
      height: 630,
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
          serviceType: 'Web Design',
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
          name: 'ブランディング',
          description: 'ロゴ、カラー、トーン&マナーなど、ブランドの核となるアイデンティティを構築します。',
          serviceType: 'Branding',
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
          name: '開発・実装',
          description: '高速で安全、そして保守性の高いWebサイトを、最新技術で実装します。',
          serviceType: 'Web Development',
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
          name: 'コンサルティング',
          description: 'Web戦略の立案から運用まで、ビジネス成長に貢献する提案を行います。',
          serviceType: 'Consulting',
          areaServed,
          provider: {
            '@id': `${BASE_URL}/#organization`,
          },
        },
      },
    ],
  }
}

// Pricing page schema with Service offerings
export function generatePricingPageSchema() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${BASE_URL}/pricing/#webpage`,
        url: `${BASE_URL}/pricing`,
        name: '制作料金 | JunkBranding',
        description: 'JunkBrandingの制作料金のご案内。Webサイト制作、CMS構築、アプリ開発、デザイン、紙媒体、動画制作、マーケティングまで幅広く対応。',
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
              description: 'コーポレートサイト、ランディングページ、ECサイトなど',
              serviceType: 'Web Design and Development',
              areaServed,
              offers: {
                '@type': 'Offer',
                priceSpecification: {
                  '@type': 'PriceSpecification',
                  price: '150000',
                  priceCurrency: 'JPY',
                  minPrice: '150000',
                },
              },
              provider: { '@id': `${BASE_URL}/#organization` },
            },
          },
          {
            '@type': 'ListItem',
            position: 2,
            item: {
              '@type': 'Service',
              name: 'CMS構築',
              description: 'WordPress、microCMS、Notion連携など',
              serviceType: 'CMS Development',
              areaServed,
              offers: {
                '@type': 'Offer',
                priceSpecification: {
                  '@type': 'PriceSpecification',
                  price: '100000',
                  priceCurrency: 'JPY',
                  minPrice: '100000',
                },
              },
              provider: { '@id': `${BASE_URL}/#organization` },
            },
          },
          {
            '@type': 'ListItem',
            position: 3,
            item: {
              '@type': 'Service',
              name: 'アプリ開発',
              description: 'Webアプリ、PWA、LINE連携、業務効率化ツール',
              serviceType: 'Application Development',
              areaServed,
              offers: {
                '@type': 'Offer',
                priceSpecification: {
                  '@type': 'PriceSpecification',
                  price: '500000',
                  priceCurrency: 'JPY',
                  minPrice: '500000',
                },
              },
              provider: { '@id': `${BASE_URL}/#organization` },
            },
          },
          {
            '@type': 'ListItem',
            position: 4,
            item: {
              '@type': 'Service',
              name: 'デザイン',
              description: 'ロゴ、名刺、バナー、UIデザイン、ブランドガイドライン',
              serviceType: 'Graphic Design',
              areaServed,
              offers: {
                '@type': 'Offer',
                priceSpecification: {
                  '@type': 'PriceSpecification',
                  price: '10000',
                  priceCurrency: 'JPY',
                  minPrice: '10000',
                },
              },
              provider: { '@id': `${BASE_URL}/#organization` },
            },
          },
          {
            '@type': 'ListItem',
            position: 5,
            item: {
              '@type': 'Service',
              name: '紙媒体',
              description: 'チラシ、パンフレット、ポスター、会社案内',
              serviceType: 'Print Design',
              areaServed,
              offers: {
                '@type': 'Offer',
                priceSpecification: {
                  '@type': 'PriceSpecification',
                  price: '10000',
                  priceCurrency: 'JPY',
                  minPrice: '10000',
                },
              },
              provider: { '@id': `${BASE_URL}/#organization` },
            },
          },
          {
            '@type': 'ListItem',
            position: 6,
            item: {
              '@type': 'Service',
              name: '動画制作',
              description: 'SNSショート動画、サービス紹介、企業紹介、モーショングラフィックス',
              serviceType: 'Video Production',
              areaServed,
              offers: {
                '@type': 'Offer',
                priceSpecification: {
                  '@type': 'PriceSpecification',
                  price: '100000',
                  priceCurrency: 'JPY',
                  minPrice: '100000',
                },
              },
              provider: { '@id': `${BASE_URL}/#organization` },
            },
          },
          {
            '@type': 'ListItem',
            position: 7,
            item: {
              '@type': 'Service',
              name: 'マーケティング',
              description: 'SNS運用、Web広告、SEO対策、アクセス解析、MEO対策',
              serviceType: 'Digital Marketing',
              areaServed,
              offers: {
                '@type': 'Offer',
                priceSpecification: {
                  '@type': 'PriceSpecification',
                  price: '30000',
                  priceCurrency: 'JPY',
                  minPrice: '30000',
                  billingDuration: 'P1M',
                },
              },
              provider: { '@id': `${BASE_URL}/#organization` },
            },
          },
          {
            '@type': 'ListItem',
            position: 8,
            item: {
              '@type': 'Service',
              name: '保守・運用',
              description: 'サイト更新、バックアップ、セキュリティ対策',
              serviceType: 'Website Maintenance',
              areaServed,
              offers: {
                '@type': 'Offer',
                priceSpecification: {
                  '@type': 'PriceSpecification',
                  price: '5000',
                  priceCurrency: 'JPY',
                  minPrice: '5000',
                  billingDuration: 'P1M',
                },
              },
              provider: { '@id': `${BASE_URL}/#organization` },
            },
          },
        ],
      },
      organizationSchema,
    ],
  }
}

// BreadcrumbList schema generator
export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    '@id': `${items[items.length - 1]?.url ?? BASE_URL}/#breadcrumb`,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}
