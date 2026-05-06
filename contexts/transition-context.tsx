'use client'

import { createContext, useContext, useState, useCallback, useMemo, useRef, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { shouldUseFastStart } from '@/lib/performance-mode'
import type { TransitionContextType, TransitionProviderProps, WindowWithLenis } from '@/types/navigation'

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

const scrollToPageTop = () => {
  window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  document.documentElement.scrollTop = 0
  document.body.scrollTop = 0

  const lenis = (window as WindowWithLenis).lenis

  lenis?.scrollTo?.(0, {
    force: true,
    immediate: true,
  })
}

export function TransitionProvider({ children }: TransitionProviderProps) {
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
      // dev中のHMRやrouter起動直後はprefetchが失敗することがあるため、遷移自体は止めない。
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

    // 初期表示直後に全ルートを取りに行くとTBTが伸びるため、idle後に少しずつ先読みする。
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
      router.push(href, { scroll: true })
      return
    }

    // 遷移アニメーション中の二重pushを防ぐ。
    if (isNavigating.current || isTransitioning) return

    isNavigating.current = true
    pendingHref.current = nextPath
    
    // フェーズ1: オーバーレイと粒子を表示し、現ページを退場させる。
    setIsTransitioning(true)
    
    // フェーズ2: コンテンツがフェードアウトした後にNext.jsの遷移を実行する。
    pushTimer.current = window.setTimeout(() => {
      router.push(href, { scroll: true })
    }, EXIT_DURATION_MS)

    // ルート確定イベントを取りこぼしても画面が固まらないよう、保険の完了タイマーを置く。
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
    scrollToPageTop()
    requestAnimationFrame(scrollToPageTop)

    // pathnameが目的地に変わったら、入場アニメーション分だけ待って遷移状態を解除する。
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
    if (isNavigating.current) return

    // ブラウザ戻る/進むや通常pushでも、前ページの中途半端な位置を持ち越さない。
    scrollToPageTop()
    const frameId = requestAnimationFrame(scrollToPageTop)
    return () => cancelAnimationFrame(frameId)
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
