'use client'

import dynamic from 'next/dynamic'
import { useLayoutEffect, useState } from 'react'
import Link from 'next/link'
import { homeAboutPreview, homeArea, homeWorksPreview } from '@/content/home-page'
import { Footer } from '@/components/footer'

const HomeDesktopPage = dynamic(
  () => import('@/components/pages/home/home-desktop-page').then((mod) => mod.HomeDesktopPage),
  {
    loading: () => null,
  },
)

const mobileServices = [
  {
    title: 'Web Design',
    titleJa: 'Webデザイン',
    description: 'ブランドの世界観とユーザー導線を両立したWebサイトを設計します。',
  },
  {
    title: 'Branding',
    titleJa: 'ブランディング',
    description: 'ロゴ、カラー、言葉、トーンを整理し、らしさが伝わる形へ整えます。',
  },
  {
    title: 'Development',
    titleJa: '開発・実装',
    description: '表示速度、SEO、運用のしやすさまで考えて丁寧に実装します。',
  },
]

function MobileHomePage() {
  return (
    <div className="bg-transparent">
      <section className="min-h-[100svh] px-6 py-28 flex flex-col justify-center">
        <p className="type-label mb-6 text-muted-foreground">Small Creative Studio</p>
        <h1 className="type-display gradient-text text-[28vw] leading-[0.82]">
          JUNK<br />BRANDING
        </h1>
        <p className="type-section-title mt-8 text-2xl gradient-text">
          あなたの「らしさ」をカタチに。
        </p>
        <p className="type-body mt-6 text-base text-muted-foreground">
          茨城・東京・神奈川を中心に活動する、2人だけのブランディング&Web制作スタジオです。
        </p>
      </section>

      <section className="px-6 py-20 glass-light">
        <p className="type-eyebrow text-5xl text-foreground/45">About Us</p>
        <h2 className="type-section-title mt-6 text-3xl gradient-text">
          {homeAboutPreview.title}
        </h2>
        <p className="type-body mt-6 text-base text-muted-foreground">
          {homeAboutPreview.description}
        </p>
        <Link
          href={homeAboutPreview.href}
          className="cta-primary type-cta mt-10 inline-flex rounded-full px-7 py-4 text-sm"
        >
          {homeAboutPreview.cta}
        </Link>
      </section>

      <section className="px-6 py-20 glass-card">
        <p className="type-eyebrow text-5xl text-foreground/45">Services</p>
        <h2 className="type-section-title mt-6 text-3xl gradient-text">
          私たちにできること
        </h2>
        <div className="mt-10 space-y-5">
          {mobileServices.map((service) => (
            <article key={service.title} className="rounded-3xl bg-background/55 p-6 rainbow-border">
              <p className="type-eyebrow text-3xl text-foreground">{service.title}</p>
              <h3 className="type-card-title mt-2 text-lg text-primary">{service.titleJa}</h3>
              <p className="type-body-compact mt-4 text-sm text-muted-foreground">{service.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="px-6 py-20 glass-light">
        <p className="type-eyebrow text-5xl text-foreground/45">{homeWorksPreview.eyebrow}</p>
        <h2 className="type-section-title mt-6 text-3xl gradient-text">
          {homeWorksPreview.title}
        </h2>
        <p className="type-body mt-6 text-base text-muted-foreground">
          {homeWorksPreview.description}
        </p>
        <Link
          href={homeWorksPreview.href}
          className="cta-primary type-cta mt-10 inline-flex rounded-full px-7 py-4 text-sm"
        >
          {homeWorksPreview.cta}
        </Link>
      </section>

      <section className="px-6 py-20 glass-card">
        <p className="type-eyebrow text-5xl text-foreground/45">{homeArea.eyebrow}</p>
        <h2 className="type-section-title mt-6 text-3xl">{homeArea.title}</h2>
        <p className="type-hero-title mt-4 text-4xl gradient-text">{homeArea.area}</p>
        <p className="type-body mt-6 text-base text-muted-foreground">
          {homeArea.description}
        </p>
      </section>

      <section className="px-6 py-20 text-center glass-light">
        <p className="type-eyebrow text-5xl text-foreground/45">Contact</p>
        <h2 className="type-section-title mt-6 text-3xl gradient-text">
          まずは、お話しませんか？
        </h2>
        <p className="type-body mt-6 text-base text-muted-foreground">
          「こんなこと頼めるのかな？」という段階でも大丈夫。お気軽にご連絡ください。
        </p>
        <Link
          href="/contact"
          className="cta-primary type-cta mt-10 inline-flex rounded-full px-7 py-4 text-sm"
        >
          問い合わせる
        </Link>
      </section>

      <Footer />
    </div>
  )
}

export default function HomePageClient() {
  const [layoutMode, setLayoutMode] = useState<'desktop-inverted' | 'mobile-normal'>('desktop-inverted')
  const isDesktopInverted = layoutMode === 'desktop-inverted'

  useLayoutEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 768px)')
    const syncMode = () => {
      const shouldInvert = mediaQuery.matches
      setLayoutMode(shouldInvert ? 'desktop-inverted' : 'mobile-normal')
    }

    syncMode()
    mediaQuery.addEventListener('change', syncMode)
    return () => mediaQuery.removeEventListener('change', syncMode)
  }, [])

  if (isDesktopInverted) {
    return <HomeDesktopPage />
  }

  return (
    <MobileHomePage />
  )
}
