'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useMode, type DesignMode } from '@/contexts/mode-context'
import { modeSelectContent } from '@/content/shared-content'

// Prism/Refraction light effect for refined card
function RefractionLight({ isHovered }: { isHovered: boolean }) {
  return (
    <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
      {/* Subtle caustics layer */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 0.6 : 0.2 }}
        transition={{ duration: 0.6 }}
        style={{
          background: `
            radial-gradient(ellipse 60% 40% at 30% 20%, rgba(200, 220, 255, 0.15), transparent 50%),
            radial-gradient(ellipse 50% 30% at 70% 80%, rgba(180, 200, 255, 0.1), transparent 40%)
          `,
        }}
      />
      {/* Prism light band */}
      <motion.div
        className="absolute h-[200%] w-32 -skew-x-12"
        initial={{ left: '-20%', opacity: 0 }}
        animate={{
          left: isHovered ? '120%' : '-20%',
          opacity: isHovered ? 0.5 : 0,
        }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), rgba(200,220,255,0.2), transparent)',
        }}
      />
    </div>
  )
}

// Glitch effect for experimental card
function GlitchEffect({ isHovered }: { isHovered: boolean }) {
  const [glitchFrame, setGlitchFrame] = useState(0)

  useEffect(() => {
    if (!isHovered) return
    const interval = setInterval(() => {
      setGlitchFrame(f => (f + 1) % 3)
    }, 100)
    return () => clearInterval(interval)
  }, [isHovered])

  return (
    <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
      {/* RGB split layers */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 0.4 : 0 }}
        transition={{ duration: 0.3 }}
        style={{
          background: `
            linear-gradient(180deg, 
              rgba(255, 0, 100, ${glitchFrame === 0 ? 0.1 : 0.02}) 0%,
              rgba(0, 255, 200, ${glitchFrame === 1 ? 0.1 : 0.02}) 50%,
              rgba(100, 0, 255, ${glitchFrame === 2 ? 0.1 : 0.02}) 100%
            )
          `,
        }}
      />
      {/* Scanlines */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 0.15 : 0 }}
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,255,0.03) 2px, rgba(0,255,255,0.03) 4px)',
        }}
      />
      {/* Neon glow border */}
      <motion.div
        className="absolute inset-0 rounded-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{
          boxShadow: 'inset 0 0 30px rgba(0, 255, 255, 0.2), 0 0 40px rgba(255, 0, 255, 0.1)',
        }}
      />
    </div>
  )
}

// Mode card component
function ModeCard({
  mode,
  label,
  heading,
  description,
  cta,
  isRefined,
  onSelect,
}: {
  mode: DesignMode
  label: string
  heading: string
  description: string
  cta: string
  isRefined: boolean
  onSelect: (mode: DesignMode) => void
}) {
  const [isHovered, setIsHovered] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  
  const springConfig = { damping: 25, stiffness: 150 }
  const x = useSpring(mouseX, springConfig)
  const y = useSpring(mouseY, springConfig)
  
  const rotateX = useTransform(y, [-0.5, 0.5], [5, -5])
  const rotateY = useTransform(x, [-0.5, 0.5], [-5, 5])

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    mouseX.set((e.clientX - centerX) / rect.width)
    mouseY.set((e.clientY - centerY) / rect.height)
  }, [mouseX, mouseY])

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0)
    mouseY.set(0)
    setIsHovered(false)
  }, [mouseX, mouseY])

  const handleClick = useCallback(() => {
    onSelect(mode)
  }, [mode, onSelect])

  const baseClasses = isRefined
    ? 'bg-white/80 border-slate-200/60 text-slate-900'
    : 'bg-black/60 border-white/10 text-white'

  const hoverClasses = isRefined
    ? 'hover:border-slate-300/80 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)]'
    : 'hover:border-cyan-400/30 hover:shadow-[0_0_60px_-10px_rgba(0,255,255,0.3)]'

  return (
    <motion.div
      ref={cardRef}
      className={`relative flex flex-col p-8 md:p-10 lg:p-12 rounded-2xl border backdrop-blur-xl cursor-pointer ${baseClasses} ${hoverClasses}`}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        perspective: 1000,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: isRefined ? 0.2 : 0.4 }}
      whileTap={{ scale: 0.98 }}
    >
      {isRefined ? (
        <RefractionLight isHovered={isHovered} />
      ) : (
        <GlitchEffect isHovered={isHovered} />
      )}

      <div className="relative z-10 flex flex-col h-full">
        {/* Label */}
        <motion.span
          className={`inline-block self-start px-3 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase mb-6 ${
            isRefined
              ? 'bg-slate-100 text-slate-600'
              : 'bg-white/10 text-cyan-400'
          }`}
          animate={{
            boxShadow: isHovered && !isRefined
              ? '0 0 20px rgba(0, 255, 255, 0.3)'
              : 'none',
          }}
        >
          {label}
        </motion.span>

        {/* Heading */}
        <h3
          className={`text-2xl md:text-3xl lg:text-4xl font-bold mb-4 leading-tight ${
            isRefined ? 'text-slate-900' : 'text-white'
          }`}
          style={{
            textShadow: !isRefined && isHovered
              ? '0 0 30px rgba(255, 255, 255, 0.3)'
              : 'none',
          }}
        >
          {heading}
        </h3>

        {/* Description */}
        <p
          className={`text-base md:text-lg leading-relaxed mb-8 flex-grow ${
            isRefined ? 'text-slate-600' : 'text-white/70'
          }`}
        >
          {description}
        </p>

        {/* CTA Button */}
        <motion.button
          className={`group relative self-start px-8 py-4 rounded-full font-semibold text-sm tracking-wide transition-all duration-300 overflow-hidden ${
            isRefined
              ? 'bg-slate-900 text-white hover:bg-slate-800'
              : 'bg-white text-black hover:bg-cyan-400'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Light sweep effect */}
          <motion.span
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
            initial={{ x: '-100%' }}
            whileHover={{ x: '100%' }}
            transition={{ duration: 0.6 }}
          />
          <span className="relative z-10">{cta}</span>
        </motion.button>
      </div>
    </motion.div>
  )
}

// Background with dual atmosphere
function DualBackground() {
  return (
    <div className="fixed inset-0 -z-10">
      {/* Base gradient - split design */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(135deg, 
              #fafbfc 0%, 
              #f0f4f8 25%,
              #e8edf3 45%,
              #1a1a2e 55%,
              #0f0f1a 75%,
              #0a0a12 100%
            )
          `,
        }}
      />
      
      {/* Refined side - subtle prism */}
      <div
        className="absolute top-0 left-0 w-1/2 h-full"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 20% 30%, rgba(200, 220, 255, 0.2), transparent 50%),
            radial-gradient(ellipse 60% 40% at 80% 70%, rgba(180, 200, 240, 0.15), transparent 40%)
          `,
        }}
      />
      
      {/* Experimental side - neon glow */}
      <div
        className="absolute top-0 right-0 w-1/2 h-full"
        style={{
          background: `
            radial-gradient(ellipse 60% 50% at 80% 30%, rgba(0, 255, 255, 0.08), transparent 50%),
            radial-gradient(ellipse 50% 40% at 20% 70%, rgba(255, 0, 255, 0.06), transparent 40%)
          `,
        }}
      />

      {/* Subtle noise overlay */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  )
}

export function ModeSelect() {
  const { setMode } = useMode()
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  const handleSelectMode = useCallback((mode: DesignMode) => {
    console.log('[v0] handleSelectMode called with mode:', mode)
    setMode(mode)
  }, [setMode])

  return (
    <div className="min-h-svh flex flex-col items-center justify-center px-6 py-16 md:py-20">
      <DualBackground />

      {/* Header */}
      <motion.div
        className="text-center mb-12 md:mb-16 max-w-3xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight bg-gradient-to-r from-slate-800 via-slate-600 to-slate-400 bg-clip-text text-transparent">
          {modeSelectContent.title}
        </h1>
        <p className="text-base md:text-lg text-slate-500 leading-relaxed">
          {modeSelectContent.subtitle}
        </p>
      </motion.div>

      {/* Mode Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 w-full max-w-5xl">
        <ModeCard
          mode="refined"
          label={modeSelectContent.refinedCard.label}
          heading={modeSelectContent.refinedCard.heading}
          description={modeSelectContent.refinedCard.description}
          cta={modeSelectContent.refinedCard.cta}
          isRefined
          onSelect={handleSelectMode}
        />
        <ModeCard
          mode="experimental"
          label={modeSelectContent.experimentalCard.label}
          heading={modeSelectContent.experimentalCard.heading}
          description={modeSelectContent.experimentalCard.description}
          cta={modeSelectContent.experimentalCard.cta}
          isRefined={false}
          onSelect={handleSelectMode}
        />
      </div>

      {/* Recommendation hint */}
      <motion.p
        className="mt-8 text-sm text-slate-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        {!prefersReducedMotion && '* 両モードともスクロールに応じた演出を含みます'}
      </motion.p>
    </div>
  )
}
