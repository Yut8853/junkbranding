'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

export function PrivacyBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Particle animation logic
  useEffect(() => {
    if (!mounted) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize);

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      hue: number;
      alpha: number;
      life: number;
    }> = [];

    const createParticle = () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 1.5,
      vy: (Math.random() - 0.5) * 1.5,
      size: 3 + Math.random() * 6,
      hue: 280 + Math.random() * 100,
      alpha: 0.4 + Math.random() * 0.4,
      life: 0.5 + Math.random() * 0.5,
    });

    for (let i = 0; i < 80; i++) {
      particles.push(createParticle());
    }

    let rafId: number;
    const animate = () => {
      ctx.fillStyle = 'rgba(10, 10, 15, 0.12)';
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.003;
        p.alpha = p.life * 0.5;

        if (
          p.life <= 0 ||
          p.x < 0 ||
          p.x > window.innerWidth ||
          p.y < 0 ||
          p.y > window.innerHeight
        ) {
          particles[i] = createParticle();
        }

        ctx.beginPath();
        const gradient = ctx.createRadialGradient(
          p.x,
          p.y,
          0,
          p.x,
          p.y,
          p.size
        );
        gradient.addColorStop(0, `hsla(${p.hue}, 70%, 60%, ${p.alpha})`);
        gradient.addColorStop(1, `hsla(${p.hue}, 70%, 60%, 0)`);
        ctx.fillStyle = gradient;
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      rafId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(rafId);
    };
  }, [mounted]);

  if (!mounted) return null;

  // createPortalを使用してbodyの直下に背景をレンダリング
  // これにより、PageTransitionのtransformの影響を受けない
  return createPortal(
    <div
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: -1 }}
      id="privacy-background"
    >
      {/* ベースのグラデーション背景 */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(135deg, oklch(0.12 0.03 280), oklch(0.1 0.04 320), oklch(0.11 0.03 350))',
        }}
      />

      {/* Canvas: 画面全体に固定 */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* 装飾用オーブ */}
      <div className="absolute inset-0 opacity-20 overflow-hidden">
        <div
          className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full blur-[150px] animate-spin"
          style={{
            background:
              'conic-gradient(from 0deg, oklch(0.6 0.2 330), oklch(0.65 0.18 25), oklch(0.6 0.2 80), oklch(0.6 0.2 330))',
            animationDuration: '20s',
          }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full blur-[120px] animate-spin-reverse"
          style={{
            background:
              'conic-gradient(from 180deg, oklch(0.55 0.22 220), oklch(0.6 0.2 280), oklch(0.65 0.18 330), oklch(0.55 0.22 220))',
            animationDuration: '15s',
          }}
        />
      </div>
    </div>,
    document.body
  );
}
