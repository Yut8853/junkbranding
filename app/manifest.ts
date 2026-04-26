import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'JunkBranding | 茨城・東京・神奈川のブランディング & Web制作',
    short_name: 'JunkBranding',
    description:
      '茨城・東京・神奈川を中心に活動する、2人だけの小さなブランディング&Web制作スタジオ。',
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

