'use client'

import { createContext, useContext, useState, useEffect, useLayoutEffect, useRef } from 'react'
import { useAudio } from '@/contexts/audio-context'
import { LoadingScreen } from './loading-screen'
import { scheduleIdleTask, shouldUseFastStart } from '@/lib/performance-mode'
import type { LoadingAudioChoice, LoadingContextType, LoadingProviderProps } from '@/types/component-props'

const LOADING_SEEN_KEY = 'junkbranding-loading-seen-session-v3'
const AUDIO_PREFERENCE_KEY = 'junkbranding-audio-preference'
const FAST_START_AUDIO_FALLBACK_MS = 180
const DEFAULT_AUDIO_FALLBACK_MS = 2400
const FAST_START_COMPLETE_MS = 80
const DEFAULT_COMPLETE_MS = 420
const DEFAULT_PROGRESS_STEPS = [
  { value: 8, delay: 80 },
  { value: 18, delay: 100 },
  { value: 32, delay: 120 },
  { value: 48, delay: 130 },
  { value: 64, delay: 140 },
  { value: 78, delay: 150 },
  { value: 90, delay: 150 },
  { value: 97, delay: 120 },
  { value: 100, delay: 90 },
]

const wait = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms))

const getInitialFastStart = () => {
  if (typeof window === 'undefined') return false
  return shouldUseFastStart()
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
  const initialFastStart = getInitialFastStart()
  const [hasCheckedLoadingState, setHasCheckedLoadingState] = useState(true)
  const [isLoading, setIsLoading] = useState(!initialFastStart)
  const [progress, setProgress] = useState(initialFastStart ? 100 : 0)
  const [isFirstLoad, setIsFirstLoad] = useState(!initialFastStart)
  const [audioChoice, setAudioChoice] = useState<LoadingAudioChoice>(initialFastStart ? 'sound-off' : null)
  const [isSelectingAudio, setIsSelectingAudio] = useState(false)
  const [preloadComplete, setPreloadComplete] = useState(initialFastStart)
  const [isFastStart, setIsFastStart] = useState(initialFastStart)
  const selectionInFlightRef = useRef(false)

  useEffect(() => {
    const fastStart = shouldUseFastStart()
    setIsFastStart(fastStart)
    document.documentElement.dataset.performanceMode = fastStart ? 'lean' : 'full'
    const hasSeenLoading = window.sessionStorage.getItem(LOADING_SEEN_KEY) === 'true'

    if (fastStart) {
      setProgress(100)
      setPreloadComplete(true)
      setIsLoading(false)
      setIsFirstLoad(false)
      setAudioChoice('sound-off')
      window.sessionStorage.setItem(LOADING_SEEN_KEY, 'true')
      window.localStorage.setItem(AUDIO_PREFERENCE_KEY, 'sound-off')
    } else if (hasSeenLoading) {
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

    const runPreload = async () => {
      if (isFastStart || shouldUseFastStart()) {
        setProgress(100)
        setPreloadComplete(true)
        return
      }

      for (const step of DEFAULT_PROGRESS_STEPS) {
        if (cancelled) return

        setProgress(step.value)

        if (step.value === 48 && document.fonts) {
          await Promise.race([document.fonts.ready, wait(step.delay)])
        } else if (step.value === 78) {
          await new Promise<void>((resolve) => window.requestAnimationFrame(() => resolve()))
          await wait(step.delay)
        } else {
          await wait(step.delay)
        }
      }

      if (cancelled) return

      setProgress(100)
      setPreloadComplete(true)
    }

    void runPreload()

    return () => {
      cancelled = true
    }
  }, [isFastStart, isFirstLoad])

  useEffect(() => {
    if (isLoading || isFirstLoad) return
    if (isFastStart) return

    const idleTask = scheduleIdleTask(() => {
      void Promise.allSettled([
        import('@/components/motion/text-reveal'),
        import('@/components/motion/scatter-text'),
        import('@/components/motion/scatter-block'),
      ])
    }, 4500, 2600)

    return () => idleTask.cancel()
  }, [isFastStart, isFirstLoad, isLoading])

  useEffect(() => {
    if (!isFirstLoad || !preloadComplete || audioChoice || isSelectingAudio) return

    const fallbackTimeout = window.setTimeout(() => {
      stopSound()
      window.localStorage.setItem(AUDIO_PREFERENCE_KEY, 'sound-off')
      setAudioChoice('sound-off')
      setIsSelectingAudio(false)
    }, isFastStart ? FAST_START_AUDIO_FALLBACK_MS : DEFAULT_AUDIO_FALLBACK_MS)

    return () => window.clearTimeout(fallbackTimeout)
  }, [audioChoice, isFastStart, isFirstLoad, isSelectingAudio, preloadComplete, stopSound])

  useEffect(() => {
    if (!isFirstLoad || progress < 100 || !preloadComplete || !audioChoice) return

    const completeTimeout = setTimeout(() => {
      window.sessionStorage.setItem(LOADING_SEEN_KEY, 'true')
      setIsLoading(false)
      setIsFirstLoad(false)
    }, isFastStart ? FAST_START_COMPLETE_MS : DEFAULT_COMPLETE_MS)

    return () => clearTimeout(completeTimeout)
  }, [audioChoice, isFastStart, isFirstLoad, preloadComplete, progress])

  const handleSelectAudio = async (withSound: boolean) => {
    if (audioChoice || isSelectingAudio || selectionInFlightRef.current) return

    selectionInFlightRef.current = true
    setIsSelectingAudio(true)

    if (withSound) {
      // 音声のload/play完了を待つと、クリック操作とローディング退場が音声I/Oに引きずられる。
      // ユーザー操作内で再生開始だけ投げ、画面はすぐ先へ進める。
      const soundStart = startSound()
      window.localStorage.setItem(AUDIO_PREFERENCE_KEY, 'sound-on')
      setAudioChoice('sound-on')
      setIsSelectingAudio(false)

      void soundStart.then((playing) => {
        if (playing) return
        window.localStorage.setItem(AUDIO_PREFERENCE_KEY, 'sound-off')
        setAudioChoice('sound-off')
      }).finally(() => {
        selectionInFlightRef.current = false
      })
      return
    }

    stopSound()
    window.localStorage.setItem(AUDIO_PREFERENCE_KEY, 'sound-off')
    setAudioChoice('sound-off')
    setIsSelectingAudio(false)
    selectionInFlightRef.current = false
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
        style={{
          transitionDuration: isFastStart ? '180ms' : undefined,
        }}
      >
        {children}
      </div>
    </LoadingContext.Provider>
  )
}
