'use client'

import { useEffect, useRef, useState } from 'react'
import { useIsMobile } from '@/hooks/use-mobile'

const VERTEX_SHADER_SOURCE = `
  attribute vec2 a_position;

  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`

const FRAGMENT_SHADER_SOURCE = `
  precision mediump float;

  uniform vec2 u_resolution;
  uniform vec2 u_pointer;
  uniform float u_time;
  uniform float u_hue;
  uniform float u_intensity;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;

    for (int i = 0; i < 5; i++) {
      value += amplitude * noise(p);
      p *= 2.02;
      amplitude *= 0.52;
    }

    return value;
  }

  vec3 hsb2rgb(vec3 c) {
    vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
    rgb = rgb * rgb * (3.0 - 2.0 * rgb);
    return c.z * mix(vec3(1.0), rgb, c.y);
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    vec2 centeredUv = uv - 0.5;
    centeredUv.x *= u_resolution.x / max(u_resolution.y, 1.0);

    vec2 pointer = u_pointer;
    pointer.x *= u_resolution.x / max(u_resolution.y, 1.0);

    vec2 flowUv = centeredUv * 2.6;
    flowUv += vec2(sin(u_time * 0.3), cos(u_time * 0.22)) * 0.08;

    float distanceToPointer = length(centeredUv - pointer);
    float pointerWave = exp(-distanceToPointer * 6.0) * sin(distanceToPointer * 26.0 - u_time * 2.8);
    float field = fbm(flowUv + vec2(u_time * 0.08, -u_time * 0.11));
    float detail = fbm(flowUv * 2.1 - vec2(u_time * 0.13, u_time * 0.06));
    float contour = sin((field * 2.1 + detail * 1.2 + pointerWave * 0.65) * 8.2 - u_time * 1.4);
    float lines = smoothstep(0.76, 0.96, contour * 0.5 + 0.5);

    float radial = length(centeredUv * vec2(0.92, 1.15));
    float ring = smoothstep(0.24, 0.0, abs(radial - (0.24 + 0.03 * sin(u_time * 0.7 + field * 2.4))));
    float ribbon = smoothstep(0.09, 0.0, abs(centeredUv.x * 0.72 + sin(centeredUv.y * 6.2 + u_time * 0.9) * 0.05));
    float glow = smoothstep(0.82, 0.06, radial);

    float energy = lines * 0.72 + ring * 0.34 + ribbon * 0.18 + glow * 0.12;
    energy += pointerWave * 0.06 * u_intensity;

    vec3 base = vec3(0.93, 0.95, 0.99);
    vec3 accent = hsb2rgb(vec3(fract(u_hue + field * 0.14 + u_time * 0.01), 0.44, 0.98));
    vec3 secondary = hsb2rgb(vec3(fract(u_hue + 0.11 + detail * 0.08), 0.28, 0.96));
    vec3 color = base;
    color += accent * (lines * 0.42 + ring * 0.2);
    color += secondary * (ribbon * 0.26 + glow * 0.08);
    color += vec3(1.0) * exp(-distanceToPointer * 8.0) * 0.08 * u_intensity;

    float vignette = smoothstep(1.04, 0.16, radial);
    color = mix(base, color, vignette);

    gl_FragColor = vec4(color, clamp(0.62 + energy, 0.0, 0.92));
  }
`

function createShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)
  if (!shader) return null

  gl.shaderSource(shader, source)
  gl.compileShader(shader)

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader)
    return null
  }

  return shader
}

function createProgram(gl: WebGLRenderingContext) {
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER_SOURCE)
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SOURCE)

  if (!vertexShader || !fragmentShader) return null

  const program = gl.createProgram()
  if (!program) return null

  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)

  gl.deleteShader(vertexShader)
  gl.deleteShader(fragmentShader)

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program)
    return null
  }

  return program
}

type WorkSignalPanelProps = {
  title: string
  label: string
  accentHue: number
}

export function WorkSignalPanel({ title, label, accentHue }: WorkSignalPanelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const isMobile = useIsMobile()
  const [useFallback, setUseFallback] = useState(false)

  useEffect(() => {
    if (isMobile) return

    const canvas = canvasRef.current
    const wrapper = wrapperRef.current
    if (!canvas || !wrapper) return

    const gl = canvas.getContext('webgl', {
      alpha: true,
      antialias: false,
      depth: false,
      premultipliedAlpha: true,
      preserveDrawingBuffer: false,
      stencil: false,
    })

    if (!gl) {
      setUseFallback(true)
      return
    }

    const program = createProgram(gl)
    if (!program) {
      setUseFallback(true)
      return
    }

    const positionBuffer = gl.createBuffer()
    const positionLocation = gl.getAttribLocation(program, 'a_position')
    const timeLocation = gl.getUniformLocation(program, 'u_time')
    const resolutionLocation = gl.getUniformLocation(program, 'u_resolution')
    const pointerLocation = gl.getUniformLocation(program, 'u_pointer')
    const hueLocation = gl.getUniformLocation(program, 'u_hue')
    const intensityLocation = gl.getUniformLocation(program, 'u_intensity')

    if (
      !positionBuffer ||
      positionLocation < 0 ||
      !timeLocation ||
      !resolutionLocation ||
      !pointerLocation ||
      !hueLocation ||
      !intensityLocation
    ) {
      gl.deleteProgram(program)
      setUseFallback(true)
      return
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    )

    gl.useProgram(program)
    gl.enableVertexAttribArray(positionLocation)
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

    let animationFrameId = 0
    let width = 0
    let height = 0
    let isVisible = true
    let pointerCurrent = { x: 0, y: 0 }
    let pointerTarget = { x: 0, y: 0 }
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const resize = () => {
      const rect = wrapper.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      width = Math.max(1, Math.floor(rect.width * dpr))
      height = Math.max(1, Math.floor(rect.height * dpr))

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width
        canvas.height = height
        gl.viewport(0, 0, width, height)
      }
    }

    const handlePointerMove = (event: PointerEvent) => {
      const rect = wrapper.getBoundingClientRect()
      const normalizedX = (event.clientX - rect.left) / rect.width
      const normalizedY = (event.clientY - rect.top) / rect.height

      pointerTarget.x = Math.max(-0.5, Math.min(0.5, normalizedX - 0.5))
      pointerTarget.y = Math.max(-0.5, Math.min(0.5, 0.5 - normalizedY))
    }

    const handlePointerLeave = () => {
      pointerTarget.x = 0
      pointerTarget.y = 0
    }

    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry?.isIntersecting ?? false
      },
      { threshold: 0.2 }
    )

    const render = (now: number) => {
      pointerCurrent.x += (pointerTarget.x - pointerCurrent.x) * 0.08
      pointerCurrent.y += (pointerTarget.y - pointerCurrent.y) * 0.08

      if (isVisible) {
        gl.clearColor(0, 0, 0, 0)
        gl.clear(gl.COLOR_BUFFER_BIT)
        gl.uniform1f(timeLocation, now * 0.001)
        gl.uniform2f(resolutionLocation, width, height)
        gl.uniform2f(pointerLocation, pointerCurrent.x, pointerCurrent.y)
        gl.uniform1f(hueLocation, accentHue)
        gl.uniform1f(intensityLocation, prefersReducedMotion ? 0.35 : 1.0)
        gl.drawArrays(gl.TRIANGLES, 0, 6)
      }

      animationFrameId = window.requestAnimationFrame(render)
    }

    resize()
    visibilityObserver.observe(wrapper)
    wrapper.addEventListener('pointermove', handlePointerMove)
    wrapper.addEventListener('pointerleave', handlePointerLeave)
    window.addEventListener('resize', resize, { passive: true })
    animationFrameId = window.requestAnimationFrame(render)

    return () => {
      window.cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', resize)
      wrapper.removeEventListener('pointermove', handlePointerMove)
      wrapper.removeEventListener('pointerleave', handlePointerLeave)
      visibilityObserver.disconnect()
      gl.deleteBuffer(positionBuffer)
      gl.deleteProgram(program)
    }
  }, [accentHue, isMobile])

  return (
    <div
      ref={wrapperRef}
      className="relative overflow-hidden rounded-[1.7rem] border border-white/35 bg-[linear-gradient(135deg,rgba(255,255,255,0.88),rgba(244,247,255,0.78))] p-4 shadow-[0_18px_60px_rgba(120,138,176,0.16)]"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.75),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.46),transparent_32%,rgba(255,255,255,0.18))]" />
      <div className="relative z-10 mb-3 flex items-start justify-between gap-3">
        <div>
          <p className="type-label text-[10px] uppercase tracking-[0.24em] text-foreground/45">
            {label}
          </p>
          <p className="type-body-compact mt-2 max-w-[14rem] text-sm leading-6 text-foreground/78">
            {title}
          </p>
        </div>
        <div className="rounded-full border border-foreground/10 bg-white/55 px-3 py-1.5 text-[10px] uppercase tracking-[0.22em] text-foreground/45 backdrop-blur-sm">
          WebGL
        </div>
      </div>

      <div className="relative aspect-[16/10] overflow-hidden rounded-[1.35rem] border border-white/30 bg-[linear-gradient(135deg,rgba(255,255,255,0.92),rgba(231,238,255,0.72))]">
        <div className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(180deg,rgba(255,255,255,0.4),transparent_18%,transparent_82%,rgba(255,255,255,0.2))]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px bg-gradient-to-r from-transparent via-white to-transparent" />
        <div className="pointer-events-none absolute bottom-3 left-3 z-10 flex items-center gap-2 rounded-full border border-white/45 bg-white/58 px-3 py-1.5 backdrop-blur-sm">
          <span className="h-2 w-2 rounded-full bg-sky-400 shadow-[0_0_14px_rgba(56,189,248,0.45)]" />
          <span className="type-label text-[10px] uppercase tracking-[0.2em] text-foreground/52">
            Reactive Surface
          </span>
        </div>

        {!isMobile && !useFallback && (
          <canvas
            ref={canvasRef}
            className="absolute inset-0 h-full w-full"
            aria-hidden="true"
          />
        )}

        {(isMobile || useFallback) && (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_24%,rgba(255,160,210,0.18),transparent_24%),radial-gradient(circle_at_76%_38%,rgba(90,220,255,0.18),transparent_20%),linear-gradient(135deg,rgba(255,255,255,0.94),rgba(229,236,255,0.8))]">
            <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.12)_1px,transparent_1px)] bg-[size:100%_18px,18px_100%] opacity-35" />
          </div>
        )}
      </div>
    </div>
  )
}