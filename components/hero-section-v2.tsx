'use client'

import { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import { createScatterValue } from '@/lib/scatter'

export function HeroSectionV2() {
  const containerRef = useRef<HTMLElement>(null)
  const titleWrapperRef = useRef<HTMLDivElement>(null)
  const charsRef = useRef<(HTMLSpanElement | null)[]>([])
  const bottomBarRef = useRef<HTMLDivElement>(null)
  const sideTextRef = useRef<HTMLDivElement>(null)
  const cornerRefs = useRef<(HTMLDivElement | null)[]>([])
  
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [isLoaded, setIsLoaded] = useState(false)
  const rafRef = useRef<number | null>(null)
  const targetMousePos = useRef({ x: 0, y: 0 })

  // Text content
  const line1 = 'JUNK'
  const line2 = 'BRANDING'
  const line3 = 'あなたの「らしさ」をカタチに。'
  
  const totalChars = line1.length + line2.length + line3.length

  // Pre-generate explosion values with randomness
  const explosionValues = useMemo(() => {
    return Array.from({ length: totalChars }, (_, i) => {
      const seed = i * 13 + 17
      return createScatterValue({
        seed,
        minDistance: 600,
        distanceRange: 800,
        rotationRange: 720,
      })
    })
  }, [totalChars])

  // Smooth mouse tracking
  const updateMousePos = useCallback(() => {
    setMousePos(prev => ({
      x: prev.x + (targetMousePos.current.x - prev.x) * 0.06,
      y: prev.y + (targetMousePos.current.y - prev.y) * 0.06,
    }))
    rafRef.current = requestAnimationFrame(updateMousePos)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      targetMousePos.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    rafRef.current = requestAnimationFrame(updateMousePos)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [updateMousePos])

  // Initial load animation
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  // Direct scroll-based explosion (no GSAP scrub delay)
  useEffect(() => {
    if (!containerRef.current || !isLoaded) return

    const container = containerRef.current
    const validChars = charsRef.current.filter(Boolean) as HTMLSpanElement[]
    const otherElements = [
      bottomBarRef.current,
      sideTextRef.current,
      ...cornerRefs.current.filter(Boolean),
    ].filter(Boolean)

    const handleScroll = () => {
      // 他のセクションと同じスピードで飛散（350pxで完了）
      const scrollProgress = Math.min(window.scrollY / 350, 1)
      
      // Apply explosion to each character
      validChars.forEach((char, index) => {
        const values = explosionValues[index]
        char.style.transform = `translate(${values.x * scrollProgress}px, ${values.y * scrollProgress}px) rotate(${values.rotation * scrollProgress}deg) scale(${1 - 0.5 * scrollProgress})`
        char.style.opacity = String(1 - scrollProgress)
      })

      // Fade out other elements
      otherElements.forEach((el) => {
        if (el) (el as HTMLElement).style.opacity = String(1 - scrollProgress)
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initial call

    return () => window.removeEventListener('scroll', handleScroll)
  }, [isLoaded, explosionValues])

  // Render character with soft gradient and animation
  const renderChar = (char: string, index: number) => {
    return (
      <span
        key={index}
        ref={(el) => { charsRef.current[index] = el }}
        className="inline-block will-change-transform gradient-text-soft"
      >
        {char === ' ' ? '\u00A0' : char}
      </span>
    )
  }

  let charIndex = 0

  return (
    <section 
      ref={containerRef}
      className="relative h-[110vh]"
    >
      {/* Sticky container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">

        {/* Main typography */}
        <div 
          ref={titleWrapperRef}
          className="absolute inset-0 flex flex-col justify-center items-center z-10"
          style={{
            transform: `translate3d(${mousePos.x * -15}px, ${mousePos.y * -15}px, 0)`,
          }}
        >
          {/* Line 1 - JUNK */}
          <div className="overflow-visible">
            <h1 className="font-display text-[18vw] md:text-[16vw] leading-[0.85] tracking-[-0.02em] whitespace-nowrap">
              {line1.split('').map((char) => renderChar(char, charIndex++))}
            </h1>
          </div>

          {/* Line 2 - BRANDING */}
          <div className="overflow-visible -mt-[2vw]">
            <h1 className="font-display text-[18vw] md:text-[16vw] leading-[0.85] tracking-[-0.02em] whitespace-nowrap">
              {line2.split('').map((char) => renderChar(char, charIndex++))}
            </h1>
          </div>

          {/* Line 3 - Japanese tagline */}
          <div className="overflow-visible mt-[3vw]">
            <p className="text-[4vw] md:text-[2.5vw] tracking-[0.2em] font-light whitespace-nowrap">
              {line3.split('').map((char) => renderChar(char, charIndex++))}
            </p>
          </div>
        </div>

        {/* Bottom info bar */}
        <div 
          ref={bottomBarRef}
          className="absolute bottom-0 left-0 right-0 z-30 px-6 md:px-12 pb-8 flex items-end justify-between"
          style={{
            opacity: isLoaded ? 1 : 0,
            transform: isLoaded ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 1s cubic-bezier(0.77, 0, 0.175, 1) 1s',
          }}
        >
          {/* Left - Location */}
          <div className="flex flex-col gap-1">
            <span className="text-[10px] md:text-xs tracking-[0.3em] text-foreground/40 uppercase">Based in</span>
            <span className="text-sm md:text-base text-foreground/80">Ibaraki, Japan</span>
          </div>

          </div>

        {/* Side text - vertical */}
        <div 
          ref={sideTextRef}
          className="absolute left-6 md:left-12 top-1/2 -translate-y-1/2 z-30 hidden lg:block"
          style={{
            writingMode: 'vertical-rl',
            textOrientation: 'mixed',
            opacity: isLoaded ? 1 : 0,
            transform: isLoaded ? 'translateY(-50%)' : 'translateY(-50%) translateX(-20px)',
            transition: 'all 1s cubic-bezier(0.77, 0, 0.175, 1) 1.2s',
          }}
        >
          <span className="text-[10px] tracking-[0.4em] text-foreground/30 uppercase">
            Creative Studio / Est. 2020
          </span>
        </div>

        {/* Corner accents */}
        <div 
          ref={(el) => { cornerRefs.current[0] = el }}
          className="absolute top-8 right-8 w-16 h-16 z-30"
          style={{
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 1s ease-out 1.4s',
          }}
        >
          <div className="absolute top-0 right-0 w-full h-[1px] bg-gradient-to-l from-primary/40 to-transparent" />
          <div className="absolute top-0 right-0 w-[1px] h-full bg-gradient-to-b from-primary/40 to-transparent" />
        </div>

        <div 
          ref={(el) => { cornerRefs.current[1] = el }}
          className="absolute bottom-8 left-8 w-16 h-16 z-30"
          style={{
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 1s ease-out 1.4s',
          }}
        >
          <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-primary/40 to-transparent" />
          <div className="absolute bottom-0 left-0 w-[1px] h-full bg-gradient-to-t from-primary/40 to-transparent" />
        </div>
      </div>
    </section>
  )
}
