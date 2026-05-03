import type { CSSProperties, ReactNode } from 'react'

export type TextTag = 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div'

export type CookiePreferences = {
  necessary: boolean
  analytics: boolean
  marketing: boolean
}

export type LoadingScreenProps = {
  progress: number
  canSelectAudio: boolean
  audioChoice: 'sound-on' | 'sound-off' | null
  onSelectAudio: (withSound: boolean) => void
}

export type LoadingContextType = {
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
  progress: number
  setProgress: (progress: number) => void
}

export type LoadingProviderProps = {
  children: ReactNode
}

export type PageTransitionProps = {
  children: ReactNode
}

export type SmoothScrollProps = {
  children: ReactNode
}

export type NavigationMenuOverlayProps = {
  assembleProgress: number
  closeMenu: () => void
  hoveredItem: string | null
  isMobile: boolean
  isOpen: boolean
  pathname: string
  setHoveredItem: (href: string | null) => void
}

export type ScatterTextProps = {
  children: string
  as?: TextTag
  className?: string
  scrollStart?: number
  scrollEnd?: number
  distance?: number
  style?: CSSProperties
  gradient?: boolean
  scatterProgress?: number
  ariaHidden?: boolean
}

export type ScatterBlockProps = {
  children: ReactNode
  className?: string
  scrollEnd?: number
  distance?: number
  seed?: number
  href?: string
  onClick?: () => void
}

export type TextRevealProps = {
  children?: string
  text?: string
  className?: string
  delay?: number
  stagger?: number
  duration?: number
  as?: TextTag
  once?: boolean
  gradient?: boolean
}

export type SectionRevealProps = {
  children: ReactNode
  className?: string
  delay?: number
  duration?: number
  y?: number
  once?: boolean
}

export type WordRevealProps = {
  children: string
  className?: string
  delay?: number
  stagger?: number
  duration?: number
  as?: TextTag
  once?: boolean
}

export type LineRevealProps = {
  children: ReactNode
  className?: string
  delay?: number
  stagger?: number
  duration?: number
  once?: boolean
}

export type MagneticButtonProps = {
  children: ReactNode
  href?: string
  className?: string
  strength?: number
  onClick?: () => void
  'data-cursor'?: string
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
}

export type CircleButtonProps = {
  href: string
  children: ReactNode
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export type TransitionLinkProps = {
  href: string
  children: ReactNode
  className?: string
  onClick?: () => void
  [key: string]: unknown
}

export type HorizontalScrollTextProps = {
  text: string
  className?: string
  speed?: number
  direction?: 'left' | 'right'
  pauseOnHover?: boolean
  style?: CSSProperties
}

export type MarqueeProps = {
  children: ReactNode
  className?: string
  speed?: number
  direction?: 'left' | 'right'
}

export type RevealSectionProps = {
  children: ReactNode
  className?: string
  delay?: number
  threshold?: number
  once?: boolean
  duration?: number
}

export type ParallaxSectionProps = {
  children: ReactNode
  className?: string
  speed?: number
}
