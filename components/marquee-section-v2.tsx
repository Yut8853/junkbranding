'use client'

import { useRef, useState } from 'react'
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
  const isMobile = useIsMobile()

  const renderText = (text: string, key: number, hoveredItem: string | null, onHover: (item: string | null) => void) => {
    return (
      <div
        key={key}
        className="group mx-6 md:mx-10 cursor-pointer flex items-center"
        onMouseEnter={() => !isMobile && onHover(text)}
        onMouseLeave={() => !isMobile && onHover(null)}
      >
        {/* Text with individual characters */}
        <span 
          className="font-display text-4xl md:text-6xl lg:text-7xl xl:text-8xl tracking-wide"
          style={{
            WebkitTextStroke: hoveredItem === text ? '0px' : '1.5px var(--foreground)',
            WebkitTextFillColor: hoveredItem === text ? 'var(--foreground)' : 'transparent',
            transform: !isMobile && hoveredItem === text ? 'scale(1.1) translateY(-4px)' : 'scale(1)',
            transition: isMobile ? 'none' : 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {text}
        </span>
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
