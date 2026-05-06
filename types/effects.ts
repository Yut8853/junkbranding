// CanvasやWebGLではReact stateに載せない値が多いため、描画ループで共有する最小限の形だけを型にする。
export type FloatingParticle = {
  x: number
  y: number
  baseX: number
  baseY: number
  vx: number
  vy: number
  size: number
  hue: number
  speed: number
  amplitude: number
  frequency: number
  phase: number
  opacity: number
}

export type FloatingParticlesInitMessage = {
  type: 'init'
  canvas: OffscreenCanvas
  width: number
  height: number
  isLowPowerDevice: boolean
}

export type FloatingParticlesResizeMessage = {
  type: 'resize'
  width: number
  height: number
}

export type FloatingParticlesMouseMessage = {
  type: 'mouse'
  x: number
  y: number
}

export type FloatingParticlesVisibilityMessage = {
  type: 'visibility'
  visible: boolean
}

export type FloatingParticlesTransitionMessage = {
  type: 'transition'
  active: boolean
}

export type FloatingParticlesDestroyMessage = {
  type: 'destroy'
}

export type FloatingParticlesWorkerMessage =
  | FloatingParticlesInitMessage
  | FloatingParticlesResizeMessage
  | FloatingParticlesMouseMessage
  | FloatingParticlesVisibilityMessage
  | FloatingParticlesTransitionMessage
  | FloatingParticlesDestroyMessage

export type CursorParticle = {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  hue: number
  size: number
}

export type CtaParticle = {
  id: number
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  opacity: number
  hue: number
}

export type CanvasPoint = {
  x: number
  y: number
}

export type FilmParticle = {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  hue: number
  alpha: number
  phase: number
}

export type TopCanvasFilmOverlayInitMessage = {
  type: 'init'
  canvas: OffscreenCanvas
  width: number
  height: number
  dpr: number
  isHome: boolean
  prefersReducedMotion: boolean
}

export type TopCanvasFilmOverlayResizeMessage = {
  type: 'resize'
  width: number
  height: number
  dpr: number
}

export type TopCanvasFilmOverlayConfigMessage = {
  type: 'config'
  isHome: boolean
  prefersReducedMotion: boolean
}

export type TopCanvasFilmOverlayDestroyMessage = {
  type: 'destroy'
}

export type TopCanvasFilmOverlayWorkerMessage =
  | TopCanvasFilmOverlayInitMessage
  | TopCanvasFilmOverlayResizeMessage
  | TopCanvasFilmOverlayConfigMessage
  | TopCanvasFilmOverlayDestroyMessage

export type AnimationWorkerScope<TMessage> = {
  onmessage: ((event: MessageEvent<TMessage>) => void) | null
  requestAnimationFrame?: (callback: FrameRequestCallback) => number
  cancelAnimationFrame?: (handle: number) => void
  setTimeout: typeof setTimeout
  clearTimeout: typeof clearTimeout
}

export type OrbPhase = 'hidden' | 'floating' | 'attracted' | 'absorbed'

export type Orb = {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  hue: number
  size: number
  phase: OrbPhase
  targetX: number
  targetY: number
}

export type CanvasContextWithLetterSpacing = CanvasRenderingContext2D & {
  letterSpacing?: string
}

// ScatterTextは文字ごとの計測結果をキャッシュし、スクロール中の再計測を避ける。
export type GlyphMeasurement = {
  char: string
  x: number
  y: number
  width: number
  height: number
}

export type MeasurementCache = {
  key: string
  glyphs: GlyphMeasurement[]
}

export type ScatterValue = {
  x: number
  y: number
  rotation: number
  scale?: number
}

export type ScatterValueOptions = {
  seed: number
  minDistance: number
  distanceRange: number
  rotationRange: number
  scale?: {
    min: number
    range: number
  }
}
