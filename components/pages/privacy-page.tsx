'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import {
  TextReveal,
  SectionReveal,
  LineReveal,
} from '@/components/text-reveal';

export default function PrivacyPageClient() {
  return (
    <div className="relative z-10 min-h-screen">
      <main className="container mx-auto px-6 md:px-12 py-32 md:py-40">
        <div className="max-w-3xl mx-auto">
          {/* Title */}
          <TextReveal
            text="Privacy Policy"
            as="h1"
            className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight"
            delay={0}
            gradient
          />
          <LineReveal delay={0.4}>
            <p className="text-white/50 text-sm uppercase tracking-wider mb-16">
              最終更新日: 2026年4月1日
            </p>
          </LineReveal>

          {/* Content sections */}
          <div className="space-y-12 text-white/80 leading-relaxed">
            <SectionReveal delay={0.5}>
              <section>
                <h2 className="text-xl md:text-2xl font-semibold text-white mb-4">
                  1. はじめに
                </h2>
                <p className="text-pretty">
                  JunkBranding（以下「当社」）は、お客様のプライバシーを尊重し、個人情報の保護に努めています。本プライバシーポリシーは、当社がどのように個人情報を収集、使用、開示、保護するかについて説明します。
                </p>
              </section>
            </SectionReveal>

            <SectionReveal delay={0.55}>
              <section>
                <h2 className="text-xl md:text-2xl font-semibold text-white mb-4">
                  2. 収集する情報
                </h2>
                <p className="mb-4">
                  当社は、以下の種類の情報を収集することがあります：
                </p>
                <ul className="list-disc list-inside space-y-2 pl-4 text-white/70">
                  <li>お名前、メールアドレス、電話番号などの連絡先情報</li>
                  <li>会社名、役職などのビジネス情報</li>
                  <li>お問い合わせ内容やプロジェクトに関する情報</li>
                  <li>
                    ウェブサイトの利用状況（アクセスログ、Cookie情報など）
                  </li>
                </ul>
              </section>
            </SectionReveal>

            <SectionReveal delay={0.6}>
              <section>
                <h2 className="text-xl md:text-2xl font-semibold text-white mb-4">
                  3. 情報の利用目的
                </h2>
                <p className="mb-4">収集した情報は、以下の目的で利用します：</p>
                <ul className="list-disc list-inside space-y-2 pl-4 text-white/70">
                  <li>お問い合わせへの対応およびサービスの提供</li>
                  <li>サービスの改善および新サービスの開発</li>
                  <li>マーケティング活動（お客様の同意がある場合）</li>
                  <li>法的義務の遵守</li>
                </ul>
              </section>
            </SectionReveal>

            <SectionReveal delay={0.65}>
              <section>
                <h2 className="text-xl md:text-2xl font-semibold text-white mb-4">
                  4. Cookieの使用
                </h2>
                <p className="mb-4 text-pretty">
                  当社のウェブサイトでは、ユーザー体験の向上およびアクセス解析のためにCookieを使用しています。
                </p>
                <p className="text-pretty">
                  ブラウザの設定でCookieを無効にすることができますが、その場合、ウェブサイトの一部機能が正常に動作しない可能性があります。
                </p>
              </section>
            </SectionReveal>

            <SectionReveal delay={0.7}>
              <section>
                <h2 className="text-xl md:text-2xl font-semibold text-white mb-4">
                  5. 情報の共有
                </h2>
                <p className="mb-4 text-pretty">
                  当社は、以下の場合を除き、お客様の個人情報を第三者と共有することはありません。
                </p>
                <ul className="list-disc list-inside space-y-2 pl-4 text-white/70">
                  <li>お客様の同意がある場合</li>
                  <li>法令に基づく開示が必要な場合</li>
                  <li>サービス提供に必要な業務委託先への提供</li>
                </ul>
              </section>
            </SectionReveal>

            <SectionReveal delay={0.85}>
              <section>
                <h2 className="text-xl md:text-2xl font-semibold text-white mb-4">
                  8. お問い合わせ
                </h2>
                <p className="mb-4 text-pretty">
                  本プライバシーポリシーに関するご質問やお問い合わせは、以下の連絡先までお願いいたします。
                </p>
                <div className="bg-white/5 backdrop-blur-md rounded-lg p-6 border border-white/10 space-y-1">
                  <p className="text-white font-medium mb-3">JunkBranding</p>
                  <p>〒300-0410 茨城県稲敷郡美浦村みどり台767-43</p>
                  <p>メール: hello@junkbranding.com</p>
                  <p>電話: 080-9155-0426</p>
                </div>
              </section>
            </SectionReveal>
          </div>

          {/* Back link */}
          <SectionReveal delay={0.95}>
            <div className="mt-20 pt-12 border-t border-white/10">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>トップページに戻る</span>
              </Link>
            </div>
          </SectionReveal>
        </div>
      </main>
    </div>
  );
}
