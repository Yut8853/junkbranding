'use client'

import { useEffect, useRef, useState } from 'react'

export function HeroTitle() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isMounted, setIsMounted] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    setIsMounted(true)
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  // Mouse tracking with smooth interpolation
  useEffect(() => {
    if (!isMounted) return
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      setMousePos({
        x: (e.clientX - rect.left - rect.width / 2) / rect.width,
        y: (e.clientY - rect.top - rect.height / 2) / rect.height,
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [isMounted])

  const lines = [
    { text: 'あなたの', delay: 0, size: 'normal' },
    { text: '「らしさ」を', delay: 0.15, highlight: true, size: 'large' },
    { text: 'カタチに。', delay: 0.3, gradient: true, size: 'normal' },
  ]

  if (!isMounted) {
    return (
      <div className="relative py-8">
        <h1 className="text-5xl md:text-7xl lg:text-[6rem] xl:text-[7rem] font-bold leading-[1.05] tracking-tight">
          {lines.map((line, i) => (
            <span key={i} className="block opacity-0">{line.text}</span>
          ))}
        </h1>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="relative py-2 sm:pb-20 md:pb-2">
      {/* Main text with mouse parallax */}
      <h1 
        className="relative z-10 text-5xl md:text-7xl lg:text-[6rem] xl:text-[7rem] font-bold leading-[1.05] tracking-tight"
        style={{
          transform: `translate3d(${mousePos.x * -15}px, ${mousePos.y * -15}px, 0)`,
          transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {lines.map((line, lineIndex) => (
          <span 
            key={lineIndex} 
            className={`block overflow-hidden py-1 ${line.size === 'large' ? 'text-[1.15em]' : ''}`}
          >
            <span 
              className="inline-block relative"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible 
                  ? 'translate3d(0, 0, 0) rotate(0deg)' 
                  : 'translate3d(0, 110%, 0) rotate(3deg)',
                transition: 'all 1.4s cubic-bezier(0.16, 1, 0.3, 1)',
                transitionDelay: `${line.delay}s`,
              }}
            >
              {/* Highlight background for middle line */}
              {line.highlight && (
                <span 
                  className="absolute inset-0 -z-10 rounded-lg"
                  style={{
                    background: 'linear-gradient(90deg, oklch(0.92 0.08 330 / 0.35), oklch(0.94 0.06 25 / 0.35), oklch(0.92 0.08 80 / 0.35))',
                    transform: isVisible ? 'scaleX(1)' : 'scaleX(0)',
                    transformOrigin: 'left',
                    transition: 'transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
                    transitionDelay: '0.7s',
                  }}
                />
              )}
              
              {/* Character-by-character rendering */}
              {line.text.split('').map((char, charIndex) => (
                <span 
                  key={charIndex}
                  className={`inline-block ${isVisible ? (line.gradient ? 'animate-gradient-flow' : 'animate-char-float') : ''} ${line.gradient ? 'gradient-text-char' : ''}`}
                  style={{
                    ['--char-delay' as string]: `${charIndex * 0.08}s`,
                  }}
                >
                  {char}
                </span>
              ))}
            </span>
          </span>
        ))}
      </h1>

      {/* Decorative orbs with rotation */}
      <div 
        className="absolute -top-10 -right-10 md:-top-20 md:-right-20 w-32 h-32 md:w-52 md:h-52 pointer-events-none"
        style={{
          opacity: isVisible ? 0.7 : 0,
          transform: isVisible 
            ? `scale(1) translate3d(${mousePos.x * 30}px, ${mousePos.y * 30}px, 0)` 
            : 'scale(0.3)',
          transition: 'all 1.8s cubic-bezier(0.16, 1, 0.3, 1)',
          transitionDelay: '0.5s',
        }}
      >
        <div 
          className="w-full h-full rounded-full animate-spin"
          style={{
            background: 'conic-gradient(from 0deg, oklch(0.85 0.15 330 / 0.5), oklch(0.9 0.12 25 / 0.5), oklch(0.85 0.15 80 / 0.5), oklch(0.8 0.18 150 / 0.5), oklch(0.75 0.2 220 / 0.5), oklch(0.7 0.22 280 / 0.5), oklch(0.85 0.15 330 / 0.5))',
            filter: 'blur(50px)',
            animationDuration: '20s',
          }}
        />
      </div>

      <div 
        className="absolute -bottom-8 -left-8 md:-bottom-14 md:-left-14 w-24 h-24 md:w-40 md:h-40 pointer-events-none"
        style={{
          opacity: isVisible ? 0.5 : 0,
          transform: isVisible 
            ? `scale(1) translate3d(${mousePos.x * -20}px, ${mousePos.y * -20}px, 0)` 
            : 'scale(0.3)',
          transition: 'all 1.8s cubic-bezier(0.16, 1, 0.3, 1)',
          transitionDelay: '0.7s',
        }}
      >
        <div 
          className="w-full h-full rounded-full animate-spin-reverse"
          style={{
            background: 'conic-gradient(from 180deg, oklch(0.8 0.18 220 / 0.5), oklch(0.75 0.2 280 / 0.5), oklch(0.85 0.15 330 / 0.5), oklch(0.8 0.18 220 / 0.5))',
            filter: 'blur(35px)',
            animationDuration: '15s',
          }}
        />
      </div>

      
    </div>
  )
}
