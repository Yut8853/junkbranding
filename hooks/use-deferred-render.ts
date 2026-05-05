'use client'

import { useEffect, useState } from 'react'
import { useTransition } from '@/contexts/transition-context'
import { scheduleIdleTask } from '@/lib/performance-mode'

export function useDeferredRender(delay = 9000, idleTimeout = 3200) {
  const [shouldRender, setShouldRender] = useState(false)
  const { hasNavigated } = useTransition()

  useEffect(() => {
    if (hasNavigated) {
      setShouldRender(true)
      return
    }

    let idleTask: ReturnType<typeof scheduleIdleTask> | null = null
    const delayTimer = window.setTimeout(() => {
      idleTask = scheduleIdleTask(() => {
        setShouldRender(true)
      }, idleTimeout, 1200)
    }, delay)

    return () => {
      window.clearTimeout(delayTimer)
      idleTask?.cancel()
    }
  }, [delay, hasNavigated, idleTimeout])

  return shouldRender
}
