import type { LucideIcon } from 'lucide-react'

export type PricingServiceItem = {
  name: string
  price: string
  note: string
}

export type PricingCategory = {
  id: string
  icon: LucideIcon
  title: string
  titleEn: string
  description: string
  priceRange: string
  services: PricingServiceItem[]
  features: string[]
}

export type PricingFaq = {
  question: string
  answer: string
}

export type PricingServiceCategoriesSectionProps = {
  serviceCategories: PricingCategory[]
}

export type PricingFaqSectionProps = {
  faqs: PricingFaq[]
}
