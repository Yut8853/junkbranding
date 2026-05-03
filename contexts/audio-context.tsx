'use client'

import { createContext, useContext, useState, useRef, useEffect, useCallback, type ReactNode } from 'react'

const BACKGROUND_AUDIO_SRC = '/audio/128_BPM124.mp3'
const MAX_VOLUME = 0.15
const FADE_DURATION_MS = 1200

class BackgroundAudioPlayer {
  private audio: HTMLAudioElement | null = null
  private fadeFrame: number | null = null
  private _isPlaying = false

  get isPlaying() {
    return this._isPlaying
  }

  init() {
    if (this.audio) return

    this.audio = new Audio(BACKGROUND_AUDIO_SRC)
    this.audio.loop = true
    this.audio.preload = 'auto'
    this.audio.volume = 0

    this.audio.addEventListener('error', () => {
      this._isPlaying = false
      console.warn(`Background audio could not be loaded: ${BACKGROUND_AUDIO_SRC}`)
    })
  }

  async start() {
    this.init()
    if (!this.audio || this._isPlaying) return false

    try {
      this.audio.volume = 0
      await this.audio.play()
      this._isPlaying = true
      this.fadeTo(MAX_VOLUME, FADE_DURATION_MS)
      return true
    } catch (error) {
      this._isPlaying = false
      console.warn('Background audio playback was blocked or failed.', error)
      return false
    }
  }

  stop() {
    if (!this.audio || !this._isPlaying) return

    this._isPlaying = false
    this.fadeTo(0, 500, () => {
      if (!this.audio) return
      this.audio.pause()
      this.audio.currentTime = 0
    })
  }

  async toggle(): Promise<boolean> {
    if (this._isPlaying) {
      this.stop()
      return false
    }

    return this.start()
  }

  private fadeTo(targetVolume: number, durationMs: number, onComplete?: () => void) {
    if (!this.audio) return
    if (this.fadeFrame) cancelAnimationFrame(this.fadeFrame)

    const audio = this.audio
    const startVolume = audio.volume
    const startedAt = performance.now()

    const step = (now: number) => {
      const progress = Math.min((now - startedAt) / durationMs, 1)
      audio.volume = startVolume + (targetVolume - startVolume) * progress

      if (progress < 1) {
        this.fadeFrame = requestAnimationFrame(step)
        return
      }

      this.fadeFrame = null
      onComplete?.()
    }

    this.fadeFrame = requestAnimationFrame(step)
  }
}

let audioPlayerInstance: BackgroundAudioPlayer | null = null

function getAudioPlayer() {
  if (!audioPlayerInstance) {
    audioPlayerInstance = new BackgroundAudioPlayer()
  }
  return audioPlayerInstance
}

interface AudioContextValue {
  isPlaying: boolean
  toggleSound: () => Promise<void>
  hasStarted: boolean
}

const AudioCtx = createContext<AudioContextValue | null>(null)

export function AudioProvider({ children }: { children: ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)
  const audioPlayerRef = useRef<BackgroundAudioPlayer | null>(null)

  useEffect(() => {
    audioPlayerRef.current = getAudioPlayer()
    
    // Sync state with audio player
    setIsPlaying(audioPlayerRef.current.isPlaying)
    
    // Auto-start on first user interaction (required by browsers)
    const startOnInteraction = async () => {
      if (hasStarted) return
      setHasStarted(true)
      
      if (audioPlayerRef.current && !audioPlayerRef.current.isPlaying) {
        const playing = await audioPlayerRef.current.toggle()
        setIsPlaying(playing)
      }
      
      // Remove listeners after first interaction
      document.removeEventListener('click', startOnInteraction)
      document.removeEventListener('touchstart', startOnInteraction)
      document.removeEventListener('scroll', startOnInteraction)
    }
    
    if (!hasStarted) {
      document.addEventListener('click', startOnInteraction, { once: true })
      document.addEventListener('touchstart', startOnInteraction, { once: true })
      document.addEventListener('scroll', startOnInteraction, { once: true })
    }
    
    return () => {
      document.removeEventListener('click', startOnInteraction)
      document.removeEventListener('touchstart', startOnInteraction)
      document.removeEventListener('scroll', startOnInteraction)
    }
  }, [hasStarted])

  const toggleSound = useCallback(async () => {
    if (audioPlayerRef.current) {
      const playing = await audioPlayerRef.current.toggle()
      setIsPlaying(playing)
      if (!hasStarted) setHasStarted(true)
    }
  }, [hasStarted])

  return (
    <AudioCtx.Provider value={{ isPlaying, toggleSound, hasStarted }}>
      {children}
    </AudioCtx.Provider>
  )
}

export function useAudio() {
  const context = useContext(AudioCtx)
  if (!context) {
    throw new Error('useAudio must be used within AudioProvider')
  }
  return context
}
