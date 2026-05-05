import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://junkbranding.com'

  // 検索エンジンと主要AIクローラーに公開ページを許可し、2種類のサイトマップを案内する。
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
      {
        userAgent: [
          'GPTBot',
          'ChatGPT-User',
          'OAI-SearchBot',
          'ClaudeBot',
          'Claude-User',
          'PerplexityBot',
          'Perplexity-User',
          'Google-Extended',
          'Applebot',
          'Applebot-Extended',
          'CCBot',
        ],
        allow: '/',
      },
    ],
    sitemap: [`${baseUrl}/sitemap.xml`, `${baseUrl}/search-console-sitemap.xml`],
    host: baseUrl,
  }
}

