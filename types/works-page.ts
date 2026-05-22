export type PortfolioWork = {
  id: number
  title: string
  category: string
  ownerType: 'owned' | 'client'
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

export type CurrentProject = {
  id: number
  title: string
  category: string
  status: string
  description: string
  targetUser: string
  entryFlow: string
  principle: string
  displayPolicy: string
  updatedAt: string
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
  onSelectCategory: (category: string) => void
}
