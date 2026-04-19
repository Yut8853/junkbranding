'use client'

import Link from 'next/link'
import { Phone, Mail, MapPin } from 'lucide-react'
import { RevealSection } from './reveal-section'
import { HorizontalScrollText } from './horizontal-scroll-text'
import { MagneticButton } from './magnetic-button'

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
    <footer className="relative glass-card border-t border-border/30">
      {/* Marquee */}
      <div className="py-12 md:py-16 border-b border-border/50 overflow-hidden">
        <HorizontalScrollText
          text="Let&apos;s create something extraordinary together"
          className="text-6xl md:text-8xl lg:text-9xl font-black tracking-[-0.03em] text-foreground/10 font-display uppercase english-stroke hover:text-foreground/30 transition-all duration-700"
          speed={40}
        />
      </div>

      {/* Main footer content */}
      <div className="container mx-auto px-6 md:px-12 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
          {/* Brand column */}
          <RevealSection className="md:col-span-5" delay={0}>
            <Link 
              href="/"
              className="inline-block mb-6"
            >
              <span className="text-4xl md:text-5xl font-bold tracking-tighter font-display">
                JunkBranding
              </span>
            </Link>
            <p className="text-muted-foreground leading-relaxed max-w-sm mb-8 text-pretty">
              小さなチームだからこそできる、丁寧なものづくり。お客様一人ひとりと向き合い、本当に必要なブランディングとWebデザインを提供します。
            </p>
            <MagneticButton
              href="/contact"
              className="group inline-flex items-center gap-3 text-foreground"
              data-cursor="Start"
            >
              <span className="text-sm uppercase tracking-wider">お問い合わせ</span>
              <span className="w-8 h-[1px] bg-foreground transition-all duration-300 group-hover:w-12 group-hover:bg-accent" />
            </MagneticButton>
          </RevealSection>

          {/* Navigation column */}
          <RevealSection className="md:col-span-2" delay={0.1}>
            <h3 className="text-sm uppercase tracking-[0.2em] text-primary/70 mb-6 font-display font-semibold">
              Menu
            </h3>
            <ul className="space-y-4">
              {footerLinks.navigation.map((link) => (
                <li key={link.href} className="overflow-hidden">
                  <Link
                    href={link.href}
                    className="block text-base font-display font-semibold text-foreground hover:text-primary transition-all duration-500 uppercase tracking-wider hover:translate-x-2"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </RevealSection>

          {/* Contact column */}
          <RevealSection className="md:col-span-3" delay={0.2}>
            <h3 className="text-sm uppercase tracking-[0.2em] text-primary/70 mb-6 font-display font-semibold">
              Contact
            </h3>
            <div className="space-y-4">
              <a 
                href="tel:08091550426"
                className="flex items-center gap-3 text-foreground hover:text-accent transition-colors duration-300"
              >
                <Phone size={16} className="text-accent" />
                <span>080-9155-0426</span>
              </a>
              <a 
                href="mailto:hello@junkbranding.com"
                className="flex items-center gap-3 text-foreground hover:text-accent transition-colors duration-300"
              >
                <Mail size={16} className="text-accent" />
                <span>hello@junkbranding.com</span>
              </a>
            </div>
          </RevealSection>

          {/* Address column */}
          <RevealSection className="md:col-span-2" delay={0.3}>
            <h3 className="text-sm uppercase tracking-[0.2em] text-primary/70 mb-6 font-display font-semibold">
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

      {/* Bottom bar */}
      <div className="border-t border-border/50">
        <div className="container mx-auto px-6 md:px-12 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} JunkBranding. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link 
              href="/privacy" 
              className="hover:text-foreground transition-all duration-300 font-display font-medium uppercase tracking-wider"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>

      {/* Decorative corner elements */}
      <div className="absolute top-8 left-8 w-8 h-8 border-l border-t border-border/30 pointer-events-none" />
      <div className="absolute top-8 right-8 w-8 h-8 border-r border-t border-border/30 pointer-events-none" />
    </footer>
  )
}
