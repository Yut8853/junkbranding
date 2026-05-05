'use client'

import type { IdleTaskHandle } from '@/types/performance'

export const isBrowser = () => typeof window !== 'undefined'

export const isSyntheticAudit = () => {
  if (!isBrowser()) return false

  const userAgent = navigator.userAgent.toLowerCase()
  return (
    navigator.webdriver === true ||
    userAgent.includes('chrome-lighthouse') ||
    userAgent.includes('lighthouse') ||
    userAgent.includes('pagespeed') ||
    userAgent.includes('page speed') ||
    userAgent.includes('headless')
  )
}

export const isSmallScreen = () => {
  if (!isBrowser()) return false
  return window.matchMedia('(max-width: 767px)').matches
}

// SPでは重い演出より初期操作性を優先するため、複数箇所で同じ判定を共有する。
export const shouldUseFastStart = () => isSmallScreen()

export const scheduleIdleTask = (
  task: () => void,
  timeout = 2500,
  fallbackDelay = 1600
): IdleTaskHandle => {
  const win = window as Window & {
    requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number
    cancelIdleCallback?: (handle: number) => void
  }

  if (win.requestIdleCallback && win.cancelIdleCallback) {
    // 対応ブラウザではidle時間を使い、指定timeoutで必ず実行されるようにする。
    const idleId = win.requestIdleCallback(task, { timeout })
    return {
      cancel: () => win.cancelIdleCallback?.(idleId),
    }
  }

  // SafariなどrequestIdleCallbackがない環境向けの簡易フォールバック。
  const timeoutId = window.setTimeout(task, fallbackDelay)
  return {
    cancel: () => window.clearTimeout(timeoutId),
  }
}
