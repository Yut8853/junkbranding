'use client'

import { useEffect, useRef, useState } from 'react'

interface Particle {
  x: number
  y: number
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

    resize()
    window.addEventListener('resize', resize, { passive: true })

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

      ctx.clearRect(0, 0, width, height)

      particlesRef.current.forEach((p) => {
        p.x += p.speed

        const wave = Math.sin(time * p.frequency + p.phase) * p.amplitude
        p.y = p.baseY + wave

        p.x += p.vx
        p.y += p.vy
        p.vx *= 0.98
        p.vy *= 0.98

        if (p.x > width + 50) {
          p.x = -30
          p.baseY = Math.random() * height
          p.y = p.baseY
          p.hue = Math.random() * 360
        }

        p.hue = (p.hue + 0.015) % 360

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
