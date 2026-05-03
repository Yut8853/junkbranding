'use client'

import { createContext, useContext, useState, useRef, useEffect, useCallback, type ReactNode } from 'react'

const BACKGROUND_AUDIO_SRC = '/audio/128_BPM124.mp3'
const AUDIO_PREFERENCE_KEY = 'junkbranding-audio-preference'
const MAX_VOLUME = 0.8
const FADE_DURATION_MS = 1200
const clampVolume = (volume: number) => Math.min(1, Math.max(0, volume))

class BackgroundAudioPlayer {
  private audio: HTMLAudioElement | null = null
  private fadeFrame: number | null = null
  private startPromise: Promise<boolean> | null = null
  private hasRequestedLoad = false
  private shouldPlay = false
  private _isPlaying = false

  get isPlaying() {
    return this._isPlaying && Boolean(this.audio && !this.audio.paused)
  }

  init() {
    if (this.audio) return

    this.audio = new Audio(BACKGROUND_AUDIO_SRC)
    this.audio.loop = true
    this.audio.preload = 'none'
    this.audio.volume = 0

    this.audio.addEventListener('error', () => {
      this._isPlaying = false
      console.warn(`Background audio could not be loaded: ${BACKGROUND_AUDIO_SRC}`)
    })
  }

  async start() {
    this.shouldPlay = true
    this.init()
    if (!this.audio) return false
    if (this.isPlaying) return true
    if (this.startPromise) return this.startPromise

    this.startPromise = this.startAudio()
    const started = await this.startPromise
    this.startPromise = null
    return started
  }

  private async startAudio() {
    if (!this.audio) return false

    try {
      this.audio.preload = 'auto'
      this.audio.volume = 0
      if (!this.hasRequestedLoad && this.audio.readyState === HTMLMediaElement.HAVE_NOTHING) {
        this.hasRequestedLoad = true
        this.audio.load()
      }
      await this.audio.play()

      if (!this.shouldPlay) {
        this.audio.pause()
        this.audio.currentTime = 0
        this.audio.volume = 0
        return false
      }

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
    this.shouldPlay = false
    this._isPlaying = false

    if (this.fadeFrame) {
      cancelAnimationFrame(this.fadeFrame)
      this.fadeFrame = null
    }

    if (!this.audio) return

    if (this.audio.paused) {
      this.audio.volume = 0
      this.audio.currentTime = 0
      return
    }

    this.fadeTo(0, 500, () => {
      if (!this.audio || this.shouldPlay) return
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
    const safeTargetVolume = clampVolume(targetVolume)
    const startedAt = performance.now()

    const step = (now: number) => {
      const progress = Math.min((now - startedAt) / durationMs, 1)
      audio.volume = clampVolume(startVolume + (safeTargetVolume - startVolume) * progress)

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
  startSound: () => Promise<boolean>
  stopSound: () => void
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
  }, [])

  const startSound = useCallback(async () => {
    audioPlayerRef.current ??= getAudioPlayer()

    const playing = await audioPlayerRef.current.start()
    setIsPlaying(playing)
    setHasStarted(true)
    window.localStorage.setItem(AUDIO_PREFERENCE_KEY, 'sound-on')
    return playing
  }, [])

  const stopSound = useCallback(() => {
    audioPlayerRef.current ??= getAudioPlayer()

    audioPlayerRef.current.stop()
    setIsPlaying(false)
    setHasStarted(true)
    window.localStorage.setItem(AUDIO_PREFERENCE_KEY, 'sound-off')
  }, [])

  const toggleSound = useCallback(async () => {
    audioPlayerRef.current ??= getAudioPlayer()

    if (audioPlayerRef.current) {
      const playing = await audioPlayerRef.current.toggle()
      setIsPlaying(playing)
      if (!hasStarted) setHasStarted(true)
      window.localStorage.setItem(AUDIO_PREFERENCE_KEY, playing ? 'sound-on' : 'sound-off')
    }
  }, [hasStarted])

  return (
    <AudioCtx.Provider value={{ isPlaying, toggleSound, startSound, stopSound, hasStarted }}>
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
