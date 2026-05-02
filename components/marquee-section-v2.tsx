'use client'

import { useRef, useState, useEffect, useMemo } from 'react'
import { clamp01, createScatterValue } from '@/lib/scatter'

const marqueeTexts = ['Branding', 'Web Design', 'Graphic Design', 'Print Media', 'Logo Design', 'Art Direction']
const marqueeRepeatCount = 4

const createMarqueeRow = (reverse = false) => {
  const texts = reverse ? [...marqueeTexts].reverse() : marqueeTexts
  return Array.from({ length: marqueeRepeatCount }, () => texts).flat()
}

const marqueeRows = [
  { texts: createMarqueeRow(), animation: 'marquee-left 40s linear infinite' },
  { texts: createMarqueeRow(true), animation: 'marquee-right 35s linear infinite' },
]

export function MarqueeSectionV2() {
  const sectionRef = useRef<HTMLElement>(null)
  const charsRef = useRef<(HTMLSpanElement | null)[]>([])
  const [isHovering, setIsHovering] = useState(false)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

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
    if (!section) return

    const validChars = charsRef.current.filter(Boolean) as HTMLSpanElement[]

    const handleScroll = () => {
      const rect = section.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      const elementCenter = rect.top + rect.height / 2
      const viewportCenter = viewportHeight / 2
      
      const distancePastCenter = viewportCenter - elementCenter
      const scrollProgress = clamp01(distancePastCenter / 300)
      
      validChars.forEach((char, index) => {
        const values = scatterValues[index]
        if (values) {
          char.style.transform = `translate(${values.x * scrollProgress}px, ${values.y * scrollProgress}px) rotate(${values.rotation * scrollProgress}deg) scale(${1 - 0.5 * scrollProgress})`
          char.style.opacity = String(1 - scrollProgress)
        }
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [scatterValues])

  let charIndex = 0

  const renderText = (text: string, key: number, hoveredItem: string | null, onHover: (item: string | null) => void) => {
    const chars = text.split('')
    const startIndex = charIndex
    charIndex += chars.length

    return (
      <div
        key={key}
        className="group mx-6 md:mx-10 cursor-pointer flex items-center"
        onMouseEnter={() => onHover(text)}
        onMouseLeave={() => onHover(null)}
      >
        {/* Text with individual characters */}
        <span 
          className="font-display text-4xl md:text-6xl lg:text-7xl xl:text-8xl tracking-wide"
          style={{
            WebkitTextStroke: hoveredItem === text ? '0px' : '1.5px var(--foreground)',
            WebkitTextFillColor: hoveredItem === text ? 'var(--foreground)' : 'transparent',
            transform: hoveredItem === text ? 'scale(1.1) translateY(-4px)' : 'scale(1)',
            transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {chars.map((char, i) => (
            <span
              key={i}
              ref={(el) => { charsRef.current[startIndex + i] = el }}
              className="inline-block will-change-transform"
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
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        setIsHovering(false)
        setHoveredItem(null)
      }}
    >
      {/* Background gradient that follows hovered item */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: hoveredItem 
            ? 'radial-gradient(ellipse 40% 60% at 50% 50%, oklch(0.75 0.12 300 / 0.15), transparent 70%)'
            : 'transparent',
          transition: 'background 0.5s ease',
        }}
      />

      {marqueeRows.map((row, rowIndex) => (
        <div key={row.animation} className={rowIndex === 0 ? 'mb-4 md:mb-8 overflow-visible' : 'overflow-visible'}>
          <div className="flex whitespace-nowrap overflow-visible">
            <div
              className="flex"
              style={{
                animation: row.animation,
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
