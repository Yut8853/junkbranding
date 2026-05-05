import type { RefObject } from 'react'

// 汎用hookの設定型。UIコンポーネント側からアニメーション強度だけを調整できるようにする。
export type UseInViewOptions = {
  once?: boolean
  margin?: string
  threshold?: number
}

export type UseInViewRef = RefObject<Element | null>

export type UsePointerTiltOptions = {
  disabled?: boolean
  perspective?: number
  scale?: number
  strength?: number
}

export type UseScrollScatterProgressOptions = {
  disabled?: boolean
  maxDistance?: number
  threshold?: number
}
