'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { isSmallScreen, scheduleIdleTask } from '@/lib/performance-mode'

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
const RisingRainbowOrb = dynamic(
  () => import('@/components/rising-rainbow-orb').then((mod) => mod.RisingRainbowOrb),
  { ssr: false }
)

export function DeferredVisualEffects() {
  const [shouldRenderCursor, setShouldRenderCursor] = useState(false)
  const [shouldRenderEffects, setShouldRenderEffects] = useState(false)

  useEffect(() => {
    if (isSmallScreen()) {
      return
    }

    const cursorTask = scheduleIdleTask(() => {
      setShouldRenderCursor(true)
    }, 5000, 4200)

    const effectsTask = scheduleIdleTask(() => {
      setShouldRenderEffects(true)
    }, 9000, 7600)

    return () => {
      cursorTask.cancel()
      effectsTask.cancel()
    }
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
