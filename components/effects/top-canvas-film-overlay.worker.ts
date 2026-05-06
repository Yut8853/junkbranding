import type { AnimationWorkerScope, FilmParticle, TopCanvasFilmOverlayWorkerMessage } from '@/types/effects'

const workerScope = self as unknown as AnimationWorkerScope<TopCanvasFilmOverlayWorkerMessage>

let canvas: OffscreenCanvas | null = null
let ctx: OffscreenCanvasRenderingContext2D | null = null
let particles: FilmParticle[] = []
let width = 1
let height = 1
let dpr = 1
let isHome = false
let prefersReducedMotion = false
let animationHandle = 0
let timeoutHandle: ReturnType<typeof setTimeout> | null = null
let lastFrameTime = 0

const particleCount = 24

const scheduleFrame = (callback: FrameRequestCallback) => {
  if (workerScope.requestAnimationFrame) {
    animationHandle = workerScope.requestAnimationFrame(callback)
    return
  }

  timeoutHandle = workerScope.setTimeout(() => {
    callback(performance.now())
  }, 16)
}

const cancelScheduledFrame = () => {
  if (animationHandle && workerScope.cancelAnimationFrame) {
    workerScope.cancelAnimationFrame(animationHandle)
  }
  if (timeoutHandle) {
    workerScope.clearTimeout(timeoutHandle)
  }
  animationHandle = 0
  timeoutHandle = null
}

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

const rebuildParticles = () => {
  particles = []
  for (let i = 0; i < particleCount; i += 1) {
    particles.push(createParticle())
  }
}

const resizeCanvas = (nextWidth: number, nextHeight: number, nextDpr: number) => {
  if (!canvas || !ctx) return

  width = Math.max(1, nextWidth)
  height = Math.max(1, nextHeight)
  dpr = Math.max(1, nextDpr)

  const pixelWidth = Math.max(1, Math.floor(width * dpr))
  const pixelHeight = Math.max(1, Math.floor(height * dpr))

  if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
    canvas.width = pixelWidth
    canvas.height = pixelHeight
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    rebuildParticles()
  }
}

const drawFilm = (time: number) => {
  const context = ctx
  if (!context) return

  context.clearRect(0, 0, width, height)
  context.globalCompositeOperation = 'screen'

  const drawOrb = (
    x: number,
    y: number,
    radius: number,
    hueA: number,
    hueB: number,
    alpha: number,
  ) => {
    const orb = context.createRadialGradient(x, y, 0, x, y, radius)
    orb.addColorStop(0, `hsla(${hueA}, 94%, 72%, ${alpha})`)
    orb.addColorStop(0.24, `hsla(${hueB}, 92%, 68%, ${alpha * 0.68})`)
    orb.addColorStop(0.58, `hsla(${(hueA + 70) % 360}, 90%, 64%, ${alpha * 0.25})`)
    orb.addColorStop(1, `hsla(${hueB}, 90%, 64%, 0)`)
    context.fillStyle = orb
    context.fillRect(0, 0, width, height)
  }

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

  const wash = context.createLinearGradient(
    width * (0.25 + Math.sin(time * 0.08) * 0.08),
    0,
    width * (0.8 + Math.cos(time * 0.06) * 0.08),
    height,
  )
  wash.addColorStop(0, `hsla(${280 + Math.sin(time * 0.12) * 20}, 82%, 62%, 0.08)`)
  wash.addColorStop(0.5, `hsla(${185 + Math.cos(time * 0.09) * 24}, 88%, 64%, 0.058)`)
  wash.addColorStop(1, `hsla(${45 + Math.sin(time * 0.1) * 18}, 92%, 64%, 0.07)`)
  context.fillStyle = wash
  context.fillRect(0, 0, width, height)

  for (let i = 0; i < 4; i += 1) {
    const x = ((time * 10 + i * width * 0.42) % (width * 1.4)) - width * 0.2
    const band = context.createLinearGradient(x - 180, 0, x + 180, height)
    band.addColorStop(0, 'hsla(0, 0%, 100%, 0)')
    band.addColorStop(0.5, `hsla(${(time * 12 + i * 55) % 360}, 95%, 76%, 0.034)`)
    band.addColorStop(1, 'hsla(0, 0%, 100%, 0)')
    context.fillStyle = band
    context.fillRect(0, 0, width, height)
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

    const glow = context.createRadialGradient(
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
    context.fillStyle = glow
    context.beginPath()
    context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
    context.fill()
  })

  context.globalCompositeOperation = 'source-over'
}

const render = (now: number) => {
  const frameInterval = prefersReducedMotion ? 1000 : 50

  if (now - lastFrameTime >= frameInterval) {
    lastFrameTime = now
    drawFilm(now * 0.001)
  }

  if (!prefersReducedMotion) {
    scheduleFrame(render)
  }
}

workerScope.onmessage = (event) => {
  const message = event.data

  if (message.type === 'init') {
    canvas = message.canvas
    ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    isHome = message.isHome
    prefersReducedMotion = message.prefersReducedMotion
    resizeCanvas(message.width, message.height, message.dpr)
    drawFilm(0)

    cancelScheduledFrame()
    if (!prefersReducedMotion) {
      lastFrameTime = performance.now()
      scheduleFrame(render)
    }
    return
  }

  if (message.type === 'resize') {
    resizeCanvas(message.width, message.height, message.dpr)
    drawFilm(performance.now() * 0.001)
    return
  }

  if (message.type === 'config') {
    isHome = message.isHome
    prefersReducedMotion = message.prefersReducedMotion
    drawFilm(performance.now() * 0.001)

    cancelScheduledFrame()
    if (!prefersReducedMotion) {
      lastFrameTime = performance.now()
      scheduleFrame(render)
    }
    return
  }

  if (message.type === 'destroy') {
    cancelScheduledFrame()
    particles = []
    canvas = null
    ctx = null
  }
}
