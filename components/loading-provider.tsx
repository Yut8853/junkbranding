'use client'

import { createContext, useContext, useState, useEffect, useLayoutEffect } from 'react'
import { useAudio } from '@/contexts/audio-context'
import { useTransition } from '@/contexts/transition-context'
import { LoadingScreen } from './loading-screen'
import type { LoadingContextType, LoadingProviderProps } from '@/types/component-props'

const LOADING_SEEN_KEY = 'junkbranding-loading-seen-session-v2'
const AUDIO_PREFERENCE_KEY = 'junkbranding-audio-preference'
const HOME_VIDEO_SRC = 'https://videos.pexels.com/video-files/3209211/3209211-uhd_2560_1440_25fps.mp4'
const PRELOAD_ROUTES = ['/', '/about', '/works', '/pricing', '/contact', '/privacy']

const wait = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms))

const addResourceHint = (rel: 'preconnect' | 'preload', href: string, options?: {
  as?: string
  type?: string
  crossOrigin?: string
}) => {
  const selector = `link[rel="${rel}"][href="${href}"]`
  if (document.head.querySelector(selector)) return

  const link = document.createElement('link')
  link.rel = rel
  link.href = href
  if (options?.as) link.as = options.as
  if (options?.type) link.type = options.type
  if (options?.crossOrigin) link.crossOrigin = options.crossOrigin
  document.head.appendChild(link)
}

const scheduleIdleWarmup = (task: () => void) => {
  const win = window as Window & {
    requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number
    cancelIdleCallback?: (handle: number) => void
  }

  if (win.requestIdleCallback && win.cancelIdleCallback) {
    const idleId = win.requestIdleCallback(task, { timeout: 3000 })
    return () => win.cancelIdleCallback?.(idleId)
  }

  const timeoutId = window.setTimeout(task, 1800)
  return () => window.clearTimeout(timeoutId)
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined)

export function useLoading() {
  const context = useContext(LoadingContext)
  if (!context) {
    throw new Error('useLoading must be used within LoadingProvider')
  }
  return context
}

export function LoadingProvider({ children }: LoadingProviderProps) {
  const { startSound, stopSound } = useAudio()
  const { prefetchRoute } = useTransition()
  const [hasCheckedLoadingState, setHasCheckedLoadingState] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const [isFirstLoad, setIsFirstLoad] = useState(true)
  const [audioChoice, setAudioChoice] = useState<'sound-on' | 'sound-off' | null>(null)
  const [isSelectingAudio, setIsSelectingAudio] = useState(false)
  const [preloadComplete, setPreloadComplete] = useState(false)

  useEffect(() => {
    const hasSeenLoading = window.sessionStorage.getItem(LOADING_SEEN_KEY) === 'true'

    if (hasSeenLoading) {
      setProgress(100)
      setPreloadComplete(true)
      setIsLoading(false)
      setIsFirstLoad(false)
    } else {
      setIsLoading(true)
      setIsFirstLoad(true)
    }

    setHasCheckedLoadingState(true)
  }, [])

  useLayoutEffect(() => {
    const shouldLockAudioSelection = isLoading && isFirstLoad && !audioChoice
    document.documentElement.dataset.audioSelectionLocked = shouldLockAudioSelection ? 'true' : 'false'

    return () => {
      document.documentElement.dataset.audioSelectionLocked = 'false'
    }
  }, [audioChoice, isFirstLoad, isLoading])

  // ローディング中はスクロールを無効化
  useEffect(() => {
    if (isLoading && isFirstLoad) {
      document.body.style.overflow = 'hidden'
      document.documentElement.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
    }
  }, [isLoading, isFirstLoad])

  useEffect(() => {
    if (!isFirstLoad) return

    let cancelled = false

    const criticalPreloadTasks = [
      async () => {
        PRELOAD_ROUTES.slice(1, 4).forEach(prefetchRoute)
        await wait(120)
      },
      async () => {
        addResourceHint('preconnect', 'https://www.googletagmanager.com', { crossOrigin: 'anonymous' })
        addResourceHint('preconnect', new URL(HOME_VIDEO_SRC).origin, { crossOrigin: 'anonymous' })
        await wait(80)
      },
      () => wait(220),
    ]

    const runPreload = async () => {
      setProgress(8)

      for (let i = 0; i < criticalPreloadTasks.length; i += 1) {
        if (cancelled) return

        await criticalPreloadTasks[i]()

        if (cancelled) return
        const nextProgress = Math.round(((i + 1) / criticalPreloadTasks.length) * 100)
        setProgress(Math.min(100, Math.max(8, nextProgress)))
      }

      if (!cancelled) {
        setProgress(100)
        setPreloadComplete(true)
      }
    }

    void runPreload()

    return () => {
      cancelled = true
    }
  }, [isFirstLoad, prefetchRoute])

  useEffect(() => {
    if (isLoading || isFirstLoad) return

    return scheduleIdleWarmup(() => {
      void Promise.allSettled([
        import('@/components/text-reveal'),
        import('@/components/scatter-text'),
        import('@/components/scatter-block'),
        import('@/components/services-section-v2'),
        import('@/components/cta-section-v2'),
      ])
    })
  }, [isFirstLoad, isLoading])

  useEffect(() => {
    if (!isFirstLoad || !preloadComplete || audioChoice || isSelectingAudio) return

    const fallbackTimeout = window.setTimeout(() => {
      stopSound()
      window.localStorage.setItem(AUDIO_PREFERENCE_KEY, 'sound-off')
      setAudioChoice('sound-off')
      setIsSelectingAudio(false)
    }, 4500)

    return () => window.clearTimeout(fallbackTimeout)
  }, [audioChoice, isFirstLoad, isSelectingAudio, preloadComplete, stopSound])

  useEffect(() => {
    if (!isFirstLoad || progress < 100 || !preloadComplete || !audioChoice) return

    const completeTimeout = setTimeout(() => {
      window.sessionStorage.setItem(LOADING_SEEN_KEY, 'true')
      setIsLoading(false)
      setIsFirstLoad(false)
    }, 900)

    return () => clearTimeout(completeTimeout)
  }, [audioChoice, isFirstLoad, preloadComplete, progress])

  const handleSelectAudio = async (withSound: boolean) => {
    if (audioChoice || isSelectingAudio) return

    setIsSelectingAudio(true)

    if (withSound) {
      const playing = await startSound()
      if (playing) {
        window.localStorage.setItem(AUDIO_PREFERENCE_KEY, 'sound-on')
        setAudioChoice('sound-on')
      } else {
        window.localStorage.setItem(AUDIO_PREFERENCE_KEY, 'sound-off')
        setIsSelectingAudio(false)
      }
      return
    }

    stopSound()
    window.localStorage.setItem(AUDIO_PREFERENCE_KEY, 'sound-off')
    setAudioChoice('sound-off')
    setIsSelectingAudio(false)
  }

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading, progress, setProgress }}>
      {isLoading && isFirstLoad && (
        <LoadingScreen
          progress={progress}
          canSelectAudio={preloadComplete && progress >= 100 && !isSelectingAudio}
          audioChoice={audioChoice}
          onSelectAudio={handleSelectAudio}
        />
      )}
      <div 
        className={`transition-opacity duration-700 ${
          !hasCheckedLoadingState || (isLoading && isFirstLoad) ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {children}
      </div>
    </LoadingContext.Provider>
  )
}
