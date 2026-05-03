'use client'

import { useRef, useState, useEffect, useMemo } from 'react'
import { clamp01, createScatterValue } from '@/lib/scatter'
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
  const charsRef = useRef<(HTMLSpanElement | null)[]>([])
  const [isHovering, setIsHovering] = useState(false)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const isMobile = useIsMobile()

  // Collect all characters from both rows
  const allTexts = useMemo(() => {
    return marqueeRows.flatMap(row => row.texts)
  }, [])

  // Pre-generate scatter values for each character with randomness
  const scatterValues = useMemo(() => {
    let totalChars = 0
    allTexts.forEach(text => { totalChars += text.length })
    
    return Array.from({ length: totalChars }, (_, i) => {
      const seed = i * 11 + 7
      return createScatterValue({
        seed,
        minDistance: 300,
        distanceRange: 500,
        rotationRange: 540,
      })
    })
  }, [allTexts])

  // Scroll-based scatter animation
  useEffect(() => {
    const section = sectionRef.current
    if (!section || isMobile) return

    const validChars = charsRef.current.filter(Boolean) as HTMLSpanElement[]
    let rafId: number | null = null
    let lastProgress = -1

    const handleScroll = () => {
      const rect = section.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      const elementCenter = rect.top + rect.height / 2
      const viewportCenter = viewportHeight / 2
      
      const distancePastCenter = viewportCenter - elementCenter
      const scrollProgress = clamp01(distancePastCenter / 300)

      if (Math.abs(scrollProgress - lastProgress) < 0.01) return
      lastProgress = scrollProgress
      
      validChars.forEach((char, index) => {
        const values = scatterValues[index]
        if (values) {
          char.style.transform = `translate(${values.x * scrollProgress}px, ${values.y * scrollProgress}px) rotate(${values.rotation * scrollProgress}deg) scale(${1 - 0.5 * scrollProgress})`
          char.style.opacity = String(1 - scrollProgress)
        }
      })
    }

    const handleScrollRaf = () => {
      if (rafId) return
      rafId = requestAnimationFrame(() => {
        rafId = null
        handleScroll()
      })
    }

    window.addEventListener('scroll', handleScrollRaf, { passive: true })
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScrollRaf)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [scatterValues, isMobile])

  let charIndex = 0

  const renderText = (text: string, key: number, hoveredItem: string | null, onHover: (item: string | null) => void) => {
    const chars = text.split('')
    const startIndex = charIndex
    charIndex += chars.length

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
          {chars.map((char, i) => (
            <span
              key={i}
              ref={(el) => { charsRef.current[startIndex + i] = el }}
              className="inline-block md:will-change-transform"
            >
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </span>
      </div>
    )
  }

  // Reset char index for each render
  charIndex = 0

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
