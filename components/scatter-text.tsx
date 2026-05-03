'use client'

import { useCallback, useEffect, useRef, useMemo, useState } from 'react'
import { clamp01, createScatterValue } from '@/lib/scatter'
import { subscribeToScrollUpdates } from '@/lib/scroll-manager'
import { useIsMobile } from '@/hooks/use-mobile'
import type { ScatterTextProps } from '@/types/component-props'

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

type CanvasContextWithLetterSpacing = CanvasRenderingContext2D & {
  letterSpacing?: string
}

export function ScatterText({
  children,
  as: Component = 'div',
  className = '',
  scrollStart = 50,
  scrollEnd = 300,
  distance = 600,
  style,
  gradient = false,
}: ScatterTextProps) {
  const containerRef = useRef<HTMLElement>(null)
  const textRef = useRef<HTMLSpanElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const isScatteringRef = useRef(false)
  const isVisibleRef = useRef(false)
  const progressRef = useRef(0)
  const [isVisible, setIsVisible] = useState(false)
  const [isScattering, setIsScattering] = useState(false)
  const isMobile = useIsMobile()

  const chars = useMemo(() => children.split(''), [children])

  // Pre-generate scatter values
  const scatterValues = useMemo(() => {
    return chars.map((_, i) => {
      const seed = i * 7 + 13
      return createScatterValue({
        seed,
        minDistance: distance * 0.5,
        distanceRange: distance,
        rotationRange: 720,
      })
    })
  }, [chars, distance])

  const setScatterState = useCallback((nextIsScattering: boolean) => {
    if (isScatteringRef.current === nextIsScattering) return
    isScatteringRef.current = nextIsScattering
    setIsScattering(nextIsScattering)
  }, [])

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
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
    ctx.globalAlpha = 1 - progress
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

    const range = document.createRange()
    const sourceText = textNode.textContent ?? ''

    for (let index = 0; index < sourceText.length; index += 1) {
      const char = sourceText[index]
      if (!char || char === ' ') continue

      const values = scatterValues[index]
      if (!values) continue

      range.setStart(textNode, index)
      range.setEnd(textNode, index + 1)
      const rect = range.getBoundingClientRect()
      if (rect.width === 0 && rect.height === 0) continue

      const x = rect.left - containerRect.left
      const y = rect.top - containerRect.top
      const centerX = x + rect.width / 2
      const centerY = y + rect.height / 2
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
        ctx.strokeText(char, -rect.width / 2, -rect.height / 2)
      }

      if (!usesGradient || strokeWidth === 0) {
        ctx.fillText(char, -rect.width / 2, -rect.height / 2)
      }

      ctx.restore()
    }

    range.detach()
    ctx.globalAlpha = 1
  }, [gradient, scatterValues])

  const applyScatter = useCallback((progress: number) => {
    if (progress > 0) {
      drawScatterCanvas(progress)
      setScatterState(true)
      return
    }

    clearCanvas()
    setScatterState(false)
  }, [clearCanvas, drawScatterCanvas, setScatterState])

  // Combined scroll handler for fade-in and scatter
  useEffect(() => {
    if (!containerRef.current) return

    if (isMobile) {
      isVisibleRef.current = true
      setIsVisible(true)
      applyScatter(0)
      return
    }

    const container = containerRef.current
    let hasScrolledPast = false

    return subscribeToScrollUpdates(container, ({ rect, viewportHeight, scrollY }) => {
      // Fade-in: trigger when bottom of element is 50px above viewport bottom
      const fadeInTrigger = viewportHeight - scrollStart
      if (rect.top < fadeInTrigger && !isVisibleRef.current) {
        isVisibleRef.current = true
        setIsVisible(true)
      }

      // Only start scattering after user has scrolled at least 100px
      if (scrollY < 100) {
        if (progressRef.current !== 0) {
          progressRef.current = 0
          applyScatter(0)
        }
        return
      }

      // Scatter: trigger when element is above 30% of viewport (scrolled up past trigger)
      const scatterTriggerPoint = viewportHeight * 0.30
      const elementCenter = rect.top + rect.height / 2

      if (elementCenter < scatterTriggerPoint) {
        hasScrolledPast = true
        const distancePastTrigger = scatterTriggerPoint - elementCenter
        const progress = clamp01(distancePastTrigger / scrollEnd)
        if (Math.abs(progress - progressRef.current) > 0.01 || progress === 0 || progress === 1) {
          progressRef.current = progress
          applyScatter(progress)
        }
      } else if (hasScrolledPast) {
        // Only reset if we've scrolled past before (prevent initial state scatter)
        if (progressRef.current !== 0) {
          progressRef.current = 0
          applyScatter(0)
        }
      }
    })
  }, [applyScatter, isMobile, scrollEnd, scrollStart])

  const delay = Math.min(children.length * 0.008, 0.35)
  const textStyle = {
    opacity: isScattering ? 0 : isMobile || isVisible ? 1 : 0,
    transform: isMobile || isVisible ? 'translate3d(0,0,0)' : 'translate3d(0,28px,0)',
    transition: isMobile
      ? 'none'
      : `opacity 0.55s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, transform 0.55s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
  }

  return (
    <Component
      ref={containerRef as React.RefObject<HTMLDivElement>}
      className={className}
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
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0"
        style={{
          display: isScattering ? 'block' : 'none',
          opacity: isScattering ? 1 : 0,
        }}
      />
    </Component>
  )
}
