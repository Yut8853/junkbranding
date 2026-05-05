'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { useIsMobile } from '@/hooks/use-mobile'
import type { CursorParticle } from '@/types/effects'

const CURSOR_FRAME_INTERVAL_MS = 16
const TRAIL_INTERVAL_MS = 80
const MAX_PARTICLES = 45
const getShouldReduceCursorEffects = () => {
  const nav = navigator as Navigator & { deviceMemory?: number }
  return (
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    (navigator.hardwareConcurrency || 8) <= 4 ||
    (nav.deviceMemory ?? 8) <= 4
  )
}

export function CustomCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const isMobile = useIsMobile()
  const positionRef = useRef({ x: 0, y: 0 })
  const targetRef = useRef({ x: 0, y: 0 })
  const particlesRef = useRef<CursorParticle[]>([])
  const particleIdRef = useRef(0)
  const hueRef = useRef(0)
  const lastSpawnRef = useRef(0)
  const isClickingRef = useRef(false)
  const isHoveringRef = useRef(false)
  const isAnimatingRef = useRef(false)
  const lastInteractionRef = useRef(0)
  const reduceEffectsRef = useRef(false)
  const wakeAnimationRef = useRef<(() => void) | null>(null)
  const hasPointerRef = useRef(false)

  const spawnFireworkParticles = useCallback((x: number, y: number, count: number = 20) => {
    if (reduceEffectsRef.current) return

    const newParticles: CursorParticle[] = []
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5
      const speed = 3 + Math.random() * 5
      newParticles.push({
        id: particleIdRef.current++,
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        maxLife: 0.8 + Math.random() * 0.4,
        hue: (hueRef.current + i * (360 / count)) % 360,
        size: 3 + Math.random() * 4,
      })
    }
    particlesRef.current = [...particlesRef.current, ...newParticles].slice(-MAX_PARTICLES)
  }, [])

  const spawnTrailParticle = useCallback((x: number, y: number) => {
    if (reduceEffectsRef.current && particlesRef.current.length > 12) return

    const particle: CursorParticle = {
      id: particleIdRef.current++,
      x: x + (Math.random() - 0.5) * 10,
      y: y + (Math.random() - 0.5) * 10,
      vx: (Math.random() - 0.5) * 1,
      vy: (Math.random() - 0.5) * 1 - 0.5,
      life: 1,
      maxLife: 0.5 + Math.random() * 0.3,
      hue: hueRef.current,
      size: 2 + Math.random() * 3,
    }
    particlesRef.current.push(particle)
    if (particlesRef.current.length > MAX_PARTICLES) {
      particlesRef.current.splice(0, particlesRef.current.length - MAX_PARTICLES)
    }
    hueRef.current = (hueRef.current + 2) % 360
  }, [])

  useEffect(() => {
    if (isMobile) {
      setIsVisible(false)
      document.body.classList.remove('cursor-ready')
      return
    }

    setIsMounted(true)
    
    if (typeof window === 'undefined') return
    reduceEffectsRef.current = getShouldReduceCursorEffects()
    
    if (window.matchMedia('(pointer: fine)').matches) {
      setIsVisible(true)
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!hasPointerRef.current) {
        hasPointerRef.current = true
        positionRef.current = { x: e.clientX, y: e.clientY }
        document.body.classList.add('cursor-ready')
      }

      targetRef.current = { x: e.clientX, y: e.clientY }
      lastInteractionRef.current = performance.now()
      wakeAnimationRef.current?.()
    }

    const handleMouseEnter = () => setIsVisible(true)
    const handleMouseLeave = () => setIsVisible(false)
    
    const handleMouseDown = () => {
      isClickingRef.current = true
      spawnFireworkParticles(targetRef.current.x, targetRef.current.y, 18)
      lastInteractionRef.current = performance.now()
      wakeAnimationRef.current?.()
    }
    
    const handleMouseUp = () => {
      isClickingRef.current = false
    }

    const handleElementHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const interactiveElement = target.closest('a, button, [role="button"], input, textarea, select, [data-cursor]')
      const nextIsHovering = Boolean(interactiveElement)
      
      if (nextIsHovering === isHoveringRef.current) return

      isHoveringRef.current = nextIsHovering
      if (nextIsHovering) {
        spawnFireworkParticles(e.clientX, e.clientY, 6)
        lastInteractionRef.current = performance.now()
        wakeAnimationRef.current?.()
      }
    }

    document.addEventListener('mousemove', handleMouseMove, { passive: true })
    document.addEventListener('mousemove', handleElementHover, { passive: true })
    document.addEventListener('mouseenter', handleMouseEnter)
    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mousemove', handleElementHover)
      document.removeEventListener('mouseenter', handleMouseEnter)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.classList.remove('cursor-ready')
    }
  }, [isMobile, spawnFireworkParticles])

  useEffect(() => {
    if (!isMounted || !isVisible || isMobile) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    let animationFrame: number
    let lastFrameTime = 0
    let isPageVisible = document.visibilityState === 'visible'

    const requestNextFrame = () => {
      animationFrame = requestAnimationFrame(animate)
    }

    const wakeAnimation = () => {
      if (isAnimatingRef.current) return
      isAnimatingRef.current = true
      requestNextFrame()
    }

    const handleVisibilityChange = () => {
      isPageVisible = document.visibilityState === 'visible'
      if (isPageVisible) {
        lastFrameTime = performance.now()
        wakeAnimation()
      }
    }

    wakeAnimationRef.current = wakeAnimation
    document.addEventListener('visibilitychange', handleVisibilityChange)

    const animate = (currentTime: number) => {
      if (!ctx || !canvas) return

      if (!isPageVisible) {
        isAnimatingRef.current = false
        return
      }

      if (currentTime - lastFrameTime < CURSOR_FRAME_INTERVAL_MS) {
        requestNextFrame()
        return
      }
      lastFrameTime = currentTime

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Smooth cursor movement
      const ease = 0.22
      positionRef.current.x += (targetRef.current.x - positionRef.current.x) * ease
      positionRef.current.y += (targetRef.current.y - positionRef.current.y) * ease

      const now = Date.now()

      // Spawn trail particles
      const trailInterval = reduceEffectsRef.current ? TRAIL_INTERVAL_MS * 2 : TRAIL_INTERVAL_MS
      if (now - lastSpawnRef.current > trailInterval) {
        spawnTrailParticle(positionRef.current.x, positionRef.current.y)
        lastSpawnRef.current = now
      }

      let hasLiveParticles = false

      // Update and draw particles
      particlesRef.current = particlesRef.current.filter(particle => {
        particle.x += particle.vx
        particle.y += particle.vy
        particle.vy += 0.1 // gravity
        particle.vx *= 0.98 // friction
        particle.vy *= 0.98
        particle.life -= 0.02 / particle.maxLife

        if (particle.life <= 0) return false
        hasLiveParticles = true

        const alpha = particle.life
        const size = particle.size * particle.life

        // Draw particle with rainbow gradient
        ctx.save()
        ctx.globalAlpha = alpha
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2)
        ctx.fillStyle = `hsl(${particle.hue}, 80%, 60%)`
        ctx.fill()

        // Glow effect
        ctx.shadowBlur = size * 1.4
        ctx.shadowColor = `hsl(${particle.hue}, 80%, 60%)`
        ctx.fill()
        ctx.restore()

        return true
      })

      // Draw main cursor
      const cursorSize = isHoveringRef.current ? 50 : 24
      const x = positionRef.current.x
      const y = positionRef.current.y

      // Outer ring with rainbow gradient
      const gradient = ctx.createConicGradient(hueRef.current * Math.PI / 180, x, y)
      gradient.addColorStop(0, 'hsl(330, 80%, 60%)')
      gradient.addColorStop(0.17, 'hsl(25, 80%, 60%)')
      gradient.addColorStop(0.33, 'hsl(60, 80%, 60%)')
      gradient.addColorStop(0.5, 'hsl(150, 80%, 60%)')
      gradient.addColorStop(0.67, 'hsl(220, 80%, 60%)')
      gradient.addColorStop(0.83, 'hsl(280, 80%, 60%)')
      gradient.addColorStop(1, 'hsl(330, 80%, 60%)')

      ctx.save()
      ctx.beginPath()
      ctx.arc(x, y, cursorSize, 0, Math.PI * 2)
      ctx.strokeStyle = gradient
      ctx.lineWidth = 2
      ctx.stroke()

      // Inner glow
      ctx.beginPath()
      ctx.arc(x, y, cursorSize * 0.3, 0, Math.PI * 2)
      ctx.fillStyle = `hsla(${hueRef.current}, 80%, 60%, 0.3)`
      ctx.fill()

      // Center dot
      ctx.beginPath()
      ctx.arc(x, y, 3, 0, Math.PI * 2)
      ctx.fillStyle = `hsl(${hueRef.current}, 80%, 70%)`
      ctx.fill()
      ctx.restore()

      const dx = targetRef.current.x - positionRef.current.x
      const dy = targetRef.current.y - positionRef.current.y
      const isCursorSettled = dx * dx + dy * dy < 0.25
      const hasRecentInteraction = currentTime - lastInteractionRef.current < 600

      if (hasLiveParticles || !isCursorSettled || hasRecentInteraction || isHoveringRef.current || isClickingRef.current) {
        requestNextFrame()
        return
      }

      isAnimatingRef.current = false
    }

    wakeAnimation()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      wakeAnimationRef.current = null
      isAnimatingRef.current = false
      cancelAnimationFrame(animationFrame)
    }
  }, [isMounted, isVisible, isMobile, spawnTrailParticle])

  if (!isMounted || isMobile) return null

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-[9999] hidden md:block transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      aria-hidden="true"
    />
  )
}
