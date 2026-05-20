import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'JunkBranding | 茨城のHP制作・Web制作スタジオ',
    short_name: 'JunkBranding',
    description:
      '茨城県を拠点に、ホームページ制作・Web制作を中心に手がける小さなクリエイティブスタジオ。',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#faf9fb',
    theme_color: '#faf9fb',
    lang: 'ja',
    categories: ['business', 'design', 'productivity'],
    icons: [
      {
        src: '/icon.svg',
        sizes: '32x32',
        type: 'image/svg+xml',
        purpose: 'any',
      },
    ],
  }
}

