'use client';

import { ArrowLeft, Cookie, Database, HelpCircle, Mail, Share2, ShieldCheck, Target } from 'lucide-react';
import { SectionReveal } from '@/components/text-reveal';
import { ScatterText } from '@/components/scatter-text';
import { ScatterBlock } from '@/components/scatter-block';

const privacySections = [
  {
    id: '01',
    icon: ShieldCheck,
    title: 'はじめに',
    titleEn: 'Introduction',
    body: 'JunkBranding（以下「当社」）は、お客様のプライバシーを尊重し、個人情報の保護に努めています。お問い合わせや制作のご相談を通じてお預かりする情報は、目的を明確にしたうえで適切に管理し、必要な範囲でのみ利用します。本プライバシーポリシーは、当社がどのように個人情報を収集、使用、開示、保護するかについて説明します。',
  },
  {
    id: '02',
    icon: Database,
    title: '収集する情報',
    titleEn: 'Information We Collect',
    body: '当社は、お問い合わせ対応、見積り作成、制作進行、サービス改善のために、以下の情報を必要に応じて収集することがあります。収集する情報は、サービス提供に必要な範囲に限定します。',
    items: [
      'お名前、メールアドレス、電話番号などの連絡先情報',
      '会社名、役職などのビジネス情報',
      'お問い合わせ内容やプロジェクトに関する情報',
      'ウェブサイトの利用状況（アクセスログ、Cookie情報など）',
    ],
  },
  {
    id: '03',
    icon: Target,
    title: '情報の利用目的',
    titleEn: 'Purpose of Use',
    body: '収集した情報は、プロジェクトを円滑に進め、お客様に適切な提案やサポートを行うために利用します。目的外の利用は行わず、必要に応じて事前に同意を得ます。',
    items: [
      'お問い合わせへの対応およびサービスの提供',
      'サービスの改善および新サービスの開発',
      'マーケティング活動（お客様の同意がある場合）',
      '法的義務の遵守',
    ],
  },
  {
    id: '04',
    icon: Cookie,
    title: 'Cookieの使用',
    titleEn: 'Cookie Policy',
    body: '当社のウェブサイトでは、ユーザー体験の向上およびアクセス解析のためにCookieを使用しています。Cookieにより取得される情報は、サイトの閲覧傾向や改善点の把握に利用され、個人を直接特定する目的では使用しません。ブラウザの設定でCookieを無効にすることができますが、その場合、ウェブサイトの一部機能が正常に動作しない可能性があります。',
  },
  {
    id: '05',
    icon: Share2,
    title: '情報の共有',
    titleEn: 'Information Sharing',
    body: '当社は、お客様からお預かりした個人情報を慎重に取り扱い、以下の場合を除き第三者と共有することはありません。外部パートナーと連携する場合も、必要最小限の情報共有にとどめます。',
    items: [
      'お客様の同意がある場合',
      '法令に基づく開示が必要な場合',
      'サービス提供に必要な業務委託先への提供',
    ],
  },
  {
    id: '06',
    icon: HelpCircle,
    title: 'お問い合わせ',
    titleEn: 'Contact',
    body: '本プライバシーポリシーに関するご質問、個人情報の確認・訂正・削除などのご相談は、以下の連絡先までお願いいたします。内容を確認のうえ、合理的な範囲で速やかに対応いたします。',
  },
];

const contactItems = [
  'JunkBranding',
  '〒300-0410 茨城県稲敷郡美浦村みどり台767-43',
  'メール: hello@junkbranding.com',
  '電話: 080-9155-0426',
];

export default function PrivacyPageClient() {
  return (
    <div className="relative z-10 min-h-screen overflow-hidden">
      <main className="container mx-auto px-6 md:px-12 lg:px-16 py-28 md:py-36 lg:py-44">
        <div className="mx-auto max-w-6xl">
          {/* Hero */}
          <section className="relative mb-20 lg:mb-28">
            <div className="absolute -left-20 top-10 h-64 w-64 rounded-full bg-primary/10 blur-[90px]" />
            <div className="absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-accent/10 blur-[100px]" />

            <div className="relative rounded-[2rem] rainbow-border px-6 py-10 md:px-10 md:py-14 lg:px-14 lg:py-16">
              <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-[0.28em] text-white/70">
                <ShieldCheck className="h-4 w-4 text-white/70" />
                <ScatterText as="span" scrollStart={50} scrollEnd={350} distance={160}>
                  Legal / Privacy
                </ScatterText>
              </div>

              <div className="mb-6 lg:mb-8">
                <ScatterText
                  as="span"
                  className="font-display text-[clamp(3.4rem,10vw,8rem)] leading-none tracking-tight block"
                  scrollStart={50}
                  scrollEnd={350}
                  distance={500}
                  style={{
                    color: '#000',
                    WebkitTextStroke: '1px rgba(255,255,255,0.9)',
                    WebkitTextFillColor: '#000',
                  }}
                >
                  Privacy Policy
                </ScatterText>
              </div>

              <div className="grid gap-8 lg:grid-cols-[1fr_320px] lg:items-end">
                <div>
                  <ScatterText
                    as="h1"
                    className="mb-6 text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl lg:text-5xl"
                    scrollStart={50}
                    scrollEnd={350}
                    distance={380}
                    gradient
                  >
                    個人情報の取り扱いについて
                  </ScatterText>
                  <ScatterText
                    as="p"
                    className="max-w-2xl text-sm leading-[1.9] tracking-wide text-white/80 md:text-base"
                    scrollStart={50}
                    scrollEnd={350}
                    distance={280}
                  >
                    お客様からお預かりする情報を、どのように扱い、保護し、利用するかを明確にするためのポリシーです。制作やご相談を安心して進められるよう、取り扱いの考え方をできるだけわかりやすくまとめています。
                  </ScatterText>
                </div>

                <div className="rounded-3xl p-5 rainbow-border">
                  <ScatterText
                    as="p"
                    className="mb-2 text-xs uppercase tracking-[0.25em] text-white/65"
                    scrollStart={50}
                    scrollEnd={350}
                    distance={180}
                  >
                    Last Updated
                  </ScatterText>
                  <ScatterText
                    as="p"
                    className="font-display text-3xl tracking-wide"
                    scrollStart={50}
                    scrollEnd={350}
                    distance={220}
                    gradient
                  >
                    2026.04.01
                  </ScatterText>
                </div>
              </div>
            </div>
          </section>

          <div className="grid gap-10 lg:grid-cols-[260px_1fr] lg:gap-14">
            {/* Index */}
            <aside className="hidden lg:block">
              <div className="sticky top-28 rounded-3xl rainbow-border p-6">
                <ScatterText
                  as="p"
                  className="mb-6 text-xs uppercase tracking-[0.28em] text-white/65"
                  scrollStart={50}
                  scrollEnd={350}
                  distance={180}
                >
                  Contents
                </ScatterText>
                <div className="space-y-4">
                  {privacySections.map((section) => (
                    <div key={section.id} className="flex items-center gap-3">
                      <span className="font-mono text-xs text-foreground/30">{section.id}</span>
                      <ScatterText
                        as="span"
                        className="text-xs font-medium text-white/70"
                        scrollStart={50}
                        scrollEnd={350}
                        distance={160}
                      >
                        {section.titleEn}
                      </ScatterText>
                    </div>
                  ))}
                </div>
              </div>
            </aside>

            {/* Content sections */}
            <div className="space-y-6 lg:space-y-8">
              {privacySections.map((section, index) => (
                <SectionReveal key={section.id} delay={0.06 + index * 0.03}>
                  <section className="group relative overflow-hidden rounded-[2rem] rainbow-border p-6 md:p-8 lg:p-10">
                    <div className="absolute right-6 top-4 font-display text-[5rem] leading-none text-white/[0.06] md:text-[7rem]">
                      {section.id}
                    </div>
                    <div className="relative z-10">
                      <div className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl rainbow-border">
                            <section.icon className="h-5 w-5 text-white/75" />
                          </div>
                          <div>
                            <ScatterText
                              as="p"
                              className="mb-1 text-xs uppercase tracking-[0.25em] text-white/65"
                              scrollStart={50}
                              scrollEnd={350}
                              distance={180}
                            >
                              {section.titleEn}
                            </ScatterText>
                            <ScatterText
                              as="h2"
                              className="text-xl font-bold tracking-tight md:text-2xl"
                              scrollStart={50}
                              scrollEnd={350}
                              distance={280}
                              gradient
                            >
                              {section.title}
                            </ScatterText>
                          </div>
                        </div>
                      </div>

                      <ScatterText
                        as="p"
                        className="max-w-3xl text-sm leading-[1.95] tracking-wide text-white/82 md:text-base"
                        scrollStart={50}
                        scrollEnd={350}
                        distance={260}
                      >
                        {section.body}
                      </ScatterText>

                      {section.items && (
                        <div className="mt-7 grid gap-3 sm:grid-cols-2">
                          {section.items.map((item, itemIndex) => (
                            <div key={item} className="rounded-2xl px-4 py-3 rainbow-border">
                              <div className="flex items-start gap-3">
                                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/45" />
                                <ScatterText
                                  as="p"
                                  className="text-xs leading-[1.8] tracking-wide text-white/78 md:text-sm"
                                  scrollStart={50}
                                  scrollEnd={350}
                                  distance={200}
                                >
                                  {item}
                                </ScatterText>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {section.id === '06' && (
                        <div className="mt-8 rounded-3xl p-5 md:p-6 rainbow-border">
                          <div className="mb-5 flex items-center gap-3">
                            <Mail className="h-4 w-4 text-white/65" />
                            <ScatterText
                              as="p"
                              className="text-xs uppercase tracking-[0.25em] text-white/65"
                              scrollStart={50}
                              scrollEnd={350}
                              distance={180}
                            >
                              Contact Detail
                            </ScatterText>
                          </div>
                          <div className="space-y-3">
                            {contactItems.map((item, contactIndex) => (
                              <ScatterText
                                key={item}
                                as="p"
                                className={contactIndex === 0 ? 'text-sm font-bold text-white' : 'text-xs tracking-wide text-white/76 md:text-sm'}
                                scrollStart={50}
                                scrollEnd={350}
                                distance={220}
                                gradient={contactIndex === 0}
                              >
                                {item}
                              </ScatterText>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </section>
                </SectionReveal>
              ))}
            </div>
          </div>

          {/* Back link */}
          <div className="mt-14 lg:mt-20">
            <ScatterBlock
              className="cta-primary inline-flex items-center gap-3 rounded-full px-6 py-3 text-sm font-bold transition-all duration-300"
              scrollEnd={350}
              distance={300}
              seed={50}
              href="/"
            >
              <ArrowLeft className="w-4 h-4" />
              <ScatterText as="span" className="tracking-wide uppercase" scrollStart={50} scrollEnd={350} distance={180}>
                トップページに戻る
              </ScatterText>
            </ScatterBlock>
          </div>
        </div>
      </main>
    </div>
  );
}
