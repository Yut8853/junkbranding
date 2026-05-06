'use client'

import { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react'
import type { AudioContextConstructor, AudioContextValue } from '@/types/audio'
import type { AudioProviderProps } from '@/types/component-props'

const BACKGROUND_AUDIO_SRC = '/audio/128_BPM124.mp3'
const AUDIO_PREFERENCE_KEY = 'junkbranding-audio-preference'
const MAX_VOLUME = 0.4
const START_VOLUME = 0.001
const FADE_DURATION_MS = 1200
const clampVolume = (volume: number) => Math.min(1, Math.max(0, volume))

class GeneratedAudioPlayer {
  private context: AudioContext | null = null
  private masterGain: GainNode | null = null
  private oscillators: OscillatorNode[] = []
  private _isPlaying = false

  get isPlaying() {
    return this._isPlaying && this.context?.state !== 'closed'
  }

  async start() {
    if (this.isPlaying) return true

    const AudioContextClass =
      window.AudioContext ||
      (window as typeof window & { webkitAudioContext?: AudioContextConstructor }).webkitAudioContext
    if (!AudioContextClass) return false

    const context = new AudioContextClass()
    const masterGain = context.createGain()
    const lowpass = context.createBiquadFilter()
    const now = context.currentTime

    lowpass.type = 'lowpass'
    lowpass.frequency.setValueAtTime(900, now)
    lowpass.Q.setValueAtTime(0.85, now)
    masterGain.gain.setValueAtTime(0.0001, now)
    masterGain.gain.exponentialRampToValueAtTime(0.14, now + 1.4)
    lowpass.connect(masterGain)
    masterGain.connect(context.destination)

    // MP3が再生できない環境でも「音あり」を選んだ体験を壊さないため、Web Audioで控えめな持続音を生成する。
    const voices = [
      { frequency: 146.83, type: 'sine' as OscillatorType, gain: 0.2, detune: -5 },
      { frequency: 220, type: 'triangle' as OscillatorType, gain: 0.12, detune: 7 },
      { frequency: 293.66, type: 'sine' as OscillatorType, gain: 0.08, detune: 12 },
    ]

    this.oscillators = voices.map((voice) => {
      const oscillator = context.createOscillator()
      const voiceGain = context.createGain()
      oscillator.type = voice.type
      oscillator.frequency.setValueAtTime(voice.frequency, now)
      oscillator.detune.setValueAtTime(voice.detune, now)
      voiceGain.gain.setValueAtTime(voice.gain, now)
      oscillator.connect(voiceGain)
      voiceGain.connect(lowpass)
      oscillator.start(now)
      return oscillator
    })

    if (context.state === 'suspended') {
      await context.resume()
    }

    this.context = context
    this.masterGain = masterGain
    this._isPlaying = true
    return true
  }

  stop() {
    if (!this.context || !this.masterGain) return

    const context = this.context
    const now = context.currentTime
    this._isPlaying = false
    this.masterGain.gain.cancelScheduledValues(now)
    this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now)
    this.masterGain.gain.linearRampToValueAtTime(0, now + 0.45)

    window.setTimeout(() => {
      this.oscillators.forEach((oscillator) => {
        try {
          oscillator.stop()
        } catch {
          // 連打で先に停止済みになっている場合は、そのまま後片付けを続ける。
        }
      })
      this.oscillators = []
      context.close().catch(() => undefined)
      if (this.context === context) {
        this.context = null
        this.masterGain = null
      }
    }, 520)
  }
}

class BackgroundAudioPlayer {
  private audio: HTMLAudioElement | null = null
  private generatedAudio = new GeneratedAudioPlayer()
  private fadeFrame: number | null = null
  private startPromise: Promise<boolean> | null = null
  private hasRequestedLoad = false
  private shouldPlay = false
  private _isPlaying = false

  get isPlaying() {
    return (this._isPlaying && Boolean(this.audio && !this.audio.paused)) || this.generatedAudio.isPlaying
  }

  init() {
    if (this.audio) return

    this.audio = new Audio(BACKGROUND_AUDIO_SRC)
    this.audio.loop = true
    this.audio.preload = 'none'
    this.audio.volume = 0

    this.audio.addEventListener('error', () => {
      if (!this.generatedAudio.isPlaying) this._isPlaying = false
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
      // ユーザー操作直後にload/playをまとめて行い、ブラウザの自動再生制限に引っかかりにくくする。
      this.audio.preload = 'auto'
      this.audio.muted = false
      this.audio.volume = START_VOLUME
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
      return this.startGeneratedAudio()
    }
  }

  private async startGeneratedAudio() {
    // 実ファイルの読み込み失敗や再生ブロック時は、生成音へフォールバックする。
    const started = await this.generatedAudio.start()
    this._isPlaying = started
    return started
  }

  stop() {
    this.shouldPlay = false
    this._isPlaying = false
    this.generatedAudio.stop()

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

    // HTMLAudioElementのvolumeをRAFで補間し、開始・停止時のクリックノイズを避ける。
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
  // ページ遷移でProviderが再マウントされても、音声プレイヤーは1つだけを共有する。
  if (!audioPlayerInstance) {
    audioPlayerInstance = new BackgroundAudioPlayer()
  }
  return audioPlayerInstance
}

const AudioCtx = createContext<AudioContextValue | null>(null)

export function AudioProvider({ children }: AudioProviderProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)
  const audioPlayerRef = useRef<BackgroundAudioPlayer | null>(null)

  useEffect(() => {
    audioPlayerRef.current = getAudioPlayer()
    
    // Provider再マウント時に、既存プレイヤーの再生状態をReact側へ同期する。
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
