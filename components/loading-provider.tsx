'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { useAudio } from '@/contexts/audio-context'
import { LoadingScreen } from './loading-screen'

const LOADING_SEEN_KEY = 'junkbranding-loading-seen'

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
  const [hasCheckedLoadingState, setHasCheckedLoadingState] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isFirstLoad, setIsFirstLoad] = useState(false)
  const [audioChoice, setAudioChoice] = useState<'sound-on' | 'sound-off' | null>(null)

  useEffect(() => {
    const hasSeenLoading = window.localStorage.getItem(LOADING_SEEN_KEY) === 'true'

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
    if (isFirstLoad) {
      const intervals = [
        { delay: 100, progress: 15 },
        { delay: 300, progress: 35 },
        { delay: 600, progress: 55 },
        { delay: 900, progress: 75 },
        { delay: 1200, progress: 90 },
        { delay: 1500, progress: 100 },
      ]

      const timers = intervals.map(({ delay, progress }) =>
        setTimeout(() => setProgress(progress), delay)
      )

      return () => {
        timers.forEach(clearTimeout)
      }
    }
  }, [isFirstLoad])

  useEffect(() => {
    if (!isFirstLoad || progress < 100 || !audioChoice) return

    const completeTimeout = setTimeout(() => {
      window.localStorage.setItem(LOADING_SEEN_KEY, 'true')
      setIsLoading(false)
      setIsFirstLoad(false)
    }, 900)

    return () => clearTimeout(completeTimeout)
  }, [audioChoice, isFirstLoad, progress])

  const handleSelectAudio = async (withSound: boolean) => {
    if (audioChoice) return

    if (withSound) {
      setAudioChoice('sound-on')
      await startSound()
      return
    }

    stopSound()
    setAudioChoice('sound-off')
  }

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading, progress, setProgress }}>
      {isLoading && isFirstLoad && (
        <LoadingScreen
          progress={progress}
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
