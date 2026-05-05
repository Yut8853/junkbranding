'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useIsMobile } from '@/hooks/use-mobile'

type Orb = {
  id: number
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
  const pathname = usePathname()
  // TOPページでは2個、下層ページでは1個
  const orbCount = pathname === '/' ? 2 : 1
  const containerRef = useRef<HTMLDivElement>(null)
  const orbsRef = useRef<Orb[]>([])
  const animationRef = useRef<number>(0)
  const [orbs, setOrbs] = useState<Orb[]>([])
  const [logoActivated, setLogoActivated] = useState(false)
  const [hasScrolled, setHasScrolled] = useState(false)
  const isMobile = useIsMobile()

  // Detect first scroll to show orbs
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

  // Apply rainbow gradient to logo when all orbs are absorbed
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

    // Initialize orbs - starts hidden at bottom
    const initialOrbs: Orb[] = []
    for (let i = 0; i < orbCount; i++) {
      initialOrbs.push({
        id: i,
        x: 20 + (i * 30) + Math.random() * 20, // 左右に分散
        y: 115,
        vx: 0,
        vy: 0,
        hue: (i * 180 + Math.random() * 60) % 360, // 色相をずらす
        size: 32,
        phase: 'hidden',
        targetX: 50,
        targetY: 115,
      })
    }
    orbsRef.current = initialOrbs
    setOrbs(initialOrbs)

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

      if (orbsRef.current.length === 0) {
        animationRef.current = requestAnimationFrame(animate)
        return
      }

      const time = currentTime * 0.001

      // Check if footer logo is visible and get its position
      const logo = document.getElementById('footer-logo')
      let logoRect: DOMRect | null = null
      if (logo) {
        logoRect = logo.getBoundingClientRect()
      }

      let allAbsorbed = true
      const updatedOrbs = orbsRef.current.map((currentOrb, index) => {
        let newX = currentOrb.x
        let newY = currentOrb.y
        let newVx = currentOrb.vx
        let newVy = currentOrb.vy
        let newPhase = currentOrb.phase
        let targetX = currentOrb.targetX
        let targetY = currentOrb.targetY

        if (currentOrb.phase !== 'absorbed') {
          allAbsorbed = false
        }

        if (currentOrb.phase === 'hidden') {
          // Stay hidden until scroll triggers
        } else if (currentOrb.phase === 'floating') {
          // Physics-based floating with noise
          const dt = deltaTime * 0.001

          // Random force using noise (creates organic wandering) - use different seeds for each orb
          const noiseX = noise(time * 0.4, index * 100) * 12
          const noiseY = noise(time * 0.35, index * 100 + 50) * 8

          // Gentle upward drift force (stronger at start)
          const upwardForce = currentOrb.y > 50 ? -15 : -2

          // Boundary forces (soft walls) - slightly different bounds for each orb
          const leftBound = 15 + index * 5
          const rightBound = 85 - index * 5
          const boundaryForceX = currentOrb.x < leftBound ? (leftBound - currentOrb.x) * 0.5 :
                                 currentOrb.x > rightBound ? (rightBound - currentOrb.x) * 0.5 : 0
          const boundaryForceY = currentOrb.y < 25 ? (25 - currentOrb.y) * 0.3 :
                                 currentOrb.y > 85 ? (85 - currentOrb.y) * 0.3 : 0

          // Apply forces to velocity with damping
          newVx = currentOrb.vx * 0.98 + (noiseX + boundaryForceX) * dt
          newVy = currentOrb.vy * 0.98 + (noiseY + upwardForce + boundaryForceY) * dt

          // Clamp velocity
          const maxVel = 1.5
          newVx = Math.max(-maxVel, Math.min(maxVel, newVx))
          newVy = Math.max(-maxVel, Math.min(maxVel, newVy))

          // Update position
          newX = currentOrb.x + newVx
          newY = currentOrb.y + newVy

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

          // Spiral/wobble effect using noise - different phase offset for each orb
          const spiralPhase = time * 3 + index * Math.PI
          const spiralRadius = Math.max(0, distance * 0.15)
          const spiralX = Math.cos(spiralPhase) * spiralRadius
          const spiralY = Math.sin(spiralPhase) * spiralRadius

          // Apply attraction with spiral
          newVx = currentOrb.vx * 0.92 + dx * attractionStrength
          newVy = currentOrb.vy * 0.92 + dy * attractionStrength

          newX = currentOrb.x + newVx + spiralX * 0.05
          newY = currentOrb.y + newVy + spiralY * 0.05

          // Check if close enough to be absorbed
          if (distance < 2) {
            newPhase = 'absorbed'
          }
        } else if (currentOrb.phase === 'absorbed') {
          // Stay at logo position
          if (logoRect) {
            newX = ((logoRect.left + logoRect.width / 2) / window.innerWidth) * 100
            newY = ((logoRect.top + logoRect.height / 2) / window.innerHeight) * 100
          }
        }

        // Rainbow color cycling - different speed for each orb
        const newHue = (currentOrb.hue + deltaTime * (0.02 + index * 0.01)) % 360

        return {
          ...currentOrb,
          x: newX,
          y: newY,
          vx: newVx,
          vy: newVy,
          hue: newHue,
          phase: newPhase,
          targetX,
          targetY,
        }
      })

      // Check if all orbs are absorbed to activate logo
      if (allAbsorbed && updatedOrbs.length > 0 && updatedOrbs.every(o => o.phase === 'absorbed')) {
        setLogoActivated(true)
      }

      orbsRef.current = updatedOrbs
      setOrbs([...updatedOrbs])
      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animationRef.current)
    }
  }, [isMobile, orbCount])

  // Trigger floating phase when user scrolls
  useEffect(() => {
    if (hasScrolled && orbsRef.current.length > 0) {
      const hasHiddenOrbs = orbsRef.current.some(o => o.phase === 'hidden')
      if (hasHiddenOrbs) {
        orbsRef.current = orbsRef.current.map(orb => ({
          ...orb,
          phase: orb.phase === 'hidden' ? 'floating' : orb.phase,
        }))
        setOrbs([...orbsRef.current])
      }
    }
  }, [hasScrolled])

  if (isMobile || orbs.length === 0) return null

  // Filter out hidden and absorbed orbs
  const visibleOrbs = orbs.filter(orb => orb.phase !== 'hidden' && orb.phase !== 'absorbed')

  if (visibleOrbs.length === 0) return null

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

      {/* Render each visible orb */}
      {visibleOrbs.map((orb) => (
        <div
          key={orb.id}
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
      ))}
    </div>
  )
}
