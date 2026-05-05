export type PortfolioWork = {
  id: number
  title: string
  category: string
  description: string
  role: string
  scope: string
  outcome: string
  highlights: string[]
  tags: string[]
  stack: string[]
  url: string
  year: string
}

export type WorkCardProps = {
  work: PortfolioWork
  index: number
  onHover: (index: number | null) => void
  isHovered: boolean
}

export type ImmersiveWorkCardProps = {
  work: PortfolioWork
  index: number
}

export type WorksFilterSectionProps = {
  selectedCategory: string
  setSelectedCategory: (category: string) => void
}
