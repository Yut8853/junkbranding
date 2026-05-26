'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import {
  DIRECOS_CODE_LINES,
  DIRECOS_LINE_HOLD_MS,
  DIRECOS_LOOP_PAUSE_MS,
  DIRECOS_TYPING_CHUNK_SIZE,
  DIRECOS_TYPING_INTERVAL_MS,
} from '@/lib/direcos-code-panel'

export function useDirecOSCodeTyping(lines = DIRECOS_CODE_LINES) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [lineIndex, setLineIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [isPausing, setIsPausing] = useState(false)

  useEffect(() => {
    if (isPausing) {
      const pauseDuration = lineIndex === lines.length - 1
        ? DIRECOS_LOOP_PAUSE_MS
        : DIRECOS_LINE_HOLD_MS
      const pauseTimer = window.setTimeout(() => {
        setIsPausing(false)

        if (lineIndex === lines.length - 1) {
          setLineIndex(0)
          setCharIndex(0)
          return
        }

        setLineIndex((current) => current + 1)
        setCharIndex(0)
      }, pauseDuration)

      return () => window.clearTimeout(pauseTimer)
    }

    const activeLine = lines[lineIndex] ?? ''

    if (charIndex >= activeLine.length) {
      setIsPausing(true)
      return
    }

    const typingTimer = window.setTimeout(() => {
      setCharIndex((current) => Math.min(current + DIRECOS_TYPING_CHUNK_SIZE, activeLine.length))
    }, DIRECOS_TYPING_INTERVAL_MS)

    return () => window.clearTimeout(typingTimer)
  }, [charIndex, isPausing, lineIndex, lines])

  useEffect(() => {
    const container = scrollRef.current
    if (!container) return

    const activeLine = container.querySelector<HTMLElement>(`[data-line-index="${lineIndex}"]`)
    if (!activeLine) return

    const nextTop = Math.max(activeLine.offsetTop - container.clientHeight * 0.45, 0)
    container.scrollTo({ top: nextTop, behavior: 'smooth' })
  }, [charIndex, lineIndex])

  const renderedLines = useMemo(() => {
    return lines.map((line, index) => {
      if (index < lineIndex) return line
      if (index > lineIndex) return ''
      return line.slice(0, charIndex)
    })
  }, [charIndex, lineIndex, lines])

  return {
    scrollRef,
    renderedLines,
    lineIndex,
    isPausing,
  }
}
