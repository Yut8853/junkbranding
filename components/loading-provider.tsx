'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { LoadingScreen } from './loading-screen'

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
  const [isLoading, setIsLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const [isFirstLoad, setIsFirstLoad] = useState(true)

  useEffect(() => {
    if (isFirstLoad) {
      // Simulate loading progress
      const intervals = [
        { delay: 100, progress: 15 },
        { delay: 300, progress: 35 },
        { delay: 600, progress: 55 },
        { delay: 900, progress: 75 },
        { delay: 1200, progress: 90 },
        { delay: 1500, progress: 100 },
      ]

      intervals.forEach(({ delay, progress }) => {
        setTimeout(() => setProgress(progress), delay)
      })

      // Complete loading after animation
      const completeTimeout = setTimeout(() => {
        setIsLoading(false)
        setIsFirstLoad(false)
      }, 2200)

      return () => clearTimeout(completeTimeout)
    }
  }, [isFirstLoad])

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading, progress, setProgress }}>
      {isLoading && isFirstLoad && <LoadingScreen progress={progress} />}
      <div 
        className={`transition-opacity duration-700 ${
          isLoading && isFirstLoad ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {children}
      </div>
    </LoadingContext.Provider>
  )
}
