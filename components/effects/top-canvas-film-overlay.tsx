'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { usePathname } from 'next/navigation'
import { isSmallScreen } from '@/lib/performance-mode'
import type { FilmParticle } from '@/types/effects'

const canUseOffscreenCanvas = () => (
  typeof Worker !== 'undefined' &&
  typeof OffscreenCanvas !== 'undefined' &&
  'transferControlToOffscreen' in HTMLCanvasElement.prototype
)

export function TopCanvasFilmOverlay() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const workerRef = useRef<Worker | null>(null)
  const workerTeardownRef = useRef<number | null>(null)
  const hasTransferredCanvasRef = useRef(false)
  const [mounted, setMounted] = useState(false)
  const [shouldStartCanvas, setShouldStartCanvas] = useState(false)
  const pathname = usePathname()
  const isHome = pathname === '/'

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || isSmallScreen()) return

    // 初期表示とLCPを優先するため、幻想的なCanvas加工はページが落ち着いてから開始する。
    const timer = window.setTimeout(() => {
      setShouldStartCanvas(true)
    }, 11000)

    return () => window.clearTimeout(timer)
  }, [mounted])

  useEffect(() => {
    if (!mounted || !shouldStartCanvas) return

    const canvas = canvasRef.current
    if (!canvas) return

    if (isSmallScreen()) {
      return
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let worker = workerRef.current

    if (canUseOffscreenCanvas()) {
      try {
        if (workerTeardownRef.current !== null) {
          window.clearTimeout(workerTeardownRef.current)
          workerTeardownRef.current = null
        }

        if (!worker) {
          worker = new Worker(new URL('./top-canvas-film-overlay.worker.ts', import.meta.url), {
            type: 'module',
          })
          workerRef.current = worker
        }

        const getDpr = () => Math.min(window.devicePixelRatio || 1, 1.5)
        const postResize = () => {
          canvas.style.width = `${window.innerWidth}px`
          canvas.style.height = `${window.innerHeight}px`
          worker?.postMessage({
            type: 'resize',
            width: window.innerWidth,
            height: window.innerHeight,
            dpr: getDpr(),
          })
        }

        if (!hasTransferredCanvasRef.current) {
          const offscreenCanvas = canvas.transferControlToOffscreen()
          hasTransferredCanvasRef.current = true
          worker.postMessage(
            {
              type: 'init',
              canvas: offscreenCanvas,
              width: window.innerWidth,
              height: window.innerHeight,
              dpr: getDpr(),
              isHome,
              prefersReducedMotion,
            },
            [offscreenCanvas],
          )
        } else {
          worker.postMessage({
            type: 'config',
            isHome,
            prefersReducedMotion,
          })
        }

        postResize()
        window.addEventListener('resize', postResize, { passive: true })

        return () => {
          window.removeEventListener('resize', postResize)

          // React Strict Modeの再実行では同じcanvasを再transferできないため、短時間だけWorkerを残す。
          workerTeardownRef.current = window.setTimeout(() => {
            worker?.postMessage({ type: 'destroy' })
            worker?.terminate()
            workerRef.current = null
            hasTransferredCanvasRef.current = false
            workerTeardownRef.current = null
          }, 120)
        }
      } catch {
        worker?.terminate()
        workerRef.current = null
        hasTransferredCanvasRef.current = false
      }
    }

    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    const particles: FilmParticle[] = []
    const particleCount = 24
    let width = 0
    let height = 0
    let dpr = 1
    let animationFrameId = 0
    let lastFrameTime = 0
    let shouldResize = true

    const createParticle = (): FilmParticle => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.08,
      vy: -0.03 - Math.random() * 0.05,
      size: 10 + Math.random() * 28,
      hue: 190 + Math.random() * 170,
      alpha: 0.025 + Math.random() * 0.055,
      phase: Math.random() * Math.PI * 2,
    })

    const resize = () => {
      // 高DPR端末でもCanvasサイズを抑え、PCのPSI測定でTBTが膨らみすぎないようにする。
      dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      width = window.innerWidth
      height = window.innerHeight

      const nextWidth = Math.max(1, Math.floor(width * dpr))
      const nextHeight = Math.max(1, Math.floor(height * dpr))

      if (canvas.width !== nextWidth || canvas.height !== nextHeight) {
        canvas.width = nextWidth
        canvas.height = nextHeight
        canvas.style.width = `${width}px`
        canvas.style.height = `${height}px`
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

        particles.length = 0
        for (let i = 0; i < particleCount; i += 1) {
          particles.push(createParticle())
        }
      }
    }

    const queueResize = () => {
      shouldResize = true
    }

    const drawFilm = (time: number) => {
      // screen合成でページ全体に虹色の光だけを乗せ、元のデザインを塗りつぶさない。
      ctx.clearRect(0, 0, width, height)
      ctx.globalCompositeOperation = 'screen'

      const drawOrb = (
        x: number,
        y: number,
        radius: number,
        hueA: number,
        hueB: number,
        alpha: number,
      ) => {
        const orb = ctx.createRadialGradient(x, y, 0, x, y, radius)
        orb.addColorStop(0, `hsla(${hueA}, 94%, 72%, ${alpha})`)
        orb.addColorStop(0.24, `hsla(${hueB}, 92%, 68%, ${alpha * 0.68})`)
        orb.addColorStop(0.58, `hsla(${(hueA + 70) % 360}, 90%, 64%, ${alpha * 0.25})`)
        orb.addColorStop(1, `hsla(${hueB}, 90%, 64%, 0)`)
        ctx.fillStyle = orb
        ctx.fillRect(0, 0, width, height)
      }

      // TOPは2点、下層は1点にして、ページごとの密度差を出す。
      const orbPositions = isHome
        ? [
            {
              x: width * (0.2 + Math.sin(time * 0.1) * 0.06),
              y: height * (0.24 + Math.cos(time * 0.08) * 0.05),
            },
            {
              x: width * (0.74 + Math.sin(time * 0.1 + Math.PI) * 0.06),
              y: height * (0.68 + Math.cos(time * 0.08 + Math.PI) * 0.05),
            },
          ]
        : [
            {
              x: width * (0.2 + Math.sin(time * 0.1) * 0.06),
              y: height * (0.24 + Math.cos(time * 0.08) * 0.05),
            },
          ]

      orbPositions.forEach((position, index) => {
        drawOrb(
          position.x,
          position.y,
          Math.max(width, height) * 0.5,
          285 + Math.sin(time * 0.12 + index * 0.35) * 24,
          210 + Math.cos(time * 0.09 + index * 0.35) * 22,
          0.18,
        )
      })

      const wash = ctx.createLinearGradient(
        width * (0.25 + Math.sin(time * 0.08) * 0.08),
        0,
        width * (0.8 + Math.cos(time * 0.06) * 0.08),
        height,
      )
      wash.addColorStop(0, `hsla(${280 + Math.sin(time * 0.12) * 20}, 82%, 62%, 0.08)`)
      wash.addColorStop(0.5, `hsla(${185 + Math.cos(time * 0.09) * 24}, 88%, 64%, 0.058)`)
      wash.addColorStop(1, `hsla(${45 + Math.sin(time * 0.1) * 18}, 92%, 64%, 0.07)`)
      ctx.fillStyle = wash
      ctx.fillRect(0, 0, width, height)

      for (let i = 0; i < 4; i += 1) {
        const x = ((time * 10 + i * width * 0.42) % (width * 1.4)) - width * 0.2
        const band = ctx.createLinearGradient(x - 180, 0, x + 180, height)
        band.addColorStop(0, 'hsla(0, 0%, 100%, 0)')
        band.addColorStop(0.5, `hsla(${(time * 12 + i * 55) % 360}, 95%, 76%, 0.034)`)
        band.addColorStop(1, 'hsla(0, 0%, 100%, 0)')
        ctx.fillStyle = band
        ctx.fillRect(0, 0, width, height)
      }

      particles.forEach((particle, index) => {
        if (!prefersReducedMotion) {
          particle.x += particle.vx + Math.sin(time * 0.22 + particle.phase) * 0.028
          particle.y += particle.vy + Math.cos(time * 0.18 + particle.phase) * 0.02
        }

        if (particle.x < -20 || particle.x > width + 20 || particle.y < -20) {
          particles[index] = {
            ...createParticle(),
            y: height + Math.random() * 20,
          }
          return
        }

        const glow = ctx.createRadialGradient(
          particle.x,
          particle.y,
          0,
          particle.x,
          particle.y,
          particle.size,
        )
        glow.addColorStop(0, `hsla(${particle.hue}, 85%, 68%, ${particle.alpha})`)
        glow.addColorStop(0.38, `hsla(${(particle.hue + 55) % 360}, 90%, 72%, ${particle.alpha * 0.42})`)
        glow.addColorStop(1, `hsla(${particle.hue}, 85%, 68%, 0)`)
        ctx.fillStyle = glow
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()
      })

      ctx.globalCompositeOperation = 'source-over'
    }

    const render = (now: number) => {
      // 常時60fpsではなく、演出として十分な頻度に落としてCPU負荷を抑える。
      const frameInterval = prefersReducedMotion ? 1000 : 50

      if (now - lastFrameTime >= frameInterval) {
        lastFrameTime = now
        if (shouldResize) {
          resize()
          shouldResize = false
        }
        drawFilm(now * 0.001)
      }

      if (!prefersReducedMotion) {
        animationFrameId = window.requestAnimationFrame(render)
      }
    }

    resize()
    shouldResize = false
    drawFilm(0)

    if (!prefersReducedMotion) {
      animationFrameId = window.requestAnimationFrame(render)
    }

    window.addEventListener('resize', queueResize, { passive: true })

    return () => {
      window.removeEventListener('resize', queueResize)
      window.cancelAnimationFrame(animationFrameId)
    }
  }, [isHome, mounted, shouldStartCanvas])

  if (!mounted || isSmallScreen()) return null

  return createPortal(
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 overflow-hidden ${isHome ? 'z-[6]' : 'z-[95]'}`}
    >
      <canvas
        ref={canvasRef}
        className="h-full w-full opacity-100 mix-blend-screen"
      />
    </div>,
    document.body,
  )
}
