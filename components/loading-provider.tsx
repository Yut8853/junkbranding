'use client'

import { createContext, useContext, useState, useEffect, useLayoutEffect, type ComponentType, type ReactNode } from 'react'
import { useAudio } from '@/contexts/audio-context'
import { useTransition } from '@/contexts/transition-context'
import { LoadingScreen } from './loading-screen'

const LOADING_SEEN_KEY = 'junkbranding-loading-seen-session-v2'
const AUDIO_PREFERENCE_KEY = 'junkbranding-audio-preference'
const HOME_VIDEO_SRC = 'https://videos.pexels.com/video-files/3209211/3209211-uhd_2560_1440_25fps.mp4'
const BACKGROUND_AUDIO_SRC = '/audio/128_BPM124.mp3'
const PRELOAD_ROUTES = ['/', '/about', '/works', '/pricing', '/contact', '/privacy']
const WARMUP_PAGE_LOADERS = [
  () => import('@/components/pages/home-page'),
  () => import('@/components/pages/about-page'),
  () => import('@/components/pages/works-page'),
  () => import('@/components/pages/pricing-page'),
  () => import('@/components/pages/contact-page'),
  () => import('@/components/pages/privacy-page'),
]
const WARMUP_COMPONENT_LOADERS = [
  () => import('@/components/text-reveal'),
  () => import('@/components/scatter-text'),
  () => import('@/components/scatter-block'),
  () => import('@/components/reveal-section'),
  () => import('@/components/magnetic-button'),
  () => import('@/components/transition-link'),
  () => import('@/components/navigation'),
  () => import('@/components/footer'),
  () => import('@/components/page-transition'),
  () => import('@/components/smooth-scroll'),
  () => import('@/components/custom-cursor'),
  () => import('@/components/floating-particles'),
  () => import('@/components/sound-toggle'),
  () => import('@/components/cookie-consent'),
  () => import('@/components/privacy-background'),
  () => import('@/components/works-webgl-scene'),
  () => import('@/components/horizontal-scroll-text'),
  () => import('@/components/english-text'),
  () => import('@/components/unified-english-text'),
]
const WARMUP_LIBRARY_LOADERS = [
  () => import('gsap'),
  () => import('three'),
  () => import('@react-three/fiber'),
  () => import('@react-three/drei'),
  () => import('lucide-react'),
]

const wait = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms))
const waitForFrames = (count: number) => new Promise<void>((resolve) => {
  let frame = 0
  const tick = () => {
    frame += 1
    if (frame >= count) {
      resolve()
      return
    }
    requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
})

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

const preloadModule = async (loader: () => Promise<unknown>) => {
  try {
    await loader()
  } catch {
    // Preload is opportunistic; the real route import can still retry later.
  }
}

const preloadLoaders = async (loaders: Array<() => Promise<unknown>>) => {
  await Promise.all(loaders.map(preloadModule))
}

interface LoadingContextType {
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
  progress: number
  setProgress: (progress: number) => void
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined)

export function useLoading() {
  const context = useContext(LoadingContext)
  if (!context) {
    throw new Error('useLoading must be used within LoadingProvider')
  }
  return context
}

interface LoadingProviderProps {
  children: ReactNode
}

export function LoadingProvider({ children }: LoadingProviderProps) {
  const { startSound, stopSound } = useAudio()
  const { prefetchRoute } = useTransition()
  const [hasCheckedLoadingState, setHasCheckedLoadingState] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isFirstLoad, setIsFirstLoad] = useState(false)
  const [audioChoice, setAudioChoice] = useState<'sound-on' | 'sound-off' | null>(null)
  const [isSelectingAudio, setIsSelectingAudio] = useState(false)
  const [preloadComplete, setPreloadComplete] = useState(false)
  const [warmupPages, setWarmupPages] = useState<ComponentType[]>([])

  useEffect(() => {
    const hasSeenLoading = window.sessionStorage.getItem(LOADING_SEEN_KEY) === 'true'

    if (hasSeenLoading) {
      setProgress(100)
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
        PRELOAD_ROUTES.forEach(prefetchRoute)
        await wait(350)
      },
      () => preloadLoaders([
        () => import('@/components/text-reveal'),
        () => import('@/components/scatter-text'),
        () => import('@/components/scatter-block'),
        () => import('@/components/navigation'),
        () => import('@/components/page-transition'),
        () => import('@/components/smooth-scroll'),
        () => import('@/components/footer'),
      ]),
      () => preloadModule(() => import('gsap')),
      () => preloadModule(() => import('lucide-react')),
      async () => {
        addResourceHint('preconnect', 'https://videos.pexels.com', { crossOrigin: 'anonymous' })
        addResourceHint('preload', HOME_VIDEO_SRC, {
          as: 'video',
          type: 'video/mp4',
          crossOrigin: 'anonymous',
        })
        addResourceHint('preload', BACKGROUND_AUDIO_SRC, {
          as: 'audio',
          type: 'audio/mpeg',
        })
        await wait(450)
      },
      () => wait(500),
    ]

    const warmupPreloadTasks = [
      () => preloadLoaders(WARMUP_LIBRARY_LOADERS),
      () => preloadLoaders(WARMUP_COMPONENT_LOADERS),
      async () => {
        const modules = await Promise.all(
          WARMUP_PAGE_LOADERS.map((loader) => loader().catch(() => null))
        )

        if (cancelled) return

        const pages = modules
          .map((module) => module?.default)
          .filter(Boolean) as ComponentType[]

        setWarmupPages(pages)
        await waitForFrames(8)
        await wait(1400)
      },
      () => preloadModule(() => import('@/components/services-section-v2')),
      () => preloadModule(() => import('@/components/cta-section-v2')),
      () => preloadModule(() => import('@/components/marquee-section-v2')),
      () => preloadModule(() => import('@/components/hero-section-v2')),
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

      for (const warmupTask of warmupPreloadTasks) {
        if (cancelled) return
        await warmupTask()
      }
    }

    void runPreload()

    return () => {
      cancelled = true
    }
  }, [isFirstLoad, prefetchRoute])

  useEffect(() => {
    if (isLoading && isFirstLoad) return
    setWarmupPages([])
  }, [isFirstLoad, isLoading])

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
      {isLoading && isFirstLoad && warmupPages.length > 0 && (
        <div
          aria-hidden="true"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '1440px',
            height: '100svh',
            overflow: 'hidden',
            opacity: 0,
            visibility: 'hidden',
            pointerEvents: 'none',
            transform: 'translate3d(0, 0, 0)',
            contain: 'layout style paint',
            zIndex: -1,
          }}
        >
          {warmupPages.map((WarmupPage, index) => (
            <div key={index} data-preload-warmup-page>
              <WarmupPage />
            </div>
          ))}
        </div>
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
