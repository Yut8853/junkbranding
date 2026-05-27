import type { Metadata } from 'next'
import Link from 'next/link'
import {
  generateBreadcrumbSchema,
  generateJsonLdGraph,
  generateWebPageSchema,
} from '@/lib/structured-data'
import { createPageMetadata } from '@/lib/seo'

const pageTitle = '茨城のHP制作・Web制作'
const pageDescription =
  '茨城県でHP制作・Web制作を検討している企業、店舗、個人事業主向けに、JunkBrandingがホームページ制作、LP制作、Webサイト改善、ブランディングまで一貫して支援します。'
const pagePath = '/ibaraki-hp-production'

const strengths = [
  {
    title: '茨城の事業者に合わせた情報設計',
    body: '地域で選ばれる理由、サービスの強み、問い合わせまでの導線を整理し、見た目だけで終わらないホームページを設計します。',
  },
  {
    title: 'デザインから実装まで一貫対応',
    body: 'Webデザイン、フロントエンド実装、レスポンシブ対応、SEO内部設計まで、公開に必要な工程をまとめて進めます。',
  },
  {
    title: '小さく始めて育てられる制作',
    body: '最初から大きく作りすぎず、事業フェーズや予算に合わせて、LP、コーポレートサイト、CMS化などを段階的に提案します。',
  },
]

const services = [
  'ホームページ制作',
  'Webサイト制作',
  'コーポレートサイト制作',
  'LP制作',
  'スマートフォン対応',
  'SEO内部設計',
  'Webサイト改善',
  'ロゴ制作・ブランド設計',
]

const areas = [
  '水戸市',
  'つくば市',
  '土浦市',
  '牛久市',
  '龍ケ崎市',
  '取手市',
  '守谷市',
  '稲敷市',
  '美浦村',
  '阿見町',
  '茨城県全域',
]

const faqs = [
  {
    question: '茨城県外からでもWeb制作を依頼できますか？',
    answer:
      'はい。茨城県を拠点にしていますが、オンラインで全国対応しています。茨城、東京、神奈川を中心に、遠方のご相談も対応可能です。',
  },
  {
    question: 'HP制作とWeb制作はどちらで相談すればいいですか？',
    answer:
      'どちらの言葉でも問題ありません。会社案内や店舗紹介のホームページ制作から、集客導線を含めたWebサイト制作、LP制作まで対応しています。',
  },
  {
    question: 'まだ内容が決まっていなくても相談できますか？',
    answer:
      '可能です。事業内容、ターゲット、競合、問い合わせにつなげたい流れを整理するところから一緒に進めます。',
  },
]

export const metadata: Metadata = createPageMetadata({
  title: '茨城のHP制作・Web制作 | ホームページ制作相談',
  description: pageDescription,
  path: pagePath,
  keywords: [
    '茨城 HP制作',
    '茨城 Web制作',
    '茨城 ホームページ制作',
    '茨城 Webサイト制作',
    'ホームページ制作 茨城',
    'Web制作 茨城',
    '茨城県 ホームページ制作',
    '茨城県 Web制作',
  ],
})

const jsonLd = generateJsonLdGraph([
  generateWebPageSchema({
    title: `${pageTitle} | JunkBranding`,
    description: pageDescription,
    path: pagePath,
    type: 'Service',
  }),
  {
    '@type': 'Service',
    '@id': `https://junkbranding.com${pagePath}#service`,
    name: '茨城のHP制作・Web制作',
    serviceType: 'ホームページ制作・Web制作',
    description: pageDescription,
    provider: {
      '@id': 'https://junkbranding.com/#organization',
    },
    areaServed: [
      { '@type': 'State', name: '茨城県' },
      { '@type': 'Country', name: '日本' },
    ],
    availableChannel: {
      '@type': 'ServiceChannel',
      serviceUrl: 'https://junkbranding.com/contact',
      availableLanguage: 'ja',
    },
  },
  {
    '@type': 'FAQPage',
    '@id': `https://junkbranding.com${pagePath}#faq`,
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  },
  generateBreadcrumbSchema([
    { name: 'ホーム', url: 'https://junkbranding.com' },
    { name: '茨城のHP制作・Web制作', url: `https://junkbranding.com${pagePath}` },
  ]),
])

export default function IbarakiHpProductionPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="glass-light">
        <section className="relative flex min-h-[82svh] items-center overflow-hidden border-b border-border/20 py-28 md:py-36">
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden opacity-[0.035]">
            <span className="type-display whitespace-nowrap text-[22vw]">
              IBARAKI
            </span>
          </div>

          <div className="container relative z-10 mx-auto px-6 md:px-14 lg:px-20">
            <div className="max-w-4xl">
              <p className="type-label mb-5 text-xs uppercase tracking-[0.24em] text-muted-foreground">
                Ibaraki Web Production
              </p>
              <h1 className="type-section-title text-4xl leading-tight md:text-6xl lg:text-7xl">
                茨城のHP制作・Web制作を、事業の伝わり方から整えます。
              </h1>
              <p className="type-body mt-7 max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">
                JunkBrandingは茨城県を拠点に、企業・店舗・個人事業主のホームページ制作、Webサイト制作、LP制作、ブランディングを支援しています。
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  href="/contact"
                  className="cta-primary type-cta inline-flex rounded-full px-7 py-4 text-sm"
                >
                  Web制作を相談する
                </Link>
                <Link
                  href="/works"
                  className="type-cta inline-flex rounded-full border border-border/60 px-7 py-4 text-sm text-foreground transition-colors hover:bg-card"
                >
                  制作実績を見る
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 md:py-28">
          <div className="container mx-auto px-6 md:px-14 lg:px-20">
            <div className="mb-12 max-w-3xl">
              <p className="type-label mb-4 text-xs uppercase tracking-[0.24em] text-muted-foreground">
                For Local Business
              </p>
              <h2 className="type-section-title text-3xl md:text-5xl">
                茨城で選ばれるためのWebサイトへ。
              </h2>
              <p className="type-body mt-5 text-sm leading-7 text-muted-foreground md:text-base">
                「とりあえず作る」ではなく、誰に何を伝え、どの行動につなげるかを整理してから制作します。検索で見つけてもらうこと、見た人に信頼してもらうこと、問い合わせにつながることを同時に考えます。
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {strengths.map((item) => (
                <article
                  key={item.title}
                  className="rounded-3xl border border-border/50 bg-card/40 p-6 md:p-7"
                >
                  <h3 className="type-card-title text-lg">{item.title}</h3>
                  <p className="type-body-compact mt-4 text-sm leading-7 text-muted-foreground">
                    {item.body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-border/20 py-20 md:py-28">
          <div className="container mx-auto grid gap-12 px-6 md:px-14 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:px-20">
            <div>
              <p className="type-label mb-4 text-xs uppercase tracking-[0.24em] text-muted-foreground">
                Service
              </p>
              <h2 className="type-section-title text-3xl md:text-5xl">
                HP制作からWeb改善まで対応。
              </h2>
              <p className="type-body mt-5 text-sm leading-7 text-muted-foreground md:text-base">
                茨城の企業サイト、店舗サイト、サービスサイト、ランディングページまで、目的に合わせて必要な制作範囲を組み立てます。
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {services.map((service) => (
                <div
                  key={service}
                  className="rounded-2xl border border-border/45 bg-background/45 px-5 py-4"
                >
                  <span className="type-body-compact text-sm text-foreground/85">
                    {service}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 md:py-28">
          <div className="container mx-auto px-6 md:px-14 lg:px-20">
            <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.8fr)]">
              <div>
                <p className="type-label mb-4 text-xs uppercase tracking-[0.24em] text-muted-foreground">
                  Area
                </p>
                <h2 className="type-section-title text-3xl md:text-5xl">
                  茨城県全域から相談できます。
                </h2>
                <p className="type-body mt-5 text-sm leading-7 text-muted-foreground md:text-base">
                  美浦村を拠点に、水戸市、つくば市、土浦市、牛久市、龍ケ崎市、取手市、守谷市など茨城県内のHP制作・Web制作相談に対応しています。オンラインでの打ち合わせも可能です。
                </p>
              </div>

              <div className="rounded-3xl border border-border/50 bg-card/40 p-6 md:p-7">
                <p className="type-label mb-4 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  対応エリア
                </p>
                <div className="flex flex-wrap gap-2.5">
                  {areas.map((area) => (
                    <span
                      key={area}
                      className="type-body-compact rounded-full border border-border/50 bg-background/55 px-3.5 py-2 text-xs text-muted-foreground"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-border/20 py-20 md:py-28">
          <div className="container mx-auto px-6 md:px-14 lg:px-20">
            <div className="mb-10 max-w-3xl">
              <p className="type-label mb-4 text-xs uppercase tracking-[0.24em] text-muted-foreground">
                FAQ
              </p>
              <h2 className="type-section-title text-3xl md:text-5xl">
                茨城のWeb制作相談でよくある質問。
              </h2>
            </div>

            <div className="grid gap-4">
              {faqs.map((faq) => (
                <article
                  key={faq.question}
                  className="rounded-3xl border border-border/50 bg-card/40 p-6 md:p-7"
                >
                  <h3 className="type-card-title text-lg">{faq.question}</h3>
                  <p className="type-body-compact mt-4 text-sm leading-7 text-muted-foreground">
                    {faq.answer}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-border/20 py-20 md:py-28">
          <div className="container mx-auto px-6 text-center md:px-14 lg:px-20">
            <p className="type-label mb-4 text-xs uppercase tracking-[0.24em] text-muted-foreground">
              Contact
            </p>
            <h2 className="type-section-title mx-auto max-w-3xl text-3xl md:text-5xl">
              茨城でHP制作・Web制作を検討している方へ。
            </h2>
            <p className="type-body mx-auto mt-5 max-w-2xl text-sm leading-7 text-muted-foreground md:text-base">
              まだ内容が固まっていない段階でも大丈夫です。目的や予算、公開時期を聞いたうえで、必要な制作範囲を整理します。
            </p>
            <Link
              href="/contact"
              className="cta-primary type-cta mt-10 inline-flex rounded-full px-8 py-4 text-sm"
            >
              無料で相談する
            </Link>
          </div>
        </section>
      </main>
    </>
  )
}
