'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

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
    const delay = window.matchMedia('(max-width: 767px)').matches ? 3600 : 1600
    const timeoutId = window.setTimeout(() => {
      setShouldRenderWidgets(true)
    }, delay)

    return () => window.clearTimeout(timeoutId)
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
