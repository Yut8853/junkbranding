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
