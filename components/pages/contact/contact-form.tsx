import { AlertCircle, Send } from 'lucide-react'
import { SectionReveal } from '@/components/motion/text-reveal'
import type { ContactFormProps } from '@/types/contact-page'

export function ContactForm({
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
