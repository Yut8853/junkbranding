'use client'

import { useEffect, useState, useRef } from 'react'

interface LoadingScreenProps {
  progress: number
}

export function LoadingScreen({ progress }: LoadingScreenProps) {
  const [displayProgress, setDisplayProgress] = useState(0)
  const [phase, setPhase] = useState<'loading' | 'complete' | 'exit'>('loading')
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)

  // Smooth progress counter
  useEffect(() => {
    const animate = () => {
      setDisplayProgress(prev => {
        const diff = progress - prev
        const step = diff * 0.08
        if (Math.abs(diff) < 0.5) return progress
        return prev + step
      })
      animationRef.current = requestAnimationFrame(animate)
    }
    animationRef.current = requestAnimationFrame(animate)
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [progress])

  // Phase transitions
  useEffect(() => {
    if (progress >= 100) {
      const completeTimer = setTimeout(() => setPhase('complete'), 200)
      const exitTimer = setTimeout(() => setPhase('exit'), 800)
      return () => {
        clearTimeout(completeTimer)
        clearTimeout(exitTimer)
      }
    }
  }, [progress])

  // Particle animation
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const particles: Array<{
      x: number
      y: number
      vx: number
      vy: number
      size: number
      hue: number
      alpha: number
      life: number
    }> = []

    const createParticle = () => {
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      const angle = Math.random() * Math.PI * 2
      const distance = 50 + Math.random() * 100
      
      return {
        x: centerX + Math.cos(angle) * distance,
        y: centerY + Math.sin(angle) * distance,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        size: 2 + Math.random() * 4,
        hue: 280 + Math.random() * 100,
        alpha: 0.6 + Math.random() * 0.4,
        life: 1,
      }
    }

    // Initialize particles
    for (let i = 0; i < 50; i++) {
      particles.push(createParticle())
    }

    let rafId: number
    const animate = () => {
      ctx.fillStyle = 'rgba(252, 250, 255, 0.1)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      particles.forEach((p, i) => {
        p.x += p.vx
        p.y += p.vy
        p.life -= 0.005
        p.alpha = p.life * 0.6

        if (p.life <= 0) {
          particles[i] = createParticle()
        }

        ctx.beginPath()
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size)
        gradient.addColorStop(0, `hsla(${p.hue}, 70%, 60%, ${p.alpha})`)
        gradient.addColorStop(1, `hsla(${p.hue}, 70%, 60%, 0)`)
        ctx.fillStyle = gradient
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
      })

      rafId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, oklch(0.99 0.01 280), oklch(0.97 0.02 330), oklch(0.98 0.015 25))',
        opacity: phase === 'exit' ? 0 : 1,
        transform: phase === 'exit' ? 'scale(1.1)' : 'scale(1)',
        transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        pointerEvents: phase === 'exit' ? 'none' : 'auto',
      }}
      role="progressbar"
      aria-valuenow={Math.round(displayProgress)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <canvas 
        ref={canvasRef}
        className="absolute inset-0 opacity-60"
      />

      {/* Gradient orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full blur-[120px] opacity-30 animate-spin"
          style={{
            background: 'conic-gradient(from 0deg, oklch(0.8 0.15 330), oklch(0.85 0.12 25), oklch(0.8 0.15 80), oklch(0.8 0.15 330))',
            animationDuration: '10s',
          }}
        />
        <div 
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full blur-[100px] opacity-25 animate-spin-reverse"
          style={{
            background: 'conic-gradient(from 180deg, oklch(0.75 0.18 220), oklch(0.8 0.15 280), oklch(0.85 0.12 330), oklch(0.75 0.18 220))',
            animationDuration: '8s',
          }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center gap-16">
        {/* Logo with morph animation */}
        <div className="relative">
          <h1 
            className="text-6xl md:text-8xl font-bold tracking-tighter"
            style={{ fontFamily: 'var(--font-syne)' }}
          >
            {'JunkBranding'.split('').map((char, i) => (
              <span
                key={i}
                className="inline-block"
                style={{
                  animationName: 'morphFloat',
                  animationDuration: '3s',
                  animationTimingFunction: 'ease-in-out',
                  animationIterationCount: 'infinite',
                  animationDelay: `${i * 0.15}s`,
                  background: `linear-gradient(135deg, oklch(0.55 0.2 ${280 + i * 30}), oklch(0.6 0.18 ${310 + i * 30}))`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {char}
              </span>
            ))}
          </h1>
          
          {/* Progress line under logo */}
          <div className="absolute -bottom-4 left-0 right-0 h-[3px] overflow-hidden rounded-full bg-foreground/10">
            <div 
              className="h-full rounded-full"
              style={{
                width: `${displayProgress}%`,
                background: 'linear-gradient(90deg, oklch(0.6 0.2 280), oklch(0.65 0.18 330), oklch(0.7 0.15 25), oklch(0.65 0.18 80))',
                transition: 'width 0.1s ease-out',
                boxShadow: '0 0 20px oklch(0.6 0.2 280 / 0.5)',
              }}
            />
          </div>
        </div>

        {/* Circular progress */}
        <div className="relative w-32 h-32">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              className="text-foreground/10"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="url(#progressGradient)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray={`${displayProgress * 2.83} 283`}
              style={{
                transition: 'stroke-dasharray 0.1s ease-out',
                filter: 'drop-shadow(0 0 8px oklch(0.6 0.2 280 / 0.5))',
              }}
            />
            <defs>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="oklch(0.6 0.2 280)" />
                <stop offset="50%" stopColor="oklch(0.65 0.18 330)" />
                <stop offset="100%" stopColor="oklch(0.7 0.15 25)" />
              </linearGradient>
            </defs>
          </svg>
          
          {/* Percentage in center */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-mono font-medium tabular-nums">
              {Math.round(displayProgress)}
            </span>
          </div>
        </div>

        {/* Status text */}
        <div className="flex flex-col items-center gap-2">
          <p 
            className="text-sm uppercase tracking-[0.3em] text-muted-foreground animate-pulse"
          >
            {displayProgress < 30 && '読み込み中 ...'}
            {displayProgress >= 30 && displayProgress < 60 && 'ようこそ ...'}
            {displayProgress >= 60 && displayProgress < 90 && 'もう少しだけ ...'}
            {displayProgress >= 90 && displayProgress < 100 && 'お待たせしました'}
          </p>
        </div>
      </div>

      {/* Corner elements */}
      <div className="absolute top-8 left-8 flex gap-2">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full"
            style={{
              background: `oklch(0.6 0.15 ${280 + i * 40})`,
              animationName: 'bounce',
              animationDuration: '1s',
              animationTimingFunction: 'ease-in-out',
              animationIterationCount: 'infinite',
              animationDelay: `${i * 0.15}s`,
            }}
          />
        ))}
      </div>

      
    </div>
  )
}
