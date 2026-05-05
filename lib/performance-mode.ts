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
    const idleId = win.requestIdleCallback(task, { timeout })
    return {
      cancel: () => win.cancelIdleCallback?.(idleId),
    }
  }

  const timeoutId = window.setTimeout(task, fallbackDelay)
  return {
    cancel: () => window.clearTimeout(timeoutId),
  }
}
