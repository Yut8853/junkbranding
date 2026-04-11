'use client'

import { useState, useEffect } from 'react'
import { ArrowRight, Mail, Phone, MapPin, Clock, Send, CheckCircle, AlertCircle } from 'lucide-react'
import { TextReveal, SectionReveal, LineReveal } from '@/components/text-reveal'
import { MagneticButton } from '@/components/magnetic-button'
import { Footer } from '@/components/footer'
import { sendEmail } from '@/actions/contact'

// Form field types
type FormData = {
  name: string
  email: string
  company: string
  phone: string
  service: string
  budget: string
  message: string
}

type FormErrors = Partial<Record<keyof FormData, string>>

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

export default function ContactPage() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    company: '',
    phone: '',
    service: '',
    budget: '',
    message: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState('')

  useEffect(() => {
    if (isSubmitted) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [isSubmitted])

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

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
    if (errors[name as keyof FormData]) {
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
                  className="group px-6 sm:px-8 py-3.5 sm:py-4 bg-foreground text-background rounded-full font-medium btn-gradient-hover transition-all duration-300"
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
        <div className="container mx-auto px-4 sm:px-6 md:px-12 py-24 sm:py-32 text-center">
          <LineReveal delay={0}>
            <p className="text-xs sm:text-sm uppercase tracking-[0.2em] sm:tracking-[0.3em] text-primary mb-4 sm:mb-6">
              Contact
            </p>
          </LineReveal>
          <TextReveal
            text="お問い合わせ"
            as="h1"
            className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold tracking-tight mb-6 sm:mb-8"
            delay={0.2}
            gradient
          />
          <LineReveal delay={0.6}>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed text-balance">
              プロジェクトのご相談、お見積りなど、お気軽にお問い合わせください。
            </p>
          </LineReveal>
        </div>
      </section>

      {/* Contact Info & Form */}
      <section className="py-16 sm:py-24 md:py-32 glass-light">
        <div className="container mx-auto px-4 sm:px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 md:gap-16">
            {/* Contact Info */}
            <SectionReveal className="lg:col-span-1">
              <div className="space-y-8 sm:space-y-10">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">お問い合わせ先</h2>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed text-pretty">
                    フォームまたはお電話にてお気軽にご連絡ください。1営業日以内にご返信いたします。
                  </p>
                </div>

                <div className="space-y-4 sm:space-y-6">
                  <a 
                    href="mailto:hello@junkbranding.com"
                    className="flex items-center gap-3 sm:gap-4 group"
                  >
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-card border border-border flex items-center justify-center group-hover:border-primary transition-colors">
                      <Mail size={18} className="text-muted-foreground group-hover:text-primary transition-colors sm:w-5 sm:h-5" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-muted-foreground">Email</p>
                      <p className="text-sm sm:text-base font-medium group-hover:text-primary transition-colors">hello@junkbranding.com</p>
                    </div>
                  </a>

                  <a 
                    href="tel:08091550426"
                    className="flex items-center gap-3 sm:gap-4 group"
                  >
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-card border border-border flex items-center justify-center group-hover:border-primary transition-colors">
                      <Phone size={18} className="text-muted-foreground group-hover:text-primary transition-colors sm:w-5 sm:h-5" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-muted-foreground">Phone</p>
                      <p className="text-sm sm:text-base font-medium group-hover:text-primary transition-colors">080-9155-0426</p>
                    </div>
                  </a>

                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-card border border-border flex items-center justify-center shrink-0">
                      <MapPin size={18} className="text-muted-foreground sm:w-5 sm:h-5" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-muted-foreground">Address</p>
                      <p className="text-sm sm:text-base font-medium">〒300-0410</p>
                      <p className="text-sm text-muted-foreground">茨城県稲敷郡美浦村みどり台767-43</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-card border border-border flex items-center justify-center">
                      <Clock size={18} className="text-muted-foreground sm:w-5 sm:h-5" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-muted-foreground">Business Hours</p>
                      <p className="text-sm sm:text-base font-medium">平日 10:00 - 18:00</p>
                    </div>
                  </div>
                </div>
              </div>
            </SectionReveal>

            {/* Contact Form */}
            <SectionReveal delay={0.2} className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">
                      お名前 <span className="text-primary">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg bg-card border ${errors.name ? 'border-destructive' : 'border-border'} focus:border-primary focus:outline-none transition-colors`}
                      placeholder="山田 太郎"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-destructive flex items-center gap-1">
                        <AlertCircle size={14} />
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      メールアドレス <span className="text-primary">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg bg-card border ${errors.email ? 'border-destructive' : 'border-border'} focus:border-primary focus:outline-none transition-colors`}
                      placeholder="example@email.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-destructive flex items-center gap-1">
                        <AlertCircle size={14} />
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Company */}
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium mb-2">
                      会社名・屋号
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-card border border-border focus:border-primary focus:outline-none transition-colors"
                      placeholder="株式会社〇〇"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium mb-2">
                      電話番号
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-card border border-border focus:border-primary focus:outline-none transition-colors"
                      placeholder="090-0000-0000"
                    />
                  </div>

                  {/* Service */}
                  <div>
                    <label htmlFor="service" className="block text-sm font-medium mb-2">
                      ご依頼内容
                    </label>
                    <select
                      id="service"
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-card border border-border focus:border-primary focus:outline-none transition-colors appearance-none"
                    >
                      <option value="">選択してください</option>
                      {serviceOptions.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>

                  {/* Budget */}
                  <div>
                    <label htmlFor="budget" className="block text-sm font-medium mb-2">
                      ご予算
                    </label>
                    <select
                      id="budget"
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-card border border-border focus:border-primary focus:outline-none transition-colors appearance-none"
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
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    お問い合わせ内容 <span className="text-primary">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className={`w-full px-4 py-3 rounded-lg bg-card border ${errors.message ? 'border-destructive' : 'border-border'} focus:border-primary focus:outline-none transition-colors resize-none`}
                    placeholder="プロジェクトの概要や、ご相談内容をご記入��ださい。"
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-destructive flex items-center gap-1">
                      <AlertCircle size={14} />
                      {errors.message}
                    </p>
                  )}
                </div>

                {submitError && (
                  <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                    {submitError}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-8 sm:px-10 py-3.5 sm:py-4 bg-foreground text-background rounded-full font-medium btn-gradient-hover transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
                      送信中...
                    </>
                  ) : (
                    <>
                      <Send size={18} />
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
