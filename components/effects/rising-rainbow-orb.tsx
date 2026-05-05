'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useIsMobile } from '@/hooks/use-mobile'
import type { Orb } from '@/types/effects'

export function RisingRainbowOrb() {
  const pathname = usePathname()
  // TOPページでは2個、下層ページでは1個
  const orbCount = pathname === '/' ? 2 : 1
  const containerRef = useRef<HTMLDivElement>(null)
  const orbsRef = useRef<Orb[]>([])
  const animationRef = useRef<number>(0)
  const [orbs, setOrbs] = useState<Orb[]>([])
  const [logoActivated, setLogoActivated] = useState(false)
  const [hasScrolled, setHasScrolled] = useState(false)
  const isMobile = useIsMobile()

  // 初回スクロールを合図にオーブを出現させる。初期表示では負荷と視覚ノイズを抑える。
  useEffect(() => {
    if (isMobile) return

    const handleScroll = () => {
      if (!hasScrolled && window.scrollY > 50) {
        setHasScrolled(true)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isMobile, hasScrolled])

  // すべてのオーブがフッターロゴに吸収されたら、ロゴ側を虹色アニメーションへ切り替える。
  useEffect(() => {
    if (!logoActivated) return

    const logo = document.getElementById('footer-logo')
    if (logo) {
      logo.style.background = 'linear-gradient(90deg, oklch(0.75 0.2 0), oklch(0.75 0.2 60), oklch(0.75 0.2 120), oklch(0.75 0.2 180), oklch(0.75 0.2 240), oklch(0.75 0.2 300), oklch(0.75 0.2 360))'
      logo.style.backgroundSize = '200% 100%'
      logo.style.webkitBackgroundClip = 'text'
      logo.style.backgroundClip = 'text'
      logo.style.webkitTextFillColor = 'transparent'
      logo.style.animation = 'rainbow-flow 3s linear infinite'
    }
  }, [logoActivated])

  useEffect(() => {
    if (isMobile) return

    // オーブは画面下で待機させ、スクロール後に浮遊フェーズへ移す。
    const initialOrbs: Orb[] = []
    for (let i = 0; i < orbCount; i++) {
      initialOrbs.push({
        id: i,
        x: 20 + (i * 30) + Math.random() * 20, // 左右に分散
        y: 115,
        vx: 0,
        vy: 0,
        hue: (i * 180 + Math.random() * 60) % 360, // 色相をずらす
        size: 32,
        phase: 'hidden',
        targetX: 50,
        targetY: 115,
      })
    }
    orbsRef.current = initialOrbs
    setOrbs(initialOrbs)

    let lastTime = performance.now()

    // 複数のsin波を重ね、軽量な擬似ノイズとして自然な揺れを作る。
    const noise = (t: number, seed: number) => {
      return (
        Math.sin(t * 0.7 + seed) * 0.5 +
        Math.sin(t * 1.3 + seed * 2.1) * 0.3 +
        Math.sin(t * 2.1 + seed * 0.7) * 0.2
      )
    }

    const animate = (currentTime: number) => {
      const deltaTime = Math.min(currentTime - lastTime, 50)
      lastTime = currentTime

      if (orbsRef.current.length === 0) {
        animationRef.current = requestAnimationFrame(animate)
        return
      }

      const time = currentTime * 0.001

      // フッターロゴが見えているかを確認し、吸収先の座標として使う。
      const logo = document.getElementById('footer-logo')
      let logoRect: DOMRect | null = null
      if (logo) {
        logoRect = logo.getBoundingClientRect()
      }

      let allAbsorbed = true
      const updatedOrbs = orbsRef.current.map((currentOrb, index) => {
        let newX = currentOrb.x
        let newY = currentOrb.y
        let newVx = currentOrb.vx
        let newVy = currentOrb.vy
        let newPhase = currentOrb.phase
        let targetX = currentOrb.targetX
        let targetY = currentOrb.targetY

        if (currentOrb.phase !== 'absorbed') {
          allAbsorbed = false
        }

        if (currentOrb.phase === 'hidden') {
          // スクロールで起動されるまでは非表示のまま待機する。
        } else if (currentOrb.phase === 'floating') {
          // ノイズと速度減衰で、物理っぽい浮遊に見せる。
          const dt = deltaTime * 0.001

          // オーブごとにseedを変え、同じ動きに見えない有機的な揺れを加える。
          const noiseX = noise(time * 0.4, index * 100) * 12
          const noiseY = noise(time * 0.35, index * 100 + 50) * 8

          // 序盤は強め、上がってからは弱めの上昇力をかける。
          const upwardForce = currentOrb.y > 50 ? -15 : -2

          // 画面外へ出すぎないよう、柔らかい壁のような反発力を与える。
          const leftBound = 15 + index * 5
          const rightBound = 85 - index * 5
          const boundaryForceX = currentOrb.x < leftBound ? (leftBound - currentOrb.x) * 0.5 :
                                 currentOrb.x > rightBound ? (rightBound - currentOrb.x) * 0.5 : 0
          const boundaryForceY = currentOrb.y < 25 ? (25 - currentOrb.y) * 0.3 :
                                 currentOrb.y > 85 ? (85 - currentOrb.y) * 0.3 : 0

          // 各力を速度へ反映し、減衰で暴れすぎを抑える。
          newVx = currentOrb.vx * 0.98 + (noiseX + boundaryForceX) * dt
          newVy = currentOrb.vy * 0.98 + (noiseY + upwardForce + boundaryForceY) * dt

          // 急加速を防ぐため速度の上限を決める。
          const maxVel = 1.5
          newVx = Math.max(-maxVel, Math.min(maxVel, newVx))
          newVy = Math.max(-maxVel, Math.min(maxVel, newVy))

          // 速度を位置へ反映する。
          newX = currentOrb.x + newVx
          newY = currentOrb.y + newVy

          // ある程度上昇してから、見えているフッターロゴへの吸収へ切り替える。
          if (currentOrb.y < 70 && logoRect) {
            const logoInView = logoRect.top < window.innerHeight && logoRect.bottom > 0
            if (logoInView) {
              newPhase = 'attracted'
              targetX = ((logoRect.left + logoRect.width / 2) / window.innerWidth) * 100
              targetY = ((logoRect.top + logoRect.height / 2) / window.innerHeight) * 100
            }
          }
        } else if (currentOrb.phase === 'attracted') {
          // スクロールでロゴ位置が変わるため、吸収中も目標座標を更新する。
          if (logoRect) {
            targetX = ((logoRect.left + logoRect.width / 2) / window.innerWidth) * 100
            targetY = ((logoRect.top + logoRect.height / 2) / window.innerHeight) * 100
          }

          const dx = targetX - currentOrb.x
          const dy = targetY - currentOrb.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          // 近づくほど吸い込まれる印象が強くなるよう、距離に応じて加速を変える。
          const attractionStrength = 0.02 + (1 / (distance + 5)) * 0.08

          // 直線的に吸い込まれないよう、螺旋状の揺れを少し混ぜる。
          const spiralPhase = time * 3 + index * Math.PI
          const spiralRadius = Math.max(0, distance * 0.15)
          const spiralX = Math.cos(spiralPhase) * spiralRadius
          const spiralY = Math.sin(spiralPhase) * spiralRadius

          // 吸引力と螺旋成分を合成して位置を進める。
          newVx = currentOrb.vx * 0.92 + dx * attractionStrength
          newVy = currentOrb.vy * 0.92 + dy * attractionStrength

          newX = currentOrb.x + newVx + spiralX * 0.05
          newY = currentOrb.y + newVy + spiralY * 0.05

          // 十分近づいたら吸収済みとして描画対象から外す。
          if (distance < 2) {
            newPhase = 'absorbed'
          }
        } else if (currentOrb.phase === 'absorbed') {
          // 吸収後はロゴ位置に固定し、ロゴ側の虹色演出へつなげる。
          if (logoRect) {
            newX = ((logoRect.left + logoRect.width / 2) / window.innerWidth) * 100
            newY = ((logoRect.top + logoRect.height / 2) / window.innerHeight) * 100
          }
        }

        // オーブごとに少し違う速度で色相を回す。
        const newHue = (currentOrb.hue + deltaTime * (0.02 + index * 0.01)) % 360

        return {
          ...currentOrb,
          x: newX,
          y: newY,
          vx: newVx,
          vy: newVy,
          hue: newHue,
          phase: newPhase,
          targetX,
          targetY,
        }
      })

      // 全オーブ吸収後にフッターロゴを起動する。
      if (allAbsorbed && updatedOrbs.length > 0 && updatedOrbs.every(o => o.phase === 'absorbed')) {
        setLogoActivated(true)
      }

      orbsRef.current = updatedOrbs
      setOrbs([...updatedOrbs])
      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animationRef.current)
    }
  }, [isMobile, orbCount])

  // 初回スクロール後、待機中のオーブを浮遊フェーズへ進める。
  useEffect(() => {
    if (hasScrolled && orbsRef.current.length > 0) {
      const hasHiddenOrbs = orbsRef.current.some(o => o.phase === 'hidden')
      if (hasHiddenOrbs) {
        orbsRef.current = orbsRef.current.map(orb => ({
          ...orb,
          phase: orb.phase === 'hidden' ? 'floating' : orb.phase,
        }))
        setOrbs([...orbsRef.current])
      }
    }
  }, [hasScrolled])

  if (isMobile || orbs.length === 0) return null

  // 非表示中・吸収済みのオーブは描画しない。
  const visibleOrbs = orbs.filter(orb => orb.phase !== 'hidden' && orb.phase !== 'absorbed')

  if (visibleOrbs.length === 0) return null

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[85] overflow-hidden"
    >
      {/* ロゴ吸収後に使う虹色アニメーション定義 */}
      <style jsx global>{`
        @keyframes rainbow-flow {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
      `}</style>

      {/* 表示中のオーブを描画 */}
      {visibleOrbs.map((orb) => (
        <div
          key={orb.id}
          className="absolute transition-transform duration-100"
          style={{
            left: `${orb.x}%`,
            top: `${orb.y}%`,
            transform: 'translate(-50%, -50%)',
            opacity: orb.phase === 'attracted' ? Math.max(0.3, 1 - (1 / (Math.sqrt((orb.targetX - orb.x) ** 2 + (orb.targetY - orb.y) ** 2) + 1)) * 0.7) : 1,
          }}
        >
          {/* 外側の空気感を作る発光 */}
          <div
            className="absolute rounded-full"
            style={{
              width: orb.size * 5,
              height: orb.size * 5,
              left: -orb.size * 2,
              top: -orb.size * 2,
              background: `radial-gradient(circle, oklch(0.85 0.18 ${orb.hue} / 0.12), oklch(0.8 0.15 ${(orb.hue + 40) % 360} / 0.06), transparent 70%)`,
              filter: 'blur(25px)',
            }}
          />

          {/* 中間の発光レイヤー */}
          <div
            className="absolute rounded-full"
            style={{
              width: orb.size * 3,
              height: orb.size * 3,
              left: -orb.size,
              top: -orb.size,
              background: `radial-gradient(circle, oklch(0.88 0.22 ${orb.hue} / 0.3), oklch(0.82 0.2 ${(orb.hue + 60) % 360} / 0.15), transparent 70%)`,
              filter: 'blur(15px)',
            }}
          />

          {/* 中心の柔らかい核 */}
          <div
            className="relative rounded-full"
            style={{
              width: orb.size,
              height: orb.size,
              background: `radial-gradient(circle at 40% 35%, oklch(0.98 0.06 ${orb.hue} / 0.85), oklch(0.9 0.16 ${(orb.hue + 30) % 360} / 0.6), oklch(0.8 0.2 ${(orb.hue + 60) % 360} / 0.3), transparent 80%)`,
              filter: 'blur(6px)',
              boxShadow: `0 0 ${orb.size * 0.6}px oklch(0.85 0.2 ${orb.hue} / 0.4), 0 0 ${orb.size * 1.2}px oklch(0.8 0.18 ${(orb.hue + 40) % 360} / 0.25)`,
            }}
          />
        </div>
      ))}
    </div>
  )
}
