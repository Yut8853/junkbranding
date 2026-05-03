'use client'

import { useEffect, useRef, useState } from 'react'
import { clamp01 } from '@/lib/scatter'
import { ScatterText } from '@/components/scatter-text'
import { useIsMobile } from '@/hooks/use-mobile'

const marqueeTexts = ['Branding', 'Web Design', 'Graphic Design', 'Print Media', 'Logo Design', 'Art Direction']
const marqueeRepeatCount = 4

const createMarqueeRow = (reverse = false) => {
  const texts = reverse ? [...marqueeTexts].reverse() : marqueeTexts
  return Array.from({ length: marqueeRepeatCount }, () => texts).flat()
}

const marqueeRows = [
  { texts: createMarqueeRow(), animationName: 'marquee-left', animationDuration: '40s' },
  { texts: createMarqueeRow(true), animationName: 'marquee-right', animationDuration: '35s' },
]

export function MarqueeSectionV2() {
  const sectionRef = useRef<HTMLElement>(null)
  const [isHovering, setIsHovering] = useState(false)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const [scatterProgress, setScatterProgress] = useState(0)
  const isMobile = useIsMobile()

  useEffect(() => {
    const section = sectionRef.current
    if (!section || isMobile) return

    let rafId: number | null = null
    let lastProgress = -1

    const updateProgress = () => {
      const rect = section.getBoundingClientRect()
      const viewportCenter = window.innerHeight / 2
      const elementCenter = rect.top + rect.height / 2
      const nextProgress = clamp01((viewportCenter - elementCenter) / 300)

      if (Math.abs(nextProgress - lastProgress) > 0.01 || nextProgress === 0 || nextProgress === 1) {
        lastProgress = nextProgress
        setScatterProgress(nextProgress)
      }
    }

    const scheduleUpdate = () => {
      if (rafId !== null) return

      rafId = requestAnimationFrame(() => {
        rafId = null
        updateProgress()
      })
    }

    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    updateProgress()

    return () => {
      window.removeEventListener('scroll', scheduleUpdate)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [isMobile])

  const renderText = (text: string, key: number, hoveredItem: string | null, onHover: (item: string | null) => void) => {
    return (
      <div
        key={key}
        className="group mx-6 md:mx-10 cursor-pointer flex items-center"
        onMouseEnter={() => !isMobile && onHover(text)}
        onMouseLeave={() => !isMobile && onHover(null)}
      >
        <ScatterText
          as="span"
          className="font-display text-4xl md:text-6xl lg:text-7xl xl:text-8xl tracking-wide"
          distance={520}
          scatterProgress={scatterProgress}
          style={{
            WebkitTextStroke: hoveredItem === text ? '0px' : '1.5px var(--foreground)',
            WebkitTextFillColor: hoveredItem === text ? 'var(--foreground)' : 'transparent',
            transform: !isMobile && hoveredItem === text ? 'scale(1.1) translateY(-4px)' : 'scale(1)',
            transition: isMobile ? 'none' : 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {text}
        </ScatterText>
      </div>
    )
  }

  return (
    <section 
      ref={sectionRef}
      className="py-12 md:py-20 lg:py-28 border-y border-border/30 overflow-visible relative"
      onMouseEnter={() => !isMobile && setIsHovering(true)}
      onMouseLeave={() => {
        if (isMobile) return
        setIsHovering(false)
        setHoveredItem(null)
      }}
    >
      {/* Background gradient that follows hovered item */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: !isMobile && hoveredItem
            ? 'radial-gradient(ellipse 40% 60% at 50% 50%, oklch(0.75 0.12 300 / 0.15), transparent 70%)'
            : 'transparent',
          transition: isMobile ? 'none' : 'background 0.5s ease',
        }}
      />

      {marqueeRows.map((row, rowIndex) => (
        <div key={row.animationName} className={rowIndex === 0 ? 'mb-4 md:mb-8 overflow-visible' : 'overflow-visible'}>
          <div className="flex whitespace-nowrap overflow-visible">
            <div
              className="flex"
              style={{
                animationName: isMobile ? 'none' : row.animationName,
                animationDuration: row.animationDuration,
                animationTimingFunction: 'linear',
                animationIterationCount: 'infinite',
                animationPlayState: isHovering ? 'paused' : 'running',
              }}
            >
              {row.texts.map((text, i) => renderText(text, rowIndex * 100 + i, hoveredItem, setHoveredItem))}
            </div>
          </div>
        </div>
      ))}
    </section>
  )
}
