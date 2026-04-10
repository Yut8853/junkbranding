'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Home } from 'lucide-react'

interface Particle {
  x: number
  y: number
  targetX: number
  targetY: number
  originX: number
  originY: number
  vx: number
  vy: number
  size: number
  hue: number
  isText: boolean
}

export default function NotFound() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const mouseRef = useRef({ x: -1000, y: -1000, isPressed: false })
  const animationRef = useRef<number>(0)
  const [isExploded, setIsExploded] = useState(false)
  const [glitchText, setGlitchText] = useState('404')

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
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

    // Create particles that form "404"
    const initParticles = () => {
      particlesRef.current = []
      
      // Create text particles
      ctx.save()
      ctx.font = `bold ${Math.min(width * 0.35, 400)}px Inter, sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillStyle = 'white'
      ctx.fillText('404', width / 2, height / 2 - 50)
      
      const imageData = ctx.getImageData(0, 0, width * dpr, height * dpr)
      const pixels = imageData.data
      
      ctx.clearRect(0, 0, width, height)
      ctx.restore()

      // Sample pixels to create particles
      const gap = Math.max(4, Math.floor(width / 200))
      for (let y = 0; y < height * dpr; y += gap * dpr) {
        for (let x = 0; x < width * dpr; x += gap * dpr) {
          const index = (y * width * dpr + x) * 4
          const alpha = pixels[index + 3]
          
          if (alpha > 128) {
            const px = x / dpr
            const py = y / dpr
            particlesRef.current.push({
              x: Math.random() * width,
              y: Math.random() * height,
              targetX: px,
              targetY: py,
              originX: px,
              originY: py,
              vx: 0,
              vy: 0,
              size: 1.5 + Math.random() * 2,
              hue: 280 + Math.random() * 80,
              isText: true,
            })
          }
        }
      }

      // Add ambient particles
      const ambientCount = Math.min(100, Math.floor((width * height) / 15000))
      for (let i = 0; i < ambientCount; i++) {
        const x = Math.random() * width
        const y = Math.random() * height
        particlesRef.current.push({
          x,
          y,
          targetX: x,
          targetY: y,
          originX: x,
          originY: y,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: 1 + Math.random() * 2,
          hue: Math.random() * 360,
          isText: false,
        })
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX
      mouseRef.current.y = e.clientY
    }

    const handleMouseDown = () => {
      mouseRef.current.isPressed = true
      setIsExploded(true)
    }

    const handleMouseUp = () => {
      mouseRef.current.isPressed = false
      setTimeout(() => setIsExploded(false), 100)
    }

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouseRef.current.x = e.touches[0].clientX
        mouseRef.current.y = e.touches[0].clientY
        mouseRef.current.isPressed = true
        setIsExploded(true)
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouseRef.current.x = e.touches[0].clientX
        mouseRef.current.y = e.touches[0].clientY
      }
    }

    const handleTouchEnd = () => {
      mouseRef.current.isPressed = false
      setTimeout(() => setIsExploded(false), 100)
    }

    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)
    window.addEventListener('touchstart', handleTouchStart)
    window.addEventListener('touchmove', handleTouchMove)
    window.addEventListener('touchend', handleTouchEnd)

    resize()

    // Animation loop
    const animate = () => {
      ctx.fillStyle = 'rgba(15, 15, 20, 0.15)'
      ctx.fillRect(0, 0, width, height)

      const mouseX = mouseRef.current.x
      const mouseY = mouseRef.current.y
      const isPressed = mouseRef.current.isPressed

      particlesRef.current.forEach((p) => {
        if (p.isText) {
          // Text particles behavior
          const dx = mouseX - p.x
          const dy = mouseY - p.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          const maxDist = isPressed ? 250 : 150

          if (distance < maxDist) {
            // Repel from mouse
            const force = (maxDist - distance) / maxDist
            const angle = Math.atan2(dy, dx)
            const repelStrength = isPressed ? 15 : 5
            p.vx -= Math.cos(angle) * force * repelStrength
            p.vy -= Math.sin(angle) * force * repelStrength
          }

          // Return to origin
          const returnForce = 0.03
          p.vx += (p.originX - p.x) * returnForce
          p.vy += (p.originY - p.y) * returnForce

          // Apply velocity with damping
          p.vx *= 0.92
          p.vy *= 0.92
          p.x += p.vx
          p.y += p.vy

          // Draw text particle
          const distFromOrigin = Math.sqrt(
            Math.pow(p.x - p.originX, 2) + Math.pow(p.y - p.originY, 2)
          )
          const alpha = Math.max(0.3, 1 - distFromOrigin / 300)
          
          ctx.beginPath()
          ctx.fillStyle = `hsla(${p.hue}, 70%, 75%, ${alpha})`
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
          ctx.fill()

          // Glow effect
          const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 4)
          gradient.addColorStop(0, `hsla(${p.hue}, 80%, 70%, ${alpha * 0.3})`)
          gradient.addColorStop(1, `hsla(${p.hue}, 80%, 70%, 0)`)
          ctx.beginPath()
          ctx.fillStyle = gradient
          ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2)
          ctx.fill()
        } else {
          // Ambient particles - float around
          p.x += p.vx
          p.y += p.vy

          // Bounce off edges
          if (p.x < 0 || p.x > width) p.vx *= -1
          if (p.y < 0 || p.y > height) p.vy *= -1

          // Slowly shift hue
          p.hue = (p.hue + 0.1) % 360

          // Draw ambient particle
          ctx.beginPath()
          ctx.fillStyle = `hsla(${p.hue}, 60%, 70%, 0.4)`
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
          ctx.fill()
        }
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleTouchEnd)
      cancelAnimationFrame(animationRef.current)
    }
  }, [])

  // Glitch effect for text
  useEffect(() => {
    const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?/\\~`'
    let interval: NodeJS.Timeout

    const glitch = () => {
      if (Math.random() > 0.95) {
        const chars = '404'.split('')
        const glitchedIndex = Math.floor(Math.random() * chars.length)
        chars[glitchedIndex] = glitchChars[Math.floor(Math.random() * glitchChars.length)]
        setGlitchText(chars.join(''))
        setTimeout(() => setGlitchText('404'), 50)
      }
    }

    interval = setInterval(glitch, 100)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0f0f14]">
      {/* Gradient overlay */}
      <div 
        className="absolute inset-0 opacity-60"
        style={{
          background: 'radial-gradient(ellipse at 30% 20%, oklch(0.35 0.15 280) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, oklch(0.3 0.12 330) 0%, transparent 50%)',
        }}
      />

      {/* Interactive canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 cursor-crosshair"
      />

      {/* Content overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 pointer-events-none">
        {/* Glitch text overlay (hidden visually, for screen readers) */}
        <h1 className="sr-only">404 - ページが見つかりません</h1>

        {/* Decorative glitch text */}
        <div className="relative mb-8">
          <span 
            className="text-[12vw] md:text-[10vw] font-bold text-transparent opacity-10 select-none"
            style={{
              WebkitTextStroke: '1px rgba(255,255,255,0.1)',
            }}
            aria-hidden="true"
          >
            {glitchText}
          </span>
          
          {/* Glitch layers */}
          <span 
            className="absolute inset-0 text-[12vw] md:text-[10vw] font-bold text-transparent opacity-20 select-none animate-pulse"
            style={{
              WebkitTextStroke: '1px rgba(139, 92, 246, 0.3)',
              transform: isExploded ? 'translate(-3px, -2px)' : 'none',
              transition: 'transform 0.1s',
            }}
            aria-hidden="true"
          >
            {glitchText}
          </span>
          <span 
            className="absolute inset-0 text-[12vw] md:text-[10vw] font-bold text-transparent opacity-20 select-none"
            style={{
              WebkitTextStroke: '1px rgba(236, 72, 153, 0.3)',
              transform: isExploded ? 'translate(3px, 2px)' : 'none',
              transition: 'transform 0.1s',
            }}
            aria-hidden="true"
          >
            {glitchText}
          </span>
        </div>

        {/* Message */}
        <div className="text-center mb-12">
          <p className="text-white/80 text-lg md:text-xl mb-2 font-light tracking-wide">
            迷子になってしまいました
          </p>
          <p className="text-white/50 text-sm md:text-base text-balance">
            お探しのページは存在しないか、移動した可能性があります。
          </p>
        </div>

        {/* Instruction */}
        <p className="text-white/30 text-xs md:text-sm mb-8 animate-pulse">
          画面をクリック or タップして遊んでみてください
        </p>

        {/* Navigation buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 pointer-events-auto">
          <Link
            href="/"
            className="group flex items-center gap-3 px-8 py-4 bg-white text-[#0f0f14] rounded-full font-medium hover:bg-white/90 transition-all duration-300"
          >
            <Home size={18} />
            <span>ホームに戻る</span>
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="group flex items-center gap-3 px-8 py-4 border border-white/30 text-white rounded-full font-medium hover:bg-white hover:text-[#0f0f14] transition-all duration-300"
          >
            <ArrowLeft size={18} />
            <span>前のページに戻る</span>
          </button>
        </div>
      </div>

      {/* Scan lines effect */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)',
        }}
        aria-hidden="true"
      />

      {/* Corner decorations */}
      <div className="absolute top-8 left-8 text-white/20 text-xs font-mono tracking-widest">
        ERROR_404
      </div>
      <div className="absolute top-8 right-8 text-white/20 text-xs font-mono tracking-widest">
        PAGE_NOT_FOUND
      </div>
      <div className="absolute bottom-8 left-8 text-white/20 text-xs font-mono">
        {new Date().toISOString().split('T')[0]}
      </div>
      <div className="absolute bottom-8 right-8 text-white/20 text-xs font-mono">
        JUNKBRANDING.COM
      </div>
    </div>
  )
}
