'use client'

import { useEffect, useRef, useState } from 'react'
import { useTransition } from '@/contexts/transition-context'
import { useIsMobile } from '@/hooks/use-mobile'
import type { FloatingParticle } from '@/types/effects'

const getIsLowPowerDevice = () => {
  const nav = navigator as Navigator & { deviceMemory?: number }
  return (
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    (navigator.hardwareConcurrency || 8) <= 4 ||
    (nav.deviceMemory ?? 8) <= 4
  )
}

export function FloatingParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<FloatingParticle[]>([])
  const [isMounted, setIsMounted] = useState(false)
  const [isTransitionLayerActive, setIsTransitionLayerActive] = useState(false)
  const isMobile = useIsMobile()
  const animationRef = useRef<number>(0)
  const timeRef = useRef(0)
  const lastFrameTime = useRef(0)
  const mouseRef = useRef({ x: 0, y: 0 })
  const targetMouseRef = useRef({ x: 0, y: 0 })
  const isTransitioningRef = useRef(false)
  const transitionIntensityRef = useRef(0)
  const { isTransitioning } = useTransition()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    isTransitioningRef.current = isTransitioning

    if (isTransitioning) {
      setIsTransitionLayerActive(true)
      return
    }

    const timeout = window.setTimeout(() => {
      setIsTransitionLayerActive(false)
    }, 520)

    return () => window.clearTimeout(timeout)
  }, [isTransitioning])

  useEffect(() => {
    if (!isMounted || isMobile) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    const isLowPowerDevice = getIsLowPowerDevice()
    const dpr = 1
    const attractionRadius = 400
    const attractionRadiusSq = attractionRadius * attractionRadius
    const attractionStrength = 0.25
    let width = window.innerWidth
    let height = window.innerHeight
    let isPageVisible = document.visibilityState === 'visible'

    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight
      
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      
      initParticles()
    }

    const initParticles = () => {
      particlesRef.current = []
      const maxParticles = isLowPowerDevice ? 18 : 32
      const particleDensity = isLowPowerDevice ? 52000 : 32000
      const count = Math.min(maxParticles, Math.floor((width * height) / particleDensity))
      
      for (let i = 0; i < count; i++) {
        const hue = Math.random() * 360
        const x = Math.random() * width * 1.5 - width * 0.25
        const y = Math.random() * height
        
        particlesRef.current.push({
          x,
          y,
          baseX: x,
          baseY: y,
          vx: 0,
          vy: 0,
          size: 1 + Math.random() * 2.5,
          hue,
          speed: 0.15 + Math.random() * 0.3,
          amplitude: 20 + Math.random() * 50,
          frequency: 0.0004 + Math.random() * 0.001,
          phase: Math.random() * Math.PI * 2,
          opacity: 0.7 + Math.random() * 0.3,
        })
      }
    }

    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      targetMouseRef.current = { x: e.clientX, y: e.clientY }
    }

    const handleVisibilityChange = () => {
      isPageVisible = document.visibilityState === 'visible'
      if (isPageVisible) {
        lastFrameTime.current = performance.now()
      }
    }

    resize()
    window.addEventListener('resize', resize, { passive: true })
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    document.addEventListener('visibilitychange', handleVisibilityChange)

    const animate = (currentTime: number) => {
      if (!isPageVisible) {
        animationRef.current = requestAnimationFrame(animate)
        return
      }

      const frameInterval = isTransitioningRef.current ? 33 : isLowPowerDevice ? 80 : 50
      if (currentTime - lastFrameTime.current < frameInterval) {
        animationRef.current = requestAnimationFrame(animate)
        return
      }
      lastFrameTime.current = currentTime
      
      timeRef.current += 1
      const time = timeRef.current
      const transitionTarget = isTransitioningRef.current ? 1 : 0
      const intensityEase = transitionTarget ? 0.16 : 0.045
      transitionIntensityRef.current += (transitionTarget - transitionIntensityRef.current) * intensityEase
      const transitionIntensity = transitionIntensityRef.current

      // Smooth mouse position interpolation (faster response)
      mouseRef.current.x += (targetMouseRef.current.x - mouseRef.current.x) * 0.25
      mouseRef.current.y += (targetMouseRef.current.y - mouseRef.current.y) * 0.25

      ctx.clearRect(0, 0, width, height)

      particlesRef.current.forEach((p) => {
        // Base movement
        p.baseX += p.speed

        const wave = Math.sin(time * p.frequency + p.phase) * p.amplitude
        
        // Calculate distance from mouse
        const dx = mouseRef.current.x - p.x
        const dy = mouseRef.current.y - p.y
        const distanceSq = dx * dx + dy * dy
        
        // Mouse attraction effect - particles are drawn toward cursor
        let proximity = 0
        if (distanceSq < attractionRadiusSq && distanceSq > 0) {
          const distance = Math.sqrt(distanceSq)
          const force = (1 - distance / attractionRadius) * attractionStrength
          proximity = 1 - distance / attractionRadius
          p.vx += (dx / distance) * force * 4
          p.vy += (dy / distance) * force * 4
        }

        // Apply velocity with damping (less damping for faster movement)
        p.x += p.vx
        p.y += p.vy
        p.vx *= 0.88
        p.vy *= 0.88

        // Gradually return to base position
        const returnStrength = 0.02
        p.x += (p.baseX - p.x) * returnStrength
        p.y += (p.baseY + wave - p.y) * returnStrength

        // Reset when particle goes off screen
        if (p.baseX > width + 50) {
          p.baseX = -30
          p.x = -30
          p.baseY = Math.random() * height
          p.y = p.baseY
          p.hue = Math.random() * 360
        }

        // Color shift based on proximity to mouse
        const colorShift = proximity * 30
        p.hue = (p.hue + 0.015 + colorShift * 0.1) % 360

        const glowSize = p.size * (58 - 18 * transitionIntensity)
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowSize)
        const alpha = p.opacity * (0.6 + 0.35 * transitionIntensity)
        const coreLightness = 80 - 18 * transitionIntensity
        const midLightness = 70 - 12 * transitionIntensity
        gradient.addColorStop(0, `hsla(${p.hue}, 88%, ${coreLightness}%, ${alpha})`)
        gradient.addColorStop(0.45, `hsla(${p.hue}, 78%, ${midLightness}%, ${alpha * (0.3 + 0.15 * transitionIntensity)})`)
        gradient.addColorStop(1, `hsla(${p.hue}, 60%, 65%, 0)`)

        ctx.beginPath()
        ctx.fillStyle = gradient
        ctx.arc(p.x, p.y, glowSize, 0, Math.PI * 2)
        ctx.fill()

        if (transitionIntensity > 0.02) {
          ctx.beginPath()
          ctx.fillStyle = `hsla(${p.hue}, 95%, 50%, ${Math.min(0.9, p.opacity) * transitionIntensity})`
          ctx.arc(p.x, p.y, Math.max(2.4, p.size * 1.5), 0, Math.PI * 2)
          ctx.fill()
        }
      })

      animationRef.current = requestAnimationFrame(animate)
    }
    animationRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      cancelAnimationFrame(animationRef.current)
    }
  }, [isMounted, isMobile])

  if (!isMounted || isMobile) return null

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{
        zIndex: isTransitionLayerActive ? 99999 : 2,
        opacity: isTransitioning ? 1 : 0.72,
        filter: isTransitioning ? 'saturate(1.45) contrast(1.25)' : 'saturate(1) contrast(1)',
        transition: isTransitioning
          ? 'opacity 0.45s cubic-bezier(0.16, 1, 0.3, 1), filter 0.45s cubic-bezier(0.16, 1, 0.3, 1)'
          : 'opacity 0.55s cubic-bezier(0.16, 1, 0.3, 1), filter 0.55s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      aria-hidden="true"
    />
  )
}
