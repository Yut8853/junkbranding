'use client'

import { useEffect, useRef, useState } from 'react'
import { useIsMobile } from '@/hooks/use-mobile'

type Orb = {
  x: number
  y: number
  vx: number // velocity x
  vy: number // velocity y
  hue: number
  size: number
  phase: 'hidden' | 'floating' | 'attracted' | 'absorbed'
  targetX: number
  targetY: number
}

export function RisingRainbowOrb() {
  const containerRef = useRef<HTMLDivElement>(null)
  const orbRef = useRef<Orb | null>(null)
  const animationRef = useRef<number>(0)
  const [orb, setOrb] = useState<Orb | null>(null)
  const [logoActivated, setLogoActivated] = useState(false)
  const [hasScrolled, setHasScrolled] = useState(false)
  const isMobile = useIsMobile()

  // Detect first scroll to show orb
  useEffect(() => {
    if (isMobile) return

    const handleScroll = () => {
      if (!hasScrolled && window.scrollY > 50) {
        setHasScrolled(true)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isMobile, hasScrolled])

  // Apply rainbow gradient to logo
  useEffect(() => {
    if (!logoActivated) return

    const logo = document.getElementById('footer-logo')
    if (logo) {
      logo.style.background = 'linear-gradient(90deg, oklch(0.75 0.2 0), oklch(0.75 0.2 60), oklch(0.75 0.2 120), oklch(0.75 0.2 180), oklch(0.75 0.2 240), oklch(0.75 0.2 300), oklch(0.75 0.2 360))'
      logo.style.backgroundSize = '200% 100%'
      logo.style.webkitBackgroundClip = 'text'
      logo.style.backgroundClip = 'text'
      logo.style.webkitTextFillColor = 'transparent'
      logo.style.animation = 'rainbow-flow 3s linear infinite'
    }
  }, [logoActivated])

  useEffect(() => {
    if (isMobile) return

    // Initialize single orb - starts hidden at bottom
    orbRef.current = {
      x: 30 + Math.random() * 40,
      y: 115,
      vx: 0,
      vy: 0,
      hue: Math.random() * 360,
      size: 32,
      phase: 'hidden',
      targetX: 50,
      targetY: 115,
    }
    setOrb(orbRef.current)

    let lastTime = performance.now()

    // Simplex-like noise using multiple sine waves
    const noise = (t: number, seed: number) => {
      return (
        Math.sin(t * 0.7 + seed) * 0.5 +
        Math.sin(t * 1.3 + seed * 2.1) * 0.3 +
        Math.sin(t * 2.1 + seed * 0.7) * 0.2
      )
    }

    const animate = (currentTime: number) => {
      const deltaTime = Math.min(currentTime - lastTime, 50)
      lastTime = currentTime

      if (!orbRef.current) {
        animationRef.current = requestAnimationFrame(animate)
        return
      }

      const currentOrb = orbRef.current
      const time = currentTime * 0.001

      let newX = currentOrb.x
      let newY = currentOrb.y
      let newPhase = currentOrb.phase
      let targetX = currentOrb.targetX
      let targetY = currentOrb.targetY

      // Check if footer logo is visible and get its position
      const logo = document.getElementById('footer-logo')
      let logoRect: DOMRect | null = null
      if (logo) {
        logoRect = logo.getBoundingClientRect()
      }

      if (currentOrb.phase === 'hidden') {
        // Stay hidden until scroll triggers
      } else if (currentOrb.phase === 'floating') {
        // Physics-based floating with noise
        const dt = deltaTime * 0.001

        // Random force using noise (creates organic wandering)
        const noiseX = noise(time * 0.4, 0) * 12
        const noiseY = noise(time * 0.35, 100) * 8

        // Gentle upward drift force (stronger at start)
        const upwardForce = currentOrb.y > 50 ? -15 : -2

        // Boundary forces (soft walls)
        const boundaryForceX = currentOrb.x < 20 ? (20 - currentOrb.x) * 0.5 :
                               currentOrb.x > 80 ? (80 - currentOrb.x) * 0.5 : 0
        const boundaryForceY = currentOrb.y < 25 ? (25 - currentOrb.y) * 0.3 :
                               currentOrb.y > 85 ? (85 - currentOrb.y) * 0.3 : 0

        // Apply forces to velocity with damping
        let newVx = currentOrb.vx * 0.98 + (noiseX + boundaryForceX) * dt
        let newVy = currentOrb.vy * 0.98 + (noiseY + upwardForce + boundaryForceY) * dt

        // Clamp velocity
        const maxVel = 1.5
        newVx = Math.max(-maxVel, Math.min(maxVel, newVx))
        newVy = Math.max(-maxVel, Math.min(maxVel, newVy))

        // Update position
        newX = currentOrb.x + newVx
        newY = currentOrb.y + newVy

        // Store velocity
        currentOrb.vx = newVx
        currentOrb.vy = newVy

        // Check if logo is visible after orb has risen enough
        if (currentOrb.y < 70 && logoRect) {
          const logoInView = logoRect.top < window.innerHeight && logoRect.bottom > 0
          if (logoInView) {
            newPhase = 'attracted'
            targetX = ((logoRect.left + logoRect.width / 2) / window.innerWidth) * 100
            targetY = ((logoRect.top + logoRect.height / 2) / window.innerHeight) * 100
          }
        }
      } else if (currentOrb.phase === 'attracted') {
        // Update target position in case of scroll
        if (logoRect) {
          targetX = ((logoRect.left + logoRect.width / 2) / window.innerWidth) * 100
          targetY = ((logoRect.top + logoRect.height / 2) / window.innerHeight) * 100
        }

        const dx = targetX - currentOrb.x
        const dy = targetY - currentOrb.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        // Acceleration towards target increases as we get closer
        const attractionStrength = 0.02 + (1 / (distance + 5)) * 0.08

        // Spiral/wobble effect using noise
        const spiralPhase = time * 3
        const spiralRadius = Math.max(0, distance * 0.15)
        const spiralX = Math.cos(spiralPhase) * spiralRadius
        const spiralY = Math.sin(spiralPhase) * spiralRadius

        // Apply attraction with spiral
        currentOrb.vx = currentOrb.vx * 0.92 + dx * attractionStrength
        currentOrb.vy = currentOrb.vy * 0.92 + dy * attractionStrength

        newX = currentOrb.x + currentOrb.vx + spiralX * 0.05
        newY = currentOrb.y + currentOrb.vy + spiralY * 0.05

        // Check if close enough to be absorbed
        if (distance < 2) {
          newPhase = 'absorbed'
          setLogoActivated(true)
        }
      } else if (currentOrb.phase === 'absorbed') {
        // Stay at logo position
        if (logoRect) {
          newX = ((logoRect.left + logoRect.width / 2) / window.innerWidth) * 100
          newY = ((logoRect.top + logoRect.height / 2) / window.innerHeight) * 100
        }
      }

      // Rainbow color cycling
      const newHue = (currentOrb.hue + deltaTime * 0.025) % 360

      orbRef.current = {
        ...currentOrb,
        x: newX,
        y: newY,
        vx: currentOrb.vx,
        vy: currentOrb.vy,
        hue: newHue,
        phase: newPhase,
        targetX,
        targetY,
      }

      setOrb({ ...orbRef.current })
      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animationRef.current)
    }
  }, [isMobile])

  // Trigger floating phase when user scrolls
  useEffect(() => {
    if (hasScrolled && orbRef.current && orbRef.current.phase === 'hidden') {
      orbRef.current.phase = 'floating'
      setOrb({ ...orbRef.current })
    }
  }, [hasScrolled])

  if (isMobile || !orb) return null

  // Don't render orb when hidden or after absorption
  if (orb.phase === 'hidden' || orb.phase === 'absorbed') return null

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[85] overflow-hidden"
    >
      {/* Rainbow animation keyframes */}
      <style jsx global>{`
        @keyframes rainbow-flow {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
      `}</style>

      {/* Main orb - soft ethereal glow */}
      <div
        className="absolute transition-transform duration-100"
        style={{
          left: `${orb.x}%`,
          top: `${orb.y}%`,
          transform: 'translate(-50%, -50%)',
          opacity: orb.phase === 'attracted' ? Math.max(0.3, 1 - (1 / (Math.sqrt((orb.targetX - orb.x) ** 2 + (orb.targetY - orb.y) ** 2) + 1)) * 0.7) : 1,
        }}
      >
        {/* Outermost atmospheric glow */}
        <div
          className="absolute rounded-full"
          style={{
            width: orb.size * 5,
            height: orb.size * 5,
            left: -orb.size * 2,
            top: -orb.size * 2,
            background: `radial-gradient(circle, oklch(0.85 0.18 ${orb.hue} / 0.12), oklch(0.8 0.15 ${(orb.hue + 40) % 360} / 0.06), transparent 70%)`,
            filter: 'blur(25px)',
          }}
        />

        {/* Middle glow layer */}
        <div
          className="absolute rounded-full"
          style={{
            width: orb.size * 3,
            height: orb.size * 3,
            left: -orb.size,
            top: -orb.size,
            background: `radial-gradient(circle, oklch(0.88 0.22 ${orb.hue} / 0.3), oklch(0.82 0.2 ${(orb.hue + 60) % 360} / 0.15), transparent 70%)`,
            filter: 'blur(15px)',
          }}
        />

        {/* Inner soft core */}
        <div
          className="relative rounded-full"
          style={{
            width: orb.size,
            height: orb.size,
            background: `radial-gradient(circle at 40% 35%, oklch(0.98 0.06 ${orb.hue} / 0.85), oklch(0.9 0.16 ${(orb.hue + 30) % 360} / 0.6), oklch(0.8 0.2 ${(orb.hue + 60) % 360} / 0.3), transparent 80%)`,
            filter: 'blur(6px)',
            boxShadow: `0 0 ${orb.size * 0.6}px oklch(0.85 0.2 ${orb.hue} / 0.4), 0 0 ${orb.size * 1.2}px oklch(0.8 0.18 ${(orb.hue + 40) % 360} / 0.25)`,
          }}
        />
      </div>
    </div>
  )
}
