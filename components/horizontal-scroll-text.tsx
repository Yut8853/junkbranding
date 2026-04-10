'use client'

import { useRef, useEffect, useState } from 'react'

interface HorizontalScrollTextProps {
  text: string
  className?: string
  speed?: number
  direction?: 'left' | 'right'
  pauseOnHover?: boolean
}

export function HorizontalScrollText({
  text,
  className = '',
  speed = 30,
  direction = 'left',
  pauseOnHover = true,
}: HorizontalScrollTextProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isPaused, setIsPaused] = useState(false)

  // Duplicate text for seamless loop
  const repeatedText = `${text} • `.repeat(6)

  return (
    <div
      ref={containerRef}
      className={`overflow-hidden whitespace-nowrap ${className}`}
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => pauseOnHover && setIsPaused(false)}
      aria-hidden="true"
    >
      <div
        className={`inline-flex ${isPaused ? 'animation-paused' : ''}`}
        style={{
          animation: `scroll-${direction} ${speed}s linear infinite`,
          animationPlayState: isPaused ? 'paused' : 'running',
        }}
      >
        <span className="inline-block">{repeatedText}</span>
        <span className="inline-block">{repeatedText}</span>
      </div>
      
      <style jsx>{`
        @keyframes scroll-left {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
        
        @keyframes scroll-right {
          from {
            transform: translateX(-50%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  )
}

interface MarqueeProps {
  children: React.ReactNode
  className?: string
  speed?: number
  direction?: 'left' | 'right'
}

export function Marquee({
  children,
  className = '',
  speed = 20,
  direction = 'left',
}: MarqueeProps) {
  return (
    <div className={`overflow-hidden ${className}`} aria-hidden="true">
      <div
        className="inline-flex"
        style={{
          animation: `marquee-${direction} ${speed}s linear infinite`,
        }}
      >
        <div className="flex gap-8">{children}</div>
        <div className="flex gap-8 ml-8">{children}</div>
      </div>
      
      <style jsx>{`
        @keyframes marquee-left {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
        
        @keyframes marquee-right {
          from {
            transform: translateX(-50%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  )
}
