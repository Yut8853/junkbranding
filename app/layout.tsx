import type { Metadata, Viewport } from 'next';
import { Barlow_Condensed, Noto_Sans_JP } from 'next/font/google';
import Script from 'next/script';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';

import { PageTransition } from '@/components/layout/page-transition';
import { AutoJapaneseLineBreaks } from '@/components/layout/auto-japanese-line-breaks';
import { Navigation } from '@/components/navigation/navigation';
import { SmoothScroll } from '@/components/layout/smooth-scroll';
import { DeferredVisualEffects } from '@/components/deferred/deferred-visual-effects';
import { DeferredSiteWidgets } from '@/components/deferred/deferred-site-widgets';
import { LoadingProvider } from '@/components/loading/loading-provider';
import { AudioProvider } from '@/contexts/audio-context';
import { TransitionProvider } from '@/contexts/transition-context';
import { ModeProvider } from '@/contexts/mode-context';
import { ModeToggle } from '@/components/mode/mode-toggle';
import type { LayoutProps } from '@/types/layout';
import {
  generateFaqSchema,
  generateJsonLdGraph,
  generateWebsiteSchema,
  localBusinessSchema,
  organizationSchema,
} from '@/lib/structured-data';

const notoSansJp = Noto_Sans_JP({
  subsets: ['latin'],
  variable: '--font-sans-jp',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

const barlowCondensed = Barlow_Condensed({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['500', '600', '700', '800'],
});

// ルートmetadataは各ページmetadataの土台になるため、サイト全体で共通のSEO・OGP・AI向け情報をここに集約する。
export const metadata: Metadata = {
  metadataBase: new URL('https://junkbranding.com'),
  applicationName: 'JunkBranding',
  referrer: 'origin-when-cross-origin',
  generator: 'Next.js',
  title: {
    default: 'JunkBranding | 茨城のHP制作・Web制作スタジオ',
    template: '%s | JunkBranding',
  },
  description:
    '茨城県を拠点に、ホームページ制作・Web制作を中心に手がける小さなクリエイティブスタジオ。コーポレートサイト、LP、Webサイト制作からロゴ制作やブランディングまで、丁寧に対応します。',
  keywords: [
    'HP制作',
    'ホームページ制作',
    'Web制作',
    'Webサイト制作',
    'ブランディング',
    'Webデザイン',
    'ロゴ制作',
    '茨城',
    '茨城 HP制作',
    '茨城 ホームページ制作',
    '茨城 Web制作',
    '東京',
    '神奈川',
    'コーポレートサイト',
    'ランディングページ',
    'ECサイト',
  ],
  authors: [{ name: 'JunkBranding', url: 'https://junkbranding.com' }],
  creator: 'JunkBranding',
  publisher: 'JunkBranding',
  category: 'Web制作・ブランディング',
  manifest: '/manifest.webmanifest',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: 'https://junkbranding.com',
    languages: {
      'ja-JP': 'https://junkbranding.com',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    url: 'https://junkbranding.com',
    siteName: 'JunkBranding',
    title: 'JunkBranding | 茨城のHP制作・Web制作スタジオ',
    description:
      '茨城県を拠点に、ホームページ制作・Web制作を中心に手がける小さなクリエイティブスタジオ。コーポレートサイトやLP制作にも対応します。',
    images: [
      {
        url: '/ogp.jpg',
        width: 1200,
        height: 630,
        alt: 'JunkBranding - 茨城のHP制作・Web制作スタジオ',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JunkBranding | 茨城のHP制作・Web制作スタジオ',
    description:
      '茨城県を拠点に、ホームページ制作・Web制作を中心に手がける小さなクリエイティブスタジオ。',
    images: ['/ogp.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  appleWebApp: {
    capable: true,
    title: 'JunkBranding',
    statusBarStyle: 'black-translucent',
  },
  icons: {
    icon: [
      {
        url: '/icon.svg',
        sizes: '32x32',
        type: 'image/svg+xml',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: {
      url: '/icon.svg',
      sizes: '32x32',
      type: 'image/svg+xml',
    },
    shortcut: '/icon.svg',
  },
  verification: {
    google: 'LEkZOcAeq4rXooCOsOS3EisHeiHwDTe9Zl7Rka0F0gQ',
  },
  other: {
    'llms-txt': 'https://junkbranding.com/llms.txt',
    'ai-summary':
      'JunkBrandingは茨城県を拠点に、ホームページ制作、Web制作、LP制作、ロゴ制作、ブランディングを行う小規模クリエイティブスタジオです。',
    'service-area': '茨城県, 東京都, 神奈川県, 全国オンライン対応',
    'primary-services':
      'ホームページ制作, Web制作, Webサイト制作, LP制作, ロゴ制作, ブランディング, SEO対策',
    'accessibility-summary':
      'キーボード操作、スクリーンリーダー、WAI-ARIA属性、SPでのモーション削減に配慮しています。',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#faf9fb' },
    { media: '(prefers-color-scheme: dark)', color: '#0f0f14' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
};

// 構造化データは全ページ共通の事業情報を先に出し、個別ページでは不足分だけを追加する。
const jsonLd = generateJsonLdGraph([
  generateWebsiteSchema(),
  organizationSchema,
  localBusinessSchema,
  generateFaqSchema(),
]);

const GTM_ID = 'GTM-KWQHTTTJ';

export default function RootLayout({ children }: Readonly<LayoutProps>) {
  return (
    <html
      lang="ja"
      className={`${notoSansJp.variable} ${barlowCondensed.variable}`}
    >
      <head>
        {/* GTMは全ユーザーでload後のidleまで遅らせ、初期操作と描画を優先する。 */}
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){
              w[l]=w[l]||[];
              function loadGtm(){
                w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});
                var f=d.getElementsByTagName(s)[0];
                var j=d.createElement(s);
                var dl=l!='dataLayer'?'&l='+l:'';
                j.async=true;
                j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
                f.parentNode.insertBefore(j,f);
              }
              function scheduleGtm(){
                if ('requestIdleCallback' in w) {
                  w.requestIdleCallback(loadGtm, { timeout: 5000 });
                } else {
                  w.setTimeout(loadGtm, 3500);
                }
              }
              if (d.readyState === 'complete') {
                scheduleGtm();
              } else {
                w.addEventListener('load', scheduleGtm, { once: true });
              }
            })(window,document,'script','dataLayer','${GTM_ID}');
          `}
        </Script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans antialiased bg-transparent text-foreground overflow-x-hidden">
        <AutoJapaneseLineBreaks />
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            title="Google Tag Manager"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        <a href="#main-content" className="skip-link">
          メインコンテンツへ移動
        </a>
        <ModeProvider>
          <TransitionProvider>
            <AudioProvider>
              <DeferredVisualEffects />
              <LoadingProvider>
                <SmoothScroll>
                  <Navigation />
                  <ModeToggle />
                  <PageTransition>
                    <main
                      id="main-content"
                      className="noise-overlay relative"
                      tabIndex={-1}
                    >
                      {children}
                    </main>
                  </PageTransition>
                </SmoothScroll>
                <DeferredSiteWidgets />
              </LoadingProvider>
            </AudioProvider>
          </TransitionProvider>
        </ModeProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  );
}
