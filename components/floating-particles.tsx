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
  const mouseRef = useRef({ x: -1000, y: -1000 })
  const [isMounted, setIsMounted] = useState(false)
  const animationRef = useRef<number>(0)
  const timeRef = useRef(0)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    // Device pixel ratio for crisp rendering
    const dpr = window.devicePixelRatio || 1
    let width = window.innerWidth
    let height = window.innerHeight

    const resize = () => {
      const newDpr = window.devicePixelRatio || 1
      width = window.innerWidth
      height = window.innerHeight
      
      // Set canvas internal size with DPR
      canvas.width = width * newDpr
      canvas.height = height * newDpr
      
      // Set CSS display size
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      
      // Scale context to match DPR
      ctx.setTransform(newDpr, 0, 0, newDpr, 0, 0)
      
      initParticles()
    }

    // Initialize many fine particles across full viewport
    const initParticles = () => {
      particlesRef.current = []
      const count = Math.min(200, Math.floor((width * height) / 5000))
      
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
          size: 0.8 + Math.random() * 2, // Slightly larger
          hue,
          speed: 0.2 + Math.random() * 0.4, // Faster movement
          amplitude: 15 + Math.random() * 40,
          frequency: 0.0006 + Math.random() * 0.002, // Faster wave
          phase: Math.random() * Math.PI * 2,
          opacity: 0.8 + Math.random() * 0.2, // More visible
        })
      }
    }

    resize()
    window.addEventListener('resize', resize)

    // Mouse tracking
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX
      mouseRef.current.y = e.clientY
    }
    window.addEventListener('mousemove', handleMouseMove, { passive: true })

    // Animation loop
    const animate = () => {
      timeRef.current += 1
      const time = timeRef.current

      ctx.clearRect(0, 0, width, height)

      const mouseX = mouseRef.current.x
      const mouseY = mouseRef.current.y

      particlesRef.current.forEach((p) => {
        // Continuous left to right movement
        p.x += p.speed

        // Gentle floating motion - sine wave for natural movement
        const wave = Math.sin(time * p.frequency + p.phase) * p.amplitude
        p.y = p.baseY + wave

        // Mouse influence - very gentle attraction
        const dx = mouseX - p.x
        const dy = mouseY - p.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        
        if (distance < 300) {
          const force = (300 - distance) / 300
          p.vx += dx * 0.001 * force
          p.vy += dy * 0.05 * force
        }

        // Apply velocity with damping
        p.x += p.vx
        p.y += p.vy
        p.vx *= 0.98
        p.vy *= 0.98

        // Wrap around horizontally
        if (p.x > width + 50) {
          p.x = -30
          p.baseY = Math.random() * height
          p.y = p.baseY
          p.hue = Math.random() * 360
        }

        // Slowly shift hue
        p.hue = (p.hue + 0.02) % 360

        // Draw soft blurred particle with pastel colors
        const glowSize = p.size * 55
        const gradient = ctx.createRadialGradient(
          p.x, p.y, 0,
          p.x, p.y, glowSize
        )
        
        // Pastel colors - slightly more saturated and visible
        const alpha = p.opacity * 0.7
gradient.addColorStop(0, `hsla(${p.hue}, 80%, 85%, ${alpha})`)
gradient.addColorStop(0.3, `hsla(${p.hue}, 70%, 75%, ${alpha * 0.5})`)
gradient.addColorStop(0.6, `hsla(${p.hue}, 60%, 65%, ${alpha * 0.2})`)
gradient.addColorStop(1, `hsla(${p.hue}, 60%, 65%, 0)`)

        ctx.beginPath()
        ctx.fillStyle = gradient
        ctx.arc(p.x, p.y, glowSize, 0, Math.PI * 2)
        ctx.fill()

        // Brighter pastel core
        ctx.beginPath()
        ctx.fillStyle = `hsla(${p.hue}, 55%, 85%, ${alpha})`
        ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2)
        ctx.fill()
      })

      animationRef.current = requestAnimationFrame(animate)
    }
    animate()

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
        filter: 'blur(10px)',
      }}
      aria-hidden="true"
    />
  )
}
