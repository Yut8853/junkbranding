import type { ReactNode } from 'react'

// ナビゲーションは表示状態・組み上げアニメーション・ページ遷移を分けて持つため、hook間の契約をここに集約する。
export type UseMenuAssembleAnimationOptions = {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  isMobile: boolean
  onOpen?: () => void
}

export type UseHeaderIntroAnimationOptions = {
  hasMounted: boolean
  isLeanMotion: boolean
  isLoading: boolean
  isMobile: boolean
}

export type MenuHeatHazeBackgroundProps = {
  progress: number
  isOpen: boolean
}

export type NavItem = {
  href: string
  label: string
  labelJa: string
  num: string
}

export type TransitionContextType = {
  hasNavigated: boolean
  isTransitioning: boolean
  navigateWithTransition: (href: string) => void
  prefetchRoute: (href: string) => void
}

export type TransitionProviderProps = {
  children: ReactNode
}

export type LenisScrollToOptions = {
  immediate?: boolean
  force?: boolean
}

export type LenisInstance = {
  scrollTo?: (target: number, options?: LenisScrollToOptions) => void
}

export type WindowWithLenis = Window & {
  lenis?: LenisInstance
}
