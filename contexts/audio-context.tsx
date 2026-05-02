'use client'

import { createContext, useContext, useState, useRef, useEffect, useCallback, type ReactNode } from 'react'

// Ambient sound generator using Web Audio API
class AmbientSoundGenerator {
  private audioContext: AudioContext | null = null
  private masterGain: GainNode | null = null
  private sources: AudioScheduledSourceNode[] = []
  private chordSources: AudioScheduledSourceNode[] = []
  private noiseSource: AudioBufferSourceNode | null = null
  private chordTimer: ReturnType<typeof setInterval> | null = null
  private sparkleTimer: ReturnType<typeof setInterval> | null = null
  private chordIndex = 0
  private _isPlaying = false

  get isPlaying() {
    return this._isPlaying
  }

  init() {
    if (this.audioContext) return
    
    this.audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    this.masterGain = this.audioContext.createGain()
    this.masterGain.gain.value = 0

    const compressor = this.audioContext.createDynamicsCompressor()
    compressor.threshold.value = -28
    compressor.knee.value = 24
    compressor.ratio.value = 4
    compressor.attack.value = 0.05
    compressor.release.value = 0.8

    this.masterGain.connect(compressor)
    compressor.connect(this.audioContext.destination)
  }

  async start() {
    if (!this.audioContext || !this.masterGain || this._isPlaying) return
    
    // Resume audio context if suspended (required after user interaction)
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume()
    }
    
    this._isPlaying = true
    this.createAirTexture()
    this.playChord()
    this.chordTimer = setInterval(() => this.playChord(), 9000)
    this.sparkleTimer = setInterval(() => this.playSparkle(), 1800)

    // Fade in
    this.masterGain.gain.setTargetAtTime(0.18, this.audioContext.currentTime, 1.5)
  }

  private playChord() {
    if (!this.audioContext || !this.masterGain || !this._isPlaying) return

    const progressions = [
      [146.83, 220.0, 277.18, 329.63, 440.0], // Dmaj9
      [123.47, 185.0, 246.94, 293.66, 369.99], // Bm11
      [98.0, 146.83, 196.0, 246.94, 329.63], // Gmaj9
      [110.0, 164.81, 220.0, 246.94, 329.63], // A6sus
    ]
    const chord = progressions[this.chordIndex % progressions.length]
    this.chordIndex += 1

    const now = this.audioContext.currentTime
    this.fadeOutChordSources(now)

    chord.forEach((frequency, index) => {
      const osc = this.audioContext!.createOscillator()
      const gain = this.audioContext!.createGain()
      const filter = this.audioContext!.createBiquadFilter()
      const lfo = this.audioContext!.createOscillator()
      const lfoGain = this.audioContext!.createGain()

      osc.type = index < 2 ? 'sine' : 'triangle'
      osc.frequency.value = frequency
      osc.detune.value = (index - 2) * 3

      lfo.type = 'sine'
      lfo.frequency.value = 0.025 + index * 0.01
      lfoGain.gain.value = 4 + index
      lfo.connect(lfoGain)
      lfoGain.connect(osc.detune)

      filter.type = 'lowpass'
      filter.frequency.value = 900 + index * 240
      filter.Q.value = 0.6

      gain.gain.setValueAtTime(0, now)
      gain.gain.linearRampToValueAtTime(index < 2 ? 0.045 : 0.026, now + 2.2)
      gain.gain.setTargetAtTime(0.018, now + 4.5, 4)

      osc.connect(filter)
      filter.connect(gain)
      gain.connect(this.masterGain!)

      osc.start(now)
      lfo.start(now)

      this.sources.push(osc, lfo)
      this.chordSources.push(osc, lfo)
    })
  }

  private fadeOutChordSources(now: number) {
    this.chordSources.forEach((source) => {
      try {
        source.stop(now + 2)
      } catch {}
    })
    this.chordSources = []
  }

  private playSparkle() {
    if (!this.audioContext || !this.masterGain || !this._isPlaying) return

    const notes = [554.37, 659.25, 739.99, 880.0, 987.77, 1108.73]
    const frequency = notes[Math.floor(Math.random() * notes.length)]
    const now = this.audioContext.currentTime
    const osc = this.audioContext.createOscillator()
    const gain = this.audioContext.createGain()
    const filter = this.audioContext.createBiquadFilter()
    const pan = this.audioContext.createStereoPanner()
    const delay = this.audioContext.createDelay()
    const feedback = this.audioContext.createGain()

    osc.type = 'sine'
    osc.frequency.value = frequency
    filter.type = 'bandpass'
    filter.frequency.value = frequency * 1.5
    filter.Q.value = 4
    pan.pan.value = Math.random() * 1.4 - 0.7
    delay.delayTime.value = 0.28 + Math.random() * 0.16
    feedback.gain.value = 0.18

    gain.gain.setValueAtTime(0, now)
    gain.gain.linearRampToValueAtTime(0.018, now + 0.08)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.4)

    osc.connect(filter)
    filter.connect(gain)
    gain.connect(pan)
    pan.connect(this.masterGain)
    pan.connect(delay)
    delay.connect(feedback)
    feedback.connect(delay)
    delay.connect(this.masterGain)

    osc.start(now)
    osc.stop(now + 2.5)
    this.sources.push(osc)
  }

  private createAirTexture() {
    if (!this.audioContext || !this.masterGain) return

    const noiseBuffer = this.createNoiseBuffer()
    this.noiseSource = this.audioContext.createBufferSource()
    const highpass = this.audioContext.createBiquadFilter()
    const lowpass = this.audioContext.createBiquadFilter()
    const noiseGain = this.audioContext.createGain()

    this.noiseSource.buffer = noiseBuffer
    this.noiseSource.loop = true
    highpass.type = 'highpass'
    highpass.frequency.value = 450
    lowpass.type = 'lowpass'
    lowpass.frequency.value = 2200
    lowpass.Q.value = 0.8
    noiseGain.gain.value = 0.012

    this.noiseSource.connect(highpass)
    highpass.connect(lowpass)
    lowpass.connect(noiseGain)
    noiseGain.connect(this.masterGain)
    this.noiseSource.start()
    this.sources.push(this.noiseSource)
  }

  private createNoiseBuffer(): AudioBuffer {
    const bufferSize = this.audioContext!.sampleRate * 2
    const buffer = this.audioContext!.createBuffer(1, bufferSize, this.audioContext!.sampleRate)
    const data = buffer.getChannelData(0)
    
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1
    }
    
    return buffer
  }

  stop() {
    if (!this.audioContext || !this.masterGain || !this._isPlaying) return
    this._isPlaying = false
    if (this.chordTimer) clearInterval(this.chordTimer)
    if (this.sparkleTimer) clearInterval(this.sparkleTimer)
    this.chordTimer = null
    this.sparkleTimer = null
    
    // Fade out
    this.masterGain.gain.setTargetAtTime(0, this.audioContext.currentTime, 0.5)
    
    // Stop sound sources after fade
    setTimeout(() => {
      this.sources.forEach(source => {
        try { source.stop() } catch {}
      })
      this.sources = []
      this.chordSources = []
      this.noiseSource = null
    }, 1500)
  }

  async toggle(): Promise<boolean> {
    this.init()
    if (this._isPlaying) {
      this.stop()
      return false
    } else {
      await this.start()
      return true
    }
  }
}

// Create singleton instance
let generatorInstance: AmbientSoundGenerator | null = null

function getGenerator() {
  if (!generatorInstance) {
    generatorInstance = new AmbientSoundGenerator()
  }
  return generatorInstance
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
  const generatorRef = useRef<AmbientSoundGenerator | null>(null)

  useEffect(() => {
    generatorRef.current = getGenerator()
    
    // Sync state with generator
    setIsPlaying(generatorRef.current.isPlaying)
    
    // Auto-start on first user interaction (required by browsers)
    const startOnInteraction = async () => {
      if (hasStarted) return
      setHasStarted(true)
      
      if (generatorRef.current && !generatorRef.current.isPlaying) {
        await generatorRef.current.toggle()
        setIsPlaying(true)
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
    if (generatorRef.current) {
      const playing = await generatorRef.current.toggle()
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
