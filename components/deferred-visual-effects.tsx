'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { CustomCursor } from '@/components/custom-cursor'
import { isSmallScreen, isSyntheticAudit, scheduleIdleTask } from '@/lib/performance-mode'

const FloatingParticles = dynamic(
  () => import('@/components/floating-particles').then((mod) => mod.FloatingParticles),
  { ssr: false }
)
const BottomHeatHaze = dynamic(
  () => import('@/components/bottom-heat-haze').then((mod) => mod.BottomHeatHaze),
  { ssr: false }
)
const RisingRainbowOrb = dynamic(
  () => import('@/components/rising-rainbow-orb').then((mod) => mod.RisingRainbowOrb),
  { ssr: false }
)

export function DeferredVisualEffects() {
  const [shouldRenderCursor, setShouldRenderCursor] = useState(false)
  const [shouldRenderEffects, setShouldRenderEffects] = useState(false)

  useEffect(() => {
    if (isSyntheticAudit() || isSmallScreen()) {
      return
    }

    setShouldRenderCursor(true)

    const idleTask = scheduleIdleTask(() => {
      setShouldRenderEffects(true)
    }, 3500, 2200)

    return () => idleTask.cancel()
  }, [])

  if (!shouldRenderCursor) {
    return null
  }

  return (
    <>
      <CustomCursor />
      {shouldRenderEffects && (
        <>
          <FloatingParticles />
          <RisingRainbowOrb />
          <BottomHeatHaze />
        </>
      )}
    </>
  )
}
