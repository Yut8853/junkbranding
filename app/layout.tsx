import type { Metadata, Viewport } from 'next';
import { Inter, Bebas_Neue } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';

import { PageTransition } from '@/components/page-transition';
import { Navigation } from '@/components/navigation';
import { CustomCursor } from '@/components/custom-cursor';
import { SmoothScroll } from '@/components/smooth-scroll';
import { FloatingParticles } from '@/components/floating-particles';
import { CookieConsent } from '@/components/cookie-consent';
import { LoadingProvider } from '@/components/loading-provider';
import { SoundToggle } from '@/components/sound-toggle';
import { AudioProvider } from '@/contexts/audio-context';
import { TransitionProvider } from '@/contexts/transition-context';
import {
  generateFaqSchema,
  generateJsonLdGraph,
  generateWebsiteSchema,
  localBusinessSchema,
  organizationSchema,
} from '@/lib/structured-data';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const bebasNeue = Bebas_Neue({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: '400',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://junkbranding.com'),
  applicationName: 'JunkBranding',
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${inter.variable} ${bebasNeue.variable}`}
      data-scroll-behavior="smooth"
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans antialiased bg-transparent text-foreground overflow-x-hidden">
        <TransitionProvider>
          <AudioProvider>
            <CustomCursor />
            <LoadingProvider>
              <FloatingParticles />

              <SmoothScroll>
                <Navigation />
                <PageTransition>
                  <main className="noise-overlay relative">{children}</main>
                </PageTransition>
              </SmoothScroll>
              <SoundToggle />
              <CookieConsent />
            </LoadingProvider>
          </AudioProvider>
        </TransitionProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  );
}
