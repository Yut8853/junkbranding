'use client';

import { useEffect, useRef, useState } from 'react';
import {
  HEAT_HAZE_VERTEX_SHADER_SOURCE,
  MENU_HEAT_HAZE_FRAGMENT_SHADER_SOURCE,
} from '@/lib/shaders/heat-haze-shaders';
import type { MenuHeatHazeBackgroundProps } from '@/types/navigation';

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
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, HEAT_HAZE_VERTEX_SHADER_SOURCE);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, MENU_HEAT_HAZE_FRAGMENT_SHADER_SOURCE);

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

export function MenuHeatHazeBackground({ progress, isOpen }: MenuHeatHazeBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const progressRef = useRef(progress);
  const [useFallback, setUseFallback] = useState(false);

  // Update progress ref
  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

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
    const progressLocation = gl.getUniformLocation(program, 'u_progress');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let animationFrameId = 0;
    let lastFrameTime = 0;
    let width = 0;
    let height = 0;

    if (!positionBuffer || positionLocation < 0 || !timeLocation || !resolutionLocation || !progressLocation) {
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
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = Math.max(1, Math.floor(window.innerWidth * dpr));
      height = Math.max(1, Math.floor(window.innerHeight * dpr));

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
        gl.uniform1f(progressLocation, progressRef.current);
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
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{
        opacity: isOpen || progress > 0 ? 1 : 0,
      }}
    >
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 w-full h-full ${useFallback ? 'hidden' : 'block'}`}
        style={{ mixBlendMode: 'screen' }}
      />
      {useFallback && (
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(
              to top,
              rgba(255, 200, 200, ${progress * 0.7}) 0%,
              rgba(255, 230, 200, ${progress * 0.6}) 20%,
              rgba(200, 255, 200, ${progress * 0.5}) 40%,
              rgba(200, 230, 255, ${progress * 0.5}) 60%,
              rgba(220, 200, 255, ${progress * 0.4}) 80%,
              transparent 100%
            )`,
            transform: `scaleY(${progress})`,
            transformOrigin: 'bottom',
          }}
        />
      )}
    </div>
  );
}
