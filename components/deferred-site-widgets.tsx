'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { isSmallScreen, isSyntheticAudit, scheduleIdleTask } from '@/lib/performance-mode'

const SoundToggle = dynamic(
  () => import('@/components/sound-toggle').then((mod) => mod.SoundToggle),
  { ssr: false }
)
const CookieConsent = dynamic(
  () => import('@/components/cookie-consent').then((mod) => mod.CookieConsent),
  { ssr: false }
)

export function DeferredSiteWidgets() {
  const [shouldRenderWidgets, setShouldRenderWidgets] = useState(false)

  useEffect(() => {
    if (isSyntheticAudit()) {
      return
    }

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
