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
