'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useTransition } from '@/contexts/transition-context'
import { isSmallScreen, scheduleIdleTask } from '@/lib/performance-mode'

export function useDeferredRender(delay = 9000, idleTimeout = 3200) {
  const [shouldRender, setShouldRender] = useState(false)
  const { hasNavigated } = useTransition()
  const pathname = usePathname()

  useEffect(() => {
    const isSubPage = pathname !== '/'

    if (hasNavigated || isSubPage) {
      // 下層ページは直アクセスや途中リロードでも即時描画し、空白状態を作らない。
      setShouldRender(true)
      return
    }

    // 初回表示では重い装飾をdelay後のidleへ回す。SPは体感速度優先で待ち時間を短くする。
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
  }, [delay, hasNavigated, idleTimeout, pathname])

  return shouldRender
}
