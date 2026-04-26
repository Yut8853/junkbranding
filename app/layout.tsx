import type { Metadata, Viewport } from 'next';
import { Inter, Bebas_Neue } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';
import { LoadingProvider } from '@/components/loading-provider';
import { PageTransition } from '@/components/page-transition';
import { Navigation } from '@/components/navigation';
import { CustomCursor } from '@/components/custom-cursor';
import { SmoothScroll } from '@/components/smooth-scroll';
import { FloatingParticles } from '@/components/floating-particles';
import { CookieConsent } from '@/components/cookie-consent';

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
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: 'https://junkbranding.com',
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
        alt: 'JunkBranding - ブランディング & Web制作スタジオ',
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
        url: '/favicon.jpg',
        sizes: '32x32',
        type: 'image/jpeg',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: {
      url: '/apple-icon.jpg',
      sizes: '180x180',
      type: 'image/jpeg',
    },
    shortcut: '/favicon.jpg',
  },
verification: {
  google: 'LEkZOcAeq4rXooCOsOS3EisHeiHwDTe9Zl7Rka0F0gQ',
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

// JSON-LD structured data
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': 'https://junkbranding.com/#website',
      url: 'https://junkbranding.com',
      name: 'JunkBranding',
      description:
        '茨城・東京・神奈川を中心に活動するブランディング&Web制作スタジオ',
      publisher: {
        '@id': 'https://junkbranding.com/#organization',
      },
      inLanguage: 'ja',
    },
    {
      '@type': 'Organization',
      '@id': 'https://junkbranding.com/#organization',
      name: 'JunkBranding',
      url: 'https://junkbranding.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://junkbranding.com/logo.jpg',
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
    },
    {
      '@type': 'LocalBusiness',
      '@id': 'https://junkbranding.com/#localbusiness',
      name: 'JunkBranding',
      description:
        'ブランディング&Web制作スタジオ。Webサイト制作、ロゴデザイン、ブランディングを提供。',
      url: 'https://junkbranding.com',
      telephone: '+81-80-9155-0426',
      email: 'hello@junkbranding.com',
      address: {
        '@type': 'PostalAddress',
        postalCode: '300-0410',
        addressRegion: '茨城県',
        addressLocality: '稲敷郡美浦村',
        streetAddress: 'みどり台767-43',
        addressCountry: 'JP',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 35.9833,
        longitude: 140.3167,
      },
      areaServed: [
        { '@type': 'State', name: '茨城県' },
        { '@type': 'State', name: '東京都' },
        { '@type': 'State', name: '神奈川県' },
      ],
      priceRange: '¥¥',
      openingHoursSpecification: {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '10:00',
        closes: '18:00',
      },
    },
  ],
};

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
        <LoadingProvider>
          {/* ここがポイント：
      SmoothScroll（transformがかかる場所）の外側に配置することで、
      中の fixed が正常にビューポート基準で固定されます。
    */}
          <FloatingParticles />

          <SmoothScroll>
            <CustomCursor />
            <Navigation />
            <PageTransition>
              <main className="noise-overlay relative">{children}</main>
            </PageTransition>
          </SmoothScroll>
          <CookieConsent />
        </LoadingProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  );
}
