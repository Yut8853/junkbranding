'use client'

import { useEffect, useRef, useState } from 'react'
import { AlertCircle, ArrowRight, CheckCircle, Clock, Mail, MapPin, Phone, Send } from 'lucide-react'
import { MagneticButton } from '@/components/magnetic-button'
import { ScatterText } from '@/components/scatter-text'
import { SectionReveal } from '@/components/text-reveal'
import { useIsMobile } from '@/hooks/use-mobile'
import type { ContactFormProps } from '@/types/contact-page'

export function ContactSuccessSection() {
  return (
    <section className="min-h-[100svh] flex items-center justify-center pt-20 sm:pt-24">
      <div className="container mx-auto px-4 sm:px-6 md:px-12 py-16 sm:py-24 text-center">
        <SectionReveal>
          <div className="max-w-lg mx-auto">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-6 sm:mb-8 rounded-full bg-primary/10 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
            </div>
            <h1 className="type-hero-title text-3xl sm:text-4xl md:text-5xl mb-4 sm:mb-6">
              送信完了しました。
            </h1>
            <p className="type-body text-base sm:text-lg text-muted-foreground mb-8 sm:mb-10 text-balance">
              お問い合わせいただきありがとうございます。内容を確認の上、1営業日以内にご連絡いたします。
            </p>
            <MagneticButton
              href="/"
              className="cta-primary type-cta group rounded-full px-6 py-3.5 transition-all duration-300 sm:px-8 sm:py-4"
            >
              <span className="flex items-center gap-3">
                トップに戻る
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </MagneticButton>
          </div>
        </SectionReveal>
      </div>
    </section>
  )
}

export function ContactHeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [heroScatterProgress, setHeroScatterProgress] = useState(0)
  const isMobile = useIsMobile()

  useEffect(() => {
    if (!containerRef.current || isMobile) return

    let rafId: number | null = null
    let lastScrollProgress = -1

    const handleScroll = () => {
      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect) return

      const scrollProgress = Math.min(Math.max(-rect.top, 0) / 400, 1)
      if (Math.abs(scrollProgress - lastScrollProgress) < 0.01) return
      lastScrollProgress = scrollProgress
      setHeroScatterProgress(scrollProgress)
    }

    const handleScrollRaf = () => {
      if (rafId) return
      rafId = requestAnimationFrame(() => {
        rafId = null
        handleScroll()
      })
    }

    window.addEventListener('scroll', handleScrollRaf, { passive: true })
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScrollRaf)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [isMobile])

  return (
    <section
      ref={containerRef}
      className="relative min-h-[100svh] flex items-center justify-center overflow-hidden"
    >
      {/* Background giant text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.03]">
        <span className="type-display text-[50vw] whitespace-nowrap">
          CONTACT
        </span>
      </div>

      {/* Marquee decoration */}
      <div className="absolute inset-0 flex flex-col justify-center pointer-events-none select-none overflow-hidden opacity-[0.04]">
        <div className="flex whitespace-nowrap animate-marquee-slow">
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={`marquee-1-${i}`} className="type-display text-[8vw] mx-8 marquee-stroke">
              CONTACT
            </span>
          ))}
        </div>
        <div className="flex whitespace-nowrap animate-marquee-slow-reverse mt-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={`marquee-2-${i}`} className="type-display text-[8vw] mx-8 marquee-stroke">
              GET IN TOUCH
            </span>
          ))}
        </div>
      </div>

      <div className="container relative z-10 mx-auto px-6 md:px-12 lg:px-16 text-center">
        <div className="overflow-visible">
          <ScatterText
            as="h1"
            className="type-display text-[12vw] md:text-[10vw] lg:text-[8vw] leading-[0.9] tracking-[-0.04em]"
            distance={900}
            gradient
            scatterProgress={heroScatterProgress}
            deferUntilActive
          >
            CONTACT
          </ScatterText>
        </div>

        <div className="overflow-visible mt-12">
          <ScatterText
            as="p"
            className="type-body text-lg md:text-xl text-muted-foreground max-w-lg mx-auto"
            distance={400}
            scatterProgress={heroScatterProgress}
            deferUntilActive
          >
            プロジェクトのご相談、お見積りなど、お気軽にお問い合わせください。
          </ScatterText>
        </div>
      </div>

      {/* Scroll indicator */}
      <div 
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
        style={{ opacity: 1 - heroScatterProgress }}
      >
        <span className="type-label text-muted-foreground text-xs">Scroll to explore</span>
        <div className="w-px h-16 bg-gradient-to-b from-foreground/40 to-transparent animate-pulse" />
      </div>
    </section>
  )
}

export function ContactInfoAndFormSection(props: ContactFormProps) {
  return (
    <section className="py-32 md:py-40 lg:py-56 glass-light">
      <div className="container mx-auto px-6 md:px-12 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 lg:gap-20">
          <ContactInfoSection />
          <ContactForm {...props} />
        </div>
      </div>
    </section>
  )
}

function ContactInfoSection() {
  return (
    <SectionReveal className="lg:col-span-1">
      <div className="space-y-10 lg:space-y-12">
        <div>
          <h2 className="type-card-title text-lg md:text-xl mb-4">お問い合わせ先</h2>
          <p className="type-body-compact text-sm text-muted-foreground">
            フォームまたはお電話にてお気軽にご連絡ください。1営業日以内にご返信いたします。
          </p>
        </div>

        <div className="space-y-6">
          <a
            href="mailto:hello@junkbranding.com"
            className="flex items-center gap-4 group"
          >
            <div className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center group-hover:bg-foreground/10 transition-colors">
              <Mail size={16} className="text-muted-foreground" />
            </div>
            <div>
              <p className="type-label text-muted-foreground">
                Email
              </p>
              <p className="text-sm font-medium group-hover:text-foreground transition-colors">hello@junkbranding.com</p>
            </div>
          </a>

          <a
            href="tel:08091550426"
            className="flex items-center gap-4 group"
          >
            <div className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center group-hover:bg-foreground/10 transition-colors">
              <Phone size={16} className="text-muted-foreground" />
            </div>
            <div>
              <p className="type-label text-muted-foreground">
                Phone
              </p>
              <p className="type-readable-number text-sm group-hover:text-foreground transition-colors">080-9155-0426</p>
            </div>
          </a>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center shrink-0">
              <MapPin size={16} className="text-muted-foreground" />
            </div>
            <div>
              <p className="type-label text-muted-foreground">
                Address
              </p>
              <p className="text-sm font-medium">〒300-0410</p>
              <p className="type-body-compact text-xs text-muted-foreground">茨城県稲敷郡美浦村みどり台767-43</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center">
              <Clock size={16} className="text-muted-foreground" />
            </div>
            <div>
              <p className="type-label text-muted-foreground">
                Business Hours
              </p>
              <p className="text-sm font-medium">平日 10:00 - 18:00</p>
            </div>
          </div>
        </div>
      </div>
    </SectionReveal>
  )
}

function ContactForm({
  budgetOptions,
  errors,
  formData,
  formLoadTime,
  handleChange,
  handleSubmit,
  isSubmitting,
  serviceOptions,
  submitError,
}: ContactFormProps) {
  return (
    <SectionReveal delay={0.1} className="lg:col-span-2">
      <form
        onSubmit={handleSubmit}
        className="space-y-6 lg:space-y-8"
        aria-label="お問い合わせフォーム"
        aria-describedby="contact-form-description contact-form-status"
        noValidate
      >
        <p id="contact-form-description" className="sr-only">
          必須項目はお名前、メールアドレス、お問い合わせ内容です。
        </p>
        <div id="contact-form-status" className="sr-only" role="status" aria-live="polite">
          {isSubmitting ? 'お問い合わせを送信しています。' : 'お問い合わせフォームを入力できます。'}
        </div>
        <div className="absolute -left-[9999px] opacity-0 pointer-events-none" aria-hidden="true">
          <label htmlFor="honeypot">このフィールドは空のままにしてください</label>
          <input
            type="text"
            id="honeypot"
            name="honeypot"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>
        <input type="hidden" name="timestamp" value={formLoadTime.toString()} />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 lg:gap-6">
          <div>
            <label htmlFor="name" className="type-label block text-foreground/80 mb-2">
              お名前 <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              autoComplete="name"
              required
              aria-required="true"
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? 'name-error' : undefined}
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-3.5 rounded-xl bg-card border text-sm ${errors.name ? 'border-destructive' : 'border-border/20'} focus:border-foreground/30 focus:outline-none transition-colors`}
              placeholder="山田 太郎"
            />
            {errors.name && (
              <p id="name-error" className="mt-2 text-xs text-destructive flex items-center gap-1" role="alert">
                <AlertCircle size={12} aria-hidden="true" />
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="type-label block text-foreground/80 mb-2">
              メールアドレス <span className="text-destructive">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              autoComplete="email"
              required
              aria-required="true"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'email-error' : undefined}
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-3.5 rounded-xl bg-card border text-sm ${errors.email ? 'border-destructive' : 'border-border/20'} focus:border-foreground/30 focus:outline-none transition-colors`}
              placeholder="example@email.com"
            />
            {errors.email && (
              <p id="email-error" className="mt-2 text-xs text-destructive flex items-center gap-1" role="alert">
                <AlertCircle size={12} aria-hidden="true" />
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="company" className="type-label block text-foreground/80 mb-2">
              会社名・屋号
            </label>
            <input
              type="text"
              id="company"
              name="company"
              autoComplete="organization"
              value={formData.company}
              onChange={handleChange}
              className="w-full px-4 py-3.5 rounded-xl bg-card border border-border/20 text-sm focus:border-foreground/30 focus:outline-none transition-colors"
              placeholder="株式会社〇〇"
            />
          </div>

          <div>
            <label htmlFor="phone" className="type-label block text-foreground/80 mb-2">
              電話番号
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              autoComplete="tel"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3.5 rounded-xl bg-card border border-border/20 text-sm focus:border-foreground/30 focus:outline-none transition-colors"
              placeholder="090-0000-0000"
            />
          </div>

          <div>
            <label htmlFor="service" className="type-label block text-foreground/80 mb-2">
              ご依頼内容
            </label>
            <select
              id="service"
              name="service"
              aria-label="ご依頼内容"
              value={formData.service}
              onChange={handleChange}
              className="w-full px-4 py-3.5 rounded-xl bg-card border border-border/20 text-sm focus:border-foreground/30 focus:outline-none transition-colors appearance-none"
            >
              <option value="">選択してください</option>
              {serviceOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="budget" className="type-label block text-foreground/80 mb-2">
              ご予算
            </label>
            <select
              id="budget"
              name="budget"
              aria-label="ご予算"
              value={formData.budget}
              onChange={handleChange}
              className="w-full px-4 py-3.5 rounded-xl bg-card border border-border/20 text-sm focus:border-foreground/30 focus:outline-none transition-colors appearance-none"
            >
              <option value="">選択してください</option>
              {budgetOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="message" className="type-label block text-foreground/80 mb-2">
            お問い合わせ内容 <span className="text-destructive">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            required
            aria-required="true"
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? 'message-error' : undefined}
            value={formData.message}
            onChange={handleChange}
            rows={6}
            className={`w-full px-4 py-3.5 rounded-xl bg-card border text-sm ${errors.message ? 'border-destructive' : 'border-border/20'} focus:border-foreground/30 focus:outline-none transition-colors resize-none`}
            placeholder="プロジェクトの概要や、ご相談内容をご記入ください。"
          />
          {errors.message && (
            <p id="message-error" className="mt-2 text-xs text-destructive flex items-center gap-1" role="alert">
              <AlertCircle size={12} aria-hidden="true" />
              {errors.message}
            </p>
          )}
        </div>

        {submitError && (
          <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs" role="alert" aria-live="assertive">
            {submitError}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          aria-busy={isSubmitting}
          aria-disabled={isSubmitting}
          className="cta-primary type-cta flex w-full items-center justify-center gap-4 rounded-full px-8 py-4 text-sm transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
        >
          {isSubmitting ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" aria-hidden="true" />
              送信中...
            </>
          ) : (
            <>
              <Send size={16} aria-hidden="true" />
              送信する
            </>
          )}
        </button>
      </form>
    </SectionReveal>
  )
}
