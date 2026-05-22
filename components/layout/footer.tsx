'use client'

import { ArrowUpRight, Phone, Mail, MapPin } from 'lucide-react'
import { RevealSection } from '@/components/motion/reveal-section'
import { MagneticButton } from '@/components/ui/magnetic-button'
import { TransitionLink } from '@/components/layout/transition-link'

const footerLinks = {
  navigation: [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/works', label: 'Works' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/contact', label: 'Contact' },
  ],
}

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative glass-card border-t border-border/20">
      {/* フッター本文 */}
      <div className="container mx-auto px-6 md:px-12 lg:px-16 py-16 md:py-20 lg:py-28">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12">
          {/* ブランド列 */}
          <RevealSection className="sm:col-span-2 lg:col-span-5" delay={0}>
            <TransitionLink 
              href="/"
              className="inline-block mb-6 lg:mb-8"
            >
              <span 
                id="footer-logo"
                className="font-display text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight transition-all duration-700"
              >
                JUNKBRANDING
              </span>
            </TransitionLink>
            <p className="type-body text-muted-foreground max-w-sm mb-10 lg:mb-12 text-sm md:text-base">
              小さなチームだからこそできる、丁寧なものづくり。お客様一人ひとりと向き合い、本当に必要なブランディングとWebデザインを提供します。
            </p>
            <MagneticButton
              href="/contact"
              className="group inline-flex items-center gap-4 text-foreground"
              data-cursor="Start"
            >
              <span className="type-cta text-sm">お問い合わせ</span>
              <span className="w-8 h-[1px] bg-foreground transition-all duration-300 group-hover:w-12 group-hover:bg-accent" />
            </MagneticButton>
          </RevealSection>

          {/* ナビゲーション列 */}
          <RevealSection className="lg:col-span-2" delay={0.1}>
            <h3 className="type-label text-muted-foreground mb-6 lg:mb-8">
              Menu
            </h3>
            <ul className="space-y-4">
              {footerLinks.navigation.map((link) => (
                <li key={link.href} className="overflow-hidden">
                  <TransitionLink
                    href={link.href}
                    className="type-cta block text-sm text-foreground/80 hover:text-foreground transition-all duration-300 hover:translate-x-1"
                  >
                    {link.label}
                  </TransitionLink>
                </li>
              ))}
            </ul>
          </RevealSection>

          {/* 連絡先列 */}
          <RevealSection className="lg:col-span-3" delay={0.2}>
            <h3 className="type-label text-muted-foreground mb-6 lg:mb-8">
              Contact
            </h3>
            <div className="space-y-4">
              <a 
                href="tel:08091550426"
                className="flex items-center gap-3 text-foreground hover:text-accent transition-colors duration-300"
              >
                <Phone size={16} className="text-accent" />
                <span className="type-readable-number">080-9155-0426</span>
              </a>
              <div className="flex items-center gap-3 text-foreground">
                <Mail size={16} className="text-accent" />
                <span>hello@junkbranding.com</span>
              </div>
            </div>
          </RevealSection>

          {/* 住所列 */}
          <RevealSection className="lg:col-span-2" delay={0.3}>
            <h3 className="type-label text-muted-foreground mb-6 lg:mb-8">
              Address
            </h3>
            <div className="flex items-start gap-3 text-foreground">
              <MapPin size={16} className="text-accent mt-1 shrink-0" />
              <div className="space-y-1 text-sm">
                <p className="whitespace-nowrap">〒300-0410</p>
                <p>茨城県稲敷郡美浦村</p>
                <p>みどり台767-43</p>
              </div>
            </div>
          </RevealSection>
        </div>
      </div>

      {/* 最下部バー */}
      <div className="border-t border-border/20">
        <div className="container mx-auto px-6 md:px-12 lg:px-16 py-6 md:py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="type-body-compact text-xs text-muted-foreground">
            &copy; {currentYear} JunkBranding. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-xs text-muted-foreground">
            <a
              href="https://lab.junkbranding.com/"
              target="_blank"
              rel="noreferrer"
              className="type-cta inline-flex items-center gap-1.5 hover:text-foreground transition-all duration-300"
              aria-label="Creative Dev Blog を新しいタブで開く"
            >
              <span>Creative Dev Blog</span>
              <ArrowUpRight size={12} aria-hidden="true" />
            </a>
            <TransitionLink 
              href="/privacy" 
              className="type-cta hover:text-foreground transition-all duration-300"
            >
              Privacy Policy
            </TransitionLink>
          </div>
        </div>
      </div>

      {/* 角の装飾 */}
      <div className="absolute top-8 left-8 w-8 h-8 border-l border-t border-border/30 pointer-events-none" />
      <div className="absolute top-8 right-8 w-8 h-8 border-r border-t border-border/30 pointer-events-none" />
    </footer>
  )
}
