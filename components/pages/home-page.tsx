'use client'

import dynamic from 'next/dynamic'
import { useLayoutEffect, useState } from 'react'
import { MobileHomePage } from '@/components/pages/home/mobile-home-page'
import type { HomeLayoutMode } from '@/types/home-page'

const HomeDesktopPage = dynamic(
  () => import('@/components/pages/home/home-desktop-page').then((mod) => mod.HomeDesktopPage),
  {
    loading: () => null,
  },
)

export default function HomePageClient() {
  const [layoutMode, setLayoutMode] = useState<HomeLayoutMode>('desktop-inverted')
  const isDesktopInverted = layoutMode === 'desktop-inverted'

  useLayoutEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 768px)')
    const syncMode = () => {
      const shouldInvert = mediaQuery.matches
      setLayoutMode(shouldInvert ? 'desktop-inverted' : 'mobile-normal')
    }

    syncMode()
    mediaQuery.addEventListener('change', syncMode)
    return () => mediaQuery.removeEventListener('change', syncMode)
  }, [])

  if (isDesktopInverted) {
    return <HomeDesktopPage />
  }

  return (
    <MobileHomePage />
  )
}
