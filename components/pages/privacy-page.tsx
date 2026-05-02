'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { SectionReveal } from '@/components/text-reveal';
import { ScatterText } from '@/components/scatter-text';
import { ScatterBlock } from '@/components/scatter-block';

export default function PrivacyPageClient() {
  return (
    <div className="relative z-10 min-h-screen">
      <main className="container mx-auto px-6 md:px-12 lg:px-16 py-32 md:py-40 lg:py-56">
        <div className="max-w-3xl mx-auto">
          {/* Title */}
          <div className="mb-6 lg:mb-8">
            <ScatterText
              as="span"
              className="font-display text-[clamp(2.5rem,8vw,5rem)] leading-none tracking-tight text-foreground/50 block"
              scrollStart={50}
              scrollEnd={350}
              distance={500}
              style={{
                WebkitTextStroke: '1px currentColor',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Privacy Policy
            </ScatterText>
          </div>
          <ScatterText
            as="p"
            className="text-xs text-muted-foreground uppercase tracking-widest mb-16 lg:mb-20"
            scrollStart={50}
            scrollEnd={350}
            distance={300}
          >
            最終更新日: 2026年4月1日
          </ScatterText>

          {/* Content sections */}
          <div className="space-y-12 lg:space-y-16">
            <SectionReveal delay={0.1}>
              <section>
                <h2 className="text-lg md:text-xl font-bold text-foreground mb-4 tracking-tight">
                  1. はじめに
                </h2>
                <p className="text-sm md:text-base text-muted-foreground leading-[1.8] tracking-wide">
                  JunkBranding（以下「当社」）は、お客様のプライバシーを尊重し、個人情報の保護に努めています。本プライバシーポリシーは、当社がどのように個人情報を収集、使用、開示、保護するかについて説明します。
                </p>
              </section>
            </SectionReveal>

            <SectionReveal delay={0.12}>
              <section>
                <h2 className="text-lg md:text-xl font-bold text-foreground mb-4 tracking-tight">
                  2. 収集する情報
                </h2>
                <p className="text-sm md:text-base text-muted-foreground leading-[1.8] tracking-wide mb-4">
                  当社は、以下の種類の情報を収集することがあります：
                </p>
                <ul className="list-disc list-inside space-y-2 pl-4 text-sm text-muted-foreground/80 leading-[1.8]">
                  <li>お名前、メールアドレス、電話番号などの連絡先情報</li>
                  <li>会社名、役職などのビジネス情報</li>
                  <li>お問い合わせ内容やプロジェクトに関する情報</li>
                  <li>ウェブサイトの利用状況（アクセスログ、Cookie情報など）</li>
                </ul>
              </section>
            </SectionReveal>

            <SectionReveal delay={0.14}>
              <section>
                <h2 className="text-lg md:text-xl font-bold text-foreground mb-4 tracking-tight">
                  3. 情報の利用目的
                </h2>
                <p className="text-sm md:text-base text-muted-foreground leading-[1.8] tracking-wide mb-4">
                  収集した情報は、以下の目的で利用します：
                </p>
                <ul className="list-disc list-inside space-y-2 pl-4 text-sm text-muted-foreground/80 leading-[1.8]">
                  <li>お問い合わせへの対応およびサービスの提供</li>
                  <li>サービスの改善および新サービスの開発</li>
                  <li>マーケティング活動（お客様の同意がある場合）</li>
                  <li>法的義務の遵守</li>
                </ul>
              </section>
            </SectionReveal>

            <SectionReveal delay={0.16}>
              <section>
                <h2 className="text-lg md:text-xl font-bold text-foreground mb-4 tracking-tight">
                  4. Cookieの使用
                </h2>
                <p className="text-sm md:text-base text-muted-foreground leading-[1.8] tracking-wide mb-4">
                  当社のウェブサイトでは、ユーザー体験の向上およびアクセス解析のためにCookieを使用しています。
                </p>
                <p className="text-sm md:text-base text-muted-foreground leading-[1.8] tracking-wide">
                  ブラウザの設定でCookieを無効にすることができますが、その場合、ウェブサイトの一部機能が正常に動作しない可能性があります。
                </p>
              </section>
            </SectionReveal>

            <SectionReveal delay={0.18}>
              <section>
                <h2 className="text-lg md:text-xl font-bold text-foreground mb-4 tracking-tight">
                  5. 情報の共有
                </h2>
                <p className="text-sm md:text-base text-muted-foreground leading-[1.8] tracking-wide mb-4">
                  当社は、以下の場合を除き、お客様の個人情報を第三者と共有することはありません。
                </p>
                <ul className="list-disc list-inside space-y-2 pl-4 text-sm text-muted-foreground/80 leading-[1.8]">
                  <li>お客様の同意がある場合</li>
                  <li>法令に基づく開示が必要な場合</li>
                  <li>サービス提供に必要な業務委託先への提供</li>
                </ul>
              </section>
            </SectionReveal>

            <SectionReveal delay={0.2}>
              <section>
                <h2 className="text-lg md:text-xl font-bold text-foreground mb-4 tracking-tight">
                  6. お問い合わせ
                </h2>
                <p className="text-sm md:text-base text-muted-foreground leading-[1.8] tracking-wide mb-6">
                  本プライバシーポリシーに関するご質問やお問い合わせは、以下の連絡先までお願いいたします。
                </p>
                <div className="bg-foreground/5 rounded-2xl p-6 lg:p-8 border border-border/20 space-y-2">
                  <p className="text-sm font-bold text-foreground mb-4">JunkBranding</p>
                  <p className="text-xs text-muted-foreground tracking-wide">〒300-0410 茨城県稲敷郡美浦村みどり台767-43</p>
                  <p className="text-xs text-muted-foreground tracking-wide">メール: hello@junkbranding.com</p>
                  <p className="text-xs text-muted-foreground tracking-wide">電話: 080-9155-0426</p>
                </div>
              </section>
            </SectionReveal>
          </div>

          {/* Back link */}
          <div className="mt-16 lg:mt-20 pt-10 lg:pt-12 border-t border-border/20">
            <ScatterBlock
              className="inline-flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              scrollEnd={350}
              distance={300}
              seed={50}
              href="/"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="tracking-wide">トップページに戻る</span>
            </ScatterBlock>
          </div>
        </div>
      </main>
    </div>
  );
}
