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

export type TransitionContextType = {
  hasNavigated: boolean
  isTransitioning: boolean
  navigateWithTransition: (href: string) => void
  prefetchRoute: (href: string) => void
}
