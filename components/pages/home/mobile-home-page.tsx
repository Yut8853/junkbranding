import Link from 'next/link'
import { Footer } from '@/components/layout/footer'
import { homeAboutPreview, homeArea, homeWorksPreview } from '@/content/home-page'

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

export function MobileHomePage() {
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
        
        {/* 実績ピックアップ */}
        <div className="mt-8 space-y-4">
          {[
            { title: 'TO PLACE', category: 'コーポレートサイト', year: '2024', url: 'https://to-place.co.jp/' },
            { title: 'LUZ REAL', category: 'コーポレートサイト', year: '2025', url: 'https://luz-real.com/' },
          ].map((work) => (
            <Link
              key={work.title}
              href={work.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-5 rounded-2xl bg-background/50 border border-foreground/10 active:scale-[0.98] transition-transform"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="type-label text-xs text-primary/80 mb-1">{work.category}</p>
                  <p className="type-eyebrow text-2xl">{work.title}</p>
                </div>
                <span className="type-mono text-xs text-muted-foreground/60">{work.year}</span>
              </div>
            </Link>
          ))}
        </div>
        
        <Link
          href={homeWorksPreview.href}
          className="cta-primary type-cta mt-8 inline-flex rounded-full px-7 py-4 text-sm"
        >
          {homeWorksPreview.cta}
        </Link>
      </section>

      <section className="px-6 py-20 glass-card relative overflow-hidden">
        {/* 背景マーキー */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
          <div className="flex whitespace-nowrap">
            <div
              className="flex"
              style={{
                animation: 'marquee-left 20s linear infinite',
              }}
            >
              {Array.from({ length: 4 }).map((_, i) => (
                <span
                  key={i}
                  className="type-display font-bold text-[8rem] mx-6 select-none"
                  style={{
                    WebkitTextStroke: '1px oklch(0.75 0.12 300 / 0.12)',
                    WebkitTextFillColor: 'transparent',
                    lineHeight: 1,
                  }}
                >
                  NATIONWIDE
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="relative z-10">
          <p className="type-eyebrow text-5xl text-foreground/45">{homeArea.eyebrow}</p>
          <h2 className="type-section-title mt-6 text-3xl">{homeArea.title}</h2>
          <p className="type-hero-title mt-4 text-4xl gradient-text">{homeArea.area}</p>
          <p className="type-body mt-6 text-base text-muted-foreground">
            {homeArea.description}
          </p>
        </div>
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
