'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Home } from 'lucide-react'
import type { NotFoundParticle } from '@/types/not-found'

export default function NotFound() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<NotFoundParticle[]>([])
  const mouseRef = useRef({ x: -1000, y: -1000, isPressed: false })
  const animationRef = useRef<number>(0)
  const [isExploded, setIsExploded] = useState(false)
  const [glitchText, setGlitchText] = useState('404')

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    let width = window.innerWidth
    let height = window.innerHeight

    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      initParticles()
    }

    // 一度Canvasへ「404」を描き、そのピクセルを粒子の目標座標として使う。
    const initParticles = () => {
      particlesRef.current = []
      
      // 文字形状をサンプリングするため、一時的にCanvasへ描画する。
      ctx.save()
      ctx.font = `bold ${Math.min(width * 0.35, 400)}px Inter, sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillStyle = 'white'
      ctx.fillText('404', width / 2, height / 2 - 50)
      
      const imageData = ctx.getImageData(0, 0, width * dpr, height * dpr)
      const pixels = imageData.data
      
      ctx.clearRect(0, 0, width, height)
      ctx.restore()

      // 不透明ピクセルだけを拾い、文字を構成する粒子へ変換する。
      const gap = Math.max(4, Math.floor(width / 200))
      for (let y = 0; y < height * dpr; y += gap * dpr) {
        for (let x = 0; x < width * dpr; x += gap * dpr) {
          const index = (y * width * dpr + x) * 4
          const alpha = pixels[index + 3]
          
          if (alpha > 128) {
            const px = x / dpr
            const py = y / dpr
            particlesRef.current.push({
              x: Math.random() * width,
              y: Math.random() * height,
              targetX: px,
              targetY: py,
              originX: px,
              originY: py,
              vx: 0,
              vy: 0,
              size: 1.5 + Math.random() * 2,
              hue: 280 + Math.random() * 80,
              isText: true,
            })
          }
        }
      }

      // 文字とは別に、背景を漂う環境粒子を追加する。
      const ambientCount = Math.min(100, Math.floor((width * height) / 15000))
      for (let i = 0; i < ambientCount; i++) {
        const x = Math.random() * width
        const y = Math.random() * height
        particlesRef.current.push({
          x,
          y,
          targetX: x,
          targetY: y,
          originX: x,
          originY: y,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: 1 + Math.random() * 2,
          hue: Math.random() * 360,
          isText: false,
        })
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX
      mouseRef.current.y = e.clientY
    }

    const handleMouseDown = () => {
      mouseRef.current.isPressed = true
      setIsExploded(true)
    }

    const handleMouseUp = () => {
      mouseRef.current.isPressed = false
      setTimeout(() => setIsExploded(false), 100)
    }

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouseRef.current.x = e.touches[0].clientX
        mouseRef.current.y = e.touches[0].clientY
        mouseRef.current.isPressed = true
        setIsExploded(true)
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouseRef.current.x = e.touches[0].clientX
        mouseRef.current.y = e.touches[0].clientY
      }
    }

    const handleTouchEnd = () => {
      mouseRef.current.isPressed = false
      setTimeout(() => setIsExploded(false), 100)
    }

    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)
    window.addEventListener('touchstart', handleTouchStart)
    window.addEventListener('touchmove', handleTouchMove)
    window.addEventListener('touchend', handleTouchEnd)

    resize()

    // 粒子の戻り・反発・発光を毎フレーム更新する。
    const animate = () => {
      ctx.fillStyle = 'rgba(15, 15, 20, 0.15)'
      ctx.fillRect(0, 0, width, height)

      const mouseX = mouseRef.current.x
      const mouseY = mouseRef.current.y
      const isPressed = mouseRef.current.isPressed

      particlesRef.current.forEach((p) => {
        if (p.isText) {
          // 文字粒子はマウスから逃げつつ、元の「404」形状へ戻る。
          const dx = mouseX - p.x
          const dy = mouseY - p.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          const maxDist = isPressed ? 250 : 150

          if (distance < maxDist) {
            // マウス位置から外向きの力を受ける。
            const force = (maxDist - distance) / maxDist
            const angle = Math.atan2(dy, dx)
            const repelStrength = isPressed ? 15 : 5
            p.vx -= Math.cos(angle) * force * repelStrength
            p.vy -= Math.sin(angle) * force * repelStrength
          }

          // 元の文字形状へ戻る力を加える。
          const returnForce = 0.03
          p.vx += (p.originX - p.x) * returnForce
          p.vy += (p.originY - p.y) * returnForce

          // 速度を減衰させながら位置へ反映する。
          p.vx *= 0.92
          p.vy *= 0.92
          p.x += p.vx
          p.y += p.vy

          // 文字粒子を描画する。
          const distFromOrigin = Math.sqrt(
            Math.pow(p.x - p.originX, 2) + Math.pow(p.y - p.originY, 2)
          )
          const alpha = Math.max(0.3, 1 - distFromOrigin / 300)
          
          ctx.beginPath()
          ctx.fillStyle = `hsla(${p.hue}, 70%, 75%, ${alpha})`
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
          ctx.fill()

          // 文字粒子の周囲に淡い発光を重ねる。
          const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 4)
          gradient.addColorStop(0, `hsla(${p.hue}, 80%, 70%, ${alpha * 0.3})`)
          gradient.addColorStop(1, `hsla(${p.hue}, 80%, 70%, 0)`)
          ctx.beginPath()
          ctx.fillStyle = gradient
          ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2)
          ctx.fill()
        } else {
          // 環境粒子は背景内をゆっくり漂う。
          p.x += p.vx
          p.y += p.vy

          // 画面端で反射させる。
          if (p.x < 0 || p.x > width) p.vx *= -1
          if (p.y < 0 || p.y > height) p.vy *= -1

          // 色相を少しずつ回して、静止画に見えないようにする。
          p.hue = (p.hue + 0.1) % 360

          // 環境粒子を描画する。
          ctx.beginPath()
          ctx.fillStyle = `hsla(${p.hue}, 60%, 70%, 0.4)`
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
          ctx.fill()
        }
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleTouchEnd)
      cancelAnimationFrame(animationRef.current)
    }
  }, [])

  // 装飾用テキストを一瞬だけ崩して、404画面にノイズ感を出す。
  useEffect(() => {
    const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?/\\~`'
    let interval: NodeJS.Timeout

    const glitch = () => {
      if (Math.random() > 0.95) {
        const chars = '404'.split('')
        const glitchedIndex = Math.floor(Math.random() * chars.length)
        chars[glitchedIndex] = glitchChars[Math.floor(Math.random() * glitchChars.length)]
        setGlitchText(chars.join(''))
        setTimeout(() => setGlitchText('404'), 50)
      }
    }

    interval = setInterval(glitch, 100)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0f0f14]">
      {/* 背景グラデーション */}
      <div 
        className="absolute inset-0 opacity-60"
        style={{
          background: 'radial-gradient(ellipse at 30% 20%, oklch(0.35 0.15 280) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, oklch(0.3 0.12 330) 0%, transparent 50%)',
        }}
      />

      {/* クリックやタップに反応するCanvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 cursor-crosshair"
      />

      {/* 前面のコンテンツ */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 pointer-events-none">
        {/* スクリーンリーダー向けの見出し */}
        <h1 className="sr-only">404 - ページが見つかりません</h1>

        {/* 装飾用のグリッチ文字 */}
        <div className="relative mb-8">
          <span 
            className="text-[12vw] md:text-[10vw] font-bold text-transparent opacity-10 select-none"
            style={{
              WebkitTextStroke: '1px rgba(255,255,255,0.1)',
            }}
            aria-hidden="true"
          >
            {glitchText}
          </span>
          
          {/* ずらして重ねるグリッチレイヤー */}
          <span 
            className="absolute inset-0 text-[12vw] md:text-[10vw] font-bold text-transparent opacity-20 select-none animate-pulse"
            style={{
              WebkitTextStroke: '1px rgba(139, 92, 246, 0.3)',
              transform: isExploded ? 'translate(-3px, -2px)' : 'none',
              transition: 'transform 0.1s',
            }}
            aria-hidden="true"
          >
            {glitchText}
          </span>
          <span 
            className="absolute inset-0 text-[12vw] md:text-[10vw] font-bold text-transparent opacity-20 select-none"
            style={{
              WebkitTextStroke: '1px rgba(236, 72, 153, 0.3)',
              transform: isExploded ? 'translate(3px, 2px)' : 'none',
              transition: 'transform 0.1s',
            }}
            aria-hidden="true"
          >
            {glitchText}
          </span>
        </div>

        {/* メッセージ */}
        <div className="text-center mb-12">
          <p className="type-body text-white/80 text-lg md:text-xl mb-2">
            迷子になってしまいましたね、、
          </p>
          <p className="text-white/50 text-sm md:text-base text-balance">
            ご不便おかけして申し訳ありません。。。。
          </p>
        </div>

        {/* 操作案内 */}
        <p className="text-white/30 text-xs md:text-sm mb-8 animate-pulse">
          画面をクリック or タップして遊んでみてください
        </p>

        {/* ナビゲーションボタン */}
        <div className="flex flex-col sm:flex-row items-center gap-4 pointer-events-auto">
          <Link
            href="/"
            className="group flex items-center gap-3 px-8 py-4 bg-white text-[#0f0f14] rounded-full font-medium hover:bg-white/90 transition-all duration-300"
          >
            <Home size={18} />
            <span>ホームに戻る</span>
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="group flex items-center gap-3 px-8 py-4 border border-white/30 text-white rounded-full font-medium hover:bg-white hover:text-[#0f0f14] transition-all duration-300"
          >
            <ArrowLeft size={18} />
            <span>前のページに戻る</span>
          </button>
        </div>
      </div>

      {/* スキャンライン風のノイズ */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)',
        }}
        aria-hidden="true"
      />

      {/* 画面四隅の装飾テキスト */}
      <div className="type-label absolute top-8 left-8 text-white/20 text-xs font-mono">
        ERROR_404
      </div>
      <div className="type-label absolute top-8 right-8 text-white/20 text-xs font-mono">
        PAGE_NOT_FOUND
      </div>
      <div className="absolute bottom-8 left-8 text-white/20 text-xs font-mono">
        {new Date().toISOString().split('T')[0]}
      </div>
      <div className="absolute bottom-8 right-8 text-white/20 text-xs font-mono">
        JUNKBRANDING.COM
      </div>
    </div>
  )
}
