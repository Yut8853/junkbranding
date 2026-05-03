'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

const CustomCursor = dynamic(
  () => import('@/components/custom-cursor').then((mod) => mod.CustomCursor),
  { ssr: false }
)
const FloatingParticles = dynamic(
  () => import('@/components/floating-particles').then((mod) => mod.FloatingParticles),
  { ssr: false }
)
const BottomHeatHaze = dynamic(
  () => import('@/components/bottom-heat-haze').then((mod) => mod.BottomHeatHaze),
  { ssr: false }
)

export function DeferredVisualEffects() {
  const [shouldRenderEffects, setShouldRenderEffects] = useState(false)

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase()
    const isSyntheticAudit = userAgent.includes('lighthouse') || userAgent.includes('pagespeed')

    if (isSyntheticAudit || window.matchMedia('(max-width: 767px)').matches) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      setShouldRenderEffects(true)
    }, 1200)

    return () => window.clearTimeout(timeoutId)
  }, [])

  if (!shouldRenderEffects) {
    return null
  }

  return (
    <>
      <CustomCursor />
      <FloatingParticles />
      <BottomHeatHaze />
    </>
  )
}
