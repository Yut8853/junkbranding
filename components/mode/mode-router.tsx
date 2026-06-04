'use client'

import { useEffect, useState } from 'react'
import { useMode } from '@/contexts/mode-context'
import { ModeSelect } from '@/components/mode/mode-select'
import { RefinedPage } from '@/components/refined/refined-page'

// Dynamically import the existing experimental home page
import dynamic from 'next/dynamic'

const ExperimentalPage = dynamic(
  () => import('@/components/pages/home-page').then((mod) => mod.default),
  { 
    loading: () => (
      <div className="min-h-svh flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
      </div>
    ),
  }
)

export function ModeRouter() {
  const { mode, hasSelectedMode } = useMode()
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  // Show loading state during hydration
  if (!isHydrated) {
    return (
      <div className="min-h-svh flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="w-8 h-8 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
      </div>
    )
  }

  // Show mode selection if no mode selected
  if (!hasSelectedMode) {
    return <ModeSelect />
  }

  // Render the selected mode
  if (mode === 'refined') {
    return <RefinedPage />
  }

  // Default to experimental (existing design)
  return <ExperimentalPage />
}
