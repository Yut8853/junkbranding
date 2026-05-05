// ページmetadata生成とJSON-LD生成で共有する、SEO周りの入力型。
export type PageMetadataOptions = {
  title: string
  description?: string
  path?: string
  keywords?: string[]
  image?: string
  imageAlt?: string
  index?: boolean
  category?: string
}

export type JsonLdNode = Record<string, unknown>
