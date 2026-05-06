'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { isSmallScreen, scheduleIdleTask } from '@/lib/performance-mode'

const CustomCursor = dynamic(
  () => import('@/components/effects/custom-cursor').then((mod) => mod.CustomCursor),
  { ssr: false }
)
const FloatingParticles = dynamic(
  () => import('@/components/effects/floating-particles').then((mod) => mod.FloatingParticles),
  { ssr: false }
)
const BottomHeatHaze = dynamic(
  () => import('@/components/effects/bottom-heat-haze').then((mod) => mod.BottomHeatHaze),
  { ssr: false }
)
const TopCanvasFilmOverlay = dynamic(
  () => import('@/components/effects/top-canvas-film-overlay').then((mod) => mod.TopCanvasFilmOverlay),
  { ssr: false }
)
const RisingRainbowOrb = dynamic(
  () => import('@/components/effects/rising-rainbow-orb').then((mod) => mod.RisingRainbowOrb),
  { ssr: false }
)

export function DeferredVisualEffects() {
  const [shouldRenderCursor, setShouldRenderCursor] = useState(false)
  const [shouldRenderEffects, setShouldRenderEffects] = useState(false)

  useEffect(() => {
    if (isSmallScreen()) {
      return
    }

    // カーソルは比較的軽いので先に、Canvas/WebGL系の常駐エフェクトはさらに後のidleへ回す。
    const cursorTask = scheduleIdleTask(() => {
      setShouldRenderCursor(true)
    }, 12000, 10000)

    const effectsTask = scheduleIdleTask(() => {
      setShouldRenderEffects(true)
    }, 16000, 14000)

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
          <TopCanvasFilmOverlay />
        </>
      )}
    </>
  )
}
