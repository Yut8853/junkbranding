'use client'

import { createContext, useContext, useState, ReactNode, useCallback, useMemo, useRef } from 'react'
import { useRouter } from 'next/navigation'

interface TransitionContextType {
  isTransitioning: boolean
  navigateWithTransition: (href: string) => void
}

const TransitionContext = createContext<TransitionContextType>({
  isTransitioning: false,
  navigateWithTransition: () => {},
})

export function TransitionProvider({ children }: { children: ReactNode }) {
  const [isTransitioning, setIsTransitioning] = useState(false)
  const router = useRouter()
  const isNavigating = useRef(false)

  const navigateWithTransition = useCallback((href: string) => {
    // Prevent multiple navigations
    if (isNavigating.current || isTransitioning) return
    
    isNavigating.current = true
    
    // Phase 1: Start transition (show overlay & particles)
    setIsTransitioning(true)
    
    // Phase 2: After content fades out, navigate
    setTimeout(() => {
      router.push(href)
    }, 800)
    
    // Phase 3: End transition and fade content back in
    setTimeout(() => {
      setIsTransitioning(false)
      isNavigating.current = false
    }, 2200)
  }, [router, isTransitioning])

  const contextValue = useMemo(() => ({
    isTransitioning,
    navigateWithTransition
  }), [isTransitioning, navigateWithTransition])

  return (
    <TransitionContext.Provider value={contextValue}>
      {children}
    </TransitionContext.Provider>
  )
}

export function useTransition() {
  return useContext(TransitionContext)
}
