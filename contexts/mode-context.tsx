'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

export type DesignMode = 'refined' | 'experimental' | null

interface ModeContextValue {
  mode: DesignMode
  setMode: (mode: DesignMode) => void
  hasSelectedMode: boolean
  resetMode: () => void
}

const ModeContext = createContext<ModeContextValue | null>(null)

const MODE_STORAGE_KEY = 'junkbranding-design-mode'

export function ModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<DesignMode>(null)
  const [hasHydrated, setHasHydrated] = useState(false)

  // Load mode from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(MODE_STORAGE_KEY) as DesignMode
    if (stored === 'refined' || stored === 'experimental') {
      setModeState(stored)
    }
    setHasHydrated(true)
  }, [])

  // Save mode to localStorage when it changes
  const setMode = (newMode: DesignMode) => {
    console.log('[v0] setMode called with:', newMode)
    setModeState(newMode)
    if (newMode) {
      localStorage.setItem(MODE_STORAGE_KEY, newMode)
      console.log('[v0] localStorage set:', newMode)
    } else {
      localStorage.removeItem(MODE_STORAGE_KEY)
    }
  }

  const resetMode = () => {
    setModeState(null)
    localStorage.removeItem(MODE_STORAGE_KEY)
  }

  const hasSelectedMode = hasHydrated && mode !== null

  return (
    <ModeContext.Provider value={{ mode, setMode, hasSelectedMode, resetMode }}>
      {children}
    </ModeContext.Provider>
  )
}

export function useMode() {
  const context = useContext(ModeContext)
  if (!context) {
    throw new Error('useMode must be used within a ModeProvider')
  }
  return context
}
