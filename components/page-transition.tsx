'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState, ReactNode, useRef } from 'react'

interface PageTransitionProps {
  children: ReactNode
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname()
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [displayChildren, setDisplayChildren] = useState(children)
  const [transitionPhase, setTransitionPhase] = useState<'idle' | 'curtain-in' | 'curtain-hold' | 'curtain-out'>('idle')
  const prevPathname = useRef(pathname)
  const isFirstMount = useRef(true)

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false
      return
    }

    if (pathname !== prevPathname.current) {
      prevPathname.current = pathname
      setTransitionPhase('curtain-in')
      setIsTransitioning(true)
    }
  }, [pathname])

  useEffect(() => {
    if (transitionPhase === 'curtain-in') {
      const timer = setTimeout(() => {
        setDisplayChildren(children)
        setTransitionPhase('curtain-hold')
      }, 600)
      return () => clearTimeout(timer)
    }

    if (transitionPhase === 'curtain-hold') {
      const timer = setTimeout(() => {
        setTransitionPhase('curtain-out')
      }, 200)
      return () => clearTimeout(timer)
    }

    if (transitionPhase === 'curtain-out') {
      const timer = setTimeout(() => {
        setTransitionPhase('idle')
        setIsTransitioning(false)
      }, 800)
      return () => clearTimeout(timer)
    }
  }, [transitionPhase, children])

  useEffect(() => {
    if (!isTransitioning) {
      setDisplayChildren(children)
    }
  }, [children, isTransitioning])

  return (
    <>
      {/* Multi-layer curtain transition */}
      <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden">
        {/* Layer 1 - Main curtain with gradient */}
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute inset-0"
            style={{
              background: i === 0 
                ? 'linear-gradient(135deg, oklch(0.98 0.01 280), oklch(0.96 0.02 330))'
                : i === 1
                ? 'linear-gradient(135deg, oklch(0.95 0.03 25), oklch(0.97 0.02 80))'
                : i === 2
                ? 'linear-gradient(135deg, oklch(0.96 0.02 150), oklch(0.94 0.03 220))'
                : i === 3
                ? 'linear-gradient(135deg, oklch(0.97 0.02 280), oklch(0.95 0.03 330))'
                : 'oklch(0.99 0.005 280)',
              transform: transitionPhase === 'curtain-in' || transitionPhase === 'curtain-hold'
                ? 'translateY(0%)'
                : transitionPhase === 'curtain-out'
                ? 'translateY(-100%)'
                : 'translateY(100%)',
              transition: `transform 0.6s cubic-bezier(0.76, 0, 0.24, 1)`,
              transitionDelay: transitionPhase === 'curtain-in'
                ? `${i * 0.05}s`
                : transitionPhase === 'curtain-out'
                ? `${(4 - i) * 0.05}s`
                : '0s',
            }}
          />
        ))}

        {/* Center content during transition */}
        <div 
          className="absolute inset-0 flex items-center justify-center"
          style={{
            opacity: transitionPhase === 'curtain-hold' ? 1 : 0,
            transition: 'opacity 0.3s ease',
          }}
        >
          <div className="relative">
            {/* Animated dots */}
            <div className="flex gap-2">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full"
                  style={{
                    background: `oklch(0.6 0.15 ${280 + i * 50})`,
                    animationName: transitionPhase === 'curtain-hold' ? 'bounce' : 'none',
                    animationDuration: '0.6s',
                    animationTimingFunction: 'ease-in-out',
                    animationIterationCount: 'infinite',
                    animationDelay: `${i * 0.1}s`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content with sophisticated animation */}
      <div 
        className="transition-all duration-700"
        style={{
          opacity: transitionPhase === 'curtain-in' || transitionPhase === 'curtain-hold' ? 0 : 1,
          transform: transitionPhase === 'curtain-in' 
            ? 'scale(0.98) translateY(20px)' 
            : transitionPhase === 'curtain-out'
            ? 'scale(1) translateY(0)'
            : 'scale(1) translateY(0)',
          filter: transitionPhase === 'curtain-in' ? 'blur(10px)' : 'blur(0px)',
          transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {displayChildren}
      </div>

      
    </>
  )
}
