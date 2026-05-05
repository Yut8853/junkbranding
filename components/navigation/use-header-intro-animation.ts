'use client'

import { useEffect, useState } from 'react'
import type { UseHeaderIntroAnimationOptions } from '@/types/navigation'

export function useHeaderIntroAnimation({
  hasMounted,
  isLeanMotion,
  isLoading,
  isMobile,
}: UseHeaderIntroAnimationOptions) {
  const [showHeaderIntro, setShowHeaderIntro] = useState(false)
  const [hasHeaderIntroCompleted, setHasHeaderIntroCompleted] = useState(false)

  useEffect(() => {
    if (!hasMounted || isLoading || isMobile || isLeanMotion) return

    const showTimer = window.setTimeout(() => {
      setHasHeaderIntroCompleted(false)
      setShowHeaderIntro(true)
    }, 250)

    const activateMenuTimer = window.setTimeout(() => {
      setHasHeaderIntroCompleted(true)
    }, 2050)

    const hideTimer = window.setTimeout(() => {
      setShowHeaderIntro(false)
    }, 3300)

    return () => {
      window.clearTimeout(showTimer)
      window.clearTimeout(activateMenuTimer)
      window.clearTimeout(hideTimer)
    }
  }, [hasMounted, isLeanMotion, isLoading, isMobile])

  return {
    hasHeaderIntroCompleted,
    showHeaderIntro,
  }
}
