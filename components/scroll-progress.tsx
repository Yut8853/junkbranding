'use client'

import { useEffect, useState } from 'react'

export function ScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight - windowHeight
      const scrollTop = window.scrollY
      const scrollProgress = (scrollTop / documentHeight) * 100
      
      setProgress(Math.min(100, Math.max(0, scrollProgress)))
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div 
      className="fixed top-0 left-0 w-full h-[3px] z-50 bg-border/10"
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Page scroll progress"
    >
      <div
        className="h-full transition-[width] duration-100 ease-out"
        style={{ 
          width: `${progress}%`,
          background: 'linear-gradient(90deg, oklch(0.7 0.22 330), oklch(0.7 0.2 25), oklch(0.75 0.18 80), oklch(0.7 0.15 150), oklch(0.65 0.2 220), oklch(0.6 0.22 280))',
        }}
      />
    </div>
  )
}

interface ScrollIndicatorProps {
  className?: string
}

export function ScrollIndicator({ className = '' }: ScrollIndicatorProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY < 100)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div 
      className={`flex flex-col items-center gap-3 transition-opacity duration-500 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      } ${className}`}
      aria-hidden="true"
    >
      <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
        Scroll
      </span>
      <div className="relative w-[2px] h-12 bg-border/30 overflow-hidden rounded-full">
        <div 
          className="absolute top-0 left-0 w-full h-1/2 rounded-full"
          style={{
            background: 'linear-gradient(180deg, oklch(0.7 0.22 330), oklch(0.6 0.22 280))',
            animation: 'scroll-line 1.5s ease-in-out infinite',
          }}
        />
      </div>
      <style jsx>{`
        @keyframes scroll-line {
          0% {
            transform: translateY(-100%);
          }
          50% {
            transform: translateY(100%);
          }
          100% {
            transform: translateY(200%);
          }
        }
      `}</style>
    </div>
  )
}
