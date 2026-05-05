'use client'

import { createContext, useContext, useState, type ReactNode, useCallback, useMemo, useRef, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { shouldUseFastStart } from '@/lib/performance-mode'

interface TransitionContextType {
  hasNavigated: boolean
  isTransitioning: boolean
  navigateWithTransition: (href: string) => void
  prefetchRoute: (href: string) => void
}

const PREFETCH_ROUTES = ['/', '/about', '/works', '/pricing', '/contact', '/privacy'] as const
const EXIT_DURATION_MS = 420
const ENTER_DURATION_MS = 420
const TRANSITION_FALLBACK_MS = 2400

const TransitionContext = createContext<TransitionContextType>({
  hasNavigated: false,
  isTransitioning: false,
  navigateWithTransition: () => {},
  prefetchRoute: () => {},
})

export function TransitionProvider({ children }: { children: ReactNode }) {
  const [hasNavigated, setHasNavigated] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const isNavigating = useRef(false)
  const pendingHref = useRef<string | null>(null)
  const pushTimer = useRef<number | null>(null)
  const completeTimer = useRef<number | null>(null)
  const fallbackTimer = useRef<number | null>(null)
  const isRouterReady = useRef(false)
  const prefetchedRoutes = useRef(new Set<string>())

  const prefetchRoute = useCallback((href: string) => {
    if (!href.startsWith('/') || !isRouterReady.current || prefetchedRoutes.current.has(href)) return

    try {
      router.prefetch(href)
      prefetchedRoutes.current.add(href)
    } catch {
      // Next can reject very early prefetches during dev HMR/router startup.
    }
  }, [router])

  useEffect(() => {
    const readyTimer = window.setTimeout(() => {
      isRouterReady.current = true
    }, 0)

    return () => window.clearTimeout(readyTimer)
  }, [])

  useEffect(() => {
    const idleWindow = window as Window & {
      requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number
      cancelIdleCallback?: (handle: number) => void
    }

    const prefetchAll = () => {
      PREFETCH_ROUTES.forEach((href, index) => {
        setTimeout(() => prefetchRoute(href), index * 180)
      })
    }

    let cancelIdlePrefetch: (() => void) | undefined
    const startPrefetch = () => {
      if (idleWindow.requestIdleCallback) {
        const idleId = idleWindow.requestIdleCallback(prefetchAll, { timeout: 5000 })
        cancelIdlePrefetch = () => idleWindow.cancelIdleCallback?.(idleId)
        return
      }

      const fallbackTimeout = window.setTimeout(prefetchAll, 2500)
      cancelIdlePrefetch = () => window.clearTimeout(fallbackTimeout)
    }

    const timeout = window.setTimeout(startPrefetch, 7000)
    return () => {
      clearTimeout(timeout)
      cancelIdlePrefetch?.()
    }
  }, [prefetchRoute])

  const navigateWithTransition = useCallback((href: string) => {
    const nextPath = href.split('#')[0].split('?')[0] || '/'
    if (nextPath === pathname) return

    if (shouldUseFastStart()) {
      router.push(href)
      return
    }

    // Prevent multiple navigations
    if (isNavigating.current || isTransitioning) return

    isNavigating.current = true
    pendingHref.current = nextPath
    
    // Phase 1: Start transition (show overlay & particles)
    setIsTransitioning(true)
    
    // Phase 2: After content fades out, navigate
    pushTimer.current = window.setTimeout(() => {
      router.push(href)
    }, EXIT_DURATION_MS)

    fallbackTimer.current = window.setTimeout(() => {
      setHasNavigated(true)
      setIsTransitioning(false)
      isNavigating.current = false
      pendingHref.current = null
    }, TRANSITION_FALLBACK_MS)
  }, [isTransitioning, pathname, router])

  useEffect(() => {
    if (!isNavigating.current || !pendingHref.current) return
    if (pathname !== pendingHref.current) return

    if (completeTimer.current) window.clearTimeout(completeTimer.current)

    completeTimer.current = window.setTimeout(() => {
      setHasNavigated(true)
      setIsTransitioning(false)
      isNavigating.current = false
      pendingHref.current = null

      if (fallbackTimer.current) {
        window.clearTimeout(fallbackTimer.current)
        fallbackTimer.current = null
      }
    }, ENTER_DURATION_MS)
  }, [pathname])

  useEffect(() => {
    return () => {
      if (pushTimer.current) window.clearTimeout(pushTimer.current)
      if (completeTimer.current) window.clearTimeout(completeTimer.current)
      if (fallbackTimer.current) window.clearTimeout(fallbackTimer.current)
    }
  }, [])

  const contextValue = useMemo(() => ({
    hasNavigated,
    isTransitioning,
    navigateWithTransition,
    prefetchRoute,
  }), [hasNavigated, isTransitioning, navigateWithTransition, prefetchRoute])

  return (
    <TransitionContext.Provider value={contextValue}>
      {children}
    </TransitionContext.Provider>
  )
}

export function useTransition() {
  return useContext(TransitionContext)
}
