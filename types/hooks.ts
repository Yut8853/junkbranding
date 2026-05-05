import type { RefObject } from 'react'

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
