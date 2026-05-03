import type { RefObject } from 'react'

export type UseInViewOptions = {
  once?: boolean
  margin?: string
  threshold?: number
}

export type UseInViewRef = RefObject<Element | null>
