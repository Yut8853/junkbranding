'use client'

import { useEffect, useRef, useState } from 'react'
import { ScatterText } from '@/components/scatter-text'
import { useIsMobile } from '@/hooks/use-mobile'

export function HeroSectionV2() {
  const containerRef = useRef<HTMLElement>(null)
  const titleWrapperRef = useRef<HTMLDivElement>(null)
  const bottomBarRef = useRef<HTMLDivElement>(null)
  const sideTextRef = useRef<HTMLDivElement>(null)
  const cornerRefs = useRef<(HTMLDivElement | null)[]>([])
  
  const [isLoaded, setIsLoaded] = useState(false)
  const [heroScatterProgress, setHeroScatterProgress] = useState(0)
  const rafRef = useRef<number | null>(null)
  const isMobile = useIsMobile()
  const targetMousePos = useRef({ x: 0, y: 0 })
  const currentMousePos = useRef({ x: 0, y: 0 })
  const isMouseAnimatingRef = useRef(false)

  // Text content
  const line1 = 'JUNK'
  const line2 = 'BRANDING'
  const line3 = 'あなたの「らしさ」をカタチに。'

  useEffect(() => {
    if (isMobile) return

    const handleMouseMove = (e: MouseEvent) => {
      targetMousePos.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      }

      if (!isMouseAnimatingRef.current) {
        isMouseAnimatingRef.current = true
        rafRef.current = requestAnimationFrame(updateMousePosition)
      }
    }

    let lastFrameTime = 0
    const updateMousePosition = (currentTime: number) => {
      if (currentTime - lastFrameTime >= 33) {
        lastFrameTime = currentTime
        currentMousePos.current.x += (targetMousePos.current.x - currentMousePos.current.x) * 0.08
        currentMousePos.current.y += (targetMousePos.current.y - currentMousePos.current.y) * 0.08

        if (titleWrapperRef.current) {
          titleWrapperRef.current.style.transform = `translate3d(${currentMousePos.current.x * -15}px, ${currentMousePos.current.y * -15}px, 0)`
        }
      }

      const dx = targetMousePos.current.x - currentMousePos.current.x
      const dy = targetMousePos.current.y - currentMousePos.current.y
      if (dx * dx + dy * dy < 0.0001) {
        isMouseAnimatingRef.current = false
        rafRef.current = null
        return
      }

      rafRef.current = requestAnimationFrame(updateMousePosition)
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [isMobile])

  // Initial load animation
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  // Direct scroll-based explosion (no GSAP scrub delay)
  useEffect(() => {
    if (!containerRef.current || !isLoaded || isMobile) return

    const otherElements = [
      bottomBarRef.current,
      sideTextRef.current,
      ...cornerRefs.current.filter(Boolean),
    ].filter(Boolean)
    let rafId: number | null = null
    let lastScrollProgress = -1

    const handleScroll = () => {
      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect) return

      // Hero can live at the bottom of the inverted TOP page, so use local scroll.
      const scrollProgress = Math.min(Math.max(-rect.top, 0) / 350, 1)
      if (Math.abs(scrollProgress - lastScrollProgress) < 0.01) return
      lastScrollProgress = scrollProgress
      setHeroScatterProgress(scrollProgress)

      if (titleWrapperRef.current) {
        titleWrapperRef.current.style.opacity = '1'
        titleWrapperRef.current.style.filter = ''
      }

      // Fade out other elements
      otherElements.forEach((el) => {
        if (el) (el as HTMLElement).style.opacity = String(1 - scrollProgress)
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
    handleScroll() // Initial call

    return () => {
      window.removeEventListener('scroll', handleScrollRaf)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [isLoaded, isMobile])

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
        >
          {/* Line 1 - JUNK */}
          <div className="overflow-visible">
            <ScatterText
              as="h1"
              className="type-display text-[17vw] md:text-[15vw] whitespace-nowrap"
              distance={900}
              gradient
              scatterProgress={heroScatterProgress}
              deferUntilActive
            >
              {line1}
            </ScatterText>
          </div>

          {/* Line 2 - BRANDING */}
          <div className="overflow-visible -mt-[2vw]">
            <ScatterText
              as="h1"
              className="type-display text-[17vw] md:text-[15vw] whitespace-nowrap"
              distance={900}
              gradient
              scatterProgress={heroScatterProgress}
              deferUntilActive
            >
              {line2}
            </ScatterText>
          </div>

          {/* Line 3 - Japanese tagline */}
          <div className="overflow-visible mt-[3vw]">
            <ScatterText
              as="p"
              className="type-section-title text-[3.6vw] md:text-[2.2vw] font-semibold whitespace-nowrap"
              distance={650}
              gradient
              scatterProgress={heroScatterProgress}
              deferUntilActive
            >
              {line3}
            </ScatterText>
          </div>
        </div>

        {/* Bottom info bar */}
        <div 
          ref={bottomBarRef}
          className="absolute bottom-0 left-0 right-0 z-30 px-6 md:px-12 pb-8 flex items-end justify-between"
          style={{
            opacity: isLoaded ? 1 : 0,
            transform: isLoaded ? 'translateY(0)' : 'translateY(30px)',
            transition: isMobile ? 'none' : 'opacity 1s cubic-bezier(0.77, 0, 0.175, 1) 1s, transform 1s cubic-bezier(0.77, 0, 0.175, 1) 1s',
          }}
        >
          {/* Left - Location */}
          <div className="flex flex-col gap-1">
            <ScatterText
              as="span"
              className="type-label text-foreground/40"
              scrollStart={50}
              scrollEnd={350}
              distance={180}
            >
              Based in
            </ScatterText>
            <ScatterText
              as="span"
              className="type-body-compact text-sm md:text-base text-foreground/80"
              scrollStart={50}
              scrollEnd={350}
              distance={220}
            >
              Ibaraki, Japan
            </ScatterText>
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
            transition: isMobile ? 'none' : 'opacity 1s cubic-bezier(0.77, 0, 0.175, 1) 1.2s, transform 1s cubic-bezier(0.77, 0, 0.175, 1) 1.2s',
          }}
        >
          <ScatterText
            as="span"
            className="text-[10px] tracking-[0.4em] text-foreground/30 uppercase"
            scrollStart={50}
            scrollEnd={350}
            distance={220}
          >
            Creative Studio / Est. 2020
          </ScatterText>
        </div>

        {/* Corner accents */}
        <div 
          ref={(el) => { cornerRefs.current[0] = el }}
          className="absolute top-8 right-8 w-16 h-16 z-30"
          style={{
            opacity: isLoaded ? 1 : 0,
            transition: isMobile ? 'none' : 'opacity 1s ease-out 1.4s',
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
            transition: isMobile ? 'none' : 'opacity 1s ease-out 1.4s',
          }}
        >
          <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-primary/40 to-transparent" />
          <div className="absolute bottom-0 left-0 w-[1px] h-full bg-gradient-to-t from-primary/40 to-transparent" />
        </div>
      </div>
    </section>
  )
}
