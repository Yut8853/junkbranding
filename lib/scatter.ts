export interface ScatterValue {
  x: number
  y: number
  rotation: number
  scale?: number
}

interface ScatterValueOptions {
  seed: number
  minDistance: number
  distanceRange: number
  rotationRange: number
  scale?: {
    min: number
    range: number
  }
}

export function seededRandom(seed: number) {
  const x = Math.sin(seed * 9999) * 10000
  return x - Math.floor(x)
}

export function createScatterValue({
  seed,
  minDistance,
  distanceRange,
  rotationRange,
  scale,
}: ScatterValueOptions): ScatterValue {
  const angle = seededRandom(seed) * Math.PI * 2
  const distance = minDistance + seededRandom(seed + 1) * distanceRange

  return {
    x: Math.cos(angle) * distance * (seededRandom(seed + 3) > 0.5 ? 1 : -1),
    y: Math.sin(angle) * distance * (seededRandom(seed + 4) > 0.5 ? 1 : -1),
    rotation: (seededRandom(seed + 2) - 0.5) * rotationRange,
    scale: scale ? scale.min + seededRandom(seed + 5) * scale.range : undefined,
  }
}

export function clamp01(value: number) {
  return Math.min(Math.max(value, 0), 1)
}
