'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { isSmallScreen, isSyntheticAudit, scheduleIdleTask } from '@/lib/performance-mode'

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
    if (isSyntheticAudit() || isSmallScreen()) {
      return
    }

    const idleTask = scheduleIdleTask(() => {
      setShouldRenderEffects(true)
    }, 3500, 2200)

    return () => idleTask.cancel()
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
