'use client'

import { useEffect, useState, useRef } from 'react'
import type { LoadingScreenProps } from '@/types/component-props'

export function LoadingScreen({ progress, canSelectAudio, audioChoice, onSelectAudio }: LoadingScreenProps) {
  const [displayProgress, setDisplayProgress] = useState(0)
  const [phase, setPhase] = useState<'loading' | 'complete' | 'exit'>('loading')
  const animationRef = useRef<number>(0)

  // Smooth progress counter
  useEffect(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }

    const animate = () => {
      setDisplayProgress(prev => {
        const diff = progress - prev
        const step = diff * 0.08
        if (Math.abs(diff) < 0.5) {
          animationRef.current = 0
          return progress
        }

        animationRef.current = requestAnimationFrame(animate)
        return prev + step
      })
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
      role="dialog"
      aria-modal="true"
      aria-busy={phase !== 'exit'}
      aria-labelledby="loading-screen-title"
      aria-describedby="loading-screen-status loading-screen-progress-label"
    >
      {/* Gradient orbs */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
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
          <h1 id="loading-screen-title" className="text-center text-[clamp(3.8rem,12vw,9rem)] font-normal tracking-[0.02em] uppercase font-display drop-shadow-[0_10px_35px_rgba(255,255,255,0.08)]">
            <span className="gradient-text-soft">
              JUNKBRANDING
            </span>
          </h1>
        </div>

        <div className="flex flex-col items-center gap-4 text-center">
          <p className="text-xs font-medium uppercase tracking-[0.38em] text-white/50">
            Sound Select
          </p>
          <p id="loading-audio-help" className="sr-only">
            読み込み完了後に、音楽を再生して開始するか、無音で開始するかを選択できます。
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onPointerDown={() => canSelectAudio && onSelectAudio(true)}
              onClick={() => canSelectAudio && onSelectAudio(true)}
              disabled={!canSelectAudio || audioChoice !== null}
              aria-describedby="loading-audio-help"
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
              aria-describedby="loading-audio-help"
              className="rounded-full border border-white/30 bg-white/10 px-8 py-4 text-sm font-bold uppercase tracking-[0.25em] text-white shadow-[0_18px_45px_rgba(255,255,255,0.08)] backdrop-blur-xl transition-transform duration-300 hover:scale-105 hover:bg-white/20 disabled:cursor-default disabled:opacity-70 disabled:hover:scale-100"
            >
              {audioChoice === 'sound-off' ? 'Silent Start' : canSelectAudio ? 'Start Silent' : 'Please Wait'}
            </button>
          </div>
        </div>

        {/* Status text */}
        <div className="flex flex-col items-center gap-2">
          <p
            id="loading-screen-status"
            className="text-sm uppercase tracking-[0.3em] text-white/55 animate-pulse"
            role="status"
            aria-live="polite"
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

      <div className="type-display absolute bottom-8 right-6 z-20 text-[clamp(4rem,12vw,10rem)] text-white/12 md:right-10" aria-hidden="true">
        {progressValue}
        <span className="ml-2 text-[0.38em] text-white/18">%</span>
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 z-20 h-2 bg-white/10"
        role="progressbar"
        aria-labelledby="loading-screen-progress-label"
        aria-valuenow={progressValue}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <span id="loading-screen-progress-label" className="sr-only">
          読み込み進捗
        </span>
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
