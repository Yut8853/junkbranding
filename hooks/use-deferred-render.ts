'use client'

import { useEffect, useState } from 'react'
import { useTransition } from '@/contexts/transition-context'
import { isSmallScreen, scheduleIdleTask } from '@/lib/performance-mode'

export function useDeferredRender(delay = 9000, idleTimeout = 3200) {
  const [shouldRender, setShouldRender] = useState(false)
  const { hasNavigated } = useTransition()

  useEffect(() => {
    if (hasNavigated) {
      setShouldRender(true)
      return
    }

    const isMobile = isSmallScreen()
    const renderDelay = isMobile ? Math.min(delay, 650) : delay
    const renderIdleTimeout = isMobile ? Math.min(idleTimeout, 900) : idleTimeout
    let idleTask: ReturnType<typeof scheduleIdleTask> | null = null
    const delayTimer = window.setTimeout(() => {
      idleTask = scheduleIdleTask(() => {
        setShouldRender(true)
      }, renderIdleTimeout, isMobile ? 300 : 1200)
    }, renderDelay)

    return () => {
      window.clearTimeout(delayTimer)
      idleTask?.cancel()
    }
  }, [delay, hasNavigated, idleTimeout])

  return shouldRender
}
