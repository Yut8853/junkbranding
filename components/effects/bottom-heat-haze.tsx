'use client';

import { useEffect, useRef, useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  BOTTOM_HEAT_HAZE_FRAGMENT_SHADER_SOURCE,
  HEAT_HAZE_VERTEX_SHADER_SOURCE,
} from '@/lib/shaders/heat-haze-shaders';

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
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, BOTTOM_HEAT_HAZE_FRAGMENT_SHADER_SOURCE);

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
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile) {
      return;
    }

    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    // 画面下部だけの装飾なので、WebGLは必要最小限の設定で初期化する。
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
    let isVisible = document.visibilityState === 'visible';

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
      // 下部100pxの演出に過剰な解像度は不要なため、DPRを抑えてGPU負荷を下げる。
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
      // 常時60fpsにせず、煙として自然に見える範囲で更新頻度を制限する。
      const frameInterval = prefersReducedMotion ? 120 : 66;

      if (isVisible && now - lastFrameTime >= frameInterval) {
        lastFrameTime = now;
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.uniform1f(timeLocation, now * 0.001);
        gl.uniform2f(resolutionLocation, width, height);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      }

      animationFrameId = window.requestAnimationFrame(render);
    };

    const handleVisibilityChange = () => {
      isVisible = document.visibilityState === 'visible';
    };

    resize();
    animationFrameId = window.requestAnimationFrame(render);
    window.addEventListener('resize', resize, { passive: true });
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      gl.deleteBuffer(positionBuffer);
      gl.deleteProgram(program);
    };
  }, [isMobile]);

  if (isMobile) {
    return null;
  }

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
