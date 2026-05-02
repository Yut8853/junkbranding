'use client'

import { ArrowRight, Phone, MessageCircle, Check, Sparkles, Globe, Smartphone, Palette, FileText, Video, TrendingUp, Layers, Wrench, HelpCircle } from 'lucide-react'
import { SectionReveal } from '@/components/text-reveal'
import { Footer } from '@/components/footer'
import { ScatterText } from '@/components/scatter-text'
import { ScatterBlock } from '@/components/scatter-block'

// Service categories with pricing
const serviceCategories = [
  {
    id: 'web',
    icon: Globe,
    title: 'Webサイト制作',
    titleEn: 'Web Design & Development',
    description: 'ブランドの世界観を反映した、成果につながるWebサイトを制作します。',
    priceRange: '15万円〜',
    services: [
      { name: 'コーポレートサイト', price: '25万円〜', note: '5〜10ページ程度' },
      { name: 'ランディングページ', price: '15万円〜', note: '1ページ構成' },
      { name: 'ECサイト', price: '50万円〜', note: 'Shopify対応可' },
      { name: 'ポートフォリオサイト', price: '20万円〜', note: '作品紹介に特化' },
      { name: 'メディアサイト', price: '40万円〜', note: 'ブログ・オウンドメディア' },
    ],
    features: ['レスポンシブ対応', 'SEO内部対策', 'SSL対応', 'お問い合わせフォーム', '修正無制限'],
  },
  {
    id: 'cms',
    icon: Layers,
    title: 'CMS構築',
    titleEn: 'CMS Development',
    description: '更新しやすく、運用しやすいCMSを構築します。',
    priceRange: '10万円〜',
    services: [
      { name: 'WordPress構築', price: '10万円〜', note: 'テーマカスタマイズ含む' },
      { name: 'microCMS構築', price: '8万円〜', note: 'ヘッドレスCMS' },
      { name: 'Notion連携サイト', price: '12万円〜', note: 'Notionをデータベースに' },
      { name: 'Movable Type構築', price: '12万円〜', note: '静的生成・企業サイト向け' }, // :contentReference[oaicite:0]{index=0}
      { name: 'Drupal構築', price: '15万円〜', note: '大規模・多言語サイト対応' }, // :contentReference[oaicite:1]{index=1}
      { name: 'オリジナルCMS', price: '25万円〜', note: '要件に合わせた開発' },
    ],
    features: ['管理画面レクチャー', 'マニュアル作成', '初期コンテンツ投入サポート', '修正無制限'],
  },
  {
    id: 'app',
    icon: Smartphone,
    title: 'アプリ開発',
    titleEn: 'App Development',
    description: 'Webアプリ・モバイルアプリの企画から開発まで対応します。',
    priceRange: '50万円〜',
    services: [
      { name: 'Webアプリケーション', price: '50万円〜', note: '要件により変動' },
      { name: 'PWA開発', price: '40万円〜', note: 'オフライン対応可' },
      { name: 'LINE公式アカウント連携', price: '15万円〜', note: 'LIFF/Messaging API' },
      { name: '業務効率化ツール', price: '25万円〜', note: '社内システム・管理ツール' },
    ],
    features: ['要件定義', 'プロトタイプ作成', 'テスト・デバッグ', '運用サポート', '修正無制限'],
  },
  {
    id: 'design',
    icon: Palette,
    title: 'デザイン',
    titleEn: 'Design',
    description: 'ロゴ、名刺、バナーなど、あらゆるデザインに対応します。',
    priceRange: '1万円〜',
    services: [
      { name: 'ロゴデザイン', price: '5万円〜', note: '3案提案・修正無制限' },
      { name: '名刺デザイン', price: '1万円〜', note: '両面・印刷手配可' },
      { name: 'バナーデザイン', price: '5,000円〜/点', note: 'Web・SNS用' },
      { name: 'UIデザイン', price: '10万円〜', note: 'Figma納品' },
      { name: 'ブランドガイドライン', price: '15万円〜', note: 'ロゴ・色・フォント規定' },
    ],
    features: ['オリジナルデザイン', '修正無制限', '各種フォーマット納品'],
  },
  {
    id: 'print',
    icon: FileText,
    title: '紙媒体',
    titleEn: 'Print Media',
    description: 'チラシ、パンフレット、ポスターなど印刷物のデザインを行います。',
    priceRange: '1万円〜',
    services: [
      { name: 'チラシ・フライヤー', price: '1万円〜', note: 'A4片面〜' },
      { name: 'パンフレット', price: '5万円〜', note: '4ページ〜' },
      { name: 'ポスター', price: '3万円〜', note: 'A2〜B1' },
      { name: '会社案内', price: '10万円〜', note: '8ページ〜' },
      { name: 'ショップカード', price: '1万円〜', note: '両面' },
    ],
    features: ['印刷入稿データ作成', '印刷手配可能', 'DICカラー対応', '修正無制限'],
  },
  {
    id: 'video',
    icon: Video,
    title: '動画制作',
    titleEn: 'Video Production',
    description: 'SNS用ショート動画から企業紹介動画まで幅広く対応します。',
    priceRange: '10万円〜',
    services: [
      { name: 'SNSショート動画', price: '10万円〜', note: '15〜60秒' },
      { name: 'サービス紹介動画', price: '25万円〜', note: '1〜3分' },
      { name: '企業紹介動画', price: '40万円〜', note: '3〜5分' },
      { name: 'モーショングラフィックス', price: '20万円〜', note: 'アニメーション' },
      { name: 'YouTube運用支援', price: '15万円〜/月', note: '企画・編集・サムネイル' },
    ],
    features: ['企画・構成', '撮影・編集', 'BGM・SE', 'テロップ', '修正無制限'],
  },
  {
    id: 'marketing',
    icon: TrendingUp,
    title: 'マーケティング',
    titleEn: 'Marketing',
    description: '集客から運用まで、Webマーケティング全般をサポートします。',
    priceRange: '3万円〜/月',
    services: [
      { name: 'SNS運用代行', price: '5万円〜/月', note: 'Instagram/X/Facebook' },
      { name: 'Web広告運用', price: '広告費の15%〜', note: 'Google/Meta広告' },
      { name: 'SEO対策', price: '3万円〜/月', note: 'コンテンツ施策含む' },
      { name: 'アクセス解析', price: '1.5万円〜/月', note: 'GA4レポート' },
      { name: 'MEO対策', price: '1.5万円〜/月', note: 'Googleマップ最適化' },
    ],
    features: ['戦略立案', '定期レポート', '改善提案', 'ミーティング対応'],
  },
  {
    id: 'support',
    icon: Wrench,
    title: '保守・運用',
    titleEn: 'Maintenance & Support',
    description: 'サイト公開後の更新・保守・改善をサポートします。',
    priceRange: '5,000円〜/月',
    services: [
      { name: 'ライトプラン', price: '5,000円/月', note: '軽微な修正・月2回まで' },
      { name: 'スタンダードプラン', price: '1.5万円/月', note: '更新代行・月5回まで' },
      { name: 'プレミアムプラン', price: '3万円/月', note: '修正無制限・優先対応' },
      { name: 'スポット対応', price: '3,000円〜/件', note: '都度のご依頼' },
    ],
    features: ['定期バックアップ', 'セキュリティ対策', 'サーバー監視', '緊急時対応'],
  },
]

// FAQ data
const faqs = [
  {
    question: '予算が限られているのですが、相談できますか？',
    answer: 'はい、もちろんです。ご予算に応じて、機能やページ数を調整したり、段階的に制作を進めるなど、柔軟にご提案させていただきます。まずはお気軽にご相談ください。',
  },
  {
    question: '見積りは無料です��？',
    answer: 'はい、お見積りは無料です。ヒアリング後、ご要望に合わせた詳細なお見積りをご提示いたします。',
  },
  {
    question: '納期はどれくらいですか？',
    answer: 'プロジェクトの規模によりますが、LPで約2〜4週間、コーポレートサイトで約1〜2ヶ月が目安です。お急ぎの場合もご相談ください。',
  },
  {
    question: '支払い方法は？',
    answer: '銀行振込でのお支払いをお願いしております。基本的には着手時に50%、納品時に50%の分割払いとなります。',
  },
  {
    question: '遠方でも依頼できますか？',
    answer: 'はい、オンラインでの打ち合わせに対応しておりますので、全国どこからでもご依頼いただけます。',
  },
  {
    question: '掲載されていないサービスも依頼できますか？',
    answer: 'はい、掲載内容以外にもご要望があればお気軽にご相談ください。パートナー企業との連携により、幅広いニーズに対応可能です。',
  },
]

export default function PricingPageClient() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[60svh] sm:min-h-[70svh] flex items-center justify-center">
        <div className="container mx-auto px-6 md:px-12 lg:px-16 py-32 md:py-40 text-center">
          <div className="mb-6 lg:mb-8">
            <ScatterText
              as="span"
              className="font-display text-[clamp(3rem,10vw,7rem)] leading-none tracking-tight text-foreground/50 block"
              scrollStart={50}
              scrollEnd={350}
              distance={500}
              style={{
                WebkitTextStroke: '1px currentColor',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Pricing
            </ScatterText>
          </div>
          <ScatterText
            as="h1"
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 lg:mb-8"
            scrollStart={50}
            scrollEnd={350}
            distance={400}
            gradient
          >
            制作料金
          </ScatterText>
          <ScatterText
            as="p"
            className="text-base md:text-lg text-muted-foreground max-w-lg mx-auto leading-[1.8] tracking-wide"
            scrollStart={50}
            scrollEnd={350}
            distance={300}
          >
            あらゆるクリエイティブに、柔軟に対応します。ご予算やご要望に合わせたご提案が可能です。
          </ScatterText>
        </div>
      </section>

      {/* Notice Section */}
      <section className="py-8 glass-light border-y border-border/20">
        <div className="container mx-auto px-6 md:px-12 lg:px-16">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-center sm:text-left">
            <div className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground leading-[1.8] tracking-wide">
              下記料金は参考価格です。プロジェクトの内容・規模により変動いたします。正式なお見積りは無料ヒアリング後にご提示いたしますので、お気軽にご相談ください。
            </p>
          </div>
        </div>
      </section>

      {/* Service Categories */}
      <section className="py-32 md:py-40 lg:py-56 glass-light">
        <div className="container mx-auto px-6 md:px-12 lg:px-16">
          <div className="space-y-20 lg:space-y-32">
            {serviceCategories.map((category, categoryIndex) => (
              <SectionReveal key={category.id} delay={categoryIndex * 0.03}>
                <div className="group">
                  {/* Category Header */}
                  <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 md:gap-8 mb-10 lg:mb-12 pb-8 border-b border-border/20">
                    <div className="flex items-start gap-5 md:gap-6">
                      <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-foreground/5 flex items-center justify-center shrink-0 group-hover:bg-foreground/10 transition-colors duration-300">
                        <category.icon className="w-5 h-5 md:w-6 md:h-6 text-foreground/60" />
                      </div>
                      <div>
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1 tracking-tight">
                          {category.title}
                        </h2>
                        <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3 font-medium">
                          {category.titleEn}
                        </p>
                        <p className="text-sm md:text-base text-muted-foreground leading-[1.8] tracking-wide max-w-lg">
                          {category.description}
                        </p>
                      </div>
                    </div>
                    <div className="md:text-right shrink-0">
                      <p className="text-xs text-muted-foreground mb-1 tracking-wide">参考価格</p>
                      <p className="text-2xl sm:text-3xl font-bold gradient-text-soft">
                        {category.priceRange}
                      </p>
                    </div>
                  </div>

                  {/* Services Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-8 lg:mb-10">
                    {category.services.map((service) => (
                      <div
                        key={service.name}
                        className="p-6 lg:p-8 rounded-2xl bg-background border border-border/20 hover:border-foreground/10 transition-all duration-300"
                      >
                        <h3 className="text-sm md:text-base font-bold mb-2 tracking-tight">{service.name}</h3>
                        <p className="text-lg md:text-xl font-bold text-foreground mb-2">{service.price}</p>
                        <p className="text-xs text-muted-foreground tracking-wide">{service.note}</p>
                      </div>
                    ))}
                  </div>

                  {/* Features */}
                  <div className="flex flex-wrap gap-2">
                    {category.features.map((feature) => (
                      <span
                        key={feature}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs bg-card rounded-full border border-border/20"
                      >
                        <Check size={10} className="text-muted-foreground" />
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-32 md:py-40 lg:py-56 glass-card">
        <div className="container mx-auto px-6 md:px-12 lg:px-16">
          <div className="text-center mb-16 lg:mb-24">
            <div className="mb-6 lg:mb-8">
              <ScatterText
                as="span"
                className="font-display text-[clamp(3rem,10vw,7rem)] leading-none tracking-tight text-foreground/50 block"
                scrollStart={50}
                scrollEnd={350}
                distance={500}
                style={{
                  WebkitTextStroke: '1px currentColor',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                FAQ
              </ScatterText>
            </div>
            <ScatterText
              as="h2"
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight"
              scrollStart={50}
              scrollEnd={350}
              distance={400}
              gradient
            >
              よくあるご質問
            </ScatterText>
          </div>

          <div className="max-w-3xl mx-auto space-y-4 lg:space-y-6">
            {faqs.map((faq, index) => (
              <SectionReveal key={faq.question} delay={index * 0.03}>
                <div className="p-6 md:p-8 lg:p-10 rounded-3xl bg-background border border-border/20 hover:border-foreground/10 transition-all duration-300">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-8 h-8 rounded-full bg-foreground/5 flex items-center justify-center shrink-0">
                      <HelpCircle size={14} className="text-muted-foreground" />
                    </div>
                    <h3 className="text-sm md:text-base font-bold leading-[1.6] tracking-tight">{faq.question}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-[1.8] tracking-wide pl-12">
                    {faq.answer}
                  </p>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 md:py-40 lg:py-56 glass-light">
        <div className="container mx-auto px-6 md:px-12 lg:px-16 text-center">
          <ScatterText
            as="h2"
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-2"
            scrollStart={50}
            scrollEnd={350}
            distance={400}
          >
            まずは、
          </ScatterText>
          <ScatterText
            as="span"
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6 lg:mb-8 block"
            scrollStart={50}
            scrollEnd={350}
            distance={400}
            gradient
          >
            お気軽にご相談ください
          </ScatterText>
          <ScatterText
            as="p"
            className="text-base md:text-lg text-muted-foreground max-w-lg mx-auto mb-10 lg:mb-12 leading-[1.8] tracking-wide"
            scrollStart={50}
            scrollEnd={350}
            distance={300}
          >
            ご予算やご要望をお聞かせいただければ、最適なプランをご提案いたします。お見積りは無料です。
          </ScatterText>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <ScatterBlock
              className="group w-full sm:w-auto px-8 py-4 bg-foreground text-background rounded-full font-medium tracking-widths uppercase text-sm cursor-pointer hover:bg-foreground/90 transition-colors"
              scrollEnd={350}
              distance={400}
              seed={40}
              href="/contact"
            >
              <span className="flex items-center justify-center gap-4">
                <MessageCircle size={18} />
                無料で相談する
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </ScatterBlock>
            
            <ScatterBlock
              className="flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-4 bg-card text-foreground rounded-full font-medium text-sm border border-border/20 cursor-pointer hover:border-foreground/20 transition-colors"
              scrollEnd={350}
              distance={400}
              seed={41}
            >
              <Phone size={18} />
              <span>080-9155-0426</span>
            </ScatterBlock>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
