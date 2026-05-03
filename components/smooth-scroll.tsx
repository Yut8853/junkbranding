'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { useIsMobile } from '@/hooks/use-mobile'
import { useElementInView } from '@/hooks/use-element-in-view'
import { useScrollProgress } from '@/hooks/use-scroll-progress'
import type { SmoothScrollProps } from '@/types/component-props'

const DesktopSmoothScroll = dynamic(
  () => import('@/components/desktop-smooth-scroll').then((mod) => mod.DesktopSmoothScroll),
  { ssr: false }
)

export function SmoothScroll({ children }: SmoothScrollProps) {
  const isMobile = useIsMobile()
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  if (!hasMounted || isMobile) {
    return <>{children}</>
  }

  return <DesktopSmoothScroll>{children}</DesktopSmoothScroll>
}

export { useElementInView as useInView, useScrollProgress }

