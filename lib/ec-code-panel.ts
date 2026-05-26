import type { DirecOSPlannedStackItem } from '@/types/works-page'

export const EC_CODE_LINES = [
  "const tenant = await resolveTenant('junk-clothing')",
  '',
  'const storefront = await getStorefrontSettings({',
  '  tenantId: tenant.id,',
  "  include: ['theme', 'features', 'promotions'],",
  '})',
  '',
  'const products = await getFeaturedProducts({',
  '  tenantId: tenant.id,',
  "  status: 'published',",
  '  withInventory: true,',
  '})',
  '',
  'return (',
  '  <StorefrontShell theme={storefront.theme}>',
  '    <HeroSection brand={tenant.name} />',
  '    <FeatureSection enabled={storefront.features} />',
  '    <ProductGrid products={products} />',
  '    <FreeShippingProgress settings={storefront.promotions} />',
  '  </StorefrontShell>',
  ')',
  '',
  '// admin: products, media, orders, customers, SEO',
  '// security: reauth, rate limit, same-origin, audit log',
]

export const EC_PANEL_FOOTER_ITEMS = [
  'multi tenant',
  'admin ops',
  'product seo',
  'secure checkout',
]

export const EC_PLANNED_STACK = [
  {
    label: 'Storefront',
    value: 'Next.js App Router、商品一覧・詳細・カート・決済導線をブランド体験として構成',
  },
  {
    label: 'Operations',
    value: '商品、画像、注文、会員、販促、SEOを管理画面から更新できる運用設計',
  },
  {
    label: 'SaaS Base',
    value: 'Tenant中心のPrismaスキーマと機能ON/OFFで複数店舗展開を見据える',
  },
] satisfies DirecOSPlannedStackItem[]
