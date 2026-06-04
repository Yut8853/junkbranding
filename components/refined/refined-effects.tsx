'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'

// Subtle refraction light layer for refined mode backgrounds
export function RefractionLightLayer({ intensity = 0.3 }: { intensity?: number }) {
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 })
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      })
    }
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Subtle caustics effect */}
      <motion.div
        className="absolute w-[150%] h-[150%] -left-[25%] -top-[25%]"
        animate={{
          x: (mousePos.x - 0.5) * 30,
          y: (mousePos.y - 0.5) * 30,
        }}
        transition={{ type: 'spring', damping: 30, stiffness: 100 }}
        style={{
          background: `
            radial-gradient(ellipse 40% 30% at 30% 40%, rgba(200, 220, 255, ${intensity}), transparent 50%),
            radial-gradient(ellipse 35% 25% at 70% 60%, rgba(180, 200, 240, ${intensity * 0.8}), transparent 45%),
            radial-gradient(ellipse 30% 20% at 50% 80%, rgba(220, 200, 255, ${intensity * 0.6}), transparent 40%)
          `,
        }}
      />
      
      {/* Glass edge highlight */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(135deg, 
              rgba(255, 255, 255, ${intensity * 0.5}) 0%, 
              transparent 30%,
              transparent 70%,
              rgba(200, 220, 255, ${intensity * 0.3}) 100%
            )
          `,
        }}
      />
    </div>
  )
}

// Glass card component for refined mode
export function GlassCard({
  children,
  className = '',
  hover = true,
}: {
  children: React.ReactNode
  className?: string
  hover?: boolean
}) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      className={`relative rounded-2xl bg-white/60 backdrop-blur-xl border border-slate-200/50 overflow-hidden ${className}`}
      onMouseEnter={() => hover && setIsHovered(true)}
      onMouseLeave={() => hover && setIsHovered(false)}
      animate={{
        y: isHovered ? -4 : 0,
        boxShadow: isHovered
          ? '0 20px 50px -15px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(200, 220, 255, 0.2)'
          : '0 8px 30px -10px rgba(0, 0, 0, 0.08)',
      }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Subtle prism reflection on hover */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.4 }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(135deg, 
                rgba(255, 255, 255, 0.4) 0%,
                transparent 30%
              )
            `,
          }}
        />
        <motion.div
          className="absolute h-[200%] w-24 -skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          initial={{ left: '-20%' }}
          animate={{ left: isHovered ? '120%' : '-20%' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        />
      </motion.div>
      
      <div className="relative z-10">{children}</div>
    </motion.div>
  )
}

// Refined background with subtle scroll-based light refraction
export function RefinedBackground() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll()
  
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100])
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -150])
  const opacity1 = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.3, 0.5, 0.4, 0.2])
  const opacity2 = useTransform(scrollYProgress, [0, 0.5, 1], [0.2, 0.4, 0.3])

  return (
    <div ref={ref} className="fixed inset-0 -z-10 overflow-hidden">
      {/* Base gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 30%, #f1f5f9 70%, #e2e8f0 100%)',
        }}
      />

      {/* Floating refraction orbs */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full"
        style={{
          y: y1,
          opacity: opacity1,
          left: '10%',
          top: '20%',
          background: `
            radial-gradient(circle, 
              rgba(200, 220, 255, 0.4) 0%, 
              rgba(180, 200, 240, 0.2) 40%,
              transparent 70%
            )
          `,
          filter: 'blur(40px)',
        }}
      />
      
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full"
        style={{
          y: y2,
          opacity: opacity2,
          right: '5%',
          top: '50%',
          background: `
            radial-gradient(circle, 
              rgba(220, 200, 255, 0.35) 0%, 
              rgba(200, 180, 240, 0.15) 40%,
              transparent 70%
            )
          `,
          filter: 'blur(50px)',
        }}
      />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 0, 0, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Noise texture */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  )
}

// Scroll-triggered micro glitch effect (very subtle)
export function MicroGlitch({
  children,
  className = '',
  triggerOnHover = false,
}: {
  children: React.ReactNode
  className?: string
  triggerOnHover?: boolean
}) {
  const [isGlitching, setIsGlitching] = useState(false)

  const triggerGlitch = () => {
    if (isGlitching) return
    setIsGlitching(true)
    setTimeout(() => setIsGlitching(false), 150)
  }

  return (
    <motion.span
      className={`relative inline-block ${className}`}
      onMouseEnter={triggerOnHover ? triggerGlitch : undefined}
      onClick={triggerGlitch}
      animate={isGlitching ? {
        x: [0, -1, 1, 0],
        filter: [
          'none',
          'drop-shadow(1px 0 0 rgba(100, 200, 255, 0.3)) drop-shadow(-1px 0 0 rgba(255, 100, 150, 0.3))',
          'none',
        ],
      } : {}}
      transition={{ duration: 0.15 }}
    >
      {children}
    </motion.span>
  )
}

// Animated section reveal
export function RefinedReveal({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
        }
      },
      { threshold: 0.1, rootMargin: '-50px' }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  )
}
