const baseUrl = 'https://junkbranding.com'
const lastModified = '2026-05-02'

// Search Consoleへ直接提出しやすい固定XML。Next標準sitemapとは別URLで運用する。
const pages = [
  { path: '', changeFrequency: 'daily', priority: '1.0' },
  { path: '/about', changeFrequency: 'monthly', priority: '0.8' },
  { path: '/works', changeFrequency: 'weekly', priority: '0.9' },
  { path: '/pricing', changeFrequency: 'weekly', priority: '0.8' },
  { path: '/ibaraki-hp-production', changeFrequency: 'monthly', priority: '0.9' },
  { path: '/contact', changeFrequency: 'yearly', priority: '0.7' },
  { path: '/privacy', changeFrequency: 'yearly', priority: '0.3' },
]

function escapeXml(value: string) {
  // URLへ将来クエリや特殊文字が入ってもXMLを壊さないように最低限エスケープする。
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (page) => `  <url>
    <loc>${escapeXml(`${baseUrl}${page.path}`)}</loc>
    <lastmod>${lastModified}</lastmod>
    <changefreq>${page.changeFrequency}</changefreq>
    <priority>${page.priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>
`

export const dynamic = 'force-static'

export function GET() {
  // CDNでは長めに、ブラウザでは短めにキャッシュさせて更新反映と配信効率のバランスを取る。
  return new Response(sitemapXml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  })
}
