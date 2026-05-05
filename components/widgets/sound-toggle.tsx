'use client'

import { useState, useCallback } from 'react'
import { useAudio } from '@/contexts/audio-context'

export function SoundToggle() {
  const { isPlaying, toggleSound } = useAudio()
  const [isHovering, setIsHovering] = useState(false)

  const handleClick = useCallback(async () => {
    await toggleSound()
  }, [toggleSound])

  return (
    <button
      onClick={handleClick}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className="fixed bottom-8 right-8 z-[999] group"
      aria-label={isPlaying ? '音楽をミュートする' : '音楽を再生する'}
      aria-pressed={isPlaying}
      title={isPlaying ? 'SOUND ON' : 'SOUND OFF'}
    >
      <div
        aria-hidden="true"
        className="relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500"
        style={{
          backgroundColor: isHovering ? 'transparent' : 'rgba(0,0,0,0.3)',
          backgroundImage: isHovering 
            ? 'linear-gradient(135deg, hsl(350,65%,72%), hsl(200,60%,72%), hsl(280,50%,72%))'
            : 'none',
          border: '1px solid',
          borderColor: isHovering ? 'transparent' : 'rgba(255,255,255,0.2)',
          backdropFilter: 'blur(10px)',
        }}
      >
        {/* Sound wave bars */}
        <div className="flex items-end gap-[3px] h-5">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="w-[3px] rounded-full transition-all duration-300"
              style={{
                height: isPlaying ? '100%' : '4px',
                backgroundColor: isHovering 
                  ? 'rgba(0,0,0,0.8)'
                  : `hsl(${350 + i * 50}, 65%, 72%)`,
                animationName: isPlaying ? `soundBar${i}` : 'none',
                animationDuration: '0.5s',
                animationTimingFunction: 'ease-in-out',
                animationIterationCount: 'infinite',
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
        </div>

        {/* Ripple effect when playing */}
        {isPlaying && (
          <>
            <div 
              className="absolute inset-0 rounded-full border animate-ping"
              style={{
                borderColor: 'hsl(350, 65%, 72%)',
                animationDuration: '2s',
              }}
            />
            <div 
              className="absolute inset-[-8px] rounded-full border animate-ping"
              style={{
                borderColor: 'hsl(200, 60%, 72%)',
                animationDuration: '2.5s',
                animationDelay: '0.5s',
              }}
            />
          </>
        )}
      </div>

      {/* Label */}
      <span
        aria-hidden="true"
        className="type-label absolute right-full mr-3 top-1/2 -translate-y-1/2 text-xs text-foreground/50 whitespace-nowrap transition-all duration-300"
        style={{
          opacity: isHovering ? 1 : 0,
          transform: `translateY(-50%) translateX(${isHovering ? 0 : 10}px)`,
        }}
      >
        {isPlaying ? 'SOUND ON' : 'SOUND OFF'}
      </span>

      <style jsx>{`
        @keyframes soundBar0 {
          0%, 100% { height: 8px; }
          50% { height: 16px; }
        }
        @keyframes soundBar1 {
          0%, 100% { height: 14px; }
          50% { height: 6px; }
        }
        @keyframes soundBar2 {
          0%, 100% { height: 10px; }
          50% { height: 18px; }
        }
        @keyframes soundBar3 {
          0%, 100% { height: 12px; }
          50% { height: 8px; }
        }
      `}</style>
    </button>
  )
}
