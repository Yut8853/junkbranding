'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScatterText } from './scatter-text'
import { useTransition } from '@/contexts/transition-context'
import { useIsMobile } from '@/hooks/use-mobile'
import type { CtaParticle } from '@/types/effects'

gsap.registerPlugin(ScrollTrigger)

export function CTASectionV2() {
  const sectionRef = useRef<HTMLElement>(null)
  const buttonRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  const [isHovering, setIsHovering] = useState(false)
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([])
  const particlesRef = useRef<CtaParticle[]>([])
  const animationFrameRef = useRef<number | null>(null)
  const isHoveringRef = useRef(false)
  const isInViewRef = useRef(false)
  const buttonOffsetRef = useRef({ x: 0, y: 0 })
  const magneticFrameRef = useRef<number | null>(null)
  const { navigateWithTransition } = useTransition()
  const isMobile = useIsMobile()
  
  useEffect(() => {
    return () => {
      if (magneticFrameRef.current) {
        cancelAnimationFrame(magneticFrameRef.current)
      }
    }
  }, [])

  // Initialize particles
  useEffect(() => {
    if (isMobile) return

    const particles: CtaParticle[] = []
    const particleCount = 32

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * 600,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.5 + 0.2,
        hue: Math.random() * 60 + 300, // Purple to pink range
      })
    }
    particlesRef.current = particles
  }, [isMobile])

  // Animate particles
  useEffect(() => {
    if (isMobile) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const frameInterval = 50
    let lastFrameTime = 0
    let isPageVisible = document.visibilityState === 'visible'

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = 600
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    const handleVisibilityChange = () => {
      isPageVisible = document.visibilityState === 'visible'
      if (isPageVisible) {
        lastFrameTime = performance.now()
        startAnimation()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    const observer = new IntersectionObserver(
      ([entry]) => {
        isInViewRef.current = entry.isIntersecting
        if (entry.isIntersecting) {
          lastFrameTime = performance.now()
          startAnimation()
        }
      },
      { rootMargin: '20% 0px' }
    )

    if (sectionRef.current) observer.observe(sectionRef.current)

    const startAnimation = () => {
      if (animationFrameRef.current || !isPageVisible || !isInViewRef.current) return
      animationFrameRef.current = requestAnimationFrame(animate)
    }

    const animate = (currentTime: number) => {
      animationFrameRef.current = null

      if (!isPageVisible || !isInViewRef.current) {
        return
      }

      if (currentTime - lastFrameTime < frameInterval) {
        startAnimation()
        return
      }
      lastFrameTime = currentTime

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      let buttonCenter: { x: number; y: number } | null = null
      const sectionTop = sectionRef.current?.getBoundingClientRect().top || 0

      if (isHoveringRef.current && buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect()
        buttonCenter = {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2 - sectionTop,
        }
      }
      
      particlesRef.current.forEach(particle => {
        // Update position
        particle.x += particle.speedX
        particle.y += particle.speedY

        // Boundary check
        if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1
        if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1

        // Mouse attraction when hovering
        if (buttonCenter) {
          const dx = buttonCenter.x - particle.x
          const dy = buttonCenter.y - particle.y
          const distanceSq = dx * dx + dy * dy
          
          if (distanceSq < 90000) {
            particle.speedX += dx * 0.0003
            particle.speedY += dy * 0.0003
          }
        }

        // Draw particle
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = `oklch(0.7 0.2 ${particle.hue} / ${particle.opacity})`
        ctx.fill()
      })

      // Draw connections between nearby particles
      particlesRef.current.forEach((p1, i) => {
        particlesRef.current.slice(i + 1).forEach(p2 => {
          const dx = p1.x - p2.x
          const dy = p1.y - p2.y
          const distanceSq = dx * dx + dy * dy
          
          if (distanceSq < 10000) {
            const distance = Math.sqrt(distanceSq)
            ctx.beginPath()
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.strokeStyle = `oklch(0.7 0.15 310 / ${0.15 * (1 - distance / 100)})`
            ctx.stroke()
          }
        })
      })

      startAnimation()
    }

    startAnimation()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      observer.disconnect()
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
    }
  }, [isMobile])

  // Magnetic button effect
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isMobile) return
    if (!buttonRef.current) return
    
    const rect = buttonRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    const deltaX = e.clientX - centerX
    const deltaY = e.clientY - centerY
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
    
    // Magnetic pull when within range
    if (distance < 200) {
      const pull = (200 - distance) / 200
      buttonOffsetRef.current = {
        x: deltaX * pull * 0.4,
        y: deltaY * pull * 0.4,
      }
    } else {
      buttonOffsetRef.current = { x: 0, y: 0 }
    }

    if (magneticFrameRef.current) return
    magneticFrameRef.current = requestAnimationFrame(() => {
      magneticFrameRef.current = null
      if (!buttonRef.current) return
      const { x, y } = buttonOffsetRef.current
      buttonRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`
    })
  }, [isMobile])

  const addRipple = (e: React.MouseEvent<HTMLElement>) => {
    const rect = buttonRef.current?.getBoundingClientRect()
    if (!rect) return

    // Add ripple at click position
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const newRipple = { id: Date.now(), x, y }
    setRipples(prev => [...prev, newRipple])

    // Remove ripple after animation
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== newRipple.id))
    }, 1000)
  }

  const handleContactClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    addRipple(e)
    navigateWithTransition('/contact')
  }

  // GSAP scroll animation
  useEffect(() => {
    if (!sectionRef.current || isMobile) return

    const ctx = gsap.context(() => {
      gsap.from(textRef.current, {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom-=50',
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [isMobile])

  

  return (
    <section 
      ref={sectionRef}
      className="relative py-32 md:py-40 lg:py-56 overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        buttonOffsetRef.current = { x: 0, y: 0 }
        if (buttonRef.current) {
          buttonRef.current.style.transform = 'translate3d(0, 0, 0)'
        }
      }}
    >
      {/* Particle canvas background */}
        <canvas
        ref={canvasRef}
        className="absolute inset-0 hidden pointer-events-none md:block"
        style={{ opacity: 0.6 }}
      />

      {/* Background gradient */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isHovering 
            ? 'radial-gradient(ellipse 60% 50% at 50% 50%, oklch(0.75 0.15 310 / 0.2), transparent 70%)'
            : 'transparent',
          transition: 'background 0.8s ease',
        }}
      />

      <div className="container mx-auto px-6 md:px-12 lg:px-16 relative z-10">
        {/* Header text */}
        <div ref={textRef} className="text-center mb-16 lg:mb-24">
          <div className="mb-6 lg:mb-8">
            <ScatterText
              as="span"
              className="type-eyebrow text-[clamp(3rem,10vw,7rem)] text-foreground/45 block"
              scrollStart={50}
              scrollEnd={350}
              distance={500}
              style={{
                WebkitTextStroke: '1px currentColor',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Contact
            </ScatterText>
          </div>
          <ScatterText
            as="h2"
            className="type-section-title text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-6 lg:mb-8"
            scrollStart={50}
            scrollEnd={350}
            distance={400}
            gradient
          >
            まずは、お話しませんか？
          </ScatterText>
          <ScatterText
            as="p"
            className="type-body text-base md:text-lg text-muted-foreground max-w-lg mx-auto"
            scrollStart={50}
            scrollEnd={350}
            distance={300}
          >
            「こんなこと頼めるのかな？」という段階でも大丈夫。お気軽にご連絡ください。
          </ScatterText>
        </div>

        {/* Giant circular CTA */}
        <div className="flex justify-center">
          <div
            ref={buttonRef}
            className="cta-primary group relative flex h-[280px] w-[280px] items-center justify-center overflow-hidden rounded-full md:h-[360px] md:w-[360px] lg:h-[420px] lg:w-[420px]"
            style={{
              transition: isHovering 
                ? 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)' 
                : 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            onMouseEnter={() => {
              isHoveringRef.current = true
              setIsHovering(true)
            }}
            onMouseLeave={() => {
              isHoveringRef.current = false
              setIsHovering(false)
            }}
            data-cursor="Contact"
          >
            {/* Outer glow ring */}
            <div 
              className="absolute inset-0 rounded-full"
              style={{
                background: 'conic-gradient(from 0deg, oklch(0.7 0.22 330 / 0.4), oklch(0.7 0.2 25 / 0.4), oklch(0.75 0.18 80 / 0.4), oklch(0.65 0.2 220 / 0.4), oklch(0.6 0.22 280 / 0.4), oklch(0.7 0.22 330 / 0.4))',
                filter: isMobile ? 'blur(10px)' : isHovering ? 'blur(30px)' : 'blur(20px)',
                transform: isMobile ? 'scale(1)' : isHovering ? 'scale(1.15)' : 'scale(1)',
                opacity: isMobile ? 0.35 : isHovering ? 1 : 0.6,
                transition: isMobile ? 'none' : 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                animation: isMobile ? 'none' : 'spin 10s linear infinite',
              }}
            />

            {/* Gradient overlay on hover */}
            <div 
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(135deg, oklch(0.55 0.22 280), oklch(0.6 0.2 320), oklch(0.65 0.18 360))',
                opacity: isHovering ? 1 : 0,
                transition: 'opacity 0.5s ease',
              }}
            />

            {/* Ripple effects */}
            {ripples.map(ripple => (
              <span
                key={ripple.id}
                className="absolute rounded-full bg-white/30 animate-ripple"
                style={{
                  left: ripple.x,
                  top: ripple.y,
                  transform: 'translate(-50%, -50%)',
                }}
              />
            ))}

            {/* Button content */}
            <div className="relative z-10 flex w-full flex-col items-center justify-center px-8 text-center text-white md:px-12 lg:px-16">
              <ScatterText
                as="span"
                className="type-eyebrow mb-3 block text-base md:mb-4 md:text-xl lg:text-2xl"
                scrollStart={50}
                scrollEnd={350}
                distance={220}
                style={{
                  transform: isHovering ? 'translateY(-8px)' : 'translateY(0)',
                  transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                CONTACT
              </ScatterText>

              <div className="flex w-full flex-col items-center gap-2 md:gap-3">
                <a
                  href="/contact"
                  onClick={handleContactClick}
                  className="type-cta group/link inline-flex items-center justify-center py-1.5 text-xs text-white transition-all duration-300 hover:-translate-y-0.5 hover:text-white/80 md:text-sm"
                  data-cursor="Contact"
                >
                  問い合わせフォーム
                  <span className="ml-2 inline-block transition-transform duration-300 group-hover/link:translate-x-1">
                    →
                  </span>
                </a>

                <a
                  href="tel:08091550426"
                  onClick={addRipple}
                  className="type-readable-number inline-flex items-center justify-center py-1.5 text-base text-white transition-all duration-300 hover:-translate-y-0.5 hover:text-white/80 md:text-xl lg:text-2xl"
                  data-cursor="Call"
                  aria-label="080-9155-0426 に電話する"
                >
                  080-9155-0426
                </a>
              </div>

              <span
                className="type-label mt-3 block max-w-[220px] text-[0.56rem] text-white/70 transition-all duration-300 md:mt-4 md:text-[0.65rem]"
                style={{
                  transform: isHovering ? 'translateY(4px)' : 'translateY(0)',
                  opacity: isHovering ? 1 : 0.75,
                }}
              >
                Choose your contact method
              </span>
            </div>

            {/* Rotating border decoration */}
            <div 
              className="absolute inset-0 rounded-full border border-dashed border-foreground/20"
              style={{
                animation: 'spin 30s linear infinite reverse',
              }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
