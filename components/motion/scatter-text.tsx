'use client'

import { useCallback, useEffect, useRef, useMemo, useState } from 'react'
import { clamp01, createScatterValue } from '@/lib/scatter'
import { useIsMobile } from '@/hooks/use-mobile'
import type { ScatterTextProps } from '@/types/component-props'
import type {
  CanvasContextWithLetterSpacing,
  GlyphMeasurement,
  MeasurementCache,
} from '@/types/effects'

const SOFT_GRADIENT_STOPS = [
  [0, 'hsl(350, 65%, 72%)'],
  [0.15, 'hsl(25, 70%, 72%)'],
  [0.3, 'hsl(50, 65%, 70%)'],
  [0.45, 'hsl(95, 45%, 65%)'],
  [0.6, 'hsl(175, 50%, 65%)'],
  [0.75, 'hsl(240, 55%, 75%)'],
  [0.9, 'hsl(320, 60%, 72%)'],
  [1, 'hsl(350, 65%, 72%)'],
] as const

const SCATTER_VISIBILITY_THRESHOLD = 0.015
const TEXT_REENTRY_THRESHOLD = 0.12
const ASSEMBLE_DURATION_MS = 720

export function ScatterText({
  children,
  as: Component = 'div',
  className = '',
  scrollStart = 50,
  scrollEnd = 300,
  distance = 600,
  style,
  gradient = false,
  scatterProgress,
  ariaHidden,
  deferUntilActive = false,
}: ScatterTextProps) {
  const containerRef = useRef<HTMLElement>(null)
  const textRef = useRef<HTMLSpanElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const measurementCacheRef = useRef<MeasurementCache | null>(null)
  const isScatteringRef = useRef(false)
  const isVisibleRef = useRef(false)
  const hasPlayedIntroRef = useRef(false)
  const assembleFrameRef = useRef<number | null>(null)
  const progressRef = useRef(0)
  const [isVisible, setIsVisible] = useState(false)
  const [hasMounted, setHasMounted] = useState(false)
  const [isScattering, setIsScattering] = useState(false)
  const [hasActivatedCanvas, setHasActivatedCanvas] = useState(!deferUntilActive)
  const [scatterRenderProgress, setScatterRenderProgress] = useState(0)
  const isMobile = useIsMobile()
  const canUseScatter = hasMounted && !isMobile
  const shouldPrepareScatter = canUseScatter && hasActivatedCanvas
  const hasControlledProgress = typeof scatterProgress === 'number'
  const currentProgress = scatterRenderProgress

  const chars = useMemo(() => children.split(''), [children])

  // Pre-generate scatter values
  const scatterValues = useMemo(() => {
    if (!shouldPrepareScatter) return []

    return chars.map((_, i) => {
      const seed = i * 7 + 13
      return createScatterValue({
        seed,
        minDistance: distance * 0.5,
        distanceRange: distance,
        rotationRange: 720,
      })
    })
  }, [chars, distance, shouldPrepareScatter])

  const setScatterState = useCallback((nextIsScattering: boolean) => {
    if (isScatteringRef.current === nextIsScattering) return
    isScatteringRef.current = nextIsScattering
    setIsScattering(nextIsScattering)
  }, [])

  useEffect(() => {
    setHasMounted(true)
  }, [])

  useEffect(() => {
    if (!deferUntilActive) {
      setHasActivatedCanvas(true)
    }
  }, [deferUntilActive])

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }, [])

  const measureGlyphs = useCallback((
    textElement: HTMLSpanElement,
    textNode: ChildNode,
    containerRect: DOMRect,
    font: string
  ) => {
    const sourceText = textNode.textContent ?? ''
    const cacheKey = [
      sourceText,
      Math.round(containerRect.width),
      Math.round(containerRect.height),
      font,
    ].join('|')

    if (measurementCacheRef.current?.key === cacheKey) {
      return measurementCacheRef.current.glyphs
    }

    const range = document.createRange()
    const glyphs: GlyphMeasurement[] = []

    for (let index = 0; index < sourceText.length; index += 1) {
      const char = sourceText[index]
      if (!char || char === ' ') continue

      range.setStart(textNode, index)
      range.setEnd(textNode, index + 1)
      const rect = range.getBoundingClientRect()
      if (rect.width === 0 && rect.height === 0) continue

      glyphs[index] = {
        char,
        x: rect.left - containerRect.left,
        y: rect.top - containerRect.top,
        width: rect.width,
        height: rect.height,
      }
    }

    range.detach()
    measurementCacheRef.current = { key: cacheKey, glyphs }
    textElement.dataset.scatterMeasured = 'true'

    return glyphs
  }, [])

  const drawScatterCanvas = useCallback((progress: number) => {
    const container = containerRef.current
    const textElement = textRef.current
    const canvas = canvasRef.current
    const textNode = textElement?.firstChild

    if (!container || !textElement || !canvas || textNode?.nodeType !== Node.TEXT_NODE) {
      return
    }

    const containerRect = container.getBoundingClientRect()
    if (containerRect.width <= 0 || containerRect.height <= 0) return

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    const width = Math.ceil(containerRect.width)
    const height = Math.ceil(containerRect.height)
    const canvasWidth = Math.ceil(width * dpr)
    const canvasHeight = Math.ceil(height * dpr)

    if (canvas.width !== canvasWidth || canvas.height !== canvasHeight) {
      canvas.width = canvasWidth
      canvas.height = canvasHeight
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
    }

    const ctx = canvas.getContext('2d') as CanvasContextWithLetterSpacing | null
    if (!ctx) return

    const computedStyle = window.getComputedStyle(textElement)
    const font = [
      computedStyle.fontStyle,
      computedStyle.fontVariant,
      computedStyle.fontWeight,
      computedStyle.fontSize,
      computedStyle.fontFamily,
    ].filter(Boolean).join(' ')
    const textFillColor = computedStyle.getPropertyValue('-webkit-text-fill-color')
    const strokeWidth = Number.parseFloat(computedStyle.getPropertyValue('-webkit-text-stroke-width')) || 0
    const strokeColor = computedStyle.getPropertyValue('-webkit-text-stroke-color') || computedStyle.color
    const usesGradient = gradient || textFillColor === 'transparent' || textFillColor === 'rgba(0, 0, 0, 0)'

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, width, height)
    ctx.font = font
    ctx.textAlign = 'left'
    ctx.textBaseline = 'top'
    ctx.globalAlpha = 1
    if (ctx.letterSpacing !== undefined) {
      ctx.letterSpacing = computedStyle.letterSpacing
    }

    const gradientFill = ctx.createLinearGradient(0, 0, width, 0)
    SOFT_GRADIENT_STOPS.forEach(([offset, color]) => {
      gradientFill.addColorStop(offset, color)
    })

    ctx.fillStyle = usesGradient ? gradientFill : computedStyle.color
    ctx.strokeStyle = strokeColor
    ctx.lineWidth = strokeWidth

    const glyphs = measureGlyphs(textElement, textNode, containerRect, font)

    for (let index = 0; index < glyphs.length; index += 1) {
      const glyph = glyphs[index]
      if (!glyph) continue

      const values = scatterValues[index]
      if (!values) continue

      const centerX = glyph.x + glyph.width / 2
      const centerY = glyph.y + glyph.height / 2
      const scale = 1 - 0.5 * progress
      const rotation = (values.rotation * progress * Math.PI) / 180

      ctx.save()
      ctx.translate(
        centerX + values.x * progress,
        centerY + values.y * progress
      )
      ctx.rotate(rotation)
      ctx.scale(scale, scale)

      if (strokeWidth > 0) {
        ctx.strokeText(glyph.char, -glyph.width / 2, -glyph.height / 2)
      }

      if (!usesGradient || strokeWidth === 0) {
        ctx.fillText(glyph.char, -glyph.width / 2, -glyph.height / 2)
      }

      ctx.restore()
    }

    ctx.globalAlpha = 1
  }, [gradient, measureGlyphs, scatterValues])

  const applyScatter = useCallback((progress: number) => {
    progressRef.current = progress
    setScatterRenderProgress(progress)

    if (progress > SCATTER_VISIBILITY_THRESHOLD && deferUntilActive && !hasActivatedCanvas) {
      setHasActivatedCanvas(true)
      setScatterState(true)
      return
    }

    if (progress > SCATTER_VISIBILITY_THRESHOLD) {
      drawScatterCanvas(progress)
      setScatterState(true)
      return
    }

    clearCanvas()
    setScatterState(false)
  }, [clearCanvas, deferUntilActive, drawScatterCanvas, hasActivatedCanvas, setScatterState])

  const playAssembleIntro = useCallback(() => {
    if (hasPlayedIntroRef.current) return
    hasPlayedIntroRef.current = true

    const startedAt = performance.now()
    setIsVisible(true)
    isVisibleRef.current = true

    const step = (now: number) => {
      const elapsed = now - startedAt
      const progress = clamp01(elapsed / ASSEMBLE_DURATION_MS)
      const eased = 1 - (1 - progress) ** 3
      applyScatter(1 - eased)

      if (progress < 1) {
        assembleFrameRef.current = requestAnimationFrame(step)
        return
      }

      assembleFrameRef.current = null
      applyScatter(0)
    }

    applyScatter(1)
    assembleFrameRef.current = requestAnimationFrame(step)
  }, [applyScatter])

  // TOPやメニューは外部から散らばり量を制御する。通常ページのテキストは一度だけ組み上げる。
  useEffect(() => {
    if (!containerRef.current) return

    if (isMobile) {
      isVisibleRef.current = true
      setIsVisible(true)
      return
    }

    if (hasControlledProgress) {
      if (!canUseScatter) {
        isVisibleRef.current = true
        setIsVisible(true)
        return
      }

      isVisibleRef.current = true
      setIsVisible(true)
      const progress = clamp01(scatterProgress ?? 0)
      if (progress <= SCATTER_VISIBILITY_THRESHOLD && deferUntilActive && !hasActivatedCanvas) return
      applyScatter(progress)
      return
    }

    const container = containerRef.current
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || hasPlayedIntroRef.current) return

        if (canUseScatter) {
          playAssembleIntro()
          return
        }

        isVisibleRef.current = true
        setIsVisible(true)
        hasPlayedIntroRef.current = true
      },
      {
        threshold: 0.12,
        rootMargin: `0px 0px -${scrollStart}px 0px`,
      }
    )

    observer.observe(container)

    return () => observer.disconnect()
  }, [applyScatter, canUseScatter, deferUntilActive, hasActivatedCanvas, hasControlledProgress, isMobile, playAssembleIntro, scatterProgress, scrollStart])

  useEffect(() => {
    return () => {
      if (assembleFrameRef.current !== null) {
        cancelAnimationFrame(assembleFrameRef.current)
      }
    }
  }, [])

  useEffect(() => {
    const clearMeasurements = () => {
      measurementCacheRef.current = null
    }

    window.addEventListener('resize', clearMeasurements, { passive: true })
    return () => window.removeEventListener('resize', clearMeasurements)
  }, [children])

  const delay = Math.min(children.length * 0.008, 0.35)

  if (isMobile) {
    return (
      <Component
        ref={containerRef as React.RefObject<HTMLDivElement>}
        className={className}
        aria-hidden={ariaHidden}
        style={style}
      >
        <span
          ref={textRef}
          className={gradient ? 'gradient-text-soft' : undefined}
        >
          {children}
        </span>
      </Component>
    )
  }

  const shouldShowText = isMobile || isVisible
  const textOpacity = isScattering
    ? currentProgress < TEXT_REENTRY_THRESHOLD
      ? 1 - currentProgress / TEXT_REENTRY_THRESHOLD
      : 0
    : shouldShowText ? 1 : 0
  const canvasOpacity = isScattering
    ? currentProgress < TEXT_REENTRY_THRESHOLD
      ? currentProgress / TEXT_REENTRY_THRESHOLD
      : 1
    : 0
  const textStyle = {
    opacity: textOpacity,
    transform: shouldShowText ? 'translate3d(0,0,0)' : 'translate3d(0,28px,0)',
    transition: !hasMounted || isMobile
      ? 'none'
      : isScattering
        ? 'opacity 0.12s linear'
        : `opacity 0.42s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, transform 0.42s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
  }

  return (
    <Component
      ref={containerRef as React.RefObject<HTMLDivElement>}
      className={className}
      aria-hidden={ariaHidden}
      style={{
        ...style,
        position: style?.position ?? 'relative',
      }}
    >
      <span
        ref={textRef}
        className={gradient ? 'gradient-text-soft' : undefined}
        style={textStyle}
      >
        {children}
      </span>
      {shouldPrepareScatter && (
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0"
          style={{
            display: isScattering ? 'block' : 'none',
            opacity: canvasOpacity,
            transition: 'opacity 0.12s linear',
          }}
        />
      )}
    </Component>
  )
}
