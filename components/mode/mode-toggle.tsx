'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useMode } from '@/contexts/mode-context'

export function ModeToggle() {
  const { mode, setMode, hasSelectedMode, resetMode } = useMode()
  const [isExpanded, setIsExpanded] = useState(false)

  if (!hasSelectedMode) return null

  const isRefined = mode === 'refined'

  return (
    <div className="fixed top-8 left-6 md:left-12 z-[120]">
      <motion.div
        className={`flex items-center gap-2 rounded-full backdrop-blur-xl border transition-all duration-300 ${
          isRefined
            ? 'bg-white/80 border-slate-200/60 text-slate-700'
            : 'bg-black/60 border-white/10 text-white'
        }`}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
      >
        {/* Current mode indicator */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold tracking-wider uppercase"
          aria-label="モード切り替えメニューを開く"
          aria-expanded={isExpanded}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              isRefined ? 'bg-slate-600' : 'bg-cyan-400'
            }`}
          />
          <span>{isRefined ? 'Refined' : 'Experimental'}</span>
          <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <polyline points="6 9 12 15 18 9" />
          </motion.svg>
        </button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              className={`absolute top-full left-0 mt-2 rounded-xl backdrop-blur-xl border overflow-hidden ${
                isRefined
                  ? 'bg-white/90 border-slate-200/60'
                  : 'bg-black/80 border-white/10'
              }`}
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <button
                onClick={() => {
                  setMode(isRefined ? 'experimental' : 'refined')
                  setIsExpanded(false)
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-semibold tracking-wider uppercase transition-colors ${
                  isRefined
                    ? 'hover:bg-slate-100 text-slate-600'
                    : 'hover:bg-white/10 text-white/80'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    isRefined ? 'bg-cyan-400' : 'bg-slate-600'
                  }`}
                />
                {isRefined ? 'Experimental' : 'Refined'}
              </button>

              <div
                className={`border-t ${
                  isRefined ? 'border-slate-200/60' : 'border-white/10'
                }`}
              />

              <button
                onClick={() => {
                  resetMode()
                  setIsExpanded(false)
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-medium transition-colors ${
                  isRefined
                    ? 'hover:bg-slate-100 text-slate-500'
                    : 'hover:bg-white/10 text-white/60'
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                  <path d="M21 3v5h-5" />
                  <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                  <path d="M3 21v-5h5" />
                </svg>
                モード選択に戻る
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Click outside to close */}
      {isExpanded && (
        <div
          className="fixed inset-0 -z-10"
          onClick={() => setIsExpanded(false)}
        />
      )}
    </div>
  )
}
