'use client'

import { useRef } from 'react'
import { useInView } from '@/hooks/use-in-view'

export function useElementInView(threshold = 0.1) {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { threshold })

  return { ref, isInView }
}
