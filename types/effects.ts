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
