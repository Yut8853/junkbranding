import type { ScatterValue, ScatterValueOptions } from '@/types/effects'

export function seededRandom(seed: number) {
  // 見た目の散らばりを毎回同じにするための決定的乱数。暗号用途では使わない。
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
  // seedから距離・回転・スケールを生成し、SSR後の再描画でも文字の飛び方を安定させる。
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
