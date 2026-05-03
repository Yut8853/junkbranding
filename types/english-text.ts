import type { TextTag } from '@/types/component-props'

export type EnglishAlign = 'left' | 'center'

export type EnglishLabelProps = {
  children: string
  className?: string
  textClassName?: string
  delay?: number
  align?: EnglishAlign
}

export type EnglishHeadingProps = {
  children: string
  className?: string
  delay?: number
  outline?: boolean
  align?: EnglishAlign
}

export type EnglishMarqueeTextProps = {
  children: string
  className?: string
}

export type EnglishWordsProps = {
  children: string
  as?: TextTag
  variant?: 'display' | 'massive'
  className?: string
  delay?: number
  align?: EnglishAlign
}

export type EnglishTextProps = {
  children: string
  as?: Exclude<TextTag, 'div'>
  variant?: 'label' | 'heading' | 'display'
  className?: string
  delay?: number
  stagger?: number
  align?: EnglishAlign
}

export type UnifiedEnglishTextProps = {
  children: string
  as?: TextTag
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'hero'
  className?: string
  delay?: number
  stagger?: number
  strokeToFill?: boolean
  isActive?: boolean
  activeColor?: string
  align?: 'left' | 'center' | 'right'
  isLink?: boolean
}

export type SectionTitleProps = {
  children: string
  subtitle?: string
  className?: string
  delay?: number
}

export type MarqueeTextProps = {
  children: string
  isHovered?: boolean
  className?: string
}

export type ServiceTitleProps = {
  children: string
  isActive?: boolean
  activeColor?: string
  className?: string
}
