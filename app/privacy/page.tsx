'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { TextReveal, SectionReveal, LineReveal } from '@/components/text-reveal'

export default function PrivacyPolicyPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Particle animation (same as loading screen)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1

    const resize = () => {
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const particles: Array<{
      x: number
      y: number
      vx: number
      vy: number
      size: number
      hue: number
      alpha: number
      life: number
    }> = []

    const createParticle = () => {
      return {
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        size: 3 + Math.random() * 6,
        hue: 280 + Math.random() * 100,
        alpha: 0.4 + Math.random() * 0.4,
        life: 0.5 + Math.random() * 0.5,
      }
    }

    for (let i = 0; i < 80; i++) {
      particles.push(createParticle())
    }

    let rafId: number
    const animate = () => {
      ctx.fillStyle = 'rgba(15, 15, 20, 0.08)'
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight)

      particles.forEach((p, i) => {
        p.x += p.vx
        p.y += p.vy
        p.life -= 0.003
        p.alpha = p.life * 0.5

        if (p.life <= 0 || p.x < 0 || p.x > window.innerWidth || p.y < 0 || p.y > window.innerHeight) {
          particles[i] = createParticle()
        }

        ctx.beginPath()
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size)
        gradient.addColorStop(0, `hsla(${p.hue}, 70%, 60%, ${p.alpha})`)
        gradient.addColorStop(1, `hsla(${p.hue}, 70%, 60%, 0)`)
        ctx.fillStyle = gradient
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
      })

      rafId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Dark gradient background */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          background: 'linear-gradient(135deg, oklch(0.12 0.03 280), oklch(0.1 0.04 320), oklch(0.11 0.03 350))',
        }}
      />

      {/* Animated particles */}
      <canvas 
        ref={canvasRef}
        className="fixed inset-0 z-[1] opacity-70"
      />

      {/* Gradient orbs */}
      <div className="fixed inset-0 z-[2] overflow-hidden pointer-events-none">
        <div 
          className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full blur-[150px] opacity-20 animate-spin"
          style={{
            background: 'conic-gradient(from 0deg, oklch(0.6 0.2 330), oklch(0.65 0.18 25), oklch(0.6 0.2 80), oklch(0.6 0.2 330))',
            animationDuration: '20s',
          }}
        />
        <div 
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full blur-[120px] opacity-15 animate-spin-reverse"
          style={{
            background: 'conic-gradient(from 180deg, oklch(0.55 0.22 220), oklch(0.6 0.2 280), oklch(0.65 0.18 330), oklch(0.55 0.22 220))',
            animationDuration: '15s',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen">
        {/* Main content */}
        <main className="container mx-auto px-6 md:px-12 py-32 md:py-40">
          <div className="max-w-3xl mx-auto">
            {/* Title */}
            <TextReveal
              text="Privacy Policy"
              as="h1"
              className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight"
              delay={0}
              gradient
            />
            <LineReveal delay={0.4}>
              <p className="text-white/50 text-sm uppercase tracking-wider mb-16">
                最終更新日: 2026年4月1日
              </p>
            </LineReveal>

            {/* Content sections */}
            <div className="space-y-12 text-white/80 leading-relaxed">
              <SectionReveal delay={0.5}>
                <section>
                  <h2 className="text-xl md:text-2xl font-semibold text-white mb-4">1. はじめに</h2>
                  <p className="text-pretty">
                    JunkBranding（以下「当社」）は、お客様のプライバシーを尊重し、個人情報の保護に努めています。本プライバシーポリシーは、当社がどのように個人情報を収集、使用、開示、保護するかについて説明します。
                  </p>
                </section>
              </SectionReveal>

              <SectionReveal delay={0.55}>
                <section>
                  <h2 className="text-xl md:text-2xl font-semibold text-white mb-4">2. 収集する情報</h2>
                  <p className="mb-4">当社は、以下の種類の情報を収集することがあります：</p>
                  <ul className="list-disc list-inside space-y-2 pl-4">
                    <li>お名前、メールアドレス、電話番号などの連絡先情報</li>
                    <li>会社名、役職などのビジネス情報</li>
                    <li>お問い合わせ内容やプロジェクトに関する情報</li>
                    <li>ウェブサイトの利用状況（アクセスログ、Cookie情報など）</li>
                  </ul>
                </section>
              </SectionReveal>

              <SectionReveal delay={0.6}>
                <section>
                  <h2 className="text-xl md:text-2xl font-semibold text-white mb-4">3. 情報の利用目的</h2>
                  <p className="mb-4">収集した情報は、以下の目的で利用します：</p>
                  <ul className="list-disc list-inside space-y-2 pl-4">
                    <li>お問い合わせへの対応およびサービスの提供</li>
                    <li>サービスの改善および新サービスの開発</li>
                    <li>マーケティング活動（お客様の同意がある場合）</li>
                    <li>法的義務の遵守</li>
                  </ul>
                </section>
              </SectionReveal>

              <SectionReveal delay={0.65}>
                <section>
                  <h2 className="text-xl md:text-2xl font-semibold text-white mb-4">4. Cookieの使用</h2>
                  <p className="mb-4 text-pretty">
                    当社のウェブサイトでは、ユーザー体験の向上およびアクセス解析のためにCookieを使用しています。Cookieは、お客様のブラウザに保存される小さなテキストファイルです。
                  </p>
                  <p className="text-pretty">
                    ブラウザの設定でCookieを無効にすることができますが、その場合、ウェブサイトの一部機能が正常に動作しない可能性があります。
                  </p>
                </section>
              </SectionReveal>

              <SectionReveal delay={0.7}>
                <section>
                  <h2 className="text-xl md:text-2xl font-semibold text-white mb-4">5. 情報の共有</h2>
                  <p className="mb-4 text-pretty">
                    当社は、以下の場合を除き、お客様の個人情報を第三者と共有することはありません。
                  </p>
                  <ul className="list-disc list-inside space-y-2 pl-4">
                    <li>お客様の同意がある場合</li>
                    <li>法令に基づく開示が必要な場合</li>
                    <li>サービス提供に必要な業務委託先への提供（秘密保持契約を締結）</li>
                  </ul>
                </section>
              </SectionReveal>

              <SectionReveal delay={0.75}>
                <section>
                  <h2 className="text-xl md:text-2xl font-semibold text-white mb-4">6. 情報の保護</h2>
                  <p className="text-pretty">
                    当社は、個人情報の漏洩、紛失、改ざんを防止するため、適切な技術的・組織的セキュリティ対策を講じています。ただし、インターネット上での情報伝送は完全に安全とは言えないため、その点をご了承ください。
                  </p>
                </section>
              </SectionReveal>

              <SectionReveal delay={0.8}>
                <section>
                  <h2 className="text-xl md:text-2xl font-semibold text-white mb-4">7. お客様の権利</h2>
                  <p className="mb-4">お客様は、以下の権利を有します：</p>
                  <ul className="list-disc list-inside space-y-2 pl-4">
                    <li>個人情報へのアクセス権</li>
                    <li>個人情報の訂正・削除を求める権利</li>
                    <li>個人情報の処理に対する異議申し立ての権利</li>
                    <li>マーケティング目的での連絡を停止する権利</li>
                  </ul>
                </section>
              </SectionReveal>

              <SectionReveal delay={0.85}>
                <section>
                  <h2 className="text-xl md:text-2xl font-semibold text-white mb-4">8. お問い合わせ</h2>
                  <p className="mb-4 text-pretty">
                    本プライバシーポリシーに関するご質問やお問い合わせは、以下の連絡先までお願いいたします。
                  </p>
                  <div className="bg-white/5 rounded-lg p-6 border border-white/10 space-y-1">
                    <p className="text-white font-medium mb-3">JunkBranding</p>
                    <p>〒300-0410 茨城県稲敷郡美浦村みどり台767-43</p>
                    <p>メール: hello@junkbranding.com</p>
                    <p>電話: 080-9155-0426</p>
                  </div>
                </section>
              </SectionReveal>

              <SectionReveal delay={0.9}>
                <section>
                  <h2 className="text-xl md:text-2xl font-semibold text-white mb-4">9. ポリシーの変更</h2>
                  <p className="text-pretty">
                    当社は、必要に応じて本プライバシーポリシーを変更することがあります。変更があった場合は、本ページで通知いたします。定期的に本ページをご確認いただくことをお勧めします。
                  </p>
                </section>
              </SectionReveal>
            </div>

            {/* Back link */}
            <SectionReveal delay={0.95}>
              <div className="mt-20 pt-12 border-t border-white/10">
                <Link 
                  href="/"
                  className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>トップページに戻る</span>
                </Link>
              </div>
            </SectionReveal>
          </div>
        </main>
      </div>
    </div>
  )
}
