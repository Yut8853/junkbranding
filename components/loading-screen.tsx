'use client'

import { useEffect, useState, useRef } from 'react'

interface LoadingScreenProps {
  progress: number
  canSelectAudio: boolean
  audioChoice: 'sound-on' | 'sound-off' | null
  onSelectAudio: (withSound: boolean) => void
}

export function LoadingScreen({ progress, canSelectAudio, audioChoice, onSelectAudio }: LoadingScreenProps) {
  const [displayProgress, setDisplayProgress] = useState(0)
  const [phase, setPhase] = useState<'loading' | 'complete' | 'exit'>('loading')
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
    if (progress >= 100 && audioChoice) {
      const completeTimer = setTimeout(() => setPhase('complete'), 200)
      const exitTimer = setTimeout(() => setPhase('exit'), 800)
      return () => {
        clearTimeout(completeTimer)
        clearTimeout(exitTimer)
      }
    }
  }, [audioChoice, progress])

  const progressValue = Math.min(100, Math.max(0, Math.round(displayProgress)))

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden overscroll-none"
      style={{
        touchAction: 'none',
        background: 'oklch(0.12 0.02 280)',
        opacity: phase === 'exit' ? 0 : 1,
        transform: phase === 'exit' ? 'scale(1.1)' : 'scale(1)',
        transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        pointerEvents: phase === 'exit' ? 'none' : 'auto',
      }}
      aria-label="Loading screen"
    >
      {/* Gradient orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full blur-[120px] opacity-30 animate-spin"
          style={{
            background: 'conic-gradient(from 0deg, hsl(350, 65%, 72%), hsl(25, 70%, 72%), hsl(95, 45%, 65%), hsl(200, 60%, 72%), hsl(280, 50%, 72%), hsl(350, 65%, 72%))',
            animationDuration: '10s',
          }}
        />
        <div 
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full blur-[100px] opacity-25 animate-spin-reverse"
          style={{
            background: 'conic-gradient(from 180deg, hsl(175, 50%, 65%), hsl(240, 55%, 75%), hsl(320, 60%, 72%), hsl(50, 65%, 70%), hsl(175, 50%, 65%))',
            animationDuration: '8s',
          }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex w-full max-w-5xl flex-col items-center gap-10 px-6 pb-20 sm:gap-14">
        {/* Logo with morph animation */}
        <div className="relative w-full">
          <h1 className="text-center text-[clamp(3.8rem,12vw,9rem)] font-normal tracking-[0.02em] uppercase font-display drop-shadow-[0_10px_35px_rgba(255,255,255,0.08)]">
            {'JUNKBRANDING'.split('').map((char, i) => (
              <span
                key={i}
                className="inline-block gradient-text-soft"
                style={{
                  animationName: 'morphFloat, rainbow-flow',
                  animationDuration: '3s, 8s',
                  animationTimingFunction: 'ease-in-out, linear',
                  animationIterationCount: 'infinite',
                  animationDelay: `${i * 0.15}s, 0s`,
                }}
              >
                {char}
              </span>
            ))}
          </h1>
        </div>

        <div className="flex flex-col items-center gap-4 text-center">
          <p className="text-xs font-medium uppercase tracking-[0.38em] text-white/50">
            Sound Select
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => canSelectAudio && onSelectAudio(true)}
              disabled={!canSelectAudio || audioChoice !== null}
              className="group relative overflow-hidden rounded-full px-8 py-4 text-sm font-bold uppercase tracking-[0.25em] text-white shadow-[0_18px_50px_rgba(120,60,255,0.32)] transition-transform duration-300 hover:scale-105 disabled:cursor-default disabled:opacity-80 disabled:hover:scale-100"
              style={{
                background: 'linear-gradient(90deg, hsl(350, 65%, 72%), hsl(25, 70%, 72%), hsl(50, 65%, 70%), hsl(95, 45%, 65%), hsl(175, 50%, 65%), hsl(200, 60%, 72%), hsl(240, 55%, 75%), hsl(280, 50%, 72%), hsl(320, 60%, 72%))',
                backgroundSize: '300% 100%',
                animation: 'rainbow-flow 4s linear infinite',
              }}
            >
              <span className="relative z-10">
                {audioChoice === 'sound-on' ? 'Music On' : canSelectAudio ? 'Start With Music' : 'Loading Assets'}
              </span>
              <span className="absolute inset-0 bg-white/0 transition-colors group-hover:bg-white/15" />
            </button>
            <button
              type="button"
              onClick={() => canSelectAudio && onSelectAudio(false)}
              disabled={!canSelectAudio || audioChoice !== null}
              className="rounded-full border border-white/30 bg-white/10 px-8 py-4 text-sm font-bold uppercase tracking-[0.25em] text-white shadow-[0_18px_45px_rgba(255,255,255,0.08)] backdrop-blur-xl transition-transform duration-300 hover:scale-105 hover:bg-white/20 disabled:cursor-default disabled:opacity-70 disabled:hover:scale-100"
            >
              {audioChoice === 'sound-off' ? 'Silent Start' : canSelectAudio ? 'Start Silent' : 'Please Wait'}
            </button>
          </div>
        </div>

        {/* Status text */}
        <div className="flex flex-col items-center gap-2">
          <p 
            className="text-sm uppercase tracking-[0.3em] text-white/55 animate-pulse"
          >
            {displayProgress < 30 && 'Loading assets ...'}
            {displayProgress >= 30 && displayProgress < 60 && 'Preparing experience ...'}
            {displayProgress >= 60 && displayProgress < 90 && 'Warming up pages ...'}
            {displayProgress >= 90 && displayProgress < 100 && 'Almost ready'}
            {displayProgress >= 100 && !canSelectAudio && 'Finalizing ...'}
            {displayProgress >= 100 && canSelectAudio && !audioChoice && 'Choose your sound'}
            {displayProgress >= 100 && audioChoice && phase !== 'exit' && 'Starting'}
          </p>
        </div>
      </div>

      <div className="absolute bottom-8 right-6 z-20 font-display text-[clamp(4rem,12vw,10rem)] leading-none tracking-tight text-white/12 md:right-10">
        {progressValue}
        <span className="ml-2 text-[0.38em] text-white/18">%</span>
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 z-20 h-2 bg-white/10"
        role="progressbar"
        aria-valuenow={progressValue}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full"
          style={{
            width: `${progressValue}%`,
            background: 'linear-gradient(90deg, hsl(350, 65%, 72%), hsl(25, 70%, 72%), hsl(50, 65%, 70%), hsl(95, 45%, 65%), hsl(175, 50%, 65%), hsl(200, 60%, 72%), hsl(240, 55%, 75%), hsl(280, 50%, 72%), hsl(320, 60%, 72%))',
            backgroundSize: '300% 100%',
            animation: 'rainbow-flow 4s linear infinite',
            boxShadow: '0 -6px 28px rgba(255,255,255,0.22)',
            transition: 'width 0.1s ease-out',
          }}
        />
      </div>

      
    </div>
  )
}
