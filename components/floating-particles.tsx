'use client'

import { useEffect, useRef, useState } from 'react'

interface Particle {
  x: number
  y: number
  baseX: number
  baseY: number
  vx: number
  vy: number
  size: number
  hue: number
  speed: number
  amplitude: number
  frequency: number
  phase: number
  opacity: number
}

export function FloatingParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const [isMounted, setIsMounted] = useState(false)
  const animationRef = useRef<number>(0)
  const timeRef = useRef(0)
  const lastFrameTime = useRef(0)
  const mouseRef = useRef({ x: 0, y: 0 })
  const targetMouseRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    // Use lower DPR for performance (max 1.5)
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    let width = window.innerWidth
    let height = window.innerHeight

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

    // Reduce particle count significantly
    const initParticles = () => {
      particlesRef.current = []
      const count = Math.min(40, Math.floor((width * height) / 25000))
      
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

    resize()
    window.addEventListener('resize', resize, { passive: true })
    window.addEventListener('mousemove', handleMouseMove, { passive: true })

    // Animation loop with frame rate limiting (30fps)
    const animate = (currentTime: number) => {
      // Limit to ~30fps for performance
      if (currentTime - lastFrameTime.current < 33) {
        animationRef.current = requestAnimationFrame(animate)
        return
      }
      lastFrameTime.current = currentTime
      
      timeRef.current += 1
      const time = timeRef.current

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
        const distance = Math.sqrt(dx * dx + dy * dy)
        
        // Mouse attraction effect - particles are drawn toward cursor
        const attractionRadius = 400
        const attractionStrength = 0.25
        
        if (distance < attractionRadius && distance > 0) {
          const force = (1 - distance / attractionRadius) * attractionStrength
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
        const colorShift = distance < attractionRadius ? (1 - distance / attractionRadius) * 30 : 0
        p.hue = (p.hue + 0.015 + colorShift * 0.1) % 360

        // Simplified gradient with fewer stops
        const glowSize = p.size * 50
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowSize)
        const alpha = p.opacity * 0.6
        gradient.addColorStop(0, `hsla(${p.hue}, 75%, 80%, ${alpha})`)
        gradient.addColorStop(0.5, `hsla(${p.hue}, 65%, 70%, ${alpha * 0.3})`)
        gradient.addColorStop(1, `hsla(${p.hue}, 60%, 65%, 0)`)

        ctx.beginPath()
        ctx.fillStyle = gradient
        ctx.arc(p.x, p.y, glowSize, 0, Math.PI * 2)
        ctx.fill()
      })

      animationRef.current = requestAnimationFrame(animate)
    }
    animationRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(animationRef.current)
    }
  }, [isMounted])

  if (!isMounted) return null

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 pointer-events-none"
      style={{
        zIndex: 0,
        filter: 'blur(8px)',
      }}
      aria-hidden="true"
    />
  )
}
