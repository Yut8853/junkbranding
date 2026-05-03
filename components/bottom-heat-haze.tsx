'use client';

import { useEffect, useRef, useState } from 'react';

const VERTEX_SHADER_SOURCE = `
  attribute vec2 a_position;

  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER_SOURCE = `
  precision mediump float;

  uniform float u_time;
  uniform vec2 u_resolution;

  vec3 rainbow(float t) {
    return 0.58 + 0.42 * cos(6.28318 * (vec3(0.0, 0.33, 0.67) + t));
  }

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(
      mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;

    for (int i = 0; i < 4; i++) {
      value += amplitude * noise(p);
      p *= 2.05;
      amplitude *= 0.5;
    }

    return value;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    vec2 smokeUv = uv * vec2(4.2, 2.25);
    smokeUv.x += sin(uv.y * 8.0 + u_time * 1.55) * 0.28;
    smokeUv.x += sin(uv.y * 15.0 - u_time * 1.2) * 0.12;
    smokeUv.y -= u_time * 0.42;

    float softNoise = fbm(smokeUv + vec2(u_time * 0.18, 0.0));
    float detailNoise = fbm(smokeUv * 2.8 - vec2(u_time * 0.28, u_time * 0.12));
    float plumes = sin(uv.x * 13.0 + softNoise * 7.2 + u_time * 1.45) * 0.5 + 0.5;
    float heightNoise = fbm(vec2(uv.x * 5.0 + u_time * 0.24, u_time * 0.18));
    float heightLimit = 0.42 + heightNoise * 0.48 + plumes * 0.18;
    float irregularTop = smoothstep(heightLimit, heightLimit - 0.28, uv.y);
    float bottomWeight = smoothstep(1.0, 0.06, uv.y);
    float verticalFade = pow(1.0 - uv.y, 1.45);
    float smokeShape = smoothstep(0.12, 0.68, verticalFade + softNoise * 0.52 + plumes * 0.24 - uv.y * 0.28);
    float wisps = smoothstep(0.32, 0.86, detailNoise + plumes * 0.2) * bottomWeight;
    vec3 color = rainbow(uv.x * 0.72 + u_time * 0.045 + softNoise * 0.12);
    float alpha = (smokeShape * 0.78 + wisps * 0.42) * verticalFade * irregularTop;
    alpha += (1.0 - smoothstep(0.0, 0.2, uv.y)) * 0.36;

    gl_FragColor = vec4(color, min(alpha, 0.96));
  }
`;

function createShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string,
): WebGLShader | null {
  const shader = gl.createShader(type);

  if (!shader) {
    return null;
  }

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

function createProgram(gl: WebGLRenderingContext): WebGLProgram | null {
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER_SOURCE);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SOURCE);

  if (!vertexShader || !fragmentShader) {
    return null;
  }

  const program = gl.createProgram();

  if (!program) {
    return null;
  }

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program);
    return null;
  }

  return program;
}

export function BottomHeatHaze() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [useFallback, setUseFallback] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const gl = canvas.getContext('webgl', {
      alpha: true,
      antialias: false,
      depth: false,
      premultipliedAlpha: true,
      preserveDrawingBuffer: false,
      stencil: false,
    });

    if (!gl) {
      setUseFallback(true);
      return;
    }

    const program = createProgram(gl);

    if (!program) {
      setUseFallback(true);
      return;
    }

    const positionBuffer = gl.createBuffer();
    const positionLocation = gl.getAttribLocation(program, 'a_position');
    const timeLocation = gl.getUniformLocation(program, 'u_time');
    const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let animationFrameId = 0;
    let lastFrameTime = 0;
    let width = 0;
    let height = 0;

    if (!positionBuffer || positionLocation < 0 || !timeLocation || !resolutionLocation) {
      gl.deleteProgram(program);
      setUseFallback(true);
      return;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );

    gl.useProgram(program);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.25);
      width = Math.max(1, Math.floor(window.innerWidth * dpr));
      height = Math.max(1, Math.floor(canvas.clientHeight * dpr));

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }
    };

    const render = (now: number) => {
      const frameInterval = prefersReducedMotion ? 90 : 33;

      if (now - lastFrameTime >= frameInterval) {
        lastFrameTime = now;
        resize();
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.uniform1f(timeLocation, now * 0.001);
        gl.uniform2f(resolutionLocation, width, height);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      }

      animationFrameId = window.requestAnimationFrame(render);
    };

    resize();
    animationFrameId = window.requestAnimationFrame(render);
    window.addEventListener('resize', resize, { passive: true });

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      gl.deleteBuffer(positionBuffer);
      gl.deleteProgram(program);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="bottom-heat-haze pointer-events-none fixed inset-x-0 bottom-0 z-[80] h-[100px] overflow-hidden"
    >
      <div className="haze-plume haze-plume-a" />
      <div className="haze-plume haze-plume-b" />
      <div className="haze-plume haze-plume-c" />
      <div className="haze-plume haze-plume-d" />
      <div className="haze-plume haze-plume-e" />
      <div className="haze-plume haze-plume-f" />
      <canvas
        ref={canvasRef}
        className={`relative h-full w-full mix-blend-screen ${useFallback ? 'hidden' : 'block'}`}
      />
      {useFallback && (
        <div className="haze-fallback" />
      )}
    </div>
  );
}
