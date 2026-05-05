'use client'

import { useEffect, useState } from 'react'
import { scheduleIdleTask } from '@/lib/performance-mode'

export function useDeferredRender(timeout = 5200, fallbackDelay = 3600) {
  const [shouldRender, setShouldRender] = useState(false)

  useEffect(() => {
    const idleTask = scheduleIdleTask(() => {
      setShouldRender(true)
    }, timeout, fallbackDelay)

    return () => idleTask.cancel()
  }, [fallbackDelay, timeout])

  return shouldRender
}
