import type { AnimationWorkerScope, FloatingParticle, FloatingParticlesWorkerMessage } from '@/types/effects'

const workerScope = self as unknown as AnimationWorkerScope<FloatingParticlesWorkerMessage>

let canvas: OffscreenCanvas | null = null
let ctx: OffscreenCanvasRenderingContext2D | null = null
let particles: FloatingParticle[] = []
let width = 1
let height = 1
let isLowPowerDevice = false
let isPageVisible = true
let isTransitioning = false
let transitionIntensity = 0
let time = 0
let lastFrameTime = 0
let animationHandle = 0
let timeoutHandle: ReturnType<typeof setTimeout> | null = null

const mouse = { x: 0, y: 0 }
const targetMouse = { x: 0, y: 0 }
const attractionRadius = 400
const attractionRadiusSq = attractionRadius * attractionRadius
const attractionStrength = 0.25

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

const initParticles = () => {
  particles = []
  const maxParticles = isLowPowerDevice ? 18 : 32
  const particleDensity = isLowPowerDevice ? 52000 : 32000
  const count = Math.min(maxParticles, Math.floor((width * height) / particleDensity))

  for (let i = 0; i < count; i += 1) {
    const hue = Math.random() * 360
    const x = Math.random() * width * 1.5 - width * 0.25
    const y = Math.random() * height

    particles.push({
      x,
      y,
      baseX: x,
      baseY: y,
      vx: 0,
      vy: 0,
      size: 1 + Math.random() * 2.5,
      hue,
      speed: 0.15 + Math.random() * 0.3,
      amplitude: 20 + Math.random() * 50,
      frequency: 0.0004 + Math.random() * 0.001,
      phase: Math.random() * Math.PI * 2,
      opacity: 0.7 + Math.random() * 0.3,
    })
  }
}

const resizeCanvas = (nextWidth: number, nextHeight: number) => {
  if (!canvas || !ctx) return

  width = Math.max(1, Math.floor(nextWidth))
  height = Math.max(1, Math.floor(nextHeight))
  canvas.width = width
  canvas.height = height
  ctx.setTransform(1, 0, 0, 1, 0, 0)
  initParticles()
}

const render = (currentTime: number) => {
  const context = ctx
  if (!context) return

  if (!isPageVisible) {
    scheduleFrame(render)
    return
  }

  const frameInterval = isTransitioning ? 33 : isLowPowerDevice ? 80 : 50
  if (currentTime - lastFrameTime < frameInterval) {
    scheduleFrame(render)
    return
  }

  lastFrameTime = currentTime
  time += 1

  const transitionTarget = isTransitioning ? 1 : 0
  const intensityEase = transitionTarget ? 0.16 : 0.045
  transitionIntensity += (transitionTarget - transitionIntensity) * intensityEase

  mouse.x += (targetMouse.x - mouse.x) * 0.25
  mouse.y += (targetMouse.y - mouse.y) * 0.25

  context.clearRect(0, 0, width, height)

  particles.forEach((particle) => {
    particle.baseX += particle.speed

    const wave = Math.sin(time * particle.frequency + particle.phase) * particle.amplitude
    const dx = mouse.x - particle.x
    const dy = mouse.y - particle.y
    const distanceSq = dx * dx + dy * dy

    let proximity = 0
    if (distanceSq < attractionRadiusSq && distanceSq > 0) {
      const distance = Math.sqrt(distanceSq)
      const force = (1 - distance / attractionRadius) * attractionStrength
      proximity = 1 - distance / attractionRadius
      particle.vx += (dx / distance) * force * 4
      particle.vy += (dy / distance) * force * 4
    }

    particle.x += particle.vx
    particle.y += particle.vy
    particle.vx *= 0.88
    particle.vy *= 0.88

    particle.x += (particle.baseX - particle.x) * 0.02
    particle.y += (particle.baseY + wave - particle.y) * 0.02

    if (particle.baseX > width + 50) {
      particle.baseX = -30
      particle.x = -30
      particle.baseY = Math.random() * height
      particle.y = particle.baseY
      particle.hue = Math.random() * 360
    }

    particle.hue = (particle.hue + 0.015 + proximity * 3) % 360

    const glowSize = particle.size * (58 - 18 * transitionIntensity)
    const gradient = context.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, glowSize)
    const alpha = particle.opacity * (0.6 + 0.35 * transitionIntensity)
    const coreLightness = 80 - 18 * transitionIntensity
    const midLightness = 70 - 12 * transitionIntensity

    gradient.addColorStop(0, `hsla(${particle.hue}, 88%, ${coreLightness}%, ${alpha})`)
    gradient.addColorStop(0.45, `hsla(${particle.hue}, 78%, ${midLightness}%, ${alpha * (0.3 + 0.15 * transitionIntensity)})`)
    gradient.addColorStop(1, `hsla(${particle.hue}, 60%, 65%, 0)`)

    context.beginPath()
    context.fillStyle = gradient
    context.arc(particle.x, particle.y, glowSize, 0, Math.PI * 2)
    context.fill()

    if (transitionIntensity > 0.02) {
      context.beginPath()
      context.fillStyle = `hsla(${particle.hue}, 95%, 50%, ${Math.min(0.9, particle.opacity) * transitionIntensity})`
      context.arc(particle.x, particle.y, Math.max(2.4, particle.size * 1.5), 0, Math.PI * 2)
      context.fill()
    }
  })

  scheduleFrame(render)
}

workerScope.onmessage = (event) => {
  const message = event.data

  if (message.type === 'init') {
    canvas = message.canvas
    isLowPowerDevice = message.isLowPowerDevice
    ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return
    resizeCanvas(message.width, message.height)
    lastFrameTime = performance.now()
    cancelScheduledFrame()
    scheduleFrame(render)
    return
  }

  if (message.type === 'resize') {
    resizeCanvas(message.width, message.height)
    return
  }

  if (message.type === 'mouse') {
    targetMouse.x = message.x
    targetMouse.y = message.y
    return
  }

  if (message.type === 'visibility') {
    isPageVisible = message.visible
    if (isPageVisible) {
      lastFrameTime = performance.now()
    }
    return
  }

  if (message.type === 'transition') {
    isTransitioning = message.active
    return
  }

  if (message.type === 'destroy') {
    cancelScheduledFrame()
    particles = []
    canvas = null
    ctx = null
  }
}
