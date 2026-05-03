'use client'

import { useState, useEffect } from 'react'
import { ArrowRight, Mail, Phone, MapPin, Clock, Send, CheckCircle, AlertCircle } from 'lucide-react'
import { SectionReveal } from '@/components/text-reveal'
import { MagneticButton } from '@/components/magnetic-button'
import { Footer } from '@/components/footer'
import { ScatterText } from '@/components/scatter-text'
import { sendEmail } from '@/actions/contact'
import type { ContactFormData, ContactFormErrors } from '@/types/contact-page'

// Service options
const serviceOptions = [
  'Webサイト制作',
  'ランディングページ制作',
  'ECサイト制作',
  'ブランディング',
  'ロゴデザイン',
  'その他',
]

// Budget options
const budgetOptions = [
  '〜30万円',
  '30万円〜50万円',
  '50万円〜100万円',
  '100万円〜',
  '未定・相談したい',
]

export default function ContactPageClient() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    company: '',
    phone: '',
    service: '',
    budget: '',
    message: '',
  })
  const [errors, setErrors] = useState<ContactFormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [formLoadTime] = useState(() => Date.now()) // ボット対策用タイムスタンプ

  useEffect(() => {
    if (isSubmitted) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [isSubmitted])

  const validateForm = (): boolean => {
    const newErrors: ContactFormErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'お名前を入力してください'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'メールアドレスを入力してください'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '正しいメールアドレスを入力してください'
    }

    if (!formData.message.trim()) {
      newErrors.message = 'お問い合わせ内容を入力してください'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)
    setSubmitError('')

    try {
      const form = new FormData(e.currentTarget)
      const res = await sendEmail(form)

      if (res?.error) {
        setSubmitError(res.error)
        return
      }

      setIsSubmitted(true)
    } catch {
      setSubmitError('送信に失敗しました。しばらく経ってから再度お試しください。')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name as keyof ContactFormData]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  if (isSubmitted) {
    return (
      <>
        <section className="min-h-[100svh] flex items-center justify-center pt-20 sm:pt-24">
          <div className="container mx-auto px-4 sm:px-6 md:px-12 py-16 sm:py-24 text-center">
            <SectionReveal>
              <div className="max-w-lg mx-auto">
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-6 sm:mb-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
                  送信完了しました。
                </h1>
                <p className="text-base sm:text-lg text-muted-foreground mb-8 sm:mb-10 leading-relaxed text-balance">
                  お問い合わせいただきありがとうございます。内容を確認の上、1営業日以内にご連絡いたします。
                </p>
                <MagneticButton
                  href="/"
                  className="cta-primary group rounded-full px-6 py-3.5 font-bold transition-all duration-300 sm:px-8 sm:py-4"
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
        <Footer />
      </>
    )
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[50svh] sm:min-h-[60svh] flex items-center justify-center">
        <div className="container mx-auto px-6 md:px-12 lg:px-16 py-32 md:py-40 text-center">
          <div className="mb-6 lg:mb-8">
            <ScatterText
              as="span"
              className="font-display text-[clamp(3rem,10vw,7rem)] leading-none tracking-tight text-foreground/50 block"
              scrollStart={50}
              scrollEnd={350}
              distance={500}
              style={{
                WebkitTextStroke: '1px currentColor',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Contact
            </ScatterText>
          </div>
          <ScatterText
            as="h1"
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 lg:mb-8"
            scrollStart={50}
            scrollEnd={350}
            distance={400}
            gradient
          >
            お問い合わせ
          </ScatterText>
          <ScatterText
            as="p"
            className="text-base md:text-lg text-muted-foreground max-w-lg mx-auto leading-[1.8] tracking-wide"
            scrollStart={50}
            scrollEnd={350}
            distance={300}
          >
            プロジェクトのご相談、お見積りなど、お気軽にお問い合わせください。
          </ScatterText>
        </div>
      </section>

      {/* Contact Info & Form */}
      <section className="py-32 md:py-40 lg:py-56 glass-light">
        <div className="container mx-auto px-6 md:px-12 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 lg:gap-20">
            {/* Contact Info */}
            <SectionReveal className="lg:col-span-1">
              <div className="space-y-10 lg:space-y-12">
                <div>
                  <h2 className="text-lg md:text-xl font-bold mb-4 tracking-tight">お問い合わせ先</h2>
                  <p className="text-sm text-muted-foreground leading-[1.8] tracking-wide">
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
                      <p className="text-xs text-muted-foreground tracking-widest uppercase font-medium">
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
                      <p className="text-xs text-muted-foreground tracking-widest uppercase font-medium">
                        Phone
                      </p>
                      <p className="text-sm font-medium group-hover:text-foreground transition-colors">080-9155-0426</p>
                    </div>
                  </a>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center shrink-0">
                      <MapPin size={16} className="text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground tracking-widest uppercase font-medium">
                        Address
                      </p>
                      <p className="text-sm font-medium">〒300-0410</p>
                      <p className="text-xs text-muted-foreground tracking-wide">茨城県稲敷郡美浦村みどり台767-43</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center">
                      <Clock size={16} className="text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground tracking-widest uppercase font-medium">
                        Business Hours
                      </p>
                      <p className="text-sm font-medium">平日 10:00 - 18:00</p>
                    </div>
                  </div>
                </div>
              </div>
            </SectionReveal>

            {/* Contact Form */}
            <SectionReveal delay={0.1} className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6 lg:space-y-8">
                {/* ハニーポット（スパム対策） - CSSで非表示 */}
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
                {/* タイムスタンプ（ボット対策） */}
                <input type="hidden" name="timestamp" value={formLoadTime.toString()} />
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 lg:gap-6">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-xs font-medium mb-2 tracking-wide">
                      お名前 <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-3.5 rounded-xl bg-card border text-sm ${errors.name ? 'border-destructive' : 'border-border/20'} focus:border-foreground/30 focus:outline-none transition-colors`}
                      placeholder="山田 太郎"
                    />
                    {errors.name && (
                      <p className="mt-2 text-xs text-destructive flex items-center gap-1">
                        <AlertCircle size={12} />
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-xs font-medium mb-2 tracking-wide">
                      メールアドレス <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-3.5 rounded-xl bg-card border text-sm ${errors.email ? 'border-destructive' : 'border-border/20'} focus:border-foreground/30 focus:outline-none transition-colors`}
                      placeholder="example@email.com"
                    />
                    {errors.email && (
                      <p className="mt-2 text-xs text-destructive flex items-center gap-1">
                        <AlertCircle size={12} />
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Company */}
                  <div>
                    <label htmlFor="company" className="block text-xs font-medium mb-2 tracking-wide">
                      会社名・屋号
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-4 py-3.5 rounded-xl bg-card border border-border/20 text-sm focus:border-foreground/30 focus:outline-none transition-colors"
                      placeholder="株式会社〇〇"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label htmlFor="phone" className="block text-xs font-medium mb-2 tracking-wide">
                      電話番号
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3.5 rounded-xl bg-card border border-border/20 text-sm focus:border-foreground/30 focus:outline-none transition-colors"
                      placeholder="090-0000-0000"
                    />
                  </div>

                  {/* Service */}
                  <div>
                    <label htmlFor="service" className="block text-xs font-medium mb-2 tracking-wide">
                      ご依頼内容
                    </label>
                    <select
                      id="service"
                      name="service"
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

                  {/* Budget */}
                  <div>
                    <label htmlFor="budget" className="block text-xs font-medium mb-2 tracking-wide">
                      ご予算
                    </label>
                    <select
                      id="budget"
                      name="budget"
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

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-xs font-medium mb-2 tracking-wide">
                    お問い合わせ内容 <span className="text-destructive">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className={`w-full px-4 py-3.5 rounded-xl bg-card border text-sm ${errors.message ? 'border-destructive' : 'border-border/20'} focus:border-foreground/30 focus:outline-none transition-colors resize-none`}
                    placeholder="プロジェクトの概要や、ご相談内容をご記入ください。"
                  />
                  {errors.message && (
                    <p className="mt-2 text-xs text-destructive flex items-center gap-1">
                      <AlertCircle size={12} />
                      {errors.message}
                    </p>
                  )}
                </div>

                {submitError && (
                  <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs">
                    {submitError}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="cta-primary flex w-full items-center justify-center gap-4 rounded-full px-8 py-4 text-sm font-bold tracking-widest uppercase transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                >
                  {isSubmitting ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      送信中...
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      送信する
                    </>
                  )}
                </button>
              </form>
            </SectionReveal>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
