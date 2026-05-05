'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { isSmallScreen, scheduleIdleTask } from '@/lib/performance-mode'

const SoundToggle = dynamic(
  () => import('@/components/widgets/sound-toggle').then((mod) => mod.SoundToggle),
  { ssr: false }
)
const CookieConsent = dynamic(
  () => import('@/components/widgets/cookie-consent').then((mod) => mod.CookieConsent),
  { ssr: false }
)

export function DeferredSiteWidgets() {
  const [shouldRenderWidgets, setShouldRenderWidgets] = useState(false)

  useEffect(() => {
    const idleTask = scheduleIdleTask(() => {
      setShouldRenderWidgets(true)
    }, isSmallScreen() ? 5000 : 3200, isSmallScreen() ? 3600 : 1800)

    return () => idleTask.cancel()
  }, [])

  if (!shouldRenderWidgets) {
    return null
  }

  return (
    <>
      <SoundToggle />
      <CookieConsent />
    </>
  )
}
