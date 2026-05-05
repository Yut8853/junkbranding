import type { Metadata, Viewport } from 'next';
import { Barlow_Condensed, Noto_Sans_JP } from 'next/font/google';
import Script from 'next/script';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';

import { PageTransition } from '@/components/page-transition';
import { Navigation } from '@/components/navigation';
import { SmoothScroll } from '@/components/smooth-scroll';
import { DeferredVisualEffects } from '@/components/deferred-visual-effects';
import { DeferredSiteWidgets } from '@/components/deferred-site-widgets';
import { LoadingProvider } from '@/components/loading-provider';
import { TopCanvasFilmOverlay } from '@/components/top-canvas-film-overlay';
import { AudioProvider } from '@/contexts/audio-context';
import { TransitionProvider } from '@/contexts/transition-context';
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

export const metadata: Metadata = {
  metadataBase: new URL('https://junkbranding.com'),
  applicationName: 'JunkBranding',
  referrer: 'origin-when-cross-origin',
  generator: 'Next.js',
  title: {
    default: 'JunkBranding | 茨城・東京・神奈川のブランディング & Web制作',
    template: '%s | JunkBranding',
  },
  description:
    '茨城・東京・神奈川を中心に活動する、2人だけの小さなブランディング&Web制作スタジオ。大手にはできない、丁寧なものづくりを。Webサイト制作、ロゴ制作、ブランディングならJunkBrandingへ。',
  keywords: [
    'Web制作',
    'ブランディング',
    'Webデザイン',
    'ロゴ制作',
    '茨城',
    '東京',
    '神奈川',
    'ホームページ制作',
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
    title: 'JunkBranding | 茨城・東京・神奈川のブランディング & Web制作',
    description:
      '茨城・東京・神奈川を中心に活動する、2人だけの小さなブランディング&Web制作スタジオ。大手にはできない、丁寧なものづくりを。',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'JunkBranding - 茨城・東京・神奈川のブランディング & Web制作スタジオ',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JunkBranding | 茨城・東京・神奈川のブランディング & Web制作',
    description:
      '茨城・東京・神奈川を中心に活動する、2人だけの小さなブランディング&Web制作スタジオ。',
    images: ['/opengraph-image'],
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
      'JunkBrandingは茨城・東京・神奈川を中心に、ブランディング、Web制作、ロゴ制作、マーケティング支援を行う小規模クリエイティブスタジオです。',
    'service-area': '茨城県, 東京都, 神奈川県, 全国オンライン対応',
    'primary-services': 'ブランディング, Web制作, Webデザイン, ロゴ制作, SEO対策, マーケティング支援',
    'accessibility-summary': 'キーボード操作、スクリーンリーダー、WAI-ARIA属性、SPでのモーション削減に配慮しています。',
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

const jsonLd = generateJsonLdGraph([
  generateWebsiteSchema(),
  organizationSchema,
  localBusinessSchema,
  generateFaqSchema(),
]);

const GTM_ID = 'GTM-KWQHTTTJ';

export default function RootLayout({
  children,
}: Readonly<LayoutProps>) {
  return (
    <html
      lang="ja"
      className={`${notoSansJp.variable} ${barlowCondensed.variable}`}
    >
      <head>
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${GTM_ID}');
          `}
        </Script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans antialiased bg-transparent text-foreground overflow-x-hidden">
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
        <TransitionProvider>
          <AudioProvider>
            <DeferredVisualEffects />
            <TopCanvasFilmOverlay />
            <LoadingProvider>
              <SmoothScroll>
                <Navigation />
                <PageTransition>
                  <main id="main-content" className="noise-overlay relative" tabIndex={-1}>
                    {children}
                  </main>
                </PageTransition>
              </SmoothScroll>
              <DeferredSiteWidgets />
            </LoadingProvider>
          </AudioProvider>
        </TransitionProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  );
}
